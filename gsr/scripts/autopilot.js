#!/usr/bin/env node
'use strict';
// Internal structural helper; no shell, model, product edit or automatic stage execution.
const fs = require('fs'); const path = require('path');
const { discover, inside } = require('../lib/project'); const { reference } = require('../lib/task-handoff');
const { prepareImpact, assert, text, digest } = require('../lib/change-impact'); const queue = require('../lib/execution-queue');
const { outcomeReport } = require('../lib/outcome-report'); const { atomic } = require('../lib/evidence');
function read(project, value) {
 const file = reference(project, value).file;
 assert(fs.statSync(file).size <= 1024 * 1024, 'Input exceeds 1 MiB');
 return JSON.parse(fs.readFileSync(file, 'utf8'));
}
try {
 const args = process.argv.slice(2); const action = args.shift(); const flags = {};
 while (args.length) { const name = args.shift(); assert(['--cwd', '--file', '--input'].includes(name) && !flags[name] && args.length, 'Expected unique --cwd/--file/--input arguments'); flags[name] = args.shift(); }
 assert(flags['--file'], '--file DOC_ROOT-relative context.json is required');
 const project = discover(flags['--cwd'] || process.cwd());
 const file = reference(project, flags['--file']); assert(!file.section, 'Queue file cannot name a section');
 assert(inside(path.join(project.docs, 'work'), file.file) && file.file.endsWith('.json'), 'Queue definition must live in DOC_ROOT/work/*.json (covered requirements input)');
 const request = flags['--input'] === '-' ? JSON.parse(fs.readFileSync(0, 'utf8')) : flags['--input'] ? read(project, flags['--input']) : {};
 assert(Buffer.byteLength(JSON.stringify(request)) <= 1024 * 1024, 'Request exceeds 1 MiB');
 let output;
 if (['prepare', 'refresh'].includes(action)) {
  assert(request.current?.operation === 'implement', 'Preparing durable context requires current authorized implementation work');
  text(request.current.source, 'current instruction source');
  let parent = file.file;
  while (parent !== project.root) { assert(!fs.existsSync(parent) || !fs.lstatSync(parent).isSymbolicLink(), 'Context writes through symlinks unsupported'); parent = path.dirname(parent); }
  let previous = null;
  if (action === 'prepare') assert(!fs.existsSync(file.file), 'Context file exists; inspect/reconcile instead of overwriting it');
  else {
   previous = read(project, flags['--file']); text(request.reason, 'Explicit semantic source/mapping refresh reason');
   assert(request.id === previous.id, 'Refresh cannot change queue identity/reset history');
   assert(!queue.storage(project).state?.tasks.some(t => t.status === 'running'), 'Record the interrupted/running attempt before refresh');
   assert(JSON.stringify(request.tasks.map(t => t.id)) === JSON.stringify(previous.tasks.map(t => t.id)), 'Refresh keeps task identities/order and attempt history');
   const retained = (oldValues, nextValues) => Array.isArray(nextValues) && oldValues.every(value => nextValues.includes(value));
   const retainedRefs = (oldValues, nextValues) => Array.isArray(nextValues) && oldValues.every(value => nextValues.some(next => digest(next) === digest(value)));
   const old = previous.policy, next = request.policy;
   const weakened = !next || !retained(old.constraints, next.constraints) || !retained(old.exclusions, next.exclusions) || !retained(previous.map.definition.exclusions, request.impact.exclusions) ||
    previous.tasks.some((task, index) => !retained(task.constraints, request.tasks[index].constraints)) ||
    !retainedRefs(old.decisionRefs, next.decisionRefs) || !retainedRefs(old.contextRefs, next.contextRefs) ||
    next.limits?.maxAttempts > old.limits.maxAttempts || next.limits?.maxSteps > old.limits.maxSteps ||
    (old.reviewAfterEachTask && !next.reviewAfterEachTask) || next.reviewCadence !== old.reviewCadence || digest(next.authorization) !== digest(old.authorization);
   if (request.policy && old.changeHistory) request.policy.changeHistory = old.changeHistory;
   if (weakened) {
    text(request.policyChangeSource, 'Explicit latest user policy-change source required to alter retained boundaries; do not fabricate or ask again for existing authority');
    request.policy = { ...request.policy, changeHistory: [...(old.changeHistory || []), { previousPolicyDigest: digest(old), previousDefinitionDigest: digest(previous), source: request.policyChangeSource }] };
   }

  }
  const map = prepareImpact(project, request.impact);
  const definition = queue.prepareQueue(project, request.id, map, request.tasks, request.policy);
  fs.mkdirSync(path.dirname(file.file), { recursive: true }); atomic(file.file, definition);
  output = { status: 'prepared-context', file: file.relative, limitation: 'No execution checkpoint or product work started; reconcile current authority separately' };
 } else {
  const definition = read(project, flags['--file']);
  if (action === 'inspect') output = queue.observeQueue(project, definition);
  else if (action === 'initialize') output = queue.initialize(project, definition, request.current);
  else if (action === 'start') output = queue.start(project, definition, request.current, request.approach);
  else if (action === 'record') output = queue.record(project, definition, request.current, request.attemptId);
  else if (action === 'reconcile') output = queue.reconcile(project, definition, request.current, request.reason, request.reviewedTasks);
  else if (action === 'report') output = outcomeReport(project, definition, request.observations || []);
  else throw new Error('Unknown action: prepare, refresh, inspect, initialize, start, record, reconcile, report');
 }
 process.stdout.write(JSON.stringify(output, null, 2) + '\n');
 if (['diagnostic', 'reconciliation-required', 'blocked'].includes(output.status)) process.exitCode = 2;
} catch (e) { process.stdout.write(JSON.stringify({ status: 'diagnostic', issues: [e.message] }) + '\n'); process.exitCode = 2; }
