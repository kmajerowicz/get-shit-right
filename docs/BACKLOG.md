# GSR — research backlog and delivery horizons

Updated: **2026-10-15**. Scope: development of GSR itself, for both beginners and experienced AI builders.

This is the current index of opportunities preserved from the October research and founder discussion. It contains **34 candidate work items**, four explicitly deferred investment hypotheses, and a source-coverage map. Inclusion is not approval to implement. Priorities below are recommendations. Phases 1 and 2 deliver only their explicitly selected slices; the remaining roadmap is not authorized by those implementations.

The [Phase 1 handoff](internal/research/2026-10-11-phase-1-handoff.md) specifies a bounded subset, seven ordered tasks and friction acceptance scenarios. Its selected slices are now implemented in the working tree: [implementation evidence](internal/research/2026-10-11-phase-1-implementation.md) records passing deterministic checks and outstanding live host/model validation. The [Phase 2 handoff](internal/research/2026-10-11-phase-2-handoff.md) specifies the next bounded coordination increment, eight ordered tasks and C1–C12 scenarios. The founder authorized implementation on 2026-10-13; its selected slices are now implemented with passing deterministic checks and observed native startup: [Phase 2 evidence](internal/research/2026-10-13-phase-2-implementation.md). Interactive clear/bare "dalej" and model trials remain unobserved; whole backlog IDs are not closed. Both scope tables distinguish selected slices from deferred work; all 34 opportunities remain visible here. IDs are stable: append new ones, do not renumber; record a reason when merging or closing an item.

Planning update **2026-10-14:** the founder accepted the preview-before-build direction and requested an implementation handoff for **Sol**, plus a Phase 4 proposal. The [Phase 3 handoff](internal/research/2026-10-14-phase-3-handoff.md) specifies eight pending tasks, preview/decision/resume behavior and pre-release acceptance. It selects B17 and bounded B12/B14/B15/B16/B18/B21/B34 slices; it does not authorize implementation or publication. In a subsequent instruction, the founder accepted all four points of [Phase 4 — GSR Autopilot](internal/research/2026-10-14-phase-4-direction.md): change-impact mapping, per-task context packages, durable sequential execution with bounded retries, and before/after outcome reports. This develops selected B07/B11/B13–B16/B18–B20 slices. Point 3 explicitly retains further automation as a potential Phase 5 direction, not a Phase 4 completion dependency or approved Phase 5 scope. The earlier first-use/release/deployment proposal remains deferred under B22–B25. Phase 4 planning is accepted; implementation has not started and is not a dependency of releasing GSR after Phase 3. No backlog ID is closed by these planning documents.

Verification update **2026-10-14:** the [Phase 1–2 technical and product review](internal/research/2026-10-14-phase-1-2-verification.md) reconfirms 40 passing checks and native startup, but records five open findings V1–V5: default profile omission of required checks (B02/B10), administrative manifest changes invalidating evidence (B03/B15), focused-feature status routing (B06/B11/B15), equivalent docRoot spellings affecting normalization (B03/B04), and unrelated duplicate headings disrupting handoffs (B15). These were not fixed by the review. Both phase directions remain recommended; host/model trials and measured UX/cost benefit remain outstanding. Prior implementation reports are historical evidence, not a clean review of the current candidate.

Execution-order decision **2026-10-15:** the founder requested that all five review fixes V1–V5 be planned **before implementation of Phases 3 and 4**. The [correction plan](internal/plans/2026-10-15-phase-1-2-corrections.md) is the prerequisite: fix once before Phase 3 and confirm completion before Phase 4. Correctness/regression/integration checks remain part of delivery. Comparative effectiveness studies (cost, time, UX/friction, user pilots and model-efficiency benchmarks under B18/B19/B21) move to **after all four phases are complete and the tool is available to users**; they are not entry or completion gates for Phases 3–4. Preserve ordinary evidence and versioned inputs for later comparisons. This supersedes earlier recommendations to measure effectiveness or run a benefit pilot before proceeding. All fixes are still pending; this update authorizes planning only.

## Founder request

