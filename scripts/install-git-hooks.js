#!/usr/bin/env node
'use strict';

/**
 * install-git-hooks.js — point git at the repo's .githooks directory and make
 * the hooks executable. Run once per clone: `npm run hooks:install`.
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
execSync('git config core.hooksPath .githooks', { cwd: ROOT, stdio: 'inherit' });

const hookDir = path.join(ROOT, '.githooks');
for (const f of fs.readdirSync(hookDir)) {
  fs.chmodSync(path.join(hookDir, f), 0o755);
}

console.log('✓ git hooks installed (core.hooksPath → .githooks)');
console.log('  commit-msg now enforces Conventional Commits.');
