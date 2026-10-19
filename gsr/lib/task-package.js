'use strict';
const { inspectImpact, collectSources, inspectSources, sourceKey, digest, assert, text, strings, list } = require('./change-impact');
function validatePolicy(policy) {
 assert(policy && typeof policy === 'object', 'Task policy required');
 strings(policy.constraints, 'constraints'); strings(policy.exclusions, 'exclusions');
 assert(policy.authorization && typeof policy.authorization === 'object', 'authorization source/date/scope required');
 for (const field of ['source', 'date', 'scope']) text(policy.authorization[field], `authorization.${field}`);
 text(policy.reviewCadence, 'reviewCadence'); assert(typeof policy.reviewAfterEachTask === 'boolean', 'reviewAfterEachTask required');
 list(policy.decisionRefs, 'decisionRefs').forEach(sourceKey); list(policy.contextRefs, 'contextRefs').forEach(sourceKey);
 assert(policy.limits && typeof policy.limits === 'object', 'limits required');
 for (const field of ['maxAttempts', 'maxSteps']) assert(Number.isSafeInteger(policy.limits[field]) && policy.limits[field] >= 1 && policy.limits[field] <= 1000, `${field}: positive bounded integer required`);
}
function packageInputs(map, task, policy) {
 validatePolicy(policy); text(task?.id, 'task id'); text(task.objective, 'task objective'); text(task.doneWhen, 'doneWhen');
 const requirements = strings(task.requirements, 'requirements'); assert(requirements.length && new Set(requirements).size === requirements.length, 'Task requirements must be nonempty and unique');
 strings(task.dependsOn, 'task dependencies'); strings(task.constraints, 'task constraints'); list(task.extraRefs, 'extraRefs').forEach(sourceKey);
 const entries = requirements.map(id => { const entry = map.definition.entries.find(e => e.id === id); assert(entry, `Unknown requirement: ${id}`); return entry; });
 const inputs = [...new Map([...entries.flatMap(e => [e.requirement, ...e.implementation]), ...policy.decisionRefs, ...policy.contextRefs, ...task.extraRefs].map(s => [sourceKey(s), s])).values()];
 if (inputs.length > 6) text(task.readExpansion, 'More than six initial references requires an explicit readExpansion reason');
 assert(inputs.length <= 16, 'Split task: at most sixteen explicitly expanded sources');
 return inputs;
}
function preparePackage(project, map, task, policy) {
 const current = inspectImpact(project, map);
 assert(['current', 'incomplete'].includes(current.status), `Impact map ${current.status}: ${current.issues.join('; ')}`);
 if (current.status === 'incomplete') text(task.gapPlan, 'incomplete map requires an explicit gapPlan and expanded inspection');
 const inputs = packageInputs(map, task, policy); const sources = collectSources(project, inputs);
 assert(sources.reduce((sum, s) => sum + Buffer.byteLength(s.excerpt), 0) <= 98304, 'Context exceeds 96 KiB; split the task, never truncate constraints');
 return JSON.parse(JSON.stringify({ schemaVersion: 1, project: project.root, mapDigest: digest(map), mapStatus: current.status, task, policy, constraints: [...new Set([...policy.constraints, ...task.constraints])], exclusions: [...new Set([...map.definition.exclusions, ...policy.exclusions])], verificationProfile: 'default', sources }));
}
function inspectPackage(project, map, packet) {
 try {
  assert(packet?.schemaVersion === 1 && packet.project === project.root && /^[a-f0-9]{64}$/.test(packet.mapDigest), 'Invalid/foreign task package');
  const inputs = packageInputs(map, packet.task, packet.policy);
  const changes = inspectSources(project, inputs, packet.sources); const current = inspectImpact(project, map);
  if (current.status === 'diagnostic') return current;
  if (packet.mapDigest !== digest(map)) changes.push('Impact map changed; reconcile task package');
  if (current.status === 'stale') changes.push(...current.issues);
  if (changes.length) return { status: 'stale', issues: changes };
  const rebuilt = preparePackage(project, map, packet.task, packet.policy);
  assert(digest(rebuilt) === digest(packet), 'Package fields/constraints do not match current sources and inherited policy');
  return { status: current.status, issues: current.issues, limitation: 'Context is navigation, never new authorization, semantic readiness or evidence' };
 } catch (e) { return { status: 'diagnostic', issues: [e.message] }; }
}
module.exports = { preparePackage, inspectPackage, validatePolicy };
