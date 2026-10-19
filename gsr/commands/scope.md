---
description: Shape an idea or existing materials into a structured scope document
---

You are running the `/gsr:scope` command.

**Project discovery:** Resolve the canonical project/worktree and DOC_ROOT with `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`. Invocation in a subdirectory or through a symlink does not require directory confirmation. Never silently follow an obsolete session manifest to a different project. Reconcile invalid configuration; ask only if the intended project is genuinely unresolved.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:scope", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — reconcile `project_dir`/`project_name` with the canonical intended project rather than retaining stale identity; update command/time without overwriting unrelated fields.

Load and execute the scope-shaping skill: read `${CLAUDE_PLUGIN_ROOT}/skills/scope-shaping/SKILL.md` in full, then follow its instructions exactly.

Output uses resolved DOC_ROOT: scope.md for a new product/materials, or a focused features/<slug>.md contract for an existing-product change. No whole PRD/scaffolding for a bounded correction.

At a major stage boundary, save the compact Active Task packet per
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/stage-handoff.md`, including original scope/cadence,
actual result/limits and next authorized action. Recommend `/clear` then **dalej**
when another stage remains; direct next-stage commands are optional. Do not manufacture
implementation authority from a planning-only request or a verified check. If the task
is complete, report the result without inventing a next stage.
