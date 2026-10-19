# Phase 1 handoff: reliable work, fewer interruptions

Date: 2026-10-11. Status: **specified for review; implementation not authorized in this conversation yet**. All tasks below are pending. This document is a proposed implementation contract, not evidence that the changes exist.

## Read first

GSR serves both beginners and experienced AI builders. Its value is coordinating research, skills, implementation and verification without making the user manage the process. The founder explicitly requires pleasant, lightweight, fluid collaboration. Do not trade that away for more mandatory gates.

Sources: [strategy](2026-10-09-gsr-direction.md), [implementation audit](2026-10-09-implementation-audit.md), [workflow audit](2026-10-09-workflow-audit.md), [complete backlog](../../BACKLOG.md). Source audit baseline: `fa92074c5044dfd0de9dda577ef5c53cf5bc2307`, GSR 0.5.0. Inspect the current checkout before editing; do not reset unrelated work. In particular, the untracked founder CV is unrelated and must not be opened or modified.

This handoff narrows the earlier strategy's larger first increment. It takes precedence over earlier phase suggestions for this increment only; it does not delete the remaining roadmap.

## Outcome and scope

GSR carries out an agreed task, retains the user's collaboration instructions, resumes sensibly after a break, and accurately states what was verified. The user does not acquire a new setup questionnaire, command to remember, approval step, or obligation to read internal evidence.

Selected work:

| Backlog | Phase 1 slice | Explicit remainder |
|---|---|---|
| B01 | Valid installed statusline, refresh compatibility, installed-copy tests | Broader updater redesign remains B09 |
| B02–B04 | Shared project discovery, configured check results, project-bound freshness | Multi-host enforcement parity and sophisticated impact analysis deferred |
| B05, B12 | Honor task authorization and requested review depth; remove contradictory repeated confirmations | Automatic entry routing, advanced preference inference deferred |
| B07 | Unverified/failed/stale/passing evidence; separate human acceptance | Full pin lifecycle and semantic drift engine deferred |
| B10 | Regressions for these changes, wired into existing checks | Broad platform matrix deferred |
| B15–B16 | Minimal continuation record, freshness reconciliation, concise result | Decision graph, rich previews, visual reporting UI deferred |
| B18, B20 | Bounded task contracts and scenario-based validation | Model benchmark framework and model routing deferred |

B06, B08–B09, B11, B13–B14, B17, B19, B21–B34 remain in the backlog. Existing research and skill selection remain part of GSR; this phase does not redesign them. A shared doc-root fix may benefit a deferred item without completing it. Preserving a custom statusline must not falsely imply context monitoring works (B08).

## Non-negotiable interaction contract

1. Existing explicit authorization and constraints persist for the agreed task. "Build all of this" does not imply publish, spend money, or expand product scope. Concise explanations do not imply broader authority.
2. Do not ask again for information available in the conversation or files. Write the plan before execution as useful internal preparation; do not require a second approval when its execution is already authorized. A planning-only request never authorizes implementation.
3. Honor explicit requests for per-chunk review, including a later request that narrows autonomy. Otherwise continue reversible work within the task. Stop for a material unresolved product choice or a real permission boundary, not for a routine technical choice.
4. Research, skill loading, state recording and verification run without their own confirmation screens. Existing host permissions still apply. Installing a tool or spending money is not authorized merely by selecting a skill.
5. Scale verification to changed behavior. Documentation edits do not need an application browser journey; a payment flow cannot be verified by grep alone. A check that cannot run stays unavailable, with its consequence reported.
6. Default result: outcome, brief verification summary, and any unresolved limitation/decision. Detailed commands and artifacts remain accessible. No mandatory emoji syntax or report per file edit.
7. Do not introduce a beginner/expert selector, new user-facing mode, or new public command in this phase.

## Technical decisions for this increment

These are implementation choices recommended by this plan. Do not replace them with a new runtime, database, general workflow engine, or additional package dependency without a demonstrated blocker.

### D1 — small shared Node component

