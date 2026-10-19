# GSR market landscape — 2026-10-09

Research appendix. All external sources below were accessed on **2026-10-09**. This is a comparison of documented workflows, not an independent performance benchmark. No competitor was installed or exercised end to end; no accounts were created. Documentation establishes what vendors and maintainers describe, not the reliability of their execution or their effect on beginner success.

Repository links point to mutable `main` branches and documentation pages. Commit-pinned revisions were not captured; attempts to retrieve GitHub commit metadata through the browser failed. Treat this as an access-dated snapshot and refresh before making implementation or positioning commitments.

## Executive finding

Research agents, durable Markdown, human review, specification-first development, and browser verification are becoming common capabilities. GSR's defensibility is more plausibly the quality of the complete beginner experience: retaining ownership of product decisions while reaching a verified, operable product with less confusion. That is a hypothesis requiring user studies and comparative evaluation, not an established market advantage.

## Documented comparison

| Product | Planning and decision flow | Verification, continuity, and lifecycle |
| --- | --- | --- |
| GSD Core | Discuss, research/plan, execute, verify, ship; fresh-context subagents and multiple coding hosts. | Durable state and context; guided user acceptance; stale-verification detection; shipping creates a PR. |
| GitHub Spec Kit | Specification workflow plus separate idea-assessment and bug-fixing entry points. | Explicit convergence and verification outcomes; source-backed assessment artifacts; multiple host integrations. |
| BMAD | Optional idea pressure testing and research; planning sized to uncertainty and scope. | Persistent decisions and context; UX/architecture artifacts, agent review, human walkthroughs, autonomous execution after decisions stabilize. |
| OpenSpec | Explore, propose, apply, archive; iterative edits to planning artifacts. | Markdown scenarios, specification deltas and archives; optional verification; cross-repo stores in beta. |
| Kiro | Requirements, design, tasks; feature, bugfix and quick-spec paths. | Shared project configuration across surfaces; parallel tasks; requirement analysis and property-based testing with surface limitations. |
| Lovable | Chat, editable Plan, approve, Build; research subagents can support planning. | Persistent plans, preview, browser tests, managed hosting, monitoring, code and data migration paths. |
| Replit | Plan, revise, approve, execute in-session or background. | Browser test replays, self-correction, integrated publishing, runtime logs and monitoring. |
| Bolt | Beginner planning guidance, web research, contextual refine/implement actions. | Preview, visual edits, reusable skills, GitHub/download export and managed publishing. |

The following details and citations support the table.

### GSD Core

