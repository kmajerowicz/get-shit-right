#!/usr/bin/env node
// Checks local markdown links in gsr/docs/ — flags links that point to non-existent files.
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = 'gsr/docs';
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

for (const file of walkMd(DOCS_ROOT)) {
  const content = fs.readFileSync(file, 'utf8');
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