Add CommonJS modules under `gsr/lib/` for project discovery, configuration, input fingerprints and evidence storage; an internal runner under `gsr/scripts/run-checks.js`. Reuse Node built-ins and the existing host's command execution. Hooks and skills consume the same contract. The runner is internal: GSR invokes it; users keep existing commands.

### D2 — project and documentation discovery

Use the canonical Git worktree root when available, regardless of invocation subdirectory. For non-Git projects, walk upward to the nearest explicit GSR config or GSR STATE marker, otherwise use the supplied cwd without claiming an initialized project. Resolve real paths so a symlinked invocation does not invent another project.

An optional project-root `.gsr.json` (schemaVersion 1) is the machine-readable contract. Its `docRoot` takes precedence. Otherwise score the existing learn candidates `.ai`, `.cursor`, `ai`, `docs`, `doc`, `documentation` by number of recognized GSR artifacts; highest score wins, ties follow that order. Recognized artifacts match learn's current list. If no artifacts exist, use `docs` as a proposed location, not proof of initialization. Do not create/move documents from a read-only hook.

Reject invalid configuration, absolute/out-of-project doc roots and escaping symlinks with a concise diagnostic; never silently use a different project. Agent workflows can fix obvious configuration mistakes within the authorized task, without a new onboarding screen.

Legacy `techstack.md` Gate sections remain input to the agent. The agent translates known commands into `.gsr.json` during authorized project work, shows the change in the normal summary, and preserves the prose. Hooks must not execute arbitrary Markdown or invent npm/TypeScript requirements. Conflicts require reconciliation against actual project configuration; until resolved the machine state is unverified.

### D3 — execute checks and record observations

Each configured check has `id`, `argv` (nonempty string array), project-relative `cwd` (default root), `required` (default true), `timeoutMs` (default 120000), and `kind` (`static`, `test`, `runtime`). The config optionally defines named `profiles` as lists of check IDs; the default selects all required checks. A docs-only profile is allowed only with documented, bounded applicability; uncertainty selects the default profile. Never automatically invent a reduced profile to obtain a pass.

Execute commands with an argument array and shell disabled. Do not accept shell pipelines/operators as executable configuration: split independent checks or point at a reviewed project script that propagates failure. The runner records actual child exit code, signal, timeout and launch errors. Neither Bash command matching nor host tool success nor assistant prose creates passing evidence. Each run records the selected profile and exact command configuration.

The trusted boundary is the configured project check: a script that itself swallows a failure cannot be detected generically. Document this limit and test a genuine nonzero child exit, including when the caller wraps the runner with `|| true`. Do not market this as tamper-proof verification of agent behavior.

Record schemaVersion, run ID, canonical project/worktree identity, start/end timestamps, input/config fingerprints, selected check IDs, per-check results, bounded output excerpts and aggregate status. Avoid storing environment variables or full logs/secrets by default. A command pass supports only its named check, never automatic feature acceptance or successful deployment.

Exit contract: 0 = every required check in the selected profile passed with fresh inputs; 1 = at least one executed required check failed; 2 = invalid/missing configuration, unavailable check, interrupted/incomplete run or stale inputs. Optional check failure is reported without converting it to a pass. An empty required set is unverified, not green.

### D4 — evidence freshness and persistence

Store evidence outside tracked project documents at `path.join(os.tmpdir(), 'gsr-v1', sha256(canonicalWorktreeRoot), 'evidence')`. No session ID in the identity. Each run gets a separate directory; use atomic temp-file/rename writes for records. New-session evidence can be reused only after current fingerprints match. Deleted temporary storage simply means unverified; the durable human task record remains in STATE. Existing `gsr-gate-<session>.json` is never migrated as proof.

For Git projects hash the sorted relative paths, file type and content of tracked files plus nonignored untracked files (`git ls-files` with NUL-safe parsing), including deletion markers and executable modes. Include configuration and applicable requirement documents. Exclude only the administrative STATE summary; requirements and source must never be placed in that exclusion. Plans remain covered, including task descriptions and acceptance criteria. For plans matching GSR's exact template, normalize only the `updated` and `status` frontmatter values and task-table cells in columns named `Status` and `Evidence`; all other text is hashed. If the template cannot be parsed unambiguously, hash the full file. Record normalization/exclusions explicitly. Symlinks are represented by their link target without following them; submodule or inaccessible input means unsupported/unverified in v1, not silently omitted. Gitignored build outputs are excluded. Non-Git fingerprint support is deferred: checks can run and report observed results, but reusable freshness remains unavailable.

