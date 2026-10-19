# Phase 3 implementation evidence — 2026-10-15

**Local implementation delivered; public release readiness unverified.**
[Execution plan](../plans/2026-10-14-phase-3.md), [evaluation ledger](2026-10-15-phase-3-evaluation.json),
[baseline](2026-10-15-phase-3-baseline.json). V1–V5 preceded all Phase 3 implementation.
Current owner instruction also authorizes a detailed Phase 4 plan followed by execution;
this does not authorize commits, publication, new services or paid inference.

## Delivered behavior

Natural early-view requests and concrete product uncertainties route within scope/build
to an internal preview skill: flow, representative screen, narrow local interaction or
synthetic technical experiment. A clear correction skips preview. No new public command,
flag or parser stage. Engineering --sketch remains independent. Existing components and
settled foundations are reused; focused features need no full PRD/STATE.

The record connects the question, actual artifacts/opening, material assumption wording,
observations/gaps, feedback provenance and affected requirements. Decisions have one owner
in PRD/scope or focused feature Open Decisions. Useful experiment evidence adds a bounded
D-pin checkpoint, without automatic confirmation. Show-and-wait/later narrowing survive
handoff; same-ID requirement changes and missing artifacts require reconciliation. Build
records reuse/adapt/discard and replacement of mocks. Status derives a small work map
from actual task/preview/evidence; it stays read-only and preserves built + stale facts.

The shipped [booking example](../../../gsr/examples/product-preview/README.md) includes
Mermaid/text flow, one screen, time selection, inline simulated confirmation, busy-slot
error and reset. Synthetic availability/save are labeled. CLI fixture exercises actual
UTF-8 → CSV transformation with quoted fields and invalid-input behavior.

## Observed checks

- `npm run check`: exit 0, **51 tests**, **36 JS files**, JSON/links/version checks pass.
  Log `/tmp/gsr-phase3-final-check.log`. Baseline was 45 tests/32 JS on Node v26.0.0.
- New freshness coverage includes ignored preview records/artifacts; changed requirement
  wording under the same ID and missing artifact invalidate evidence. No new exclusion.
- Actual handler DOM harness covers summary, busy/error/success, obsolete result clearing,
  validation guard and focus/reset. It is not a browser or native validation/keyboard test.
- Local HTTP GET of the documented demo server: **200**. Server restricted to demo folder
  and stopped after the probe. CUA had no in-app browser and listed no browsers: layout,
  visual readability and actual keyboard observations remain **unobserved**.
- Native Claude Code **2.1.274** startup: exit 0, SessionStart/packet delivery and
  **11 commands / 11 skills**. Hidden metadata matches official
  [skills](https://code.claude.com/docs/en/skills) and
  [plugin discovery](https://code.claude.com/docs/en/plugins-reference) contracts;
  metadata/discovery do not establish model route choice.
- `npm run smoke:installed`: real local marketplace add, fresh prior-release install,
  marketplace refresh, cache upgrade and startup, all exit 0 in a disposable config.
  Custom statusline preserved; installed candidate contains ignored build skill,
  Phase 1–2 helpers/coordinate and new preview/example. Synthetic version 0.6.0-test.1
  existed only in the disposable catalog to force upgrade; repo stays 0.5.0.

## Live gaps and release preparation

P3-S1–S13 and inherited S1–S8/C1–C12 model outcomes remain **unobserved**, including
actual interactive /clear, bare dalej, requested waits, feedback propagation and narrowed
authority. No authenticated isolated model/inference trial was invoked under the local
checks scope. Current Sol implementation is not a trial of the installed product.
Each scenario retains its input, expected observable result and null model/cost/time;
fixture/parser inspection is not passing behavior. Browser gaps above also remain open.
These are correctness-validation gaps, not deferred effectiveness research.

Local implementation is sufficient to prepare the next authorized implementation phase;
Phase 4 is not used to declare these release gaps closed. A public Phase 3 candidate is
**not ready** until actual missing model/browser/installed end-to-end conditions pass.
No public release/deploy occurred and no measured benefit is claimed.

Proposed version after validation: **0.6.0**, based on additive start/coordination/preview
behavior and retained legacy contracts, not phase number alone. Observed native host scope:
Claude Code 2.1.274 on this machine; no cross-host or model parity claim. Proposed release
notes: configured evidence/freshness and hook fixes (Phase 1 + V1–V5); focused tasks,
coordination/research reuse and durable stage handoff (Phase 2); bounded previews,
feedback and progress view (Phase 3). Do not publish only the latest phase.

`node scripts/release.js minor --dry-run` exits 0 and reports 0.5.0 → 0.6.0, with no
mutation/commit/tag. It generates a header-only section because the working changes have
no commits; this is a mechanical dry-run, not a useful candidate changelog. Future commits
must cover the full selected source changes and exclude all unrelated/personal files.
The actual non-dry release requires a clean tree and creates commits/tags, so is prohibited
in this assignment. Next release action: complete live correctness observations, then obtain
separate release authorization and prepare the full conventional-commit set. No broad git add.

Effectiveness/cost/UX benchmarking remains deferred until all four phases and user access.
No telemetry, new package dependency, personal-file read/copy, reset, commit or publication.
