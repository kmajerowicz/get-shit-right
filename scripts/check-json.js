#!/usr/bin/env node
// Validates JSON files parse correctly and that plugin/marketplace versions are in sync.
const fs = require('fs');

const JSON_FILES = [
  'gsr/.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  'gsr/hooks/hooks.json',
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
