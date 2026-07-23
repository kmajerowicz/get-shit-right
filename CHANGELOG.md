# Changelog

All notable changes to GSR are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Conventional Commits](https://www.conventionalcommits.org/). New sections are
generated from commit messages by `npm run release` (see [docs/internal/releasing.md](docs/internal/releasing.md)).

<!-- GSR:RELEASES — new versions are inserted directly below this line by `npm run release`. Do not hand-edit generated sections; fix the commit message and regenerate. Entries below 0.2.9 are hand-curated history. -->

## [0.3.0] — 2026-07-23

### Added

- **patterns:** Decision gates via AskUserQuestion, retire plan-mode picker
- **pins:** Deferred decisions — D-pins, assumptions ledger, revisit checkpoints
- **commands:** /gsr:quick — bounded tasks with invariants, zero ceremony

### Fixed

- **hooks:** Session-start reads cwd from stdin JSON, not CLAUDE_CWD
- **agents:** Frontmatter-driven model dispatch, drop stale hardcoded model IDs

## [0.2.12] — 2026-06-06

### Added

- Changelog, release, and commit-lint pipeline

### Fixed

- **statusline:** Hide update badge immediately after gsr:update
- **scope:** Create STATE.md stub after scope completes

---

## [0.2.9] — 2026-05-11

### Added
- **Pins** — every must-have in a feature file now gets a stable ID: `<feature>.T<n>` (Truths), `.A<n>` (Artifacts), `.K<n>` (Key Links). Append-only, never renumbered. Use pin IDs in commits, test descriptions, code comments, debug sessions, and verification reports as a stable join key between spec and code.
- PRD Constraints section — project-wide rules get `<project>.C<n>` IDs; feature files reference them by ID so every feature knows which product rules it must respect.
- Pin Coverage table in `STATE.md` — one row per pin across all verified features, updated automatically on every PASS.
- Check 6 in `/gsr:verify`: **Spec Drift** — greps `src/` and `tests/` for each pin ID; any pin with zero references is flagged as a blocker.
- **Acceptance Coverage** summary in verification reports — per-category counts of verified vs. unverified pins. PASS requires `unverified = 0`.

### Changed
- Verification report tables now carry an ID column throughout (Truths, Artifacts, Key Links all show pin IDs).
- `SPEC_PASS` from reviewer-spec now requires a **pin map** — concrete `file:line` for each pin ID instead of a prose summary.
- Must-Haves block in feature files replaced with structured pin tables (backwards compatible: pre-pin specs run the legacy 4-tier verification flow).
- On PASS, `/gsr:verify` flips pin statuses in the feature file (`pending` → `done` / `accepted`) and upserts the STATE.md Pin Coverage table.

---

## [0.2.8] — 2026-05-05

### Changed
- Systematic build plans saved to `docs/plans/` are now surfaced on session start — running `/gsr:build` after `/clear` lists active plans and offers resume.

---

## [0.2.7] — 2026-04-19

### Added
- Model-aware subagent dispatch — GSR selects the right Claude tier per agent role automatically (heavier models for spec review, lighter models for mechanical tasks).
- Reasoning-phase banner shown when a heavy-thinking step is in progress.

---

## [0.2.6] — 2026-04-18

### Added
- `/gsr:debug` — persistent debug sessions saved to `docs/debug/<date>-<slug>.md`. Records symptom, reproduction steps, hypothesis, evidence, and eliminated causes. Survives `/clear`; run `/gsr:debug` again to list active sessions and resume. Build skill invokes it automatically when something breaks mid-feature.
- Systematic build plans — task table with pass/fail criteria, saved to `docs/plans/` and written atomically at each step.
- `/gsr:build --sketch` — design sketch gate before mode selection: approach, file map, data shape, risks, and out-of-scope. Fires automatically for features with ambiguity markers (`TBD`, missing criteria, >3 cross-feature deps). Silent for clean specs.

### Changed
- Code review split into two staged agents: **reviewer-spec** (spec compliance gate) runs first; **reviewer-quality** (code quality) runs only after spec passes. Spec failures stop the build before quality is evaluated.

---

## [0.2.5] — 2026-04-17

### Added
- PRD Review Mode in `/gsr:verify` — validates a feature spec before build starts; flags missing acceptance criteria, ambiguous states, and gaps before any code is written.
- Infrastructure pre-check in `/gsr:build` — confirms required files exist before starting a build.
- Backlog item capture integrated into build flow — deferred items are written to `BACKLOG.md` during the build, not just at verify time.

---

## [0.2.4] — 2026-04-03

### Changed
- Evidence format improvements — verification output is more structured and easier to parse.
- Spec self-review step added to build flow before handoff to reviewer agents.
- Hardened red-flag language in reviewer prompts.
- `/gsr:status` now shows session manifest and a suggested next command.

---

## [0.2.2] — 2026-04-02

### Added
- User feedback archive from v0.1.x sessions incorporated as Learned Rules.

### Fixed
- Status line no longer shows stale `gsr:scope` suggestion after scope is already complete.
- Visual output pre-filter in build prevents large diffs from bloating context.
- `doc root detection` in `/gsr:learn` handles non-standard project layouts.
- `STATE.md` update in `/gsr:scope` on completion.

---

## [0.2.1] — 2026-04-02

### Fixed
- Status line showing stale `gsr:scope` after scope was already complete.
- `/gsr:scope` entry point detection after running `/gsr:learn` first.

---

## [0.2.0] — 2026-04-02

### Added
- `/gsr:status` — shows current phase, feature progress, next action, active debug sessions, and in-progress plans.
- `/gsr:feedback` — log bug reports, feature requests, and change requests to `BACKLOG.md`.

### Changed
- 19 improvements based on feedback from the first two users (UX language, flow clarity, error handling, edge cases).

---

## [0.1.1] — 2026-04-01

### Fixed
- Duplicate hooks error on install — removed redundant `hooks` field from `plugin.json`.
- Plugin structure — moved plugin into `gsr/` subdirectory; all internal paths use `${CLAUDE_PLUGIN_ROOT}`.

---

## [0.1.0] — 2026-04-01

Initial release.

- `/gsr:scope` — 7-step scope shaping: vision intake, competitive mapping, prioritization, feature deep-dives, consistency audit.
- `/gsr:prd` — generates PRD, feature files, CLAUDE.md, STATE.md, BACKLOG.md; matches marketplace skills per feature.
- `/gsr:build` — creative mode (human reviews every diff, corrections saved to CLAUDE.md Learned Rules) and systematic mode (agent-driven task list with evidence).
- `/gsr:verify` — 4-tier evidence ladder: automated, grep, tests, human.
- `/gsr:learn` — indexes an existing codebase, populates CLAUDE.md, and recommends next step.
- `/gsr:update` — pulls latest version and reinstalls hooks.
- Status line hook — model, current focus, project name, context bar, update badge.
- Context monitor hook — warns Claude when context is low so it finishes cleanly.
