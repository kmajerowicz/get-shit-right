# Get Shit Right (GSR)

[![Release](https://img.shields.io/github/v/release/kmajerowicz/get-shit-right?label=release&sort=semver)](https://github.com/kmajerowicz/get-shit-right/releases)

A Claude Code plugin — an enforced instruction package with protocols and actions that fire exactly when the workflow says so. PRD-first, human-in-the-loop.

**One sentence:** The human makes all product decisions. The system tracks progress and enforces quality.

**What's new:** Pins — stable IDs on every must-have, turning your spec into a traceability matrix across code, commits, tests, and verification reports. Full history in the [changelog](CHANGELOG.md) and [releases](https://github.com/kmajerowicz/get-shit-right/releases).

---

## Why GSR

Building apps with Claude Code works. But without structure, you end up with:
- Product decisions made by the AI mid-build
- No record of what was built or why
- Corrections in session 3 that repeat in session 7
- "Should work" instead of verified evidence

GSR fixes this with a lightweight workflow: scope your idea, generate a PRD, build feature by feature, verify against criteria. Every correction compounds. Every decision is documented. Human stays in control.

---

## Install

```bash
claude plugin marketplace add https://github.com/kmajerowicz/get-shit-right
claude plugin install gsr
```

Or clone and install locally:

```bash
git clone https://github.com/kmajerowicz/get-shit-right
claude plugin marketplace add ./get-shit-right
claude plugin install gsr
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `/gsr:scope` | Shape an idea or existing materials into a structured scope document |
| `/gsr:prd` | Turn scope into PRD + feature files + project infrastructure |
| `/gsr:build` | Build a specific feature — creative (you review every diff) or systematic (agent-driven) |
| `/gsr:build --sketch` | Force a design sketch before mode selection — useful for conceptually risky features |
| `/gsr:debug` | Start or resume a persistent debug session that survives `/clear` |
| `/gsr:verify` | Verify a feature or phase with evidence — build passes, grep results, human checks |
| `/gsr:learn` | Index an existing codebase, populate CLAUDE.md, and get told what to do next |
| `/gsr:feedback` | Log a bug report, feature request, or change request to BACKLOG.md |
| `/gsr:status` | Show current phase, feature progress, next action, active debug sessions, and in-progress plans |
| `/gsr:update` | Update GSR to the latest version and reinstall hooks |

Each command tells you what to run next. Context clears between commands — state lives in files.

---

## Three Ways to Start

### Start A: You have an idea
```
/gsr:scope → /gsr:prd → /gsr:build → /gsr:verify
```

### Start B: You have materials (brief, notes, partial spec)
```
/gsr:learn → /gsr:scope (if gaps) or /gsr:prd → /gsr:build → /gsr:verify
```

### Start C: You have a running product, want to add a feature
```
/gsr:learn → /gsr:build → /gsr:verify
```

---

## How It Works

### Scope Shaping (`/gsr:scope`)
7-step process: vision intake → competitive mapping → first draft → prioritization → feature deep-dives → consistency audit → final review. Surfaces edge cases, "don't hand-roll" opportunities, and known pitfalls before a line of code is written.

### PRD Generation (`/gsr:prd`)
Turns scope into:
- `docs/PRD.md` — condensed product knowledge (200-300 lines, pure product — no schemas, no routes) with a **Constraints** section: project-wide rules each get a stable ID (`<project>.C1`, `C2`...) that feature files reference by ID
- `docs/features/*.md` — one file per feature with: user flow, states, business rules, and a **pinned must-haves table** (see Pins below)
- `CLAUDE.md` — technical instruction manual
- `docs/STATE.md` — progress tracker + Pin Coverage table
- `docs/BACKLOG.md` — deferred work

Also runs a "don't hand-roll" sweep per feature. Skills are matched at build time (Step 3.5) — not stored in feature files.

### Build (`/gsr:build`)
Pick a feature, pick a mode:

**Creative mode** (UI, design-sensitive work): You review every diff. Every correction gets asked "add to CLAUDE.md Learned Rules?" — so it never repeats. Corrections compound across sessions.

**Systematic mode** (testing, i18n, accessibility, hardening): Claude generates a task list with pass/fail criteria. You approve. Agents execute. Atomic commits with evidence. The plan is saved to `docs/plans/` — if you hit `/clear` mid-build, running `/gsr:build` again surfaces active plans and offers resume.

Both modes enforce the gate function before every completion claim: build passes, TS clean, lint passes. Never "should work."

**Model-aware dispatch:** GSR selects the right Claude tier per agent role automatically — heavier models for reasoning-heavy phases, lighter models for bounded tasks.

### When things break (`/gsr:debug`)

Run `/gsr:debug` when something stops working and you need to track the investigation. GSR creates a file at `docs/debug/<date>-<slug>.md` that records the symptom, reproduction steps, current hypothesis, evidence, and eliminated causes. Each phase transition writes to disk.

If you hit `/clear` mid-investigation: run `/gsr:debug` again — it lists active sessions and offers resume. If you're inside a build and something breaks, the build skill will invoke `/gsr:debug` automatically and hand back to the build flow when the session resolves.

**Optional rigor:** `/gsr:debug` fires only when invoked. Clean builds never see it.

### When things are fuzzy (`/gsr:build --sketch`)

Before mode selection, GSR can propose a short design sketch for the feature: approach, file map, data shape, what could break, out of scope. It fires automatically when a feature file has ambiguity markers (`TBD`, missing acceptance criteria, >3 cross-feature dependencies). For clean feature files, it's silent.

To force the gate regardless: `/gsr:build --sketch`. To skip it in one click: "Skip — I know what I'm building." Approved sketches are appended to the feature file as a dated section — no separate file.

**Optional rigor:** gets heavier only when the feature warrants it.

### Pins — Spec-to-Code Traceability

Every must-have in a feature file gets a stable ID called a **pin**:

| Category | Format | Meaning |
|----------|--------|---------|
| Truths | `dashboard.T1`, `T2`... | Observable behaviors the user can verify |
| Artifacts | `dashboard.A1`, `A2`... | Files that must exist with real implementation |
| Key Links | `dashboard.K1`, `K2`... | Critical imports, calls, and wiring |

PRD-level constraints get project-wide IDs (`<project>.C1`, `C2`...) that feature files reference — so every feature knows which product rules it must respect.

**Deferred decisions get their own category: D-pins.** When you can't answer a product question yet, GSR takes a sensible default, assigns `<project>.D1`, `D2`... and records it in the PRD's Assumptions Ledger instead of blocking. Lifecycle: `assumed` → `confirmed` or `revised` — GSR brings it back once you have a working prototype to judge it against, never before. Deferred ≠ delegated: you still make the call, just when you have evidence for it.

Pins are **append-only and never renumbered**. Once assigned, a pin ID is a stable join key you can use anywhere:
- In commit messages (`feat(dashboard): implement dashboard.T1 — user can view metrics`)
- In test descriptions (`it('dashboard.T1: user can view metrics', ...)`)
- In code comments (`// dashboard.K1: wired via router.tsx`)
- In debug sessions (which pin broke and why)
- In verification reports (per-ID evidence and status)

Pin status lifecycle: `pending` → `done` (command/test evidence) → `accepted` (human sign-off in `/gsr:verify`).

STATE.md keeps a **Pin Coverage table** — one row per pin across all verified features, updated automatically on every PASS.

### Verification (`/gsr:verify`)
4-tier evidence ladder:
1. Automated — build, TypeScript, lint
2. Grep — anti-pattern sweep, key links, artifact checks
3. Tests — test suite execution
4. Human — only what Claude genuinely can't verify

For pinned specs, verification runs 6 checks:
1. Build gate (automated)
2. TypeScript clean (automated)
3. Lint clean (automated)
4. Grep sweep (anti-patterns, artifact existence, key links)
5. Test suite
6. **Spec Drift** — for each pin ID, grep `src/` and `tests/` for references; any pin with zero references is flagged

The report carries ID columns throughout: every Truth, Artifact, and Key Link row is stamped with its pin ID. An **Acceptance Coverage** summary counts verified vs. unverified per category — PASS requires `unverified = 0`.

On PASS: pin statuses in the feature file flip to `done` / `accepted`, and STATE.md Pin Coverage table is updated.

For pre-pin specs (no IDs in must-haves), verification runs the legacy 4-tier flow — backwards compatible.

Blockers must be resolved. Minors go to BACKLOG.md.

---

## What Your Project Looks Like After GSR

```
your-project/
├── CLAUDE.md                  # Technical instruction manual + Learned Rules
├── docs/
│   ├── PRD.md                 # Product knowledge (what, for whom, why) + Constraint IDs (C1, C2…) + Assumptions Ledger (D1, D2…)
│   ├── scope.md               # Original vision (historical after PRD)
│   ├── techstack.md           # Stack + project-wide skills
│   ├── features/
│   │   ├── dashboard.md       # Spec with pinned must-haves: dashboard.T1, .A1, .K1…
│   │   ├── onboarding.md
│   │   └── ...
│   ├── debug/
│   │   └── 2026-04-18-auth-token-undefined.md   # Active debug session (survives /clear)
│   ├── plans/
│   │   └── 2026-04-18-dashboard.md              # Systematic build plan (resumes after /clear)
│   ├── STATE.md               # Phase + feature progress + Pin Coverage table
│   └── BACKLOG.md             # Deferred work
└── src/                       # Code = source of truth for implementation
```

Documents describe **what and why**. Code describes **how**. Pin IDs connect the two — a stable join key from spec to commit to test to verification report.

---

## Design Principles

1. **Human thinks, AI executes** — Product decisions are made by the human. Always.
2. **Corrections compound** — CLAUDE.md Learned Rules grow with every correction. No fresh-context executors that repeat your mistakes.
3. **PRD is the constitution** — Every task traces back to a feature file.
4. **Evidence, not hope** — Every completion claim requires a command output. "Build passes (0 errors)" not "should work."
5. **Docs for product, code for implementation** — Documents reference code, never duplicate it.
6. **Explain every choice** — When presenting a decision, always explain options, product impact, and technical impact. Empower the user to decide.

---

## Hooks

GSR includes two terminal hooks that install automatically on first session start:

**Status line** — shows model, current focus, project name, context usage bar, and an update badge when a new version is available.

**Context monitor** — warns Claude (not you) when context is running low, so it finishes the current task cleanly before running out.

To install manually:

```bash
node ~/.claude/plugins/marketplaces/gsr/gsr/hooks/install.js
```

Restart Claude Code after installing.

## Updates

When a new version of GSR is available, the status line shows `⬆ /gsr:update`. Run that command to pull the latest version and reinstall hooks.

---

## Requirements

- Claude Code installed
- Git repository

---

## Author

Kacper Majerowicz & Marcin Jarota
