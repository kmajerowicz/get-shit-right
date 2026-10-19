'use strict';
const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { discover } = require('../gsr/lib/project');
const evidence = require('../gsr/lib/evidence');
const ROOT = path.resolve(__dirname, '..'); const fixtures = path.join(__dirname, 'fixtures/phase-4');
const copy = value => JSON.parse(JSON.stringify(value));
async function fixture(fn) {
 const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-autopilot-')));
 const write = (name, value) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value, null, 2)); };
 execFileSync('git', ['-C', root, 'init', '-q']);
 write('.gsr.json', { schemaVersion: 1, docRoot: './docs/', checks: [{ id: 'booking', argv: [process.execPath, 'test-booking.js'], kind: 'test' }, { id: 'required-extra', argv: [process.execPath, '-e', 'void 0'], kind: 'static' }], profiles: { default: ['booking'], focused: ['booking'] } });
 write('docs/features/booking.md', fs.readFileSync(path.join(fixtures, 'booking.md'), 'utf8'));
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8'));
 write('test-booking.js', "const assert=require('assert/strict');const {reserve}=require('./src/booking');const rows=[];reserve({name:'Synthetic',time:'09:00'},rows);assert.equal(rows.length,1);assert.throws(()=>reserve({name:'Synthetic',time:'bad'},rows));assert.equal(rows.length,1);");
 write('docs/STATE.md', '# Existing project\n\n## Active Task\n**Objective:** Guest booking\n\n## Other\nPreserve this section.\n');
 write('.gitignore', 'docs/work/\n');
 const project = () => discover(root);
 const def = () => JSON.parse(fs.readFileSync(path.join(fixtures, 'impact.json'), 'utf8'));
 try { return await fn({ root, write, project, def }); }
 finally { fs.rmSync(evidence.directory(project()), { recursive: true, force: true }); fs.rmSync(root, { recursive: true, force: true }); }
}

test('impact reads only explicit sources; same-ID wording, source edit and deletion invalidate map; default keeps all required', () => fixture(({ root, write, project, def }) => {
 const { prepareImpact, inspectImpact } = require('../gsr/lib/change-impact');
 const map = prepareImpact(project(), def());
 assert.equal(inspectImpact(project(), map).status, 'current');
 assert.deepEqual(map.sources.map(s => s.ref), ['features/booking.md#Requirements', '@project/src/booking.js']);
 assert.equal(map.authorized, undefined); assert.equal(map.verified, undefined);
 assert.deepEqual(require('../gsr/lib/config').select(project()).checks.map(c => c.id), ['booking', 'required-extra']);
 write('docs/features/booking.md', fs.readFileSync(path.join(fixtures, 'booking.md'), 'utf8').replace('accept a guest booking', 'require an account'));
 assert.equal(inspectImpact(project(), map).status, 'stale');
 const next = prepareImpact(project(), def()); write('src/booking.js', '// external change');
 assert.equal(inspectImpact(project(), next).status, 'stale');
 const last = prepareImpact(project(), def()); fs.unlinkSync(path.join(root, 'src/booking.js'));
 assert.equal(inspectImpact(project(), last).status, 'stale');
}));

test('partial maps disclose gaps; absent links are incomplete, not evidence of no impact', () => fixture(({ project, def }) => {
 const { prepareImpact, inspectImpact } = require('../gsr/lib/change-impact');
 const input = def(); input.coverage = 'partial'; input.gaps = ['Inspect calendar integration']; input.entries[0].implementation = []; input.entries[0].checks = [];
 const result = inspectImpact(project(), prepareImpact(project(), input));
 assert.equal(result.status, 'incomplete'); assert.ok(result.issues.some(i => i.includes('booking.T1'))); assert.equal(result.verificationProfile, 'default');
}));

