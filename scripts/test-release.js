'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
function fixture(run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-release-test-'));
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  };
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const invoke = (...args) => spawnSync(process.execPath, args, {
    cwd: root, encoding: 'utf8', timeout: 30000,
    env: { ...process.env, npm_config_offline: 'true' },
  });
  try {
    for (const file of ['scripts/release.js', 'scripts/lib/release-versions.js', 'scripts/check-version-sync.js', 'cliff.toml']) {
      write(file, fs.readFileSync(path.join(ROOT, file), 'utf8'));
    }
    write('package.json', { name: 'release-fixture', version: '0.5.0', scripts: { check: 'node scripts/check-version-sync.js' } });
    write('package-lock.json', { name: 'release-fixture', version: '0.5.0', lockfileVersion: 3, packages: {
      '': { name: 'release-fixture', version: '0.5.0' },
      'node_modules/fixture': { version: '1.2.3', resolved: 'https://example.invalid/fixture.tgz', integrity: 'sha512-fixture' },
    } });
    write('gsr/.claude-plugin/plugin.json', { name: 'gsr', version: '0.5.0' });
    write('.claude-plugin/marketplace.json', { plugins: [{ name: 'gsr', version: '0.5.0' }, { name: 'other', version: '9.0.0' }] });
    write('CHANGELOG.md', '# Changelog\n\n<!-- GSR:RELEASES -->\n\n## [0.5.0] - 2026-01-01\n');
    write('.gitignore', 'node_modules\n');
    fs.symlinkSync(path.join(ROOT, 'node_modules'), path.join(root, 'node_modules'));
    git('init', '-q'); git('config', 'user.name', 'Release fixture'); git('config', 'user.email', 'release@example.invalid');
    git('add', '.'); git('commit', '-qm', 'chore: baseline'); git('tag', 'v0.5.0');
    write('feature.txt', 'observable feature'); git('add', 'feature.txt'); git('commit', '-qm', 'feat: add observable release fixture');
    run({ root, write, git, invoke });
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
test('version sync rejects drift in either lockfile root', () => fixture(({ root, write, invoke }) => {
  assert.equal(invoke('scripts/check-version-sync.js').status, 0);
  const original = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json')));
  for (const field of ['version', 'package']) {
    const data = structuredClone(original);
    if (field === 'version') data.version = '0.2.11'; else data.packages[''].version = '0.2.11';
    write('package-lock.json', data);
    assert.equal(invoke('scripts/check-version-sync.js').status, 1);
  }
}));
test('dry-run writes nothing; real release tags synchronized metadata without changing dependencies', () => fixture(({ root, git, invoke }) => {
  const tracked = git('ls-files').split('\n');
  const before = new Map(tracked.map(file => [file, fs.readFileSync(path.join(root, file))]));
  const lockBefore = JSON.parse(before.get('package-lock.json'));
  const dry = invoke('scripts/release.js', '0.6.0', '--dry-run');
  assert.equal(dry.status, 0, dry.stdout + dry.stderr);
  for (const [file, bytes] of before) assert.deepEqual(fs.readFileSync(path.join(root, file)), bytes, file);
  assert.equal(git('status', '--porcelain'), '');
  assert.equal(git('tag', '--list', 'v0.6.0'), '');
  assert.match(dry.stdout, /observable release fixture/);
  const release = invoke('scripts/release.js', '0.6.0');
  assert.equal(release.status, 0, release.stdout + release.stderr);
  assert.equal(git('rev-parse', 'v0.6.0^{}'), git('rev-parse', 'HEAD'));
  assert.equal(git('status', '--porcelain'), '');
  assert.equal(invoke('scripts/check-version-sync.js').status, 0);
  const lockAfter = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json')));
  lockBefore.version = '0.6.0'; lockBefore.packages[''].version = '0.6.0';
  assert.deepEqual(lockAfter, lockBefore);
  const catalog = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/marketplace.json')));
  assert.equal(catalog.plugins[1].version, '9.0.0');
  assert.equal(invoke('scripts/release.js', '0.6.0').status, 1);
}));
