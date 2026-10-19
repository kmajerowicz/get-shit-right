---
name: gsr-learn
description: Index an existing project (or re-index after major changes) so GSR can work with it — detects doc root, tech stack, and GSR setup gaps, then updates CLAUDE.md. Use when onboarding an existing codebase into GSR or refreshing its index.
---

# /gsr:learn — Learn Skill

You are executing the `/gsr:learn` command. Your job is to index the requested project or affected area and return a bounded assessment. Direct `/gsr:learn` authorizes indexing and relevant documentation updates only, never feature implementation, provisioning, deployment or a full pipeline.

This skill serves two use cases:
1. **First run** — onboarding a new codebase into GSR (Start B or Start C)
2. **Re-run** — refreshing after significant codebase changes

---

## Fresh-context stage handoff

At a major stage or long-build increment, follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/stage-handoff.md`. Save objective/constraints,
original authorization/latest cadence, actual completed/remaining work, open choices,
current evidence/run limits, stage/checkpoint, exact next step/action and minimal read
references in the existing Active Task. Keep requirements in covered source documents.
Recommend `/clear` then **dalej** after saving. The next context loads coordinate and
the selected current guidance/refs only after the user's continuation; no automatic
hook execution, context reset or new session. Direct commands remain scoped optional
controls. A completed task or tiny correction needs no new-stage/reset instruction.
Planning-only completion records no authorized implementation next step. Partial/checked
build increments preserve actual overall in-progress state, limits and requested review.

## Relevant installed skills

Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/skill-selection.md` when selecting or
resuming guidance. Use the host's current catalog and actual task/output, load the
applicable SKILL.md, and reuse current guidance without redundant marketplace searches.
A saved skill name or a keyword match is not proof of use. Record only useful source/
provider/applicability/version-or-identity/loaded-use observations in existing feature/
plan sections; unknown identity stays unknown. Check availability/current content at
resume. Optional missing guidance permits authorized work; an essential missing capability
requires only its actual access/install boundary. Denied installation is not retried
through another downloader. No silent spending, publication or model switching.

## Iron Law

**Never ask a human to do something a file scan can answer.** Read the code first. Ask only when the code can't tell you.

---

## Step 1: Detect What Exists

Read the current request and supplied constraints first. Direct learn without a feature target may index project architecture; when a coordinator/task identifies an affected area, inspect that area and its direct integration points first. A typo/copy correction uses quick and needs no learn sweep. Do not require a PRD to understand an existing product.

Inspect accessible relevant files: existing CLAUDE/README references, language/project configuration, targeted source/tests and directory structure. Expand only when integration uncertainty requires it; never expose credentials or read unrelated personal files.

**Project and doc directory detection:** use `${CLAUDE_PLUGIN_ROOT}/lib/project.js` (`discover(cwd)`) as the shared contract. Resolve the canonical Git worktree root even from a subdirectory or symlink. Outside Git, walk to the nearest `.gsr.json` or GSR STATE marker; otherwise cwd is only a proposed project location.

Project-root `.gsr.json` schemaVersion 1 takes precedence for `docRoot`. Otherwise score `.ai`, `.cursor`, `ai`, `docs`, `doc`, `documentation` by PRD.md, prd.md, scope.md, STATE.md, techstack.md, BACKLOG.md, features/ and work/. Highest score wins; ties follow that order. With no artifacts, `docs` is proposed, not initialized. Reject invalid configuration and paths/symlinks escaping the project; do not silently switch projects. A CLAUDE.md mention alone is not verified state.

During authorized work, translate known legacy techstack Gate commands into `.gsr.json`, preserving the prose and reconciling conflicts with the actual stack. Do not invent npm or TypeScript checks for Python or other stacks. Describe the config change in the normal summary; no onboarding approval screen. See [verification contract](../../docs/patterns/verification-contract.md).

Once DOC_ROOT is resolved, list existing GSR artifacts and read only those relevant to the indexing target/task: current feature/task, applicable scope/PRD sections, STATE continuation, techstack and integration references. Preserve useful existing docs and conventions. No whole-product retroactive feature catalog is required.

Record actual artifacts, canonical project/DOC_ROOT, detected stack/check commands, observed conventions, affected areas/integration points, gaps and stale references. File existence never establishes implementation or acceptance.