test('unsafe, ambiguous, malformed and unknown-check impact references are diagnostic; forged snapshots cannot report current', () => fixture(({ root, write, project, def }) => {
 const { prepareImpact, inspectImpact } = require('../gsr/lib/change-impact');
 for (const ref of ['../../escape', '/tmp/file', '@project/../escape', 'features/absent.md', '@project/docs/STATE.md']) {
  const d = def(); d.entries[0].requirement.ref = ref; assert.throws(() => prepareImpact(project(), d));
 }
 fs.symlinkSync(os.tmpdir(), path.join(root, 'outside'));
 const d = def(); d.entries[0].implementation = [{ ref: '@project/outside/file' }]; assert.throws(() => prepareImpact(project(), d), /escape/);
 const unknown = def(); unknown.entries[0].checks = ['nonexistent']; assert.throws(() => prepareImpact(project(), unknown), /check/);
 const duplicate = def(); duplicate.entries.push(duplicate.entries[0]); assert.throws(() => prepareImpact(project(), duplicate), /unique/);
 const map = prepareImpact(project(), def()); map.sources = []; assert.equal(inspectImpact(project(), map).status, 'diagnostic');
 write('docs/features/booking.md', '## Requirements\nA\n## Requirements\nB'); assert.throws(() => prepareImpact(project(), def()), /duplicate|Ambiguous/);
}));

const policy = () => ({ constraints: ['Preserve appearance', 'No publication'], exclusions: ['No production data'], authorization: { source: 'Owner instruction 2026-10-15', date: '2026-10-15', scope: 'Local implementation and checks' }, reviewCadence: 'Continue within scope', reviewAfterEachTask: false, decisionRefs: [{ ref: 'features/booking.md#Open-Decisions' }], contextRefs: [], limits: { maxAttempts: 4, maxSteps: 4 } });
const task = (id = 'guest') => ({ id, objective: 'Accept a guest booking', doneWhen: 'Guest is stored; invalid time does not write', requirements: ['booking.T1', 'booking.T2'], dependsOn: [], constraints: ['Retain time validation'], extraRefs: [] });
test('task package inherits full boundaries, single decision owner and real source fragments without unrelated reads', () => fixture(({ write, project, def }) => {
 const { prepareImpact } = require('../gsr/lib/change-impact'); const { preparePackage, inspectPackage } = require('../gsr/lib/task-package');
 write('private-unrelated.txt', 'MUST_NOT_ENTER_CONTEXT');
 const map = prepareImpact(project(), def()); const packet = preparePackage(project(), map, task(), policy());
 assert.deepEqual(packet.constraints, ['Preserve appearance', 'No publication', 'Retain time validation']);
 assert.ok(packet.exclusions.includes('No redesign')); assert.ok(packet.exclusions.includes('No production data'));
 assert.equal(packet.policy.authorization.source, policy().authorization.source); assert.equal(packet.policy.reviewCadence, 'Continue within scope');
 assert.ok(packet.sources.some(s => /booking.D1/.test(s.excerpt))); assert.ok(packet.sources.some(s => /Account required/.test(s.excerpt)));
 assert.doesNotMatch(JSON.stringify(packet), /MUST_NOT_ENTER_CONTEXT/); assert.equal(inspectPackage(project(), map, packet).status, 'current');
 write('src/booking.js', '// changed'); assert.equal(inspectPackage(project(), map, packet).status, 'stale');
}));
test('packages reject missing authority context, stale/incomplete maps and unbounded reads; named gaps require an expansion plan', () => fixture(({ write, project, def }) => {
 const { prepareImpact } = require('../gsr/lib/change-impact'); const { preparePackage } = require('../gsr/lib/task-package');
 const map = prepareImpact(project(), def()); const missing = policy(); delete missing.authorization;
 assert.throws(() => preparePackage(project(), map, task(), missing), /authorization/);
 const unknown = task(); unknown.requirements = ['unknown']; assert.throws(() => preparePackage(project(), map, unknown, policy()), /requirement/);
 const many = task(); many.extraRefs = Array.from({ length: 6 }, (_, i) => { write(`docs/research/${i}.md`, `## Finding\nResearch ${i}`); return { ref: `research/${i}.md` }; });
 assert.throws(() => preparePackage(project(), map, many, policy()), /six|Six/);
 many.readExpansion = 'Inspect six provider findings for the documented integration gap';
 assert.equal(preparePackage(project(), map, many, policy()).sources.length, 9);
 const partial = def(); partial.gaps = ['Calendar integration unresolved']; const incomplete = prepareImpact(project(), partial);
 assert.throws(() => preparePackage(project(), incomplete, task(), policy()), /incomplete/);
 const expanded = task(); expanded.gapPlan = 'Inspect calendar integration before the affected write; continue independent local validator';
 assert.equal(preparePackage(project(), incomplete, expanded, policy()).mapStatus, 'incomplete');
 write('src/booking.js', 'changed'); assert.throws(() => preparePackage(project(), map, task(), policy()), /stale/);
}));

