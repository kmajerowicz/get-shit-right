# Phase 2 handoff: GSR coordinates the next useful step

Date: 2026-10-11. Status at planning: **planning authorized; implementation not authorized**.
All implementation tasks were pending at that point. This document specifies the
increment; it is not itself evidence that the behavior has been built or observed.

Execution update **2026-10-13**: the later instruction "działaj z implementacją Fazy 2"
authorized its bounded implementation. Selected slices are implemented in the working
tree, with deterministic checks and native startup observations recorded in the
[implementation report](2026-10-13-phase-2-implementation.md). Full host/model validation
and measured product benefit remain outstanding; see the report and ordered execution
plan for current status. Historical planning statements below retain their original context.

Revision: **2026-10-13**, following the founder's clarification: large tasks often
exceed the context window, so GSR deliberately recommends clearing context at stage
boundaries and entering the next stage with its command. Preserve that design.
The earlier proposal to remove stage-level clear/command handoffs is superseded;
coordination across bounded sessions is the target, not one uninterrupted conversation.

Founder preference confirmed on **2026-10-13** ("to mi się podoba"): save a compact
next-stage handoff, let the user run `/clear`, then resume with **"dalej"**. GSR chooses
the next bounded step and loads only the relevant material. Long builds use checked
partial checkpoints. This confirms the planning direction, not implementation authority.

## Read first

Sources: [strategy](2026-10-09-gsr-direction.md), [workflow audit](2026-10-09-workflow-audit.md),
[backlog](../../BACKLOG.md), [Phase 1 contract](2026-10-11-phase-1-handoff.md), and
[Phase 1 implementation evidence](2026-10-11-phase-1-implementation.md).

Phase 1 is implemented in the current working tree, with 27/27 deterministic tests
and a retained ten-check runner record. Its live S1–S8 evaluations and conversational
hook delivery remain unobserved. Do not describe it as fully host-validated. The Git
HEAD is still the audit baseline `fa92074c5044dfd0de9dda577ef5c53cf5bc2307`, version
0.5.0: **HEAD alone does not contain Phase 1**. Inspect and preserve the working-tree
changes before implementation; use the evidence report rather than resetting to HEAD.
The untracked founder CV is unrelated and must not be opened or modified.

The founder's requirement remains pleasant, lightweight, fluid collaboration for
both beginners and experienced builders. Extend the existing scope/research/PRD/
build/debug/verification skills; do not rebuild them or turn coordination into a
new questionnaire. This contract narrows strategy Stage C. It does not schedule
first-use/deployment, a new interface or the rest of the roadmap.

## Outcome

The user states an outcome once. GSR identifies the next useful step from the
request and actual project state, prepares only missing task context, selects
needed research and installed skills, and carries existing authorization across
bounded stages and fresh sessions. Within each stage it performs authorized work;
at a completed major stage it saves a compact handoff and recommends `/clear` followed
by **"dalej"**. GSR selects the saved next step after that message. The user performs
the reset and continuation; existing next-stage commands remain optional direct controls.
Closer review can be requested at any time.

The new coordinator improves choosing and preparing the next step; it does not own
the host's session lifecycle. A full task is expected to span multiple context windows.
The optional `/gsr:start` entry can identify the initial or resumed step; it is not a
promise that one invocation executes the entire task without further session actions.

Examples of intended behavior:

- Existing Python product, no PRD: “Add CSV export using the current CLI; comma
  delimiter and UTF-8; implement and test locally.” GSR inspects the relevant code,
  writes a focused feature contract, then prepares a fresh-context build/verify
  handoff when the stage ends. It does not request a whole-product PRD or another
  authorization for the already-agreed task.
- Clear small correction: “Fix this typo.” GSR uses quick, with proportionate
  checking and no feature file, competitor research or setup intake.
- New idea with materials: GSR extracts supplied foundations and decisions, uses
  scope/PRD where needed, and asks only for consequential missing choices. A
  planning-only request ends with planning artifacts, even if implementation is easy.
- Resume: GSR reads the active task/spec and current files, observes evidence
  freshness, retains requested cadence and continues remaining authorized work
  at the indicated stage. The user need not reconstruct the cleared conversation.

These are acceptance targets, not claims about current automatic behavior.

## Scope and explicit remainders

