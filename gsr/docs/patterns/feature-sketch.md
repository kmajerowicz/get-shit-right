# Feature Sketch Pattern

**A lightweight design checkpoint that fires before implementation when a feature is ambiguous. Keeps the build from starting on a shaky foundation.**

---

## Overview

A sketch is not a PRD and not a task list. It is a 15-25 line alignment artifact that answers: "Do we agree on what we're building and how?" It lives in the feature file, not in a separate doc.

Prepare a sketch when heuristics indicate material uncertainty, or when `--sketch` requests the artifact. Heuristics never create automatic approval gates. If neither condition applies, it is silent — the build proceeds to Step 3 without any prompt.

---

## Heuristic — When to Fire

Inspect whether a sketch would help if **any** of these are true in the feature file:

1. **Fewer than 3 concrete states** — the feature file mentions fewer than 3 of: empty, loading, error, success, offline, partial
2. **No acceptance criteria** — no done-when language, no explicit acceptance criteria, no verifiable must-haves
3. **Explicit ambiguity markers** — `TBD`, `?`, or `decide during build` appear anywhere in the file
4. **High cross-feature coupling** — feature declares dependencies on more than 3 other features

If none trigger and `--sketch` was not passed: skip silently. Do not prompt. Do not mention the gate.

---

## Override

`/gsr:build --sketch` requests sketch preparation regardless of what the heuristic finds. Use case: the feature file looks clean but the builder knows it's conceptually risky in ways the heuristic can't see.

---

## Sketch Contents

Keep it to 15-25 lines. Every element is mandatory:

**Approach** — one paragraph. What is being built and how. The key design decision in plain language.

**File map** — what files to add and what files to change. Not exhaustive — just the load-bearing ones.

**Data shape** — only if the feature handles data (reads/writes state, calls an API, transforms input). Skip if purely presentational.

**What could break** — one line. The single most likely integration failure or regression risk.

**Out of scope** — explicit list. What a reasonable person might expect this feature to include but won't. Prevents scope creep mid-build.

---

## Flow

1. Inspect relevant risks using supplied context and prepare a sketch where useful.
2. Append it to DOC_ROOT/features/<name>.md under `## Build Sketch — <YYYY-MM-DD>` when within authorized work; no separate file is needed.
3. Proceed under existing implementation authorization. If planning-only, finish with the artifact. Ask only for an unresolved consequential product choice, or pause at an explicitly requested sketch review boundary. A sketch request alone does not imply a second approval.

## Why the Feature File

Keeping the sketch in the feature file means there is one place to read the full context of a feature: its requirements AND the design decisions made before building it. A separate file creates a two-file lookup problem and tends to get forgotten after the build.