> zgadzam się ale mam też wrażenie, że poza tymi dwoma punktami jest tego więcej co by moźna potraktować jako przyszły backlog, nie chciałbym aby po tym vałym researchu zapisać w planie tylko dwa punkty

Classification: planning/change request, captured 2026-10-11. Preserve the entire research opportunity set while preparing detailed execution plans for the next increment. The two discussed workstreams—reliability and specification of new behavior—are the immediate planning scope, not the entire roadmap.

## How to use this backlog

- **Prepare now:** sufficiently grounded to include in upcoming task/specification planning. Not yet approved for execution.
- **Next candidate:** valuable extension; select after its prerequisite or pilot supplies evidence.
- **Explore later:** a larger product or architecture choice that needs a specific trigger before investment.
- **Evidence:** `reproduced` means local isolated probes, not a live host incident; `source` means observed in current code/instructions; `historical` means earlier-release user feedback; `hypothesis` means proposed value, not validated demand.

Every row records the problem or opportunity, intended benefit, provenance, dependencies, and next action or revisit trigger. Detailed implementation tasks must add file boundaries, tests, acceptance criteria and explicit exclusions. These rows are not a substitute for that handoff.

Primary sources within the repository:

- [Implementation audit](internal/research/2026-10-09-implementation-audit.md), including I1–I8 and reproduction harness.
- [Workflow audit](internal/research/2026-10-09-workflow-audit.md), including numbered findings 1–10.
- [Market landscape](internal/research/2026-10-09-market-landscape.md), documentation snapshot, not competitor outcome testing.
- [Current strategy and pilot proposal](internal/research/2026-10-09-gsr-direction.md).
- [Earlier backlog](../gsr/docs/backlog.md), retained as historical proposal context. Current disposition of its open ideas is mapped below; do not execute both an old proposal and its mapped successor as separate tasks.

## A. Reliability and protocol correctness

All items in this group are **Prepare now**. A detailed plan should distinguish small bounded fixes from decisions about the shared evidence architecture.

| ID | Problem and intended outcome | Evidence / origin | Dependency and next planning step |
|---|---|---|---|
| GSR-B01 | Installed statusline fails to parse despite installer success. Preserve valid script structure, verify the installed artifact, and make installation failure visible. | Implementation I1; reproduced actual temporary installation. | Independent first repair. Specify clean install, refresh, version detection and custom-statusline preservation acceptance cases together. |
| GSR-B02 | Command text is mistaken for a passing gate. Record actual configured check results and coverage; echo, masked failure, missing checks and evidence-shaped prose must not establish success. | Implementation I2/I5; reproduced hook fixtures; failed live-event caveat remains in audit. | Design together with B03/B04/B07. Decide result provenance and failure/unknown semantics before assigning implementation. |
| GSR-B03 | Shell edits, restarts and project changes can leave unjustified verification state. Bind evidence to project/worktree and covered code/spec inputs; unknown or changed inputs become unverified/stale. | Implementation I3/I4; reproduced fixtures. | Requires shared contract with B02/B07. Specify external mutations, interrupted writes, changed requirements and multi-session/project isolation; do not merely expand tool-name matching. |
| GSR-B04 | Supported documentation roots and gate commands are inconsistent across skills, agents and hooks. Establish one project-location and check-configuration contract. | Implementation I6 and persistence section; workflow finding 6; source and fixtures. | Inventory every consumer, including npm/TypeScript defaults. Specify alternate docs roots and a non-JavaScript project; define migration and fallback without duplicating documents. |
| GSR-B05 | Adaptive weights, batch continuation, hard foundations and unconditional waits contradict one another. Define consistent precedence and question/approval behavior. | Workflow findings 1–2 and 4; source. | Preserve founder ownership and existing authorization. Build scenarios for spike, production, batch, deferral and explicit review requests; reconcile text before adding new modes. |
| GSR-B06 | Existing-product entry can reach build without a feature specification. Connect codebase onboarding to focused feature scoping. | Workflow finding 5; source. | Depends on B04/B05; feeds B11. Specify behavior when PRD/spec is absent, partial or already adequate. Avoid forcing a whole-product rewrite. |
| GSR-B07 | Spec drift, pending/verified/accepted transitions and static-versus-behavioral evidence lack one meaning. Define and test pin state and evidence semantics. | Workflow findings 7–9; implementation persistence; source. | Joint design with B02/B03. Cover orphan IDs, missing references, changed wording under the same ID, first verification and explicit human acceptance. |
| GSR-B08 | Context monitoring depends on using GSR's statusline. Preserve custom rendering without silently losing telemetry, or explicitly report that monitoring is unavailable. | Implementation I7; source dependency, not live-host tested. | After B01; inspect supported host telemetry before choosing a repair. Do not claim a provider-independent monitor without evidence. |
| GSR-B09 | Update detection and release metadata can disagree with installed state. Make version reporting reliable across cache/checkouts and align lockfile/version checks. | Implementation persistence/portability section; source inference; update networking not tested. | Use bounded fixtures for installed/development/older/newer versions and paths. Separate metadata correction from any larger updater redesign. |
| GSR-B10 | Current CI passes while installation and protocol defects remain. Add targeted regression coverage, installed-plugin smoke, broader reference/schema checks and a justified platform matrix. | Implementation I8; current ten-test suite passes alongside reproduced failures. | Add each proven regression with its repair B01–B09. Select supported OS/runtime scope explicitly; separate deterministic tests from paid model evaluations in B18. |

