'use strict';
// Packaging/reference contracts, NOT tests of model route choice or skill use.
const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
test('coordinator is model-selectable/internal; the single public start entry forwards arguments', () => {
 const skill = read('gsr/skills/coordinate/SKILL.md'); const start = read('gsr/commands/start.md');
 assert.match(skill, /^---\nname: coordinate\n/); assert.match(skill, /^user-invocable: false$/m);
 assert.match(skill, /^disable-model-invocation: false$/m); assert.match(skill, /description: .*dalej/);
 assert.match(start, /\$ARGUMENTS/); assert.match(start, /skills\/coordinate\/SKILL.md/);
 assert.doesNotMatch(skill, /^allowed-tools:|^context: fork/m);
 for (const file of ['gsr/commands/start.md','gsr/skills/coordinate/SKILL.md']) {
  for (const m of read(file).matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([\w./-]+)/g)) assert.ok(fs.existsSync(path.join(root,'gsr',m[1])),m[1]);
 }
});
test('C1–C12 pilot inputs/expected outcomes are complete; expected routes are not passing observations', () => {
 const scenarios = JSON.parse(read('scripts/fixtures/phase-2/scenarios.json'));
 assert.deepEqual(scenarios.map(s => s.id), Array.from({length:12},(_,i)=>`C${i+1}`));
 for (const s of scenarios) { assert.ok(s.input && s.expectedStage && s.authority && s.expected.length); assert.equal(s.passed, undefined); }
 assert.match(scenarios.find(s => s.id === 'C4').authority, /planning only/);
 assert.match(scenarios.find(s => s.id === 'C11').expectedStage, /question/);
});

test('V3 status fixtures resolve focused references and decisions without PRD/STATE; structural reads do not mutate files', () => {
 const os = require('os');
 const { discover } = require('../gsr/lib/project');
 const { reference, sections, inspectFeature } = require('../gsr/lib/task-handoff');
 const { activeTask } = require('../gsr/lib/task-context');
 const scenarios = JSON.parse(read('scripts/fixtures/corrections/status-scenarios.json'));
 for (const scenario of scenarios) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-status-'));
  try {
   const docs = path.join(dir, scenario.docRoot); fs.mkdirSync(path.join(docs, 'features'), { recursive: true });
   const spec = read('scripts/fixtures/corrections/booking.md');
   fs.writeFileSync(path.join(docs, 'features/booking.md'), scenario.decisionOwner ? spec : spec.split('## Open Decisions')[0]);
   fs.writeFileSync(path.join(dir, '.gsr.json'), JSON.stringify({ schemaVersion: 1, docRoot: scenario.docRoot }));
   if (scenario.state) fs.writeFileSync(path.join(docs, 'STATE.md'), scenario.state);
   const snapshot = () => fs.readdirSync(dir, { recursive: true }).filter(f => fs.statSync(path.join(dir, f)).isFile()).map(f => [f, fs.readFileSync(path.join(dir, f), 'utf8')]);
   const before = snapshot(), project = discover(dir);
   const saved = scenario.state ? activeTask(scenario.state) : null;
   const target = scenario.target || saved.fields['plan/task'];
   assert.equal(reference(project, target).file, fs.realpathSync(path.join(docs, 'features/booking.md')));
   assert.equal(inspectFeature(project, target).status, 'context-present');
   const blocks = sections(fs.readFileSync(reference(project, target).file, 'utf8'));
   if (scenario.decisionOwner) assert.match(blocks.get('Open Decisions'), /D1.*deferred/);
   else assert.equal(blocks.has('Open Decisions'), false);
   assert.equal(fs.existsSync(path.join(docs, 'PRD.md')), false);
   assert.deepEqual(snapshot(), before);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
 }
});
