#!/usr/bin/env node
'use strict';
// Optional native isolated install/upgrade probe. No model invocation or user config copy.
const fs = require('fs'); const path = require('path'); const os = require('os');
const { spawnSync, execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const exactVersion = process.argv.includes('--exact-version');
const candidateVersion = exactVersion
 ? JSON.parse(fs.readFileSync(path.join(ROOT, 'gsr/.claude-plugin/plugin.json'))).version
 : '0.6.0-test.1';
const baseline = 'v0.5.0';
const version = spawnSync('claude', ['--version'], { encoding: 'utf8', timeout: 10000 });
if (version.status !== 0) { console.log(JSON.stringify({ status: 'unavailable', modelInvoked: false })); process.exit(2); }
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-installed-'));
const catalog = path.join(temp, 'catalog'), config = path.join(temp, 'config'), work = path.join(temp, 'work');
const observations = [];
const invoke = (args, configDir = config) => {
 const result = spawnSync('claude', args, { cwd: work, env: { ...process.env, CLAUDE_CONFIG_DIR: configDir }, encoding: 'utf8', timeout: 20000 });
 observations.push({ operation: args.slice(0, 4), exitCode: result.status, timeout: result.error?.code === 'ETIMEDOUT' });
 if (result.status !== 0) throw new Error(`Native operation ${args.slice(0, 4).join(' ')} failed: ${(result.stderr || result.stdout || result.error?.message || '').slice(0, 500)}`);
 return result;
};
try {
 for (const dir of [catalog, config, work]) fs.mkdirSync(dir, { recursive: true });
 const settings = { statusLine: { type: 'command', command: 'custom-status' } };
 fs.writeFileSync(path.join(config, 'settings.json'), JSON.stringify(settings));
 // Use the public tag: HEAD can already contain the new implementation.
 const names = execFileSync('git', ['ls-tree', '-r', '--name-only', baseline, 'gsr', '.claude-plugin'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
 for (const name of names.filter(Boolean)) {
  const dest = path.join(catalog, name); fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, execFileSync('git', ['show', `${baseline}:${name}`], { cwd: ROOT, maxBuffer: 1024 * 1024 }));
 }
 invoke(['plugin', 'marketplace', 'add', catalog]);
 invoke(['plugin', 'install', 'gsr@gsr', '--scope', 'user']);
 const prior = JSON.parse(fs.readFileSync(path.join(config, 'plugins/installed_plugins.json')));
 if (!prior.plugins['gsr@gsr'].some(p => p.version === '0.5.0')) throw new Error('Public 0.5.0 baseline not installed');
 // Overlay ALL candidate plugin sources, including ignored/untracked skills/helpers.
 fs.cpSync(path.join(ROOT, 'gsr'), path.join(catalog, 'gsr'), { recursive: true });
 // Normal probes use a synthetic cache version; --exact-version preserves the candidate.
 const edit = (file, fn) => { const data = JSON.parse(fs.readFileSync(file)); fn(data); fs.writeFileSync(file, JSON.stringify(data)); };
 edit(path.join(catalog, 'gsr/.claude-plugin/plugin.json'), data => { data.version = candidateVersion; });
 edit(path.join(catalog, '.claude-plugin/marketplace.json'), data => { data.plugins[0].version = candidateVersion; });
 invoke(['plugin', 'marketplace', 'update', 'gsr']);
 invoke(['plugin', 'update', 'gsr@gsr', '--scope', 'user']);
 const installed = JSON.parse(fs.readFileSync(path.join(config, 'plugins/installed_plugins.json')));
 const entry = installed.plugins['gsr@gsr'].find(p => p.version === candidateVersion);
 if (!entry) throw new Error('Updated installed package not observed');
 if (JSON.parse(fs.readFileSync(path.join(entry.installPath, '.claude-plugin/plugin.json'))).version !== candidateVersion) throw new Error('Installed manifest version mismatch');
 const freshConfig = path.join(temp, 'fresh-config'); fs.mkdirSync(freshConfig);
 invoke(['plugin', 'marketplace', 'add', catalog], freshConfig);
 invoke(['plugin', 'install', 'gsr@gsr', '--scope', 'user'], freshConfig);
 const fresh = JSON.parse(fs.readFileSync(path.join(freshConfig, 'plugins/installed_plugins.json')));
 const freshEntry = fresh.plugins['gsr@gsr'].find(p => p.version === candidateVersion);
 if (!freshEntry || JSON.parse(fs.readFileSync(path.join(freshEntry.installPath, '.claude-plugin/plugin.json'))).version !== candidateVersion) throw new Error('Fresh candidate install/version not observed');
 const freshDebug = path.join(temp, 'fresh-startup.log');
 invoke(['--init-only', '--debug-file', freshDebug], freshConfig);
 const freshLog = fs.readFileSync(freshDebug, 'utf8');
 if (!freshLog.includes('SessionStart') || !/Loaded 12 skills from plugin gsr/.test(freshLog) || !/Loaded 11 commands from plugin gsr/.test(freshLog)) throw new Error('Fresh installed discovery mismatch');
 for (const name of ['skills/build/SKILL.md', 'skills/preview/SKILL.md', 'skills/coordinate/SKILL.md', 'skills/autopilot/SKILL.md', 'lib/execution-queue.js', 'scripts/autopilot.js', 'lib/fingerprint.js', 'examples/product-preview/index.html']) {
  if (!fs.existsSync(path.join(entry.installPath, name))) throw new Error(`Candidate source absent from installed cache: ${name}`);
 }
 const debug = path.join(temp, 'startup.log');
 invoke(['--init-only', '--debug-file', debug]);
 const log = fs.existsSync(debug) ? fs.readFileSync(debug, 'utf8') : '';
 const final = JSON.parse(fs.readFileSync(path.join(config, 'settings.json')));
 if (JSON.stringify(final.statusLine) !== JSON.stringify(settings.statusLine)) throw new Error('Custom statusLine changed');
 const count = type => Number(log.match(new RegExp(`Loaded (\\d+) ${type} from plugin gsr`))?.[1] || 0);
 if (!count('skills') || !log.includes('SessionStart')) throw new Error('Installed package startup/discovery not observed');
 // Actual installed-copy helper path, synthetic product edit and configured verification.
 const scenario = path.join(work, 'scenario'); fs.mkdirSync(path.join(scenario, 'docs/features'), { recursive: true }); fs.mkdirSync(path.join(scenario, 'src'));
 execFileSync('git', ['-C', scenario, 'init', '-q']);
 const fixture = name => fs.readFileSync(path.join(ROOT, 'scripts/fixtures/phase-4', name), 'utf8');
 fs.writeFileSync(path.join(scenario, 'docs/features/booking.md'), fixture('booking.md'));
 fs.writeFileSync(path.join(scenario, 'src/booking.js'), fixture('booking.js'));
 fs.writeFileSync(path.join(scenario, 'test-booking.js'), "const assert=require('assert/strict');const rows=[];const {reserve}=require('./src/booking');reserve({name:'Synthetic',time:'09:00'},rows);assert.equal(rows.length,1);assert.throws(()=>reserve({name:'Synthetic',time:'bad'},rows));assert.equal(rows.length,1);");
 fs.writeFileSync(path.join(scenario, '.gsr.json'), JSON.stringify({ schemaVersion: 1, checks: [{ id: 'booking', argv: [process.execPath, 'test-booking.js'], kind: 'test' }] }));
 const directive = { operation: 'implement', source: 'Synthetic installed-copy correctness scenario, local only' };
 const request = { id: 'guest-booking', current: directive, impact: JSON.parse(fixture('impact.json')), tasks: [{ id: 'guest', objective: 'Allow guest booking', doneWhen: 'Stored locally and invalid time rejected', requirements: ['booking.T1', 'booking.T2'], dependsOn: [], constraints: [], extraRefs: [] }], policy: { constraints: ['Preserve appearance'], exclusions: ['No publication'], authorization: { source: directive.source, date: '2026-10-15', scope: 'Synthetic local code/test only' }, reviewCadence: 'Continue within local scenario', reviewAfterEachTask: false, decisionRefs: [{ ref: 'features/booking.md#Open-Decisions' }], contextRefs: [], limits: { maxAttempts: 3, maxSteps: 3 } } };
 const helper = (action, input) => {
  const result = spawnSync(process.execPath, [path.join(entry.installPath, 'scripts/autopilot.js'), action, '--cwd', scenario, '--file', 'work/booking/context.json', ...(input ? ['--input', '-'] : [])], { input: input ? JSON.stringify(input) : undefined, encoding: 'utf8', timeout: 10000 });
  if (result.status !== 0) throw new Error(`Installed helper ${action}: ${result.stdout.slice(0, 400)}`);
  return JSON.parse(result.stdout);
 };
 const verify = () => {
  const result = spawnSync(process.execPath, [path.join(entry.installPath, 'scripts/run-checks.js'), '--cwd', scenario], { encoding: 'utf8', timeout: 10000 });
  if (result.status !== 0) throw new Error('Installed runner did not pass synthetic booking checks');
 };
 helper('prepare', request); helper('initialize', { current: directive });
 const step = helper('start', { current: directive, approach: 'Remove account guard, preserve time validation and local repository write' });
 fs.writeFileSync(path.join(scenario, 'src/booking.js'), fixture('booking.js').replace("  if (!input.account) throw new Error('Account required');\n", ''));
 verify(); helper('record', { current: directive, attemptId: step.attemptId });
 helper('refresh', { ...request, reason: 'Inspected source links after local guest booking change' }); verify();
 helper('reconcile', { current: directive, reason: 'Reviewed actual guest write and invalid-time behavior with installed full default checks', reviewedTasks: ['guest'] });
 const scenarioReport = helper('report');
 if (scenarioReport.execution !== 'checked' || scenarioReport.verification.status !== 'passing') throw new Error('Installed end-to-end queue result not current checked/passing');
 fs.rmSync(require('../gsr/lib/evidence').directory(require('../gsr/lib/project').discover(scenario)), { recursive: true, force: true });
 console.log(JSON.stringify({ status: 'observed-install-upgrade-startup', host: version.stdout.trim(), baseline, candidate: candidateVersion, exactVersion, freshInstall: true, settingsPreserved: true, installedHelperScenario: 'actual guest edit, configured checks, checkpoint, map refresh, reconciliation and report passed', skillsLoaded: count('skills'), commandsLoaded: count('commands'), modelInvoked: false, operations: observations, limitations: ['No model trial or actual interactive /clear', 'Local catalog only; no published package or cross-host validation'] }));
} catch (e) {
 console.log(JSON.stringify({ status: 'unvalidated', host: version.stdout.trim(), diagnostic: e.message, operations: observations, modelInvoked: false })); process.exitCode = 2;
} finally { fs.rmSync(temp, { recursive: true, force: true }); }
