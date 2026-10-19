'use strict';
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.js') || e.name === 'session-start' ? [path.join(dir, e.name)] : []);
}
const sources = [...files('gsr'), ...files('scripts')];
for (const file of sources) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) { process.stderr.write(result.stderr || `Syntax check unavailable: ${file}\n`); process.exit(1); }
}
console.log(`JavaScript syntax: ${sources.length} files checked`);
