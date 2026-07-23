#!/usr/bin/env node
// GSR Gate Tracker — PostToolUse. Tracks whether the gate function has run
// since the last file mutation. Bridge consumed by gsr-gate-guard.js.
const fs = require('fs'); const os = require('os'); const path = require('path');
let input = '';
const t = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => (input += c));
process.stdin.on('end', () => {
  clearTimeout(t);
  try {
    const data = JSON.parse(input);
    if (!data.session_id) process.exit(0);
    const cwd = data.cwd || process.cwd();
    if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
    const bridge = path.join(os.tmpdir(), `gsr-gate-${data.session_id}.json`);
    const MUTATORS = ['Edit', 'Write', 'NotebookEdit'];
    const GATE_RE = /\b(npm run build|npm test|npx tsc|pnpm (build|test)|yarn (build|test)|vitest|jest|pytest|cargo (build|test)|go (build|test)|make(\s|$))/;
    let state = { dirty: false };
    try { state = JSON.parse(fs.readFileSync(bridge, 'utf8')); } catch (e) {}
    if (MUTATORS.includes(data.tool_name)) state.dirty = true;
    else if (data.tool_name === 'Bash' && GATE_RE.test((data.tool_input && data.tool_input.command) || '')) state.dirty = false;
    fs.writeFileSync(bridge, JSON.stringify(state));
  } catch (e) { /* silent */ }
  process.exit(0);
});
