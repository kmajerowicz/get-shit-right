#!/usr/bin/env node
'use strict';
// Commit observation adds agent context; it neither authorizes nor asks permission.
const { discover } = require('../lib/project');
const { observe } = require('../lib/evidence');
let input = '';
const timer = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  clearTimeout(timer);
  let diagnostic;
  try {
    const data = JSON.parse(input);
    const command = data.tool_input?.command || '';
    if (!/\bgit\b[^\n]*\bcommit\b/.test(command)) return;
    const project = discover(data.cwd || process.cwd());
    if (!project.initialized) return;
    const record = observe(project);
    if (record.status === 'passing') return;
    diagnostic = `GSR verification: ${record.status}. ${record.diagnostic || 'Read the latest configured check results'}. Inspect current inputs and run relevant configured checks before making a verified claim. Commit authority remains with user instructions and host permissions.`;
  } catch (e) { diagnostic = `GSR verification unverified: ${e.message}`; }
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: diagnostic } }));
});
