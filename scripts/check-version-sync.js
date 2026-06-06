#!/usr/bin/env node
'use strict';

/**
 * check-version-sync.js — fail if the version drifts across the repo.
 *
 * Hard sources of truth (must all match):
 *   - package.json                       .version
 *   - gsr/.claude-plugin/plugin.json     .version
 *   - .claude-plugin/marketplace.json    .plugins[0].version
 *   - CHANGELOG.md                       latest "## [x.y.z]" entry
 *
 * Soft check (warns only):
 *   - README.md "What's new in x.y.z" line
 *
 * This is the guard that makes the old drift (files at 0.2.11, CHANGELOG at
 * 0.2.9, no matching tag) impossible to reintroduce.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJSON = (p) => JSON.parse(read(p));

const errors = [];
const warnings = [];

function getChangelogVersion() {
  const text = read('CHANGELOG.md');
  // First "## [x.y.z]" that is not [Unreleased].
  const m = text.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m);
  return m ? m[1] : null;
}

const sources = {
  'package.json': readJSON('package.json').version,
  'gsr/.claude-plugin/plugin.json': readJSON('gsr/.claude-plugin/plugin.json').version,
  '.claude-plugin/marketplace.json': readJSON('.claude-plugin/marketplace.json').plugins[0].version,
  'CHANGELOG.md (latest entry)': getChangelogVersion(),
};

const versions = [...new Set(Object.values(sources))];

if (versions.length !== 1 || versions[0] == null) {
  errors.push('Version mismatch across sources of truth:');
  for (const [name, v] of Object.entries(sources)) {
    errors.push(`  ${v == null ? '(missing)' : v}\t${name}`);
  }
  errors.push('');
  errors.push('Fix: run `npm run release` to bump every source together,');
  errors.push('or align them by hand if this was a manual edit.');
}

// Soft: README "What's new in x.y.z"
try {
  const readme = read('README.md');
  const m = readme.match(/What's new in (\d+\.\d+\.\d+)/);
  const canonical = versions.length === 1 ? versions[0] : null;
  if (m && canonical) {
    const minor = (v) => v.split('.').slice(0, 2).join('.'); // "0.2"
    // Only nag when the highlight is a whole minor behind — patch releases
    // don't need a new headline.
    if (minor(m[1]) !== minor(canonical)) {
      warnings.push(
        `README.md highlight is at ${m[1]} but current version is ${canonical}.`
      );
      warnings.push('  (Soft warning — refresh the "What\'s new in …" sentence.)');
    }
  }
} catch (_) {
  /* README optional for this check */
}

for (const w of warnings) console.warn(`⚠ ${w}`);

if (errors.length) {
  console.error('✖ version-sync FAILED\n');
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`✓ version-sync OK — all sources at ${versions[0]}`);