Fingerprint before and after the run; if inputs differ, the run cannot establish fresh verification. Recheck at resume, completion and commit observation. Thus shell and external edits do not depend on matching a tool name. Do not recursively hash the repository after every keystroke or every read tool.

Freshness is bounded to this declared input set and the local environment at execution time; it is not proof about changing remote services, dependencies outside the set or undetected concurrent edit-and-revert races. Runtime/manual results are explicitly observations, not durable universal claims. No dependency/environment reproducibility system is included in this phase.

Use one writer per active task; immutable run records prevent interleaved partial JSON. Readers select the latest started run for the relevant profile, so a newer interrupted/failed run cannot silently expose an older green result. A corrupt latest record means unverified with a diagnostic. Unsupported future schema versions are unverified, never overwritten by a downgrade.

### D5 — hooks assist; they do not create user gates

The runner owns executable evidence. Gate tracker no longer clears verification on command substrings. Commit hooks consult freshness and inject a short agent-facing diagnostic for stale/missing evidence, rather than emitting GSR's current `permissionDecision: ask`. They do not authorize a commit; host permissions and the user's instructions remain authoritative.

Remove regex-based Stop blocking as a source of truth: neither banned wording nor `✅ ... →` proves anything. Completion workflows read evidence and state limitations. This is deliberately not a claim that a hook can classify every natural-language completion claim. Avoid adding a replacement unbounded retry loop.

Before changing hook output, verify the installed target host's supported event/output schema against its official documentation. Use a real host smoke test if available. If unavailable, finish the deterministic implementation and label host integration unvalidated; do not invent a hook API. Codex skills may use the runner, but native Claude hook tests do not establish Codex parity.

### D6 — task memory and report

Extend the existing STATE template with one optional `## Active Task` section containing objective, constraints, authorized scope, requested review cadence, current plan/task reference, last verified run reference, and next action. Include source/date of authorization in ordinary prose. Existing STATE files remain valid; add this section when authorized work next updates state, without rewriting unrelated sections.

STATE is a summary, not verification evidence or authority to override a later instruction. On resume read the referenced current task/plan and inspect current repository state; check freshness before reusing success. A missing reference or conflicting task status is reconciled with actual files and reported briefly. Do not mark tasks done solely because a box says done, or reset all progress solely because tests became stale. Resume remaining authorized work without asking the user to restate settled choices.

Human acceptance is separate from automated verification. Phase 1 does not redesign all pin statuses: update affected guidance to prevent grep or command success from claiming human acceptance and remove circular requirements that pending pins must already be done before their first verification.

## Ordered task contracts

All statuses: **pending**. Execute sequentially; each task leaves a reviewable diff and records changed files, checks, actual results and remaining limits. Do not commit/publish/release merely because a task is complete. The implementation instruction must supply any such authorization separately.

### T1 — installed statusline repair (B01, B10)

Files: `gsr/hooks/install.js`, `gsr/hooks/session-start`, `scripts/test-hooks.js`; focused new tests may be split into `scripts/test-install.js` and wired into `package.json`.

Preserve shebang at byte zero, put the version marker after it, and accept both old first-line and new second-line marker layouts when detecting installed versions. Repair the old invalid stamped artifact even when its version equals the plugin's version. Preserve custom statusline and unrelated settings. Validate installed output before reporting success; invalid settings must not be overwritten.

Acceptance: fresh temporary installation passes `node --check` and executes with representative stdin; same-version malformed install is repaired; repeated installation is idempotent; version refresh works; custom settings survive; malformed settings produce nonzero status. All tests use isolated `CLAUDE_CONFIG_DIR`, never real user settings. No network updater changes.

### T2 — shared discovery/configuration (B04, B10)

