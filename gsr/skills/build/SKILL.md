---
name: gsr-build
description: Build the requested feature from a sufficient bounded spec, including existing products without a full PRD or STATE. Honor task constraints, configured checks and requested review cadence.
---

# /gsr:build — Build Skill

You are executing the `/gsr:build` command. Your job is to build a specific feature from the project's feature files.

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

## Focused task contract

Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/task-handoff.md` when preparing/consuming a
nontrivial existing-product feature. A sufficient feature spec is the build contract;
missing whole-product PRD is not a blocker. Quick/read-only tasks need no scaffolding.
Use supplied constraints and actual code; retain valid deferrals and IDs. The optional
`${CLAUDE_PLUGIN_ROOT}/lib/task-handoff.js` provides structural observations only,
never semantic readiness, authority, passing behavior or acceptance.

## Collaboration contract

Explicit task authorization and constraints override generic workflow defaults within host permissions. Read settled answers from the conversation and project files; never ask for them again. A planning-only request does not authorize implementation. Prepare plans, research material uncertainties, load installed skills, record state and run proportionate checks without separate approval. Weight controls rigor, not authority or review cadence. Honor explicitly requested per-chunk review and later instructions narrowing autonomy; otherwise continue reversible work in scope. Ask only for an unresolved consequential product choice or a real installation, spending, publishing, destructive-action or host permission boundary. Continue independent authorized work while a decision is pending. Completion reports give the outcome, brief verification and unresolved limits; detailed evidence stays accessible.

Discover the canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`; below, `docs/` means that resolved DOC_ROOT, not an assumed folder. Invalid discovery/configuration is a diagnostic to reconcile, never permission to silently switch projects.

### Task continuation and completion

At a major stage boundary, save a compact next-stage handoff and recommend `/clear` followed by **"dalej"**; existing commands are optional direct controls. Continue authorized work within the stage, honoring review cadence. For a long build, use checked partial checkpoints, preserve in-progress status/remaining action and hand off to "dalej" without pretending the entire build is done. The user performs resets; do not clear/start sessions automatically. Explicit practical same-session continuation remains possible without overriding tighter review boundaries.

When authorized work updates STATE, add/update one optional `## Active Task` section
without rewriting unrelated sections. Record objective, constraints, authorized scope,
source/date of authorization in prose, explicit review cadence, current plan/task relative
to DOC_ROOT, last verified run reference and next action. The template is
`${CLAUDE_PLUGIN_ROOT}/templates/state-md.md`; legacy files remain valid.

On resume read this section by heading (not the first 20 lines), read the referenced
current task/plan, inspect actual repository state and observe current evidence freshness.
Reconcile missing references and conflicting recorded progress with files; a done box is
not proof and stale tests do not reset implemented work. Resume remaining authorized work
without re-asking settled decisions. Preserve explicitly requested review boundaries;
later instructions narrowing autonomy override STATE. No session record expands authority.

At completion recheck evidence freshness. Report outcome, brief actual verification/run
reference and unresolved limitations or necessary decision. Keep detailed gate output in
records, not duplicate STATE assertions. Browser/manual observations and unavailable
coverage remain explicit; machine checks never establish human acceptance. Do not demand
user acceptance for each successful automated check.

## Iron Laws

1. **Never claim done without evidence.** Run the gate function before every completion claim. Use configured check evidence with freshness and behavioral limits. Never "should work." _[invariant]_
2. **Corrections compound.** Record relevant corrections in CLAUDE.md Learned Rules within authorized work, with today's date; do not add a routine approval. _[invariant]_
3. **Match and load relevant installed skills.** Scale selection detail to weight; selection/loading needs no approval. Installation remains a separate permission boundary. _[weight-scaled]_
4. **Never reference assets that don't exist.** No placeholder image URLs, no `src="/images/..."` pointing to nonexistent files, no icon references without the icon being present. If UI needs a graphic, use inline SVG, CSS shapes, unicode characters, or descriptive text. Hallucinated images break user trust instantly. _[invariant]_
5. **Tests match what's built.** Only give testing instructions for features that are actually implemented and functional. Never list test scenarios for placeholder/coming-soon screens. If a feature depends on an unbuilt feature, say so explicitly: "Upload works, but full flow needs Configure built next." _[invariant]_

