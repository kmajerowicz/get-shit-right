# Phase 4 implementation evidence — 2026-10-15

**All four Phase 4 mechanisms delivered locally; public release readiness unverified.**
The [execution plan](../plans/2026-10-15-phase-4.md) was recorded before implementation.
[Ledger](2026-10-15-phase-4-evaluation.json) separates observations from expected model
outcomes. [Baseline](2026-10-15-phase-4-baseline.json) retains the explicitly selected
post-Phase-3 source snapshot. V1–V5 and local Phase 3 implementation preceded this work.

## Delivered change

| Accepted point | Actual implementation |
|---|---|
| Change consequences | `change-impact.js`: inspected requirement → implementation → configured-check links, rationale/dependencies/gaps, bounded source excerpts and freshness diagnostics |
| Per-task context | `task-package.js`: inherited constraints/exclusions/authorization/cadence, current source/decision-owner fragments, dependency/check needs, bounded explicit expansion |
| Sequential execution | `execution-queue.js` and internal `scripts/autopilot.js`: one running step, durable administrative STATE checkpoints, explicit reconciliation, persistent attempt/start bounds and repeat detection |
| Before → after | `outcome-report.js`: actual referenced artifacts, historical work/current evidence separately, missing observations, decision owners and human acceptance gaps |

The hidden internal autopilot skill integrates with coordinate/build/verify/status;
no new public command or parser stage. Clear corrections stay quick and useful
previews remain optional. Current intent and actual authorization/cadence govern work;
no natural-language regex permission classifier, model call or product shell execution
exists in the helper. User performs /clear → dalej at context boundaries. No automatic
session rollover, model/effort switching, telemetry or measured savings claim.

One covered `DOC_ROOT/work/<slug>/context.json` embeds the single derived map plus
shared policy/task definitions. This consolidates the initially proposed impact/context
files to prevent two drifting copies; authoritative requirements/decisions remain in
existing specs/ledgers. Only administrative checkpoint data goes in STATE. Its existing
fingerprint exclusion preserves fresh results after progress updates; context/source
changes still invalidate them. No new exclusion was introduced.

The shared Markdown parser adds optional source ranges for safe replacement of the
Execution Queue section. Existing default parsing remains strict and all legacy tests
pass; fenced headings cannot select a different section. Cooperative queue writes are
serialized by a temp lock, use atomic replacement and detect existing external STATE
changes. A direct external edit racing after the comparison is outside the lock contract.

## Actual checks

`npm run check` **exit 0**, **68 tests**, **43 JavaScript files**; JSON/docs/version
checks pass. Log: `/tmp/gsr-phase4-final-check.log`. Phase 4 adds 17 purposeful tests,
retaining all 51 previous checks. Node v26.0.0. Coverage includes:

- Current/partial/stale maps, same-ID wording changes, missing source, unsafe/ambiguous
  refs, unknown configured check and default retaining all required checks.
- Full inherited policy/decision owner, real bounded excerpts, explicit expansion/gap
  plan, unrelated sentinel excluded, stale/missing context never silently truncated.
- Actual synthetic guest-booking code edit and runner: account guard removal accepts
  guest data in a caller-owned in-memory repository; invalid time does not add an entry.
  This is actual local behavior, not a claim of production/disk database persistence.
- Real helper process SIGTERM interruption, next-process inspection and recording of
  the retained running attempt; one running step, no counter reset. Not a model /clear.
- External mutation after checked requires reconciliation; current map refresh is covered
  and stales prior checks. The administrative checkpoint save preserves current checks.
- New run IDs do not hide repeated unchanged source/result signatures. Same approach
  blocks after the second identical unproductive outcome; alternate strategy still obeys
  persistent step/attempt bounds. Actual costs remain null/unknown.
- Latest actual failed/unavailable evidence and masked caller exit cannot yield checked.
  An older green remains history. Corrupt/forged checked state is diagnostic.
- Explicit review-only rejects execution writes; per-task review pauses gate advancement.
  Refresh cannot silently remove policy limits/constraints/cadence; an actual new user
  change source is retained in covered context. Model must never fabricate that source.
- Read-only inspect/report preserve files; real before/after CLI output artifacts are
  shown, absent observations remain unobserved, acceptance separate. Live/dead lock
  handling and fenced-heading section preservation are tested.

