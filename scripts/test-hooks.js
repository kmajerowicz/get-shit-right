'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path'); const os = require('os');
const { execFileSync } = require('child_process');
const { discover } = require('../gsr/lib/project');
const { directory } = require('../gsr/lib/evidence');
const HOOKS = path.resolve(__dirname, '../gsr/hooks');
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-hook-'));
  const config = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-claude-'));
  fs.mkdirSync(path.join(root, 'docs')); fs.writeFileSync(path.join(root, 'docs/STATE.md'), '# Fixture Project');
  const run = (script, input = {}) => execFileSync(process.execPath, [path.join(HOOKS, script)], { input: JSON.stringify({ cwd: root, ...input }), encoding: 'utf8', env: { ...process.env, CLAUDE_CONFIG_DIR: config } });
  try { fn(root, run); } finally { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(config, { recursive: true, force: true }); }
}
test('session-start uses shared discovery; legacy STATE renders; ordinary directory gets banner', () => fixture((root, run) => {
  assert.match(run('session-start'), /Current project state:[\s\S]*Fixture Project/);
  fs.renameSync(path.join(root, 'docs'), path.join(root, '.ai')); fs.mkdirSync(path.join(root, 'src'));
  assert.match(run('session-start', { cwd: path.join(root, 'src') }), /Fixture Project/);
  fs.rmSync(path.join(root, '.ai'), { recursive: true }); fs.writeFileSync(path.join(root, 'CLAUDE.md'), 'GSR');
  assert.match(run('session-start'), /GSR \(Get Shit Right\) is available/);
}));
test('commit hook supported schema injects context without permission question', () => fixture((root, run) => {
  const out = JSON.parse(run('gsr-gate-guard.js', { tool_name: 'Bash', tool_input: { command: 'git commit -m "x"' } }));
  assert.deepEqual(Object.keys(out), ['hookSpecificOutput']);
  assert.equal(out.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(typeof out.hookSpecificOutput.additionalContext, 'string');
  assert.equal(out.hookSpecificOutput.permissionDecision, undefined);
  assert.match(out.hookSpecificOutput.additionalContext, /unverified/);
  assert.equal(run('gsr-gate-guard.js', { tool_input: { command: 'git status' } }), '');
}));
test('fake commands, tool success and completion prose cannot create evidence or Stop retries', () => fixture((root, run) => {
  const base = directory(discover(root));
  for (const command of ['echo "npm run build"', 'npm run build || true', 'pytest']) run('gsr-gate-tracker.js', { session_id: 'fake', tool_name: 'Bash', tool_input: { command }, tool_response: { success: true } });
  assert.equal(fs.existsSync(base), false);
  assert.equal(run('gsr-redflag-guard.js', { last_assistant_message: '✅ npm run build → success. It works. should work' }), '');
  const hooks = JSON.parse(fs.readFileSync(path.join(HOOKS, 'hooks.json')));
  assert.equal(hooks.hooks.Stop, undefined);
  assert.equal(hooks.hooks.PostToolUse[0].hooks.some(h => /gate-tracker/.test(h.command)), false);
}));
test('session-start invalid configuration is diagnostic and never executes checks', () => fixture((root, run) => {
  const marker = path.join(root, 'should-not-exist');
  fs.writeFileSync(path.join(root, '.gsr.json'), JSON.stringify({ schemaVersion: 1, checks: [{ id: 'test', argv: [process.execPath, '-e', `require('fs').writeFileSync(${JSON.stringify(marker)}, 'bad')`], kind: 'test' }] }));
  run('session-start'); assert.equal(fs.existsSync(marker), false);
  fs.writeFileSync(path.join(root, '.gsr.json'), '{bad'); assert.match(run('session-start'), /Invalid .gsr.json/);
}));
