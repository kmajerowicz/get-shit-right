'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { inside } = require('./project');
function normalizePlan(text) {
  // Only the exact GSR template structure, one unambiguous task table, no extra
  // sections. Unknown/extended formats stay fully covered rather than guessed.
  if (/```|~~~|<!--|-->/.test(text)) return null;
  const fm = text.match(/^---\nfeature: [^\n]+\nmode: systematic\nstatus: [^\n]+\ncreated: [^\n]+\nupdated: [^\n]+\n---\n/);
  const headings = [...text.matchAll(/^## .+$/gm)].map(m => m[0]);
  if (!fm || headings.join('\n') !== '## Skills Confirmed\n## Task List\n## Parallelization Map' || !/^# Plan: .+$/m.test(text) || !/^\*\*Feature spec:\*\* `[^`]+`$/m.test(text)) return null;
  const lines = text.split('\n');
  const header = '| ID | Description | Done When | Files | Status | Evidence |';
  if (lines.filter(l => l === header).length !== 1) return null;
  const index = lines.indexOf(header);
  const taskHeading = lines.indexOf('## Task List');
  const parallelHeading = lines.indexOf('## Parallelization Map');
  if (index <= taskHeading || index >= parallelHeading || lines.slice(taskHeading + 1, index).some(l => l.trim())) return null;
  const prelude = text.slice(fm[0].length, text.indexOf('## Skills Confirmed'));
  if (!/^\n# Plan: [^\n]+\n\n\*\*Feature spec:\*\* `[^`]+`\n\n$/.test(prelude)) return null;
  if (lines[index + 1] !== '|----|-------------|-----------|-------|--------|----------|') return null;
  let rows = 0;
  for (let i = index + 2; i < lines.length && lines[i].startsWith('|'); i++) {
    const cols = lines[i].split('|');
    if (cols.length !== 8 || !/^\s*\d+\s*$/.test(cols[1]) || cols[0] || cols[7]) return null;
    cols[5] = ' <progress> '; cols[6] = ' <evidence> '; lines[i] = cols.join('|'); rows++;
  }
  if (!rows || lines.filter(l => l.startsWith('|')).length !== rows + 2) return null;
  lines[3] = 'status: <progress>'; lines[5] = 'updated: <progress>';
  return lines.join('\n');
}
function normalizeSession(content) {
  try {
    const text = content.toString('utf8');
    if (!Buffer.from(text).equals(content)) return null;
    const data = JSON.parse(text);
    if (!data || Array.isArray(data) || typeof data !== 'object' ||
        typeof data.project_dir !== 'string' || typeof data.project_name !== 'string' ||
        (data.last_command !== undefined && typeof data.last_command !== 'string') ||
        (data.timestamp !== undefined && typeof data.timestamp !== 'string')) return null;
    delete data.last_command; delete data.timestamp;
    return JSON.stringify(data);
  } catch (_) { return null; }
}
function fingerprint(project) {
  if (!project.git) return { supported: false, diagnostic: 'Non-Git reusable freshness unsupported in v1' };
  try {
    const git = args => execFileSync('git', ['-C', project.root, ...args], { maxBuffer: 64 * 1024 * 1024 });
    const split = buffer => {
      const text = buffer.toString('utf8');
      if (!Buffer.from(text).equals(buffer)) throw new Error('Non-UTF8 Git paths unsupported');
      return text.split('\0').filter(Boolean);
    };
    const tracked = split(git(['ls-files', '--stage', '-z']));
    const files = new Set(split(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z'])));
    for (const item of tracked) {
      if (item.startsWith('160000 ')) throw new Error('Submodule inputs unsupported in v1');
      if (!/^\d+ [a-f0-9]+ 0\t/.test(item)) throw new Error('Unmerged index unsupported in v1');
    }
    files.add('.gsr.json');
    // Applicable GSR documents remain inputs even if Git ignores them.
    const add = dir => {
      let stat;
      try { stat = fs.lstatSync(dir); } catch (e) { if (e.code === 'ENOENT') return; throw e; }
      if (!stat.isDirectory()) { files.add(path.relative(project.root, dir)); return; }
      for (const entry of fs.readdirSync(dir)) add(path.join(dir, entry));
    };
    for (const name of ['PRD.md', 'prd.md', 'scope.md', 'techstack.md', 'BACKLOG.md', 'features', 'work', 'plans', 'research', 'previews']) add(path.join(project.docs, name));
    const state = path.join(project.docRoot, 'STATE.md').split(path.sep).join('/');
    const exclusions = [state];
    const normalization = [];
    const hash = crypto.createHash('sha256');
    const feed = value => { const buffer = Buffer.isBuffer(value) ? value : Buffer.from(String(value)); hash.update(String(buffer.length) + ':'); hash.update(buffer); };
    let count = 0;
    for (const relative of [...files].sort()) {
      if (relative === state) continue;
      const absolute = path.resolve(project.root, relative);
      if (!inside(project.root, absolute)) throw new Error('Git path escapes project');
      // No following parent directory symlinks for tracked/requirement inputs.
      let parent = path.dirname(absolute);
      while (parent !== project.root) {
        if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error('Symlink parent input unsupported');
        parent = path.dirname(parent);
      }
      feed(relative); count++;
      let stat;
      try { stat = fs.lstatSync(absolute); } catch (e) { if (e.code === 'ENOENT') { feed('deleted'); continue; } throw e; }
      if (stat.isSymbolicLink()) { feed('symlink'); feed(fs.readlinkSync(absolute)); continue; }
      if (!stat.isFile()) throw new Error(`Unsupported input type: ${relative}`);
      feed('file'); feed(stat.mode & 0o111);
      let content = fs.readFileSync(absolute);
      if (relative === '.gsr-session.json') {
        const normalized = normalizeSession(content);
        if (normalized !== null) { content = Buffer.from(normalized); normalization.push({ path: relative, fields: ['last_command', 'timestamp'] }); }
      }
      if (relative.startsWith(path.posix.join(project.docRoot, 'plans') + '/') && relative.endsWith('.md')) {
        const normalized = normalizePlan(content.toString('utf8'));
        if (normalized !== null && Buffer.from(content.toString('utf8')).equals(content)) { content = Buffer.from(normalized); normalization.push({ path: relative, fields: ['frontmatter.status', 'frontmatter.updated', 'tasks.Status', 'tasks.Evidence'] }); }
      }
      feed(content);
    }
    return { supported: true, hash: hash.digest('hex'), files: count, exclusions, normalization };
  } catch (e) { return { supported: false, diagnostic: `Freshness unavailable: ${e.message}` }; }
}
module.exports = { fingerprint, normalizePlan };
