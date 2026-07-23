# GSR — Backlog

Open topics, questions, and ideas for discussion. Anyone can add items or respond.

---

## Open Topics (Need Decision)

## Ideas / To Discuss

### Superpowers-Inspired: Deep Scope Mode (One Question Per Turn)

**Context:** Superpowers enforces one question per message during brainstorming, creating a slower, more Socratic dialogue. GSR batches 2-3 questions per turn for speed. For complex or ambiguous products, batching can gloss over things that slower pacing would surface.

**Proposal:** Opt-in "deep scope" mode at the start of `/gsr:scope`. Decision gate: "Quick scope (batched questions, faster) or Deep scope (one at a time, more thorough)?" Default stays batched; deep mode for complex/ambiguous products.

---

### Superpowers-Inspired: Plan Self-Review Before Handoff

**Context:** Superpowers has a `plan-document-reviewer-prompt.md` — a mandatory automated review of plans before they're handed to an agent or user. Catches: vague steps, missing file paths, placeholder instructions ("add appropriate error handling"), tasks that are too large (>5 min), missing done-when criteria.

**Proposal:** Add a plan self-review gate to GSR's systematic build mode (Mode B). Before presenting the task list to the user, run a self-check: every task has a concrete done-when criterion, no vague instructions, file paths are exact, no "similar to task N" shortcuts.

---

### Superpowers-Inspired: Finishing a Branch Skill

**Context:** Superpowers has a dedicated `finishing-a-development-branch` skill covering: verify tests pass, present merge options (squash/merge/rebase), clean up the branch, update changelog. GSR has no explicit branch completion flow — after verify PASS, the user is on their own.

**Proposal:** Add a `/gsr:ship` command (or extend `/gsr:verify` phase completion) that walks through: final verification, changelog entry, merge options with recommendation, branch cleanup.

---

### Superpowers-Inspired: Requesting and Receiving Code Review as Skills

**Context:** Superpowers has two dedicated skills — `requesting-code-review` (how to present work for review, pre-review checklist) and `receiving-code-review` (how to process feedback without being defensive, what to fix vs. push back on). GSR has a `code-review.md` pattern doc but no skill-level enforcement.

**Proposal:** Promote GSR's code review pattern to a full skill invoked during build, with a pre-review checklist (did you self-review? is the scope bounded? are tests passing?) and a feedback-processing protocol.

---

### Superpowers-Inspired: Writing Skills Framework (Meta-Skill)

**Context:** Superpowers has a `writing-skills` skill — a framework for creating new skills, including persuasion principles, best practices, and a testing protocol using subagents. GSR has no mechanism for users to extend it with custom skills.

**Proposal:** Add a `/gsr:new-skill` command or `writing-skills` skill that guides users through creating project-specific skills (e.g., a "Supabase patterns" skill or "our API conventions" skill) that get loaded at build time alongside marketplace skills.

### Terminal Visual Polish — Catch Up with GSD

**Context:** First user feedback (April 2026, vibe coder building imposition tool) directly compared GSR and GSD visual experience in the terminal. GSD has custom terminal rendering: colors, interactive option selectors, styled progress indicators, custom UI components. User said: "GSD robi niestety lepiej: kolorki, czytelny flow odpowiadania na pytania, daje 3 opcje lub wpisujesz swoją." and "UI mógłby być przyjaźniejszy."

**What GSD does that GSR can't (today):**
- Colored text output (section headers, warnings, success messages)
- Custom interactive option pickers (not just plan mode)
- Styled progress bars during agent work
- Visual grouping of question blocks with distinct styling
- Numbered option cards with click-to-select

**What GSR can do within Claude Code (implemented in v0.2 feedback fixes):**
- Decision gate pattern (plan mode with clickable options)
- Numbered questions with markdown formatting
- Visual separators (`---`) between reasoning and questions
- Tables instead of walls of text
- Shorter messages with less inline reasoning

**Gap:** Even with all Claude Code formatting tricks, GSR will look like a markdown terminal app. GSD looks like a custom TUI. This is a fundamental trade-off of being a Claude Code plugin (zero custom infra, low barrier to entry, works everywhere Claude Code works) vs. a standalone tool (full control over rendering, but much higher development cost).

**Future options to explore:**
1. Claude Code custom rendering API — if Anthropic ever exposes richer terminal output (ANSI colors, custom components), adopt immediately
2. Companion TUI wrapper — a thin shell around Claude Code that intercepts GSR output and applies styling (risky: fragile, version-dependent)
3. Claude Code hooks for output formatting — hooks currently trigger on tool calls; if they ever support output post-processing, use for styling
4. Accept the gap — focus on information architecture (what we show and when) rather than visual polish. A well-structured plain message beats a pretty but noisy one.

**Why this matters:** For vibe coders (non-technical users), visual clarity is not cosmetic — it's functional. They scan, not read. Colors and structure help them find decisions faster. This directly impacts the "user in control" promise.

---

### Capability Research (July 2026): Visual Verification Tier

**Context:** Feature files already contain executable test scripts in prose — User Story/Flow steps + States table. Claude Code can drive a browser (Playwright MCP / Chrome extension) and read screenshots natively. Meanwhile user-1's build ended in a runtime crash ("Cannot read properties of undefined") that build-gate + grep could never catch.

**Proposal:** New verification tier between Grep and Human: GSR opens the dev server, walks the feature file's user flow step by step, screenshots each state (empty/loading/error/full), and checks against the States table. Demo sentence becomes machine-checkable. Human checks shrink to genuine judgment calls (aesthetics, feel). Evidence format: screenshot + step log per pin ID. This is the biggest possible deepening of "evidence, not hope" — no SDD competitor verifies against the spec's *user flow*.