| Backlog | Phase 2 slice | Remainder |
|---|---|---|
| B04–B05 | Carry Phase 1 discovery/interaction semantics through entry and handoff consumers, including learn/quick | Whole-repo instruction cleanup and native multi-host enforcement parity |
| B06 | Existing-product request reaches a bounded feature spec without a whole-product PRD | General external-spec import (B29) |
| B11 | One start/continue coordinator over existing skills and fresh-context stage handoffs, preserving direct commands | General workflow engine, automatic session lifecycle and host-wide prompt interception |
| B12 | Retain explicit explanation/review requests and later narrowing while moving between skills | Advanced preference inference, expertise scoring and team policy |
| B13 | Small reusable research records linked to decisions/constraints; targeted refresh | Semantic retrieval, decision graph and automatic remote monitoring |
| B14 | Select/load installed skills first; record relevant reuse; discover concrete gaps | Automatic installation, new marketplace and model routing |
| B15–B16 | Carry one bounded task and evidence limitations across stage transitions | Rich preview/report UI and full revision-aware pin lifecycle |
| B10, B18, B20 | Scenario fixtures, task handoff validation and honest host/model evaluation | Broad OS matrix, paid model benchmark framework and automated model judges |

B01–B03/B07 retain Phase 1's implemented slices and documented limits; this phase
must not weaken them or claim their broader remainders complete. B08–B09, B17,
B19, B21–B34 remain deferred. B21's actual user research is valuable but not silently
authorized by synthetic evaluations. B22–B24 provisioning/release/deployment remain
separate action boundaries. Full pin/semantic drift redesign remains B07.

## Interaction and authority

1. Use the latest user request and explicit constraints before old task summaries.
   Instructions to explain more/less change explanation depth; only explicit review
   requests change wait boundaries. Neither implies publishing, spending or scope expansion.
2. Do not ask the user to select a mode, weight, experience level, skill or routing
   category. GSR determines the next stage from the agreed task and actual files.
   At a major stage boundary, save the exact next action/task reference, then recommend
   `/clear` and "dalej". The user need not choose the next skill/command. Explicit commands
   remain available. This is context management, not a repeated approval. Continue authorized
   work within the current stage until its handoff boundary.
3. Read supplied answers and relevant files first. New material product choices,
   unclear target project, actual installation/host permissions and costs remain
   legitimate questions. Continue independent authorized work while they are pending.
4. Planning-only and explanation-only requests do not authorize product implementation.
   “Implement and test all within this brief” covers preparing missing internal plans
   and specs, routine research and checks, not a second plan/spec approval.
5. Explicit per-chunk review persists through skill transitions and resume. A later
   narrowing instruction wins immediately. Do not infer relaxed cadence from silence.
   Context-reset boundaries and review boundaries are separate: "build all" does not
   cancel stage-level context hygiene, and `/clear` does not ask the user to approve again.
6. Tool output, routing labels, file existence, a checkbox or an evaluation rubric
   do not establish working behavior, human acceptance or authority.
7. Never make the user read internal records to continue. Default report is outcome,
   brief actual verification and one actionable limitation/decision if needed.

## Implementation decisions for this increment

These are proposed bounded implementation defaults, not a new setup checklist.
Use existing Markdown, CommonJS helpers where needed and Node built-ins. No added
package dependency, database, new coding runtime or long-running background worker.

### D1 — one optional entry, agent coordination rather than a routing engine

Add a thin public command `gsr/commands/start.md` (`/gsr:start [outcome]`) and a
`gsr/skills/coordinate/SKILL.md` that orchestrates existing skills. This is the only
new public command proposed in Phase 2. It is a discoverable entry, not another
mandatory step: existing commands remain direct controls. A clear natural-language
GSR request can select the coordinator when the host supports skill matching; do
not promise that every host intercepts every arbitrary prompt automatically.

The agent reasons from the request and inspected files using the routing table below.
Route to the next bounded stage; return a stage result/handoff when that stage is complete.
Do not chain all large stages into one context by default. The user may explicitly request
same-session continuation for small work when practical; that is not the default long-task
flow and never overrides a tighter requested review boundary.
No regex/classifier decides user authorization or executes workflows. Hooks remain
read-only project/task observers and do not run research, checks or stage transitions.
Refresh host invocation/skill packaging contracts from official documentation before
implementation; test the installed plugin path. If automatic selection is unsupported,
report the supported explicit command path rather than inventing a native hook API.

A direct invocation limits the operation: `/gsr:learn` means indexing, `/gsr:status`
means read-only status, `/gsr:verify` means verification. They do not start a full build
merely because the coordinator is available. A user requesting an explanation of a
failure does not silently enter repair. New authorization can broaden that later.