const current = () => ({ operation: 'implement', source: 'Current owner instruction: implement locally, no publication' });
const runner = root => spawnSync(process.execPath, [path.join(ROOT, 'gsr/scripts/run-checks.js'), '--cwd', root], { encoding: 'utf8' });
const prepare = (p, def, tasks = [task()], boundaries = policy()) => require('../gsr/lib/execution-queue').prepareQueue(p, 'guest-booking', require('../gsr/lib/change-impact').prepareImpact(p, def), tasks, boundaries);
const persist = (write, definition) => write('docs/work/booking/context.json', definition);

test('actual guest booking edit, full runner, checkpoint save and explicit refresh keep honest progress/freshness', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); let definition = prepare(project(), def()); persist(write, definition);
 q.initialize(project(), definition, current());
 const original = fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8');
 const started = q.start(project(), definition, current(), 'Remove the account precondition, retain time validation');
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8').replace("  if (!input.account) throw new Error('Account required');\n", ''));
 assert.equal(runner(root).status, 0);
 assert.equal(q.record(project(), definition, current(), started.attemptId).status, 'checked');
 assert.equal(evidence.observe(project()).status, 'passing'); // STATE progress is administrative.
 assert.equal(q.observeQueue(project(), definition).status, 'reconciliation-required'); // Old map, not magically restamped.
 definition = prepare(project(), def()); persist(write, definition);
 assert.equal(evidence.observe(project()).status, 'stale'); // Context definitions remain inputs even ignored.
 assert.equal(runner(root).status, 0);
 q.reconcile(project(), definition, current(), 'Inspected guest change against both requirements and current full default tests', ['guest']);
 assert.equal(q.observeQueue(project(), definition).status, 'checked'); assert.equal(evidence.observe(project()).status, 'passing');
 assert.match(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8'), /Preserve this section/); assert.ok(original.includes('Active Task'));
 write('src/booking.js', '// external edit after checked');
 assert.equal(q.observeQueue(project(), definition).status, 'reconciliation-required');
 assert.equal(q.observeQueue(project(), definition).state.tasks[0].status, 'checked');
}));

test('new run IDs do not hide repeated failures; blocked same approach and attempt budgets survive saved checkpoints', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const boundaries = policy(); boundaries.limits.maxAttempts = 2;
 const definition = prepare(project(), def(), [task()], boundaries); persist(write, definition); q.initialize(project(), definition, current());
 for (let i = 0; i < 2; i++) {
  const started = q.start(project(), definition, current(), 'Repeat unchanged implementation'); assert.equal(runner(root).status, 1);
  const result = q.record(project(), definition, current(), started.attemptId);
  assert.equal(result.status, i ? 'blocked' : 'pending'); assert.equal(result.repeatedOutcome, i + 1);
 }
 assert.equal(q.observeQueue(project(), definition).state.tasks[0].attempts.length, 2);
 assert.throws(() => q.start(project(), definition, current(), 'Different strategy'), /budget/);
 assert.equal(q.observeQueue(project(), definition).cost, null);
}));

test('review-only and requested waits prevent writes; one running step, invalid dependencies and corrupt STATE are diagnostic', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const boundaries = policy(); boundaries.reviewAfterEachTask = true;
 const second = task('invalid-time'); second.dependsOn = ['guest']; const definition = prepare(project(), def(), [task(), second], boundaries); persist(write, definition);
 q.initialize(project(), definition, current());
 const before = fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8');
 assert.throws(() => q.start(project(), definition, { operation: 'review', source: 'Now review only' }, 'Inspect'), /review/);
 assert.equal(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8'), before);
 const started = q.start(project(), definition, current(), 'Local guest fix'); assert.throws(() => q.start(project(), definition, current(), 'Second simultaneously'), /running/);
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8').replace("  if (!input.account) throw new Error('Account required');\n", '')); assert.equal(runner(root).status, 0);
 q.record(project(), definition, current(), started.attemptId);
 const refreshed = prepare(project(), def(), [task(), second], boundaries); persist(write, refreshed); assert.equal(runner(root).status, 0);
 q.reconcile(project(), refreshed, current(), 'Reviewed guest implementation and preserved next validation step', ['guest']);
 assert.throws(() => q.start(project(), refreshed, current(), 'Validate next'), /review boundary/);
 const next = q.start(project(), refreshed, { ...current(), reviewedThrough: 'guest' }, 'After actual requested review, verify invalid time');
 assert.equal(next.task, 'invalid-time');
 const malformed = copy(second); malformed.dependsOn = ['future']; assert.throws(() => prepare(project(), def(), [malformed]), /precede/);
 write('docs/STATE.md', '## Execution Queue\n**Checkpoint:** {broken}\n'); assert.equal(q.observeQueue(project(), refreshed).status, 'diagnostic');
 write('docs/STATE.md', before + '\n## Execution Queue\nDuplicate'); assert.equal(q.observeQueue(project(), refreshed).status, 'diagnostic');
}));

