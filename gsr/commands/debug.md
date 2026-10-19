---
description: Start or resume a persistent debug session that survives /clear
argument-hint: [resume <slug>]
---

You are running the `/gsr:debug` command.

**Project discovery:** Resolve the canonical project/worktree and DOC_ROOT with `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`. Invocation in a subdirectory or through a symlink does not require directory confirmation. Never silently follow an obsolete session manifest to a different project. Reconcile invalid configuration; ask only if the intended project is genuinely unresolved.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:debug", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — preserve `project_dir` and `project_name`, update `last_command` and `timestamp`.

**Invocation variants:**

- `/gsr:debug` — no argument: scan `docs/debug/` for files with `status: active` in frontmatter. Resume the matching authorized task automatically after reconciling files/freshness. Ask which session only if genuinely ambiguous; if none exists, use the supplied symptom before asking for missing context. Resolve `docs/` through DOC_ROOT.
- `/gsr:debug resume <slug>` — load `docs/debug/<slug>.md` directly, continue from Current Focus + Next Step.

Load and execute the debug skill: read `${CLAUDE_PLUGIN_ROOT}/skills/debug/SKILL.md` in full, then follow its instructions exactly.

When a debug session is resolved, tell the user:
> Session resolved and saved to DOC_ROOT/debug/<slug>.md. Report actual verification/limits, then resume remaining authorized build work.
