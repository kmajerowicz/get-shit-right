# Product preview within scope/build

Resolve one named uncertainty or an explicit request to see the product before full
implementation. Use the internal `skills/preview/SKILL.md`; no new public command,
flag, workflow stage, mandatory mode question or full-product PRD. A clear copy fix
skips preview. Existing `--sketch` still requests an engineering sketch.

## Pick the smallest useful demonstration

| Actual uncertainty / request | Useful artifact |
|---|---|
| Steps, access, accounts, sequence | Product flow with the open decision and one meaningful failure/branch |
| Information hierarchy or visual direction | One representative screen with realistic synthetic content |
| Multi-step behavior or states | One narrow working local interaction |
| Technical feasibility or data transformation | Actual synthetic input/output experiment for the risky operation |
| Clear feature in an established design system | Reuse existing patterns; preview only for a concrete uncertainty or explicit request |

Choose by meaning, current code and user constraints, never a regex classifier. Do
not run all forms in sequence. Default: one question, one screen/flow; at most two
visual variants when a real choice exists. Explicit user requests can set another
bound. Do not invent business rules to fill a diagram. Label uncertainty as open.

Planning-only ends with planning. A preview request permits its bounded demonstration,
not the whole app. Diagram-only produces no application code. Preserve "show and wait"
and later "review only"; silence never chooses a variant. When the chosen direction
and build are already authorized, continue without a second start approval.

## Create and show actual artifacts

Default project locations (create only when needed, check for existing user work):
`DOC_ROOT/previews/<feature-slug>/README.md`, plus `index.html` for standalone HTML.
Use `templates/preview-record-md.md` for the record. These are proposed paths until
files exist. An existing-stack route/component is equally valid; point to its actual
source and verified opening command/URL instead of duplicating code.

- Flow: Mermaid if renderable, otherwise readable steps/arrows with equivalent
  branches and decision. No renderer installation solely for a diagram.
- Visual: use existing components/styles/fonts in an existing product. For a new
  project prefer standalone HTML/CSS without dependencies; no framework scaffold for
  one screen. Concept images can help but do not establish a functional interface.
- Interaction: name what works and what is simulated/unverified. A button or attractive
  screenshot cannot prove persistence, payment or data transformation. Test the actual
  operation on synthetic data when that is the question. No real payments or production
  writes. Never silently carry mocks into the implementation.

Before presenting, check every referenced artifact exists and the opening path works.
When a browser is available, view the screen and traverse the claimed path, including
relevant error/back states and keyboard use; record actual observations and limitations.
Without a browser provide the artifact and opening instructions, mark visual/interaction
observations unobserved and say what the user can inspect. Code inspection is not a
visual check. Missing optional skills permit work with available tools. An essential
missing capability is a named gap, not implicit installation/spending authorization.

## Feedback and authoritative requirements

Record the question, requirement/decision refs and the *wording* of material assumptions
used for this revision, actual artifacts/opening instructions, simulation boundaries,
observations/gaps, feedback source/date, affected requirements and next action. Explicitly
record when no feedback/test occurred; a template is not a completed preview.

Requirements stay in scope or feature spec/PRD. Decisions have one owner: PRD when
it owns the ledger, otherwise scope, or focused feature `Open Decisions` without those.
Check existing project IDs before assigning the next D-pin. Preview record points to
the owner; STATE is navigation only. On later migration to PRD preserve IDs/history,
leave a pointer and stop maintaining the previous copy.

Behavioral feedback updates only affected requirements/decisions, preserving source,
date and previous value. State the effect on preview and implementation. Ask one
clarification only for materially different interpretations; continue independent work.
"Looks good" applies to the shown scope; it does not confirm backend behavior, every
D-pin, all Truths, deployment or acceptance. An experiment/test never confirms a D-pin
by itself. Revisit only actionable consequential choices supported by new useful evidence;
retain deferral and avoid repeating recently deferred questions without new information.

## Resume and move to build

Save current variant/question, authoritative spec/decision references, review cadence,
original authorization and any later narrowing in the ordinary Active Task packet.
Keep initial Read next at most six references. Use `Next step: scope` or `build`
(or another existing step as actually appropriate); Stage/Next action name preview work.
Do not extend the parser stage enum or assume cleared chat is available.

At resume compare actual current wording of requirements/decisions, chosen variant
and artifacts with the recorded revision. Same ID with different wording, missing
artifact or conflicting choice requires reconciliation/refresh, never a claim that the
old preview is current. Use existing evidence freshness, with no new green-status
store or exclusions. Hashes establish input change, not semantic fidelity of the UI.

Before production build record **reuse**, **adapt** or **discard** and why in the feature
or preview record. Reuse still requires checking mocks/temp data and integration;
adapt replaces them and checks actual behavior. Discard does not authorize deleting
user artifacts. Preview approval never marks unrelated Truth pins done/accepted.
