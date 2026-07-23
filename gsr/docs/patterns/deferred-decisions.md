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
   never renumber; check the ledger for the highest existing n).
3. Set severity — `non-blocking` by default. Set `blocking` ONLY if a wrong
   default would force rework of already-built features (say so in one line).
   The user can override severity with one word.
4. Append a row to the Assumptions Ledger (see below). Scope stage: ledger lives
   in scope.md. Once PRD.md exists, the ledger lives ONLY in PRD.md.
5. Say: "Recorded as `<id>` — I'll bring it back when you can see it working."

## The ledger

| ID | Assumption (default taken) | Source question | Severity | Status | Date |
|----|---------------------------|-----------------|----------|--------|------|

Status: `assumed` → `confirmed` | `revised`. On revision, keep the row, update
Status, and append "→ revised: <new value> (<date>)" inside the Assumption cell.
Rows are never deleted.

## Revisit checkpoints (the only places assumptions come back)

1. **After a feature build completes** (build skill Step 4): list open
   assumptions whose area the built feature touches; one AskUserQuestion —
   confirm / revise / keep deferred. Max 3 assumptions per checkpoint; oldest
   first; never re-ask one the user just kept deferred.
2. **`/gsr:verify`**: `blocking` + `assumed` = Blocker. Non-blocking open
   assumptions are listed in the report, never block.
3. **`/gsr:status`**: shows the open-assumption count.

## Red flags

| Thought | Reality |
|---------|---------|
| "The user must answer before we proceed" | They can defer. Record a D-pin, move on. |
| "I'll just assume it and not bother them" | Unrecorded assumption = silent product decision. Record it. |
| "I'll re-ask at the next opportunity" | Only at revisit checkpoints. Nagging kills deferral. |
