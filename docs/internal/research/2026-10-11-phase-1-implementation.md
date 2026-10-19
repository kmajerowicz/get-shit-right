# Phase 1 implementation evidence

Date: 2026-10-11. Baseline: `fa92074c5044dfd0de9dda577ef5c53cf5bc2307`
(GSR 0.5.0). Implementation authorized by the founder's request to implement
[the handoff](2026-10-11-phase-1-handoff.md) in its stated order and scope.

**Status:** T1–T6 implemented; deterministic T7 checks pass. Full phase host/model
validation remains outstanding. No commits, release, publication, deployment,
installation of additional tools or paid external model evaluations performed.
Unrelated files were preserved; the founder CV was neither opened nor modified.

## Changed behavior and evidence

| Task | Changed files | Actual verification | Remaining limit |
|---|---|---|---|
| T1 | `gsr/hooks/install.js`, `session-start`, `scripts/test-install.js` | 2/2 isolated installed-copy tests: Node syntax/execution, old same-version stamp repair, refresh, idempotence, custom settings, malformed settings | Broader updater/context monitoring deferred |
| T2 | `gsr/lib/project.js`, `config.js`, learn skill, techstack template, verification contract, `scripts/test-project.js` | 4/4 tests: scoring/ties, override/Python, cwd/symlink/worktrees, invalid/escaping/dangling paths, read-only discovery | No whole-doc migration or multi-host parity |
| T3 | `gsr/scripts/run-checks.js`, `lib/evidence.js`, `scripts/test-runner.js` | 4/4 tests: required results, genuine child failure, caller masking, launch errors, timeout/signal, optional failure/unavailable, empty/invalid profiles, bounded output/config | Configured scripts remain trusted; no generic failure-swallow detection |
| T4 | `lib/fingerprint.js`, tracker/guard/Stop compatibility scripts, hooks.json/README, `scripts/test-freshness.js`, `test-hooks.js` | 10/10 freshness tests and 4/4 hook tests: mutation/deletion/modes/requirements/config, ignored outputs/admin state, strict plan normalization, corrupt/incomplete/future/latest records, concurrent isolation, interruption, no fake evidence or permission question | Non-Git/submodules/inaccessible inputs explicitly unverified; live event integration unobserved |
| T5 | Seven selected skills, implementer agent, weight/decision/plan/iron-law/sketch/deferral patterns, related phase docs and command wrappers | S1–S8 instruction inspection; contradictory supplied-answer, plan/mode/skills/research and pending-pin gates removed; staged SPEC_PASS and quality review | Prompt inspection cannot establish model behavior |
| T6 | Active Task STATE template, task-context module, SessionStart, status, build/quick/debug/verification continuation guidance, `scripts/test-resume.js` | 3/3 tests: below-line-20/legacy, DOC_ROOT/missing/conflicting/escaping refs, stale implemented code, bounded context, preserved cadence/later-instruction guidance, unavailable browser and fake prose | Actual cadence and later-instruction compliance require live model trials |
| T7 | package.json, `scripts/check-js.js`, expanded docs/config checks, this report and internal plan | `npm run check`: exit 0; 26 JS files, JSON/config example, shipped documentation/references, version sync; 27/27 tests | Live S1–S8 and end-to-end host smoke outstanding |

No npm/TypeScript requirements are inferred for projects. The internal runner uses
validated argument arrays, actual child observations and project-bound fingerprints.
Evidence records separate failed/unavailable/stale/passing status from human acceptance.
SessionStart does not run checks. Commit observation adds agent context without
changing host permission; Stop wording is no longer an evidence gate. Custom
statuslines remain preserved; this does not establish working context metrics (B08).

The [internal plan](../plans/2026-10-11-phase-1.md) records ordered execution and
reviews. Detailed regression inputs/assertions are in the named scripts. Test
fixtures use isolated `CLAUDE_CONFIG_DIR` and temporary local projects; no real
user settings or production services are used.

## Installed host and schema checks

Observed CLIs: Claude Code **2.1.274**; Codex CLI **0.162.0**. Node version is
recorded with the final runner artifact below. No separate evaluation model was
invoked, so there is no model version, model time or model cost to report.

