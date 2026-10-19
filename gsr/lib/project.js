'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const CANDIDATES = ['.ai', '.cursor', 'ai', 'docs', 'doc', 'documentation'];
const ARTIFACTS = ['PRD.md', 'prd.md', 'scope.md', 'STATE.md', 'techstack.md', 'BACKLOG.md', 'features', 'work'];
function hasEntry(file) {
  try { fs.lstatSync(file); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; }
}
function inside(root, target) {
  const relative = path.relative(root, target);
  return !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}
function resolveWithin(root, relative, label = 'path') {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative)) throw new Error(`${label}: expected a project-relative path`);
  const target = path.resolve(root, relative);
  if (!inside(root, target)) throw new Error(`${label}: escapes project`);
  let existing = target;
  while (existing !== root) {
    try { fs.lstatSync(existing); break; }
    catch (e) { if (e.code !== 'ENOENT') throw e; existing = path.dirname(existing); }
  }
  let canonical;
  try { canonical = fs.realpathSync(existing); } catch (_) { throw new Error(`${label}: unresolvable path or dangling symlink`); }
  if (!inside(root, canonical)) throw new Error(`${label}: symlink escapes project`);
  return target;
}
function discover(cwd = process.cwd()) {
  const supplied = fs.realpathSync(cwd);
  let root = supplied;
  let git = false;
  try {
    root = fs.realpathSync(execFileSync('git', ['-C', supplied, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
    git = true;
  } catch (_) {
    for (let current = supplied; ; current = path.dirname(current)) {
      if (hasEntry(path.join(current, '.gsr.json')) || CANDIDATES.some(d => fs.existsSync(path.join(current, d, 'STATE.md')))) { root = current; break; }
      if (path.dirname(current) === current) break;
    }
  }
  const configPath = path.join(root, '.gsr.json');
  let raw = null;
  if (hasEntry(configPath)) {
    resolveWithin(root, '.gsr.json', 'config');
    if (fs.statSync(configPath).size > 262144) throw new Error('Invalid .gsr.json: configuration exceeds 256 KiB');
    try { raw = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (_) { throw new Error('Invalid .gsr.json: expected JSON'); }
    require('./config').validate(raw, root);
  }
  let docRoot = raw?.docRoot;
  let score = 0;
  if (!docRoot) {
    docRoot = 'docs';
    for (const candidate of CANDIDATES) {
      const candidateScore = ARTIFACTS.filter(a => fs.existsSync(path.join(root, candidate, a))).length;
      if (candidateScore > score) { score = candidateScore; docRoot = candidate; }
    }
  }
  const docs = resolveWithin(root, docRoot, 'docRoot');
  docRoot = path.relative(root, docs).split(path.sep).join('/') || '.';
  return { root, git, docRoot, docs, configPath, config: raw, initialized: !!raw || fs.existsSync(path.join(docs, 'STATE.md')), score };
}
module.exports = { discover, resolveWithin, inside, CANDIDATES, ARTIFACTS };
