'use strict';
// Structural observations only. This module does not classify intent, authorize
// work, accept features, execute Markdown or choose an agent workflow.
const fs = require('fs');
const path = require('path');
const { resolveWithin, inside } = require('./project');
function reference(project, value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Empty task reference');
  let name = value.trim().replace(/^`([^`]+)`$/, '$1');
  const link = name.match(/^\[[^\]]+\]\(([^)]+)\)$/); if (link) name = link[1];
  const parts = name.split('#');
  if (parts.length > 2 || !parts[0] || path.isAbsolute(parts[0])) throw new Error('Expected a DOC_ROOT-relative reference or @project/path');
  let relative = parts[0];
  if (relative.split(/[\\/]/).includes('..')) throw new Error('Task reference escapes allowed scope via traversal; use @project/path for project inputs');
  const projectRelative = relative.startsWith('@project/');
  if (relative.startsWith('@project/')) relative = relative.slice(9);
  else if (!relative.startsWith(project.docRoot + '/')) relative = path.join(project.docRoot, relative);
  const file = resolveWithin(project.root, relative, 'Task reference');
  if (!projectRelative && !inside(project.docs, file)) throw new Error('Task reference escapes DOC_ROOT');
  if (file === project.root || (fs.existsSync(file) && !fs.statSync(file).isFile())) throw new Error('Task reference must name a file');
  return { file, relative: path.relative(project.root, file), section: parts[1] || null };
}
function headingKey(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
}
function sections(text, allLevels = false, target = null, withRanges = false) {
  const blocks = new Map(); const ranges = new Map(); let current = null; let fence = null; let comment = false; let offset = 0;
  for (const rawLine of text.match(/[^\n]*\n|[^\n]+$/g) || []) {
    const line = rawLine.replace(/\r?\n$/, ''); const start = offset; offset += rawLine.length;
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    const opens = (line.match(/<!--/g) || []).length, closes = (line.match(/-->/g) || []).length;
    if (opens && closes && line.indexOf('-->') < line.indexOf('<!--')) throw new Error('Ambiguous HTML comment order');
    if (opens > 1 || closes > 1 || (comment && opens)) throw new Error('Ambiguous HTML comments');
    if (comment) { if (closes) comment = false; continue; }
    if (closes && !opens) throw new Error('Unmatched HTML comment closer');
    if (marker) { fence = marker[1]; continue; }
    if (/<!--/.test(line)) { comment = !/-->/.test(line); continue; }
    if (!allLevels && /^# /.test(line)) { if (current) ranges.get(current).end = start; current = null; continue; }
    const heading = line.match(allLevels ? /^#{1,6} ([^#].*?)\s*$/ : /^## ([^#].*?)\s*$/);
    if (heading) {
      if (current) ranges.get(current).end = start;
      if (blocks.has(heading[1]) && (target === null || headingKey(heading[1]) === headingKey(target))) throw new Error(`Ambiguous duplicate section: ${heading[1]}`);
      current = heading[1]; blocks.set(current, []); ranges.set(current, { start, end: text.length });
    } else if (current) blocks.get(current).push(line);
  }
  if (fence || comment) throw new Error('Unclosed Markdown fence/comment');
  return new Map([...blocks].map(([key, lines]) => [key, withRanges ? { ...ranges.get(key), content: lines.join('\n').trim() } : lines.join('\n').trim()]));
}
function inspectFeature(project, value) {
  try {
    const resolved = reference(project, value);
    if (!fs.existsSync(resolved.file)) return { status: 'missing', reference: resolved.relative, diagnostic: 'Feature reference missing', needsAgentReview: true };
    const blocks = sections(fs.readFileSync(resolved.file, 'utf8'));
    const missing = ['Purpose', 'User Story / Flow', 'Must-Haves'].filter(name => !blocks.get(name) || /^[-\s]*$/.test(blocks.get(name)));
    return { status: missing.length ? 'incomplete-context' : 'context-present', reference: resolved.relative, missing, sections: [...blocks.keys()], needsAgentReview: true, diagnostic: 'Structural presence is not semantic readiness, passing behavior, authorization or human acceptance. Read constraints, states and consequential choices.' };
  } catch (e) { return { status: 'diagnostic', diagnostic: e.message, needsAgentReview: true }; }
}
module.exports = { headingKey, reference, sections, inspectFeature };
