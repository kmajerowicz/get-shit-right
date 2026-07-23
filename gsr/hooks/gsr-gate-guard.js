#!/usr/bin/env node
// GSR Gate Guard — PreToolUse (Bash). If a git commit is attempted while files
// changed since the gate function last ran, ask the user instead of proceeding
// silently. "ask" not "deny": human stays in control.
const fs = require('fs'); const os = require('os'); const path = require('path');
let input = '';
const t = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => (input += c));
process.stdin.on('end', () => {
  clearTimeout(t);
  try {
    const data = JSON.parse(input);
    const cmd = (data.tool_input && data.tool_input.command) || '';
    if (!data.session_id || !/\bgit\b[^\n]*\bcommit\b/.test(cmd)) process.exit(0);
    const cwd = data.cwd || process.cwd();
    if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
    const bridge = path.join(os.tmpdir(), `gsr-gate-${data.session_id}.json`);
    let state = { dirty: false };
    try { state = JSON.parse(fs.readFileSync(bridge, 'utf8')); } catch (e) {}
    if (!state.dirty) process.exit(0);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: 'GSR gate: files changed since the gate function last ran (build / type-check / tests). Run the gate first, or approve to commit anyway.'
      }
    }));
  } catch (e) { /* silent */ }
  process.exit(0);
});