const cli = (root, action, request) => spawnSync(process.execPath, [path.join(ROOT, 'gsr/scripts/autopilot.js'), action, '--cwd', root, '--file', 'work/booking/context.json', ...(request ? ['--input', '-'] : [])], { input: request ? JSON.stringify(request) : undefined, encoding: 'utf8' });
test('real process interruption retains running attempt; fresh process resumes inspection and records failure without resetting counters', () => fixture(async ({ root, write, project, def }) => {
 const { spawn } = require('child_process'); const definition = prepare(project(), def()); persist(write, definition);
 assert.equal(cli(root, 'initialize', { current: current() }).status, 0);
 const script = "const fs=require('fs');const q=require(process.argv[1]);const p=require(process.argv[2]).discover(process.argv[3]);const d=JSON.parse(fs.readFileSync(process.argv[4]));const a=q.start(p,d,{operation:'implement',source:'Current local task'},'Interrupted first attempt');process.stdout.write(JSON.stringify(a)+'\\n');setInterval(()=>{},1000);";
 const child = spawn(process.execPath, ['-e', script, path.join(ROOT, 'gsr/lib/execution-queue.js'), path.join(ROOT, 'gsr/lib/project.js'), root, path.join(root, 'docs/work/booking/context.json')], { stdio: ['ignore', 'pipe', 'pipe'] });
 const closed = new Promise(resolve => child.on('close', (code, signal) => resolve({ code, signal })));
 let output = '';
 await new Promise((resolve, reject) => {
  const timer = setTimeout(() => { child.kill('SIGTERM'); reject(new Error('No checkpoint readiness output')); }, 5000);
  child.once('error', error => { clearTimeout(timer); reject(error); });
  child.stdout.on('data', bytes => { output += bytes; if (output.includes('\n')) { clearTimeout(timer); resolve(); } });
  child.on('close', code => { if (!output.includes('\n')) { clearTimeout(timer); reject(new Error(`Child exited before checkpoint: ${code}`)); } });
 });
 child.kill('SIGTERM'); assert.equal((await closed).signal, 'SIGTERM');
 const fresh = JSON.parse(cli(root, 'inspect').stdout); assert.equal(fresh.status, 'interrupted-or-running'); assert.equal(fresh.state.starts, 1);
 const attemptId = JSON.parse(output.trim()).attemptId;
 assert.equal(runner(root).status, 1);
 const recorded = cli(root, 'record', { current: current(), attemptId }); assert.equal(recorded.status, 0); assert.equal(JSON.parse(recorded.stdout).status, 'pending');
 const second = cli(root, 'start', { current: current(), approach: 'Inspect the actual account guard failure' }); assert.equal(second.status, 0);
 assert.equal(JSON.parse(cli(root, 'inspect').stdout).state.starts, 2);
}));

test('before/after report uses actual CLI output artifacts, keeps unobserved gaps and stale verification separate', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const { outcomeReport } = require('../gsr/lib/outcome-report');
 const probe = () => spawnSync(process.execPath, ['-e', "const rows=[];try{const result=require('./src/booking').reserve({name:'Synthetic',time:'09:00'},rows);console.log(JSON.stringify({result,rows}));}catch(error){console.log(JSON.stringify({error:error.message,rows}));}"], { cwd: root, encoding: 'utf8' }).stdout.trim();
 write('docs/work/booking/before.json', probe());
 const definition = prepare(project(), def()); persist(write, definition); q.initialize(project(), definition, current());
 const started = q.start(project(), definition, current(), 'Remove account requirement');
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8').replace("  if (!input.account) throw new Error('Account required');\n", ''));
 write('docs/work/booking/after.json', probe()); assert.equal(runner(root).status, 0); q.record(project(), definition, current(), started.attemptId);
 const report = outcomeReport(project(), definition, [{ phase: 'before', label: 'Guest call', source: { ref: 'work/booking/before.json' } }, { phase: 'after', label: 'Guest call', source: { ref: 'work/booking/after.json' } }, { phase: 'after', label: 'Production database' }]);
 assert.match(report.beforeAfter[0].content, /Account required/); assert.match(report.beforeAfter[1].content, /Synthetic/); assert.match(report.beforeAfter[1].content, /09:00/);
 assert.equal(report.beforeAfter[2].status, 'unobserved'); assert.equal(report.humanAcceptance, 'unobserved'); assert.equal(report.cost, null); assert.equal(report.verification.status, 'passing');
 write('src/booking.js', '// external source change'); const stale = outcomeReport(project(), definition);
 assert.equal(stale.verification.status, 'stale'); assert.equal(stale.work[0].checkpoint, 'checked'); assert.equal(stale.execution, 'reconciliation-required');
}));

