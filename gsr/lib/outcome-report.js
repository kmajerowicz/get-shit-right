'use strict';
const { observeQueue } = require('./execution-queue');
const { snapshotSource, assert, list, text } = require('./change-impact');
function observations(project, values) {
 return list(values || [], 'observations', 32).map(item => {
  text(item.label, 'observation label');
  assert(['before', 'after'].includes(item.phase), 'Observation phase must be before/after');
  // Explicit observations are source artifacts; intended behavior is never substituted.
  if (!item.source) return { phase: item.phase, label: item.label, status: 'unobserved', reason: 'No observed source artifact' };
  try {
   const actual = snapshotSource(project, item.source);
   return { phase: item.phase, label: item.label, status: 'recorded-artifact', ref: actual.ref, content: actual.excerpt, limitation: 'This artifact is available; its provenance and semantic claim still require inspection' };
  } catch (e) { return { phase: item.phase, label: item.label, status: 'unobserved', reason: e.message }; }
 });
}
function outcomeReport(project, definition, values = []) {
 const observed = observeQueue(project, definition);
 return { objective: definition?.map?.definition?.objective || 'Unknown task', execution: observed.status, work: observed.state?.tasks.map(t => ({ id: t.id, checkpoint: t.status, attempts: t.attempts.length, run: t.attempts.at(-1)?.result?.reference || null })) || [], verification: observed.verification || { status: 'unverified', reference: null }, beforeAfter: observations(project, values), openDecisions: definition?.policy?.decisionRefs || [], issues: observed.issues, cost: null, humanAcceptance: 'unobserved', limitation: 'Historical checked steps do not override stale/failed verification. Artifact text, mocks and build success do not prove persistence, remote behavior or human acceptance. Open decision content belongs to its single source owner.' };
}
module.exports = { outcomeReport };