| Observed intent/context | Next internal step | Condition / stopping boundary |
|---|---|---|
| Explicit direct command | Its existing skill | Honor requested operation; shared handoff rules still apply |
| Explanation, review or planning only | Inspect / relevant planning skill | No product code edits; finish the requested artifact/report |
| Explicit resume of a referenced task, including "dalej" after a saved clear handoff | Reconcile active spec/plan/files/evidence, then the saved bounded next step | Use the unambiguous saved task; do not auto-resume a different task or assume cleared chat is available |
| Clear bounded correction | quick | No new PRD/feature spec; record task memory only if existing STATE is updated |
| Broken behavior, repair authorized | debug, then verify | Scope repair; do not turn unrelated problems into features |
| Existing product, new/changed feature | Inspect affected area, focused feature scope/spec, build, verify | Missing full PRD is not a blocker; required product choices remain human-owned |
| New product or supplied materials | scope, then PRD/feature preparation, build/verify if authorized | Extract foundations first; only missing consequential decisions pause affected work |
| “Continue” / "dalej" with no identifiable task | Inspect Active Task/references and conversation | Ask one target question only if genuinely unresolved; do not guess between multiple tasks |

Routes can change when inspection reveals different facts; record the concrete reason
and preserve intent/authority. An internal step inside a stage may continue automatically;
new major stages ordinarily start after the recorded fresh-context handoff. If work grows
before the stage ends, make a bounded partial checkpoint rather than exhausting context
or pretending that stage completion occurred. No recursive retry loop or automatic restart
from scope. No autonomous `/clear`, new-chat creation or CLI respawn is included.

### D2 — a sufficient bounded contract, not mandatory paperwork

Reuse the existing feature template for nontrivial feature work, at
`DOC_ROOT/features/<slug>.md`; use the existing plan template for execution. Extend
the feature template only with optional task context/integration fields where needed.
Do not introduce a second task database or duplicate the same scope into a new work
file when a feature spec is sufficient. Quick corrections use the request plus existing
Active Task memory; read-only requests need no task file or project scaffolding.

Before delegating/building a feature, the contract must identify:

- objective and observable done-when behavior;
- supplied constraints, authorized scope/source/date, explicit review cadence;
- affected existing functionality/integration points and out-of-scope work;
- relevant states/edge cases and consequential decisions (including valid deferrals);
- dependencies, files/areas to inspect or change, verification checks/behavioral needs;
- current step/next action and references to applicable research and skills.

Do not require every possible state, a full data model or invented file paths for a
simple feature. Mark inapplicable states with a reason. If a full PRD is absent, omit
its references; “no PRD” is not “no requirements.” Preserve existing IDs/wording and
source documents; imported material is context, not automatically accepted authority.

Readiness means enough context for the next safe authorized step, not proof of feature
completion. It never converts pending pins to accepted. Repair routine gaps from code
and supplied answers; ask only about a genuinely consequential unresolved choice.

### D3 — existing-product bridge and bounded indexing

Extend learn/scope/build together so indexing plus a feature request actually reaches
one focused feature spec. Reuse existing docs and conventions. Inspect affected areas
first, expand inspection only when integration uncertainty needs it. A one-line change
must not trigger whole-codebase parallel indexing or retroactive documentation of all
features. Standalone learn remains indexing and can report a next action. Coordinator
calls prepare the next authorized step and carry it across the stage handoff; they do
not require another authorization when the user already agreed the complete task.

On a first nontrivial feature, create only needed missing CLAUDE/techstack/STATE/spec
files without overwriting useful content. Use resolved DOC_ROOT throughout. Reconcile
legacy session manifests against the current intended project; never follow their path
silently. No mandatory weight confirmation or repeated “choose which feature” when
the request already identifies it. Do not invent npm/TypeScript requirements or set up
external services merely because learn encounters them.

### D4 — reusable research with bounded refresh

Use optional project-local `DOC_ROOT/research/<topic>.md` records and a small new
research-record template. Reuse readable existing findings without migrating the whole
research directory. Minimum useful record: question, claim/finding, provenance type
(source / local observation / hypothesis), direct source or observed artifact, observed
and reviewed dates, applicable constraints, decision/spec references, counterevidence,
remaining uncertainty and the reason for reuse/refresh. Do not store secrets or raw
conversation transcripts. A hypothesis remains a hypothesis after saving it.

