---
name: gsr-quick
description: Execute one bounded task with GSR invariants (evidence, human ownership of product decisions, atomic commits) and zero pipeline ceremony — no scope, no PRD, no mode selection. Use for small tasks that don't warrant the full GSR flow.
---

# /gsr:quick — Quick Task Skill

One bounded task, GSR invariants, zero ceremony. No scope, no PRD, no feature
file, no mode selection, no skills-matching gate.

## Iron Laws (all invariants — no exceptions at any project weight)

1. **Evidence before "done".** Run the gate function; use the evidence format.
   Banned phrases: "should work", "seems correct", "looks good".
2. **Human owns product decisions.** If the task hides a product decision
   (user-visible behavior, limits, formats), surface it via the decision gate
   pattern — or record a D-pin if the user defers and a ledger exists.
3. **Corrections compound.** On user correction: implement, then ask "Add to
   CLAUDE.md Learned Rules?"
4. **Atomic commit** with evidence in the message.
5. **Never reference assets that don't exist.**

## Flow

1. Read CLAUDE.md if it exists (conventions + Learned Rules). Read nothing else
   upfront.
2. Restate the task in one line; if scope is genuinely ambiguous, ask ONE
   clarifying question, else proceed.
3. Implement in the smallest reasonable diff.
4. Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md` (single source of truth).
5. Report with the evidence format:
   `✅ <command> → <output summary> → "<claim>"`
6. Commit: `<type>: <task> — <evidence summary>`.
7. If `docs/STATE.md` exists, append one line under a `## Quick Tasks` section
   (create it at the end of the file if missing): `- [<date>] <task> — <commit sha>`.
   If it doesn't exist, skip silently — quick works without GSR structure.

## Escalation

If the task turns out to touch >5 files, need a product decision the user won't
make inline, or break existing behavior: stop and say "This outgrew quick —
recommend `/gsr:build` (or `/gsr:scope` if the product is undefined)." Never
soldier on past the boundary.

## Red Flags

| Thought | Reality |
|---------|---------|
| "It's quick mode, I'll skip the gate function" | Invariant. Evidence or it didn't happen. |
| "I'll expand scope while I'm in here" | Quick = the asked task. Note extras, don't do them. |
| "No STATE.md, so I can't work" | Quick needs nothing. Work. |
