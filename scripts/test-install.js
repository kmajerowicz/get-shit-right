'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const hooks = path.resolve(__dirname, '../gsr/hooks');
function fixture(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-install-'));
  const run = (script, input = '{}') => spawnSync(process.execPath, [path.join(hooks, script)], { input, encoding: 'utf8', env: { ...process.env, CLAUDE_CONFIG_DIR: dir } });
  try { fn(dir, run); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}
test('installed copy executes, preserves settings, repairs old stamp and refreshes idempotently', () => fixture((dir, run) => {
  const settings = { custom: { keep: true }, statusLine: { type: 'command', command: 'my-custom-status' } };
  fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(settings));
  assert.equal(run('install.js').status, 0);
  const dst = path.join(dir, 'hooks/gsr-statusline.js');
  const valid = fs.readFileSync(dst, 'utf8');
  assert.match(valid, /^#![^\n]+\n\/\/ gsr-hook-version:/);
  assert.equal(spawnSync(process.execPath, ['--check', dst]).status, 0);
  assert.equal(spawnSync(process.execPath, [dst], { input: JSON.stringify({ model: { display_name: 'Test' }, context_window: { used_percentage: 25 }, workspace: { current_dir: dir } }) }).status, 0);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(dir, 'settings.json'))), settings);
  assert.equal(run('install.js').status, 0);
  assert.equal(fs.readFileSync(dst, 'utf8'), valid);
  const lines = valid.split('\n');
  fs.writeFileSync(dst, [lines[1], lines[0], ...lines.slice(2)].join('\n'));
  assert.equal(run('session-start').status, 0);
  assert.equal(fs.readFileSync(dst, 'utf8'), valid);
  fs.writeFileSync(dst, valid.replace(/gsr-hook-version: .+/, 'gsr-hook-version: 0.0.1'));
  assert.equal(run('session-start').status, 0);
  assert.equal(fs.readFileSync(dst, 'utf8'), valid);
}));
test('invalid settings fail without changing settings or installed copy', () => fixture((dir, run) => {
  const settings = path.join(dir, 'settings.json');
  for (const invalid of ['{broken', 'null', '[]']) {
    fs.writeFileSync(settings, invalid);
    assert.notEqual(run('install.js').status, 0);
    assert.equal(fs.readFileSync(settings, 'utf8'), invalid);
    assert.equal(fs.existsSync(path.join(dir, 'hooks/gsr-statusline.js')), false);
  }
}));
