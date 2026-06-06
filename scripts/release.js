#!/usr/bin/env node
'use strict';

/**
 * release.js — the single action that moves everything forward together.
 *
 *   node scripts/release.js              # version derived from commits (git-cliff)
 *   node scripts/release.js patch|minor|major
 *   node scripts/release.js 0.3.0        # explicit version
 *
 * Flags:
 *   --dry-run    show what would happen, change nothing
 *   --publish    after the local commit+tag, push and create a GitHub Release
 *
 * What it does, atomically:
 *   1. refuse to run on a dirty tree
 *   2. decide the next version
 *   3. write it to package.json, plugin.json, marketplace.json, README highlight
 *   4. generate the new CHANGELOG section with git-cliff and splice it in
 *   5. run `npm run check` to self-verify (incl. version-sync)
 *   6. commit `chore(release): vX.Y.Z` and create annotated tag vX.Y.Z
 *   7. (--publish) push branch + tag and create the GitHub Release
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
// Matches the whole marker comment regardless of any descriptive text inside it.
const MARKER_RE = /<!--\s*GSR:RELEASES[\s\S]*?-->/;

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry-run');
const PUBLISH = argv.includes('--publish');
const positional = argv.find((a) => !a.startsWith('--'));

const sh = (cmd, opts = {}) =>
  execSync(cmd, { cwd: ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
const log = (...a) => console.log(...a);
const die = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

function readJSON(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

function bump(version, kind) {
  const [maj, min, pat] = version.split('.').map(Number);
  if (kind === 'major') return `${maj + 1}.0.0`;
  if (kind === 'minor') return `${maj}.${min + 1}.0`;
  return `${maj}.${min}.${pat + 1}`; // patch
}

function decideVersion(current) {
  if (positional && /^\d+\.\d+\.\d+$/.test(positional)) return positional;
  if (['major', 'minor', 'patch'].includes(positional)) return bump(current, positional);
  // auto: ask git-cliff what the commits imply
  try {
    const v = sh('npx git-cliff --bumped-version').replace(/^v/, '');
    if (/^\d+\.\d+\.\d+$/.test(v)) return v;
  } catch (_) {
    /* fall through */
  }
  die('Could not derive a version automatically. Pass one explicitly: `npm run release patch`');
}

// --- guards -----------------------------------------------------------------
let status;
try {
  status = sh('git status --porcelain');
} catch (_) {
  die('Not a git repository.');
}
if (status && !DRY) {
  die('Working tree is not clean. Commit or stash changes before releasing.');
}

const branch = sh('git rev-parse --abbrev-ref HEAD');
if (branch !== 'main' && !DRY) {
  log(`⚠ You are on "${branch}", not "main". Continuing anyway.`);
}

// --- decide version ---------------------------------------------------------
const current = readJSON('package.json').version;
const next = decideVersion(current);
const tag = `v${next}`;
const today = new Date().toISOString().slice(0, 10);

log(`\nRelease: ${current} → ${next}  (tag ${tag}, ${today})`);
if (DRY) log('--dry-run: no files will change.\n');

// --- generate the changelog section first (so we can preview in dry-run) ----
let section;
try {
  section = sh(`npx git-cliff --unreleased --tag ${tag}`);
} catch (e) {
  die(`git-cliff failed: ${e.message}`);
}
if (!section.trim()) {
  die('git-cliff produced an empty section — no notable (feat/fix/perf) commits since the last tag. Nothing to release.');
}

log('\n--- new CHANGELOG section ---');
log(section);
log('-----------------------------\n');

if (DRY) {
  log('Would update: package.json, plugin.json, marketplace.json, CHANGELOG.md');
  log(`Would commit: chore(release): ${tag}`);
  log(`Would tag:    ${tag}`);
  if (PUBLISH) log('Would push and create a GitHub Release.');
  process.exit(0);
}

// --- write version into the three sources -----------------------------------
function editFile(rel, fn) {
  const p = path.join(ROOT, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  fs.writeFileSync(p, after);
}

editFile('package.json', (s) => s.replace(/("version":\s*")[^"]+(")/, `$1${next}$2`));
editFile('gsr/.claude-plugin/plugin.json', (s) => s.replace(/("version":\s*")[^"]+(")/, `$1${next}$2`));
editFile('.claude-plugin/marketplace.json', (s) => s.replace(/("version":\s*")[^"]+(")/, `$1${next}$2`));

// --- splice the section into CHANGELOG.md after the marker ------------------
editFile('CHANGELOG.md', (s) => {
  if (!MARKER_RE.test(s)) {
    die('CHANGELOG.md is missing the <!-- GSR:RELEASES --> marker — cannot splice safely.');
  }
  return s.replace(MARKER_RE, (m) => `${m}\n\n${section.trim()}`);
});

// --- self-verify ------------------------------------------------------------
log('Running `npm run check` …');
try {
  execSync('npm run check', { cwd: ROOT, stdio: 'inherit' });
} catch (_) {
  die('`npm run check` failed after writing version files. Aborting before commit. Review the changes (git diff) and fix.');
}

// --- commit + tag -----------------------------------------------------------
sh('git add -A');
sh(`git commit -m "chore(release): ${tag}"`);
sh(`git tag -a ${tag} -m "${tag}"`);
log(`\n✓ Committed and tagged ${tag}.`);

const [, , patch] = next.split('.');
if (patch === '0') {
  log('ℹ Minor/major release — consider refreshing the "What\'s new in …" highlight in README.md.');
}

// --- publish ----------------------------------------------------------------
if (PUBLISH) {
  log('\nPublishing …');
  sh(`git push origin ${branch}`);
  sh(`git push origin ${tag}`);
  const notes = sh(`npx git-cliff --latest --strip header`);
  const tmp = path.join(ROOT, '.release-notes.tmp.md');
  fs.writeFileSync(tmp, notes);
  try {
    execSync(`gh release create ${tag} --title ${tag} --notes-file "${tmp}" --verify-tag`, {
      cwd: ROOT,
      stdio: 'inherit',
    });
  } finally {
    fs.unlinkSync(tmp);
  }
  log(`\n✓ Published GitHub Release ${tag}.`);
} else {
  log('\nNext steps (or re-run with --publish to do both automatically):');
  log(`  git push origin ${branch} && git push origin ${tag}`);
  log(`  gh release create ${tag} --title ${tag} --notes-file <(npx git-cliff --latest --strip header)`);
}