## B. Complete process coordination and collaboration

These extend existing GSR capabilities. They are not a proposal to rebuild scope, research, batch execution or verification from scratch.

| ID | Horizon | Opportunity and intended outcome | Evidence / origin | Dependency and next action / revisit trigger |
|---|---|---|---|---|
| GSR-B11 | Prepare now | A single context-aware start/continue path coordinates idea, materials, existing-product change and resumed work. Explicit commands remain available. | Strategy; workflow entry/handoff findings; founder's value in not managing several skills. Hypothesis. | Specify after B04–B06. Pilot all entry cases; measure how often users must choose the next process command manually. |
| GSR-B12 | Prepare now | Adapt explanation depth, review objects and authorized autonomy per task. Preserve power-user constraints and guide users when needed without fixed beginner/expert labels. | Founder clarification; workflow approval friction; earlier deep-scope proposal. Hypothesis plus source contradictions. | B05/B11. Define natural-language steering and persisted preferences. Expertise/verbosity must not imply permission to publish, spend or change scope. |
| GSR-B13 | Prepare now | Research records link claims, sources, dates, uncertainty and counterevidence to decisions; reuse valid findings and reopen changed assumptions. | Workflow findings 3–4; strategy research loop. Source and hypothesis. | B11/B15. Define refresh triggers and stopping/budget rules. Test a scope change that invalidates a prior recommendation and a routine edit requiring no new research. |
| GSR-B14 | Prepare now | Select relevant installed skills, discover actual gaps, and delegate useful independent work without making the user coordinate the components. | Founder explicitly identifies this as core value; build's existing skill selection. Hypothesis about improved routing. | B05/B11/B12. Specify selection, reuse, missing-tool fallback and installation boundaries; compare complete tasks with redundant skill searches removed. |
| GSR-B15 | Prepare now | Preserve decisions, rationale, constraints and next action across sessions; show the consequences of a changed decision. | Existing Markdown persistence; strategy; founder power-user needs. Source gaps and hypothesis. | B03/B04/B07. Specify authoritative documents versus derived summaries, resume reconciliation and a single-writer approach before considering complex storage. |
| GSR-B16 | Prepare now | Explain completion through a short outcome report with detailed evidence available; preserve expert access to commands/diffs. Strengthen behavior assertions and explicit browser-unavailable states. | Workflow finding 9; existing visual tier; earlier terminal-polish idea. Source and hypothesis. | B02/B03/B07. Specify static/test/browser/human evidence, actionable next steps and review depth. Test comprehension and seeded runtime failures. |
| GSR-B17 | Next candidate | Extend D-pins into experiments: uncertainty → cheapest useful evidence → human decision → affected requirements. Offer visual/interactive alternatives where they help. | Existing D-pins; workflow finding 10; strategy. Hypothesis. | B12/B13/B15/B16. Revisit when ambiguous decisions delay a pilot or create rework. A working vertical slice is optional by uncertainty, not mandatory ceremony for every change. |

