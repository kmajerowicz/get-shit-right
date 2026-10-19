---
name: preview
description: 'Prepare a bounded product demonstration within GSR scope/build when the user asks to see a feature before implementation or a concrete flow, visual, interaction or technical uncertainty needs evidence. Skip clear copy fixes, status-only and routine features with established patterns. Preserve diagram-only, show-and-wait and implementation limits.'
user-invocable: false
disable-model-invocation: false
---

# Product preview inside the current task

1. Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md` and the current
   feature/scope, actual affected product and user constraints. A focused feature is
   sufficient without PRD/STATE. Reuse current findings/tools; do not repeat intake.
2. Name the question or explicit demonstration request. Choose the smallest useful
   flow, representative screen, interaction or synthetic technical experiment. No
   mode questionnaire or regex classifier; no requirement to generate every form.
   Plan-only stays planning, diagram-only produces no code. A clear correction skips
   preview. `--sketch` remains a separate engineering artifact.
3. Use available installed relevant guidance/tools. Reuse existing styles/components;
   standalone HTML is suitable for a new-project screen without dependencies. Inspect
   actual artifacts and their opening path; use a text flow when Mermaid is unavailable.
   Observe claimed interactions visually when browser tooling exists. Without it label
   the missing observation and provide the actual local artifact/opening instructions.
4. Save the bounded record with `${CLAUDE_PLUGIN_ROOT}/templates/preview-record-md.md`.
   State functioning vs simulated behavior and uncovered storage/payment/services.
   Do not present generated UI as verified backend behavior or a finished application.
5. Present what the user can judge, the meaningful limit and the result/open choice.
   Honor show-and-wait; silence is not variant selection. Explicit feedback updates
   authoritative affected requirements/decisions with source/date/history. Keep one
   decision owner and valid deferrals; a successful test does not confirm a D-pin.
6. Before further authorized build, reconcile current requirements/decisions/artifacts
   and record reuse/adapt/discard with a reason and mocks to replace. Continue in scope
   without renewed start approval; later review-only stops product edits. Save the
   ordinary stage handoff with at most six initial refs, current variant and cadence;
   Next step stays scope/build as applicable, never a new preview enum. No automatic
   session reset, publication, real payment, production write or installation.
