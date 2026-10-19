---
name: gsr-gate
description: Run configured project checks and report actual evidence, freshness and behavioral limitations before completion claims.
---

# GSR Gate Function

Configured checks establish observations, not human acceptance or deployment. Explicit authorization covers routine verification; host permissions still apply.

## Discover and configure

Discover the canonical worktree and DOC_ROOT with `${CLAUDE_PLUGIN_ROOT}/lib/project.js`. Read validated project-root `.gsr.json` (schemaVersion 1) for checks and profiles. Never infer initialization from a CLAUDE.md mention. If only a legacy `## Gate` exists in DOC_ROOT/techstack.md, translate known commands against actual project scripts/configuration into `.gsr.json` during authorized work, preserving the prose and summarizing the change. Reconcile conflicts; missing or invalid configuration remains unverified. Do not invent npm, TypeScript or lint defaults.

Checks use nonempty `argv` arrays, project-relative `cwd`, `required`, `timeoutMs` and `kind` (`static`, `test`, `runtime`). Execution uses no shell. Split pipelines/operators into independent checks or a reviewed script that propagates failures. Do not install missing tools merely to make a check pass.

## Run and read evidence

GSR invokes the internal runner (not a new user command):

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/run-checks.js" --cwd "<canonical-project-root>"
# Add --profile <configured-name> only when its documented applicability covers this change.
```

Default selects all required checks. A docs-only profile is valid only with bounded documented applicability; uncertainty uses default. Never create a reduced profile to obtain a pass. Scale checks to changed behavior; an unrelated documentation edit does not universally require application/browser reruns. Reuse a prior run only after evidence freshness matches current project/configuration/requirements. Read `${CLAUDE_PLUGIN_ROOT}/lib/evidence.js` for project-bound run records; latest relevant started run wins, including failure/interruption. Missing, corrupt, unsupported or stale evidence cannot establish passing verification. Legacy session gate JSON and tool/assistant prose are not evidence.

Exit 0 means all selected required checks passed with fresh inputs; 1 means required-check failure; 2 means invalid/missing configuration, unavailable/incomplete checks or stale inputs. Optional failures remain reported. Empty required sets and non-Git reusable freshness remain unverified. Inspect recorded child exit, signal, timeout and launch error even when a caller masks runner failure with `|| true`. Fix failures within scope, then run the relevant configured profile again; report unavailable checks and consequences without a retry/approval loop.

## Behavioral observations and acceptance

For changed critical behavior run meaningful runtime/tests and, for UI when relevant, browser observations. A command or grep pass supports only the check it actually covers. Record browser/manual observations separately with environment, action and observed result; unavailable browser tooling leaves behavioral coverage unverified. Documentation checks do not require an application browser journey. Human judgment/acceptance remains separate from machine passing evidence.

Configured scripts are a trusted boundary: the runner cannot detect scripts swallowing failures. Freshness covers the declared local input set at execution time, not changing remote services, external dependencies or concurrent edit-and-revert races.

## Report

State actual outcome, brief verification (check/profile and run reference), and unresolved limitations. Detailed commands/results live in the run record and accessible artifacts; no mandatory emoji, phrase regex or per-edit report. Never claim passing behavior from confidence, command names or fabricated prose.