## C. Evaluation, models and review quality

| ID | Horizon | Opportunity and intended outcome | Evidence / origin | Dependency and next action / revisit trigger |
|---|---|---|---|---|
| GSR-B18 | Prepare now | Evaluate GSR's actual workflows with repeatable scenarios, failure injection and host-only baselines. Score beginners and power users separately. | All audits; absence of current end-to-end outcome measurements. | Start scenario design alongside B01–B17. Run model-backed trials only after execution/budget approval; include restarts, changed intent, missing tools and deceptive success. |
| GSR-B19 | Next candidate | Select model/effort and escalation based on measured outcomes, available host capabilities and an agreed budget. Expose relevant cost/latency trade-offs. | Static role aliases in implementation audit; current model research. Hypothesis, no model benchmark performed. | B18 plus B14. Revisit after baseline trials show where stronger reasoning or cheaper execution changes cost per accepted result. Avoid global mid-task switching by assumption. |
| GSR-B20 | Prepare now | Validate execution plans before handoff and calibrate independent spec/quality review to catch meaningful defects without repetitive review loops. | Existing staged reviewers; earlier plan-self-review and review-skill proposals; founder's weaker-model handoff question. | Define a task contract now: scope, files, dependencies, tests, evidence and escalation. Use B18 to decide where extra reviewers justify cost; no claim that a model judge proves correctness. |
| GSR-B21 | Prepare now | Observe real use and collect consented evidence of friction, reminders, decision comprehension and completed outcomes; maintain an issue/evaluation corpus. | Only two archived v0.1.x reports; founder audience clarification. | Begin with founder task plus beginner task; agree observation and data retention. Automatic telemetry is a separate product/privacy decision, not implied by this item. |

## D. First use, release and ongoing improvement

| ID | Horizon | Opportunity and intended outcome | Evidence / origin | Dependency and next action / revisit trigger |
|---|---|---|---|---|
| GSR-B22 | Next candidate | Help users reach a working environment: detect missing host/tools/services, explain setup and verify necessary capabilities. Experts can reuse existing setup. | Workflow install/provisioning gaps; market integrated-builder experience. Hypothesis. | B04/B11/B21. Advance earlier if observed users cannot reach their first useful task. Never interpret credentials merely existing as verified service health. |
| GSR-B23 | Next candidate | A branch/release completion flow covers verified changes, changelog from accepted requirements, review/merge options and scoped cleanup. | Earlier ship and CI/changelog proposals; strategy. | B02/B03/B07. Specify provider/action boundaries and user authorization. A PR, merged change and published product are distinct milestones. |
| GSR-B24 | Next candidate | Guide deployment or local installation, verify the actual core journey, explain relevant operating-cost assumptions and recovery. | Existing deployment guidance; strategy first-use gap. Hypothesis. | B16/B22/B23 as applicable. Pilot one project type before expanding; personal tools need not acquire hosting or analytics. |
| GSR-B25 | Next candidate | Connect real-use feedback to goals, requirements and changed decisions; propose and verify the next improvement. | Existing feedback/backlog skills; strategy learning loop. Hypothesis. | B13/B15/B24. Revisit when pilots reach real use. Record observed feedback separately from model-generated suggestions or simulated customers. |
| GSR-B26 | Next candidate | Observe dev-server/test/CI failures during authorized work so problems surface before final verification. | Earlier runtime-monitor proposal. Feasibility must be refreshed per host. | B02/B04/B14. Revisit when late-discovered runtime defects recur; validate supported monitor lifecycle and cleanup, not just a prompt instruction. |
| GSR-B27 | Next candidate | Run requirement/evidence checks in CI and expose stale or missing proof in code review. | Earlier CI verification proposal; market freshness baseline. | B02/B03/B07/B10. Revisit when local evidence semantics are stable and a team/PR use case exists; remote comments require appropriate authorization. |

