#!/usr/bin/env node
// Checks shipped workflows/templates and all phase planning/implementation artifacts.
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = 'gsr';
const LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g;

function walkMd(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkMd(full));
    else if (entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

let broken = 0;

const phaseArtifacts = ['docs/internal/plans', 'docs/internal/research'].flatMap(dir =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter(name => /phase-\d+.*\.md$/.test(name)).map(name => path.join(dir, name)) : []
);

for (const file of [...walkMd(DOCS_ROOT), ...phaseArtifacts, 'docs/BACKLOG.md'].filter(f => fs.existsSync(f))) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([a-zA-Z0-9_./-]+)/g)) {
    if (!fs.existsSync(path.join('gsr', match[1]))) { console.error(`✗ ${file}: missing plugin reference → ${match[1]}`); broken++; }
  }
  for (const [, , href] of content.matchAll(LINK_RE)) {
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) continue;

    const target = href.split('#')[0];
    if (!target) continue;

    const resolved = path.resolve(path.dirname(file), target);
    if (!fs.existsSync(resolved)) {
      console.error(`✗ ${file}: broken link → ${href}`);
      broken++;
    }
  }
}

if (broken === 0) {
  console.log('✓ All local markdown links resolve');
} else {
  console.error(`\n${broken} broken link(s) found`);
  process.exit(1);
}
