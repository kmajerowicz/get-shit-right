# Adaptive GSR — executable plan (v0.3 → v0.5)

**Date:** 2026-07-23
**Status:** approved — Kacper accepted staging + Tier 1 additions (visual verification, enforcement hooks, batch push) on 2026-07-23
**Owner:** Kacper
**Author:** Claude (concept + technical audit, July 2026)
**Concept rationale:** see git history of this file (first version) + `gsr/docs/backlog.md` "Capability Research (July 2026)" entries

---

## Execution rules for the implementing model

Read this section before touching anything. These rules are binding.

1. **One ticket = one commit.** Commit message format is given per ticket. This repo
   enforces Conventional Commits (`scripts/check-commit-msg.js`).
2. **After every ticket run `npm run check`** — it must exit 0 before you commit.
3. **Edit anchors:** each ticket gives `FIND:` snippets that exist verbatim in the
   target file. If a `FIND:` snippet does not match, STOP and report — do not guess
   an alternative location.
4. **Never renumber or reorder existing pins, laws, or table rows** unless the ticket
   explicitly says to replace them.
5. **Never edit `CHANGELOG.md` by hand** — `npm run release` (run by Kacper) handles it.
6. **Do not do work a ticket doesn't ask for.** No drive-by refactors, no comment
   sweeps, no formatting changes outside the edited region.
7. Tickets within a release are **ordered by dependency** — execute top to bottom.
8. If anything is ambiguous, report `NEEDS_CONTEXT: [specific question]` and stop
   that ticket. Do not improvise product behavior.

---

## Concept recap (context for the executor — 10 lines)

GSR's soul is **rigor**: evidence before "done", human owns every product decision,
pins give spec→code traceability. GSR's problem is **rigidity**: it demands answers
before the user has evidence to answer, has one speed for all project sizes, and its
option-picking UX predates the native `AskUserQuestion` tool. This plan:

- **v0.3 "Flexibility core"** — deferred decisions (D-pins), native question UX,
  `/gsr:quick`, and two P0 bug fixes.
- **v0.4 "Weight + enforcement"** — a rigor dial (spike/standard/production) threaded
  through every skill, and Iron Laws enforced by hooks instead of prose.
- **v0.5 "Evidence & ambient"** — visual flow verification in the browser, batch push
  notifications, micro-skill extraction.

Identity guardrails are at the end of this file. They override everything.

---

# Release 0.3.0 — Flexibility core

## T1 — fix: session-start hook never detects the project (P0)

**Goal:** `gsr/hooks/session-start` currently reads `process.env.CLAUDE_CWD` (not a
real variable) and runs with `cwd` = plugin root (because hooks.json does
`cd ${CLAUDE_PLUGIN_ROOT}`). Result: project state injection never fires. Fix: read
`cwd` from the stdin JSON that SessionStart hooks receive (same technique as
`gsr-context-monitor.js`).

**Files:** `gsr/hooks/session-start`, `gsr/hooks/hooks.json`

**Steps:**

1. In `gsr/hooks/session-start`, replace the line:
   ```
   FIND:    const cwd = process.env.CLAUDE_CWD || process.cwd();
   ```
   and restructure the file so ALL existing logic (auto-install block, GSR project
   detection, output) moves into a `main(data)` function. New top of file after the
   requires:

   ```js
   let input = '';
   const stdinTimeout = setTimeout(() => main({}), 2000);
   process.stdin.setEncoding('utf8');
   process.stdin.on('data', c => (input += c));
   process.stdin.on('end', () => {
     clearTimeout(stdinTimeout);
     let data = {};
     try { data = JSON.parse(input); } catch (e) { /* fall through */ }
     main(data);
   });

   function main(data) {
     const cwd = data.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
     // ... entire existing body, unchanged, using this `cwd` ...
   }
   ```
   Do not change any of the detection/output logic itself — only where `cwd` comes
   from and the stdin wrapper.

2. In `gsr/hooks/hooks.json`, replace the command:
   ```
   FIND:    "command": "cd ${CLAUDE_PLUGIN_ROOT} && node hooks/session-start",
   REPLACE: "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/session-start\"",
   ```
   (Removes the `cd` — it was both the cwd trap and a PowerShell 5 incompatibility.)

3. Add `node --check gsr/hooks/session-start` to the `check:js` script in
   `package.json` (append with `&&`).

**Done when:**
- `echo '{"cwd":"/tmp/gsr-fixture"}' | node gsr/hooks/session-start` — with
  `/tmp/gsr-fixture/docs/STATE.md` present (create a throwaway fixture) — prints the
  `<gsr-context>` block CONTAINING the STATE.md snippet.
- Same command with an empty fixture dir prints the generic "GSR is available" block.
- `grep -c CLAUDE_CWD gsr/hooks/session-start` → 0.
- `npm run check` → exit 0.

**Commit:** `fix(hooks): session-start reads cwd from stdin JSON, not CLAUDE_CWD`

---

## T2 — fix: agent frontmatter replaces hardcoded model IDs (P0)

**Goal:** Skills instruct passing `model: "claude-sonnet-4-6"` / `"claude-opus-4-7"`
in Agent tool calls. Those IDs are two generations stale and the documented mechanism
is agent frontmatter. Move model/role metadata into the agent files; strip the
per-call instructions.

**Files:** `gsr/agents/implementer.md`, `gsr/agents/researcher.md`,
`gsr/agents/reviewer-spec.md`, `gsr/agents/reviewer-quality.md`,
`gsr/skills/build/SKILL.md`, `gsr/skills/verification/SKILL.md`,
`gsr/skills/scope-shaping/SKILL.md`, `gsr/skills/prd-generation/SKILL.md`,
`gsr/skills/learn/SKILL.md`

**Steps:**