---

## Step 2: Map the Relevant Code

Inspect architecture, conventions, stack/check configuration, data/auth and external integrations where relevant to the target. Begin with affected source/tests and direct callers/consumers. Expand inspection only to resolve a concrete dependency or integration uncertainty; explain the reason in the assessment. A source-file count is not a reason for a whole-repository agent sweep.

Default to direct bounded inspection. Delegate independent bounded areas only if useful and permitted, with file boundaries and the specific question to answer. Do not install tools or provision services from an indexing request.

---

## Step 3: Partial GSR Setup Handling

Based on what you found in Step 1, handle each scenario:

### Missing or partial setup

Update/create CLAUDE.md for observed conventions and real references, preserving Learned Rules and useful content. Add only documentation needed for the authorized indexing/task: techstack for actual detected stack/checks, STATE for a tracked nontrivial task, and a focused feature spec when that preparation is part of a broader authorized task. Do not create empty BACKLOG/features trees merely to satisfy a checklist. Missing PRD is not a gap that forces whole-product PRD generation; never add links to nonexistent PRD files.

Direct learn returns an assessment and does not implement or generate a feature spec merely because a feature was mentioned as context. When invoked internally for an already authorized feature task, pass the bounded assessment/references to focused feature preparation in the scope skill. Create only needed missing CLAUDE/techstack/STATE/spec files at resolved DOC_ROOT, without overwriting existing useful content. No parallel `docs/` tree when DOC_ROOT is `.ai`.

For existing setup, validate relevant references against actual files and flag stale ones; refresh only affected indexing facts. Preserve existing IDs/spec wording and do not mark implementation complete from STATE checkboxes.

---

## Step 4: Produce the Assessment and Stage Handoff

Report a concise outcome: indexing target/observed scope, canonical project/DOC_ROOT, detected stack/conventions/check path, missing relevant context and exact next action. Keep detailed file references available; the user need not read internal records to continue. Infer weight from stakes/current context if absent, record it when STATE is legitimately updated, and never ask for weight confirmation or an expertise selector.

Choose next action from actual intent and files:
- Existing product plus a nontrivial feature request: prepare/reuse one focused `DOC_ROOT/features/<slug>.md` through the scope skill, then build from that reference. No full PRD needed.
- Existing sufficient feature/plan: saved next action points directly to it; do not ask which feature again.
- New product/materials needing whole-product scope: scope/PRD remains appropriate.
- Clear small correction: quick; no feature paperwork or whole-project indexing.
- Direct learn: finish indexing and recommend the concrete next action, without executing it or expanding authorization.

For a broader authorized task, save one compact Active Task summary/reference and the exact next bounded stage. At this completed major indexing/preparation stage, recommend `/clear`, then **"dalej"**; the user performs the reset/continuation. Existing explicit commands remain optional direct controls. Within a stage continue authorized work; for long work save a checked partial checkpoint with truthful in-progress status. Do not silently clear or promise the entire task fits one context. If STATE is absent and only standalone indexing is requested, do not create task scaffolding just to simulate a continuation.

A later instruction narrowing scope/cadence wins. Assessment does not prove readiness or behavior: the next agent reads actual code/spec and checks current evidence freshness before reuse.

---

## Step 5: Update CLAUDE.md

After the assessment, update (or create) CLAUDE.md:

1. **References section** — add correct paths for: schema, routes, design tokens, API client (whatever is relevant to this project)
2. **Code Conventions** — fill in what you found: naming, folder structure, patterns
3. **Tech Stack** → update `DOC_ROOT/techstack.md` if relevant, or note it in CLAUDE.md

**Never overwrite existing Learned Rules.** Append only.

---

## Iron Law Enforcement

**Before finishing, verify:**
- Did I read the actual code, not just guess from file names?
- Are all CLAUDE.md references pointing to files that actually exist?
- Did I flag every stale reference?
- Is the "next step" instruction specific and actionable?

Red flags — if you're thinking any of these, stop:
- "I'll approximate the conventions from what I see" → Read more files, don't approximate
- "The user can figure out the next step" → Save the concrete stage/task handoff and offer `/clear` then "dalej" for the existing authorized task; direct commands remain optional.
- "I don't need to check if references are valid" → Always validate references exist
