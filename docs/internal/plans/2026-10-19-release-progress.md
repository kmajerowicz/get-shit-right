# GSR 0.6.0 release preparation — 2026-10-19

The owner authorized release work after accepting four functional PRs and one release-preparation PR. Public rollout has not happened.

## Review sequence

| Part | PR | Included scope |
|---|---|---|
| 1 | [#14](https://github.com/kmajerowicz/get-shit-right/pull/14) | Phase 1 runtime foundations; V1, V2, V4 |
| 2 | [#15](https://github.com/kmajerowicz/get-shit-right/pull/15) | Phase 2; V3, V5; shared Phase 1/2 workflow guidance |
| 3 | [#16](https://github.com/kmajerowicz/get-shit-right/pull/16) | Phase 3 |
| 4 | [#17](https://github.com/kmajerowicz/get-shit-right/pull/17) | Phase 4 |
| 5 | Release preparation | Lockfile/version regression, exact-version install, notes and candidate metadata |

PRs are temporarily stacked on their predecessor branches to show bounded diffs. Merge in order, retargeting each next PR to `release/0.6.0` after its predecessor merges. Preserve commits, especially after tagging. Only the final integration PR targets `main`.

The runtime parser/context foundation belongs to PR 1 because SessionStart requires it. Shared collaboration instructions belong to PR 2 to keep one consistent workflow. V5's reference correction is introduced in PR 2. The complete plugin/scripts/docs source was compared byte-for-byte with the selected development sources before release-tooling changes; historical Phase 3/4 snapshots matched their recorded hashes. No personal file, user configuration or workspace Git directory was copied.

## Observations

- Functional PR checks passed locally on Node 26: 32, 45, 51 and 68 tests respectively.
- GitHub CI passed for PRs #14–#17 on Ubuntu/Node 22.
- Native startup observed Claude Code 2.1.274, 11 commands and 12 skills.
- Corrected isolated install smoke passed from public `v0.5.0` to disposable `0.6.0-test.1`; fresh install, upgrade, settings preservation and actual installed helper scenario were observed. This synthetic version does not certify exact 0.6.0.
- Release regression passed: dry-run leaves files and tags unchanged; real fixture release synchronizes manifests/lockfile/changelog, preserves dependency metadata and tags the checked commit. Either lockfile-root mismatch fails version checks.

- Candidate `0.6.0` passed all 70 local tests on Node 26. Exact-version fresh install and upgrade from public `v0.5.0` passed with preserved settings, 11 commands, 12 skills and the installed-helper scenario. These observations use the local catalog, not a published release.
- CI now installs existing locked development dependencies with `npm ci --ignore-scripts`, because release regression invokes the real git-cliff binary offline. No dependency resolution was changed.

## Current review and validation update

The owner explicitly authorized CR and ordered merges after successful checks. See the [code review report](../research/2026-10-19-release-code-review.md) for two reproduced findings, their corrections and actual Chrome observations. All 71 local tests and exact-version installation checks passed after the corrections. PRs #14 and #15 have merged into `release/0.6.0`; later integration and CI are in progress. Fixes for Phases 3/4 are included in PR #18, which must accompany those phases before any main rollout.

## Outstanding before rollout

- Model scenarios S1–S8, C1–C12, P3-S1–S13 and P4-S1–S16 remain unobserved. An actual Claude trial failed on expired OAuth; the owner then stated no Claude account is currently available. Login was cancelled; no purchase or API fallback.
- Browser inspection is now observed: actual Chrome desktop, 375 px and 400 px, keyboard selection/submit/reset and busy feedback; console empty after the fix. This supersedes the earlier permission-denied observation, not the model ledger.
- Current integration checks and final preparation CI must pass after the review fixes.
- Public main rollout, tag/Release and public install/update checks remain pending. Before rollout, obtain original model observations or an explicit owner revision of that release requirement.

The 0.6.0 metadata can be prepared on the isolated candidate without publishing or tagging it. After resolving live checks and reviewing the final candidate, tag that existing checked commit; do not run a second bump. Keep release notes' candidate status until actual rollout.

Follow the [deployment plan](2026-10-15-phase-1-4-deployment.md) for remaining D2–D8 requirements. Effectiveness studies remain deferred until availability to users.