test('unavailable required check and latest failing evidence cannot yield checked even when a caller masks runner failure', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const definition = prepare(project(), def()); persist(write, definition); q.initialize(project(), definition, current());
 const started = q.start(project(), definition, current(), 'Observe actual configured failures');
 const masked = spawnSync('/bin/sh', ['-c', '"$1" "$2" --cwd "$3" || true', 'fixture', process.execPath, path.join(ROOT, 'gsr/scripts/run-checks.js'), root]);
 assert.equal(masked.status, 0); assert.equal(q.record(project(), definition, current(), started.attemptId).status, 'pending');
 const next = q.start(project(), definition, current(), 'Check unavailable tool boundary');
 const config = JSON.parse(fs.readFileSync(path.join(root, '.gsr.json'))); config.checks[0].argv = ['gsr-definitely-unavailable-tool']; write('.gsr.json', config);
 assert.equal(runner(root).status, 2); const result = q.record(project(), definition, current(), next.attemptId);
 assert.equal(result.verification, 'unverified'); assert.notEqual(result.status, 'checked');
}));

test('STATE section update ignores fenced headings and preserves unrelated bytes; forged checked task stays diagnostic', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue');
 const original = '# Project\n\n```md\n## Execution Queue\nnot a real queue\n```\n\n## Other\nKeep me exactly.\n'; write('docs/STATE.md', original);
 const definition = prepare(project(), def()); persist(write, definition); q.initialize(project(), definition, current());
 assert.ok(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8').startsWith(original));
 const loaded = q.storage(project()).state; loaded.tasks[0].status = 'checked';
 write('docs/STATE.md', `## Execution Queue\n**Checkpoint:** ${JSON.stringify(loaded)}\n`);
 assert.equal(q.observeQueue(project(), definition).status, 'diagnostic');
}));

test('internal CLI prepares and refreshes covered definitions; request stdin does not stale fresh evidence', () => fixture(({ root, write, project, def }) => {
 const request = { id: 'guest-booking', impact: def(), tasks: [task()], policy: policy(), current: current() };
 assert.equal(cli(root, 'prepare', request).status, 0); assert.equal(cli(root, 'initialize', { current: current() }).status, 0);
 assert.equal(cli(root, 'prepare', request).status, 2); // No reset/overwrite shortcut.
 const started = JSON.parse(cli(root, 'start', { current: current(), approach: 'Remove login guard and verify storage/validation' }).stdout);
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8').replace("  if (!input.account) throw new Error('Account required');\n", ''));
 assert.equal(runner(root).status, 0);
 assert.equal(JSON.parse(cli(root, 'record', { current: current(), attemptId: started.attemptId }).stdout).status, 'checked');
 assert.equal(evidence.observe(project()).status, 'passing');
 assert.equal(cli(root, 'refresh', { ...request, reason: 'Inspected both requirement links after local guest fix' }).status, 0);
 assert.equal(cli(root, 'inspect').status, 2); // Definition refresh requires explicit reconciliation.
 assert.equal(runner(root).status, 0);
 assert.equal(cli(root, 'reconcile', { current: current(), reason: 'Current guest requirement and time validation reviewed against actual code', reviewedTasks: ['guest'] }).status, 0);
 assert.equal(JSON.parse(cli(root, 'report').stdout).verification.status, 'passing');
}));

