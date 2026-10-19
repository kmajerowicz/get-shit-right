'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { discover } = require('../gsr/lib/project');
const { select } = require('../gsr/lib/config');
function fixture(fn) { const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-project-')); try { fn(root); } finally { fs.rmSync(root, { recursive: true, force: true }); } }
function write(root, file, text = '') { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); }
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' });
test('scoring, tie order, non-Git upward discovery, explicit Python config, read-only discovery', () => fixture(root => {
  assert.equal(discover(root).initialized, false);
  write(root, 'CLAUDE.md', 'GSR');
  assert.equal(discover(root).initialized, false);
  write(root, 'docs/STATE.md'); write(root, '.ai/STATE.md');
  assert.equal(discover(root).docRoot, '.ai');
  write(root, 'docs/PRD.md');
  assert.equal(discover(root).docRoot, 'docs');
  fs.mkdirSync(path.join(root, 'src'));
  assert.equal(discover(path.join(root, 'src')).root, fs.realpathSync(root));
  write(root, '.gsr.json', JSON.stringify({ schemaVersion: 1, docRoot: '.ai', checks: [{ id: 'python', argv: ['python3', '-m', 'unittest'], kind: 'test' }] }));
  const before = fs.readdirSync(root);
  const p = discover(root);
  assert.equal(p.docRoot, '.ai'); assert.equal(select(p).checks[0].argv[0], 'python3');
  assert.deepEqual(fs.readdirSync(root), before);
}));
test('canonical Git roots, symlink invocation and distinct worktrees', () => fixture(root => {
  const repo = path.join(root, 'repo'); fs.mkdirSync(repo); git(repo, 'init', '-q');
  write(repo, 'docs/STATE.md'); git(repo, 'add', '.'); git(repo, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'init');
  fs.mkdirSync(path.join(repo, 'src')); fs.symlinkSync(repo, path.join(root, 'link'));
  assert.equal(discover(path.join(root, 'link/src')).root, fs.realpathSync(repo));
  const work = path.join(root, 'work'); git(repo, 'worktree', 'add', '--detach', work);
  assert.notEqual(discover(work).root, discover(repo).root);
}));
test('invalid config and escaping doc/check/config symlinks are rejected', () => fixture(root => {
  for (const value of ['{bad', '{"schemaVersion":2}', JSON.stringify({ schemaVersion: 1, docRoot: '../outside' }), JSON.stringify({ schemaVersion: 1, docRoot: '/tmp' }), JSON.stringify({ schemaVersion: 1, checks: [{ id: 'x', argv: ['echo', 'x', '||', 'true'], kind: 'test' }] })]) {
    write(root, '.gsr.json', value); assert.throws(() => discover(root));
  }
  fs.symlinkSync(os.tmpdir(), path.join(root, 'escape'));
  write(root, '.gsr.json', JSON.stringify({ schemaVersion: 1, docRoot: 'escape/nope' })); assert.throws(() => discover(root), /escapes/);
  write(root, '.gsr.json', JSON.stringify({ schemaVersion: 1, checks: [{ id: 'x', argv: ['python3'], kind: 'test', cwd: 'escape' }] })); assert.throws(() => discover(root), /escapes/);
}));

test('dangling docRoot and config symlinks are rejected, never silently absent', () => fixture(root => {
  fs.symlinkSync(path.join(os.tmpdir(), 'gsr-no-such-target-123456'), path.join(root, 'dangling'));
  write(root, '.gsr.json', JSON.stringify({ schemaVersion: 1, docRoot: 'dangling/docs' }));
  assert.throws(() => discover(root), /dangling|unresolvable/);
  fs.unlinkSync(path.join(root, '.gsr.json'));
  fs.symlinkSync(path.join(os.tmpdir(), 'gsr-no-such-config-123456'), path.join(root, '.gsr.json'));
  assert.throws(() => discover(root), /dangling|unresolvable/);
}));
