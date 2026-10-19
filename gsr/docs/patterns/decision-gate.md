# Decision Gate Pattern

**Use for unresolved consequential product choices or real permission boundaries. Existing authorization and settled answers take precedence.**

## When to use

Any time the user must pick between 2+ options before you can proceed: feature
prioritization, scope-changing phase ordering or consequential architecture tradeoffs. Routine technical choices, internal mode/weight/plan/skill preparation and already authorized execution do not need gates. Continue independent authorized work while waiting. Host permission requests use the host approval mechanism.

## Protocol

Use the available structured question tool for actual unresolved choices, or a concise conversational question if unavailable. Respect tool limits. Rules:

1. 2–4 options. If you have more, collapse the weakest.
2. Always include a recommendation: make it the FIRST option and append
   "(Recommended)" to its label. The description must carry the concrete reason
   ("avoids a Phase 2 blocker"), never "it's simpler".
3. Each option: short label (1–5 words) + description stating what it means and
   its key tradeoff — product impact and technical impact in one sentence each
   when relevant (Design Principle 10).
4. One decision per question. Independent decisions may share one AskUserQuestion
   call (within host question limits); dependent decisions must be sequential.
5. **Product-decision gates get a deferral option** (when a safe temporary default exists): label "Not sure yet — defer", description "GSR takes
   a sensible default and records it as an assumption (D-pin) to confirm later."
   On selection, follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/deferred-decisions.md`.
6. The user can always answer via "Other" with free text — treat that as the
   answer, not as a deviation.
7. After the choice: confirm in one line, then execute. No re-litigation.
