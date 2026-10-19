#!/usr/bin/env node
// Validates JSON files parse correctly and that plugin/marketplace versions are in sync.
const fs = require('fs');

const JSON_FILES = [
  'gsr/.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  'gsr/hooks/hooks.json',
  'scripts/fixtures/phase-2/scenarios.json',
  'scripts/fixtures/corrections/status-scenarios.json',
  ...['docs/internal/research/2026-10-11-phase-1-run-reference.json', 'docs/internal/research/2026-10-13-phase-2-evaluation.json', 'docs/internal/research/2026-10-13-phase-2-run-reference.json'].filter(file => fs.existsSync(file)),
];

let failed = false;

for (const file of JSON_FILES) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`✓ ${file}`);
  } catch (e) {
    console.error(`✗ ${file}: ${e.message}`);
    failed = true;
  }
}

if (!failed) {
  const plugin = JSON.parse(fs.readFileSync('gsr/.claude-plugin/plugin.json', 'utf8'));
  const marketplace = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf8'));
  const marketplaceVersion = marketplace.plugins[0].version;

  if (plugin.version !== marketplaceVersion) {
    console.error(`✗ Version mismatch: plugin.json=${plugin.version}, marketplace.json=${marketplaceVersion}`);
    failed = true;
  } else {
    console.log(`✓ Version sync: ${plugin.version}`);
  }
}

if (failed) process.exit(1);

// Validate the shipped project configuration example, not just plugin manifests.
const exampleFile = 'gsr/docs/patterns/verification-contract.md';
try {
  const source = fs.readFileSync(exampleFile, 'utf8');
  const example = source.match(/```json\n([\s\S]*?)\n```/);
  if (!example) throw new Error('Missing machine configuration example');
  require('../gsr/lib/config').validate(JSON.parse(example[1]), fs.realpathSync('.'));
  console.log('✓ Project configuration example validates');
} catch (e) {
  console.error(`✗ ${exampleFile}: ${e.message}`);
  process.exit(1);
}
