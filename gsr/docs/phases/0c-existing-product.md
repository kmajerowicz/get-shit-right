# Start C: Existing Product

**Introduces GSR into an existing product for building new features or developing functionality.**

---

## When to Use

- You have a running product (codebase exists, users exist)
- You want to add a new feature or improve an existing one
- You want GSR practices (human-in-the-loop, feature files, skills, verification) for this work
- You don't need to rewrite the full PRD for the entire product

---

## Flow

```
Bounded affected-area assessment → Focused Feature Scope/File → fresh-context Build → fresh-context Verify
```

---

## Step 1: Codebase Onboarding

Inspect the affected existing functionality first, reusing current docs and conventions. Expand only for concrete integration uncertainty; no whole-product index or installation claim follows from a focused request. Direct learn remains indexing only; a broader authorized task carries its assessment into focused preparation.

### What happens
1. Resolve canonical project/DOC_ROOT using shared discovery and validated `.gsr.json`; never follow a stale session manifest silently or create a parallel `docs/` tree.
2. Inspect affected source/tests, direct integrations and relevant existing docs/conventions. Small corrections use quick and need neither onboarding nor feature scaffolding.
3. Read service configuration only as relevant, without revealing secrets. Missing credentials limit affected checks; provisioning, installation, paid services and deployment remain separate authority boundaries.
4. Create/update only genuinely needed missing CLAUDE/techstack/STATE/spec documents within the authorized task, preserving useful content and Learned Rules. No empty mandatory BACKLOG/feature catalog or full PRD retrofit.
5. Return a bounded assessment with actual observed scope, references, integration gaps and check path. Standalone learn stops here and may recommend the next action; it never implements the feature.

### What it produces

Relevant existing documentation is preserved. For a nontrivial broader authorized feature, the contract lives at `DOC_ROOT/features/<slug>.md`; needed conventions/checks and one Active Task summary may be added. Missing full PRD/STATE is not a feature-build blocker. Documentation paths use resolved DOC_ROOT, including `.ai`.

### Adaptive, not prescriptive
- If the project already has good documentation → read it, reference it, don't duplicate
- If CLAUDE.md already exists → extend it with GSR conventions, don't overwrite
- If the project has a different docs structure → adapt, don't force GSR layout

### GSR Adoption is Gradual
After onboarding, GSR is available but doesn't change the existing product. Feature files are created one at a time as new work comes in. No need to document all existing features retroactively.

---

## Step 2: Feature Scope

Use scope skill Start C and `docs/patterns/task-handoff.md` for one focused feature. Extract supplied answers and actual code first; no full-product scope/PRD or repeated feature/weight/mode choice. Missing consequential choices remain human-owned, with valid deferrals retained.

### Project foundations at feature level
- **Goal** — what does this feature achieve? What problem does it solve?
- **Vision** — what does it look like when it works?
- **Target user** — who uses this feature? (may be a subset of the product's users)
- **Why** — why are we building this now? What changes?
- **What it does** — what does the feature actually do? (high level)

### What's different from Phase 0 (full product scope)
- No navigation architecture (product already has one)
- No full data model (extends existing model)
- No competitive mapping (unless the feature is a differentiator)
- Shorter — scoping a feature is faster than scoping a product
- Must understand **how this feature fits into the existing product** — interactions with existing features, impact on existing UX

### Edge case checklist still applies
- What happens when it's empty?
- What happens when it's optional?
- What cascading effects on existing features?
- What's the migration path for existing users?

### Research areas still triaged
Same three tiers (blocking scope / blocking feature file / blocking build), but typically fewer items since the product stack is already known.

---

## Step 3: Feature File

Create/reconcile `DOC_ROOT/features/<feature-name>.md` using the existing feature template; reuse a sufficient existing spec, omit nonexistent PRD links and preserve IDs/wording. Include:

- Feature name, purpose, user flow
- Applicable states and edge cases; mark inapplicable states with a reason instead of inventing behavior
- Business rules and edge cases
- Data needs at conceptual level
- UX description (layout intent, key interactions)
- **Must-haves** (Truths, Artifacts, Key Links — same as Phase 1 feature files)
- **Don't Hand-Roll** (if relevant — proven solutions to use instead of building)
- **Known Pitfalls** (if relevant — common mistakes for this type of feature)
- Optional **Task Context** — objective/done-when, constraints, authorization source/date, explicit review cadence, affected areas, next action and applicable research/skill references
- Decision log (choices + rationale)
- **Integration points** — how this feature connects to existing features (extra section for Start C)
- Related features (links to other feature files if they exist)

### Skills matching
Load relevant available installed guidance first when preparing/building the feature. Selection is not installation permission; no compulsory marketplace search. Research only material uncertainties and report essential unavailable capability without fabricating readiness.

---

## Step 4: Build

At completed preparation, save the focused contract/exact build action and recommend `/clear`, then **"dalej"**. The user resets context; GSR loads the saved next bounded stage without reapproval. Existing `/gsr:build features/<slug>.md` or `/gsr:build <slug>` remain optional direct controls.

Build reads the sufficient focused contract and affected code, plus relevant CLAUDE/techstack/STATE if present. No full PRD/STATE is required. Preserve explicit review cadence and later narrower instructions; choose internal execution technique without a mode selector. Long builds use checked partial checkpoints with truthful remaining progress and a saved continuation.

---

## Step 5: Verify

Save the completed-build handoff to focused verification, recommending `/clear`, then "dalej". Verify the feature must-haves using meaningful applicable configured checks through the shared runner; never invent npm/TypeScript defaults for a Python CLI. Static, runtime/browser and human acceptance observations stay separate. Unavailable checks and non-Git freshness limits remain explicit.

Additional check for Start C: **verify integration with existing features** — does the new feature break anything? Do existing flows still work?

Code review is especially important for Start C. The integration safety dimension of the code review pattern (`docs/patterns/code-review.md`) expands for existing products — checking existing user flows, shared components, data model compatibility, and auth patterns.

---

## GSR Grows With the Product

Each new feature gets its own feature file. Over time:
- `DOC_ROOT/features/` fills up → self-documenting product
- `CLAUDE.md` Learned Rules grow → Claude gets better at this codebase
- `DOC_ROOT/STATE.md` tracks progress across features
- New team members read feature files to understand the product

No need to create a full PRD retroactively. The feature files ARE the product documentation, built incrementally.
