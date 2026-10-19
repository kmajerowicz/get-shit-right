'use strict';
const fs = require('fs');
const path = require('path');
const { resolveWithin } = require('./project');
const { observe } = require('./evidence');
function activeTask(state) {
  if (!/^## Active Task\s*$/m.test(state)) return null;
  try {
    const blocks = require('./task-handoff').sections(state);
    if (!blocks.has('Active Task')) return null;
    const section = blocks.get('Active Task');
    const fields = Object.create(null); let current = null;
    for (const line of section.split('\n')) {
      const match = line.match(/^\*\*([^*]+):\*\*\s*(.*)$/);
      if (match) {
        current = match[1].toLowerCase();
        if (Object.hasOwn(fields, current)) throw new Error(`Ambiguous Active Task field: ${current}`);
        fields[current] = match[2];
      } else if (current === 'read next' && /^\s*[-*] /.test(line)) fields[current] += '\n' + line;
      else if (line.trim()) current = null;
    }
    return { section, fields, diagnostics: [] };
  } catch (e) { return { section: '', fields: Object.create(null), diagnostics: [e.message] }; }
}
function referencePath(project, value) {
  return require('./task-handoff').reference(project, value).file;
}
function taskContext(project, state) {
  const task = activeTask(state);
  const parts = [];
  if (task) {
    const packet = require('./stage-packet').inspectPacket(project, task);
    const summary = packet.status === 'recorded-handoff'
      ? ['objective', 'constraints', 'authorized scope', 'authorization', 'review cadence', 'completed work', 'remaining work', 'open questions'].map(key => `${key}: ${(task.fields[key] || '').slice(0, 220)}`).join('\n')
      : task.section.slice(0, 2200);
    parts.push(`Active Task (summary, not authority):\n${summary}`);
    parts.push(require('./stage-packet').renderPacket(packet));
    if (task.section.length > 2200) parts.push('Task context truncated: read the complete Active Task section before resuming.');
    const cadence = task.fields['review cadence'];
    if (cadence) parts.push(`Recorded review cadence: ${cadence.slice(0, 350)}. Honor requested boundaries; later user instructions take precedence.`);
    const reference = task.fields['plan/task'];
    if (reference && !/^—$|^none$|^\[.*\]$/i.test(reference)) {
      try {
        const file = referencePath(project, reference);
        if (!fs.existsSync(file)) parts.push('Referenced plan/task is missing: reconcile actual files and remaining scope; do not mark done or request authorization again.');
        else {
          const content = fs.readFileSync(file, 'utf8');
          const status = content.match(/^status:\s*(.+)$/m)?.[1]?.trim().slice(0, 100);
          parts.push(`Referenced task: ${path.relative(project.root, file).slice(0, 400)}${status ? `; recorded status ${status}` : ''}. Read it and inspect actual repository progress before continuing.`);
          if (status === 'complete') parts.push('Reference says complete: reconcile any conflicting next action with implemented files; a checkbox is not evidence.');
        }
      } catch (e) { parts.push(`Task reference diagnostic: ${e.message.slice(0, 300)}. Reconcile against current files.`); }
    }
    parts.push('Resume remaining authorized work without restating settled choices. Stale tests do not reset implemented progress. STATE never overrides a later narrowing instruction.');
  }
  const verification = [];
  let current;
  try { current = observe(project); } catch (e) { current = { status: 'unverified', diagnostic: `Evidence unavailable: ${e.message}` }; }
  verification.push(`Verification observation: ${current.status}. ${current.diagnostic?.slice(0, 400) || 'Selected required checks passed for declared current local inputs; human acceptance and remote/runtime behavior are separate.'}${current.reference ? `\nLatest run: ${current.reference.slice(0, 500)}` : ''}`);
  if (current.results?.length) verification.push(`Checks observed at ${current.endedAt || current.startedAt}: ${current.results.slice(0, 4).map(r => `${String(r.id).slice(0, 100)}: ${r.status}`).join('; ')}. See the run record for remaining results; these observations do not override freshness limitations.`);
  if (task?.fields['last verified run']) verification.push('The STATE run reference is navigation only; use the current evidence observation, not a STATE assertion.');
  parts.unshift('Continuation boundary: wait for the user message; latest user instructions/explicit operation override saved scope/cadence. This summary never proves human acceptance or grants authority.');
  parts.unshift(...verification);
  return parts.join('\n').slice(0, 4500);
}
module.exports = { activeTask, referencePath, taskContext };
