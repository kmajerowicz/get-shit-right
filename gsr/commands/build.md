---
description: Build the requested feature or phase with configured verification and the requested review cadence
argument-hint: '[feature-slug | DOC_ROOT-relative-file] [--sketch]'
---

You are running the `/gsr:build` command.

**Project discovery:** Resolve the canonical project/worktree and DOC_ROOT with `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`. Invocation in a subdirectory or through a symlink does not require directory confirmation. Never silently follow an obsolete session manifest to a different project. Reconcile invalid configuration; ask only if the intended project is genuinely unresolved.

**Session manifest:** After confirming the working directory, write `.gsr-session.json` in the project root:
```json
{ "project_dir": "<absolute path>", "project_name": "<from CLAUDE.md or scope>", "last_command": "gsr:build", "timestamp": "<ISO 8601>" }
```
Update this file (don't recreate) if it already exists — reconcile `project_dir` and `project_name` against the canonical intended project instead of preserving stale identity; update `last_command` and `timestamp`.

**Target handling:** Pass `$ARGUMENTS` to the skill: after removing `--sketch`, a slug names `DOC_ROOT/features/<slug>.md` and a DOC_ROOT-relative file names the exact spec. Without an explicit target use the latest request or unambiguous saved Active Task. A sufficient feature spec works without PRD/STATE; do not ask for another feature choice or force whole-product PRD preparation. Validate references through the existing task-handoff helper.

**Flag handling:** If invoked as `/gsr:build --sketch`, set `FORCE_SKETCH=true` before loading the skill so Step 2.5 prepares the artifact regardless of the heuristic; it does not imply another approval gate.

Load and execute the build skill: read `${CLAUDE_PLUGIN_ROOT}/skills/build/SKILL.md` in full, then follow its instructions exactly.

At the build stage boundary, report actual outcome, brief verification and unresolved limits, save the exact next action/task reference and recommend `/clear`, then **"dalej"**. Continue authorized work within the current stage; long builds may hand off checked partial checkpoints with remaining progress explicit. Direct verification/build commands remain optional controls. Human acceptance is separate; no automatic reset or reapproval.