**Status:** ✅ Accepted (2026-07-23) → Ticket T12 in [plans/2026-07-23-adaptive-gsr.md](plans/2026-07-23-adaptive-gsr.md)

---

### Capability Research (July 2026): Enforcement as Code (Hooks, not Prose)

**Context:** Iron Laws are enforced by prose — rationalization tables that cost context and can still be rationalized past. Claude Code hooks now support decision control (`decision: "block"`) and Stop hooks can inspect the transcript.

**Proposal:** Deterministic enforcement layer: (1) PreToolUse hook blocks `git commit` when the gate function hasn't run since last edit (tracked via a bridge file); (2) Stop hook greps the final message for Red Flag Language ("should work", "looks good") without accompanying evidence format and injects a correction prompt. "Enforce, don't hope" stops being an instruction and becomes infrastructure. Prose tables stay as the explanation; hooks become the guarantee.

**Status:** ✅ Accepted (2026-07-23) → Ticket T9 in [plans/2026-07-23-adaptive-gsr.md](plans/2026-07-23-adaptive-gsr.md)

---

### Capability Research (July 2026): Batch Build + PushNotification = "Decyduj z telefonu"

**Context:** Batch mode exists, but the PM must babysit the terminal waiting for decision gates. Claude Code now has PushNotification, claude.ai/code web/mobile sessions, and agent teams.

**Proposal:** In batch mode, when a decision gate fires, send a push notification with the AskUserQuestion options; the PM answers from their phone, build continues. The flow becomes: PM starts batch build, walks away, gets pinged only for product decisions. This is the purest possible expression of "human thinks, AI executes" — and a demo-killer feature for the PM audience no competitor has.

**Status:** ✅ Accepted (2026-07-23) → Ticket T10 in [plans/2026-07-23-adaptive-gsr.md](plans/2026-07-23-adaptive-gsr.md)

---

### Capability Research (July 2026): Runtime Monitors During Build

**Context:** Plugins can now declare background monitors — a shell command whose stdout streams to Claude as notifications for the whole session. The runtime smoke test today is a one-shot check.

**Proposal:** During `/gsr:build`, register the dev server (or test watcher) as a monitor. Claude sees runtime errors *the moment they happen* — a crash during creative mode gets caught mid-build instead of at verify. Optionally a CI monitor watching `gh run watch` after push.

---

### Capability Research (July 2026): CI Verify + Pin-Driven Changelog

**Context:** Pins are a join key from spec → commit → test, but verification runs only interactively. Claude Code runs headless (Agent SDK / GitHub Actions); commits already carry pin IDs; the GSR repo itself uses git-cliff.

**Proposal:** (1) `gsr-verify` GitHub Action: on PR, run the spec-drift + pin-coverage checks headlessly, post the pinned evidence report as a PR comment — spec drift becomes visible in code review, which is the enterprise/team story (OpenSpec's niche, but with real evidence). (2) `/gsr:ship` extension: generate feature-level release notes from pin-tagged commits ("dashboard.T1–T4 shipped, dashboard.D2 confirmed"). Traceability from idea to release note.

---

### Capability Research (July 2026): Native Memory Bridge

**Context:** Claude Code now has automatic memory (personal, per-user). GSR's Learned Rules are project-level and git-shared. Without a defined relationship, corrections split-brain between the two stores.

**Proposal:** Define the contract: Learned Rules = team truth (git, reviewed), auto-memory = personal observations. On session start (or during the Learned Rules ask), GSR offers to promote relevant personal memories into CLAUDE.md Learned Rules. Corrections compound *across the team*, not just across sessions — the market gap none of the SDD tools address (all are single-player).

---

### Capability Research (July 2026): Spec Import — GSR as the Verification Layer

**Context:** Spec-driven development went mainstream (Spec Kit ~80k stars, Kiro, BMAD, OpenSpec). Teams already *have* specs in these formats. GSR's unique piece is not spec authoring — it's pins + evidence-based verification of specs.

**Proposal:** Extend `/gsr:learn` to recognize and import foreign spec formats (Spec Kit specs/constitution, Kiro specs, plain PRDs) into pinned feature files. Positioning: "bring your spec, GSR makes it verifiable." Rides the SDD wave instead of competing with it head-on.

---

## Resolved (moved to decisions.md)

- Update notifications → implemented via statusline (shows `GSR v0.x.x → v0.y.y available` passively) — shipped in v0.2.x
- #1 CLAUDE.md + skills setup → Decision 12 (superseded by Decision 32: skills matched at build time)
- #2 Naming → Get Shit Right (GSR)
- #3 Command surface → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md). 5 commands: `/gsr:scope`, `/gsr:prd`, `/gsr:build`, `/gsr:verify`, `/gsr:learn`
- #5 Start B details → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md) (Decision 17: `/gsr:learn` mechanism) + Decision 24 (assessment criteria: foundations + feature clarity, deferred foundations with hard gate)
- #4 Done signals → Decision 16 (per-feature) + Decision 23 (project-level: all phases PASS + backlog triaged)
- #6 Sweep parallelization → [Plugin Design Doc](plans/2026-03-15-gsr-plugin-design.md) (Decision 18: subagents) + Decision 25 (file-level partitioning, two-phase execution)
- Agent definitions → `agents/implementer.md`, `agents/reviewer.md`, `agents/researcher.md`
- Partial GSR setup handling → `skills/learn/SKILL.md` Step 3 (handles no setup / partial / full)
