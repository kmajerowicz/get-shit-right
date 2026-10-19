# Sequential execution within the user's boundaries

Use the internal autopilot skill for a substantial existing-product change or a bounded
sequence of corrections. The host model performs work with its available tools; helpers
prepare/inspect context and checkpoint bookkeeping. No new public command, model API,
shell-string executor, dashboard, background retry hook or automatic session lifecycle.
Quick corrections stay quick. Preview is optional only for a useful question/request.

## Prepare once from the current task

Inspect the actual change impact per `${CLAUDE_PLUGIN_ROOT}/docs/patterns/change-impact.md`.
Record supplied scope, exclusions, decision owners, authorization source/date and requested
review cadence. Technical task sequencing is routine authorized work; unresolved product
choices remain visible/deferred. Missing information expands inspection; no reduced PASS.

Internal source template: `${CLAUDE_PLUGIN_ROOT}/templates/task-package-json.md`.
Persist a single covered definition at `DOC_ROOT/work/<slug>/context.json`, embedding
its derived map and tasks/shared policy. No requirement/authority lives only in STATE.
Task IDs are unique; dependencies precede each task; execute one step at a time.
Explicit attempt/step budgets win. If none were supplied, an internal conservative cap
of 3 attempts per task and 3 × task count starts can be recorded as execution bounds;
these are not credit/spend limits or new product requirements. Preserve an existing
lower bound and stop before its exhaustion. Cost/credits unavailable from the host are
unknown; never infer a hard spend limit from tokens or a subscription credit estimate.

## Internal helper operations

```text
node ${CLAUDE_PLUGIN_ROOT}/scripts/autopilot.js <action> --cwd <project> --file work/<slug>/context.json --input -
```

Feed the request JSON through stdin so transient attempt IDs/directives do not create
new source files after a passing run. `--input <DOC_ROOT-relative-file>` is also supported,
but that file is a normal covered input: edit it before checks. Helpers never execute
JSON/Markdown commands. Exit 0 means the helper operation succeeded, not passing behavior;
read status/verification and the actual runner record. Diagnostic/reconciliation/blocked
observations exit 2. Do not run a whole-workspace fingerprint where unrelated personal
inputs are outside authorization; use an appropriately isolated source/test project.

- `prepare`: request has id, impact definition, tasks, policy and current directive.
  Validates and creates covered context; refuses overwrite. It starts no work/checkpoint.
- `initialize`: creates the administrative checkpoint in STATE; refuses existing queue
  to avoid erasing attempts/history. Preserve/archive an old completed queue explicitly
  before a different assignment; no destructive replacement shortcut in this version.
- `inspect`: read-only map/checkpoint/current evidence observation; no product edits/tests.
- `start`: current directive plus approach; emits the next bounded package and attemptId.
  One running step at a time; counters increment before work. Review/wait directives
  reject writes; requested per-task review requires actual review before continuing
  (current.reviewedThrough identifies the reviewed step, never fabricate it).
- `record`: current directive + exact attemptId. Reads actual latest default runner
  evidence; never takes a passing flag from caller prose or shell exit. Records checked
  only with current passing evidence. Failed/unavailable/stale results remain explicit.
- `refresh`: explicit semantically inspected impact/tasks/policy plus current directive
  and reason. Keeps queue/task identity/order and counters. Record the running attempt
  first; refresh is not a way to erase it. Writes covered sources, so run current checks
  after this update. Map/hash refresh alone does not prove requirements still hold.
  Removing retained constraints/exclusions, widening budgets or changing cadence/authority
  requires an actual latest user policyChangeSource; retain the prior policy digest/change
  source in covered context. This is not a routine new approval or permission inferred
  from a JSON field. Never fabricate a new user instruction to weaken a boundary.
- `reconcile`: current directive + reason + reviewedTasks containing every historically
  checked step inspected against current requirements. Requires current map and, when
  retaining checked steps, full default passing evidence. Does not reset counters,
  manufacture completion or release a requested review pause.
- `report`: read-only current evidence, retained work, actual before/after artifact refs,
  decisions and gaps. Use `${CLAUDE_PLUGIN_ROOT}/templates/outcome-report-md.md`.

A current directive has operation `implement`, `review` or `wait` and a real instruction
source. This is the model's explicit reconciliation with current intent, not a natural-
language classifier or new permission. Never invent implement/review-release values to
get past a boundary. Later narrowing wins and must also update the authoritative task
context before later resumed execution. Independent read-only inspection may continue.

## Durable checkpoints, interruption and no progress

Only administrative task statuses/counters, fingerprints and actual run refs are stored
in STATE's `Execution Queue` section. Preserve all unrelated sections and Active Task.
Missing queue is absent; malformed/duplicated queue is diagnostic. Atomic replacement,
a single-writer temp lock and stale-dead-owner recovery serialize cooperating helper operations. Optimistic STATE checks detect existing external
edits; a direct external edit racing after the comparison is outside this lock contract.
The same Markdown parser validates headings/ranges; fenced headings cannot select the
wrong section. No new fingerprint exclusion is needed for queue progress.

Interrupted `running` remains running until inspected and recorded, never silently checked
or retried with reset counters. A new process can read/record it. External changes or
changed task definitions require reconciliation; historical checked work remains visible,
separately from stale/failed checks. A normal authorized edit also invalidates old maps:
record actual result, inspect/reprepare mapping, check the updated covered definition,
then explicitly reconcile before the next step. This conservative order can require a
fresh check after context refresh; do not hide the definition from freshness to save a run.

A repeat signature uses actual current source identities and observed check statuses,
exit/signal/timeout/launch results and bounded output identities. New runId/timestamp or
rewritten summary is not new progress. The second identical unproductive result blocks
the same approach. Change approach within scope or report the concrete obstacle; all
attempt/start budgets survive resets and strategy changes. Do not loop until green.

## Resume and outcome

At a major boundary save ordinary Active Task with original scope/cadence, the covered
context ref, actual completed/remaining work, current evidence limits and next action.
At most six initial Read next refs. Keep Next step in the existing enum; Stage names the
queue step. User performs /clear and sends dalej; SessionStart only delivers navigation,
never initializes/starts a queue. Resume inspects real files/decisions/evidence first.
No claim of autonomous fresh-session rollover, model switching or measured savings.

Report the user's before → after behavior from actual artifacts/observations. Missing
before/after remains unobserved; desired behavior is not observed behavior. UI screenshots
and successful build cannot prove real storage. Separate implementation, evidence currency,
behavioral coverage and human acceptance. Open decisions stay at their single owner.
Detailed logs remain accessible via actual refs. Possible Phase 5 autonomy/model routing
is a future direction, not a requirement or promise of this implementation.
