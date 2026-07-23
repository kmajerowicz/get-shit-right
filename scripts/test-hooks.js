#!/usr/bin/env node
'use strict';

// Fixture-based unit tests for GSR's hook scripts. Pipes realistic stdin JSON
// through each hook and asserts on stdout — catches the class of bug where a
// hook silently no-ops because of an env-var assumption that doesn't hold
// (e.g. the CLAUDE_CWD regression this test suite exists to prevent).

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const ROOT = path.resolve(__dirname, '..');
const HOOKS = path.join(ROOT, 'gsr', 'hooks');
const FIXTURES = path.join(__dirname, 'fixtures');
const GSR_PROJECT = path.join(FIXTURES, 'gsr-project');
const NON_GSR_PROJECT = path.join(FIXTURES, 'non-gsr-project');

function runHook(script, input, extraEnv) {
  return execFileSync(process.execPath, [path.join(HOOKS, script)], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });
}

function uniqueSessionId(label) {
  return `test-${label}-${process.pid}-${Math.floor(Math.random() * 1e9)}`;
}

function gateBridgePath(sessionId) {
  return path.join(os.tmpdir(), `gsr-gate-${sessionId}.json`);
}

// ── session-start ────────────────────────────────────────────────────────

test('session-start: GSR project prints project state block', () => {
  const claudeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-claude-'));
  try {
    const out = runHook('session-start', { cwd: GSR_PROJECT }, { CLAUDE_CONFIG_DIR: claudeDir });
    assert.match(out, /<gsr-context>/);
    assert.match(out, /This is a GSR \(Get Shit Right\) project/);
    assert.match(out, /Current project state/);
    assert.match(out, /Fixture Project/);
  } finally {
    fs.rmSync(claudeDir, { recursive: true, force: true });
  }
});

test('session-start: non-GSR directory prints the generic banner', () => {
  const claudeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gsr-claude-'));
  try {
    const out = runHook('session-start', { cwd: NON_GSR_PROJECT }, { CLAUDE_CONFIG_DIR: claudeDir });
    assert.match(out, /GSR \(Get Shit Right\) is available/);
    assert.doesNotMatch(out, /Current project state/);
  } finally {
    fs.rmSync(claudeDir, { recursive: true, force: true });
  }
});

test('session-start: never reads CLAUDE_CWD (regression guard)', () => {
  const src = fs.readFileSync(path.join(HOOKS, 'session-start'), 'utf8');
  assert.doesNotMatch(src, /CLAUDE_CWD/);
});

// ── gsr-gate-tracker + gsr-gate-guard ───────────────────────────────────────

test('gate guard: asks before a commit when dirty since the last gate run', () => {
  const sessionId = uniqueSessionId('dirty');
  const bridge = gateBridgePath(sessionId);
  try {
    runHook('gsr-gate-tracker.js', {
      session_id: sessionId, cwd: GSR_PROJECT, tool_name: 'Edit', tool_input: {},
    });
    const out = runHook('gsr-gate-guard.js', {
      session_id: sessionId, cwd: GSR_PROJECT, tool_name: 'Bash',
      tool_input: { command: 'git commit -m "x"' },
    });
    const parsed = JSON.parse(out);
    assert.equal(parsed.hookSpecificOutput.permissionDecision, 'ask');
  } finally {
    fs.rmSync(bridge, { force: true });
  }
});

test('gate guard: silent once the gate command has run', () => {
  const sessionId = uniqueSessionId('clean');
  const bridge = gateBridgePath(sessionId);
  try {
    runHook('gsr-gate-tracker.js', {
      session_id: sessionId, cwd: GSR_PROJECT, tool_name: 'Edit', tool_input: {},
    });
    runHook('gsr-gate-tracker.js', {
      session_id: sessionId, cwd: GSR_PROJECT, tool_name: 'Bash',
      tool_input: { command: 'npm run build' },
    });
    const out = runHook('gsr-gate-guard.js', {
      session_id: sessionId, cwd: GSR_PROJECT, tool_name: 'Bash',
      tool_input: { command: 'git commit -m "x"' },
    });
    assert.equal(out.trim(), '');
  } finally {
    fs.rmSync(bridge, { force: true });
  }
});

test('gate guard: silent outside a GSR project', () => {
  const sessionId = uniqueSessionId('non-gsr');
  runHook('gsr-gate-tracker.js', {
    session_id: sessionId, cwd: NON_GSR_PROJECT, tool_name: 'Edit', tool_input: {},
  });
  const out = runHook('gsr-gate-guard.js', {
    session_id: sessionId, cwd: NON_GSR_PROJECT, tool_name: 'Bash',
    tool_input: { command: 'git commit -m "x"' },
  });
  assert.equal(out.trim(), '');
});

// ── gsr-redflag-guard ────────────────────────────────────────────────────

test('redflag guard: blocks a red-flag claim with no evidence', () => {
  const out = runHook('gsr-redflag-guard.js', {
    session_id: uniqueSessionId('redflag'),
    cwd: GSR_PROJECT,
    transcript_path: path.join(FIXTURES, 'transcript-redflag.jsonl'),
  });
  const parsed = JSON.parse(out);
  assert.equal(parsed.decision, 'block');
  assert.match(parsed.reason, /red-flag/i);
});

test('redflag guard: silent when evidence is present', () => {
  const out = runHook('gsr-redflag-guard.js', {
    session_id: uniqueSessionId('clean-transcript'),
    cwd: GSR_PROJECT,
    transcript_path: path.join(FIXTURES, 'transcript-clean.jsonl'),
  });
  assert.equal(out.trim(), '');
});

test('redflag guard: silent outside a GSR project', () => {
  const out = runHook('gsr-redflag-guard.js', {
    session_id: uniqueSessionId('redflag-non-gsr'),
    cwd: NON_GSR_PROJECT,
    transcript_path: path.join(FIXTURES, 'transcript-redflag.jsonl'),
  });
  assert.equal(out.trim(), '');
});

test('redflag guard: respects stop_hook_active to prevent loops', () => {
  const out = runHook('gsr-redflag-guard.js', {
    session_id: uniqueSessionId('loop-guard'),
    cwd: GSR_PROJECT,
    transcript_path: path.join(FIXTURES, 'transcript-redflag.jsonl'),
    stop_hook_active: true,
  });
  assert.equal(out.trim(), '');
});
