# Bounded feature handoff

A sufficient contract supports the next safe authorized step. It does not establish
completion or authority. Read the current request, existing feature/task document,
actual code and constraints before filling gaps. Reuse a sufficient existing spec;
no full PRD, global scope or retroactive product rewrite is required for an existing
product feature. Quick corrections and read-only/planning requests need no feature
scaffolding. Follow their requested operation.

For nontrivial features use `DOC_ROOT/features/<slug>.md`, with the existing feature
template. Keep IDs, source/decision provenance and existing content. Record objective,
observable done-when requirements, user flow, applicable states, edge cases, integration
points, dependencies, constraints/out-of-scope work and relevant check/behavioral needs.
The optional Task Context includes authorization source/date and requested review
cadence; it is a summary and never overrides later user instructions. Actual user
intent determines whether planning/build is authorized, not a Markdown field.

Missing routine facts: inspect code/supplied answers and fill them within scope. Mark
inapplicable states with a reason rather than inventing mandatory behaviors. Missing
consequential choice: preserve it as unresolved; ask only when needed for the next
step. Valid deferred decisions keep their recorded default/severity and are revisited
only when new evidence makes the choice actionable. Do not silently decide prices,
formats or new product scope. A pending pin is allowed at first verification.

Optional `lib/task-handoff.js` exports `reference(project, value)` and
`inspectFeature(project, value)`. References are DOC_ROOT-relative, optionally have
`#Section`, or explicitly use `@project/src/file`. Project-prefix legacy references
also work. Reject absolute/traversal/escaping symlink/directory references. The
helper observes structural sections (Purpose, User Story / Flow, Must-Haves), detects
missing files/ambiguous Markdown, and always returns `needsAgentReview: true`.
`context-present` is not a ready/verified flag: placeholders, unresolved decisions,
incorrect assumptions and actual integration adequacy still need agent inspection.
Do not execute Markdown or infer permission from regex/content shape.

Before build/delegation, explain only meaningful unresolved choices and pass the
bounded contract plus file boundaries/checks. Use the existing plan for execution;
keep its headings/table so progress normalization remains valid. STATE holds one
Active Task/navigation summary. Feature/research/plan requirements remain fingerprint
inputs; do not hide them in excluded administrative STATE to keep green.
