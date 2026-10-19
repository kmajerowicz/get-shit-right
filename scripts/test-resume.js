'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path'); const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const { discover } = require('../gsr/lib/project');
const evidence = require('../gsr/lib/evidence');
const { activeTask, referencePath } = require('../gsr/lib/task-context');
const ROOT = path.resolve(__dirname, '..');
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-resume-')); const claude = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-config-'));
  const write = (file, content) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), content); };
  const hook = input => execFileSync(process.execPath, [path.join(ROOT, 'gsr/hooks/session-start')], { input: JSON.stringify({ cwd: root, ...input }), encoding: 'utf8', env: { ...process.env, CLAUDE_CONFIG_DIR: claude } });
  write('.ai/STATE.md', '# Legacy project\n');
  try { fn(root, write, hook); } finally { fs.rmSync(evidence.directory(discover(root)), { recursive: true, force: true }); fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(claude, { recursive: true, force: true }); }
}
const task = '\n## Active Task\n\n**Objective:** implement bounded feature\n**Constraints:** no publish\n**Authorized scope:** local implementation and checks\n**Authorization:** User instruction on 2026-10-11.\n**Review cadence:** explain and wait after each chunk\n**Plan/task:** `plans/task.md`\n**Last verified run:** old-navigation-reference\n**Next action:** task 2\n\n## Other section\nnot task content';
test('Active Task below line20 retains explicit cadence, DOC_ROOT reference and missing-plan reconciliation', () => fixture((root, write, hook) => {
  const state = '# Project\n' + 'summary\n'.repeat(30) + task;
  write('.ai/STATE.md', state);
  const parsed = activeTask(state); assert.match(parsed.fields['review cadence'], /wait after each chunk/); assert.doesNotMatch(parsed.section, /not task content/);
  let output = hook(); assert.match(output, /Active Task/); assert.match(output, /wait after each chunk/); assert.match(output, /plan\/task is missing/); assert.match(output, /later user instructions take precedence/);
  write('.ai/plans/task.md', '---\nstatus: complete\n---\n# Task');
  output = hook(); assert.match(output, /\.ai\/plans\/task.md/); assert.match(output, /conflicting next action/); assert.match(output, /without restating settled choices/);
  assert.throws(() => referencePath(discover(root), '/tmp/file'), /relative/);
  assert.throws(() => referencePath(discover(root), '../../escape.md'), /escapes/);
  fs.symlinkSync(os.tmpdir(), path.join(root, '.ai/plans/escape'));
  assert.throws(() => referencePath(discover(root), 'plans/escape/outside.md'), /escapes/);
  write('.ai/STATE.md', state.replace('`plans/task.md`', '`plans/escape/outside.md`'));
  assert.match(hook(), /Task reference diagnostic/);
}));
test('legacy STATE stays valid, task context is bounded and stale evidence does not reset progress', () => fixture((root, write, hook) => {
  assert.equal(activeTask('# Legacy'), null); assert.match(hook(), /Legacy project/);
  execFileSync('git', ['-C', root, 'init', '-q']);
  write('.gsr.json', JSON.stringify({ schemaVersion: 1, docRoot: '.ai', checks: [{ id: 'unit', argv: [process.execPath, '-e', 'void 0'], kind: 'test' }] }));
  write('source.js', 'implemented'); write('.ai/STATE.md', '# Project\n' + task);
  const result = spawnSync(process.execPath, [path.join(ROOT, 'gsr/scripts/run-checks.js'), '--cwd', root], { encoding: 'utf8' }); assert.equal(result.status, 0);
  assert.match(hook(), /Verification observation: passing/);
  write('source.js', 'external mutation'); const output = hook();
  assert.match(output, /Verification observation: stale/); assert.match(output, /Stale tests do not reset implemented progress/);
  write('.ai/STATE.md', '# Project\n' + task.replace('no publish', 'x'.repeat(20000)));
  const bounded = hook(); assert.ok(bounded.length < 9000); assert.match(bounded, /context truncated/); assert.match(bounded, /wait after each chunk/);
}));
test('unavailable behavioral check and fabricated prose remain unverified', () => fixture((root, write, hook) => {
  write('.ai/STATE.md', '# Project\n✅ all checks pass; human accepted\n' + task);
  write('.gsr.json', JSON.stringify({ schemaVersion: 1, docRoot: '.ai', checks: [{ id: 'browser', argv: ['gsr-browser-unavailable'], kind: 'runtime' }] }));
  assert.match(hook(), /Verification observation: unverified/);
  const run = spawnSync(process.execPath, [path.join(ROOT, 'gsr/scripts/run-checks.js'), '--cwd', root], { encoding: 'utf8' }); assert.equal(run.status, 2);
  assert.match(hook(), /unavailable/); assert.match(hook(), /Do not infer human acceptance/);
}));