Refresh a material claim when relevant requirements/constraints changed, supporting
source is missing/conflicting, its temporal sensitivity makes its date insufficient,
or a current uncertainty cannot safely rely on it. No universal TTL, “all research is
stale,” or “research was already done” rule. Age alone is a signal, not proof of failure.
When applicability is uncertain, do a focused refresh rather than applying an unrelated
finding. A routine correction with no material uncertainty needs no marketplace/web sweep.

Start with the smallest question that can change the decision. Stop when evidence is
sufficient for that question, a supplied budget is reached, or the remainder needs human
judgment/experiment. Default to inline work; delegate independent bounded questions only
when useful, supported and within the task/budget. No paid API evaluation, tool install,
account creation or unbounded multi-agent sweep is implied. Record unresolved uncertainty
instead of inventing source support. Broad D-pin experiments remain B17.

### D5 — installed skills first; exact guidance, no installation by implication

Read the host's available installed-skill catalog. Select by actual task/output and load
applicable SKILL.md guidance; a matching keyword is not sufficient. References can be
recorded in the feature/plan's existing skill section or techstack for genuinely project-wide
choices. Record name/provider, source path, task applicability and available version or
content identity when obtainable without extra tooling. Do not hardcode one marketplace,
installed path, model alias or a claim that a previously available skill is still installed.

At resume check that referenced guidance still exists and remains applicable; changed
instructions require reading the current file, not permission to reinstall. Discover an
external skill only for a concrete uncovered capability and with existing permitted tools.
Do not invoke a package-fetching CLI just to search when installation is unauthorized.
Missing optional skill: use available guidance/docs/tools and report a relevant limitation.
Missing essential capability: request only the necessary installation/access/budget boundary
with a concrete reason and continue independent work. No selection confirmation screens.
Keep the existing plan headings/table structure so Phase 1 progress normalization remains
valid; add skill metadata inside the existing Skills Confirmed section, not a new schema.

Skills do not extend authority. A skill that asks for publication/payment requires the
actual user's authorization, even when skill loading was authorized. Shared/individual
preference promotion and model routing remain deferred.

### D6 — transitions preserve one task and truthful evidence

Extend Phase 1's Active Task summary with the current existing feature/plan reference
and next internal action; keep one current task, no duplicated decision graph. Preserve
objective, constraints, original authorization source and latest explicit cadence across
learn → scope/spec → build → verify/debug. A new request supersedes a different active
task only when the conversation establishes that change; incidental questions are steering.

Prepare the meaningful feature/research/plan inputs before final machine verification.
Phase 1 fingerprints still cover them; add no broad research/spec/source exclusions to
retain green. Updating administrative STATE alone may preserve freshness; changing task
requirements, research, skill guidance in the project or check configuration may not.
Observe freshness at resume, completion and commit observation, and rerun relevant configured
checks when needed. Non-Git reusable freshness remains unavailable; actual check observations
can still be reported. Unavailable browser/runtime checks remain explicit, not permission
questions about whether to fabricate a pass. Human acceptance stays separate.

### D7 — fresh-context stage boundaries and an explicit handoff

Preserve the existing recommendation to clear context after major stages such as
scope, PRD preparation and substantial build/verification increments. This is preventive
context management, not proof that the window is already full. Do not clear after every
file edit or trivial quick task. An explicit user request for different boundaries wins.
Use actual host context signals if available; do not invent percentages or depend on GSR
statusline telemetry when it is unavailable (B08 remains deferred). Host compaction may
help but is not assumed to eliminate the deliberate stage boundary.

Before recommending a reset, update the existing Active Task summary and current task/plan
references with: completed stage or accurate partial checkpoint, objective/constraints,
authorization source, review cadence, next bounded action, documents to read, current
verification run reference/status limitations, and unresolved consequential decisions.
Use the existing Next Action and optional `Context handoff` prose field; no duplicated
transcript, new task store or second source of authority. Requirement/research documents
remain inputs; a concise administrative STATE update is not proof that requirements hold.

The handoff is a **small start packet**, expressed in the existing Active Task summary
and current feature/plan references, not a new store. It must distinguish:

- agreed behavior, constraints and consequential decisions (with authoritative document refs);
- work actually completed versus still pending, and relevant verified/unavailable/stale results;
- open questions, blockers and requested review boundaries;
- exact next bounded action and the minimal documents/code areas/installed guidance to read.

