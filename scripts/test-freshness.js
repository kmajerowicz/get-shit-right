'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path'); const os = require('os');
const { spawnSync, execFileSync, spawn } = require('child_process');
const { discover } = require('../gsr/lib/project');
const { select } = require('../gsr/lib/config');
const { fingerprint, normalizePlan } = require('../gsr/lib/fingerprint');
const evidence = require('../gsr/lib/evidence');
const ROOT = path.resolve(__dirname, '..'); const runner = path.join(ROOT, 'gsr/scripts/run-checks.js');
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { stdio: 'pipe' });
const write = (root, file, value = '') => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), value); };
async function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-fresh-'));
  git(root, 'init', '-q'); write(root, 'docs/STATE.md', '# Summary'); write(root, 'source.js', 'one'); write(root, '.gitignore', 'dist/\n');
  write(root, '.gsr.json', JSON.stringify({ schemaVersion: 1, checks: [{ id: 'unit', argv: [process.execPath, '-e', 'void 0'], kind: 'test' }] }));
  git(root, 'add', '.'); git(root, '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'fixture');
  try { await fn(root); } finally { fs.rmSync(evidence.directory(discover(root)), { recursive: true, force: true }); fs.rmSync(root, { recursive: true, force: true }); }
}
const run = (root, ...args) => spawnSync(process.execPath, [runner, '--cwd', root, ...args], { encoding: 'utf8' });
const observe = root => evidence.observe(discover(root));
test('fresh pass survives restart; shell/external/deletion/untracked/mode/requirements/config mutations become stale', () => fixture(root => {
  for (const mutate of [
    () => execFileSync(process.execPath, ['-e', "require('fs').writeFileSync(process.argv[1], 'shell')", path.join(root, 'source.js')]),
    () => write(root, 'source.js', 'external'),
    () => fs.unlinkSync(path.join(root, 'source.js')),
    () => write(root, 'new-source.js', 'source'),
    () => fs.chmodSync(path.join(root, 'source.js'), 0o755),
    () => write(root, 'docs/features/example.md', '# P01\nChanged wording'),
    () => { const c = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json'))); c.checks[0].timeoutMs = 54321; write(root, '.gsr.json', JSON.stringify(c)); }
  ]) {
    write(root, 'source.js', 'one'); fs.chmodSync(path.join(root, 'source.js'), 0o644);
    assert.equal(run(root).status, 0); assert.equal(observe(root).status, 'passing');
    mutate(); assert.equal(observe(root).status, 'stale');
  }
}));
test('ignored outputs and administrative updates do not stale; plan criteria/source remain covered', () => fixture(root => {
  const template = fs.readFileSync(path.join(ROOT, 'gsr/templates/plan-md.md'), 'utf8');
  write(root, 'docs/plans/task.md', template);
  assert.ok(normalizePlan(template));
  assert.equal(run(root).status, 0);
  write(root, 'dist/bundle.js', 'ignored'); write(root, 'docs/STATE.md', '# New progress');
  write(root, 'docs/plans/task.md', template.replace('updated: <YYYY-MM-DD>', 'updated: 2026-10-11').replace('status: in_progress', 'status: complete').replace('| pending | — |', '| done | checked |'));
  assert.equal(observe(root).status, 'passing');
  const current = fs.readFileSync(path.join(root, 'docs/plans/task.md'), 'utf8');
  write(root, 'docs/plans/task.md', current.replace('<verifiable criterion>', 'different requirement'));
  assert.equal(observe(root).status, 'stale');
  assert.equal(normalizePlan(template + '\n## Custom\n'), null);
  assert.equal(normalizePlan(template.replace('<task>', '<task | ambiguous>')), null);
  write(root, '.gitignore', 'dist/\ndocs/features/\n'); write(root, 'docs/features/ignored.md', 'must stay covered');
  assert.equal(run(root).status, 0); write(root, 'docs/features/ignored.md', 'changed'); assert.equal(observe(root).status, 'stale');
}));
test('symlink targets, deletion markers, submodule and inaccessible/unsupported inputs', () => fixture(root => {
  fs.symlinkSync('source.js', path.join(root, 'link'));
  const before = fingerprint(discover(root)).hash;
  fs.unlinkSync(path.join(root, 'link')); fs.symlinkSync('other.js', path.join(root, 'link'));
  assert.notEqual(fingerprint(discover(root)).hash, before);
  git(root, 'update-index', '--add', '--cacheinfo', `160000,${git(root, 'rev-parse', 'HEAD').toString().trim()},submodule`);
  assert.match(fingerprint(discover(root)).diagnostic, /Submodule/);
}));
test('missing/corrupt/future/latest interrupted records never reveal older green', () => fixture(root => {
  assert.equal(observe(root).status, 'unverified');
  assert.equal(run(root).status, 0);
  const project = discover(root); const started = evidence.begin(project, select(project), fingerprint(project));
  assert.equal(observe(root).status, 'unverified');
  fs.writeFileSync(path.join(started.dir, 'record.json'), '{bad'); assert.equal(observe(root).status, 'unverified');
  fs.writeFileSync(path.join(started.dir, 'record.json'), JSON.stringify({ schemaVersion: 999 }));
  assert.match(observe(root).diagnostic, /Unsupported/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(started.dir, 'record.json'))).schemaVersion, 999);
}));
test('input change during check cannot establish fresh verification; newer failure stays failed', () => fixture(root => {
  const config = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json')));
  config.checks[0].argv = [process.execPath, '-e', "require('fs').writeFileSync('source.js', 'changed during run')"];
  write(root, '.gsr.json', JSON.stringify(config));
  assert.equal(run(root).status, 2); assert.equal(evidence.latest(discover(root)).status, 'stale');
  config.checks[0].argv = [process.execPath, '-e', 'void 0']; write(root, '.gsr.json', JSON.stringify(config)); assert.equal(run(root).status, 0);
  config.checks[0].argv = [process.execPath, '-e', 'process.exit(9)']; write(root, '.gsr.json', JSON.stringify(config)); assert.equal(run(root).status, 1); assert.equal(observe(root).status, 'failed');
}));
test('optional failure is reported without failing a fresh required set', () => fixture(root => {
  const config = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json')));
  config.checks.push({ id: 'optional', argv: [process.execPath, '-e', 'process.exit(8)'], required: false, kind: 'test' }); config.profiles = { all: ['unit', 'optional'] };
  write(root, '.gsr.json', JSON.stringify(config)); assert.equal(run(root, '--profile', 'all').status, 0);
  assert.equal(evidence.observe(discover(root), 'all').results[1].status, 'failed');
}));
test('project/worktree isolation and concurrent records remain independent', () => fixture(async root => {
  const other = path.join(root, 'other'); fs.mkdirSync(other); git(other, 'init', '-q'); write(root, '.gitignore', 'dist/\nother/\n'); write(other, '.gsr.json', fs.readFileSync(path.join(root, '.gsr.json')));
  assert.notEqual(evidence.directory(discover(root)), evidence.directory(discover(other)));
  const work = path.join(os.tmpdir(), `gsr-work-${process.pid}-${Date.now()}`);
  git(root, 'worktree', 'add', '--detach', work);
  try {
    assert.equal(run(root).status, 0); assert.equal(observe(work).status, 'unverified');
    assert.notEqual(evidence.directory(discover(root)), evidence.directory(discover(work)));
    const one = evidence.begin(discover(work), select(discover(work)), fingerprint(discover(work)));
    const two = evidence.begin(discover(work), select(discover(work)), fingerprint(discover(work)));
    assert.notEqual(one.dir, two.dir); assert.equal(fs.readdirSync(evidence.directory(discover(work))).length, 2);
    const processes = [0, 1].map(() => new Promise(resolve => { const child = spawn(process.execPath, [runner, '--cwd', work], { stdio: 'ignore' }); child.on('close', resolve); }));
    assert.deepEqual(await Promise.all(processes), [0, 0]);
    for (const dir of fs.readdirSync(evidence.directory(discover(work)))) assert.ok(JSON.parse(fs.readFileSync(path.join(evidence.directory(discover(work)), dir, 'record.json'))));
  } finally { fs.rmSync(evidence.directory(discover(work)), { recursive: true, force: true }); git(root, 'worktree', 'remove', '--force', work); }
}));
test('runner interruption persists incomplete result and never reuses green', () => fixture(async root => {
  assert.equal(run(root).status, 0);
  const config = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json')));
  config.checks[0].argv = [process.execPath, '-e', 'setInterval(() => {}, 1000)']; write(root, '.gsr.json', JSON.stringify(config));
  const base = evidence.directory(discover(root)); const count = fs.readdirSync(base).length;
  const child = spawn(process.execPath, [runner, '--cwd', root], { stdio: 'ignore' });
  const closed = new Promise(resolve => child.on('close', resolve));
  const deadline = Date.now() + 5000;
  while (fs.readdirSync(base).length === count && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
  child.kill('SIGTERM'); assert.equal(await closed, 2);
  assert.equal(observe(root).status, 'unverified'); assert.match(observe(root).diagnostic, /interrupted/);
}));

test('structurally corrupt JSON records/metadata cannot report passing or fall back', () => fixture(root => {
  assert.equal(run(root).status, 0);
  const good = evidence.latest(discover(root));
  const dir = path.dirname(good.reference);
  const source = fs.readFileSync(good.reference, 'utf8');
  fs.writeFileSync(good.reference, JSON.stringify({ ...good, results: [], checks: [] }));
  assert.equal(observe(root).status, 'unverified');
  fs.writeFileSync(good.reference, source);
  const metadata = path.join(dir, 'start.json');
  for (const value of [null, { schemaVersion: 1 }, { schemaVersion: 1, runId: good.runId, startedAt: good.startedAt }]) {
    fs.writeFileSync(metadata, JSON.stringify(value)); assert.equal(observe(root).status, 'unverified');
  }
}));
test('misplaced plan table is fully hashed', () => fixture(root => {
  const template = fs.readFileSync(path.join(ROOT, 'gsr/templates/plan-md.md'), 'utf8');
  const table = template.match(/\| ID [\s\S]+?(?=\n\n## Parallelization Map)/)[0];
  const misplaced = template.replace(table, '').replace('## Task List', table + '\n\n## Task List');
  assert.equal(normalizePlan(misplaced), null);
  const fenced = template.replace('## Task List', '```markdown\n\n## Task List').replace('## Parallelization Map', '```\n\n## Parallelization Map');
  assert.equal(normalizePlan(fenced), null);
  assert.equal(normalizePlan('<!--\n' + template + '\n-->'), null);
  write(root, 'docs/plans/misplaced.md', misplaced); assert.equal(run(root).status, 0);
  write(root, 'docs/plans/misplaced.md', misplaced.replace('| pending | — |', '| done | checked |'));
  assert.equal(observe(root).status, 'stale');
}));

test('project research requirements remain covered even when ignored, unchanged ID does not retain green', () => fixture(root => {
  write(root, '.gitignore', 'dist/\ndocs/research/\n');
  write(root, 'docs/research/provider.md', '# D1\nRegion A supported');
  assert.equal(run(root).status, 0);
  write(root, 'docs/research/provider.md', '# D1\nRegion B requires different support');
  assert.equal(observe(root).status, 'stale');
}));

test('ignored dangling research symlinks remain hashed by target', () => fixture(root => {
 write(root, '.gitignore', 'dist/\ndocs/research/\n');
 fs.mkdirSync(path.join(root, 'docs/research'), { recursive: true });
 const file = path.join(root, 'docs/research/support.md');
 fs.symlinkSync('missing-A.md', file); const before = fingerprint(discover(root));
 fs.unlinkSync(file); fs.symlinkSync('missing-B.md', file); const after = fingerprint(discover(root));
 assert.equal(before.supported, true); assert.equal(after.supported, true); assert.notEqual(before.hash, after.hash);
}));

test('session navigation is administrative; identity, unknown fields, malformed records and sources remain covered', () => fixture(root => {
  const manifest = { project_dir: root, project_name: 'Fixture', last_command: 'gsr:build', timestamp: 'before', custom: { requirement: 'A' } };
  write(root, '.gsr-session.json', JSON.stringify(manifest));
  assert.equal(run(root).status, 0);
  write(root, '.gsr-session.json', JSON.stringify({ ...manifest, last_command: 'gsr:verify', timestamp: 'after' }));
  assert.equal(observe(root).status, 'passing');
  for (const delta of [{ project_dir: root + '/other' }, { project_name: 'Other' }, { custom: { requirement: 'B' } }]) {
    write(root, '.gsr-session.json', JSON.stringify({ ...manifest, ...delta }));
    assert.equal(observe(root).status, 'stale');
  }
  write(root, '.gsr-session.json', '{broken'); assert.equal(observe(root).status, 'stale');
  write(root, '.gsr-session.json', JSON.stringify(manifest));
  write(root, 'source.js', 'real edit'); assert.equal(observe(root).status, 'stale');
}));

test('equivalent docRoot spelling normalizes only exact plan progress, never task criteria', () => fixture(root => {
  const template = fs.readFileSync(path.join(ROOT, 'gsr/templates/plan-md.md'), 'utf8');
  for (const docRoot of ['docs', './docs', 'docs/']) {
    const config = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json')));
    config.docRoot = docRoot; write(root, '.gsr.json', JSON.stringify(config));
    write(root, 'docs/plans/task.md', template);
    assert.equal(discover(root).docRoot, 'docs');
    assert.equal(run(root).status, 0);
    const progress = template.replace('| pending | — |', '| done | checked |');
    write(root, 'docs/plans/task.md', progress); assert.equal(observe(root).status, 'passing');
    write(root, 'docs/plans/task.md', progress.replace('<verifiable criterion>', 'changed requirement'));
    assert.equal(observe(root).status, 'stale');
  }
}));

test('preview assumptions/artifacts remain freshness inputs when ignored; same requirement ID and missing artifact invalidate', () => fixture(root => {
 write(root, '.gitignore', 'dist/\ndocs/previews/\n');
 write(root, 'docs/features/booking.md', '# booking.T1\nConfirm inline without login');
 write(root, 'docs/previews/booking/README.md', '# Question\nNo account; variant B, wait after showing');
 write(root, 'docs/previews/booking/index.html', '<p>Variant B</p>');
 assert.equal(run(root).status, 0);
 write(root, 'docs/features/booking.md', '# booking.T1\nRequire login before confirmation');
 assert.equal(observe(root).status, 'stale');
 assert.equal(run(root).status, 0);
 fs.unlinkSync(path.join(root, 'docs/previews/booking/index.html'));
 assert.equal(observe(root).status, 'stale');
 write(root, 'docs/previews/booking/index.html', '<p>Variant B</p>');
 assert.equal(run(root).status, 0);
 write(root, 'docs/previews/booking/README.md', '# Question\nAccount required; variant A');
 assert.equal(observe(root).status, 'stale');
}));
