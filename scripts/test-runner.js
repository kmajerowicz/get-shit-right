'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path'); const os = require('os');
const { spawnSync } = require('child_process');
const { discover } = require('../gsr/lib/project');
const { directory, latest } = require('../gsr/lib/evidence');
const runner = path.resolve(__dirname, '../gsr/scripts/run-checks.js');
function fixture(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-runner-'));
  const config = c => fs.writeFileSync(path.join(root, '.gsr.json'), JSON.stringify({ schemaVersion: 1, ...c }));
  config({ checks: [] });
  const base = directory(discover(root));
  try { fn(root, config); } finally { fs.rmSync(root, { recursive: true, force: true }); fs.rmSync(base, { recursive: true, force: true }); }
}
const check = (id, code, extra = {}) => ({ id, argv: [process.execPath, '-e', code], kind: 'test', ...extra });
const run = (root, ...args) => spawnSync(process.execPath, [runner, '--cwd', root, ...args], { encoding: 'utf8' });
test('all required checks recorded; passing build cannot cover failing tests; caller masking does not change failure', () => fixture((root, config) => {
  config({ checks: [check('build', 'void 0'), check('tests', 'process.exit(7)')] });
  assert.equal(run(root).status, 1);
  let record = latest(discover(root));
  assert.equal(record.results.length, 2); assert.equal(record.results[1].exitCode, 7); assert.equal(record.status, 'failed');
  const masked = spawnSync('/bin/sh', ['-c', '"$1" "$2" --cwd "$3" || true', 'fixture', process.execPath, runner, root]);
  assert.equal(masked.status, 0); record = latest(discover(root)); assert.equal(record.status, 'failed');
}));
test('missing executable, timeout, child signal, optional failure and empty required set', () => fixture((root, config) => {
  config({ checks: [{ id: 'missing', argv: ['gsr-nonexistent-executable-123456'], kind: 'test' }] });
  assert.equal(run(root).status, 2); assert.equal(latest(discover(root)).results[0].launchError, 'ENOENT');
  config({ checks: [check('timeout', 'setInterval(() => {}, 1000)', { timeoutMs: 30 })] });
  assert.equal(run(root).status, 1); assert.equal(latest(discover(root)).results[0].timedOut, true);
  config({ checks: [check('signal', "process.kill(process.pid, 'SIGTERM')")] });
  assert.equal(run(root).status, 1); assert.equal(latest(discover(root)).results[0].signal, 'SIGTERM');
  config({ checks: [check('unit', 'void 0'), check('optional', 'process.exit(4)', { required: false })], profiles: { all: ['unit', 'optional'] } });
  assert.equal(run(root, '--profile', 'all').status, 2); // non-Git freshness unsupported
  const record = latest(discover(root), 'all'); assert.equal(record.results[1].status, 'failed'); assert.equal(record.status, 'unverified');
  config({ checks: [] }); assert.equal(run(root).status, 2); assert.match(latest(discover(root)).diagnostic, /Empty/);
}));
test('bounded output, exact configuration, invalid/missing profiles and configuration', () => fixture((root, config) => {
  config({ checks: [check('loud', "process.stdout.write('x'.repeat(100000)); process.stderr.write('y'.repeat(100000))")] });
  assert.equal(run(root).status, 2);
  const record = latest(discover(root));
  assert.equal(record.results[0].stdout.length, 4096); assert.equal(record.results[0].stderr.length, 4096);
  assert.equal(record.results[0].outputTruncated, true); assert.equal(record.checks[0].argv[0], process.execPath);
  assert.equal(record.env, undefined); assert.ok(JSON.stringify(record).length < 15000);
  assert.equal(run(root, '--profile', 'unknown').status, 2);
  config({ checks: [], profiles: { bad: ['missing'] } }); assert.equal(run(root).status, 2);
  fs.unlinkSync(path.join(root, '.gsr.json')); assert.equal(run(root).status, 2);
}));
test('oversized records are rejected; selected optional unavailable remains unverified', () => fixture((root, config) => {
  config({ checks: [check('huge', 'x'.repeat(9000))] }); assert.equal(run(root).status, 2);
  config({ checks: [check('unit', 'void 0'), { id: 'optional', argv: ['gsr-missing-optional'], required: false, kind: 'test' }], profiles: { all: ['unit', 'optional'] } });
  assert.equal(run(root, '--profile', 'all').status, 2); assert.match(latest(discover(root), 'all').diagnostic, /unavailable/);
}));

test('default unions configured optional checks with every required check; named profiles stay explicit', () => fixture((root, config) => {
  const { select } = require('../gsr/lib/config');
  config({ checks: [check('build', 'void 0'), check('added', 'process.exit(7)'), check('optional', 'void 0', { required: false })], profiles: { default: ['build', 'optional'], focused: ['build'] } });
  assert.deepEqual(select(discover(root)).checks.map(c => c.id), ['build', 'optional', 'added']);
  assert.equal(run(root).status, 1);
  assert.equal(latest(discover(root)).results.find(r => r.id === 'added').exitCode, 7);
  assert.deepEqual(select(discover(root), 'focused').checks.map(c => c.id), ['build']);
}));
