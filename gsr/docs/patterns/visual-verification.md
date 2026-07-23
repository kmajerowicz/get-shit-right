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
