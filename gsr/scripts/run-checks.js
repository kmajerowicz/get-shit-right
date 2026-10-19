#!/usr/bin/env node
'use strict';
const fs = require('fs');
const { spawn } = require('child_process');
const { discover, resolveWithin } = require('../lib/project');
const { select } = require('../lib/config');
const evidence = require('../lib/evidence');
const { fingerprint } = require('../lib/fingerprint');
const LIMIT = 4096;
function execute(project, check, state) {
  return new Promise(resolve => {
    let child;
    let timeout = false;
    let launchError = null;
    let stdout = Buffer.alloc(0), stderr = Buffer.alloc(0);
    let stdoutBytes = 0, stderrBytes = 0;
    const startedAt = new Date().toISOString();
    try {
      const cwd = resolveWithin(project.root, check.cwd, `${check.id} cwd`);
      if (!fs.statSync(cwd).isDirectory()) throw new Error('cwd is not a directory');
      child = spawn(check.argv[0], check.argv.slice(1), { cwd, shell: false, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' });
    } catch (e) { resolve({ id: check.id, status: 'unavailable', exitCode: null, signal: null, timedOut: false, launchError: e.code || e.message, stdout: '', stderr: '', startedAt, endedAt: new Date().toISOString() }); return; }
    const terminate = () => { try { if (process.platform !== 'win32') process.kill(-child.pid, 'SIGKILL'); else child.kill('SIGKILL'); } catch (_) { /* already stopped */ } };
    state.stop = terminate;
    const timer = setTimeout(() => { timeout = true; terminate(); }, check.timeoutMs);
    child.stdout.on('data', chunk => { stdoutBytes += chunk.length; if (stdout.length < LIMIT) stdout = Buffer.concat([stdout, chunk.subarray(0, LIMIT - stdout.length)]); });
    child.stderr.on('data', chunk => { stderrBytes += chunk.length; if (stderr.length < LIMIT) stderr = Buffer.concat([stderr, chunk.subarray(0, LIMIT - stderr.length)]); });
    child.on('error', e => { launchError = e.code || 'launch error'; });
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer); state.stop = null;
      const status = launchError ? 'unavailable' : timeout || signal || exitCode !== 0 ? 'failed' : 'passed';
      resolve({ id: check.id, status, exitCode, signal, timedOut: timeout, launchError, startedAt, endedAt: new Date().toISOString(), stdout: stdout.toString('utf8'), stderr: stderr.toString('utf8'), outputTruncated: stdoutBytes > LIMIT || stderrBytes > LIMIT });
    });
  });
}
async function run(cwd, profile = 'default') {
  const project = discover(cwd);
  const selection = select(project, profile);
  const before = fingerprint(project);
  const state = { interrupted: false, stop: null };
  const interrupt = () => { state.interrupted = true; state.stop?.(); };
  process.once('SIGINT', interrupt); process.once('SIGTERM', interrupt);
  try {
    const runRecord = evidence.begin(project, selection, before);
    for (const check of selection.checks) {
      if (state.interrupted) break;
      runRecord.record.results.push(await execute(project, check, state));
    }
    const after = fingerprint(project);
    const r = runRecord.record;
    r.inputAfter = after; r.endedAt = new Date().toISOString();
    const required = selection.checks.filter(c => c.required);
    const failed = required.some(c => r.results.find(x => x.id === c.id)?.status === 'failed');
    const unavailable = selection.checks.some(c => !r.results.find(x => x.id === c.id) || r.results.find(x => x.id === c.id).status === 'unavailable');
    const stale = before.supported && after.supported && before.hash !== after.hash;
    let exitCode;
    if (state.interrupted || unavailable || !required.length) { r.status = 'unverified'; r.diagnostic = state.interrupted ? 'Run interrupted' : !required.length ? 'Empty required set' : 'Selected check unavailable'; exitCode = 2; }
    else if (failed) { r.status = 'failed'; r.diagnostic = 'Required check failed'; exitCode = 1; }
    else if (stale) { r.status = 'stale'; r.diagnostic = 'Inputs changed during checks'; exitCode = 2; }
    else if (!before.supported || !after.supported) { r.status = 'unverified'; r.diagnostic = before.diagnostic || after.diagnostic; exitCode = 2; }
    else { r.status = 'passing'; r.diagnostic = null; exitCode = 0; }
    r.exitCode = exitCode;
    evidence.finish(runRecord);
    return { status: r.status, diagnostic: r.diagnostic, results: r.results.map(x => ({ id: x.id, status: x.status, exitCode: x.exitCode, signal: x.signal, timedOut: x.timedOut })), reference: require('path').join(runRecord.dir, 'record.json'), exitCode };
  } finally { process.removeListener('SIGINT', interrupt); process.removeListener('SIGTERM', interrupt); }
}
if (require.main === module) {
  const args = process.argv.slice(2);
  let cwd = process.cwd(), profile = 'default';
  try {
    for (let i = 0; i < args.length; i++) {
      if (!['--cwd', '--profile'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: run-checks.js [--cwd project] [--profile name]');
      if (args[i] === '--cwd') cwd = args[++i]; else profile = args[++i];
    }
    run(cwd, profile).then(result => { console.log(JSON.stringify(result)); process.exitCode = result.exitCode; }).catch(e => { console.error(`GSR unverified: ${e.message}`); process.exitCode = 2; });
  } catch (e) { console.error(`GSR unverified: ${e.message}`); process.exitCode = 2; }
}
module.exports = { run, execute };
