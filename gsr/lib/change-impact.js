'use strict';
// Derived source observations, never semantic dependency proof or authorization.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { reference, sections, headingKey } = require('./task-handoff');
const assert = (ok, message) => { if (!ok) throw new Error(message); };
const text = (value, label) => { assert(typeof value === 'string' && value.trim() && value.length <= 8192, `${label}: nonempty bounded string required`); return value; };
const list = (value, label, max = 128) => { assert(Array.isArray(value) && value.length <= max, `${label}: bounded array required`); return value; };
const strings = (value, label) => list(value, label).map(v => text(v, label));
function digest(value) {
 const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
 return crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
}
function sourceKey(input) {
 assert(input && typeof input === 'object' && !Array.isArray(input), 'Source descriptor required');
 assert(Object.keys(input).every(k => ['ref', 'lines'].includes(k)), 'Unknown source descriptor field');
 text(input.ref, 'source ref');
 if (input.lines !== undefined) assert(Array.isArray(input.lines) && input.lines.length === 2 && input.lines.every(Number.isSafeInteger) && input.lines[0] > 0 && input.lines[1] >= input.lines[0] && !input.ref.includes('#'), 'Invalid source line range');
 return digest(input);
}
function snapshotSource(project, input) {
 sourceKey(input);
 const item = reference(project, input.ref);
 assert(item.file !== path.join(project.docs, 'STATE.md') && fs.realpathSync(item.file) !== fs.realpathSync(project.docs) + path.sep + 'STATE.md', 'STATE is administrative, not a requirement/context source');
 const stat = fs.statSync(item.file);
 assert(stat.isFile() && stat.size <= 1024 * 1024, `Source too large/non-file: ${input.ref}; inspect a smaller source explicitly`);
 const raw = fs.readFileSync(item.file); const full = raw.toString('utf8');
 assert(Buffer.from(full).equals(raw), `Source is not UTF-8 text: ${input.ref}`);
 let excerpt = full;
 if (item.section) {
  assert(item.relative.endsWith('.md'), 'Section requires Markdown');
  const blocks = sections(full, true, item.section);
  const keys = [...blocks.keys()].filter(k => headingKey(k) === headingKey(item.section));
  assert(keys.length === 1, `Missing/ambiguous section: ${input.ref}`);
  excerpt = blocks.get(keys[0]);
 }
 if (input.lines) {
  const lines = full.split(/\r?\n/);
  assert(input.lines[1] <= lines.length, `Source range exceeds file: ${input.ref}`);
  excerpt = lines.slice(input.lines[0] - 1, input.lines[1]).join('\n');
 }
 assert(excerpt.trim() && Buffer.byteLength(excerpt) <= 16384, `Context empty/too large: ${input.ref}; select a specific populated heading or line range, do not truncate`);
 return { ...input, hash: digest({ raw: raw.toString('base64'), mode: stat.mode & 0o111, canonical: path.relative(project.root, fs.realpathSync(item.file)) }), excerpt };
}
function collectSources(project, inputs) {
 const unique = [...new Map(inputs.map(s => [sourceKey(s), s])).values()];
 assert(unique.length <= 128, 'Too many map sources');
 return unique.map(s => snapshotSource(project, s));
}
function inspectSources(project, inputs, saved) {
 assert(Array.isArray(saved) && saved.length === new Set(inputs.map(sourceKey)).size, 'Missing/duplicate source snapshots');
 const keys = saved.map(s => sourceKey(s.lines ? { ref: s.ref, lines: s.lines } : { ref: s.ref }));
 assert(new Set(keys).size === keys.length && inputs.every(s => keys.includes(sourceKey(s))) && saved.every(s => /^[a-f0-9]{64}$/.test(s.hash) && typeof s.excerpt === 'string'), 'Invalid source snapshots');
 const issues = [];
 for (const input of [...new Map(inputs.map(s => [sourceKey(s), s])).values()]) {
  const before = saved[keys.indexOf(sourceKey(input))];
  try { if (digest(snapshotSource(project, input)) !== digest(before)) issues.push(`Changed source: ${input.ref}`); }
  catch (e) { issues.push(`Unavailable source ${input.ref}: ${e.message}`); }
 }
 return issues;
}
function validateDefinition(project, definition) {
 assert(definition?.schemaVersion === 1, 'Unsupported impact schema');
 text(definition.objective, 'objective'); text(definition.scope, 'scope'); strings(definition.exclusions, 'exclusions'); strings(definition.gaps, 'gaps');
 assert(['partial', 'reviewed'].includes(definition.coverage), 'coverage must be partial/reviewed (semantic review still required)');
 const entries = list(definition.entries, 'entries'); assert(entries.length, 'At least one impact entry required');
 const ids = entries.map(e => text(e?.id, 'entry id')); assert(new Set(ids).size === ids.length, 'Impact IDs must be unique');
 const checkIds = (project.config?.checks || []).map(c => c.id);
 for (const entry of entries) {
  sourceKey(entry.requirement); list(entry.implementation, 'implementation').forEach(sourceKey);
  strings(entry.checks, 'checks').forEach(id => assert(checkIds.includes(id), `Unknown configured check: ${id}`));
  strings(entry.dependsOn, 'dependsOn').forEach(id => assert(ids.includes(id) && id !== entry.id, `Unknown/self dependency: ${id}`));
  text(entry.rationale, 'dependency rationale');
 }
 const visited = new Set(), active = new Set();
 const visit = id => { if (visited.has(id)) return; assert(!active.has(id), 'Cyclic impact dependency'); active.add(id); entries.find(e => e.id === id).dependsOn.forEach(visit); active.delete(id); visited.add(id); };
 ids.forEach(visit);
 return entries.flatMap(e => [e.requirement, ...e.implementation]);
}
const configDigest = project => digest(project.config || null);
function prepareImpact(project, definition) {
 const inputs = validateDefinition(project, definition);
 return { schemaVersion: 1, project: project.root, definition: JSON.parse(JSON.stringify(definition)), configDigest: configDigest(project), sources: collectSources(project, inputs) };
}
function inspectImpact(project, map) {
 try {
  assert(map?.schemaVersion === 1 && map.project === project.root && /^[a-f0-9]{64}$/.test(map.configDigest), 'Invalid/foreign impact map');
  const inputs = validateDefinition(project, map.definition);
  const changed = inspectSources(project, inputs, map.sources);
  if (map.configDigest !== configDigest(project)) changed.push('Check/project configuration changed');
  if (changed.length) return { status: 'stale', issues: changed, verificationProfile: 'default' };
  const issues = [...map.definition.gaps];
  for (const entry of map.definition.entries) if (!entry.implementation.length || !entry.checks.length) issues.push(`Incomplete links: ${entry.id}; expand inspection and verification`);
  if (map.definition.coverage === 'partial') issues.push('Partial map: inspect remaining dependencies');
  return { status: issues.length ? 'incomplete' : 'current', issues, verificationProfile: 'default', limitation: 'Source currency and recorded mapping are not semantic proof, authorization or passing behavior' };
 } catch (e) { return { status: 'diagnostic', issues: [e.message], verificationProfile: 'default' }; }
}
module.exports = { prepareImpact, inspectImpact, snapshotSource, collectSources, inspectSources, sourceKey, digest, assert, text, list, strings };