1. Prepend YAML frontmatter to each agent file (before the `# ` title line), and
   DELETE that file's entire `## Recommended Model` section (heading + its two
   paragraphs):

   `implementer.md`:
   ```yaml
   ---
   name: implementer
   description: Bounded task executor for GSR systematic builds. Receives a fully specified task (description, file boundaries, success criteria, CLAUDE.md conventions), implements it, runs the gate function, and reports exactly one of DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED. Never makes product decisions.
   model: sonnet
   ---
   ```

   `researcher.md`:
   ```yaml
   ---
   name: researcher
   description: Research-only agent for GSR scope and PRD phases — competitive mapping, don't-hand-roll sweeps, domain investigation, skills marketplace search. Returns structured findings with sources and confidence; implements nothing; surfaces options with tradeoffs instead of deciding.
   model: opus
   ---
   ```

   `reviewer-spec.md`:
   ```yaml
   ---
   name: reviewer-spec
   description: Stage-1 reviewer for GSR systematic builds. Checks ONE thing — does the implementation match the feature file spec. Produces a pin map (pin ID → file:line) or SPEC_FAIL. Runs before reviewer-quality; never evaluates conventions or integration.
   model: sonnet
   disallowedTools: ["Edit", "Write", "NotebookEdit"]
   ---
   ```

   `reviewer-quality.md`:
   ```yaml
   ---
   name: reviewer-quality
   description: Stage-2 reviewer for GSR systematic builds — runs only after reviewer-spec issues SPEC_PASS. Checks integration safety, CLAUDE.md convention adherence, and regression risk. Reports APPROVED / APPROVED_WITH_CONCERNS / CHANGES_REQUESTED / NEEDS_MORE_INFO.
   model: sonnet
   disallowedTools: ["Edit", "Write", "NotebookEdit"]
   ---
   ```