## E. Reuse, teams and future distribution

| ID | Horizon | Opportunity and intended outcome | Evidence / origin | Dependency and next action / revisit trigger |
|---|---|---|---|---|
| GSR-B28 | Next candidate | Tested host adapters preserve the method across environments and report which hooks, tools, permissions and verification capabilities are available. | Claude-specific packaging; market portability; official plugin limitations captured in strategy. | B04/B10/B18. Validate one additional host after core behavior is dependable; migrated skill text alone does not establish parity. Refresh external host contracts first. |
| GSR-B29 | Next candidate | Import existing PRDs/spec formats into GSR with preserved intent, IDs/provenance and explicit unresolved mappings. | Earlier spec-import proposal; market SDD adoption. Hypothesis. | B06/B07/B15. Revisit when a real user brings an external spec; start one format and test round-trip/loss awareness instead of claiming universal import. |
| GSR-B30 | Next candidate | Define team versus personal memory; scope, deduplicate and revise Learned Rules without silently promoting individual preferences into project policy. | Earlier native-memory bridge; strategy instruction hygiene. Hypothesis. | B12/B15; test a shared-repository use case. Review conflicts and promotion authority; accumulating more memory is not automatically better. |
| GSR-B31 | Explore later | Help users author and validate reusable project skills with clear triggers, resources and compatibility. | Earlier writing-skills/meta-skill proposal. Hypothesis. | B14/B18. Revisit when repeated project-specific workflows are not covered by existing skills; use existing creation tooling before inventing a new framework. |
| GSR-B32 | Explore later | A companion interface could make decisions, previews and progress easier to navigate while preserving expert controls. | Earlier terminal-polish/TUI ideas; strategy host-SDK options. Hypothesis. | B11/B12/B16/B21. Prototype only when observed host UI friction persists after improving conversational information design. Compare SDK integration with fragile output interception. |
| GSR-B33 | Explore later | Hosted delivery or integration into an existing builder could remove local setup while retaining product intent and evidence. | Strategy hosted alternative; market distribution surfaces. Hypothesis. | B21/B22/B28 plus demand/economics decision. Revisit when setup materially blocks adoption; evaluate host integration before operating a full platform. |
| GSR-B34 | Next candidate | Maintain a small validated collection of reference projects, domain examples and reusable patterns that demonstrate the complete workflow. | Strategy evaluation corpus and domain examples; historical printing and desktop cases. Hypothesis. | B18/B21. Begin with consented/synthetic fixtures and known failure cases; publish or package examples only after review. Revisit domain packs when recurring needs are observed. |

## Investment hypotheses deliberately parked

Preserving an idea is not a reason to schedule it. These remain visible with explicit triggers and can be closed if evidence never supports them.

| Hypothesis | Why not schedule now | Revisit only when |
|---|---|---|
| Standalone IDE / new coding runtime | Existing hosts already execute agents; this would create a much larger maintenance surface. | B28/B32/B33 demonstrate a critical capability that cannot reasonably be provided through host integration. |
| Public GSR skills marketplace | Discovery, trust and maintenance are substantial; B14/B31/B34 can address narrower needs first. | Users repeatedly create/share validated extensions and existing distribution is insufficient. |
| Fine-tuning | No representative GSR training/evaluation corpus or demonstrated prompting/tool ceiling exists in the reviewed repository. | B18/B21 establish a persistent measurable failure that stronger prompts, tools and model selection do not resolve. |
| Vector-memory platform | Current failures concern authority, scope and consistency more than semantic retrieval at scale. | B15/B30 show retrieval is the actual bottleneck on a sufficiently large corpus and simpler indexing is inadequate. |

## Already present: retain, extend, do not reintroduce

Progressive questions, concise PRD summaries, weights, D-pins, quick tasks, batch execution, optional notifications, saved plans/debug sessions, staged review, pins, browser walkthroughs and deployment guidance already exist in v0.5. The [workflow audit](internal/research/2026-10-09-workflow-audit.md) locates their implementation/instructions and limitations.

