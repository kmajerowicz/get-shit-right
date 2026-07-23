#!/usr/bin/env node
// GSR Hooks Installer
// Copies the statusline to ~/.claude/hooks/ and configures settings.json.
// Context monitor and enforcement hooks run straight from the plugin
// directory via hooks.json — they need no installation here.

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const hooksDir = path.join(claudeDir, 'hooks');
const settingsPath = path.join(claudeDir, 'settings.json');
const srcDir = __dirname;
const FORCE = process.argv.includes('--force');

function readPluginVersion() {
  try {
    return JSON.parse(fs.readFileSync(path.join(srcDir, '..', '.claude-plugin', 'plugin.json'), 'utf8')).version;
  } catch (e) {
    return '0.0.0';
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function log(msg) { console.log(`  ${msg}`); }
function ok(msg) { console.log(`  \x1b[32m✓\x1b[0m ${msg}`); }
function warn(msg) { console.log(`  \x1b[33m!\x1b[0m ${msg}`); }
function err(msg) { console.log(`  \x1b[31m✗\x1b[0m ${msg}`); }

// ── Ensure directories ────────────────────────────────────────────────────

console.log('\n\x1b[1mGSR Hooks Installer\x1b[0m\n');

if (!fs.existsSync(claudeDir)) {
  err(`Claude config directory not found: ${claudeDir}`);
  err('Is Claude Code installed?');
  process.exit(1);
}

if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
  ok(`Created ${hooksDir}`);
}

// ── Copy the statusline ──────────────────────────────────────────────────

const file = 'gsr-statusline.js';
const src = path.join(srcDir, file);
const dst = path.join(hooksDir, file);

if (!fs.existsSync(src)) {
  err(`Source not found: ${src}`);
  process.exit(1);
}

// Check if GSD version exists — don't overwrite, coexist
const gsdEquiv = file.replace('gsr-', 'gsd-');
if (fs.existsSync(path.join(hooksDir, gsdEquiv))) {
  warn(`GSD hook found (${gsdEquiv}) — GSR hook will be installed alongside it`);
}

const version = readPluginVersion();
const stamped = `// gsr-hook-version: ${version}\n${fs.readFileSync(src, 'utf8')}`;
fs.writeFileSync(dst, stamped);
ok(`Copied ${file} → ${dst}`);

// ── Update settings.json ──────────────────────────────────────────────────

let settings = {};
if (fs.existsSync(settingsPath)) {
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    err(`Failed to parse ${settingsPath}: ${e.message}`);
    process.exit(1);
  }
}

// Statusline
const statuslineCmd = `node "${path.join(hooksDir, 'gsr-statusline.js')}"`;
const existingStatusline = settings.statusLine?.command || '';
const existingIsForeign = existingStatusline &&
  !existingStatusline.includes('gsr-statusline') &&
  !existingStatusline.includes('gsd-statusline');

if (existingStatusline.includes('gsd-statusline')) {
  warn('Status line is configured for GSD — replacing with GSR');
}

if (existingIsForeign && !FORCE) {
  warn('Existing custom status line detected — keeping it. Run with --force to replace.');
} else {
  settings.statusLine = { type: 'command', command: statuslineCmd };
  ok('Status line configured');
}

// Write settings
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
ok(`Updated ${settingsPath}`);

// ── Done ──────────────────────────────────────────────────────────────────

console.log('\n\x1b[32m\x1b[1mDone!\x1b[0m Restart Claude Code to activate.\n');
console.log('  Status line: model │ current focus │ directory │ context bar');
console.log('  Context monitor and enforcement hooks run from the plugin directory automatically.');
console.log('');