2. In the five skill files, replace every model-passing instruction. The canonical
   replacement sentence is:

   > Dispatch via the Agent tool with `subagent_type: "gsr:<agent-name>"` — model and
   > role come from the agent definition.

   Exact anchors (replace the whole sentence containing each FIND):
   - `build/SKILL.md`: `FIND: must pass \`model: "claude-sonnet-4-6"\`` (3 occurrences —
     implementer, reviewer-spec, reviewer-quality; keep the surrounding "read
     `${CLAUDE_PLUGIN_ROOT}/agents/<file>` for the role" references intact).
   - `verification/SKILL.md`: `FIND: must pass \`model: "claude-sonnet-4-6"\`` (1).
   - `scope-shaping/SKILL.md`: `FIND: must pass \`model: "claude-opus-4-7"\`` (1) and
     `FIND: Pass \`model: "claude-opus-4-7"\` on each Agent tool call` (1).
   - `prd-generation/SKILL.md`: `FIND: must pass \`model: "claude-opus-4-7"\`` (2).
   - `learn/SKILL.md`: `FIND: must pass \`model: "claude-opus-4-7"\`` (1).

**Done when:**
- `grep -rn "claude-sonnet-4-6\|claude-opus-4-7" gsr/` → 0 matches.
- Each of the 4 agent files starts with `---` and contains `name:`, `description:`, `model:`.
- `grep -c "Recommended Model" gsr/agents/*.md` → 0 per file.
- `npm run check` → exit 0.

**Commit:** `fix(agents): frontmatter-driven model dispatch, drop stale hardcoded model IDs`

---

## T3 — feat: decision gates use AskUserQuestion

**Goal:** Retire the plan-mode-as-option-picker hack. All decision gates use the
native AskUserQuestion tool. Every *product* decision gate additionally offers a
deferral option (wired fully in T4).

**Files:** `gsr/docs/patterns/decision-gate.md`, `gsr/skills/build/SKILL.md`,
`gsr/skills/scope-shaping/SKILL.md`, `gsr/skills/prd-generation/SKILL.md`,
`gsr/skills/verification/SKILL.md`

**Steps:**

1. Replace the FULL content of `gsr/docs/patterns/decision-gate.md` with:

   ```markdown
   # Decision Gate Pattern

   **Use this whenever you present the user with multiple options to choose from.**

   ## When to use

   Any time the user must pick between 2+ options before you can proceed: feature
   prioritization, phase ordering, architecture tradeoffs, mode selection,
   prerequisite warnings, backlog triage. NOT for simple yes/no confirmations —
   those stay conversational.

   ## Protocol

   Use the **AskUserQuestion tool**. Rules:

   1. 2–4 options. If you have more, collapse the weakest.
   2. Always include a recommendation: make it the FIRST option and append
      "(Recommended)" to its label. The description must carry the concrete reason
      ("avoids a Phase 2 blocker"), never "it's simpler".
   3. Each option: short label (1–5 words) + description stating what it means and
      its key tradeoff — product impact and technical impact in one sentence each
      when relevant (Design Principle 10).
   4. One decision per question. Independent decisions may share one AskUserQuestion
      call (up to 4 questions); dependent decisions must be sequential.
   5. **Product-decision gates get a deferral option** (not required for purely
      technical/mode choices): label "Not sure yet — defer", description "GSR takes
      a sensible default and records it as an assumption (D-pin) to confirm later."
      On selection, follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/deferred-decisions.md`.
   6. The user can always answer via "Other" with free text — treat that as the
      answer, not as a deviation.
   7. After the choice: confirm in one line, then execute. No re-litigation.
   ```

2. In the four skill files, update every reference to the old protocol:
   ```
   FIND (each occurrence):  Enter plan mode and present
   REPLACE WITH:            Present via AskUserQuestion
   ```
   and
   ```
   FIND (each occurrence):  Enter plan mode, present options with recommendation, user clicks
   REPLACE WITH:            present options via AskUserQuestion with the recommendation first
   ```
   Occurrences: `build/SKILL.md` (Step 2 prerequisite gate, Step 3 mode selection),
   `scope-shaping/SKILL.md` (Process Rules), `prd-generation/SKILL.md`
   (self-verification decisions), `verification/SKILL.md` (backlog triage).
   In `build/SKILL.md` Step 3, also delete the literal option-block prose ("User
   clicks their choice.") — the options become AskUserQuestion options with
   Creative first when the feature has UI (per the existing recommendation rule).

**Done when:**
- `grep -rn "Enter plan mode" gsr/skills gsr/docs/patterns` → 0 matches.
- `grep -c "AskUserQuestion" gsr/docs/patterns/decision-gate.md` → ≥ 3.
- `npm run check` → exit 0.

**Commit:** `feat(patterns): decision gates via AskUserQuestion, retire plan-mode picker`

---

## T4 — feat: deferred decisions (D-pins) — the core of the release

**Goal:** "I don't know yet" becomes a first-class answer everywhere. Deferrals get
stable IDs `<project>.D<n>`, live in an Assumptions Ledger, and return for
confirmation when evidence exists. This directly answers the "za mało elastyczny"
feedback.

**Files:** new `gsr/docs/patterns/deferred-decisions.md`; templates `scope-md.md`,
`prd-md.md`, `state-md.md`; skills `scope-shaping`, `prd-generation`, `build`,
`verification`; command `status.md`; `README.md`

**Steps:**

1. **Create `gsr/docs/patterns/deferred-decisions.md`:**

   ```markdown
   # Deferred Decisions Pattern (D-pins)

   A product question the user can't answer yet is NOT a gate. It becomes a tracked
   assumption that returns for confirmation when the user has evidence (usually: a
   working prototype). Deferred ≠ delegated — the human still makes the call, later.

   ## When a user defers

   Triggers: the deferral option in a decision gate, or any free-text equivalent
   ("nie wiem", "not sure yet", "you pick for now", "whatever's standard").

   Protocol — all 5 steps, then continue WITHOUT waiting:
   1. Propose a sensible default with a one-line rationale.
   2. Assign the next `<project>.D<n>` (project slug from PRD/scope; append-only,
      never renumber; check the ledger for the highest existing n).
   3. Set severity — `non-blocking` by default. Set `blocking` ONLY if a wrong
      default would force rework of already-built features (say so in one line).
      The user can override severity with one word.
   4. Append a row to the Assumptions Ledger (see below). Scope stage: ledger lives
      in scope.md. Once PRD.md exists, the ledger lives ONLY in PRD.md.
   5. Say: "Recorded as `<id>` — I'll bring it back when you can see it working."

   ## The ledger

   | ID | Assumption (default taken) | Source question | Severity | Status | Date |
   |----|---------------------------|-----------------|----------|--------|------|

   Status: `assumed` → `confirmed` | `revised`. On revision, keep the row, update
   Status, and append "→ revised: <new value> (<date>)" inside the Assumption cell.
   Rows are never deleted.

   ## Revisit checkpoints (the only places assumptions come back)

   1. **After a feature build completes** (build skill Step 4): list open
      assumptions whose area the built feature touches; one AskUserQuestion —
      confirm / revise / keep deferred. Max 3 assumptions per checkpoint; oldest
      first; never re-ask one the user just kept deferred.
   2. **`/gsr:verify`**: `blocking` + `assumed` = Blocker. Non-blocking open
      assumptions are listed in the report, never block.
   3. **`/gsr:status`**: shows the open-assumption count.

   ## Red flags

   | Thought | Reality |
   |---------|---------|
   | "The user must answer before we proceed" | They can defer. Record a D-pin, move on. |
   | "I'll just assume it and not bother them" | Unrecorded assumption = silent product decision. Record it. |
   | "I'll re-ask at the next opportunity" | Only at revisit checkpoints. Nagging kills deferral. |
   ```

2. **Templates.**
   - `gsr/templates/prd-md.md` and `gsr/templates/scope-md.md`: add a section
     `## Assumptions Ledger` containing the intro line "_Deferred decisions — see
     deferred-decisions pattern. Append-only._" and the empty ledger table from the
     pattern (header row + one example row using `<project>.D1`).
   - `gsr/templates/state-md.md`: in the header block, after the "Last Updated"
     line, add: `**Open Assumptions:** 0`
   - `gsr/templates/feature-md.md`:
     ```
     FIND:    **Constraints:** [e.g., `<project>.C1`, `<project>.C2` — or "none"]
     REPLACE: **Constraints:** [e.g., `<project>.C1`, `<project>.C2` — or "none"]
              **Assumptions touched:** [e.g., `<project>.D1` — or "none"]
     ```

3. **`scope-shaping/SKILL.md`** — three edits:

   a. Replace Iron Law 2:
   ```
   FIND:    2. **Never skip foundations.** Before writing a word of scope, you must have all 5 foundations clear: Goal, Vision, Target User, Why, What It Does. A hard gate — nothing else proceeds without them.
   REPLACE: 2. **Two foundations are hard: Goal and What It Does.** Without them there is nothing to build — do not produce scope.md until both are clear. Vision, Target User, and Why should be pursued, but the user may defer any of them — each deferred foundation becomes a D-pin with your best current guess as the default (`${CLAUDE_PLUGIN_ROOT}/docs/patterns/deferred-decisions.md`).
   ```

   b. Replace Iron Law 4:
   ```
   FIND:    4. **Ask about product parameters, never assume them.**
   REPLACE: 4. **Ask about product parameters — and accept "I don't know yet" as a full answer.**
   ```
   and append to that law's paragraph: "Every product question presents deferral as
   an explicit option. On deferral, follow the deferred-decisions pattern. The
   difference between an assumption and a D-pin: the D-pin is recorded and comes
   back for confirmation — never silently baked in."

   c. In the Red Flags table (Iron Law Enforcement section), add the row:
   ```
   | "The user must answer this before we can proceed" | They can defer. Record a D-pin and move on. |
   ```
   And in "Hard gate before producing scope.md" (Deferred Foundations Pattern):
   ```
   FIND:    All 5 foundations must be ✓ clear.
   REPLACE: Goal and What It Does must be ✓ clear; the other three must each be ✓ clear or recorded as a D-pin.
   ```

4. **`prd-generation/SKILL.md`** — two edits:
   - In Step 1's list (after item 11), add: `12. **Assumptions Ledger** — migrate
     the ledger from scope.md verbatim (same IDs), then append any new deferrals
     from PRD-stage decisions. This is now the single home of the ledger.`
   - In Step 2's Must-Haves section, append this paragraph (this also fixes the
     unpinned-examples gap from the July audit): "**Assign pin IDs as you write
     every must-have** — `<feature-slug>.T<n>` / `.A<n>` / `.K<n>` per the
     feature-md template, all with Status `pending`. A feature file without pin IDs
     in its Must-Haves tables is incomplete. If the feature depends on any D-pin,
     list it under **Assumptions touched**."

5. **`build/SKILL.md`** — two edits:
   - Step 2 (Load Feature Context), append to the numbered read list: `4. PRD.md
     Assumptions Ledger — note any D-pins listed under the feature's "Assumptions
     touched".`
   - Step 4 (STATE.md Update), insert BEFORE the "Phase completion check" block:
     ```markdown
     **Assumption revisit checkpoint:** After updating STATE.md, check the PRD
     Assumptions Ledger for rows with Status `assumed` whose area this feature
     touches. If any: present up to 3 (oldest first) via one AskUserQuestion —
     "You've now seen this working. <assumption>: confirm / revise / keep
     deferred." Update the ledger and the Open Assumptions count in STATE.md.
     Follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/deferred-decisions.md`.
     ```

6. **`verification/SKILL.md`** — one edit. After Check 6 (Spec Drift), add:
   ```markdown
   ### Check 7: Assumptions (Tier 1 — Ledger read)
   Read the PRD Assumptions Ledger. For each row with Status `assumed`:
   - Severity `blocking` → **Blocker** ("Open blocking assumption <id> — confirm or
     revise before PASS").
   - Severity `non-blocking` → list in the report under "Open assumptions" — never
     blocks.
   On PASS, if the user confirmed any assumption during Step 4 human checks, flip
   its Status to `confirmed` with today's date.
   ```

7. **`commands/status.md`** — in the structured report, after the `### Blockers`
   section, add:
   ```markdown
   ### Open Assumptions
   [Count + IDs of ledger rows with Status `assumed` from PRD.md, oldest first,
   e.g. "2 open: project.D1 (paper sizes), project.D3 (pricing tier)". If PRD.md
   or the ledger is missing, write "None."]
   ```

8. **`README.md`** — in the Pins section, after the pin-category table, add one
   paragraph introducing D-pins (deferred decisions, lifecycle
   `assumed → confirmed/revised`, revisit-on-evidence) mirroring the pattern doc's
   first paragraph. Also add `<project>.D1` to the "What Your Project Looks Like"
   PRD.md comment line.

**Done when:**
- `gsr/docs/patterns/deferred-decisions.md` exists;
  `grep -l "deferred-decisions" gsr/skills/*/SKILL.md` lists scope-shaping AND build.
- `grep -c "Assumptions Ledger" gsr/templates/prd-md.md gsr/templates/scope-md.md` → ≥1 each.
- `grep -c "D-pin\|\.D<n>\|\.D1" gsr/skills/scope-shaping/SKILL.md` → ≥ 2.
- `grep -c "Never skip foundations" gsr/skills/scope-shaping/SKILL.md` → 0.
- `npm run check` → exit 0.

**Commit:** `feat(pins): deferred decisions — D-pins, assumptions ledger, revisit checkpoints`

---

## T5 — feat: /gsr:quick

**Goal:** GSR guarantees without ceremony, for the 80% of work that is small. Works
even in projects with zero GSR artifacts.

**Files:** new `gsr/commands/quick.md`, new `gsr/skills/quick/SKILL.md`, `README.md`

**Steps:**

1. Create `gsr/commands/quick.md`:
   ```markdown
   You are running the `/gsr:quick` command.

   The user's task is the command argument (everything after `/gsr:quick`). If no
   argument was given, ask in one line: "What's the task?"

   No working-directory ceremony beyond: if `.gsr-session.json` exists and its
   `project_dir` differs from `pwd`, `cd` there first.

   Load and execute the quick skill: read `${CLAUDE_PLUGIN_ROOT}/skills/quick/SKILL.md`
   in full, then follow its instructions exactly.
   ```

2. Create `gsr/skills/quick/SKILL.md`:
   ```markdown
   # /gsr:quick — Quick Task Skill

   One bounded task, GSR invariants, zero ceremony. No scope, no PRD, no feature
   file, no mode selection, no skills-matching gate.

   ## Iron Laws (all invariants — no exceptions at any project weight)

   1. **Evidence before "done".** Run the gate function; use the evidence format.
      Banned phrases: "should work", "seems correct", "looks good".
   2. **Human owns product decisions.** If the task hides a product decision
      (user-visible behavior, limits, formats), surface it via the decision gate
      pattern — or record a D-pin if the user defers and a ledger exists.
   3. **Corrections compound.** On user correction: implement, then ask "Add to
      CLAUDE.md Learned Rules?"
   4. **Atomic commit** with evidence in the message.
   5. **Never reference assets that don't exist.**

   ## Flow

   1. Read CLAUDE.md if it exists (conventions + Learned Rules). Read nothing else
      upfront.
   2. Restate the task in one line; if scope is genuinely ambiguous, ask ONE
      clarifying question, else proceed.
   3. Implement in the smallest reasonable diff.
   4. Gate function: build + type-check + lint as configured for this project
      (from CLAUDE.md/package.json; default `npm run build`, `npx tsc --noEmit`,
      lint if configured). Runtime smoke test if the change has a critical path.
   5. Report with the evidence format:
      `✅ <command> → <output summary> → "<claim>"`
   6. Commit: `<type>: <task> — <evidence summary>`.
   7. If `docs/STATE.md` exists, append one line under a `## Quick Tasks` section
      (create it at the end of the file if missing): `- [<date>] <task> — <commit sha>`.
      If it doesn't exist, skip silently — quick works without GSR structure.

   ## Escalation

   If the task turns out to touch >5 files, need a product decision the user won't
   make inline, or break existing behavior: stop and say "This outgrew quick —
   recommend `/gsr:build` (or `/gsr:scope` if the product is undefined)." Never
   soldier on past the boundary.

   ## Red Flags

   | Thought | Reality |
   |---------|---------|
   | "It's quick mode, I'll skip the gate function" | Invariant. Evidence or it didn't happen. |
   | "I'll expand scope while I'm in here" | Quick = the asked task. Note extras, don't do them. |
   | "No STATE.md, so I can't work" | Quick needs nothing. Work. |
   ```

3. `README.md`: add to the Commands table (after `/gsr:build --sketch` row):
   `| \`/gsr:quick <task>\` | One bounded task with GSR guarantees (gate function, evidence, atomic commit) — no scope/PRD ceremony |`

**Done when:**
- Both files exist; `npm run check` → exit 0 (doc-links + json checks pass).
- `grep -c "gsr:quick" README.md` → ≥ 1.

**Commit:** `feat(commands): /gsr:quick — bounded tasks with invariants, zero ceremony`

---

## T6 — release 0.3.0 (run WITH Kacper)

`npm run release minor -- --publish` (per `docs/internal/releasing.md`). Verify
`npm run check` green first. Kacper reviews README diff before publish.

---

# Release 0.4.0 — Weight + enforcement as code

## T7 — feat: project weight classification

**Goal:** One rigor dial: `spike` / `standard` / `production`, set at entry,
stored in STATE.md, readable by every skill.

**Files:** new `gsr/docs/patterns/weight.md`, `gsr/templates/state-md.md`,
`gsr/skills/scope-shaping/SKILL.md`, `gsr/skills/learn/SKILL.md`, `README.md`

**Steps:**

1. Create `gsr/docs/patterns/weight.md`:

   ```markdown
   # Project Weight Pattern

   Rigor scales with stakes. Weight is set once at entry (changeable anytime),
   stored in STATE.md as `**Weight:** <value>`, and read by every skill at Step 0.

   | Weight | Meaning |
   |--------|---------|
   | `spike` | Demo, experiment, toy, learning project. Minimal ceremony. |
   | `standard` | Side project, internal tool. Default. |
   | `production` | Real users, real stakes. Full rigor. |

   ## Classification

   Infer from the conversation (words like "demo", "for my kid", "quick experiment"
   → spike; "customers", "launch", "clients" → production), then confirm with one
   AskUserQuestion — inferred value first, "(Recommended)". Never set silently.

   ## The matrix — what weight controls

   | Procedure | spike | standard | production |
   |---|---|---|---|
   | Competitive mapping (scope Step 2) | skip | offer via gate | default on |
   | Don't-hand-roll sweep | inline, no agents | 1 researcher agent | parallel agents |
   | v2 backlog | skip | only if content exists | on |
   | PRD size | 1 page max | 200–300 lines | 200–300 + full feature files |
   | Skills-matching (build Step 3.5) | auto-match, note in output, no stop | table shown, no hard stop | table + confirm gate |
   | Infra pre-check (build Step 0) | skip | ask once, don't gate | gate |
   | Sketch gate heuristic | off (--sketch only) | current heuristic | fire on ANY single heuristic condition |
   | Verification depth | gate function + assumptions check only | + grep sweeps + pins | full ladder (all checks) |
   | Questions per topic (scope) | 1 | 2–3 | full progressive flow |

   ## Invariants — NEVER scaled by weight

   Evidence format & gate function before "done" · human owns product decisions ·
   D-pin recording on deferral · atomic commits · Learned Rules capture · never
   reference nonexistent assets. These hold at `spike` exactly as at `production`.

   ## Promotion

   "Promote to production" (any phrasing) → update STATE.md, then list which
   skipped procedures now apply (from the matrix) and offer to run the gap-fill:
   competitive mapping, full verification ladder on already-built features.
   ```

2. `gsr/templates/state-md.md`: after the `**Open Assumptions:**` line (from T4),
   add: `**Weight:** standard`

3. `scope-shaping/SKILL.md`: in "Detect Entry Point", append a final step: "After
   detecting the entry point and BEFORE Step 1: classify project weight per
   `${CLAUDE_PLUGIN_ROOT}/docs/patterns/weight.md` (infer + confirm via one
   AskUserQuestion). Record it in STATE.md when STATE.md is created/updated."

4. `learn/SKILL.md`: in Step 4 assessment output, add a `### Weight` line; if
   STATE.md exists without a Weight line, classify (infer + confirm) and add it.

5. `README.md`: one short paragraph in "How It Works" intro: weight = rigor dial,
   three values, invariants never scale.

**Done when:**
- `grep -c "Weight" gsr/templates/state-md.md` → ≥ 1;
  `grep -l "patterns/weight.md" gsr/skills/*/SKILL.md` → scope-shaping + learn.
- `npm run check` → exit 0.

**Commit:** `feat(weight): project weight classification — spike/standard/production`

---

## T8 — feat: thread the weight matrix through skills + split Iron Laws

**Goal:** Skills consult weight at the exact points the matrix names. Iron Laws get
tagged `[invariant]` (absolute) or `[weight-scaled]` (procedure).

**Files:** `gsr/skills/scope-shaping/SKILL.md`, `gsr/skills/prd-generation/SKILL.md`,
`gsr/skills/build/SKILL.md`, `gsr/skills/verification/SKILL.md`

**Steps (each is an insertion at a named anchor):**

1. Every skill's Step 0 (or first step) gets: "Read `**Weight:**` from
   `docs/STATE.md` (default `standard` if absent). Weight-scaled behaviors below
   reference `${CLAUDE_PLUGIN_ROOT}/docs/patterns/weight.md`."
2. `scope-shaping` Step 2 (Competitive Mapping): prepend "**Weight:** spike → skip
   this step entirely (state one line: 'Skipping competitive research — spike
   weight'). standard → offer via decision gate. production → run by default (still
   confirm agent launch)."
3. `scope-shaping` Iron Law 5 (progressive questions): append "(spike: 1 question
   per topic)".
4. `prd-generation` Step 1: after the "200-300 lines" rule, add "(spike weight:
   1 page max — foundations, feature list, build order, ledger; skip sections 5, 8,
   9 unless content already exists)". In Step 1 list item for v2/MVP scope, add
   "(spike: no v2 backlog)".
