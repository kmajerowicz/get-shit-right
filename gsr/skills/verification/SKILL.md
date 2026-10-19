---
name: gsr-verify
description: Verify a completed feature or build phase against its pinned must-haves with an evidence-based report — build, grep, visual, tests, human tiers. Use when a feature or phase is done and needs to be checked before declaring PASS.
---

# /gsr:verify — Verification Skill

You are executing the `/gsr:verify` command. Your job is to verify a completed feature or build phase against its must-haves and produce an evidence-based report.

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

## Collaboration contract

Explicit task authorization and constraints override generic workflow defaults within host permissions. Read settled answers from the conversation and project files; never ask for them again. A planning-only request does not authorize implementation. Prepare plans, research material uncertainties, load installed skills, record state and run proportionate checks without separate approval. Weight controls rigor, not authority or review cadence. Honor explicitly requested per-chunk review and later instructions narrowing autonomy; otherwise continue reversible work in scope. Ask only for an unresolved consequential product choice or a real installation, spending, publishing, destructive-action or host permission boundary. Continue independent authorized work while a decision is pending. Completion reports give the outcome, brief verification and unresolved limits; detailed evidence stays accessible.

Discover the canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`; below, `docs/` means that resolved DOC_ROOT, not an assumed folder. Invalid discovery/configuration is a diagnostic to reconcile, never permission to silently switch projects.

### Task continuation and completion

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

1. **"All tasks done" is not verification.** Check actual outcomes. Run commands. Read output. Verify with evidence. _[invariant]_
2. **Always exhaust lower tiers before escalating to human.** Never ask a human to verify something a grep or build command can answer. _[invariant]_
3. **Blockers block. Minors don't.** A Blocker means the feature is not done. A Minor goes to BACKLOG.md and the phase can still PASS. _[invariant]_

---

## Step 0: Detect Project State

Resolve the explicit requested feature/phase/spec target first, otherwise an unambiguous
saved task. Read the focused spec and inspect actual code/tests/integration before choosing
verification versus spec review. A sufficient focused feature does not require whole PRD
or STATE. Read existing STATE/weight as summaries (standard if absent); reconcile stale
phase/checkbox labels with files and current evidence. `NOT STARTED` never proves no code.

Use PRD/spec review only when that is the requested operation, or inspection actually
shows no implementation for the target. If there is no full PRD, review the focused spec
and relevant existing code constraints. Do not auto-implement during a direct verification
request. Otherwise continue to build/behavior verification against the requested contract.

---

## PRD Review Mode

The requested target is spec-only or actually has no implementation. Verify its focused spec/applicable PRD — catch problems now before they become expensive to fix mid-build.

Run all 5 checks below. For each: fix what you can directly in `docs/PRD.md` and `docs/features/*.md`, surface what needs a user decision as a decision gate.

### Check 1: Cross-Phase Dependency

For every feature in every phase, ask: does this feature depend on something only delivered in a later phase?

Common traps:
- UI component references a service built in a later phase
- Phase N demo sentence requires data only available after Phase N+2
- Shared infrastructure (auth, caching, service workers) used before it's scaffolded

For each conflict found: either move the dependency earlier, swap phase order, or add a "scaffold in Phase X, complete in Phase Y" note. Fix directly if unambiguous; use a decision gate if trade-offs exist.

### Check 2: Internal Consistency

- Auth type — consistent across architecture diagram, data model, onboarding flow, feature descriptions?
- Screen/step counts — do counts in headers match the actual list of screens?
- Data model — does every feature have the entities it needs? Does any feature reference a field that doesn't exist in the model?
- Out-of-scope list — does anything in "explicitly out" contradict something required by an in-scope feature?

### Check 3: Open Decisions

Scan for ambiguity and assumptions; reconcile supplied answers first. List unresolved items; ask only about consequential product choices and honor existing deferrals.

### Check 4: Completeness

For every feature in the feature index:
- Does it have a demo sentence or verifiable user story? If not, the feature is too abstract.
- Does it have at least one observable truth verifiable at build time?
- Are there undefined terms — entities or concepts used but never defined in the PRD or data model?

For each feature file, also check:
- **Must-haves are testable** — every Truth uses "User can [action]" or "System does [behavior] when [condition]", not vague descriptions
- **States covered** — empty, loading, partial, full, error states present where relevant
- **Business rules are concrete** — no "appropriate validation" or "proper error handling"; specify what validation, what error message

Fix what you can; flag what needs user input.

### Check 5: Edge Case and Gap Sweep

Re-read the PRD as if you are a developer about to implement Phase 1 tomorrow:
- What would you need to ask before starting? Those are gaps.
- What states are missing? (empty states, error states, loading states, offline states, first-time-user states)
- What happens at the boundaries? (max items, zero items, concurrent users, expired sessions)

Only add edge cases that would cause a developer to make a wrong assumption. Don't pad the PRD.

---

### PRD Review Report

After running all 5 checks, present a structured report:

```
## PRD Review — [date]

### Issues Found and Fixed
- [what was wrong → what was changed]
- "Review passed clean" if nothing found

### Open Decisions
[Only consequential unresolved product choices need a decision gate]

### Gaps Requiring Input
[Anything that needs user clarification before building]

### Summary
Spec quality: READY TO BUILD / NEEDS DECISIONS / HAS GAPS
```

If **READY TO BUILD**: "Spec looks solid. Run `/gsr:build` to start Phase 1."
If **NEEDS DECISIONS** or **HAS GAPS**: work through them before declaring ready.

---

## Step 0: Determine Scope

Use the feature/phase requested in the conversation or current authorized task. Ask only if verification scope remains genuinely unresolved.

- **Feature verification** → read that feature file's must-haves
- **Phase verification** → read all feature files in that phase + PRD build phase must-haves

---

## Step 1: Read the Must-Haves

From the feature file(s) and/or PRD build phase:
- **Truths** — observable behaviors that must be true
- **Artifacts** — files that must exist with real (non-stub) implementation
- **Key Links** — critical connections between parts
- **Demo sentence** — what the user can do after this phase (from PRD)

These were defined at spec time. You are now checking that they are actually true.

**Pin detection:** Before proceeding, grep the feature file's Must-Haves section for `\.T\d+|\.A\d+|\.K\d+`. If matches are found, this is a pinned spec — capture each must-have with its ID (`<slug>.T1`, `<slug>.A1`, `<slug>.K1`). Every line in your report must carry the ID; it is the join key between spec, code, and evidence. If no matches are found, this is an unpinned spec — proceed with the legacy checklist output and skip the Acceptance Coverage subsection in Step 3.

---

## Step 2: Run Verification in Parallel

Select checks by changed behavior and stakes, using configured profiles only within documented applicability. Weight scales depth, not evidence requirements: a critical behavioral change needs behavioral checks at any weight; documentation alone needs no browser journey.

Dispatch parallel verification checks (use implementer agents for independent checks). Dispatch via the Agent tool with `subagent_type: "gsr:implementer"` — model and role come from the agent definition:

### Check 1: Configured checks (Automated)

Discover the project and validated `.gsr.json`; invoke `node "${CLAUDE_PLUGIN_ROOT}/scripts/run-checks.js" --cwd "<canonical-project-root>"` with an applicable configured `--profile` only when justified. Read actual result records and freshness per the gate skill. No hardcoded stack defaults; unavailable/failed/stale results remain explicit.

### Check 2: Anti-Pattern Sweep (Tier 2 — Grep)
Standard patterns:
```bash
grep -r "console.log" src/ --include="*.ts" --include="*.tsx" | grep -v "test\|spec"
grep -r "TODO\|FIXME\|HACK" src/
grep -r "mock\|fake\|dummy\|placeholder" src/ --include="*.ts" --include="*.tsx" | grep -v "test\|spec"
grep -r "\"\"" src/ --include="*.ts" --include="*.tsx"  # empty string placeholders
```

Project-specific patterns from CLAUDE.md Learned Rules (check for any additional anti-pattern rules).

Classify each finding as Blocker or Minor:
- **Blocker:** `console.log` as stub for real functionality, mock data in production code, empty function bodies
- **Minor:** debug logs in non-critical paths, TODO comments, commented-out code

### Check 3: Artifact Verification (Tier 1/2 — Static)
For each Artifact in must-haves:
1. Does the file exist?
2. Is it substantive (not a stub)? Check: file size >10 lines, exports present, no placeholder returns
3. Are expected exports/functions present? (grep for function/export names)

Report each as: SUBSTANTIVE / STUB / MISSING

### Check 4: Key Links (Tier 2 — Grep)
For each Key Link in must-haves:
```bash
grep -r "[import/function name]" [source file path]  # verify wiring
```
Report each as: WIRED / NOT WIRED

### Check 5: Truth Verification (Tier 2/3 — Command + Behavioral)
For each Truth in must-haves:
- Verify behavior with relevant tests/runtime observations; grep establishes only static presence/wiring
- If needs manual check → mark as HUMAN

```bash
# Use the configured test/runtime check covering this truth through the shared runner.
# Static patterns alone do not prove behavioral truth.
```

### Check 6: Spec Drift (Tier 2 — Grep, pinned specs only)

_(Skip entirely for unpinned specs.)_

For each pin ID in the feature file (e.g., `slug.T1`, `slug.A1`, `slug.K1`), grep `src/` and `tests/` for references — comments, test descriptions, inline notes:

```bash
grep -r "slug\.T1\|slug\.A1\|slug\.K1" src/ tests/ --include="*.ts" --include="*.tsx" --include="*.test.*"
```

Compare hits against the feature file's current must-haves table. Flag any ID that appears in code or tests but **no longer exists** in the feature file — spec was edited after code was written.

Verdict per ID: `OK` or `DRIFT: found in [file:line], missing from spec`.

If any DRIFT found → Blocker. Resolve by either restoring the removed requirement or removing the stale reference from code.

### Check 7: Assumptions (Tier 1 — Ledger read)
Read the PRD Assumptions Ledger. For each row with Status `assumed`:
- Severity `blocking` → **Blocker** ("Open blocking assumption <id> — confirm or
  revise before PASS").
- Severity `non-blocking` → list in the report under "Open assumptions" — never
  blocks.
On PASS, if the user confirmed any assumption during Step 4 human checks, flip
its Status to `confirmed` with today's date.

### Check 8: Visual Flow Verification (Tier 2.5 — Browser; UI features only)
Run per `${CLAUDE_PLUGIN_ROOT}/docs/patterns/visual-verification.md` when its
preconditions hold (UI feature + dev server + browser tooling available).
Scale visual checks to changed behavior. Missing relevant tooling stays unavailable with its consequence reported; judgment remains separate from machine evidence.

---

## Evidence Format

Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md`. Record check/profile/run references and exact supported conclusions; browser/manual observations remain separately attributed. No mandatory emoji syntax or full per-edit output. Illustrative static observations:

```
❌ grep -r "console.log" src/ → 3 matches (auth.ts:12, api.ts:45, utils.ts:8) → BLOCKER: debug logs in production code
⚠️ grep -r "TODO" src/ → 1 match (config.ts:22) → MINOR: moved to BACKLOG.md
```

If you find yourself using hedging language, it means you haven't run the verification. Go back to Step 2 and actually execute the checks.

---

## Step 3: Compile Verification Report

Format the report per `docs/phases/4-verification.md`:

```markdown
## [Feature/Phase] Verification — [date]

### Evidence Summary
[Configured profile, run reference, actual results, freshness and limitations]

### Demo Check
> After this phase: [demo sentence from PRD]
- [ ] manual: open app, verify the above

### Observable Truths
| ID | Truth | Status | Evidence |
|----|-------|--------|----------|
| `<slug>.T1` | [Truth] | PASS / FAIL / HUMAN | [command → output → claim] |

### Artifacts
| ID | File | Expected | Status | Evidence |
|----|------|----------|--------|----------|
| `<slug>.A1` | [path] | [what it should do] | SUBSTANTIVE / STUB / MISSING | [line count, exports found] |

### Key Links
| ID | From | To | Via | Status |
|----|------|----|-----|--------|
| `<slug>.K1` | [file] | [file] | [import/call] | WIRED / NOT WIRED |

### Acceptance Coverage

_(Skip this subsection entirely for unpinned specs — see pin detection in Step 1.)_

Compute one line per category, then a totals line:

```
Truths:     [X]/[Y] verified by command, [Z] by test, [W] by human, [U] unverified
Artifacts:  [X]/[Y] substantive
Key Links:  [X]/[Y] wired
Total:      [X]/[Y] must-haves satisfied — [U] unverified
```

**Verification PASS requires applicable must-haves to have sufficient evidence.** Pending pins are valid inputs to first verification, not automatic blockers. Evaluate current requirements and evidence, then update statuses. Command/grep results never imply human acceptance; report automated verification and human acceptance separately. Missing behavioral evidence remains unverified.

### Anti-Patterns
| File | Pattern | Severity |
|------|---------|----------|
| [file] | [pattern] | Blocker / Minor |

### Summary
Blockers: [list or "none"]
Human checks needed: [list or "none"]
```

---

## Step 4: Present Report + Human Checks

Present outcome, brief verification and unresolved limits; keep the detailed report accessible.

If there are **Blockers**:
```
BLOCKED — [N] blockers must be resolved before this [feature/phase] can PASS:

1. [Blocker description] — in [file]
2. [Blocker description]

These become tasks in the current phase. Fix them, then re-run /gsr:verify.
```

If there are **Human checks**:
If Check 8 ran, the human checklist contains ONLY judgment items (look & feel,
copy tone, aesthetic fit) — never "does it work" items the visual tier already
proved or failed.
When browser checks are relevant, use the project's actual configured development server command and observe readiness. No npm default. If it cannot run, report unavailable coverage and its consequence.

Then present the checklist:
```
Human verification needed:

1. Open [localhost URL] → [specific action] → expect: [specific outcome]
2. [Next check]

Mark each as pass or fail.
```

Wait only for required human judgment or requested review boundaries. Otherwise finish the verified subset and report outstanding acceptance/behavioral coverage without a repeated approval loop.

---

## Step 5: Update STATE.md

Based on outcome:

**If verification PASS (no applicable blockers or missing required behavioral evidence):**
- Report automated verification separately from human acceptance; pending judgment never becomes accepted from a command pass
- Record only concise outcome, current run/artifact reference and limitations in STATE.md; detailed gate results stay in evidence records and verification artifacts
- Update feature/phase status to PASS with date
- Move Minor anti-patterns to BACKLOG.md
- For pinned specs: update each must-have row's Status in the feature file:
  - Human checks confirmed by user during Step 4 → flip Status to `accepted`
  - Must-haves verified by command or test → flip Status to `done`
  - Preserve all IDs exactly — do not renumber or reorder rows
- For pinned specs: upsert the Pin Coverage table in STATE.md — one row per pin with its current Status and today's date in Last Verified. Add new pins; update existing rows in place.

**If BLOCKED:**
- Update feature/phase status to BLOCKED
- List blockers in STATE.md
- Record concise blocker/next action and evidence reference in STATE; keep detailed failure/re-verification results in evidence records and artifacts

**Phase PASS flow:**
Check if all features in the phase are PASS → if yes, phase is PASS.

Check project done conditions:
1. All phases PASS?
2. If yes → run backlog triage (below) before declaring done.

### Backlog Triage (Claude-led)

Read `docs/BACKLOG.md` in full. For each item, classify it:

- **Must before launch** — the product is broken, misleading, or incomplete without this. A user would notice immediately.
- **v2** — genuinely useful, but the product ships and works without it.
- **Won't do** — no longer relevant, superseded by something built, or not worth the complexity.

Present the triage as a table:

```
## Backlog Triage

| Item | Recommendation | Reason |
|------|---------------|--------|
| [item] | Must before launch | [why it blocks launch] |
| [item] | v2 | [why it's post-launch] |
| [item] | Won't do | [why it's no longer needed] |
```

For any item where the categorization is non-obvious or you're uncertain: use the decision gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`) — present the options via AskUserQuestion with your recommendation first.

For items where the categorization is clear: include them in the table without a decision gate — present recommendations without a routine confirmation pause. Do not silently change product priorities or expand the authorized build scope.

For recommendations within existing settled product decisions:
3. If any 'must before launch' items → "These become a new build phase. Run `/gsr:build` to continue."
4. If nothing 'must before launch' → report completion of the authorized local scope. Deployment is separate; inspect it only when relevant to the requested task.

### Deployment Check

Deployment is a separate authorized action, not an automatic condition for finishing a local implementation/verification task. Read existing deployment evidence before asking. Configuration files do not prove a live deployment; report what was actually observed. If deployment/publication is requested and not yet authorized, prepare the concrete reviewable result and request only that permission. Do not publish, spend money or require the user to deploy merely because local work is complete.

---

## Iron Law Enforcement

Red flags:

| Thought | Reality |
|---------|---------|
| "The tests pass, that means everything works" | Tests cover only their behaviors. Run meaningful applicable checks and report uncovered requirements. |
| "This console.log is just debug, not a stub" | Check if it's replacing real functionality. If replacing → Blocker. If debug → Minor. |
| "I'll mark this as PASS and let the user find issues in testing" | PASS means verified, not hoped-for. Run the checks. |
| "The anti-pattern sweep found nothing, must be clean" | Did you add project-specific patterns from CLAUDE.md Learned Rules? |
| "I'll ask the human to verify the build passes" | Run the configured check through the internal runner. Report if unavailable. |
| "This should pass" / "Looks good" / "Probably works" | Red flag language. You haven't verified. Run the command, show the output, then claim. See `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md`. |