In particular, the July visual-tier, hook-enforcement and batch-notification proposals have shipped corresponding mechanisms. Follow-up work maps to B01–B08/B16, B11/B12/B28 as appropriate; they are not new greenfield features. No new notification subsystem is scheduled without a demonstrated capability gap.

## Research coverage map

This maps the actionable findings and proposals, not every illustrative technology mentioned in the sources. External capability claims remain the October 9 documentation snapshot and must be refreshed before integration work.

| Source finding or proposal | Current disposition |
|---|---|
| Implementation I1 / I2 / I3 / I4 | B01 / B02 / B03 / B03 |
| Implementation I5 / I6 / I7 / I8 | B02+B07+B16 / B04 / B08 / B10+B18 |
| Update detection, lockfile/version drift | B09 |
| Duplicated gate commands and custom docs paths | B04 |
| Static model routing and provider assumptions | B19 / B28 |
| Workflow 1–2: contradictory foundation, weight and approval rules | B05+B12 |
| Workflow 3–4: stale or duplicate research | B13; weight contradictions also B05 |
| Workflow 5–6: existing-product bridge and documentation root | B06 / B04 |
| Workflow 7–9: drift, pin transitions, static versus behavioral proof | B07+B02+B03+B16 |
| Workflow 10: engineering sketch versus assessable prototype | B17 |
| Beginner friction: install, decisions, continuation, verification, launch | B22 / B12 / B11 / B16 / B24; hypotheses require B21 |
| Founder power-user value and broader audience | B11–B15; separately measured by B18/B21 |
| Market hypotheses: experiments, trustworthy acceptance, decisions, host reuse, lifecycle | B17 / B02+B03+B07+B16 / B12 / B28+B33 / B23–B25 |
| Earlier deep-scope mode | Absorbed into B12 as task-specific pacing; no separate mandatory mode planned |
| Earlier plan self-review | B20 |
| Earlier branch finishing / pin-driven changelog | B23 |
| Earlier requesting/receiving review skills | B20; packaging as new skills remains a design choice |
| Earlier writing-skills framework | B31 |
| Earlier terminal polish / custom rendering / TUI wrapper | B16 for information design, B32 if a new surface is justified |
| Earlier runtime monitoring / CI verification | B26 / B27 |
| Earlier native memory bridge / foreign spec import | B30 / B29 |
| Strategy evaluation and stronger-model comparison | B18+B19+B20+B21 |
| Strategy reusable domain examples | B34 |
| Strategy companion/hosted product and large deferred investments | B32+B33 and parked hypotheses |

## Handoff to the next planning or implementation model

Read the [current strategy](internal/research/2026-10-09-gsr-direction.md), this backlog, and the relevant audit sections. Preserve the founder clarification: beginners and power users are both in scope; automatic coordination of research and skills is core value.

The research originally proposed two planning workstreams:

1. **Reliability execution plan:** principally B01–B10, with B20's task contract. Separate reproducible defects from design decisions and make tests fail for the right reason before repair.
2. **Adaptive workflow specification:** principally B11–B16, evaluated through B18/B21; B20 governs the implementation handoff. Specify the meaningful user behavior before choosing implementation details.

The founder subsequently clarified that pleasant, lightweight, fluid work is a requirement. The [Phase 1 handoff](internal/research/2026-10-11-phase-1-handoff.md) combines narrower slices of these workstreams: installation, shared project/check contracts, fresh evidence, consistent authorization, minimal resume and concise reporting. It specifies architecture choices, T1–T7, scenario acceptance and an implementation-start prompt. Remaining slices retain their horizons above. No extra user-facing approval or mode-selection step is included. The founder subsequently authorized and received the bounded Phase 1 and Phase 2 implementations; their required live validation remains outstanding. Phase 2 execution followed the explicit 2026-10-13 instruction, not a new GSR product gate.

These workstreams do not erase B17 or B19–B34. Every later plan must list selected IDs, prerequisites, and explicitly deferred IDs with links here. No item becomes approved or complete merely because it appears in a roadmap. Record evidence and founder decisions when its status changes.


## Phase 2 planning handoff — 2026-10-11