---

## Step 0: Setup

Discover canonical project/DOC_ROOT first. Read CLAUDE.md, STATE.md and techstack.md **if present and relevant**, plus the selected feature and actual affected source/tests. Missing CLAUDE, PRD or STATE never blocks a sufficient feature contract. Create only needed missing task documentation within authorized work; preserve existing content.

Use recorded weight or infer from task stakes without confirmation. Missing check configuration is handled per the gate skill: reconcile known actual commands, never invent npm/TypeScript defaults. Unavailable required verification remains explicit.

### Infrastructure Pre-Check

Inspect existing service configuration without displaying secrets. Missing credentials are not proof that implementation must stop. Continue independent authorized code work and mark unavailable runtime checks. Ask only for necessary inaccessible information, provisioning/spending permission or an unresolved product choice; do not demand a setup confirmation for every service.

---

## Step 1: Feature Selection

Resolve the feature target in this order: explicit command target from `$ARGUMENTS` (excluding `--sketch`), latest user request, then an unambiguous current Active Task/spec/plan reference. A slug resolves to `DOC_ROOT/features/<slug>.md`; a DOC_ROOT-relative file such as `features/csv-export.md` is consumed directly. Use `${CLAUDE_PLUGIN_ROOT}/lib/task-handoff.js` reference validation for explicit references; reject absolute/traversal/escaping paths rather than switching projects. Structural presence still needs agent review of actual requirements/code.

Use supplied targets without asking which feature again. If no sufficient spec exists for an authorized nontrivial feature, prepare only that missing focused contract through scope Start C; no full PRD requirement. Finish preparation with the saved fresh-context build handoff. Ask one target question only if current intent/references remain genuinely ambiguous. Phase/batch selection uses actual PRD/STATE when present; do not invent a phase structure for a standalone feature.

