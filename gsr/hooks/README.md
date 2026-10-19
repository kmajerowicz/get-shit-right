# GSR hooks

Only the statusline is copied to Claude config. SessionStart, context monitor and
commit observation run from the plugin via `hooks.json`.

## SessionStart

On startup/resume/clear/compact, `session-start` discovers canonical project and
DOC_ROOT through `lib/project.js`, injects bounded state/task context and observes
verification freshness. It never runs configured checks or writes project docs.
Statusline installation preserves the shebang at byte zero and stamps version on
line two. Old first-line markers are recognized and repaired even at the same
version. Installer validates the installed executable before reporting success,
preserves unrelated settings and custom statuslines, and rejects malformed settings.
Set `CLAUDE_CONFIG_DIR` for isolated installs; `--force` deliberately replaces a
custom statusline. Keeping a custom statusline does not establish context monitoring:
the monitor still depends on metrics written by GSR's statusline (B08 deferred).

## PostToolUse

`gsr-context-monitor.js` retains its existing context metrics behavior. The former
`gsr-gate-tracker.js` remains an inert compatibility entry point, unregistered.
Commands and tool output never create passing evidence.

## PreToolUse (Bash)

`gsr-gate-guard.js` observes fresh project-bound evidence at commit attempts and
injects a short `hookSpecificOutput` with `hookEventName: PreToolUse` and
`additionalContext` for unverified/stale/failed results. It emits no
`permissionDecision`, never authorizes commits and never asks the user a GSR
permission question. Actual host permissions and user instructions remain binding.

## Completion

The regex Stop guard is unregistered; its compatibility entry point is inert.
Workflows read runner records at completion and report actual results and limitations.
Neither banned wording nor an emoji evidence line proves verification. No retry loop.

## Statusline installation

Run `node hooks/install.js` from the plugin, or let SessionStart refresh it. For
manual configuration use the actual absolute statusline path as a Node command in
`settings.json.statusLine`. The standalone installed statusline retains its existing
focus/metrics implementation; broader context monitoring work is deferred.

See [verification contract](../docs/patterns/verification-contract.md) for discovery,
config, checks, storage, freshness and limitations. Claude output schema checked
against [official hooks documentation](https://code.claude.com/docs/en/hooks) on
2026-10-11. Deterministic stdin/schema tests are not a real-host/model interaction
validation and do not establish Codex native hook parity. Live results/gaps are
recorded in the phase implementation report.


## Fresh-context packet

At clear/start/resume, the read-only task context includes the optional Active Task
stage/checkpoint/next step/minimum Read next references plus current evidence observations.
It does not load all project files, execute a stage or send an interactive first prompt.
After the user writes **dalej**, coordinate guidance resolves the remaining bounded step
within original scope/cadence. Ambiguous/missing/escaping refs are diagnostics; legacy
STATE remains valid. See [stage handoff](../docs/patterns/stage-handoff.md). Actual
clear/model/bare-message observations remain distinct from deterministic/native startup
smoke; `/gsr:start continue` is an explicit fallback, not proof of preferred-flow support.
