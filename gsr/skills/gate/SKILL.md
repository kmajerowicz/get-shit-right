---
name: gsr-gate
description: Run the GSR gate function — build, type-check, lint, runtime smoke — and report in the evidence format. Use before ANY claim that code is done or working, in any GSR project.
---

# GSR Gate Function

The single source of truth for "done" in a GSR project. Every skill that claims
completion (`build`, `verify`, `debug`, `quick`) runs this before saying so.

## Gate commands

Read `docs/techstack.md` for a `## Gate` section listing this project's exact
commands. If none is recorded, default to:
1. `npm run build` (or equivalent) → must pass with 0 errors
2. `npx tsc --noEmit` → must report 0 TypeScript errors
3. Lint if configured → must pass

## Runtime smoke test

If the feature has a critical path (file processing, data transformation, API
call, PDF generation, etc.), verify it actually runs:
- Write and run a minimal test/script that exercises the critical path
- If it's a UI feature, verify the dev server renders without console errors
- Build clean ≠ works correctly. A TypeScript-clean app can still crash at
  runtime on `undefined` property access, missing imports, or wrong data shapes.

## If any check fails

Fix it. Then run all checks again. Only then claim done.

## Evidence format

```
✅ npm run build → Exit 0, 0 errors → "Build passes"
✅ npx tsc --noEmit → Exit 0 → "TypeScript clean"
✅ [critical path test] → [output] → "[what it proves]"
```

- `✅` = check passed with evidence
- `❌` = check failed — blocker
- `⚠️` = check found a minor issue — not blocking
- Always show the actual command, actual output summary, then the claim.

## Banned completion phrases (Red Flag Language)

- "should work", "should pass" → run the command, show the output
- "probably works", "likely fine" → run the command, show the output
- "seems correct", "seems to work" → run the command, show the output
- "looks good", "I believe this passes" → run the command, show the output
- "Done!" / "All done!" → show evidence first, then state completion
- "It works" → show what command proved it works

If you catch yourself reaching for hedging language, you haven't verified. Run
the gate function.
