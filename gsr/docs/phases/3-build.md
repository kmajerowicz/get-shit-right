# Phase 3: Build

**Creative/systematic techniques are selected internally; no compulsory mode prompt. Use the requested feature/phase and honor explicit review cadence. Features are grouped into PRD build phases.**

---

## Early product demonstration

For an explicit early view or material product uncertainty use the internal preview
skill within scope/build, per `${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md`.
Preserve diagram-only/preview-only and show-and-wait; no new public stage or flag.
Before full build record reuse/adapt/discard and replace mocks. Clear corrections skip
preview. Engineering --sketch remains independent. Preview approval is not verified
backend behavior or acceptance of every requirement.

## Mode A: Creative Build (human-in-the-loop)

**When:** UI components, screens, interactions, design-sensitive features — anything the user will see and judge.

### How
1. User gives a small, scoped task: "Build the dashboard (see `docs/features/dashboard.md`)"
2. System reads the feature file → loads project-wide skills from `techstack.md` → feature-specific skills matched dynamically in Step 3.5
3. Claude reads CLAUDE.md (conventions, references, learned rules)
4. Plan mode if >2 files, direct implementation otherwise
   - Plans follow the structured format in `docs/patterns/plan-execution.md` — file map first, then task breakdown with checkpoints. Existing execution authorization covers the plan; pause only for explicitly requested review or unresolved consequential choices.
5. Honor explicitly requested chunk/diff review; otherwise continue reversible work and perform relevant available behavioral checks
6. Record relevant corrections in Learned Rules within authorized work without routine confirmation
7. Atomic commit only if commits are authorized
8. STATE.md auto-updates (task count incremented)

### Rules
- Claude always says "done, test it" or "still need X" — never "should work"
- Before verification claims: applicable configured checks pass with fresh evidence; separately report behavioral coverage and human acceptance
- Skills are enforced by the workflow (loaded from feature file), not by Claude remembering a rule
- Before committing, Claude highlights key review points from the code review checklist (`docs/patterns/code-review.md`) — focusing on integration safety and what the user should manually verify

### Mini-verification per task
Run applicable checks through `node "${CLAUDE_PLUGIN_ROOT}/scripts/run-checks.js" --cwd "<canonical-project-root>"`, optionally using a documented configured `--profile`. Discover the project/DOC_ROOT and read validated `.gsr.json` per the gate skill. No npm/tsc defaults. Record actual result/freshness and relevant runtime/browser observations. Repair failures in scope or report unavailable coverage. Reuse prior evidence only after freshness reconciliation; unrelated docs edits do not universally require full application checks.

### Debugging
When a bug or unexpected behavior occurs during build, switch to the systematic debugging process (see `docs/patterns/systematic-debugging.md`). Resume normal build flow after the fix is verified.

---

## Mode B: Systematic Build (agent-driven with verification)

**When:** Testing, i18n, accessibility, security hardening, performance — anything with clear pass/fail criteria and no design judgment.

### How
1. User describes the systematic task
2. Claude generates task list with pass/fail criteria
   - Task lists follow the plan execution protocol in `docs/patterns/plan-execution.md` — including file map and checkpoint after each task.
3. Prepare the task list and proceed under existing execution authorization; planning-only remains planning-only
4. Claude executes tasks (parallelizable where independent)
5. Atomic commit per task only when authorized
6. Verification report with grep-based evidence
7. User acceptance remains separate; pause at requested review boundaries

### Rules
- Agent reads CLAUDE.md and all accumulated corrections before starting
- If agent encounters ambiguity requiring product judgment → stops and asks, never decides autonomously
- Verification is evidence-based: grep results, test output, build status
- Subagents follow the role separation and status protocol defined in `docs/patterns/subagent-patterns.md`. Each task dispatched to an implementer subagent includes full context handoff. In systematic mode, a reviewer subagent checks each implementer's output before the commit using the code review checklist (`docs/patterns/code-review.md`) covering spec compliance, integration safety, convention adherence, and regression risk.

### Mini-verification per task
Run applicable checks through `node "${CLAUDE_PLUGIN_ROOT}/scripts/run-checks.js" --cwd "<canonical-project-root>"`, optionally using a documented configured `--profile`. Discover the project/DOC_ROOT and read validated `.gsr.json` per the gate skill. No npm/tsc defaults. Record actual result/freshness and relevant runtime/browser observations. Repair failures in scope or report unavailable coverage. Reuse prior evidence only after freshness reconciliation; unrelated docs edits do not universally require full application checks.

### Debugging
When a bug or unexpected behavior occurs during build, switch to the systematic debugging process (see `docs/patterns/systematic-debugging.md`). Resume normal build flow after the fix is verified.

---

## Task Classification Heuristic

If the task requires taste, empathy, or design judgment → creative (Mode A).
If it has clear pass/fail criteria and no design judgment → systematic (Mode B).

| Task Type | Mode | Why |
|-----------|------|-----|
| UI components | Creative | Taste, design quality |
| Screen layouts | Creative | Information density, feel |
| New features (first time) | Creative | Product decisions |
| Bug fixes | Creative | Root cause needs context |
| Testing | Systematic | Clear pass/fail |
| i18n | Systematic | Mechanical extraction |
| Accessibility | Systematic | Checklist-based |
| Security hardening | Systematic | Checklist-based |
| Refactoring | Systematic; honor requested review | Pattern-based with meaningful regression checks |

---

## Parallelization

Independent systematic tasks can run in parallel via multiple agents. All parallel agents share the same CLAUDE.md context — they run concurrently but with the same instruction manual and accumulated corrections. Parallel subagents follow the dispatch patterns in `docs/patterns/subagent-patterns.md`. Each gets independent context — no shared state between parallel agents except CLAUDE.md conventions.

Specific parallelization opportunities:
- Independent systematic tasks in sweep mode
- Verification checks (grep, tests, build — all independent)
