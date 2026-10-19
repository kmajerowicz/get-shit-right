---
name: gsr-quick
description: Execute one bounded task with GSR invariants (evidence, human ownership of product decisions, atomic commits) and zero pipeline ceremony — no scope, no PRD, no mode selection. Use for small tasks that don't warrant the full GSR flow.
---

# /gsr:quick — Quick Task Skill

One bounded task, GSR invariants, zero ceremony. No scope, no PRD, no feature
file, no mode selection, no skills-matching gate.

## Collaboration contract

Explicit task authorization and constraints override generic workflow defaults within host permissions. Read settled answers from the conversation and project files; never ask for them again. A planning-only request does not authorize implementation. Prepare plans, research material uncertainties, load installed skills, record state and run proportionate checks without separate approval. Weight controls rigor, not authority or review cadence. Honor explicitly requested per-chunk review and later instructions narrowing autonomy; otherwise continue reversible work in scope. Ask only for an unresolved consequential product choice or a real installation, spending, publishing, destructive-action or host permission boundary. Continue independent authorized work while a decision is pending. Completion reports give the outcome, brief verification and unresolved limits; detailed evidence stays accessible.

Discover the canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`; below, `docs/` means that resolved DOC_ROOT, not an assumed folder. Invalid discovery/configuration is a diagnostic to reconcile, never permission to silently switch projects.

### Task continuation and completion

When authorized work updates STATE, add/update one optional `## Active Task` section
without rewriting unrelated sections. Record objective, constraints, authorized scope,
source/date of authorization in prose, explicit review cadence, current plan/task relative
to DOC_ROOT, last verified run reference and next action. The template is
`${CLAUDE_PLUGIN_ROOT}/templates/state-md.md`; legacy files remain valid.

On resume read this section by heading (not the first 20 lines), read the referenced
current task/plan, inspect actual repository state and observe current evidence freshness.
Reconcile missing references and conflicting recorded progress with files; a done box is
not proof and stale tests do not reset implemented work. Resume remaining authorized work
without re-asking settled decisions. Preserve explicitly requested review boundaries;
later instructions narrowing autonomy override STATE. No session record expands authority.

At completion recheck evidence freshness. Report outcome, brief actual verification/run
reference and unresolved limitations or necessary decision. Keep detailed gate output in
records, not duplicate STATE assertions. Browser/manual observations and unavailable
coverage remain explicit; machine checks never establish human acceptance. Do not demand
user acceptance for each successful automated check.

## Iron Laws (all invariants — no exceptions at any project weight)

1. **Evidence before "done".** Run the gate function; use the evidence format.
   Scale verification to the actual change and report unavailable coverage.
2. **Human owns product decisions.** If the task hides a product decision
   (user-visible behavior, limits, formats), surface it via the decision gate
   pattern — or record a D-pin if the user defers and a ledger exists.
3. **Corrections compound.** Record relevant user corrections in
   CLAUDE.md Learned Rules within authorized work without routine confirmation.
4. **Atomic commits only when authorized**, with actual evidence.
5. **Never reference assets that don't exist.**

## Flow

1. Read CLAUDE.md if it exists (conventions + Learned Rules). Read other relevant task/configuration files as needed; avoid unrelated intake.
2. Restate the task in one line; if scope is genuinely ambiguous, ask ONE
   clarifying question, else proceed.
3. Implement in the smallest reasonable diff.
4. Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md` (single source of truth).
5. Report outcome, brief verification and unresolved limits; link detailed evidence.
6. Commit only if authorized: `<type>: <task> — <evidence summary>`.
7. If `docs/STATE.md` exists, append one line under a `## Quick Tasks` section
   (create it at the end of the file if missing): `- [<date>] <task> — <evidence reference; commit sha only if authorized>`.
   If it doesn't exist, skip silently — quick works without GSR structure.

## Escalation

If complexity grows, prepare a bounded plan and use build/debug techniques within the authorized scope without a new mode/plan approval. Ask only for an unresolved consequential product choice or scope expansion. Continue independent work while waiting.

## Red Flags

| Thought | Reality |
|---------|---------|
| "It's quick mode, I'll skip the gate function" | Invariant. Evidence or it didn't happen. |
| "I'll expand scope while I'm in here" | Quick = the asked task. Note extras, don't do them. |
| "No STATE.md, so I can't work" | Quick needs nothing. Work. |
