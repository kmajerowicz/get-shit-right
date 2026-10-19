'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs'); const path = require('path'); const os = require('os');
const vm = require('vm'); const { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const demo = path.join(ROOT, 'gsr/examples/product-preview');
const cli = path.join(ROOT, 'scripts/fixtures/phase-3/cli');

test('technical experiment transforms actual UTF-8 input, quotes CSV and rejects invalid rows without partial output', () => {
 const run = file => spawnSync(process.execPath, [path.join(cli, 'transform.js'), file], { encoding: 'utf8' });
 const actual = run(path.join(cli, 'input.json'));
 assert.equal(actual.status, 0); assert.equal(actual.stdout, fs.readFileSync(path.join(cli, 'expected.csv'), 'utf8'));
 const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-preview-cli-'));
 try {
  const input = path.join(temp, 'input.json');
  fs.writeFileSync(input, '[]'); assert.equal(run(input).stdout, 'id,name\n');
  for (const invalid of ['{broken', '[{"id":1,"name":"ok"},{"id":"bad","name":"wrong"}]', 'null']) {
   fs.writeFileSync(input, invalid); const result = run(input);
   assert.equal(result.status, 1); assert.equal(result.stdout, ''); assert.ok(result.stderr.trim());
  }
 } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});

test('actual preview handlers update selected time, surface busy error, clear obsolete result and reset focus (DOM harness only)', () => {
 const handlers = {}, resets = {};
 let selected = null, valid = true, focused = null;
 const result = { textContent: '', className: '', focus: () => { focused = 'result'; } };
 const reset = { hidden: true, addEventListener: (name, fn) => { resets[name] = fn; } };
 const chosen = { textContent: 'Wybierz godzinę' };
 const form = {
  addEventListener: (name, fn) => { handlers[name] = fn; },
  querySelector: selector => selector.endsWith(':checked') ? selected : { focus: () => { focused = 'first-slot'; } },
  reportValidity: () => valid,
  reset: () => { selected = null; }
 };
 const html = fs.readFileSync(path.join(demo, 'index.html'), 'utf8');
 const resetId = html.match(/<button\b[^>]*\bid="([^"]+)"/)[1];
 // Browsers expose named form controls as properties, including collisions with reset().
 form[resetId] = reset;
 const nodes = { '#booking': form, '#result': result, ['#' + resetId]: reset, '#chosen': chosen };
 vm.runInNewContext(fs.readFileSync(path.join(demo, 'preview.js'), 'utf8'), { document: { querySelector: selector => { assert.ok(nodes[selector]); return nodes[selector]; } } });
 let prevented = 0; const submit = () => handlers.submit({ preventDefault: () => { prevented++; } });
 submit(); assert.equal(result.textContent, '');
 selected = { value: '10:30' }; handlers.change(); assert.equal(chosen.textContent, '10:30');
 valid = false; submit(); assert.equal(result.textContent, '');
 valid = true; submit(); assert.match(result.textContent, /10:30.*nie została zapisana/); assert.equal(focused, 'result'); assert.equal(reset.hidden, false);
 selected = { value: '16:30' }; handlers.change(); assert.equal(result.textContent, ''); assert.equal(reset.hidden, true);
 submit(); assert.equal(result.className, 'error'); assert.match(result.textContent, /już zajęty/);
 resets.click(); assert.equal(result.textContent, ''); assert.equal(result.className, ''); assert.equal(reset.hidden, true); assert.equal(chosen.textContent, 'Wybierz godzinę'); assert.equal(focused, 'first-slot'); assert.equal(selected, null); assert.equal(prevented, 4);
});

test('shipped demo local assets resolve; no external asset dependency is required', () => {
 const html = fs.readFileSync(path.join(demo, 'index.html'), 'utf8');
 const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
 assert.deepEqual(assets, ['preview.js']);
 for (const asset of assets) assert.ok(fs.statSync(path.join(demo, asset)).isFile());
});

test('link checker covers future numbered phase documents rather than a phase 1/2 allowlist', () => {
 const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-phase-links-'));
 try {
  fs.mkdirSync(path.join(temp, 'gsr'));
  fs.mkdirSync(path.join(temp, 'docs/internal/plans'), { recursive: true });
  fs.writeFileSync(path.join(temp, 'docs/internal/plans/2026-phase-4-test.md'), '[missing](target.md)');
  const run = () => spawnSync(process.execPath, [path.join(ROOT, 'scripts/check-doc-links.js')], { cwd: temp, encoding: 'utf8' });
  assert.equal(run().status, 1);
  fs.writeFileSync(path.join(temp, 'docs/internal/plans/target.md'), '# Target');
  assert.equal(run().status, 0);
 } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
