'use strict';
const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const { discover } = require('../gsr/lib/project'); const { activeTask, taskContext } = require('../gsr/lib/task-context');
const { inspectPacket } = require('../gsr/lib/stage-packet'); const { directory } = require('../gsr/lib/evidence');
const ROOT = path.resolve(__dirname, '..');
function fixture(fn) {
 const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(),'gsr-packet-'))), cfg = fs.mkdtempSync(path.join(os.tmpdir(),'gsr-packet-config-'));
 const write = (file,text) => { fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true}); fs.writeFileSync(path.join(root,file),text); };
 write('.ai/STATE.md','# Existing project'); write('.ai/features/csv.md','## Purpose\nCSV\n## User Story / Flow\nExport\n## Must-Haves\nheader for empty input');
 write('src/orders.py','PRIVATE_UNLISTED_CONTENT_SHOULD_NOT_BE_IN_STARTUP'); write('.ai/research/unrelated.md','UNRELATED_RESEARCH_CONTENT');
 const hook = () => execFileSync(process.execPath,[path.join(ROOT,'gsr/hooks/session-start')],{input:JSON.stringify({cwd:root,source:'clear'}),encoding:'utf8',env:{...process.env,CLAUDE_CONFIG_DIR:cfg}});
 try { fn(root,write,hook); } finally { fs.rmSync(directory(discover(root)),{recursive:true,force:true}); fs.rmSync(root,{recursive:true,force:true});fs.rmSync(cfg,{recursive:true,force:true}); }
}
const packet = `## Active Task
**Objective:** CSV export
**Constraints:** UTF-8, comma, no publish
**Authorized scope:** local implement/test, subject to later instructions
**Authorization:** user request 2026-10-13
**Review cadence:** explain and wait after each chunk
**Plan/task:** \`features/csv.md\`
**Context handoff:** stage saved for fresh context
**Stage:** focused feature scope
**Checkpoint:** completed
**Next step:** build
**Next action:** implement filtered CSV and verify header/invalid-input behavior
**Completed work:** spec only; no code implemented
**Remaining work:** implement and test
**Open questions:** none
**Read next:** \`features/csv.md#Must-Haves\`, \`@project/src/orders.py\`
**Guidance next:** gsr:build
`;
test('C8 fresh clear context contains minimal pointers and cadence, never code/research contents or auto execution', () => fixture((root,write,hook) => {
 write('.ai/STATE.md','# Project\n'+'summary\n'.repeat(25)+packet);
 const inspected = inspectPacket(discover(root),activeTask(fs.readFileSync(path.join(root,'.ai/STATE.md'),'utf8')));
 assert.equal(inspected.status,'recorded-handoff'); assert.equal(inspected.nextStep,'build'); assert.equal(inspected.references.length,2);
 const out = hook(); assert.match(out,/next step build/); assert.match(out,/\.ai\/features\/csv.md#Must-Haves/); assert.match(out,/wait after each chunk/);
 assert.match(out,/"dalej"/); assert.match(out,/does not initiate work/); assert.match(out,/later user instructions take precedence/);
 assert.doesNotMatch(out,/PRIVATE_UNLISTED_CONTENT|UNRELATED_RESEARCH_CONTENT/); assert.equal(fs.existsSync(path.join(root,'export.csv')),false);
}));
test('legacy/no task stays valid; fenced or duplicated Active Task is not a guessed stage', () => fixture((root,write,hook) => {
 assert.equal(activeTask('# Legacy'),null); assert.equal(inspectPacket(discover(root),activeTask('## Active Task\n**Objective:** old task')).status,'legacy');
 assert.equal(activeTask('```\n'+packet+'```'),null);
 for (const text of [packet+'\n'+packet,packet+'\n**Next step:** verify']) {
  const result=inspectPacket(discover(root),activeTask(text)); assert.equal(result.status,'diagnostic');
  write('.ai/STATE.md',text); assert.match(hook(),/needs reconciliation/);
 }
}));
test('packet rejects missing/escaping/ambiguous/unbounded read sets and invalid checkpoint combinations', () => fixture((root,write,hook) => {
 fs.symlinkSync(os.tmpdir(),path.join(root,'.ai/outside'));
 for (const text of [packet.replace('features/csv.md#Must-Haves','features/csv.md#Does-not-exist'),packet.replace('features/csv.md#Must-Haves','outside/file'),packet.replace('features/csv.md#Must-Haves','../../escape'),packet.replace('@project/src/orders.py','features/missing.md'),packet.replace('**Next step:** build','**Next step:** publish'),packet.replace('**Checkpoint:** completed','**Checkpoint:** partial').replace('**Next step:** build','**Next step:** none'),packet.replace('**Read next:**','**Read next:** '+Array.from({length:7},(_,i)=>'`features/'+i+'.md`').join(', ')+', ')]) {
  const result=inspectPacket(discover(root),activeTask(text)); assert.equal(result.status,'diagnostic');
 }
}));
test('checked/partial increments preserve progress; stale source does not erase checkpoint or cadence', () => fixture((root,write,hook) => {
 execFileSync('git',['-C',root,'init','-q']);
 write('.gsr.json',JSON.stringify({schemaVersion:1,docRoot:'.ai',checks:[{id:'unit',argv:[process.execPath,'-e','void 0'],kind:'test'}]}));
 write('.ai/STATE.md',packet.replace('**Checkpoint:** completed','**Checkpoint:** checked-increment'));
 assert.equal(spawnSync(process.execPath,[path.join(ROOT,'gsr/scripts/run-checks.js'),'--cwd',root],{encoding:'utf8'}).status,0);
 assert.match(hook(),/Verification observation: passing/);
 write('src/orders.py','external mutation'); let out=hook(); assert.match(out,/Verification observation: stale/); assert.match(out,/checkpoint checked-increment/);
 write('.ai/STATE.md',packet.replace('**Checkpoint:** completed','**Checkpoint:** partial')); out=hook(); assert.match(out,/checkpoint partial/); assert.match(out,/overall task remains in progress/);
}));
test('multiline references and complete none stage; oversized summary still shows evidence/limitations', () => fixture((root,write,hook) => {
 const multi=packet.replace('**Read next:** `features/csv.md#Must-Haves`, `@project/src/orders.py`','**Read next:**\n- `features/csv.md#Must-Haves`\n- `@project/src/orders.py`');
 assert.equal(inspectPacket(discover(root),activeTask(multi)).references.length,2);
 const complete=packet.replace('**Next step:** build','**Next step:** none').replace('**Read next:** `features/csv.md#Must-Haves`, `@project/src/orders.py`','**Read next:** none');
 assert.equal(inspectPacket(discover(root),activeTask(complete)).status,'recorded-handoff');
 write('.ai/STATE.md',packet.replace('UTF-8, comma, no publish','x'.repeat(20000))); const out=hook(); assert.ok(out.length<9000); assert.match(out,/Verification observation: unverified/); assert.match(out,/wait after each chunk/); assert.match(out,/context truncated/);
}));

test('oversized legacy plan status cannot hide current evidence or authority limits', () => fixture((root,write,hook) => {
 write('.ai/plans/task.md','---\nstatus: '+ 'x'.repeat(20000)+'\n---\n# Task');
 write('.ai/STATE.md','## Active Task\n**Objective:** legacy\n**Plan/task:** `plans/task.md`\n**Review cadence:** wait after each chunk');
 const out=hook(); assert.match(out,/Verification observation: unverified/); assert.match(out,/latest user instructions/); assert.ok(out.length<9000);
}));

test('reference ambiguity is scoped to requested heading; malformed Markdown still fails', () => fixture((root, write) => {
 const { sections } = require('../gsr/lib/task-handoff');
 const text = '## Task Context\nTarget\n### Notes\nFirst\n## Other\n### Notes\nSecond\n';
 const pointed = packet.replace('features/csv.md#Must-Haves', 'features/csv.md#Task-Context');
 write('.ai/features/csv.md', text);
 assert.equal(inspectPacket(discover(root), activeTask(pointed)).status, 'recorded-handoff');
 assert.throws(() => sections(text, true), /duplicate/); // Other consumers retain strict diagnostics.
 for (const bad of [text + '## Task Context\nDuplicate', text + '## Task-Context\nSlug collision', text.replace('## Task Context', '## Missing'), text + '\n```\nunclosed', text + '\n<!-- unclosed']) {
  write('.ai/features/csv.md', bad);
  assert.equal(inspectPacket(discover(root), activeTask(pointed)).status, 'diagnostic');
 }
 write('.ai/features/csv.md', text + '\n```md\n## Task Context\n```\n');
 assert.equal(inspectPacket(discover(root), activeTask(pointed)).status, 'recorded-handoff');
}));