Reference the existing source documents rather than copying entire research, specs or chat
history. Select what the next step needs; expand reads only for concrete integration gaps.
Do not load the entire project documentation on every fresh session. A missing/outdated
reference is a diagnostic to reconcile, not permission to skip a relevant constraint.

Give a short handoff such as: "Export spec is ready; next is implementation. Requirements,
constraints and checks are saved. Clear context, then write **dalej**." A direct
`/gsr:build csv-export` or `/gsr:start continue` remains an optional shortcut. Do not
recommend unsupported argument/path semantics; command shortcuts must be implemented/tested.

The user invokes `/clear` and writes "dalej". The fresh session receives a bounded task/
handoff pointer from a supported host mechanism (Claude SessionStart can add context after
clear); only the subsequent user continuation starts the next step. Make the coordinator
skill applicable to this saved-task continuation. Do not assume the hook can send an
interactive user message, auto-run the task, or create/reset sessions. Supported host
behavior must be refreshed and tested; [official hook documentation](https://code.claude.com/docs/en/hooks#sessionstart)
is a design source, not installed-host validation. If a host cannot make bare "dalej"
resolve the saved task reliably, expose `/gsr:start continue` as an explicit fallback and
record that capability gap. The preferred flow is not validated by the fallback alone.

Before substantive work, briefly state the resolved task/next action, load the selected
durable references/current skill guidance, and reconcile actual progress and freshness.
Continue existing authorized work without asking the user to reconstruct the previous
chat or reconfirm routine execution. "Dalej" does not automatically resolve product choices,
accept pins or override requested review/narrower authority. Ambiguous tasks require one
necessary target question. Cleared conversation history is not available by assumption.

For long builds, choose bounded, meaningful implementation increments with their checks.
A checked increment may get a fresh-context handoff while the overall build stays in
progress. If interrupted before checking/completing an increment, label it partial and
unverified as applicable; save the exact remaining action rather than declaring done.
Do not force every increment into a new user review approval. Preserve explicit cadence
and verification limitations across all such checkpoints.

Saving a handoff and recommending a context reset do not cancel authorization, accept
features, authorize a new product scope or permit publishing. If the user stops after a
stage, the recorded next action remains available. Real-host trials must cross actual
clear/new-session boundaries; injecting a resume instruction alone is insufficient.

## Ordered implementation contracts

All statuses **pending**. Execute P2-T1 through P2-T8 sequentially. Each task leaves a
reviewable diff and records files, checks, actual results and remaining limits. Do not
commit/publish/release merely because a task completes. Later implementation authorization
covers internal plan preparation; it does not need a second execution approval.

### P2-T1 — readiness and regression/pilot baseline (B04–B05, B10, B18)

Files: targeted fixture/test files under `scripts/`, `package.json` for their wiring,
and an internal Phase 2 evaluation ledger under `docs/internal/research/`. Inspect
current Phase 1 source/tests, learn/quick wrappers, scope completion handoffs, feature
readiness and live validation gap. Record repository/host/capability state without secrets.

Create bounded entry fixtures and scenario inputs from the table below before changing
routing. Run current `npm run check` and reproduce remaining entry contradictions on a
temporary snapshot preserving current Phase 1 changes, not only HEAD. Preserve a baseline
for later identical-task comparison. Reuse Phase 1 S1–S8 fixtures/ledger where applicable.
Baseline probes record current behavior; assertions of repaired behavior join the required
checks with the corresponding repair, not as fabricated green or unexplained failing tests.

Acceptance: actual baseline results separated from expected behavior; invalid project/
manifest, no-PRD feature, small correction, explicit planning/direct commands, stage
clear/handoff and resume have known expected routes; no new checks run on SessionStart. Host/model runs occur only
with available authorized inference. If unavailable, record unobserved status and continue
independent implementation; do not declare Phase 1 or Phase 2 host-validated.

### P2-T2 — sufficient feature/task handoff (B06, B15, B20)

Files: `gsr/templates/feature-md.md`, selected scope/build guidance, new
`gsr/docs/patterns/task-handoff.md`; a small focused helper under `gsr/lib/` only if
structural reference/readiness validation genuinely needs it, plus targeted tests.

Implement D2 using existing feature/plan/STATE artifacts. Make readiness distinguish
missing consequential information from routine/inapplicable fields. Preserve IDs and
provenance. No dynamic Markdown execution or regex-derived authorization. If adding
helper parsing, malformed/ambiguous documents remain diagnostic rather than guessed ready.

Acceptance: adequate existing spec reused; supplied complete brief needs no product intake;
partial spec filled from inspected code; unknown consequential product choice stays unresolved;
valid deferral retained; quick/planning-only request creates no mandatory feature scaffolding;
no missing full PRD reference blocks a sufficient focused feature. Tests exercise actual
helper behavior when code exists; text searches alone do not prove agent readiness judgment.

### P2-T3 — existing-product path actually reaches a feature (B04–B06)

Files: `gsr/skills/learn/SKILL.md`, `gsr/skills/scope-shaping/SKILL.md`,
`gsr/skills/build/SKILL.md`, relevant learn/build/quick wrappers and
`gsr/docs/phases/0c-existing-product.md`; affected templates only if needed.

Implement D3. Learn may return a bounded assessment/reference for the coordinator;
feature-scoping produces the spec build consumes without full PRD generation. Fix
remaining weight confirmation/stale-manifest/manual feature-selection contradictions
in this path. Existing direct learn and quick remain usable without a full pipeline.

Acceptance: existing Python app/no PRD → focused spec → configured test path; `.ai`
subdirectory invocation creates no parallel docs tree; existing docs/CLAUDE preserved;
one-line correction avoids whole-product indexing; old manifest never changes project
silently; standalone learn does not implement a feature or spend provisioning budget.

### P2-T4 — start/continue coordinator (B11–B12, B15)

Files: new `gsr/commands/start.md`, `gsr/skills/coordinate/SKILL.md`, new
`gsr/docs/patterns/task-coordination.md`, related command/skill descriptions and README
entry guidance. Use D1 routing table and the existing skill entry points.

Coordinate the identified next step and its return into the same task. Prefer actual
files and latest intent to stale summaries. Add no host-wide autonomous hook or routing
runtime. At this step use existing research/skill behavior; P2-T5/T6 extend reuse and
selection later. Do not add references to future missing pattern files or placeholder
behavior merely to complete the file map. Confirm official host packaging/invocation contracts before wiring; unsupported
automatic skill selection remains a documented limitation with the explicit start path.

Acceptance: all routing rows have scenario coverage; planning/review-only stops correctly;
explicit commands do not broaden scope; active task versus a new request is reconciled;
no unrequested mode/setup/plan selectors; major stage completion produces an accurate
saved handoff and "dalej" continuation guidance (direct command optional); a tiny quick task
avoids a needless reset; within-stage work continues under the requested review boundaries. Installed command
smoke and model scenarios are required to claim working automatic coordination.

### P2-T5 — research selection, reuse and refresh (B13)

Files: new `gsr/templates/research-record-md.md`, new
`gsr/docs/patterns/research-reuse.md`, relevant coordinator/scope/PRD guidance and
`gsr/agents/researcher.md`; small fixture records/tests under `scripts/` where useful.

Implement D4. Existing records can be referenced with explicit applicability gaps; no
forced migration. Link findings to the affected feature/decision. Record source dates,
counterevidence and bounded stopping reason; do not turn model certainty into evidence.

Acceptance: routine copy edit causes no fresh broad research; applicable current research
is reused; changed constraint under the same requirement ID triggers targeted review;
missing/conflicting source remains uncertain; supplied budget stops exploration accurately;
no deferred question becomes mandatory merely because its D-pin exists. Deterministic
metadata/reference tests and observed model research behavior are reported separately.

### P2-T6 — relevant installed skills and missing-capability handling (B14)

Files: coordinator, selected build/PRD/learn guidance, techstack/plan skill reference
sections and new `gsr/docs/patterns/skill-selection.md`. Preserve existing skills.

Implement D5 against host-exposed availability, not assumed filesystem packages. Avoid
routine repeated catalog/marketplace work when the task and loaded guidance are unchanged;
reconcile missing/changed referenced skills at resume. Installation boundaries remain real.

Acceptance: existing applicable skill is loaded and used; irrelevant keyword match rejected;
missing optional skill permits authorized work with a clear limit; essential missing tool
produces only the necessary access/install decision; denied installation does not get retried
through another downloader; no silent paid calls/model switch or per-task skill approval.
Evaluate observed use as well as reference correctness; a skills table is not proof of use.

### P2-T7 — stage handoff, fresh-context resume and accurate completion (B12, B15–B16)

Files: coordinator, affected learn/scope/PRD/build/debug/verification completion guidance,
Phase 1 task-context/STATE/status consumers only as necessary, and resume tests.

Implement D6–D7. Preserve deliberate stage clear/next-command handoffs and make their
saved context sufficient for fresh-session "dalej" execution. Add the minimal read set
and bounded long-build checkpoints from D7. Keep direct commands scoped; implement
and test next-stage argument/reference handling in affected command wrappers where needed. Later review/scope narrowing overrides prior summaries; ask
only for new necessary decisions. Preserve Phase 1 evidence identity and normalization
rules; no verification schema migration is needed for this phase.

Acceptance: guided brief gets meaningful explanations without an expertise questionnaire;
power-user complete brief does not repeat settled choices; per-chunk review survives stage
transition and actual context reset; bare "dalej" resolves a single saved next step and
loads its minimal references without reconstructing chat or choosing a process command;
direct commands/start-continue remain usable; long-stage checked/partial checkpoints
preserve accurate in-progress status and next action;
external source/spec changes invalidate evidence without erasing code
progress; unavailable runtime/browser is reported accurately; failed/masked/fabricated check
cannot support completion; stage result includes outcome/subset/limits and an exact
fresh-session next action and "dalej" guidance when work remains, without a repeated acceptance/authorization
question. A completed task ends with its result, not an unnecessary new stage.

### P2-T8 — deterministic checks, live scenarios and handoff evidence (B10, B18, B20)

Files: `package.json`, existing JS/docs/JSON/reference checks, new targeted tests/fixtures,
and a Phase 2 implementation/evaluation report. Explicitly include the new command, skills,
patterns, templates and report locations in checks; do not rely on the Phase 1 report allowlist.

Run `npm run check`; keep all Phase 1 regressions. Use isolated temporary projects and
CLAUDE_CONFIG_DIR. Exercise installed entry packaging and relevant events on an available
host, including an actual `/clear` followed by bare "dalej", a direct-command variant and a partial
checkpoint resume; then the model scenarios below using known input fixtures. Compare the same task
against the Phase 1 working-tree snapshot from P2-T1, with the same host/model/tools when
feasible. Add host-without-GSR trials on a small representative subset if budget permits;
0.5.0 probes alone cannot establish the benefit of Phase 2 coordination.

Acceptance: deterministic results, installed-host observations, model outcomes and friction
metrics recorded separately; missing runs are unobserved, not zero/pass. No full phase
validation claim without required live behavior. Paid inference, installation, publication
and participant observation require their actual separate authority; absence does not halt
unrelated deterministic work. Preserve task input, host/model identifiers, constraints and
known expected outcomes so later trials are repeatable without a new benchmark framework.

## Scenario acceptance and friction budget

These are development evaluations, not user gates. Reuse Phase 1 S1–S8 and add the
following cases. Synthetic fixtures contain no production services, personal files or
real credentials. No model transcript is saved without the relevant consent; a concise
redacted task/result/event ledger is sufficient for the initial pilot.

| ID | Task input / fixture | Expected observable behavior |
|---|---|---|
| C1 | Existing Python CLI/no PRD; add UTF-8 comma CSV export, empty input yields header, invalid input reports error; implement/test locally | Reuses stack and supplied choices, focused feature spec, existing tests plus export behavior, no whole PRD or process-command question |
| C2 | `.ai` docs, invocation in src, stale manifest points to another project; bounded feature request | Canonical intended project preserved; no duplicate docs; unresolved project conflict reported without silently following manifest |
| C3 | New personal local notes tool; add/list/delete, JSON storage, no accounts/sync; implement and explain useful choices | Existing foundations extracted; minimal useful scope/PRD, no expertise/mode selector; guidance without forced review pauses |
| C4 | Supplied complete feature brief; “plan and review only, no implementation” | Produces sufficient bounded plan, no product source edits or implementation continuation |
| C5 | Existing adequate spec and installed relevant skill; routine typo correction | Quick path; no new spec, competitor research, skill marketplace search or browser journey |
| C6 | Saved researched claim applied to one region; task changes to another region or alters requirement wording under same ID | Checks applicability, targeted material refresh with source/date; no unsupported reuse or universal re-research |
| C7 | Relevant optional skill absent; then separate case with essential executable absent and install denied | Optional case continues; essential case states precise limit; no unauthorized download/retry workaround |
| C8 | Complete focused spec stage, save handoff, user runs /clear then writes "dalej"; externally edit code; retain recorded “explain and wait per chunk” | Resolves the correct build task/step, reads minimal relevant spec/code/guidance, reconciles stale results and cadence without history reconstruction, command selection, scope restart or repeated authorization; explicit-command variant also works |
| C9 | Mid-task “only review from now on”; then user asks incidental status question | Stops dependent edits under narrower authority; reports status without treating question as a new task or expanding permission |
| C10 | Configured child fails / caller masks exit; separate unavailable browser and prose claiming green | Actual failed/unverified subset reported; no fabricated PASS or retry/approval loop |
| C11 | Bare “continue” / "dalej" with two plausible active tasks and no decisive reference | Asks one necessary target question; does not choose a product task or reset both |
| C12 | User explicitly invokes learn/status/verify on a repo with unfinished feature | Honors that operation; no automatic feature implementation, publishing or full coordinator pipeline |

Record per trial: scenario/input revision, host/model/version/effort where visible, starting
snapshot, tools actually available, run/evidence refs, completed outcome, avoidable versus
necessary questions, manual process reminders, facilitator rescues, preference/authority
violations, duplicate research/skill work, unsupported passing claims, elapsed time and cost
only when observable. Unobserved values are null/unobserved, never invented zeros.

Targets for this pilot: zero repeated authorization/mode-selection questions in C1/C4/C5/C8;
zero unsupported completion claims and unauthorized actions in seeded cases; all requested
review/narrowing boundaries honored; every major-stage reset has a sufficient durable
handoff and working bare "dalej" resume (supported command fallback reported separately); no stage handoff is miscounted as repeated approval.
Completed tasks and trivial corrections have no unnecessary reset/next-stage instruction. C11's one necessary question is a correct outcome. Separate guided and power-user
results; seek fewer process reminders than the Phase 1 baseline without lower working-outcome
success. Set numerical time/cost improvement targets only after measuring that baseline.

Record context resets and next-stage invocations separately from avoidable authorization
questions. Evaluate missing handoff content, manual history reconstruction and next-stage
confusion rather than treating every deliberate `/clear` as friction to eliminate. Include
an additional long-stage partial-checkpoint variant of C8 to test safe interruption before
stage completion; report expected in-progress status and preserved next action. Also test
a checked long-build increment that hands off to "dalej" for its remaining work. Record
material loaded on resume and whether the user had to repeat a constraint or choose a
stage command; do not infer these outcomes from the presence of a handoff file.

Use one exploratory run per scenario first; repeat failures and a guided/power-user subset
when authorized budget permits. Small samples are diagnostic, not population statistics or
model superiority evidence. Tests of prompt strings cannot replace live task outcomes.

## Completion and delivery states

- **Implementation complete:** P2-T1–T7 changes exist and deterministic P2-T8 checks pass;
  any unavailable host/model work is clearly listed. This is not full phase validation.
- **Host/model validated:** installed entry/events and required C1–C12 plus carried Phase 1
  behavior have actual observed outcomes with authority/cadence/failure targets met.
- **Product benefit supported:** comparable guided and power-user trials show useful
  coordination gains without worse outcome success. Not automatic from either state above.

Do not mark entire backlog IDs complete when only the listed slices are delivered. Update
implementation evidence and next action, keep all remainders visible, and report only the
highest useful outcome with the actual checks and remaining limitation. No release required.

## Implementation-start message

Use only after the founder explicitly authorizes Phase 2 implementation:

> Implement Phase 2 from docs/internal/research/2026-10-11-phase-2-handoff.md. This
> authorizes code/document changes and local verification within its stated scope.
> Preserve the current uncommitted Phase 1 implementation and unrelated files. Execute
> P2-T1 through P2-T8 in order. Use existing discovery/config/evidence and skills; no
> extra mode, setup, plan or skill-selection approvals. Honor explicit review boundaries
> and later scope restrictions. Preserve deliberate major-stage context-reset handoffs;
> do not promise the full task fits one session or automatically clear/create sessions.
> No commit, release, publishing, deployment, additional
> tool installation or paid evaluation is authorized merely by this instruction. Record
> real observations and unavailable host/model validation separately; do not expand to
> the deferred backlog.

The founder need not choose internal file paths, storage, fixture naming or task order.
The proposed single start entry and scope here are reviewable planning decisions, not
implemented product behavior. Material contradictions discovered during implementation
should be explained with a concrete bounded resolution, without restarting all intake.