**Batch build:** If the user says "all", "build everything", "whole phase", or similar — switch to batch mode:
1. Build features sequentially in dependency order
2. Choose internal techniques from the task heuristic; explicit review cadence overrides classification.
3. Run mini-verification after each feature, but don't stop to ask "which feature next?" — proceed automatically
4. After each feature: give a brief actual status/limits update instead of full test instructions
5. Give full test instructions only at the end, covering all built features together
6. If you hit a blocking error or ambiguity requiring a product decision, stop and ask — then resume batch after the answer
7. **Notifications (optional, only when explicitly authorized):** if a push/notification tool is available in
   this session (e.g. PushNotification — check the available tools; NEVER fail
   or pause because it's absent), send a short push whenever batch pauses for a
   decision ("GSR: decision needed — <topic>") and once when the batch finishes
   ("GSR: batch done — <N> features built, <M> assumptions recorded"). No
   notification tool → proceed silently, exactly as before.

The user can also interrupt batch mode at any time to switch to feature-by-feature.

---

## Step 2: Load Feature Context

After resolving the requested target, read its sufficient feature contract and Task Context, affected existing code/tests and integration points. Read STATE/techstack and an applicable PRD Assumptions Ledger only if present; without PRD use the feature's recorded decisions/deferrals. Do not invent nonexistent PRD references. Inspect actual prerequisite implementation rather than treating missing STATE as missing dependencies.

**Prerequisite check:** Read dependencies and reconcile STATE status with actual files. Build prerequisites already within the authorized task in dependency order. Ask only if a dependency would expand scope or leaves a consequential unresolved product choice; present the concrete choice via the decision-gate pattern. Do not show a routine prerequisite selector.

**Load relevant installed project-wide skills now.** Use applicable techstack references if present and the current installed catalog; absence of techstack is not an installation blocker. Skills matched to specific tasks happen after the task list is generated — see Step 3.5.

**Resume:** Read the existing matching plan and reconcile task status with actual files and current evidence freshness. Resume remaining authorized work automatically, preserving requested review cadence and later constraints. Stale tests do not erase implemented progress; rerun relevant checks. Missing references or conflicting status require reconciliation and a brief report, not a compulsory resume/start-fresh selector.

---

## Step 2.4: Product demonstration when useful

For a requested early view or concrete product uncertainty, load
`${CLAUDE_PLUGIN_ROOT}/skills/preview/SKILL.md` within this build stage. Follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md`: smallest useful flow/screen/
interaction/technical experiment, actual artifacts, observed vs simulated behavior.
Skip clear corrections and established patterns unless a preview is explicitly wanted.
Planning-only/preview-only does not authorize the full build. Honor show-and-wait.
If a preview exists, compare current requirement wording/decisions/artifacts and record
reuse/adapt/discard plus the reason and mocks/data to replace before production work.
A changed requirement under the same ID or missing artifact requires reconciliation.
An approved look is not verified storage, human acceptance of all Truths or deploy.

## Step 2.5: Design Sketch Preparation

Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/feature-sketch.md` for full pattern doc.

**Skip this step entirely if** `FORCE_SKETCH` is not set AND none of the heuristic conditions below trigger.

**Weight:** scale sketch detail to stakes. Inspect material risks at any weight; no heuristic creates a review gate.

**Heuristic — inspect these risk signals in the feature file:**
1. Fewer than 3 concrete states (empty / loading / error / success / offline / partial) mentioned
2. No acceptance criteria or done-when language in the must-haves section
3. Explicit `TBD`, `?`, or `decide during build` markers anywhere in the file
4. Feature declares dependencies on >3 other features

If `FORCE_SKETCH=true` (user passed `--sketch`): prepare the artifact regardless of heuristic.

When the heuristic suggests a sketch, prepare it per the feature-sketch pattern and record the approach/file map/limits internally. Heuristics are prompts to inspect, not automatic user gates. Ask only if a consequential product choice remains unresolved, or the user explicitly requested sketch review. `--sketch` requests the artifact, not a second execution approval.

---

## Sequential change packages when appropriate

For a substantial existing-product change or a requested correction sequence, load
`${CLAUDE_PLUGIN_ROOT}/skills/autopilot/SKILL.md` and the current saved queue definition
when present. Its helpers prepare current impact/context and administrative checkpoints;
you still implement with available tools and verify through the existing gate. Reconcile
source changes before advancing, keep all original constraints/cadence and bound repeats.
Small clear work stays proportionate. No helper runs work from SessionStart or accepts
requirements/authorization from STATE alone. Use actual before/after observations in
the outcome; no automatic model switching or claimed savings.

## Step 3: Execution approach

Choose internal creative/systematic techniques from the task. Do not present a mandatory mode selector. Requested per-chunk review wins regardless of UI/non-UI classification; otherwise continue authorized work. A request to plan only remains planning only.

## Step 3.5: Skills Matching + Verification

Infer needed skills, select installed ones and load them without routine approval. Weight changes selection depth, never permission.

Run this step regardless of mode, after the task list (Mode B) or file map (Mode A) is drafted — before anything executes.

### Output-type pre-filter (before per-task matching)

Before matching skills to individual tasks, check the **output type** of the overall deliverable. If the output will be seen by human eyes — UI screens, slides, landing pages, HTML files, PDFs, email templates, presentations — then a design/frontend-design skill is required regardless of framework or technology used.

Prefer available installed design skills for visual outputs. Missing skills are a reported limitation, not a mandatory installation blocker. Use official documentation/current tools when needed; marketplace commands that fetch tooling require installation authorization.

### Match skills to tasks

For each task/file group identify relevant capabilities and match available installed skills. Search outside the installed catalog only when useful and allowed; selecting a skill never authorizes installing its tools.

Build a verification table:

```
## Skills for [Feature Name]

| Task | Skill | Status | Install |
|------|-------|--------|---------|
| [task] | [skill-name] | installed / not installed | [install command] |
| [task] | — | no skill found | rely on docs |
```

If a skill covers multiple tasks, list it once and note which tasks it applies to.

### Load selected skills

Load installed SKILL.md files before implementation; summarize selection only when useful. Do not ask to approve routine selection. If a missing skill/tool is essential, request installation permission with the concrete reason and continue independent work. Optional missing skills do not block the task.

---

## Mode A: Creative Build

### How it works

1. Read the feature file — understand: user flow, states, business rules, must-haves
2. Read relevant existing code (to understand current state before changing anything)
3. Draft file map if >2 files, run Step 3.5 and proceed within existing execution authorization.
4. Implement in small chunks that the user can review
5. Give a concise chunk update with actual checks and limits; pause only at requested review boundaries.
6. Run relevant available behavioral checks; user judgment/feedback is separate from command evidence.
7. Implement corrections and record relevant Learned Rules without routine confirmation.
8. Create atomic commits only if the user authorized commits; task completion alone is not authorization.
9. Update STATE.md: increment task count for this feature

### Communication Rules (both modes)

- **Questions go at the end.** Structure every message as: status/update first → separator (`---`) → numbered questions with options. Never bury a question inside reasoning.
- **Number all options.** Even binary choices get numbers: "1. Tailwind 2. CSS Modules". User should be able to reply with just a number.
- **Minimize noise.** Don't show every file edit blow-by-blow. Batch small changes, give one summary. Save detailed output for things the user needs to review.

### Rules — Mode A

Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md` (single source of truth for configured checks and evidence) before verification claims. Report the actual outcome, configured check/profile/run reference and missing behavioral coverage. Detailed commands live in evidence; no mandatory emoji syntax.

**When stuck or something breaks:**
Check `docs/debug/` for an active debug session for this feature (`status: active` in frontmatter, `feature` matches current feature name). If one exists, invoke `/gsr:debug resume <slug>` to continue it. If none exists, invoke `/gsr:debug` to start a new session. Return to build flow after the session reaches `status: resolved`.

**When the user makes a correction:**
After implementing, record relevant Learned Rules and summarize the changed behavior.

---

## Mode B: Systematic Build

### How it works

1. Read the feature file — identify all systematic tasks
2. Generate task list with explicit pass/fail criteria:

```
Task list for [feature] — systematic mode:

1. [Task] — Done when: [grep shows X / tests pass / build clean]
2. [Task] — Done when: [specific verifiable criterion]
3. [Task] — Done when: [...]

Parallelizable: tasks [1, 2] can run simultaneously (no file overlap)
Sequential: task [3] depends on [1]
```

3. **Run Step 3.5 (skills matching).** Load relevant installed skills without a confirmation pause.

4. **Write the plan before execution.** Create `docs/plans/<YYYY-MM-DD>-<feature-slug>.md` from the plan template, with loaded skills, bounded tasks, criteria and dependency order. Existing implementation authorization covers preparation and execution; present the plan briefly without reapproval. If planning-only, finish with the plan and do not execute. Honor explicit plan/chunk review boundaries.

5. Execute tasks — parallelizable ones via subagent implementers:
   - Read `${CLAUDE_PLUGIN_ROOT}/agents/implementer.md` for the implementer agent role
   - Dispatch via the Agent tool with `subagent_type: "gsr:implementer"` — model and role come from the agent definition
   - Each agent gets: task description, CLAUDE.md content, feature file content, file boundaries, success criteria
   - In systematic mode, dispatch two staged reviewers after each implementer:
     1. **Stage 1 — Spec:** read `${CLAUDE_PLUGIN_ROOT}/agents/reviewer-spec.md`. Dispatch via the Agent tool with `subagent_type: "gsr:reviewer-spec"` — model and role come from the agent definition.
        - SPEC_PASS → proceed to Stage 2
        - SPEC_FAIL → fail task back to implementer (or escalate to user if it's a product decision). Do not run Stage 2.
        - NEEDS_INFO → inspect conversation/files first; ask only for inaccessible context or an unresolved consequential product choice, then re-run Stage 1
     2. **Stage 2 — Quality:** read `${CLAUDE_PLUGIN_ROOT}/agents/reviewer-quality.md`. Dispatch via the Agent tool with `subagent_type: "gsr:reviewer-quality"` — model and role come from the agent definition.
        - APPROVED or APPROVED_WITH_CONCERNS → task done, update plan file
        - CHANGES_REQUESTED → fail task back to implementer
   - After each implementer+reviewer cycle: update the task's row in `docs/plans/<slug>.md` — set Status to `done` (or `failed`), write the evidence run/artifact reference (commit SHA only if authorized) in the Evidence column. Update `updated` in frontmatter.

6. For ≥3 agents or ≥10 files: use worktree isolation (Decision 25)
   - Each agent in its own git worktree
   - Sequential merge after all complete
   - Single wiring pass (shared files, consistency check) after merge

7. Atomic commit per task only when commits are authorized, referencing actual check evidence.

8. Verify changed behavior proportionately per the gate skill; reuse evidence only after freshness reconciliation. Fix required failures within scope or report limits.

9. Set plan `status: complete` only when all its authorized tasks are implemented and their actual checks/limits recorded. A partial checkpoint remains `in_progress`. Update `updated`, then the optional/minimal STATE summary without inventing full-product phases.

### Parallelization Heuristic

Parallelize when: task → file mapping has no file appearing twice.

**Parallelize:** i18n (per screen), testing (per feature), accessibility audit (per component)
**Don't parallelize:** refactoring (cascades), shared state changes, cross-file dependencies

---

## Step 4: STATE.md Update

After authorized implementation tasks complete and their actual verification is recorded (human acceptance remains separate):

If task tracking is needed, create/update `DOC_ROOT/STATE.md` minimally, preserving existing content; an absent full-product phase table is valid. For a standalone feature record its spec/plan, actual implementation progress and next action without inventing PRD phases.
- Feature status: `in progress` → `done`
- Last updated: today's date

**Assumption revisit checkpoint:** List touched open assumptions without a routine completion pause. Revisit only when new evidence makes a consequential product choice actionable, respecting deferral and review cadence. Machine results never confirm a D-pin; follow the deferred-decisions pattern.

**Standalone feature:** Save the exact feature spec and next verification action when its build stage completes; recommend `/clear`, then "dalej". Do not infer a PRD phase or ask which feature to verify.

**Phase completion check:** Only if an actual phase exists, check whether its authorized features are complete. At completed build stage save verification as the next bounded action, with `/clear` then "dalej"; do not imply full verification or human acceptance from implementation progress alone.

- **If yes — last feature in phase:**
  ```
  ✓ All features in [Phase N] are done.
  Next saved stage: verify this phase; use `/clear`, then "dalej". `/gsr:verify` remains optional direct control.
  ```
  Set `Next action` in STATE.md to: "Run `/gsr:verify` — all Phase [N] features done"

- **If no — more features remain:**
  Set `Next action` to the exact remaining authorized feature/task reference; never ask to pick again when the task already identifies it.

---

## Iron Law Enforcement

Red flags — if you're thinking any of these, stop:

| Thought | Reality |
|---------|---------|
| "The build probably passes, I'll skip checking" | Run the gate function. No shortcuts. |
| "This correction is obvious, I don't need to ask about CLAUDE.md" | Record relevant corrections within scope without routine reapproval. |
| "I'll skip skills matching for this simple feature" | Run Step 3.5. Always. Skills prevent the most expensive mistakes. |
| "The user hasn't responded to my completion message, must mean it's fine" | Silence is not acceptance or commit authorization. Honor existing explicit authorization and review cadence. |
| "I'll combine a few small fixes into one commit" | Atomic commits. One per task. Reviewable, bisectable. |
| "I'll use a placeholder image URL for now" | No. Use inline SVG, CSS, unicode, or text. Never reference nonexistent assets. (Iron Law #4) |
| "The user can test Configure even though it's not built yet" | Only test what's built. Never give test tasks for placeholders. (Iron Law #5) |
| "The user said build all, but I should still ask about each feature" | Respect batch mode. Only stop for blocking errors or product decisions. |