5. `build` Step 0 Infrastructure Pre-Check: prepend "**Weight:** spike → skip this
   check. standard → ask once, proceed on any answer. production → gate as written
   below."
6. `build` Step 2.5 sketch heuristic: add "**Weight:** spike → heuristic off,
   `--sketch` flag only. production → fire if ANY single condition is true."
7. `build` Step 3.5: prepend "**Weight:** spike → auto-match, list results in one
   line, do NOT stop for confirmation. standard → show the table, proceed without a
   hard stop unless a skill needs installation. production → full verification gate
   as written below."
8. `verification` Step 2 intro: add "**Weight:** spike → run Check 1 (build gate)
   and the Assumptions check only; state 'Reduced ladder — spike weight' in the
   report. standard → Checks 1–5 + assumptions + pins. production → all checks."
9. **Iron Laws tagging** — in each skill's Iron Laws list, append to each law
   either `_[invariant]_` or `_[weight-scaled]_`:
   - build: 1 invariant, 2 invariant, 3 weight-scaled, 4 invariant, 5 invariant
   - scope: 1 invariant, 2 invariant (as rewritten in T4), 3 invariant,
     4 invariant, 5 weight-scaled, 6 invariant
   - prd: 1 invariant, 2 invariant, 3 invariant
   - verification: all invariant
   - debug, feedback, quick: all invariant (no edits needed if already implicit —
     add the tag only where a law exists).