Native Claude Code **2.1.274**:
`npm run smoke:host` exit 0, SessionStart/packet delivery, **11 commands / 12 skills**,
modelInvoked false. `npm run smoke:installed` exit 0: real local marketplace add,
prior 0.5.0 install, update/cache upgrade and startup in isolated temp configuration.
Custom statusline/settings preserved; installed package includes Phases 1–4.
An actual installed-copy helper scenario performs prepare/start, synthetic code edit,
installed runner checks, record, inspected map refresh, fresh checks, reconciliation
and current checked/passing report. Logs `/tmp/gsr-phase4-host.log` and
`/tmp/gsr-phase4-installed-final.log`. Synthetic version 0.6.0-test.1 existed only in
that disposable catalog; repository remains 0.5.0. No user plugin/settings changed.

The final source snapshot/runner locator, if retained below, applies only to its
explicitly selected input snapshot, not the workspace containing unrelated material.
Direct workspace `npm run check` observations above remain distinct from machine records.

## Remaining correctness observations and practical limits

**P4-S1–S16 model outcomes remain unobserved**, as do inherited Phase 1/2/3 model
conditions. The test fixtures define targets, not model successes. Implementing Sol
is not a trial of the product. No isolated authenticated model/inference session was
invoked under the local checks scope; model route choice, semantic dependency adequacy,
research reuse, natural-language narrowing and actual /clear→dalej waits remain to observe.
Phase 3 browser readability/keyboard checks also remain unavailable through enabled CUA
browsers. These are correctness gaps, not postponed benefit/UX research.

Helper validation is structural and source-bound, not tamper-proof proof that an operator
or model told the truth about an instruction/observation. Full-project evidence freshness
has the existing remote/environment/edit-and-revert limitations. Only explicit mapped
sources are read for context; correct semantic inspection must expand incomplete mappings.
A gapPlan permits independent preparation/work, not execution of an unresolved integration.

One active queue per project is supported. Initialize refuses replacing its checkpoint
and refresh preserves task identity/order and counters. Before a different task, preserve/
archive the previous queue explicitly; there is no silent destructive replacement command.
This is a conservative first implementation, not unattended long-lived session management.
After authorized source edits, map/context refresh is covered and can require another
current check before explicit reconciliation. No efficiency claim is derived from this
implementation. Credits/costs without host measurements remain unknown, not hard limits.

## Completion and release status

The authorized local code/docs/test scope of V1–V5 and Phases 3–4 is delivered. Existing
Phase 1–2 changes were preserved. **No commit, root staging, reset, tag, push, publication
or user deployment occurred.** Personal/unrelated files were not read/copied. Helpers
and source snapshots were tested only on explicit/synthetic inputs; no whole-workspace
fingerprint was run. No dependencies, paid services, new models/agents or telemetry added.

Public readiness remains **unverified**, because the concrete live/browser conditions
above have no observations. Phase 4 does not erase the Phase 3 release milestone or its
gaps. Keep repository versions unchanged until separately authorized release work. The
previous Phase 3 0.6.0 proposal/dry-run is historical preparation, not a published or
final version decision for the combined candidate. No new dry-run was needed here.

Next correctness step: observe the installed product's natural request → impact →
context → sequential execution → actual interactive context reset/resume → verification
→ before/after report, including narrowed authority/no-progress cases, with real
host/model/tool identifiers. Keep unavailable observations explicit; do not automatically
buy/install tools or infer authorization for paid model trials from this report.

**Effectiveness/cost/time/UX benefit studies remain deferred until Phases 1–4 are complete
and the tool is available to users.** Correctness tests here do not establish savings.

## Retained machine evidence

[Runner locator](2026-10-15-phase-4-run-reference.json) points to the actual record for a
safe final snapshot assembled from 170 explicit source/doc files, including ignored build
and all untracked Phase 1–4 helpers, plus its reviewed .gsr.json. No workspace .git or
personal files copied. Runner `repository-correctness` executes `npm run check`, **exit 0**,
status passing, with equal before/after fingerprints (171 inputs). The first retained
record failed because the assembly omitted referenced `docs/internal/releasing.md`;
that exact authorized file was added and the runner rerun successfully. Both records
are retained; this fixture failure is not hidden or called a product regression.

The temp snapshot alone was indexed for tracked-input coverage, with no commit. No
staging/commit occurred in the user repository. This record applies to that snapshot
before the final locator/navigation documentation updates, checked separately by
JSON/docs/diff checks. It is not a reusable fingerprint of this whole workspace.
