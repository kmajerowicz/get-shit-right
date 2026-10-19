---
description: Show current task, feature progress, next action and verification limits
argument-hint: '[feature-slug | DOC_ROOT-relative-file]'
---

You are running the `/gsr:status` command.

**Working directory check:** Use the user-intended/current project for canonical discovery. A `.gsr-session.json` reference is navigation only; reconcile a conflicting or stale manifest against the current task and files, never silently switch projects.

Discover canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js`.
Respect validated `.gsr.json` and report invalid configuration without silently switching
projects. Below, `docs/` means the resolved DOC_ROOT. Do not run checks in a read-only
status request.

## Resolve the current task before legacy fallbacks

Status-only is read-only: do not write a session manifest, run checks, implement,
execute the saved next step, or update STATE. Use `$ARGUMENTS` as an explicit target
when supplied: a slug resolves to DOC_ROOT/features/<slug>.md; validate a file/section
with `${CLAUDE_PLUGIN_ROOT}/lib/task-handoff.js`. Otherwise use the user's current
unambiguous feature/task reference, then reconciled Active Task `Plan/task`.
Read Active Task by heading via `${CLAUDE_PLUGIN_ROOT}/lib/task-context.js` if STATE
exists; missing STATE is valid for a focused feature. Inspect the referenced actual
spec/plan and relevant files; a task table or STATE label alone is not proof.
Conflicting/missing references are a diagnostic, never a reason to silently switch
to full-product scope. Ask for the target only when it is genuinely ambiguous.

For that task, resolve next action in this order: latest explicit user operation and
constraints → reconciled Active Task `Next step`/`Next action` → current spec/plan
and observed remaining work → legacy phase defaults below. Completed scope with
`Next step: build` remains a build action even if a phase table says NOT STARTED.
`none` does not invent a new stage. Partial/checked-increment checkpoints retain
unfinished work. A status request displays the next action without executing it.

Use saved next-step fields only when they belong to the resolved target; an obsolete
Active Task for another feature cannot supply its next action.

Read open decisions from their actual owner: PRD ledger when it owns this task's
decisions, otherwise scope, or focused feature `Open Decisions` without either.
Follow migration references rather than counting two copies. Report assumed/deferred
IDs and relevant unresolved choices, preserving their status. Missing owner/ledger
means "decision status unknown", never "None". Only an inspected empty/resolved
owner establishes no open decisions. Do not infer human acceptance from tests.

Observe evidence read-only through `${CLAUDE_PLUGIN_ROOT}/lib/evidence.js` for the
resolved project; report absent/stale/unavailable checks separately from implemented
progress. Never invoke the runner from status. Later user constraints beat saved
navigation. Do not reset implemented progress because verification is stale.

## If no focused task is resolved

If STATE exists, inspect its legacy phase/feature tables and actual referenced files.
Only then use the legacy suggested-command defaults below. If STATE is absent but
scope exists, report that observed scope and its actual next work (PRD only when
scope is ready and that is the next requested stage). If neither task nor project
artifacts exist, suggest scope for a new product or learn for existing code. Name
missing navigation; do not present a known focused feature as a new project.

## Selected execution queue

If the resolved Active Task/current request explicitly identifies a covered autopilot
context definition, use `${CLAUDE_PLUGIN_ROOT}/scripts/autopilot.js inspect` (or its
read-only `lib/execution-queue.js` observation) for current checkpoint/next unfinished
step, actual verification and reconciliation gaps. Never initialize/start/record/refresh
from status-only. Interrupted running is unfinished, historical checked + stale evidence
retains both facts, and an invalid queue is diagnostic rather than a new blank queue.
Read actual decision owners from policy references; missing owner is unknown. Do not
infer execution authority from its JSON fields or automatically select an unrelated queue.

## Small process map on request

For "where are we?" or this status command, show only the useful current fragment,
derived from the resolved task/spec, Active Task Stage/Next action and actual evidence.
Example when those files really establish it:

```text
Goal established → Preview [now] → Build → Verify
Open decision: account or no account? (reference its actual owner)
Next action: show the no-login variant, then wait as requested.
```

This is GSR work progress, distinct from the product flow diagram. No separate stored
graph, dashboard, background monitor or fictional percentages. Do not print a whole
pipeline for a typo or at every reply. Without STATE, use the explicitly resolved feature
and actual preview record; name absent navigation/unknown stage instead of guessing.
A completed implementation with stale checks says "built; verification stale"; never
move it back to scope. Record open choices from the actual owner and distinguish the
requested wait from a missing authorization. Status stays read-only, with no tests/build.

Report project, actual progress, next action and any limitation concisely. Detailed tables below are available on request; no compulsory full report:

---

**Project:** [project name from STATE.md header]
**Status:** [Project Status value]
**Last Updated:** [Last Updated value]

### Phase Progress
[Reproduce the phase table from STATE.md, or "No phases defined yet." if missing]

### Current Feature Progress
[Reproduce the active feature table (the one for the current/most-recent phase), or "No features in progress." if missing]

### Next Action
[Resolved task next action by the precedence above; STATE fallback only when applicable.]

### Blockers
[List any features with status BLOCKED, or phases with status BLOCKED. If none, write "None."]

### Open Assumptions
[Inspected decision owner, count + IDs and actual statuses of relevant open decisions; unknown if unavailable. No PRD requirement for a focused feature.]

### Deferred to Backlog
[List items from the Deferred section, or "None." if empty]

### Suggested Command
[For a resolved task use its actual next step first. Only without one, derive from reconciled legacy STATE:]
- If all phases show PASS and backlog is triaged → "Project complete. Nothing to do."
- If any phase shows VERIFYING → `/gsr:verify`
- If any phase shows BUILDING or any feature is in progress → `/gsr:build`
- If phases exist but all are NOT STARTED → `/gsr:build` (pick first feature from Phase 1)
- If no phases exist but scope.md exists → `/gsr:prd`
- If no scope.md exists → `/gsr:scope`

### Active Task and Verification
[If present: objective, scope/constraints, recorded review cadence, referenced task and
next action. State current evidence status/reference and any missing/stale/unavailable
coverage separately from human acceptance. Continue existing authorized work only when
status is part of that task; a status-only request does not authorize implementation.
Read stage/checkpoint/next step/minimal Read next fields when present; report partial progress and missing references accurately. No repeated approval or automatic completion based on boxes. A status-only request does not execute the saved next step.]

### Active Sessions
Scan `docs/debug/` for files with `status: active` in frontmatter. Scan `docs/plans/` for files with `status: in_progress` in frontmatter. For each found, show one line:
- Debug: `docs/debug/<slug>.md` — feature: <feature>, last updated: <date>
- Plan: `docs/plans/<slug>.md` — <N>/<total> tasks done, last updated: <date>

If none found: "No active debug sessions or in-progress plans."

---

Keep the output tight — no extra commentary. Omit irrelevant full-project sections for a focused task. Missing navigation does not erase known task progress or decisions.
