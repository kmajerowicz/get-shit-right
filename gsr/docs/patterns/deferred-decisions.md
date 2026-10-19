# Deferred Decisions Pattern (D-pins)

A product question the user can't answer yet is NOT a gate. It becomes a tracked
assumption that returns for confirmation when the user has evidence (usually: a
working prototype). Deferred ≠ delegated — the human still makes the call, later.

## When a user defers

Triggers: the deferral option in a decision gate, or any free-text equivalent
("nie wiem", "not sure yet", "you pick for now", "whatever's standard").

Protocol — all 5 steps, then continue WITHOUT waiting:
1. Propose a sensible default with a one-line rationale.
2. Assign the next `<project>.D<n>` (project slug from PRD/scope; append-only,
   never renumber; check existing project ledgers/feature decisions for the highest
   existing n to avoid collisions, including without a PRD).
3. Set severity — `non-blocking` by default. Set `blocking` ONLY if a wrong
   default would force rework of already-built features (say so in one line).
   The user can override severity with one word.
4. Append a row to the Assumptions Ledger (see below). Scope stage: ledger lives
   in scope.md; a focused feature without scope/PRD uses its `Open Decisions` section.
   When PRD owns these decisions, keep its ledger as the single owner. On migration,
   preserve IDs/history and leave a pointer at the old location; do not maintain two
   editable copies. Preview records link this owner, never replace it.
5. Say: "Recorded as `<id>` — I'll bring it back when you can see it working."

## The ledger

| ID | Assumption (default taken) | Source question | Severity | Status | Date |
|----|---------------------------|-----------------|----------|--------|------|

Status: `assumed` → `confirmed` | `revised`. On revision, keep the row, update
Status, and append "→ revised: <new value> (<date>)" inside the Assumption cell.
Rows are never deleted. Preserve the feedback/source/date and previous value in the
owner's decision history; update only affected requirements and describe consequences
for preview/implementation. Visual approval confirms only the shown scope, not backend
behavior, deployment or every decision. A genuinely ambiguous change needs one focused
clarification; independent authorized work continues.

## Revisit checkpoints (the only places assumptions come back)

1. **After a feature build completes** (build skill Step 4): list open
   assumptions whose area the built feature touches. List open assumptions without a routine approval pause; ask confirm / revise / keep deferred only when new evidence makes a consequential choice actionable or review is explicitly requested. Max 3 at a checkpoint; never re-ask recently deferred choices. Machine checks never confirm assumptions.
2. **`/gsr:verify`**: `blocking` + `assumed` = Blocker. Non-blocking open
   assumptions are listed in the report, never block.
3. **`/gsr:status`**: reads open decisions from the actual owner, including a focused
   feature without PRD/STATE; missing ledger means unknown, not none.
4. **Useful preview/experiment evidence before full build**: revisit only touched,
   consequential choices that this new evidence makes actionable. Artifact generation
   alone triggers no question/status change. Max 3; retain keep-deferred and do not
   repeat a recent deferral without new information. A machine test never sets confirmed.
   Follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md`.

## Red flags

| Thought | Reality |
|---------|---------|
| "The user must answer before we proceed" | They can defer. Record a D-pin, move on. |
| "I'll just assume it and not bother them" | Unrecorded assumption = silent product decision. Record it. |
| "I'll re-ask at the next opportunity" | Only at revisit checkpoints. Nagging kills deferral. |
