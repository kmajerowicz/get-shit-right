#!/usr/bin/env node
'use strict';

/**
 * check-commit-msg.js — the gate.
 *
 * Every commit must be a valid Conventional Commit so git-cliff can decide
 * whether it is "notable" (shown in the changelog) or "quiet" (skipped).
 * A mistyped feature is a change that silently never gets presented — that is
 * exactly what we refuse to allow.
 *
 * Two modes:
 *   node scripts/check-commit-msg.js <path-to-msg-file>   # commit-msg hook
 *   node scripts/check-commit-msg.js --range <gitrange>   # CI, validates each commit
 */

const fs = require('fs');
const { execSync } = require('child_process');

const NOTABLE = ['feat', 'fix', 'perf', 'revert'];
const QUIET = ['docs', 'style', 'refactor', 'test', 'chore', 'ci', 'build', 'i18n'];
const TYPES = [...NOTABLE, ...QUIET];

// type(optional-scope)optional-!: description
const PATTERN = new RegExp(
  `^(${TYPES.join('|')})(\\([a-z0-9._-]+\\))?(!)?: .+`
);

// Lines we never lint (auto-generated / merge machinery).
const EXEMPT = [/^Merge /, /^Revert "/, /^fixup! /, /^squash! /];

function help() {
  return [
    '',
    'Commit messages must follow Conventional Commits:',
    '',
    '    <type>(optional-scope): <description>',
    '',
    `  notable (shown in CHANGELOG):  ${NOTABLE.join(', ')}`,
    `  quiet   (skipped):             ${QUIET.join(', ')}`,
    '',
    'Examples:',
    '    feat(verify): add spec-drift check',
    '    fix(scope): create STATE.md stub after scope completes',
    '    docs(readme): clarify install steps        # quiet, no release note',
    '    feat(build)!: drop legacy mode             # ! marks a breaking change',
    '',
  ].join('\n');
}

function lint(subject) {
  const problems = [];
  if (EXEMPT.some((re) => re.test(subject))) return problems;
  if (!PATTERN.test(subject)) {
    problems.push(`invalid format: "${subject}"`);
  }
  if (subject.length > 100) {
    problems.push(`subject too long (${subject.length} > 100 chars)`);
  }
  return problems;
}

function getSubjects() {
  const args = process.argv.slice(2);
  if (args[0] === '--range') {
    const range = args[1];
    if (!range) {
      console.error('Usage: check-commit-msg.js --range <git-range>');
      process.exit(2);
    }
    const out = execSync(`git log --no-merges --format=%s ${range}`, {
      encoding: 'utf8',
    });
    return out.split('\n').filter(Boolean);
  }
  // hook mode: first arg is the message file
  const file = args[0];
  if (!file) {
    console.error('Usage: check-commit-msg.js <msg-file> | --range <git-range>');
    process.exit(2);
  }
  const raw = fs.readFileSync(file, 'utf8');
  const subject = raw
    .split('\n')
    .find((l) => l.trim() && !l.startsWith('#'));
  return subject ? [subject] : [];
}

const subjects = getSubjects();
let failed = false;

for (const subject of subjects) {
  const problems = lint(subject);
  if (problems.length) {
    failed = true;
    for (const p of problems) console.error(`✖ ${p}`);
  }
}

if (failed) {
  console.error(help());
  process.exit(1);
}

console.log(`✓ commit message${subjects.length > 1 ? 's' : ''} OK (${subjects.length} checked)`);