test('identical blocked approach cannot retry, a changed approach remains bounded by the persistent step limit', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const boundaries = policy(); boundaries.limits.maxSteps = 3;
 const definition = prepare(project(), def(), [task()], boundaries); persist(write, definition); q.initialize(project(), definition, current());
 for (let i = 0; i < 2; i++) { const a = q.start(project(), definition, current(), 'Unchanged approach'); runner(root); q.record(project(), definition, current(), a.attemptId); }
 assert.throws(() => q.start(project(), definition, current(), 'Unchanged approach'), /No progress/);
 const changed = q.start(project(), definition, current(), 'Inspect actual guard and validation separately'); runner(root); q.record(project(), definition, current(), changed.attemptId);
 assert.throws(() => q.start(project(), definition, current(), 'Another strategy'), /Step.*budget/);
 assert.equal(q.observeQueue(project(), definition).state.starts, 3);
}));

test('latest failed run defeats an older green for the next step; inspect/report preserve history and write no files', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue');
 write('src/booking.js', fs.readFileSync(path.join(fixtures, 'booking.js'), 'utf8').replace("  if (!input.account) throw new Error('Account required');\n", ''));
 write('test-booking.js', "if(process.env.GSR_FIXTURE_FAIL==='1') throw new Error('Injected latest failure'); const rows=[];require('./src/booking').reserve({name:'Synthetic',time:'09:00'},rows);require('assert/strict').equal(rows.length,1);");
 const second = task('validation'); second.dependsOn = ['guest']; const definition = prepare(project(), def(), [task(), second]); persist(write, definition); q.initialize(project(), definition, current());
 const first = q.start(project(), definition, current(), 'Inspect existing guest fix'); assert.equal(runner(root).status, 0); q.record(project(), definition, current(), first.attemptId);
 const next = q.start(project(), definition, current(), 'Validate current behavior');
 const fail = spawnSync(process.execPath, [path.join(ROOT, 'gsr/scripts/run-checks.js'), '--cwd', root], { env: { ...process.env, GSR_FIXTURE_FAIL: '1' }, encoding: 'utf8' }); assert.equal(fail.status, 1);
 assert.equal(q.record(project(), definition, current(), next.attemptId).status, 'pending');
 const snapshot = () => fs.readdirSync(root, { recursive: true }).filter(f => fs.statSync(path.join(root, f)).isFile()).map(f => [f, fs.readFileSync(path.join(root, f)).toString('base64')]);
 const before = snapshot(); const report = JSON.parse(cli(root, 'report').stdout);
 assert.equal(report.verification.status, 'failed'); assert.equal(report.work[0].checkpoint, 'checked'); assert.equal(report.work[1].checkpoint, 'pending');
 cli(root, 'inspect'); assert.deepEqual(snapshot(), before);
}));

test('refresh cannot silently remove boundaries or enlarge a budget; explicit changed user instruction is retained in covered context', () => fixture(({ root, project, def }) => {
 const request = { id: 'guest-booking', impact: def(), tasks: [task()], policy: policy(), current: current() };
 assert.equal(cli(root, 'prepare', request).status, 0);
 const changed = copy(request); changed.policy.constraints = []; changed.policy.limits.maxAttempts = 20; changed.reason = 'Revise task metadata';
 assert.equal(cli(root, 'refresh', changed).status, 2);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'docs/work/booking/context.json'))).policy.limits.maxAttempts, 4);
 // This field must name an actual new user instruction in real use, never inferred authority.
 changed.policyChangeSource = 'Synthetic explicit owner instruction for this scenario: widen attempt bound and replace these constraints';
 assert.equal(cli(root, 'refresh', changed).status, 0);
 const stored = JSON.parse(fs.readFileSync(path.join(root, 'docs/work/booking/context.json')));
 assert.equal(stored.policy.changeHistory[0].source, changed.policyChangeSource);
}));

test('cooperating operations honor a live lock and recover a dead helper lock without losing checkpoint history', () => fixture(({ root, write, project, def }) => {
 const q = require('../gsr/lib/execution-queue'); const definition = prepare(project(), def()); persist(write, definition); q.initialize(project(), definition, current());
 const lock = path.join(evidence.directory(project()), 'execution-queue.lock'); const before = fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8');
 fs.writeFileSync(lock, String(process.pid)); assert.throws(() => q.start(project(), definition, current(), 'Concurrent'), /Another queue/);
 assert.equal(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8'), before);
 const dead = execFileSync(process.execPath, ['-e', 'process.stdout.write(String(process.pid))'], { encoding: 'utf8' });
 fs.writeFileSync(lock, dead); q.start(project(), definition, current(), 'Recovered after dead owner');
 assert.equal(fs.existsSync(lock), false); assert.equal(q.storage(project()).state.starts, 1);
}));
