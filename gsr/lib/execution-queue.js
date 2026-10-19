'use strict';
// Sequential host-guided execution bookkeeping. Never executes code or grants authority.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { reference, sections } = require('./task-handoff');
const { preparePackage, inspectPackage, validatePolicy } = require('./task-package');
const { inspectImpact, digest, assert, text, list, strings } = require('./change-impact');
const evidence = require('./evidence'); const { fingerprint } = require('./fingerprint');
function validateQueue(project, definition) {
 assert(definition?.schemaVersion === 1 && definition.project === project.root, 'Invalid/foreign queue definition');
 text(definition.id, 'queue id'); validatePolicy(definition.policy);
 const tasks = list(definition.tasks, 'queue tasks', 128); assert(tasks.length, 'Empty execution queue'); const prior = new Set();
 for (const task of tasks) {
  text(task.id, 'task id'); assert(!prior.has(task.id), 'Queue task IDs must be unique');
  strings(task.dependsOn, 'task dependencies').forEach(id => assert(prior.has(id), `Dependency must precede task (no forward/cyclic dependency): ${id}`));
  // Validate all task/package fields without interpreting authorization or reading files.
  text(task.objective, 'task objective'); text(task.doneWhen, 'doneWhen'); strings(task.requirements, 'requirements'); strings(task.constraints, 'task constraints'); list(task.extraRefs, 'extraRefs'); prior.add(task.id);
 }
 const mapStatus = inspectImpact(project, definition.map);
 assert(['current', 'incomplete', 'stale'].includes(mapStatus.status), `Impact map diagnostic: ${mapStatus.issues.join('; ')}`);
 return mapStatus;
}
function prepareQueue(project, id, map, tasks, policy) {
 const definition = JSON.parse(JSON.stringify({ schemaVersion: 1, project: project.root, id, map, tasks, policy }));
 const current = validateQueue(project, definition); assert(current.status !== 'stale', 'Stale impact map; reconcile before preparing queue');
 for (const task of tasks) preparePackage(project, map, task, policy);
 return definition;
}
function storage(project) {
 const file = reference(project, 'STATE.md').file;
 if (fs.existsSync(file)) assert(!fs.lstatSync(file).isSymbolicLink(), 'STATE write/read through symlink unsupported; reconcile it explicitly');
 const raw = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
 assert(Buffer.byteLength(raw) <= 262144, 'STATE exceeds 256 KiB; reconcile navigation');
 const block = sections(raw, false, null, true).get('Execution Queue');
 let state = null;
 if (block) {
  const match = block.content.match(/^\*\*Checkpoint:\*\* (\{[^\n]+\})$/);
  assert(match, 'Malformed Execution Queue checkpoint');
  try { state = JSON.parse(match[1]); } catch (_) { throw new Error('Malformed Execution Queue JSON'); }
 }
 return { file, raw, block, state };
}
function validateState(definition, state) {
 assert(state?.schemaVersion === 1 && state.id === definition.id && /^[a-f0-9]{64}$/.test(state.definitionDigest) && Number.isSafeInteger(state.starts) && state.starts >= 0 && Array.isArray(state.tasks), 'Invalid/foreign Execution Queue checkpoint');
 assert(state.tasks.length === definition.tasks.length && state.tasks.every((t, i) => t.id === definition.tasks[i].id && ['pending', 'running', 'checked', 'blocked'].includes(t.status) && Array.isArray(t.attempts)), 'Checkpoint tasks do not match definition');
 assert(state.tasks.filter(t => t.status === 'running').length <= 1, 'More than one running task');
 assert((state.starts === 0 && state.ackHash === null) || /^[a-f0-9]{64}$/.test(state.ackHash), 'Missing/invalid checkpoint input identity');
 assert(state.reviewAfter === null || state.tasks.some(t => t.id === state.reviewAfter && t.status === 'checked'), 'Invalid review boundary checkpoint');
 assert(state.starts === state.tasks.reduce((sum, t) => sum + t.attempts.length, 0), 'Attempt counter mismatch');
 for (const task of state.tasks) {
  if (task.status === 'checked') assert(task.attempts.at(-1)?.result?.status === 'passing' && typeof task.attempts.at(-1).result.reference === 'string', 'Checked task lacks recorded actual passing evidence');
  if (task.status === 'running') assert(task.attempts.length && task.attempts.at(-1).result === null, 'Running attempt checkpoint invalid');
 }
 for (const task of state.tasks) for (const attempt of task.attempts) {
  assert(typeof attempt.id === 'string' && typeof attempt.approach === 'string' && Number.isFinite(Date.parse(attempt.startedAt)) && Array.isArray(attempt.sources) && attempt.sources.every(hash => /^[a-f0-9]{64}$/.test(hash)), 'Malformed attempt checkpoint');
  assert(attempt.result === null || (['passing', 'failed', 'stale', 'unverified'].includes(attempt.result?.status) && /^[a-f0-9]{64}$/.test(attempt.result.signature) && (attempt.result.reference === null || typeof attempt.result.reference === 'string')), 'Malformed attempt observation');
 }
 return state;
}
function save(project, previous, state) {
 const latest = storage(project); assert(latest.raw === previous.raw, 'Concurrent STATE change; inspect and retry explicitly');
 const block = `## Execution Queue\n**Checkpoint:** ${JSON.stringify(state)}\n\n`;
 const content = previous.block ? previous.raw.slice(0, previous.block.start) + block + previous.raw.slice(previous.block.end) : previous.raw + (previous.raw.endsWith('\n\n') || !previous.raw ? '' : '\n') + block;
 assert(Buffer.byteLength(content) <= 262144, 'Checkpoint would exceed STATE limit; preserve history and hand off');
 fs.mkdirSync(path.dirname(previous.file), { recursive: true });
 const temp = `${previous.file}.${crypto.randomUUID()}.tmp`;
 try { fs.writeFileSync(temp, content, { mode: 0o600, flag: 'wx' }); fs.renameSync(temp, previous.file); }
 finally { if (fs.existsSync(temp)) fs.unlinkSync(temp); }
}
function locked(project, fn) {
 const base = evidence.directory(project); fs.mkdirSync(base, { recursive: true });
 const file = path.join(base, 'execution-queue.lock');
 const acquire = () => fs.openSync(file, 'wx', 0o600);
 let fd;
 try { fd = acquire(); } catch (e) {
  if (e.code !== 'EEXIST') throw e;
  let owner; try { owner = Number(fs.readFileSync(file, 'utf8')); } catch (_) { /* diagnose below */ }
  assert(Number.isSafeInteger(owner) && owner > 0, 'Queue lock owner unknown; reconcile lock before writing');
  let alive = true; try { process.kill(owner, 0); } catch (error) { if (error.code === 'ESRCH') alive = false; }
  assert(!alive, 'Another queue operation is running'); fs.unlinkSync(file); fd = acquire();
 }
 try { fs.writeFileSync(fd, String(process.pid)); fs.closeSync(fd); fd = undefined; return fn(); }
 finally { if (fd !== undefined) fs.closeSync(fd); fs.unlinkSync(file); }
}
function directive(current) {
 assert(current && ['implement', 'review', 'wait'].includes(current.operation), 'Current operation and source must be reconciled with the latest user instruction');
 text(current.source, 'current instruction source');
 assert(current.operation === 'implement', `Current ${current.operation}: execution/checkpoint writes are not authorized by navigation`);
}
function initialize(project, definition, current) {
 directive(current); validateQueue(project, definition);
 return locked(project, () => {
  const previous = storage(project); assert(!previous.state, 'Checkpoint already exists; inspect/reconcile instead of resetting attempts');
  const state = { schemaVersion: 1, id: definition.id, definitionDigest: digest(definition), starts: 0, ackHash: null, reviewAfter: null, tasks: definition.tasks.map(t => ({ id: t.id, status: 'pending', attempts: [] })) };
  save(project, previous, state); return state;
 });
}
function observeQueue(project, definition) {
 try {
  const map = validateQueue(project, definition); const { state } = storage(project);
  if (!state) return { status: 'absent', map, issues: ['No administrative queue checkpoint'], cost: null };
  validateState(definition, state); const current = evidence.observe(project);
  const issues = [];
  if (state.definitionDigest !== digest(definition)) issues.push('Queue definition changed; reconcile source/constraints and retained work');
  if (map.status === 'stale') issues.push(...map.issues);
  const inputs = fingerprint(project);
  if (state.ackHash && (!inputs.supported || state.ackHash !== inputs.hash)) issues.push('Inputs changed since checkpoint; reconcile implemented work and current verification');
  const running = state.tasks.find(t => t.status === 'running');
  return { status: issues.length ? 'reconciliation-required' : running ? 'interrupted-or-running' : state.tasks.some(t => t.status === 'blocked') ? 'blocked' : state.tasks.every(t => t.status === 'checked') ? 'checked' : 'pending', issues, state, map, verification: { status: current.status, reference: current.reference || null, diagnostic: current.diagnostic || null }, cost: null, limitation: 'Checked work, freshness, behavioral observations and human acceptance are separate; checkpoint is not authority' };
 } catch (e) { return { status: 'diagnostic', issues: [e.message], cost: null }; }
}
function start(project, definition, current, approach) {
 directive(current); text(approach, 'approach');
 return locked(project, () => {
  const observed = observeQueue(project, definition);
  assert(['pending', 'blocked'].includes(observed.status), `Cannot start: ${observed.status}; ${observed.issues.join('; ')}`);
  const previous = storage(project); const state = validateState(definition, previous.state);
  if (state.reviewAfter) assert(current.reviewedThrough === state.reviewAfter, `Requested review boundary after ${state.reviewAfter}; preserve wait until actual review instruction`);
  assert(state.starts < definition.policy.limits.maxSteps, 'Step/attempt-start budget exhausted');
  const item = state.tasks.find(t => t.status !== 'checked'); const task = definition.tasks.find(t => t.id === item.id);
  assert(task.dependsOn.every(id => state.tasks.find(t => t.id === id)?.status === 'checked'), 'Prerequisite not checked');
  assert(item.attempts.length < definition.policy.limits.maxAttempts, 'Task attempt budget exhausted');
  if (item.status === 'blocked') assert(item.attempts.at(-1)?.approach !== approach, 'No progress: change approach within scope or report a concrete blocker');
  const packet = preparePackage(project, definition.map, task, definition.policy);
  assert(['current', 'incomplete'].includes(inspectPackage(project, definition.map, packet).status), 'Context changed: reconcile before execution; incomplete context requires the explicit independent-work gap plan');
  const inputs = fingerprint(project); assert(inputs.supported, inputs.diagnostic);
  const attempt = { id: crypto.randomUUID(), approach, startedAt: new Date().toISOString(), sources: definition.map.sources.map(s => s.hash), result: null };
  item.status = 'running'; item.attempts.push(attempt); state.starts++; state.reviewAfter = null; state.ackHash = inputs.hash;
  save(project, previous, state); return { task: item.id, attemptId: attempt.id, packet };
 });
}
function record(project, definition, current, attemptId) {
 directive(current);
 return locked(project, () => {
  validateQueue(project, definition); const previous = storage(project); const state = validateState(definition, previous.state);
  assert(state.definitionDigest === digest(definition), 'Definition changed during attempt; reconcile before recording');
  const item = state.tasks.find(t => t.status === 'running');
  assert(item && item.attempts.at(-1)?.id === attemptId, 'Attempt ID is not the single current running step');
  const actual = evidence.observe(project); const attempt = item.attempts.at(-1);
  const signature = digest({ sources: definition.map.sources.map(s => {
   try { return require('./change-impact').snapshotSource(project, s.lines ? { ref: s.ref, lines: s.lines } : { ref: s.ref }).hash; } catch (_) { return 'unavailable:' + s.ref; }
  }), status: actual.status, results: (actual.results || []).map(r => ({ id: r.id, status: r.status, exitCode: r.exitCode, signal: r.signal, timedOut: r.timedOut, launchError: r.launchError, stdoutHash: digest(r.stdout || ''), stderrHash: digest(r.stderr || '') })) });
  attempt.result = { status: actual.status, reference: actual.reference || null, signature };
  const repeat = item.attempts.filter(a => a.result?.signature === signature).length;
  item.status = actual.status === 'passing' ? 'checked' : repeat >= 2 || item.attempts.length >= definition.policy.limits.maxAttempts ? 'blocked' : 'pending';
  const inputs = fingerprint(project); state.ackHash = inputs.supported ? inputs.hash : state.ackHash;
  if (item.status === 'checked' && definition.policy.reviewAfterEachTask) state.reviewAfter = item.id;
  save(project, previous, state);
  return { task: item.id, status: item.status, verification: actual.status, reference: actual.reference || null, repeatedOutcome: repeat, next: item.status === 'blocked' ? 'Change approach within scope or report the concrete blocker; attempt limits persist' : item.status === 'checked' ? 'Reconcile current map/sources before the next step; honor review cadence' : 'Inspect the actual failed/unavailable result', cost: null };
 });
}
function reconcile(project, definition, current, reason, reviewedTasks) {
 directive(current); text(reason, 'reconciliation reason'); strings(reviewedTasks, 'reviewedTasks');
 return locked(project, () => {
  const map = validateQueue(project, definition); assert(map.status === 'current', 'Inspect/reprepare stale or incomplete map before reconciliation');
  const previous = storage(project); const state = validateState(definition, previous.state);
  assert(!state.tasks.some(t => t.status === 'running'), 'Running/interrupted attempt must be recorded before reconciliation; preserve attempts');
  const checked = state.tasks.filter(t => t.status === 'checked').map(t => t.id);
  assert(digest([...reviewedTasks].sort()) === digest([...checked].sort()), 'Explicitly review every historically checked task against current requirements');
  const actual = evidence.observe(project);
  if (checked.length) assert(actual.status === 'passing', 'Reconciliation cannot reuse checked steps without current full default evidence');
  // Keep counters/history/status; no unearned completion, budget reset or implicit review release.
  state.definitionDigest = digest(definition); const inputs = fingerprint(project); assert(inputs.supported, inputs.diagnostic); state.ackHash = inputs.hash;
  save(project, previous, state); return { status: 'reconciled', checkedHistory: checked, verification: actual.status, reason, cost: null };
 });
}
module.exports = { prepareQueue, validateQueue, initialize, observeQueue, start, record, reconcile, storage };
