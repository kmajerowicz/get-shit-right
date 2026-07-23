# GSR Hooks — Terminal Enhancements & Enforcement

Six hooks across four Claude Code events. Only the status line needs installing
into your Claude config — everything else runs straight from the plugin
directory via `hooks.json`, no copying, no settings.json edits.

## What They Do

### SessionStart — `session-start`
Runs on session start, resume, `/clear`, and `/compact`. Detects whether the
project is a GSR project (`docs/STATE.md` present) and injects current phase,
focus, and any in-progress build plan or debug session into context. Also
auto-installs / auto-refreshes the status line the first time it's missing or
out of date (version-stamped, so plugin updates propagate without a manual
`/gsr:update`).

### PostToolUse — `gsr-statusline.js` (writes) is separate; these two run after every tool call:

**`gsr-context-monitor.js`** — invisible hook that warns the **agent** (not you)
when context is running low:
- **WARNING at 65% used**: "Finish current task, avoid new complex work"
- **CRITICAL at 75% used**: "Stop, inform user, don't start new tasks"

**`gsr-gate-tracker.js`** — tracks whether the gate function (build / type-check
/ tests) has run since the last file edit. Writes dirty/clean state to a bridge
file (`/tmp/gsr-gate-{session}.json`) consumed by the PreToolUse gate guard
below. Only active in GSR projects.

### PreToolUse (Bash) — `gsr-gate-guard.js`
If `git commit` is attempted while files have changed since the gate function
last ran, this asks for confirmation instead of committing silently — Iron Law
"never claim done without evidence" enforced as infrastructure, not just prose.
Uses `permissionDecision: "ask"`, never `"deny"`: the human can always approve
and commit anyway. Only active in GSR projects.

### Stop — `gsr-redflag-guard.js`
If the final assistant message in a GSR project uses banned completion
language ("should work", "looks good", etc.) without an accompanying evidence
line, this sends Claude back once to verify and restate the claim properly.
`stop_hook_active` prevents a retry loop. Only active in GSR projects.

### Status Line — `gsr-statusline.js`
Shows persistent info at the bottom of Claude Code:
```
Claude Opus 4.6 │ Phase 2 — creative │ myproject ████████░░ 72%
```
- **Model** — current model name
- **Focus** — current phase/task from `docs/STATE.md` (falls back to Claude Code todos)
- **Directory** — project folder name
- **Context bar** — visual usage indicator with color thresholds:
  - Green <50% | Yellow <65% | Orange <80% | Red+blinking >80%

The status line tells YOU. The context monitor tells CLAUDE. Two channels, two audiences.

## Installation

Only the status line requires copying into `~/.claude/hooks/` and registering
in `~/.claude/settings.json` — Claude Code plugins can't ship a statusline any
other way. Everything else (session-start, context monitor, gate tracker, gate
guard, red-flag guard) is registered declaratively in `hooks.json` and runs
directly from `${CLAUDE_PLUGIN_ROOT}/hooks/`.

### Option A: Run the install script
```bash
node hooks/install.js
```
If you have a non-GSR status line already configured, install.js leaves it
alone and tells you to re-run with `--force` to replace it.

### Option B: Manual setup

Copy the status line to Claude config:
```bash
cp hooks/gsr-statusline.js ~/.claude/hooks/
```

Add to `~/.claude/settings.json`:
```json
{
  "statusLine": {
    "type": "command",
    "command": "node \"~/.claude/hooks/gsr-statusline.js\""
  }
}
```

## How They Work Together

```
Every status line refresh:
  statusline.js → writes metrics to /tmp/claude-ctx-{session}.json
                → renders status bar for user

Every tool use:
  context-monitor.js → reads /tmp/claude-ctx-{session}.json
                     → if context low: injects warning into conversation
  gsr-gate-tracker.js → reads/writes /tmp/gsr-gate-{session}.json
                      → marks dirty on Edit/Write, clean after a gate command

Before a Bash "git commit":
  gsr-gate-guard.js → reads /tmp/gsr-gate-{session}.json
                    → if dirty: asks for confirmation instead of committing silently

At the end of every turn:
  gsr-redflag-guard.js → reads the last assistant message from the transcript
                        → if red-flag language with no evidence: blocks once, asks Claude to verify
```

## GSR-Aware Behavior

Every hook except the status line and (for now) context monitor's generic path
checks for `docs/STATE.md` and no-ops entirely outside a GSR project — none of
this enforcement fires in a plain repo.

### Session Resume (`session-start`)
On every session start, `/clear`, and `/compact`, the hook also scans `docs/plans/` for any plan file with `status: in_progress` and injects a resume prompt:
- **Active plan**: shows feature, progress (X/N tasks done), and next task
- **Stale plan** (last updated >7 days ago): flagged as "possibly abandoned" so Claude doesn't blindly resume abandoned work
