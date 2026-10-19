# Coordination contract

The user supplies the desired outcome; GSR chooses the next useful bounded stage
from current intent and inspected files. Use one optional `/gsr:start [outcome | continue]`
entry and the model-selectable coordinate skill. Explicit commands remain direct scoped
controls. No mandatory expertise/mode/weight/skill selector. No new workflow runtime,
host-wide prompt interception, paid evaluation or autonomous session lifecycle.

Priority: latest explicit operation/constraints → task/step references → reconciled current
files and evidence → ordinary defaults. Old summaries cannot override a later request.
Planning-only stays planning. A task question normally steers work; only an actual new
request replaces it. Do not classify authorization by substrings. Ambiguous targets require
one necessary question; clear supplied choices do not need another approval.

## Routes

- Direct command: its requested skill only; unfinished work does not authorize auto-build.
- Explanation/review/planning: inspect/plan, stop at that artifact; no product edits.
- Small correction: quick, proportionate checks; no intake/research/scaffolding/reset.
- Authorized repair: debug then actual relevant verification.
- Existing-product feature: bounded indexing → sufficient focused spec → fresh-context
  build/verify; sufficient existing spec skips repeated scoping. No whole PRD needed.
- New product/materials: scope → PRD/feature preparation → build/verify when authorized,
  preserving major-stage fresh-context boundaries and supplied foundations.
- Saved continuation: read current Active Task/refs/minimum inputs, reconcile file/evidence
  state, resume the saved bounded action with original limits and explicit cadence.

Prepare missing routine context from actual code/supplied facts; preserve valid deferrals.
Only new consequential choices/real capability or permission boundaries pause affected
work. Installed skill loading, plan preparation and ordinary checks need no extra approval.

## Product preview route

For an explicit "show it before building" request or a concrete flow/visual/interaction/
technical uncertainty, load `${CLAUDE_PLUGIN_ROOT}/skills/preview/SKILL.md` and follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/product-preview.md`. Choose one useful demonstration
from actual uncertainty; skip clear corrections and ordinary work with established
patterns unless requested. Goal and main action are enough to start a bounded preview
before full PRD. A focused existing-product feature needs no whole-product PRD.
Planning-only stays planning; diagram-only creates no application code; preview-only
is not full implementation. Preserve show-and-wait across resets. Reuse settled inputs,
record observations vs simulations and update only affected requirements from feedback.
Do not introduce a public preview command/flag or make --sketch request a prototype.

## Status-only and focused work

Explicit/current feature → reconciled Active Task → actual spec/remaining work precede
legacy phase/scope defaults. A focused spec works without PRD/STATE; missing navigation
is reported, not a restart. Read decisions from their owning PRD/scope or focused feature
Open Decisions, following migration references; absent ledger means unknown, not none.
Status reads current evidence without executing checks or the saved next action. Separate
implemented progress from stale/unavailable verification. See the status command for the
read-only report contract.

## Handoff across contexts

Keep one current Active Task summary with objective/constraints, task/spec/plan refs,
authorization source, requested cadence, completed versus remaining work, open choices,
actual run/navigation refs/limits and the exact next stage/action/minimum read set. Source
requirements stay in feature/research/plan documents. Failing/stale/unavailable results stay
honest; a saved summary neither proves behavior nor authorizes further scope.

Finish the bounded stage, save the packet, recommend `/clear` followed by **dalej**.
No interactive user message/work is created by SessionStart. On the next user turn load the
coordinate guidance, resolve the saved task and expand reads only for a concrete gap.
The packet is a pointer/start summary, not a replay of all research/chat/project docs.
Checked and unfinished long-build checkpoints retain their true in-progress status.
Explicit per-chunk review survives resets; it is separate from a context hygiene boundary.

## Host contract and evidence

Claude plugin skills are listed by description; `user-invocable: false` hides the
coordinate skill from the public command menu while permitting model invocation.
The only new public command is `/gsr:start` in commands/start.md. Native SessionStart
can add context after clear; interactive continuation still needs the user's message.
Official contracts checked 2026-10-13: [skills](https://code.claude.com/docs/en/skills),
[hooks](https://code.claude.com/docs/en/hooks#sessionstart). Installed discovery/metadata
and startup delivery tests do not establish model route choice or actual bare **dalej**
behavior. Record live trial gaps separately; expose `/gsr:start continue` if needed.
Codex migrated skills do not prove native Claude hook parity or the reverse.


For status/progress questions, derive the small useful process fragment from the
resolved task/spec/preview, Active Task and current evidence. Identify current stage,
next action and actual open decisions; no stored graph or invented percentage.
"Built; verification stale" preserves implementation progress. Omit a full pipeline
for tiny tasks and do not print the map at every response. Product flow and GSR work
map answer different questions; status remains read-only.
