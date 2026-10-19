---
name: gsr-prd
description: Generate docs/PRD.md, docs/features/*.md, and project infrastructure (CLAUDE.md, STATE.md, BACKLOG.md, techstack.md) from docs/scope.md. Use after scope shaping is complete, or to update the PRD when scope has changed.
---

# /gsr:prd — PRD Generation Skill

You are executing the `/gsr:prd` command. Your job is to generate `docs/PRD.md`, `docs/features/*.md`, and the full project infrastructure from `docs/scope.md`.

This skill runs Phase 1 (PRD generation) + Phase 2 (project init) in one flow.

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

## Collaboration contract

Explicit task authorization and constraints override generic workflow defaults within host permissions. Read settled answers from the conversation and project files; never ask for them again. A planning-only request does not authorize implementation. Prepare plans, research material uncertainties, load installed skills, record state and run proportionate checks without separate approval. Weight controls rigor, not authority or review cadence. Honor explicitly requested per-chunk review and later instructions narrowing autonomy; otherwise continue reversible work in scope. Ask only for an unresolved consequential product choice or a real installation, spending, publishing, destructive-action or host permission boundary. Continue independent authorized work while a decision is pending. Completion reports give the outcome, brief verification and unresolved limits; detailed evidence stays accessible.

Discover the canonical project and DOC_ROOT using `${CLAUDE_PLUGIN_ROOT}/lib/project.js` and validated `.gsr.json`; below, `docs/` means that resolved DOC_ROOT, not an assumed folder. Invalid discovery/configuration is a diagnostic to reconcile, never permission to silently switch projects.

## Iron Laws

1. **PRD is purely product.** No tech stack, no schemas, no routes, no design tokens. Those live in code and CLAUDE.md. If you catch yourself writing a column name or route path in PRD.md — stop. Move it to code. _[invariant]_
2. **Every build phase must have a demo sentence.** "User can [do X] after this phase." If you can't write it, the phase is too abstract. Restructure. _[invariant]_
3. **Skills are boosters, not blockers.** The PRD is complete whether or not skills are installed. Skills enhance quality, not enable completion. _[invariant]_

---

## Model Recommendation (show first, once)

Before any detection or action, show this one-liner to the user (exact text):

> 💡 This step is reasoning-heavy (PRD and feature files shape the entire implementation). It works best on Opus — if you're not on Opus, consider `/model opus` now and come back. Otherwise, let's keep going.

Do not wait for a response. Proceed immediately to "Step 0: Detect Mode" below. Show this reminder only once per session.

---

## Consume existing preview decisions

If scope/feature references a preview, read its current record and affected requirements.
Carry settled decisions, provenance and actual artifact refs forward; do not replay intake,
regenerate alternatives or infer backend behavior from visual approval. Reconcile changed
wording even under the same ID and missing artifacts. Migrate an existing scope/feature
D-pin to its PRD owner with the same ID/history and leave a pointer; never maintain two
editable ledgers. A preview is optional; absence does not block PRD or build. A sufficient
focused feature without a full PRD still goes directly to its authorized build. Follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md` for feedback and limits.

## Step 0: Detect Mode

Read `**Weight:**` from `docs/STATE.md` (default `standard` if absent).
Weight-scaled behaviors below reference `${CLAUDE_PLUGIN_ROOT}/docs/patterns/weight.md`.

Before doing anything, check if `docs/PRD.md` already exists.

**If PRD.md exists → Update mode:**
- Read `docs/PRD.md` and `docs/scope.md`
- Follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/research-reuse.md`: reuse applicable supported findings, review changed constraint wording even under unchanged IDs, and refresh only affected material questions. No age-only TTL or blanket rerun.
- Identify what changed: compare scope with what's reflected in the PRD. List the deltas.
- Update only the sections that need to change. Leave the rest untouched.
- Skip straight to the self-verification pass (Step 1), then present changes to user.

**If PRD.md does not exist → Full generation mode:**
- Read `docs/scope.md` and any design references the user mentions
- Review relevant existing findings for material "blocking PRD" questions before new research, per `${CLAUDE_PLUGIN_ROOT}/docs/patterns/research-reuse.md`. Reuse supported applicable claims; refresh only concrete constraint/source/temporal gaps. Default to inline bounded work; delegate independent questions only when useful and within task/budget. Missing/conflicting support stays uncertain; preserve valid deferred choices.
- Proceed through Step 1 in full

---

## Step 1: Generate PRD.md

Use `${CLAUDE_PLUGIN_ROOT}/templates/prd-md.md` as the structure. Fill in from scope.md:

1. **Project summary** — 2-3 sentences: what, for whom, why
2. **Business goals** — measurable goals + success metrics
3. **Target users** — primary persona, day 1/7/30 journeys
4. **MVP scope** — what's in, what's explicitly out (from scope.md v2 backlog) (spike: no v2 backlog)
5. **High-level architecture** — system diagram (boxes and arrows, not code). Infer from tech stack and project type.
6. **Conceptual data model** — entities, relationships, key business rules. Stable level: "User has many Dogs" not "users.id BIGINT NOT NULL"
7. **Feature index** — table with all features and links to their files (files don't exist yet — create the links anyway)
8. **Non-functional requirements** — performance, accessibility, mobile targets
9. **Design direction** — visual inspiration, color palette intent, typography intent (from scope or ask)
10. **Build phases** — ordered phases, each with: type, demo sentence, must-haves summary
11. **Research areas status** — from scope.md
12. **Assumptions Ledger** — migrate the ledger from scope.md verbatim (same IDs), then append any new deferrals from PRD-stage decisions. This is now the single home of the ledger.

**PRD.md must be 200-300 lines** (spike weight: 1 page max — foundations, feature list, build order, ledger; skip sections 5, 8, 9 unless content already exists). If it grows past 400, something belongs in a feature file.

Before presenting to the user, run a mandatory self-verification pass:

### PRD Self-Verification (do this before showing the user)

This is a mandatory quality gate. The user should never see a first draft — they should see a reviewed document with issues already caught and fixed. Run all 5 checks before presenting anything.

**1. Cross-phase dependency check**
For every feature in every phase, ask: does this feature depend on something that is only delivered in a later phase? Common traps:
- UI component references a service built in a later phase
- Phase N demo sentence requires data only available after Phase N+2
- Shared infrastructure (service workers, auth middleware, caching) used before it's scaffolded

List every conflict found. For each: either move the dependency earlier, swap phase order, or add a "scaffold in Phase X, complete in Phase Y" note.

**2. Internal consistency check**
- Auth type — does it match across all sections (architecture diagram, data model, onboarding flow, feature descriptions)?
- Screen/step counts — do counts in section headers match the list of actual screens?
- Data model — does every feature have the entities it needs? Does any feature reference a field that doesn't exist in the model?
- Out-of-scope list — does anything in "explicitly out" contradict something that's required by an in-scope feature?

**3. Open decision check**
Scan ambiguous, assumed or ⚠️ items and reconcile them with supplied decisions and the Assumptions Ledger first. Record remaining uncertainty without turning every item into a question. Preserve recently deferred D-pins; revisit only when new evidence makes a consequential choice actionable, following the deferred-decisions pattern.

**4. Completeness check**
For every feature referenced in the feature index:
- Does it have a demo sentence or verifiable user story? If not, the feature is too abstract.
- Does it have at least one observable truth that can be verified at build time?
- Are there any undefined terms — names, concepts, or entities used in one feature but never defined in the PRD or data model?

Flag any feature that fails these checks. Fix gaps from supplied decisions and available evidence; ask only for consequential unresolved product choices that are actionable now, respecting existing deferrals.

**5. Edge case and gap sweep**
Re-read the PRD as if you are a developer about to implement Phase 1 tomorrow:
- What would you need to ask before starting? Those are gaps.
- What states are missing? (empty states, error states, loading states, offline states, first-time-user states)
- What happens at the boundaries? (max items, zero items, concurrent users, expired sessions)

Don't add every edge case to the PRD — but if a missing edge case would cause a developer to make a wrong assumption, add it.

After self-verification: fix all issues you found, then present PRD.md with a summary of what you caught and fixed. If you fixed nothing, say so — "Self-review passed clean" is a valid outcome.

After reconciling supplied decisions and the Assumptions Ledger, use the decision-gate pattern (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/decision-gate.md`) only for consequential unresolved product choices that are actionable now. Do not re-ask settled answers or recently deferred D-pins. New evidence may justify revisiting a deferred choice; explain that evidence and follow the deferred-decisions pattern. Routine technical choices remain internal.

**Final step — always, regardless of how many decisions were resolved:**
Present a concise summary instead of sending the user to read a long document:

```
PRD ready. Key decisions baked in:
1. [Most important product decision]
2. [Second most important]
3. [Third — if applicable]

Build phases: [N] phases, starting with [Phase 1 demo sentence].

Continuing to authorized feature files; unresolved product decisions are listed separately.
```

The full PRD is available in `docs/PRD.md` if the user wants to read it, but don't require it. The summary should surface the top 3-5 decisions that are most likely to be wrong or surprising. If the user says "looks good" based on the summary — that's sufficient to proceed.

Proceed to feature files when already authorized; pause only at requested review boundaries or unresolved consequential product choices.

---

## Step 2: Generate Feature Files (one per feature)

For each feature in the feature index, generate `docs/features/<name>.md` using `${CLAUDE_PLUGIN_ROOT}/templates/feature-md.md`.

**No mandatory marketplace matching here.** Load installed guidance when it materially helps current planning. Build refines task-level matches. Useful actual guidance references may live in the existing Task Context; no invented Skills table or routine selection gate.

Run Step 2a only for material technical uncertainty after reading applicable existing findings. Follow the research-reuse pattern; default to inline work and delegate only bounded independent questions when useful/supported/within budget. Link the finding to its feature/decision, recording provenance, dates, support, counterevidence, uncertainty and reuse/refresh reason. Stop when sufficient for the question, the supplied budget is reached or human judgment/experiment remains; report partial uncertainty accurately. No mandatory research from a D-pin alone or broad sweep for a routine correction.

### Step 2a: Don't Hand-Roll Sweep

For each materially unresolved capability question (auth, payments, email, file upload, real-time, geo, etc.), reuse applicable findings before a targeted refresh:
- Check if a proven library/service already solves it
- Add a **Don't Hand-Roll** table if relevant

```markdown
## Don't Hand-Roll
| Need | Don't Build | Use Instead | Why |
|------|------------|------------|-----|
| Auth | Custom JWT session management | next-auth or lucia | OAuth, session security, edge cases handled |
```

If no relevant items → omit the section.

### Known Pitfalls

For features involving complex or risky technical territory (real-time sync, offline, payments, geo, camera, push notifications):
- Surface common mistakes, why they happen, how to avoid them, warning signs
- Add a **Known Pitfalls** section if relevant

### Must-Haves

For each feature, define must-haves at product level (no file paths):

**Truths** — observable behaviors:
```
- User can [action]
- System does [behavior] when [condition]
```

**Artifacts** — files that must exist with real implementation:
```
- [Description of module/service] with [key exports]
- [Description of page/component] with [key behavior]
```

**Key Links** — critical connections:
```
- [Feature A] reads from [Feature B]
- [Component] calls [API/service]
```

**Assign pin IDs as you write every must-have** — `<feature-slug>.T<n>` / `.A<n>` / `.K<n>` per the feature-md template, all with Status `pending`. A feature file without pin IDs in its Must-Haves tables is incomplete. If the feature depends on any D-pin, list it under **Assumptions touched**.

### Generate the Feature File

Fill in `${CLAUDE_PLUGIN_ROOT}/templates/feature-md.md` with everything found above. Record useful actually loaded guidance in Task Context; no mandatory skill table.

### Feature File Self-Review (before presenting to user)

Before presenting each feature file, run a quick self-review:
- **Must-haves are testable** — every Truth uses "User can [action]" or "System does [behavior] when [condition]", not vague descriptions
- **States covered** — does the user flow address: empty, loading, partial, full, error states? If not, add the missing ones.
- **No undefined references** — every entity, API, or service mentioned in the feature file exists in the PRD data model or another feature file
- **Business rules are concrete** — no "appropriate validation" or "proper error handling". Specify what validation, what error message.

Fix issues before presenting. Present to user for review after each feature, or batch if they prefer.

---

## Step 3: Project Init (Phase 2)

After PRD.md and feature files are complete (and reviewed), create the project infrastructure:

### Create CLAUDE.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/claude-md.md`. Fill in:
- Project name from PRD
- References section: where things live (schema path, routes path, design tokens path — infer from tech stack, mark as placeholders if not yet implemented)
- Code conventions: infer from tech stack and any patterns mentioned in scope. Use sensible defaults.

### Create docs/STATE.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/state-md.md`. Fill in:
- Phase progress table from PRD build phases
- Feature progress table for Phase 1 features
- Next action: "Run `/gsr:build` → pick a feature from Phase 1"

### Create docs/BACKLOG.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/backlog-md.md`. Fill in:
- Deferred from Scope: everything in scope.md's v2 backlog

### Create docs/techstack.md
Use `${CLAUDE_PLUGIN_ROOT}/templates/techstack-md.md`. Fill in:
- Tech stack from scope.md
- Project-wide skills (responsive-design, etc. — based on what was identified as project-wide)
- **Gate section** — document actual commands from project configuration and create/reconcile `.gsr.json` checks per the gate skill. Preserve legacy prose; never invent stack defaults. Use the internal runner for machine evidence.

---

## Communication Rules

- **Questions go at the end.** Structure every message as: status/update first → separator (`---`) → numbered questions with options. Never bury a question inside reasoning.
- **Number all options.** Even binary choices get numbers. User should be able to reply with just a number.
- **Minimize noise.** Don't show every file write blow-by-blow. When generating multiple feature files, give one summary at the end listing all files created — not a message per file.
- **File creation communication.** Never ask "do you want to create PRD.md?" after writing it. The file exists — ask if the content is right.

---

## Iteration Protocol

The user reviews PRD.md and feature files. Common revision patterns:

- **Feature misunderstood** → rewrite that feature file, don't touch others
- **Scope changed** → update PRD.md feature index + affected feature files
- **New edge case discovered** → add to relevant feature file's Business Rules + Must-Haves
- **Don't Hand-Roll suggestion rejected** → remove from feature file, don't argue

Continue the already authorized sequence; user feedback adjusts it. Wait only at explicitly requested review boundaries.

---

## Iron Law Enforcement

Red flags:

| Thought | Reality |
|---------|---------|
| "I'll put the schema in PRD.md for reference" | No. PRD is product-only. Schema lives in code. |
| "This phase is a bit abstract but I'll demo sentence it anyway" | No. If you can't demo it, restructure the phase. |
| "A saved Skills table proves use" | Load actual relevant guidance; record observations in existing Task Context/plan sections, not invented usage. |
| "I'll create the infrastructure before the user reviews PRD" | Self-review first; user review pauses only when requested or a consequential product decision remains. |
| "The must-haves are too obvious to write" | Write them. They're the verification contract. |
