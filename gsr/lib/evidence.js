'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
function directory(project) { return path.join(os.tmpdir(), 'gsr-v1', crypto.createHash('sha256').update(project.root).digest('hex'), 'evidence'); }
function atomic(file, value) {
  const temp = `${file}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(temp, file);
}
function begin(project, selection, before) {
  const startedAt = new Date().toISOString();
  const runId = `${Math.floor((require('perf_hooks').performance.timeOrigin + require('perf_hooks').performance.now()) * 1000).toString().padStart(17, '0')}-${crypto.randomUUID()}`;
  const dir = path.join(directory(project), runId);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const record = { schemaVersion: 1, runId, project: { root: project.root, git: project.git, docRoot: project.docRoot }, startedAt, endedAt: null, profile: selection.profile, selectedCheckIds: selection.checks.map(c => c.id), checks: selection.checks, configFingerprint: selection.configFingerprint, inputBefore: before, inputAfter: null, results: [], status: 'unverified', diagnostic: 'Run incomplete' };
  atomic(path.join(dir, 'start.json'), { schemaVersion: 1, runId, startedAt, profile: selection.profile });
  atomic(path.join(dir, 'record.json'), record);
  return { dir, record };
}
function finish(run) { atomic(path.join(run.dir, 'record.json'), run.record); }
function validRecord(record, name, project, profile) {
  if (record.runId !== name || record.project?.root !== project.root || record.profile !== profile || !Array.isArray(record.results) || !Array.isArray(record.checks) || !Array.isArray(record.selectedCheckIds)) return false;
  const ids = record.checks.map(c => c.id);
  if (new Set(ids).size !== ids.length || JSON.stringify(ids) !== JSON.stringify(record.selectedCheckIds)) return false;
  try { require('./config').validate({ schemaVersion: 1, checks: record.checks }, project.root); } catch (_) { return false; }
  if (record.results.some(r => !ids.includes(r.id) || !['passed', 'failed', 'unavailable'].includes(r.status)) || new Set(record.results.map(r => r.id)).size !== record.results.length) return false;
  for (const r of record.results) {
    if (r.status === 'passed' && (r.exitCode !== 0 || r.signal || r.timedOut || r.launchError)) return false;
    if (r.status === 'failed' && r.exitCode === 0 && !r.signal && !r.timedOut) return false;
  }
  if (!record.endedAt) return record.status === 'unverified';
  if (!Number.isFinite(Date.parse(record.startedAt)) || !Number.isFinite(Date.parse(record.endedAt))) return false;
  if (record.status === 'passing') {
    const required = record.checks.filter(c => c.required !== false);
    if (!required.length || record.results.length !== record.checks.length || required.some(c => record.results.find(r => r.id === c.id)?.status !== 'passed') || record.results.some(r => r.status === 'unavailable')) return false;
    if (!record.inputBefore?.supported || !record.inputAfter?.supported || !/^[a-f0-9]{64}$/.test(record.inputAfter.hash) || record.inputBefore.hash !== record.inputAfter.hash || record.exitCode !== 0) return false;
  }
  return ['unverified', 'stale', 'failed', 'passing'].includes(record.status);
}
function latest(project, profile = 'default') {
  const base = directory(project);
  if (!fs.existsSync(base)) return { status: 'unverified', diagnostic: 'No evidence' };
  const dirs = fs.readdirSync(base).filter(name => /^\d{17}-[\w-]+$/.test(name)).sort().reverse();
  for (const name of dirs) {
    const dir = path.join(base, name);
    let start;
    try { start = JSON.parse(fs.readFileSync(path.join(dir, 'start.json'), 'utf8')); }
    catch (_) { return { status: 'unverified', diagnostic: 'Corrupt latest run metadata', reference: dir }; }
    if (!start || typeof start !== 'object' || start.runId !== name || !Number.isFinite(Date.parse(start.startedAt)) || typeof start.profile !== 'string' || !start.profile) return { status: 'unverified', diagnostic: 'Corrupt latest run metadata', reference: dir };
    if (start.schemaVersion !== 1) return { status: 'unverified', diagnostic: 'Unsupported evidence schema', reference: dir };
    if (start.profile !== profile) continue;
    try {
      const record = JSON.parse(fs.readFileSync(path.join(dir, 'record.json'), 'utf8'));
      if (record.schemaVersion !== 1) throw new Error('Unsupported evidence schema');
      if (!validRecord(record, name, project, profile)) throw new Error('Invalid evidence record');
      return { ...record, reference: path.join(dir, 'record.json') };
    } catch (e) { return { status: 'unverified', diagnostic: e.message === 'Unsupported evidence schema' ? e.message : 'Corrupt latest evidence', reference: dir }; }
  }
  return { status: 'unverified', diagnostic: 'No evidence for selected profile' };
}
function observe(project, profile = 'default') {
  const record = latest(project, profile);
  if (!record.endedAt) return { ...record, status: 'unverified', diagnostic: record.diagnostic || 'Run incomplete' };
  let selected;
  try { selected = require('./config').select(project, profile); }
  catch (e) { return { ...record, status: 'unverified', diagnostic: e.message }; }
  if (selected.configFingerprint === record.configFingerprint && JSON.stringify(selected.checks) !== JSON.stringify(record.checks)) return { ...record, status: 'unverified', diagnostic: 'Evidence check configuration does not match selected checks' };
  const now = require('./fingerprint').fingerprint(project);
  if (!now.supported || !record.inputAfter?.supported) return { ...record, status: 'unverified', diagnostic: [...new Set([record.diagnostic, now.diagnostic || 'Freshness unavailable'].filter(Boolean))].join('; ') };
  if (selected.configFingerprint !== record.configFingerprint || now.hash !== record.inputAfter.hash || record.inputBefore?.hash !== record.inputAfter.hash) return { ...record, status: 'stale', diagnostic: 'Inputs/config changed; rerun relevant checks' };
  return record;
}
module.exports = { directory, atomic, begin, finish, latest, observe };
