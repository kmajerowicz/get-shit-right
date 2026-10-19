'use strict';
// Read-only structural handoff observations. Never executes stages or decides authority.
const fs = require('fs');
const { reference, sections } = require('./task-handoff');
const STEPS = ['scope', 'prd', 'build', 'verify', 'debug', 'learn', 'quick', 'status', 'none'];
const CHECKPOINTS = ['completed', 'checked-increment', 'partial'];
function checkReference(item) {
  if (!fs.existsSync(item.file)) return `Reference missing: ${item.relative}`;
  if (item.section) {
    if (!item.relative.endsWith('.md')) return 'Section reference requires a Markdown heading';
    const normalize = value => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
    const names = [...sections(fs.readFileSync(item.file, 'utf8'), true).keys()];
    const matched = names.filter(name => normalize(name) === normalize(item.section));
    if (matched.length > 1) return `Ambiguous reference section: ${item.relative}#${item.section}`;
    if (!matched.length) return `Reference section missing: ${item.relative}#${item.section}`;
  }
  return null;
}
function inspectPacket(project, task) {
  if (!task) return { status: 'absent', references: [], issues: [] };
  if (task.diagnostics?.length) return { status: 'diagnostic', references: [], issues: task.diagnostics };
  const fields = task.fields;
  if (!fields['context handoff']) return { status: 'legacy', references: [], issues: [], diagnostic: 'Legacy Active Task: read its current reference/next action; reconcile missing stage context.' };
  const issues = []; const references = [];
  for (const key of ['objective', 'constraints', 'authorized scope', 'authorization', 'review cadence', 'plan/task', 'stage', 'checkpoint', 'next step', 'next action', 'completed work', 'remaining work', 'open questions']) {
    if (!fields[key]?.trim()) issues.push(`Missing handoff field: ${key}`);
  }
  if (!CHECKPOINTS.includes(fields.checkpoint)) issues.push('Unknown checkpoint: use completed, checked-increment or partial');
  if (!STEPS.includes(fields['next step'])) issues.push('Unknown next step: reconcile current task');
  let taskReference;
  try {
    taskReference = reference(project, fields['plan/task']);
    const problem = checkReference(taskReference); if (problem) issues.push(problem);
  } catch (e) { issues.push(e.message); }
  const read = fields['read next'] || '';
  if ((read.match(/`/g) || []).length % 2) issues.push('Unclosed Read next reference delimiter');
  const matches = [...read.matchAll(/`([^`]+)`/g)].map(m => m[1]);
  if (!matches.length && fields['next step'] !== 'none') issues.push('Read next requires explicit backticked file/section references');
  if (matches.length > 6) issues.push('Read next is not bounded: at most six initial references, expand only for actual gaps');
  if (new Set(matches).size !== matches.length) issues.push('Duplicate Read next references');
  if (fields['next step'] === 'none' && fields.checkpoint !== 'completed') issues.push('A partial/in-progress checkpoint cannot declare no next step');
  for (const value of matches.slice(0, 6)) {
    try {
      const item = reference(project, value);
      const problem = checkReference(item); if (problem) issues.push(problem);
      references.push(item);
    } catch (e) { issues.push(e.message); }
  }
  return { status: issues.length ? 'diagnostic' : 'recorded-handoff', checkpoint: fields.checkpoint, stage: fields.stage, nextStep: fields['next step'], nextAction: fields['next action'], taskReference, references, guidance: fields['guidance next'] || '', issues };
}
function renderPacket(packet) {
  if (packet.status === 'absent') return '';
  if (packet.status === 'legacy') return packet.diagnostic;
  if (packet.status === 'diagnostic') return `Context handoff needs reconciliation: ${packet.issues.slice(0, 5).map(s => s.slice(0, 180)).join('; ')}. Read the complete Active Task and actual task files; do not infer a ready/accepted/authorized stage from this packet.`;
  return `Recorded context handoff (navigation, not proof): stage ${String(packet.stage).slice(0, 100)}; checkpoint ${packet.checkpoint}; next step ${packet.nextStep}.\nNext bounded action: ${packet.nextAction.slice(0, 300)}\nRead next (then expand only for concrete gaps): ${packet.references.map(r => `${r.relative}${r.section ? '#' + r.section : ''}`).join(', ').slice(0, 1000)}${packet.guidance ? `\nGuidance next: ${packet.guidance.slice(0, 250)}; resolve actual installed availability through the host catalog, not arbitrary packet paths.` : ''}\nWait for the user's "dalej"/continue message or explicit next-stage command. Load coordinate guidance when applicable, announce resolved task/step and reconcile current files/evidence. Do not execute from SessionStart or assume cleared chat is available. Partial/checked-increment means the overall task remains in progress; none means no new stage to invent.`;
}
module.exports = { inspectPacket, renderPacket, STEPS, CHECKPOINTS };
