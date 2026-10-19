---
name: coordinate
description: 'Coordinate a GSR outcome or resume an existing saved GSR stage after /clear when the user says dalej, continue or resume. Choose the next bounded step, preserve scope and review cadence, and load only relevant durable context. Do not use for unrelated chat or override an explicit direct command.'
user-invocable: false
disable-model-invocation: false
---

# Task coordination across fresh contexts

Use for a GSR task request or an unambiguous saved-task continuation. This is
agent guidance over existing skills, not a classifier or automatic runtime.
Explicit commands and the latest user intent take precedence. Read
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/task-coordination.md` for the route/boundary
contract and `${CLAUDE_PLUGIN_ROOT}/docs/patterns/task-handoff.md` for features.

## Fresh-context stage handoff

At a major stage or long-build increment, follow
`${CLAUDE_PLUGIN_ROOT}/docs/patterns/stage-handoff.md`. Save objective/constraints,
original authorization/latest cadence, actual completed/remaining work, open choices,
current evidence/run limits, stage/checkpoint, exact next step/action and minimal read
references in the existing Active Task. Keep requirements in covered source documents.
Recommend `/clear` then **dalej** after saving. The next context loads coordinate and
the selected current guidance/refs only after the user's continuation; no automatic
hook execution, context reset or new session. Direct commands remain scoped optional
controls. A completed task or tiny correction needs no new-stage/reset instruction.
Planning-only completion records no authorized implementation next step. Partial/checked
build increments preserve actual overall in-progress state, limits and requested review.

## Relevant installed skills

Read `${CLAUDE_PLUGIN_ROOT}/docs/patterns/skill-selection.md` when selecting or
resuming guidance. Use the host's current catalog and actual task/output, load the
applicable SKILL.md, and reuse current guidance without redundant marketplace searches.
A saved skill name or a keyword match is not proof of use. Record only useful source/
provider/applicability/version-or-identity/loaded-use observations in existing feature/
plan sections; unknown identity stays unknown. Check availability/current content at
resume. Optional missing guidance permits authorized work; an essential missing capability
requires only its actual access/install boundary. Denied installation is not retried
through another downloader. No silent spending, publication or model switching.

## Resolve the current operation

1. Discover the canonical project/DOC_ROOT via `lib/project.js`. Inspect relevant
   current files and conversation before questioning. Invalid config is a diagnostic
   to reconcile; a stale manifest is not authority to change projects.
2. Distinguish planning/review/explanation, a bounded correction, repair, new product,
   existing-product feature, and explicit resume using meaning and inspected facts.
   Do not infer intent or permission with regex or file existence. Direct learn/status/
   verify stays the requested operation. An incidental question steers the current task.
3. For `dalej`/continue after clear, read Active Task by heading, its current spec/plan,
   saved next action and minimal read set. Observe evidence freshness. Cleared chat is
   not available by assumption. Announce the resolved task/step briefly. If references
   conflict, reconcile files; if two tasks genuinely remain plausible, ask one target
   question. Do not auto-select a task, restart scope or erase implemented progress.
4. Preserve explicit source/date of authorization, limits, consequential deferrals and
   requested review cadence. A later narrowing wins. STATE/skills never grant publishing,
   spending, installation or acceptance. `dalej` starts the remaining authorized step;
   it does not resolve a material product choice or accept pins.

## Product demonstration when useful

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

## Existing-product change sequences

For a substantial authorized change or several corrections, use
`${CLAUDE_PLUGIN_ROOT}/skills/autopilot/SKILL.md`: inspect current impact, prepare bounded
per-task context and execute sequentially with durable checkpoints and bounded retries.
A selected saved queue is inspected against actual current sources/evidence before resume.
The model reconciles current intent; JSON fields never grant authority. Quick, planning,
review and explicit status/verify commands keep their requested operation. No new public
command or mandatory mode question; no full PRD requirement. Relevant previews remain
optional. Preserve per-chunk waits and later narrowing without another start approval.

## Execute the next bounded stage

Load the existing applicable SKILL.md, rather than telling the user to coordinate
its components. Use this dispatch map (actual paths relative to the plugin):

| Task | Guidance to load | Stage boundary |
|---|---|---|
| Planning/review/explanation only | Relevant inspection/scope guidance | Requested artifact/report, no product code edits |
| Product preview request / material uncertainty | `skills/preview/SKILL.md` within current scope/build | Named question and bounded artifact; preserve show-and-wait and source of authority |
| Clear small correction | `skills/quick/SKILL.md` | Correct and check proportionately; no new spec or forced reset |
| Repair requested | `skills/debug/SKILL.md` | Bounded investigation/fix, actual verification or truthful partial checkpoint |
| Existing product, feature missing/partial | `skills/learn/SKILL.md` for affected-area inspection, then `skills/scope-shaping/SKILL.md` focused feature path | Sufficient single-feature contract; no full-product PRD |
| Existing sufficient feature | `skills/build/SKILL.md` | Bounded implementation/checks; do not repeat intake |
| New product/materials | `skills/scope-shaping/SKILL.md`, then next session `skills/prd-generation/SKILL.md` if needed | Preserve scope/PRD boundaries; extract supplied foundations |
| Saved build/verify/debug step | Corresponding existing skill | Remaining bounded action with current file/evidence reconciliation |
| Verify requested | `skills/verification/SKILL.md` | Actual checked subset; separate human acceptance |

Use existing installed skills when applicable; selection does not authorize installation. For material research follow `${CLAUDE_PLUGIN_ROOT}/docs/patterns/research-reuse.md`: read relevant existing findings first, match current constraint wording/support/dates, reuse when applicable and refresh only the affected question when needed. Changed wording under the same requirement ID triggers targeted review; missing/conflicting support stays uncertain. No blanket catalog/web sweep for routine corrections. Default to inline bounded work; stop at sufficient evidence, a supplied budget or a human/experiment boundary and record the reason. Existing D-pins never mandate research or a question. Skill-selection guidance will be refined separately; do not invent missing paths. Weight controls rigor, not authority or requested waits. Routine technical choices inside scope need no extra approval.

## Progress questions

For "where are we?"/status read the resolved current task/spec/preview, Active Task and
current evidence. Show only the useful fragment (e.g. goal → preview [now] → build →
verify), open decision/owner and exact next action. Missing STATE is valid; unknown
stage stays unknown. Built + stale checks retains both facts. No stored graph, invented
percentages, tests or implementation from a status-only request. Keep this work map
separate from the product flow; do not repeat it at every response or for a typo.

## Finish the stage, preserve the task

Use the existing feature/plan/STATE artifacts. Before a major context boundary, save
one compact Active Task packet: objective/constraints and authoritative refs, authorization
source/cadence, actual completed versus pending work, observed run/ref and limits, open
choices, current stage/partial checkpoint, exact next bounded step and minimum read refs.
A feature spec is sufficient without a whole PRD. Keep requirements in covered documents,
not only excluded administrative STATE. No duplicate transcript or task database.

Long build increments can be checked and handed off while the build stays in progress.
If unfinished/unverified, label the checkpoint accurately. Do not force a review for every
increment; honor only requested waits and actual consequential choices/host boundaries.

After a major stage: state outcome and verification limits, save the handoff, recommend
`/clear` then **dalej**. Existing direct stage commands or `/gsr:start continue` remain
optional shortcuts. Do not clear/create/respawn a session or run work from a hook.
Small quick work needs no reset. A completed task ends with the result, not another stage.
Host capability limits, including unsupported bare continuation, remain explicit; an
explicit-command fallback alone does not prove the preferred flow works.
