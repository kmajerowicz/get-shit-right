#!/usr/bin/env node
// GSR Red Flag Guard — Stop hook. If the final assistant message claims
// completion using banned language with no evidence line, send Claude back
// once to verify. stop_hook_active prevents loops.
const fs = require('fs'); const path = require('path');
const BANNED = /\b(should work|should pass|probably works|seems correct|seems to work|looks good|likely fine)\b/i;
const EVIDENCE = /✅ .+→/;
let input = '';
const t = setTimeout(() => process.exit(0), 3000);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => (input += c));
process.stdin.on('end', () => {
  clearTimeout(t);
  try {
    const data = JSON.parse(input);
    if (data.stop_hook_active) process.exit(0);
    const cwd = data.cwd || process.cwd();
    if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
    if (!data.transcript_path || !fs.existsSync(data.transcript_path)) process.exit(0);
    const lines = fs.readFileSync(data.transcript_path, 'utf8').trim().split('\n');
    let lastText = '';
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const e = JSON.parse(lines[i]);
        if (e.type === 'assistant' && e.message && Array.isArray(e.message.content)) {
          lastText = e.message.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
          break;
        }
      } catch (err) { /* skip */ }
    }
    if (BANNED.test(lastText) && !EVIDENCE.test(lastText)) {
      process.stdout.write(JSON.stringify({
        decision: 'block',
        reason: 'GSR red-flag language detected ("should work"-class claim without evidence). Run the verification commands and restate the claim in the evidence format: ✅ <command> → <output> → "<claim>". If you cannot verify, say plainly what is unverified.'
      }));
    }
  } catch (e) { /* silent */ }
  process.exit(0);
});
