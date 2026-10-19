# Release code review — 2026-10-19

Reviewed the five-part 0.6.0 candidate, initially `19e1809144fcd5abd4121c7dbd154e622b4bcea4`.
This is maintainer self-review with source inspection and targeted reproductions, not independent model review.

## Findings and corrections

| Priority | Trigger and impact | Correction and evidence |
|---|---|---|
| P1 | Autopilot `refresh` retained global policy but could silently remove task constraints or decision/context source references. A refreshed package could lose a prior boundary without a new owner instruction. | `a9c9166` retains all three categories unless an explicit latest-user `policyChangeSource` is provided. History includes the previous definition digest. The new regression failed before the fix (`prepared-context` instead of diagnostic), then passed for constraint/decision/context removal, unchanged file bytes on denial and an explicit authorized replacement. |
| P2 | Booking demo used a button with `id="reset"` inside its form. Browsers expose that control as `form.reset`, masking the native function. Activating “Wybierz inny termin” failed and did not restore focus/state. The old DOM harness did not model named controls. | `a3b7727` renames the control to `reset-booking`; the harness models the actual control ID as a form property. The regression reproduced `TypeError: form.reset is not a function` before the fix. After the fix, both harness and real Chrome keyboard reset passed. |

The corrections are carried by PR #18 so the functional PR boundaries and pushed history remain intact. The intermediate integration branch is not a public rollout; do not merge it into main without the final preparation fixes.

## Review coverage and observations

- Phase 1: project/path discovery, shell-free check configuration, source freshness, evidence completeness/latest-run precedence, child-process verification and installed-hook preservation. Existing V1/V2/V4 regressions remain covered.
- Phase 2: bounded references, ambiguity diagnostics, task packets, continuation boundaries and focused-feature status. Existing V3/V5 regressions remain covered. Inspected coordination and current-operation guidance; source inspection does not prove natural-language routing.
- Phase 3: preview handlers, actual UTF-8/CSV transformation, simulation labeling, browser feedback/focus/reset and scoped workflow guidance.
- Phase 4: source snapshots, inherited task policy, retry/checkpoint history, actual-vs-stale evidence and outcome reporting. Queue/helper records are not semantic acceptance or authorization.
- Release preparation: all version sources including lockfile roots, dry-run/no-write behavior, metadata-only staging, unchanged dependency resolutions/integrity, public baseline tag and exact-version installation.
- After both fixes: `npm run check` passed on Node 26, **71 tests**; exact 0.6.0 fresh install/upgrade from `v0.5.0` passed, including settings preservation and the installed helper scenario.

## Actual browser observation

Native Chrome controlled through CUA opened the shipped local file. Observed desktop (~1200 px window) and Responsive 375 px, with an additional 400 px inspection. The form, text and summary remained readable in the inspected views. Tab/arrow navigation selected 10:30; Enter showed the explicitly simulated confirmation. Tab/Enter reset removed the result, cleared selection and returned navigation to the first radio. Arrow navigation then selected 16:30; Enter showed the busy error. The focused result was visibly outlined. After reload/fix and those interactions, Chrome Console showed **0 messages**. This is bounded path inspection, not a full accessibility audit or a backend/storage test. Screenshots and accessibility observations are retained in the task conversation.

## Model limitation and rollout boundary

One isolated typo trial attempted Claude subscription inference, but returned `Failed to authenticate: OAuth session expired and could not be refreshed`, no model usage and no edit. The user then stated that no Claude account is currently available. The official login attempt was cancelled; no subscription was purchased and no API fallback was used. All inherited host/model scenario outcomes remain unobserved. Browser/installed-helper/source checks do not replace them.

Integration merges are authorized. Public rollout still requires either the original model observations or an explicit owner revision of that release requirement after reviewing this limitation. Do not claim model correctness or erase the unobserved ledgers.
