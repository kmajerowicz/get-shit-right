'use strict';
const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { discover } = require('../gsr/lib/project');
const { reference, inspectFeature, sections } = require('../gsr/lib/task-handoff');
function fixture(fn) {
 const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-contract-')));
 const write = (file, content) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), content); };
 write('.ai/STATE.md', '# Existing Python product');
 try { fn(root, write, discover(root)); } finally { fs.rmSync(root, { recursive: true, force: true }); }
}
const spec = '# CSV export\n\n## Purpose\nExport existing filtered orders.\n\n## User Story / Flow\nSelect export; download comma CSV.\n\n## Must-Haves\n| csv.T1 | Empty input yields header | pending |\n\n## States\nOffline: inapplicable, local CLI.\n';
test('sufficient focused spec is structurally observed without PRD or changing files/IDs', () => fixture((root, write, project) => {
 write('.ai/features/csv.md', spec); const before = fs.readdirSync(root);
 const result = inspectFeature(project, 'features/csv.md');
 assert.equal(result.status, 'context-present'); assert.equal(result.needsAgentReview, true); assert.deepEqual(result.missing, []);
 assert.equal(fs.readFileSync(path.join(root, '.ai/features/csv.md'), 'utf8'), spec);
 assert.deepEqual(fs.readdirSync(root), before); assert.equal(fs.existsSync(path.join(root, '.ai/PRD.md')), false);
 assert.equal(reference(project, '.ai/features/csv.md#Must-Haves').section, 'Must-Haves');
 write('src/main.py', 'pass'); assert.equal(reference(project, '@project/src/main.py').relative, 'src/main.py');
}));
test('partial/missing/ambiguous specs remain diagnostic; placeholders/decisions never become authority', () => fixture((root, write, project) => {
 assert.equal(inspectFeature(project, 'features/missing.md').status, 'missing');
 write('.ai/features/csv.md', '## Purpose\nExport\n'); assert.equal(inspectFeature(project, 'features/csv.md').status, 'incomplete-context');
 write('.ai/features/csv.md', spec + '\n## Purpose\nDifferent goal'); assert.equal(inspectFeature(project, 'features/csv.md').status, 'diagnostic');
 write('.ai/features/csv.md', spec + '\n## Open Decisions\nConsequential format unresolved; previous D1 valid deferred default.');
 const result = inspectFeature(project, 'features/csv.md'); assert.equal(result.needsAgentReview, true); assert.equal(result.ready, undefined); assert.equal(result.authorized, undefined);
 write('.ai/features/csv.md', '```\n' + spec); assert.equal(inspectFeature(project, 'features/csv.md').status, 'diagnostic');
 assert.throws(() => sections('--> <!--\n' + spec), /Ambiguous|Unclosed/);
 assert.throws(() => sections('<!-- closed --> <!-- unclosed\n' + spec), /Ambiguous|Unclosed/);
 assert.equal(sections('```\n## Fake\n```\n## Real\ncontent').has('Fake'), false);
}));
test('references reject escapes, absolute paths, directories, dangling/outside symlinks', () => fixture((root, write, project) => {
 fs.mkdirSync(path.join(root, '.ai/features'));
 for (const ref of ['/tmp/file', '../../escape', '@project/../escape', '../source.py', 'features']) assert.throws(() => reference(project, ref));
 fs.symlinkSync(os.tmpdir(), path.join(root, '.ai/outside'));
 assert.throws(() => reference(project, 'outside/file'), /escapes/);
 fs.symlinkSync('/gsr-no-such-dir-12345', path.join(root, '.ai/dangling'));
 assert.throws(() => reference(project, 'dangling/file'), /dangling|unresolvable/);
}));