[Phase 2](internal/research/2026-10-11-phase-2-handoff.md) selects the focused
existing-product bridge (B06), start/continue coordination (B11), explicit task
preferences (B12), bounded research reuse (B13), installed skill selection (B14),
and continuity/results (B15–B16), with B04–B05/B10/B18/B20 support. Eight tasks
specify files, dependencies, tests and exclusions. No whole backlog ID is closed
merely because one slice is selected. B08–B09, B17, B19 and B21–B34 remain deferred;
full B07 pin/drift semantics and multi-host parity are outside this increment.

Status at the 2026-10-11 planning handoff: prepared, not implemented; superseded by
the implementation update below. Phase 1's live S1–S8 gap is
carried into readiness/evaluation rather than silently declared passing. See the
handoff's separate implementation, host/model validation and product-benefit states.


### Founder clarification — 2026-10-13

Large tasks often exceed one context window. Preserve deliberate `/clear` plus
next-stage command handoffs; their purpose is context hygiene, not another task
approval. The Phase 2 contract now targets coordination **across bounded sessions**:
saved stage/partial checkpoints, sufficient references, accurate next-step selection
and fresh-context resume. No automatic host session lifecycle or one-conversation
completion promise is included. Context resets are evaluated separately from redundant
questions; useful research/spec/skill coordination remains in scope.


### Preferred continuation accepted — 2026-10-13

The founder endorsed the proposed compact handoff → `/clear` → **"dalej"** flow.
The Phase 2 coordinator selects the saved next step and loads a minimal relevant
start packet; existing commands remain optional direct controls. Long builds use
accurate checked/partial checkpoints. Acceptance includes actual bare-message
resume after clear, constraint/cadence retention and an explicit host fallback gap
when unsupported. This is a planning preference, not implementation authorization.

### Selected slices implemented — 2026-10-13

The subsequent instruction "działaj z implementacją Fazy 2" authorized bounded
execution. [Implementation evidence](internal/research/2026-10-13-phase-2-implementation.md)
records ordered delivery, 40 passing tests, retained runner evidence and observed
native startup. Interactive clear/bare "dalej", direct-command and partial/checked
checkpoint model trials remain unobserved; C1–C12 and carried Phase 1 live behavior
still need validation. No whole backlog ID is closed and no product-benefit claim,
release, installation or paid evaluation follows from these deterministic results.

### V1–V5 delivered locally — 2026-10-15

The current instruction authorizes corrections, Phase 3, and a detailed plan followed
by Phase 4 implementation, without commits/publication. All five corrections are
implemented with 45 passing local tests and an isolated Claude Code 2.1.274 startup;
model outcomes remain unobserved. See the [correction results](internal/plans/2026-10-15-phase-1-2-corrections.md)
and [next-step handoff](internal/plans/2026-10-15-development-handoff.md).
Phase 3 implementation is next; no whole backlog ID is closed.

### Phase 3 local implementation — 2026-10-15

Bounded preview guidance/records, scope/build routing, feedback/decision ownership,
resume checks, derived status map and a synthetic booking/CLI example are delivered.
[Evidence](internal/research/2026-10-15-phase-3-implementation.md): 51 local tests,
native install/upgrade/startup; browser/model trials and public readiness remain unverified.
No broad backlog item is closed, publication or effectiveness claim. The current owner
instruction also covers the detailed Phase 4 plan and implementation, after this local stage.

### Phase 4 local mechanisms delivered — 2026-10-15

The approved [execution plan](internal/plans/2026-10-15-phase-4.md) preceded code.
All four selected slices are delivered: current change-impact links, bounded per-task
context, persistent sequential queue/repeat limits and actual-artifact before/after
reports. [Implementation evidence](internal/research/2026-10-15-phase-4-implementation.md):
68 local tests, native install/upgrade/startup and an actual installed-helper product-edit
scenario pass. Model natural-language/interactive-clear and Phase 3 browser outcomes
remain unobserved; public readiness is not declared. No broad B07/B11/B13–B16/B18–B20
item is closed, no measured effectiveness claim, publication or approved Phase 5 scope.