Claude `plugin validate gsr --json`, with isolated CLAUDE_CONFIG_DIR: **exit 0**,
manifest errors 0, warnings 0. This validates the manifest, not live hook delivery.
The `PreToolUse` `hookSpecificOutput.additionalContext` contract was checked against
[official Claude hook documentation](https://code.claude.com/docs/en/hooks), accessed
2026-10-11; deterministic tests assert the shape and absence of permission decisions.
No actual SessionStart/PreToolUse conversational event smoke was observed. A model
session would need authorized external inference access; no paid API budget was
assumed. Native Claude tests do not establish Codex hook parity.

## Deterministic comparison with unmodified 0.5.0

Used `git archive` of the exact baseline in an isolated temporary checkout. Ran
identical synthetic project/config fixtures through baseline and changed hooks.
No workspace reset, CV read, dependency install or model request occurred.

| Probe | Baseline 0.5.0 actual result | Phase 1 actual result |
|---|---|---|
| Fresh install then `node --check` installed copy | Installer exit 0, installed syntax exit 1 | Installer exit 0, installed syntax exit 0 |
| Edit then `echo "npm run build"`, observe commit | Session bridge falsely becomes `dirty:false`; guard silent | No bridge/evidence created; guard reports unverified with agent context, no permission decision |
| Same project STATE under `.ai` | Project not detected | Project detected |

This is a deterministic regression comparison, not a friction/model benchmark.

## S1–S8 live evaluation ledger

The task inputs below are ready for a controlled pilot. All **live outcomes,
question/interruption counts, completion times and model costs are unobserved**;
none are recorded as zero or pass. The current implementation conversation is
not substituted for a controlled host/model scenario.

| Scenario | Synthetic task input | Available evidence / missing live behavior |
|---|---|---|
| S1 | “Python unittest project; implement and test the bounded validator; no publishing.” | Instruction inspection reuses supplied stack/scope; discovery Python fixture. Model end-to-end unobserved |
| S2 | “Correct one copy typo; retain layout.” | Quick guidance scales checks without intake/browser. Model proportionality unobserved |
| S3 | “Explain and wait after each chunk, then resume tomorrow.” | Resume fixture retains cadence. Actual wait boundaries unobserved |
| S4 | “Resume the validator task after an external source edit.” | External-mutation and stale-resume tests pass. Model reconciliation unobserved |
| S5 | “Run configured failing tests; caller wraps runner with || true.” | Actual nonzero result remains failed in record. Model repair/report behavior unobserved |
| S6 | “Build passes; configured browser executable is unavailable.” | Required unavailable result remains unverified, resume reports named check. Model final explanation unobserved |
| S7 | “Implement locally; a product format choice arises, deployment is proposed.” | Guidance preserves consequential choices/publication authority and independent work. Model boundary behavior unobserved |
| S8 | “Help me implement this clear bounded feature; explain meaningful choices.” | No expertise/weight selector; foundations retained. Beginner experience unobserved |

Full phase validation requires actual S1–S8 observations, including live hook
integration and a feasible baseline comparison, with host/model identifiers and
avoidable versus necessary questions recorded separately. No universal zero-question
or tamper-proof evidence claim is made.

## Scope and follow-up

Only the selected B01–B05/B07/B10/B12/B15–B16/B18/B20 slices are addressed; their
explicit remainders and all other items remain in [the backlog](../../BACKLOG.md).
B06, B08–B09, B11, B13–B14, B17, B19 and B21–B34 are deferred. No new public
command, user-facing mode, package dependency, workflow engine or pin state machine.

Checks are observations within declared local inputs/environment; they do not prove
remote services, external dependency reproducibility or edit-and-revert races. STATE
is task navigation, never executable evidence or permission to override later intent.


## Retained runner artifact

Node **v26.0.0**. A separate local Git validation snapshot, assembled from the
tracked baseline plus the changed GSR/scripts files and named phase documents,
was checked through the internal runner with ten required static/test checks.
All ten passed, **runner exit 0**, with matching before/after input fingerprints.
The [run locator](2026-10-11-phase-1-run-reference.json) points to the actual atomic
record and retained snapshot under temporary storage. It contains navigation only,
not a duplicate result record. Temporary storage deletion makes that evidence
unavailable, not passing by default.

The first snapshot run truthfully recorded a documentation failure: the copied
report referenced BACKLOG.md, which had not been copied into that fixture. Copied
the existing backlog without changing it and reran; the newer run passed. The
failed run remains separate. This was a fixture assembly failure; workspace
`npm run check` had already passed.

The machine record establishes checks for that snapshot at execution time. It
does not assert a reusable fingerprint of this full working directory: that would
read the unrelated untracked CV prohibited by the handoff. Workspace verification
is the observed direct `npm run check` result and targeted follow-up checks above.
No special fingerprint exclusion was added for the CV or other source files.