The old [gsd-build/get-shit-done repository](https://github.com/gsd-build/get-shit-done) is archived. Its opened README explicitly identifies **open-gsd/gsd-core** as the active successor. Search results still expose older documentation from the archived repository, so the successor is the comparison target here.

The [current GSD Core README](https://github.com/open-gsd/gsd-core/blob/main/README.md) describes discuss → plan → execute → verify → ship, fresh-context subagents, multiple coding hosts, and persistent `STATE.md` and `CONTEXT.md` files. These are documented design choices, not measured proof that context degradation is solved.

The [verification and shipping guide](https://github.com/open-gsd/gsd-core/blob/main/docs/how-to/verify-and-ship.md) walks users through observable deliverables, records UAT progress, diagnoses failures, and prepares fix plans. Shipping creates a GitHub PR. The guide also describes content fingerprints covering verification inputs: changed inputs make the prior verdict stale. This is especially relevant to GSR's acceptance evidence; a past pass must not automatically remain valid after changes.

### GitHub Spec Kit

The [current README](https://github.com/github/spec-kit/blob/main/README.md) describes three independent entry points: specification-driven development, bug fixing, and idea assessment. SDD follows constitution → specify → plan → tasks → implement → converge. Bug fixing separates assessment, repair, and testing, with verified, partial, or failed outcomes. This is broader than older descriptions of Spec Kit as only a specification template pipeline.

The opened [idea assessment guide](https://github.github.io/spec-kit/guides/assessment.html) documents an opt-in extension: intake → research → define → shape → decide. It collects supporting and opposing evidence, source confidence, affected users, goals, non-goals, success metrics, alternatives, and decision rationale. Results are go, needs-clarification, or kill; the files persist under `.specify/assessments/`. The process can run before source code exists and does not automatically start implementation. This directly overlaps a proposed generic “validate the idea first” enhancement for GSR.

### BMAD

The [current README](https://github.com/bmad-code-org/BMAD-METHOD/blob/main/README.md) emphasizes adaptable process, explicit decisions, durable context and specialized perspectives. Characterizing all current BMAD use as heavyweight agile ceremony would be inaccurate.

The [planning guide](https://docs.bmad-method.org/plan/choose-a-planning-path/) starts from whether intent is sufficiently defined. Clear intent can go to a compact specification; larger work gets stories and shared product or architecture documents as needed. Its skills produce persistent research, briefs, requirements and design artifacts.

The [idea exploration guide](https://docs.bmad-method.org/plan/explore-and-validate-an-idea/) describes pressure testing one question at a time, sometimes with a concrete proposed answer. The [research guide](https://docs.bmad-method.org/plan/research-a-decision/) supports native research, drafting a prompt for another research product, and processing an externally produced report into cited project context. Its controls distinguish research effort from claim-verification effort. The [human walkthrough](https://docs.bmad-method.org/build/walk-through-a-change/) explains changes in blocks and waits for human review; it is separate from agent review and does not itself issue a pass/fail verdict.

### OpenSpec

The [README](https://github.com/Fission-AI/OpenSpec/blob/main/README.md) documents explore → propose → apply → archive, portable Markdown artifacts, more than 30 host integrations, and beta stores for cross-repository planning. The [command contracts](https://github.com/Fission-AI/OpenSpec/blob/main/docs/commands.md) describe optional verification of completeness, correctness and coherence. Verification findings do not block archive; archive also warns rather than blocks on incomplete tasks. This leaves room for a stronger GSR acceptance contract if that contract is actually enforced and understandable.

Freshness caution: OpenSpec's comparison copy calls Kiro IDE/Claude-only. Kiro's current primary documentation contradicts this. Competitor comparison claims are not treated as authoritative evidence about another product.

### Kiro

Kiro's [specification docs](https://kiro.dev/docs/specs/) describe requirements, design and tasks, feature and bugfix paths, automatic parallel execution of independent tasks, and a quick-spec path without approval gates. The [documentation home](https://kiro.dev/docs/) describes shared `.kiro/` configuration across IDE, CLI and Web surfaces.

The [correctness guide](https://kiro.dev/docs/specs/correctness/) documents requirement-linked property-based tests. These tests are IDE-only in the published capability matrix, optional by default, and explicitly provide evidence rather than formal proof. Poorly chosen properties can pass while intended behavior remains wrong. GSR should preserve that distinction when reasoning about stronger automated verification.

### Lovable

The [planning guide](https://docs.lovable.dev/features/plan-mode) documents editable, versioned plans, clarifying questions, optional research subagents, and explicit approval before implementation. Current plans live in `.lovable/plan.md`; approved plans move to dated files. Durable plans and research agents therefore are not exclusive to terminal-based methods.

[Browser testing](https://docs.lovable.dev/features/browser-testing) interacts with the preview and captures screenshots, console/network information and user flows. It runs selectively. Authentication support depends on the backend: the documented external-provider path has limitations. [Project monitoring](https://docs.lovable.dev/features/project-monitoring) is a paid beta that schedules code and visitor-error checks.

The [ownership and deployment guide](https://docs.lovable.dev/tips-tricks/deployment-hosting-ownership) supports code export and data migration while explaining the work involved in replacing platform services and operating the app elsewhere. Exportable code is not equivalent to a fully portable product requiring no migration effort.

### Replit

The [Plan Mode guide](https://docs.replit.com/features/agent/plan-mode) describes structured tasks with revise/cancel and approval choices for current-session or background execution. [App Testing](https://docs.replit.com/features/agent/app-testing) documents browser interaction, recordings and self-correction. Its published scope includes full-stack JavaScript and Streamlit Python apps; testing runs selectively, with limitations by execution mode.

The [publishing guide](https://docs.replit.com/features/publishing/after-you-publish) covers provisioning, security checks, build, bundling and promotion. It also explains where to inspect application health, logs, resource usage and traffic afterward. These host capabilities remove work that a novice would otherwise need to coordinate independently.

### Bolt

The [Plan Mode guide](https://support.bolt.new/best-practices/plan-mode) documents web research with visible sources and contextual actions such as refining an idea or implementing a plan. A subtle limitation: starting Plan Mode from the homepage first creates the base app structure.

The [beginner lifecycle guide](https://support.bolt.new/get-started/project-lifecycle) helps users describe audience, purpose, features and delivery format, then iterate and publish. It documents managed hosting, Netlify, Expo, GitHub-based delivery and downloads. [Skills](https://support.bolt.new/building/skills) are available on all plans and can provide reusable planning or building workflows. This makes integration worth investigating, without establishing that Bolt can execute all GSR invariants unchanged.

## Cost and licensing characteristics

- GSD Core, Spec Kit, BMAD and OpenSpec advertise MIT licensing in their linked repositories. BMAD additionally identifies trademark conditions. Their open-source workflow license does not include model or host usage.
- Lovable's linked planning documentation bills planning messages plus any research subagent work; implementation is billed separately. Replit's linked planning and testing docs describe effort-based charges, including non-coding assistance and testing.
- [Kiro pricing](https://kiro.dev/pricing/) uses credit allowances and paid plans; specification refinement, execution and hooks consume credits. Available models and surfaces vary. Exact price tables are deliberately omitted because the strategic issue is metered effort and changing entitlements.
- No blanket claim is made that an open-source method is cheaper overall. Total cost depends on model usage, retries, hosting and human effort.

## Strategic hypotheses for GSR

These are recommendations inferred from the landscape, not claims about proven user demand or absent competitor features.

1. **Develop D-pins into an experiment loop.** Connect uncertainty to a cheap prototype or other experiment, observed evidence, a human decision and the requirements that change. Research and questioning already exist elsewhere; the differentiator would be consistently making decisions easier through concrete evidence.
2. **Make pin acceptance demonstrably trustworthy.** Track the exact version and scope of evidence, invalidate stale passes, preserve unverified states, and show a short demonstration of each product promise. GSD's freshness checks and Kiro's executable properties establish relevant quality expectations.
3. **Optimize decision quality per interruption.** Human ownership should mean informed product choices with recommendations and consequences. Measure both confusing interruptions and silently invented product decisions. A lower question count alone is not success.
4. **Use host infrastructure selectively.** Previews, browser tools, execution, deployment and monitoring increasingly belong to hosts. Validate one portable GSR adapter before expanding; shared file formats do not guarantee shared hooks, permissions or acceptance behavior.
5. **Carry product intent through launch and learning.** Link verified user journeys to deployment checks, feedback, failure recovery and outcome measurement. Hosts already offer operations tooling; GSR's opportunity is continuity of goals and decisions across those tools.

## What remains unproven

No evidence in this review establishes which workflow produces better beginner outcomes. Before committing to a broad redesign, compare representative projects across plain host assistance, current GSR and a proposed GSR workflow. Measure time to a usable prototype, decision comprehension, unresolved assumptions, unsupported completion claims, recovery from changed requirements, effort cost and ability to operate the deployed result. Real user evidence is still needed; synthetic personas or agent debates cannot substitute for it.