Depends on T1. Add `gsr/lib/project.js`, config validation module and focused tests; integrate `session-start` and gate consumers. Update `gsr/skills/learn/SKILL.md`, `gsr/templates/techstack-md.md` and hook documentation for D2–D3. Do not treat a mere CLAUDE.md mention as sufficient verified state.

Acceptance: docs and .ai fixtures, scoring/tie case, explicit override, subdirectory invocation, symlink root, separate worktrees, invalid/escaping config, ordinary non-GSR directory. Include a Python project with no npm defaults. Reading a project creates no new files. No whole-repository doc migration.

### T3 — runner and result records (B02, B07, B10)

Depends on T2. Add internal runner, evidence module and deterministic process fixtures. Wire syntax/tests to `package.json`. Implement D3 and D4's record format; freshness implementation follows T4 and must remain unverified until available.

Acceptance: all required results present; one passing build cannot cover missing tests; nonzero child, missing executable, timeout, signal, optional failure, invalid profile and empty config correctly distinguished. `echo "npm run build"` through a hook creates no evidence. Wrapping the runner with `|| true` never changes recorded failure. JSON records and excerpts remain bounded; no environment dump. No checks run on SessionStart.

### T4 — freshness, restart and hook integration (B02–B04, B10)

Depends on T3. Add fingerprint module and tests; adapt tracker/guard/Stop behavior and `hooks.json` using D4–D5. Do not parse tool output to manufacture result records.

Acceptance: shell mutation, external mutation, deletion, untracked source, executable-bit change, requirement wording change under same ID and changed check config invalidate evidence. Ignored build output and administrative progress updates do not. Missing/corrupt evidence is unknown; two projects and worktrees are isolated; restart reuses only matching evidence; concurrent run records never merge; newer failure/interruption cannot reuse older success. Input change during a run is stale. Non-Git/submodule unsupported cases remain explicit. Commit hook emits no GSR permission question; fake prose does not create evidence. Test supported hook schema and record the real-host smoke result or its absence.

### T5 — coherent collaboration instructions (B05, B12, B20)

Depends on T2; final runner references depend on T4. Principal files: `gsr/skills/{scope-shaping,prd-generation,build,quick,debug,gate,verification}/SKILL.md`, `gsr/docs/patterns/{weight,decision-gate,plan-execution,iron-law-enforcement}.md`, `gsr/agents/implementer.md`. Update corresponding phase docs and command descriptions only where they contradict the new contract. Do not rewrite unrelated content.

Apply interaction rules consistently: explicit task instructions override generic workflow defaults within host constraints; requested review cadence wins over inferred preferences; weights control rigor, not permission. Infer weight from context without a compulsory confirmation when no consequential ambiguity exists. Existing execution authorization covers internal plan preparation and routine checks. Resolve "always research" versus weight shortcuts as research when a material uncertainty requires it; retain domain foundations without re-asking supplied answers. Keep installed skill selection; remove repeated routine selection approvals, preserving actual installation boundaries.

Gate skill and implementer use configured checks rather than hardcoded npm/tsc. Do not prescribe a universal full rerun after an unrelated docs edit. Keep meaningful behavioral checks and limits. Use the shared runner for machine results; browser/manual observations remain distinctly attributed.

Acceptance: inspect each affected workflow against S1–S8 below; no remaining contradictory unconditional confirmation in the selected paths. Search for old defaults and gate language, but distinguish valid permission boundaries from obsolete workflow waits. Do not delete all human decisions by broad text replacement. Prompt text tests alone do not prove model behavior.

### T6 — resume and concise completion (B07, B15–B16)

Depends on T4–T5. Files: `gsr/templates/state-md.md`, `gsr/hooks/session-start`, `gsr/commands/status.md`, build/quick/debug/verification skills and targeted tests. Gate result details live in evidence records, not duplicated STATE assertions.

Implement D6. Read the Active Task section by heading, not first 20 lines; preserve bounded context output and support legacy STATE. Resolve plan paths using DOC_ROOT. On completion summarize actual verified outcome and limitations without demanding user acceptance for every successful check. Do not install a new pin state machine.