10. In `build` Iron Law 3, soften the absolute: 
    ```
    FIND:    3. **Skills are mandatory, not optional.**
    REPLACE: 3. **Skills matching always runs; how hard it gates scales with weight.**
    ```
    (keep the rest of the law text, which now defers to Step 3.5's weight block).

**Done when:**
- `grep -c "weight" gsr/skills/build/SKILL.md` → ≥ 4 (case-insensitive);
  same grep ≥ 2 in scope/prd/verification skills.
- `grep -c "\[invariant\]\|\[weight-scaled\]" gsr/skills/build/SKILL.md` → 5.
- `npm run check` → exit 0.

**Commit:** `feat(weight): thread rigor matrix through skills, tag Iron Laws invariant vs weight-scaled`

---

## T9 — feat: enforcement hooks (Iron Laws as infrastructure)

**Goal:** Two Iron Laws stop relying on prose: (a) no commit without the gate
function having run since the last edit; (b) no ending a turn on red-flag language
without evidence. Both act only in GSR projects (`docs/STATE.md` present). The
commit guard uses `permissionDecision: "ask"` — it surfaces, never silently blocks:
the human stays in control.

**Files:** new `gsr/hooks/gsr-gate-tracker.js`, new `gsr/hooks/gsr-gate-guard.js`,
new `gsr/hooks/gsr-redflag-guard.js`, `gsr/hooks/hooks.json`,
`gsr/hooks/install.js`, `package.json`, `gsr/hooks/README.md`

**Steps:**

1. Create `gsr/hooks/gsr-gate-tracker.js` (PostToolUse — records dirty/clean state):

   ```js
   #!/usr/bin/env node
   // GSR Gate Tracker — PostToolUse. Tracks whether the gate function has run
   // since the last file mutation. Bridge consumed by gsr-gate-guard.js.
   const fs = require('fs'); const os = require('os'); const path = require('path');
   let input = '';
   const t = setTimeout(() => process.exit(0), 3000);
   process.stdin.setEncoding('utf8');
   process.stdin.on('data', c => (input += c));
   process.stdin.on('end', () => {
     clearTimeout(t);
     try {
       const data = JSON.parse(input);
       if (!data.session_id) process.exit(0);
       const cwd = data.cwd || process.cwd();
       if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
       const bridge = path.join(os.tmpdir(), `gsr-gate-${data.session_id}.json`);
       const MUTATORS = ['Edit', 'Write', 'NotebookEdit'];
       const GATE_RE = /\b(npm run build|npm test|npx tsc|pnpm (build|test)|yarn (build|test)|vitest|jest|pytest|cargo (build|test)|go (build|test)|make(\s|$))/;
       let state = { dirty: false };
       try { state = JSON.parse(fs.readFileSync(bridge, 'utf8')); } catch (e) {}
       if (MUTATORS.includes(data.tool_name)) state.dirty = true;
       else if (data.tool_name === 'Bash' && GATE_RE.test((data.tool_input && data.tool_input.command) || '')) state.dirty = false;
       fs.writeFileSync(bridge, JSON.stringify(state));
     } catch (e) { /* silent */ }
     process.exit(0);
   });
   ```

2. Create `gsr/hooks/gsr-gate-guard.js` (PreToolUse on Bash — surfaces the gate):

   ```js
   #!/usr/bin/env node
   // GSR Gate Guard — PreToolUse (Bash). If a git commit is attempted while files
   // changed since the gate function last ran, ask the user instead of proceeding
   // silently. "ask" not "deny": human stays in control.
   const fs = require('fs'); const os = require('os'); const path = require('path');
   let input = '';
   const t = setTimeout(() => process.exit(0), 3000);
   process.stdin.setEncoding('utf8');
   process.stdin.on('data', c => (input += c));
   process.stdin.on('end', () => {
     clearTimeout(t);
     try {
       const data = JSON.parse(input);
       const cmd = (data.tool_input && data.tool_input.command) || '';
       if (!data.session_id || !/\bgit\b[^\n]*\bcommit\b/.test(cmd)) process.exit(0);
       const cwd = data.cwd || process.cwd();
       if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
       const bridge = path.join(os.tmpdir(), `gsr-gate-${data.session_id}.json`);
       let state = { dirty: false };
       try { state = JSON.parse(fs.readFileSync(bridge, 'utf8')); } catch (e) {}
       if (!state.dirty) process.exit(0);
       process.stdout.write(JSON.stringify({
         hookSpecificOutput: {
           hookEventName: 'PreToolUse',
           permissionDecision: 'ask',
           permissionDecisionReason: 'GSR gate: files changed since the gate function last ran (build / type-check / tests). Run the gate first, or approve to commit anyway.'
         }
       }));
     } catch (e) { /* silent */ }
     process.exit(0);
   });
   ```

3. Create `gsr/hooks/gsr-redflag-guard.js` (Stop — blocks red-flag endings once):

   ```js
   #!/usr/bin/env node
   // GSR Red Flag Guard — Stop hook. If the final assistant message claims
   // completion using banned language with no evidence line, send Claude back
   // once to verify. stop_hook_active prevents loops.
   const fs = require('fs'); const path = require('path');
   const BANNED = /\b(should work|should pass|probably works|seems correct|seems to work|looks good|likely fine)\b/i;
   const EVIDENCE = /✅ .+→/;
   let input = '';
   const t = setTimeout(() => process.exit(0), 3000);
   process.stdin.setEncoding('utf8');
   process.stdin.on('data', c => (input += c));
   process.stdin.on('end', () => {
     clearTimeout(t);
     try {
       const data = JSON.parse(input);
       if (data.stop_hook_active) process.exit(0);
       const cwd = data.cwd || process.cwd();
       if (!fs.existsSync(path.join(cwd, 'docs', 'STATE.md'))) process.exit(0);
       if (!data.transcript_path || !fs.existsSync(data.transcript_path)) process.exit(0);
       const lines = fs.readFileSync(data.transcript_path, 'utf8').trim().split('\n');
       let lastText = '';
       for (let i = lines.length - 1; i >= 0; i--) {
         try {
           const e = JSON.parse(lines[i]);
           if (e.type === 'assistant' && e.message && Array.isArray(e.message.content)) {
             lastText = e.message.content.filter(c => c.type === 'text').map(c => c.text).join('\n');
             break;
           }
         } catch (err) { /* skip */ }
       }
       if (BANNED.test(lastText) && !EVIDENCE.test(lastText)) {
         process.stdout.write(JSON.stringify({
           decision: 'block',
           reason: 'GSR red-flag language detected ("should work"-class claim without evidence). Run the verification commands and restate the claim in the evidence format: ✅ <command> → <output> → "<claim>". If you cannot verify, say plainly what is unverified.'
         }));
       }
     } catch (e) { /* silent */ }
     process.exit(0);
   });
   ```

4. Rewrite `gsr/hooks/hooks.json` to register everything plugin-side (this also
   moves the context monitor out of user settings — P1 from the audit):

   ```json
   {
     "hooks": {
       "SessionStart": [{
         "matcher": "startup|resume|clear|compact",
         "hooks": [{ "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/session-start\"" }]
       }],
       "PostToolUse": [{
         "hooks": [
           { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/gsr-context-monitor.js\"" },
           { "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/gsr-gate-tracker.js\"" }
         ]
       }],
       "PreToolUse": [{
         "matcher": "Bash",
         "hooks": [{ "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/gsr-gate-guard.js\"" }]
       }],
       "Stop": [{
         "hooks": [{ "type": "command", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/gsr-redflag-guard.js\"" }]
       }]
     }
   }
   ```

5. Slim `gsr/hooks/install.js` to statusline-only, with consent:
   - DELETE the entire "Context monitor hook" block (lines registering PostToolUse)
     and the `gsr-context-monitor.js` entry in `hookFiles` (it no longer needs
     copying — it runs from the plugin dir via hooks.json).
   - Statusline consent: before `settings.statusLine = ...`, if an existing
     `settings.statusLine.command` exists and does NOT include `gsr-statusline` or
     `gsd-statusline`: print
     `! Existing custom status line detected — keeping it. Run with --force to replace.`
     and skip the statusLine write unless `process.argv.includes('--force')`.
   - Version stamp: when copying `gsr-statusline.js`, prepend the line
     `// gsr-hook-version: <version from ../.claude-plugin/plugin.json>` to the
     copied file content.
   - In `session-start`'s auto-install block, replace the existence check with:
     exists AND first line's version matches current plugin.json version → skip;
     otherwise run install.js (no --force).
6. Add the three new hook files to `check:js` in `package.json`.
7. Update `gsr/hooks/README.md`: document the four hook events, the bridge files,
   and that only the statusline requires installation into user settings.

**Done when:**
- Fixture tests (create `/tmp/gsr-fx/docs/STATE.md` first):
  - `echo '{"session_id":"t1","cwd":"/tmp/gsr-fx","tool_name":"Edit","tool_input":{}}' | node gsr/hooks/gsr-gate-tracker.js` then
    `echo '{"session_id":"t1","cwd":"/tmp/gsr-fx","tool_name":"Bash","tool_input":{"command":"git commit -m x"}}' | node gsr/hooks/gsr-gate-guard.js`
    → output contains `"permissionDecision":"ask"`.
  - After `echo '{"session_id":"t1","cwd":"/tmp/gsr-fx","tool_name":"Bash","tool_input":{"command":"npm run build"}}' | node gsr/hooks/gsr-gate-tracker.js`,
    the guard command above → empty output.
- `grep -c "PostToolUse" gsr/hooks/install.js` → 0.
- `npm run check` → exit 0.

**Commit:** `feat(hooks): enforcement as code — gate guard, red-flag guard, plugin-side registration`

---

## T10 — feat: batch build push notifications

**Goal:** PM starts a batch build, walks away, gets pinged only for product
decisions. Graceful degradation when no notification tool exists.

**Files:** `gsr/skills/build/SKILL.md`, `README.md`

**Steps:**

1. In `build/SKILL.md` Step 1, append to the batch-mode numbered list:
   ```markdown
   7. **Notifications (optional):** if a push/notification tool is available in
      this session (e.g. PushNotification — check the available tools; NEVER fail
      or pause because it's absent), send a short push whenever batch pauses for a
      decision ("GSR: decision needed — <topic>") and once when the batch finishes
      ("GSR: batch done — <N> features built, <M> assumptions recorded"). No
      notification tool → proceed silently, exactly as before.
   ```
2. `README.md`, Build section: one sentence after the batch description: "In batch
   mode GSR can push a notification to your phone when it needs a product decision
   or finishes — start the batch and walk away."

**Done when:** `grep -c "PushNotification" gsr/skills/build/SKILL.md` → 1;
`npm run check` → exit 0.

**Commit:** `feat(build): push notifications at batch decision gates and completion`

---

## T11 — release 0.4.0 (run WITH Kacper)

As T6. Note for release notes: enforcement hooks change `hooks.json` — users must
restart Claude Code; `/gsr:update` handles the statusline re-stamp.

---

# Release 0.5.0 — Evidence & ambient

## T12 — feat: visual flow verification (Tier 2.5)

**Goal:** Feature files already contain executable specs in prose (User Story/Flow
+ States table). When browser tooling is available, `/gsr:verify` walks the flow in
a real browser, screenshots each state, and compares against the spec. Human checks
shrink to genuine judgment calls.

**Files:** new `gsr/docs/patterns/visual-verification.md`,
`gsr/skills/verification/SKILL.md`, `README.md`

**Steps:**

1. Create `gsr/docs/patterns/visual-verification.md`:

   ```markdown
   # Visual Flow Verification Pattern

   The feature file IS the test script: User Story/Flow = steps, States table =
   expected screens, UX Description = layout intent. This pattern executes it.

   ## Preconditions (ALL required, else skip the tier)

   1. Feature has UI.
   2. Dev server can start (`npm run dev` or equivalent from techstack/CLAUDE.md).
   3. A browser-automation tool is available in the session — look for Playwright
      MCP tools (`mcp__playwright__*` or similar) or a Claude-in-Chrome/browser
      tool. If none: skip, and write in the report "Visual tier skipped — no
      browser tooling. Consider installing Playwright MCP." Then run the legacy
      human checks in full.

   ## Protocol

   1. Start the dev server in the background. Confirm readiness (wait for
      "ready"/"localhost" in output, max ~15s). If it fails to start → Blocker,
      stop the tier.
   2. Open the feature's entry URL.
   3. Walk the User Story/Flow steps IN ORDER. For each step:
      - Perform the user action described.
      - Wait for the UI to settle; capture a screenshot.
      - Capture browser console errors (any uncaught error during the step →
        record it verbatim).
      - Compare what you see against: the flow step's "System [response]", the
        States table row it corresponds to, and the UX Description.
   4. States coverage: after the happy path, deliberately reach Empty, Error, and
      Loading states where the States table defines them (e.g. reload with no
      data, submit invalid input). Screenshot each.
   5. Map each verified step to Truth pins where the step demonstrates one — this
      feeds the Truths table in the report (`PASS` with evidence
      "visual: step N, screenshot").

   ## Verdicts

   | Finding | Verdict |
   |---------|---------|
   | Action does nothing / crashes / console uncaught error | Blocker |
   | Observed behavior contradicts flow step or States row | Blocker |
   | State missing that the States table defines | Blocker |
   | Layout/spacing/copy doubt, aesthetic judgment | Human check |

   ## Output

   | Step | Action | Expected (spec) | Observed | Verdict |

   Screenshots: reference them inline in the report; do not commit them to the
   repo. Console errors: quote verbatim under the table.

   ## Rules

   - Never mark a step PASS from code reading — this tier exists to observe the
     running app. If you cannot perform an action with the tooling, say so and
     route that step to Human.
   - Stop the dev server when the tier completes.
   ```

2. `verification/SKILL.md`: insert after Check 7 (Assumptions, from T4):
   ```markdown
   ### Check 8: Visual Flow Verification (Tier 2.5 — Browser; UI features only)
   Run per `${CLAUDE_PLUGIN_ROOT}/docs/patterns/visual-verification.md` when its
   preconditions hold (UI feature + dev server + browser tooling available).
   Weight: spike → skip. Its Blockers are Blockers; its judgment items go to the
   Step 4 human checklist.
   ```
   And in Step 4 (Present Report + Human Checks), append: "If Check 8 ran, the
   human checklist contains ONLY judgment items (look & feel, copy tone, aesthetic
   fit) — never 'does it work' items the visual tier already proved or failed."

3. `README.md`: in the Verification section's tier list, insert between Grep and
   Tests: "2.5. **Visual** — when browser tooling is available, GSR walks the
   feature's user flow in a real browser, screenshots each state, and verifies the
   spec's States table against reality."

**Done when:**
- Pattern file exists; `grep -c "visual-verification" gsr/skills/verification/SKILL.md` → 1.
- `grep -c "Check 8" gsr/skills/verification/SKILL.md` → ≥ 1.
- `npm run check` → exit 0.

**Commit:** `feat(verify): visual flow verification tier — the feature file becomes an executable spec`

---

## T13 — feat: micro-skills + frontmatter (ambient GSR)

**Goal:** The methodology stops being locked inside commands. Skills get real
frontmatter (discoverable, model-invocable); the gate function and evidence format
live in ONE place; remaining P2 audit items land.

**Files:** all `gsr/skills/*/SKILL.md`, new `gsr/skills/gate/SKILL.md`,
`gsr/templates/techstack-md.md`, `gsr/skills/build/SKILL.md`,
`gsr/skills/verification/SKILL.md`, `gsr/skills/debug/SKILL.md`, `gsr/commands/*.md`

**Steps:**

1. **Frontmatter for every existing SKILL.md** (name + one-line description with
   trigger conditions; e.g. for build: `name: gsr-build`, description "Build a
   feature from a GSR feature file — creative or systematic mode. Use when
   implementing features in a project with docs/PRD.md."). Verify afterwards in
   `/plugin` that no name collides with the `gsr:` commands; if Claude Code
   registers both, prefix skill names with `gsr-` (as shown) to avoid collision.
2. **Extract the gate function** into `gsr/skills/gate/SKILL.md`
   (`name: gsr-gate`, description: "Run the GSR gate function — build, type-check,
   lint, runtime smoke — and report in the evidence format. Use before ANY claim
   that code is done or working, in any GSR project."). Content: the gate steps +
   evidence format + red-flag table, sourced from build/SKILL.md's "Required gate
   function" section. Gate commands: read from `docs/techstack.md` "Gate" section
   if present, else npm defaults.
3. `gsr/templates/techstack-md.md`: add a `## Gate` section —
   "Commands GSR runs before any completion claim:" with a default list
   (`npm run build`, `npx tsc --noEmit`, lint) to be replaced per-project at init.
   `prd-generation/SKILL.md` Step 3: fill the Gate section from the detected stack
   (non-Node stacks get their real equivalents). This closes the "npm-only gate"
   audit gap.
4. Replace the duplicated gate-function text in `build`, `verification`, `debug`,
   and `quick` skills with: "Run the gate per `${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md`
   (single source of truth)." Keep each skill's evidence-format EXAMPLE lines
   (they teach the format in context).
5. Commands frontmatter: add `description:` (one line, user-facing) to every file
   in `gsr/commands/` and `argument-hint: <task>` to `quick.md`, `argument-hint:
   [resume <slug>]` to `debug.md`, `argument-hint: [--sketch]` to `build.md`.
6. Hook unit tests (P2): create `scripts/test-hooks.js` using `node:test` — pipe
   fixture stdin JSON through session-start, gate-tracker, gate-guard,
   redflag-guard (fixtures in `scripts/fixtures/`); add `check:hooks` to
   package.json `check`.

**Done when:**
- `grep -L "^---" gsr/skills/*/SKILL.md` → empty (all have frontmatter).
- `grep -rn "npx tsc --noEmit" gsr/skills/ | grep -v "skills/gate/" | wc -l` → only
  example lines remain (≤ 4), no duplicated procedure blocks.
- `node scripts/test-hooks.js` → all tests pass; `npm run check` → exit 0.

**Commit:** `feat(skills): frontmatter + gate extraction — ambient GSR, single source of truth`

---

## T14 — release 0.5.0 (run WITH Kacper)

As T6. After this release, update `gsr/docs/vision.md` (add Principle 13 and the
weight/D-pin concepts) and mark the stale status in
`gsr/docs/plans/2026-04-17-phase-1-reliability-core.md` (its tickets shipped).

---

## Identity guardrails (override everything above)

- **One sentence stays:** the human makes all product decisions. Deferral changes
  *when*, never *who*. If any ticket implementation would let GSR decide a product
  question silently, the implementation is wrong — stop and report.
- **Evidence culture is absolute at every weight.** No ticket may introduce a path
  where "done" is claimed without the evidence format.
- **Flexibility is always an explicit, recorded user choice.** GSR may offer to
  skip; it never silently skips (the one exception: spike-weight skips that were
  chosen when the user set the weight — announce them in one line when they occur).
- **Pins are append-only. Always.** T/A/K/C/D — same grammar, same rule.

## Ticket → file index

| Ticket | Touches |
|---|---|
| T1 | hooks/session-start, hooks/hooks.json, package.json |
| T2 | agents/*.md (4), skills: build, verification, scope, prd, learn |
| T3 | patterns/decision-gate.md, skills: build, scope, prd, verification |
| T4 | patterns/deferred-decisions.md (new), templates: scope/prd/state/feature, skills: scope, prd, build, verification; commands/status.md; README |
| T5 | commands/quick.md (new), skills/quick/SKILL.md (new), README |
| T7 | patterns/weight.md (new), templates/state-md.md, skills: scope, learn; README |
| T8 | skills: scope, prd, build, verification |
| T9 | hooks: gsr-gate-tracker.js, gsr-gate-guard.js, gsr-redflag-guard.js (new), hooks.json, install.js, hooks/README.md, package.json |
| T10 | skills/build/SKILL.md, README |
| T12 | patterns/visual-verification.md (new), skills/verification/SKILL.md, README |
| T13 | all skills, skills/gate (new), templates/techstack-md.md, commands/*, scripts/test-hooks.js (new) |
