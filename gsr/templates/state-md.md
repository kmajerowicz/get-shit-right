# STATE.md — [Project Name]

**Project Status:** IN PROGRESS
**Last Updated:** [date]
**Open Assumptions:** 0
**Weight:** standard
**Next Action:** Run `/gsr:build` → pick a feature from Phase 1

---

## Phase Progress

| # | Phase | Type | Status | Verification |
|---|-------|------|--------|-------------|
| 1 | [Phase name] | creative/systematic | NOT STARTED | — |
| 2 | [Phase name] | creative/systematic | NOT STARTED | — |

_Phase statuses: NOT STARTED → BUILDING → VERIFYING → PASS / BLOCKED_
_Project status: IN PROGRESS → BACKLOG TRIAGE → DONE_

---

## Feature Progress (Phase 1: [Phase Name])

| Feature | Status | Mode | Last Updated |
|---------|--------|------|-------------|
| [feature] | not started | — | — |

_Feature statuses: not started → in progress → done_

---

## Pin Coverage

_Updated automatically by `/gsr:verify` on each PASS. One row per pin across all verified features._

| Pin | Feature | Status | Last Verified |
|-----|---------|--------|--------------|
| `slug.T1` | [feature] | pending / done / accepted | — |

_Pin statuses: `pending` → `done` (command/test evidence) → `accepted` (human sign-off)._

---

## Recent Decisions

[date] — [What was decided] — see [feature file or PRD]

---

## Deferred (→ BACKLOG.md)

[Items captured during build that were explicitly deferred]


---

## Active Task

_Optional continuation summary, added during authorized work. Existing STATE files
without this section remain valid. Preserve unrelated sections; this is not evidence
or permission to override a later instruction._

**Objective:** [current bounded task]
**Constraints:** [requirements and exclusions; requirements themselves live in the referenced spec]
**Authorized scope:** [reversible work authorized by the user; separate publish/spend/install boundaries]
**Authorization:** [source and date of the user's instruction, in ordinary prose]
**Review cadence:** [explicit per-chunk boundaries if requested; otherwise continue authorized work]
**Plan/task:** `plans/<current-plan>.md`

_Plan/task paths are relative to DOC_ROOT, or name the current task/spec reference._
**Last verified run:** [navigation reference to actual runner record; not a passing assertion]
**Next action:** [next concrete task, including any genuinely unresolved decision]

_On resume read the referenced task/plan, inspect actual repository state and observe
freshness before reusing a result. Missing/conflicting references require reconciliation,
not automatic reset or repeated authorization. Stale evidence does not erase implemented
progress. Human acceptance remains separate from machine check results._


_Optional stage packet fields, filled only at a real major-stage/checkpoint handoff;
legacy STATE without them remains valid. See plugin `docs/patterns/stage-handoff.md`._

**Context handoff:** [pointer/start summary for fresh context, not a transcript]
**Stage:** [stage just completed or current partial increment]
**Checkpoint:** [completed / checked-increment / partial]
**Next step:** [scope / prd / build / verify / debug / learn / quick / status / none]
**Completed work:** [actual result; do not claim unobserved behavior]
**Remaining work:** [remaining bounded tasks, or none with actual completion evidence]
**Open questions:** [actual pending decisions/deferrals or none]
**Read next:** `features/<slug>.md#Task Context`, `@project/src/<actual-file>`
**Guidance next:** [current host-catalog skill names; availability must be reconciled]
