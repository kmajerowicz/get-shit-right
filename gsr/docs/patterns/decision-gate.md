# Decision Gate Pattern

**Use this whenever you present the user with multiple options to choose from.**

## When to use

Any time the user must pick between 2+ options before you can proceed: feature
prioritization, phase ordering, architecture tradeoffs, mode selection,
prerequisite warnings, backlog triage. NOT for simple yes/no confirmations —
those stay conversational. Every decision gate in every GSR skill routes through
this pattern — always AskUserQuestion, never a hand-rolled numbered list.

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
