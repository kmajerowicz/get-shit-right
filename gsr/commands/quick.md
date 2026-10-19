---
description: One bounded task with GSR guarantees — no scope/PRD ceremony
argument-hint: <task>
---

You are running the `/gsr:quick` command.

The user's task is the command argument (everything after `/gsr:quick`). If no
argument was given, reuse the latest explicit task or an unambiguous saved quick-task continuation; ask "What's the task?" only if no target is identifiable.

Resolve the canonical intended project/DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`. A stale manifest never changes project silently; reconcile it with the request/files. Ask only if the project is genuinely unclear.

Direct quick executes only the bounded requested correction, with proportionate checks. No learn sweep, full PRD, feature file or pipeline scaffolding is needed. Missing STATE is valid. If scope grows, preserve existing authority and prepare a bounded checkpoint/next-stage handoff; recommend `/clear` then "dalej" for a large next stage without executing a broader product task or resetting context itself.

Load and execute the quick skill: read `${CLAUDE_PLUGIN_ROOT}/skills/quick/SKILL.md`
in full, then follow its instructions exactly.