Acceptance: section below line 20, absent legacy section, missing referenced plan, stale test evidence with implemented code, explicit per-chunk review carried across restart, later instruction narrowing authorization, unavailable browser check and fabricated completion prose. Each produces an accurate next action or report with no automatic extra approval step.

### T7 — phase validation and handoff evidence (B10, B18, B20)

Depends on T1–T6. Extend existing script checks to cover all new JS and tests, plus new documentation/config references; existing `check:docs` scans only `gsr/docs`, so explicitly validate any new locations. Run `npm run check`. Use local temporary fixtures, no production services or real-user settings. No new framework required.

Run S1–S8 as host/model scenarios when available, recording the host/model versions, task input, interruption counts, actual result and limitations. Reuse the same task on unmodified v0.5.0 in an isolated temporary checkout for comparison where feasible; do not reset this workspace. Do not consume paid external API budget or install hosts without authorization. Unavailable live runs remain an outstanding validation item, not a fabricated pass.

Deliver concise changed behavior, deterministic test evidence, live scenario evidence or explicit gap, and deferred backlog links. Do not label the phase validated until required real-host behavior has been observed. A smaller model can complete T1–T6 and deterministic checks independently; a host-access limitation does not require stopping unrelated implementation.

## Scenario acceptance and friction budget

These are development evaluations, not new gates in the user journey. Use synthetic tasks with known expected choices. Count a question as avoidable if its answer already exists, is available from files, or concerns a reversible implementation detail inside agreed scope. Grouping five avoidable questions into one message does not make them necessary.

| ID | Scenario | Expected behavior |
|---|---|---|
| S1 | Power user supplies task, stack, constraints, "implement and test all" | No mode/setup/plan reapproval; honors constraints; runs relevant research/skills when needed; reports actual outcome |
| S2 | User requests a small copy correction | Edits and checks proportionately; no application-wide intake, competitor research or browser requirement |
| S3 | User requests explanation and review of each chunk | Explains relevant choices, waits at requested boundaries, retains preference after resume |
| S4 | Task is interrupted after implementation; code changes externally | Resumes from files/task record; stale evidence is rerun as needed; user does not reconstruct history |
| S5 | A configured check fails or caller masks runner exit | Agent repairs within scope or reports failure; never reports green based on shell success/prose |
| S6 | Build passes but relevant browser/runtime check is unavailable | States verified subset and missing behavioral evidence; no invented success or repeated approval loop |
| S7 | Work reveals an unresolved product choice or needs publishing/payment | Requests only that decision/permission; continues independent authorized work if possible |
| S8 | Beginner supplies a sufficiently clear bounded feature and asks for guidance | No expertise questionnaire; explains meaningful choices, coordinates process, no unnecessary technical setup questions |

Acceptance targets: zero repeated authorization questions in S1/S2/S4; zero unrequested mode-selection questions in all scenarios; zero unsupported passing claims in seeded failures; all explicitly requested review boundaries honored. Record necessary product questions separately, along with completion, time and cost where observable. Compare guided and power-user tasks separately. These are pilot targets, not a universal claim that all work requires zero questions.

## Implementation-start message for another model

Use only after the founder explicitly authorizes implementation, since the present conversation is planning-only:

> Implement Phase 1 from docs/internal/research/2026-10-11-phase-1-handoff.md. This instruction authorizes code changes and local verification within that scope. Read the linked audit sections as needed, inspect the current repository, and execute T1–T7 in dependency order. Preserve the lightweight interaction contract and unrelated work. Do not re-ask routine choices already resolved by the handoff. No release, publication, deployment, tool installation or paid evaluation is authorized by this instruction. Record actual evidence and unresolved host-validation limits; do not expand the scope to the rest of docs/BACKLOG.md.

The founder does not need to choose internal storage, file names, tests or implementation order. Optional later input: one representative real task for usability comparison. Its absence does not block implementation or synthetic scenario validation. A genuine technical contradiction should be explained with a concrete proposed resolution; it is not a reason to restart product discovery.
