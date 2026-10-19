#!/usr/bin/env node
'use strict';
// Optional native isolated install/upgrade probe. No model invocation or user config copy.
const fs = require('fs'); const path = require('path'); const os = require('os');
const { spawnSync, execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const version = spawnSync('claude', ['--version'], { encoding: 'utf8', timeout: 10000 });
if (version.status !== 0) { console.log(JSON.stringify({ status: 'unavailable', modelInvoked: false })); process.exit(2); }
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-installed-'));
const catalog = path.join(temp, 'catalog'), config = path.join(temp, 'config'), work = path.join(temp, 'work');
const observations = [];
const invoke = args => {
 const result = spawnSync('claude', args, { cwd: work, env: { ...process.env, CLAUDE_CONFIG_DIR: config }, encoding: 'utf8', timeout: 20000 });
 observations.push({ operation: args.slice(0, 4), exitCode: result.status, timeout: result.error?.code === 'ETIMEDOUT' });
 if (result.status !== 0) throw new Error(`Native operation ${args.slice(0, 4).join(' ')} failed: ${(result.stderr || result.stdout || result.error?.message || '').slice(0, 500)}`);
 return result;
};
try {
 for (const dir of [catalog, config, work]) fs.mkdirSync(dir, { recursive: true });
 const settings = { statusLine: { type: 'command', command: 'custom-status' } };
 fs.writeFileSync(path.join(config, 'settings.json'), JSON.stringify(settings));
 // HEAD is the prior committed baseline, not the working candidate. Only plugin files.
 const names = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', 'gsr', '.claude-plugin'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
 for (const name of names.filter(Boolean)) {
  const dest = path.join(catalog, name); fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, execFileSync('git', ['show', `HEAD:${name}`], { cwd: ROOT, maxBuffer: 1024 * 1024 }));
 }
 invoke(['plugin', 'marketplace', 'add', catalog]);
 invoke(['plugin', 'install', 'gsr@gsr', '--scope', 'user']);
 // Overlay ALL candidate plugin sources, including ignored/untracked skills/helpers.
 fs.cpSync(path.join(ROOT, 'gsr'), path.join(catalog, 'gsr'), { recursive: true });
 // Synthetic version only inside the disposable catalog forces a real cache upgrade.
 const edit = (file, fn) => { const data = JSON.parse(fs.readFileSync(file)); fn(data); fs.writeFileSync(file, JSON.stringify(data)); };
 edit(path.join(catalog, 'gsr/.claude-plugin/plugin.json'), data => { data.version = '0.6.0-test.1'; });
 edit(path.join(catalog, '.claude-plugin/marketplace.json'), data => { data.plugins[0].version = '0.6.0-test.1'; });
 invoke(['plugin', 'marketplace', 'update', 'gsr']);
 invoke(['plugin', 'update', 'gsr@gsr', '--scope', 'user']);
 const installed = JSON.parse(fs.readFileSync(path.join(config, 'plugins/installed_plugins.json')));
 const entry = installed.plugins['gsr@gsr'].find(p => p.version === '0.6.0-test.1');
 if (!entry) throw new Error('Updated installed package not observed');
 for (const name of ['skills/build/SKILL.md', 'skills/preview/SKILL.md', 'skills/coordinate/SKILL.md', 'lib/fingerprint.js', 'examples/product-preview/index.html']) {
  if (!fs.existsSync(path.join(entry.installPath, name))) throw new Error(`Candidate source absent from installed cache: ${name}`);
 }
 const debug = path.join(temp, 'startup.log');
 invoke(['--init-only', '--debug-file', debug]);
 const log = fs.existsSync(debug) ? fs.readFileSync(debug, 'utf8') : '';
 const final = JSON.parse(fs.readFileSync(path.join(config, 'settings.json')));
 if (JSON.stringify(final.statusLine) !== JSON.stringify(settings.statusLine)) throw new Error('Custom statusLine changed');
 const count = type => Number(log.match(new RegExp(`Loaded (\\d+) ${type} from plugin gsr`))?.[1] || 0);
 if (!count('skills') || !log.includes('SessionStart')) throw new Error('Installed package startup/discovery not observed');
 console.log(JSON.stringify({ status: 'observed-install-upgrade-startup', host: version.stdout.trim(), baseline: 'HEAD plugin 0.5.0', candidate: 'working tree with disposable 0.6.0-test.1 version', settingsPreserved: true, skillsLoaded: count('skills'), commandsLoaded: count('commands'), modelInvoked: false, operations: observations, limitations: ['No model trial or actual interactive /clear', 'No published package or cross-host validation'] }));
} catch (e) {
 console.log(JSON.stringify({ status: 'unvalidated', host: version.stdout.trim(), diagnostic: e.message, operations: observations, modelInvoked: false })); process.exitCode = 2;
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
