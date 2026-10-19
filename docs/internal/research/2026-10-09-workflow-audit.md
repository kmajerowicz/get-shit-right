# GSR workflow audit — research appendix

Date: 2026-10-09  
Repository snapshot: `fa92074c5044dfd0de9dda577ef5c53cf5bc2307`  
Scope: read-only analysis of current workflow instructions, templates, historical feedback, vision, decisions, backlog, plans, README, and changelog. This document proposes research and experiments; it does not approve product changes or modify existing specifications.

## Main finding

GSR already has substantial machinery for research, recorded intent, persistent work, adaptive process, and evidence. The strongest opportunity suggested by this audit is to make that machinery easier for a beginner to use continuously: explain an idea, see a useful result, make informed product decisions, verify it, and get it into use.

This is an inference from the workflow, not a measured conversion finding. Current instructions still expect users to operate phase commands, approve engineering plans, review code diffs, configure services, and install skills. GSR's beginner-facing interaction can improve while retaining human ownership of product decisions.

The original nontechnical tester summarized the distinction as “GSR idzie do celu, GSD prowadzi do celu” — approximately, “GSR heads toward the goal; GSD guides you there.” This is a useful design hypothesis, not evidence about the current version. [Historical feedback](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L153)

## Evidence limits

- There are two archived feedback reports, both for **v0.1.x**. User 1 had no coding experience but strong printing-domain knowledge and was rebuilding an app already completed with GSD. User 2 was a developer building a small personal project and supplied the intended stack. Neither sample establishes the experience of a beginner with an unformed idea on v0.5. [User 1 profile](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L3), [User 2 profile](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-2-dtmf-app.md#L3)
- Historical strengths include speed, research insight, low token use, strong initial UI, and day-1/7/30 framing. [User 1](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L134), [PRD framing](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L82)
- Historical pains include excessive/repeated questions, restrictive assumptions, confusing file-completion language, repeated requests to build the next screen, nonfunctional test instructions, and a runtime crash. Most are explicitly marked fixed in v0.2; the current skill text includes those changes. Their continued prevalence is unknown. [Pain examples](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L108), [Fix ledger](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-1-imposition-tool.md#L157)
- The developer's complaint about unnecessary v2 suggestions is also marked fixed. [User 2](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/docs/internal/feedback/user-2-dtmf-app.md#L26)
- The March GSD comparison records founder experience on different products. It is historical motivation, not a controlled comparison or current competitive benchmark. [Original analysis](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/research/analysis.md#L32)
- No post-v0.5 beginner task-completion data, retention measurements, install conversion, or controlled model comparison appeared in the materials reviewed. That is a limitation of this audit, not proof that no such data exists elsewhere.
- Findings below are source-level contradictions or design hypotheses. They were not reproduced as live model-session failures. External capabilities and competitor claims require independent current-source research.

## Capabilities already present

These should be extended or evaluated, not proposed as entirely new features.

| Capability | Current evidence |
|---|---|
| Progressive questions and concise PRD approval summaries | [Scope laws](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L18), [PRD summary](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/prd-generation/SKILL.md#L115) |
| Deferred decisions with recorded defaults and revisit checkpoints | [D-pin pattern](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/patterns/deferred-decisions.md#L3) |
| Project weights and bounded quick work | [Weight matrix](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/patterns/weight.md#L18), [Quick flow](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/quick/SKILL.md#L8) |
| Batch build and optional notification-tool use | [Build batch protocol](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L75) |
| Persistent debug sessions and systematic plans | [Debug persistence](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/debug/SKILL.md#L14), [Plan persistence](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L299) |
| Staged spec and quality review | [Review dispatch](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L311) |
| Stable requirement IDs and acceptance coverage | [Pin template](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/templates/feature-md.md#L69), [Coverage report](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L271) |
| Browser walkthroughs of user flows and states | [Visual verification](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/patterns/visual-verification.md#L18) |
| Host-specific deployment guidance | [Deployment check](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L390) |
| Enforcement hooks, ambient skill descriptions, role-based model dispatch | [Release history](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/CHANGELOG.md#L10) |

Runtime monitors, CI verification, pin-driven release notes, a memory bridge, spec import, and a branch-finishing/ship flow are already backlog proposals. Their presence in the backlog does not establish implementation. [Capability backlog](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/backlog.md#L109), [Ship proposal](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/backlog.md#L27)

## Current beginner journey and hypothesized dropoffs

| Stage | Current interaction | Hypothesized friction |
|---|---|---|
| Installation | CLI/plugin installation instructions | A beginner may need help before GSR starts: terminal, project directory, host account, git, or subscription. [Install](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/README.md#L25) |
| Entry and continuity | Choose A/B/C; run commands; clear context between phases | The user operates the workflow as well as making product decisions. [Entry paths](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/README.md#L58), [Scope handoff](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/commands/scope.md#L19) |
| Scope | Foundations, research, draft, prioritization, feature deep-dives, two-pass review | Time to first observable result may remain long even with D-pins. [Scope flow](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L55) |
| PRD | Approve summary, then feature files | Good summary UX already exists, but repeated abstract approval remains possible. [Approval](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/prd-generation/SKILL.md#L115), [Feature review](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/prd-generation/SKILL.md#L192) |
| Setup | Confirm services and credentials; install missing skills | Engineering chores are handed to users who may not know how to perform them. [Infrastructure](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L37), [Skills](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L226) |
| Build | UI recommends Creative: review every diff; test chunks; approve commits; approve Learned Rules | Ownership can become numerous low-comprehension approvals. [Mode choice](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L168), [Creative loop](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L245) |
| Verify | Full report; browser tier when tools exist, otherwise human checks | The novice may become the runtime tester or struggle to interpret engineering evidence. [Fallback](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/patterns/visual-verification.md#L6), [Report presentation](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L298) |
| Launch | Check configured host, ask whether deployed, guide deployment | Useful deployment guidance exists; a complete first-real-user and feedback loop is less explicit. [Deployment](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L390) |

## Current protocol contradictions and gaps

### 1. Adaptive scope conflicts with absolute legacy rules

Scope skips competitive research for spike and offers it for standard, while the enforcement table says “Never skip.” Only Goal and What It Does are hard foundations in the Iron Laws, but intake says all five “must be clear before anything else”; Start B's verdict still requires all five. These are conflicting instructions, not proof of a specific model failure. [Weight override](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L75), [Never skip](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L290), [Two hard foundations](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L15), [Five foundations](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L59), [Start B verdict](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L202)

Test: a spike with a clear goal/mechanic and explicit uncertainty about audience should progress with recorded deferrals and no forced competitive-research gate.

### 2. Weight-scaled and batch behavior conflicts with unconditional waits

Skills matching says spike requires no confirmation and standard has no hard stop unless installing, but later says implementation must wait for confirmation. The systematic loop repeats that wait. Infrastructure likewise has a standard override and unconditional wait wording. Batch promises continuation but Creative prescribes per-chunk approvals. [Weight scaling](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L181), [Unconditional skill gate](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L235), [Systematic repetition](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L297), [Infra override](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L34), [Infra wait](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L53), [Batch](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L75), [Creative approvals](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L249)

Test: compare interruptions after “build everything” across weights; classify each interruption as necessary product judgment, external authorization, or unnecessary process approval.

### 3. Research freshness is excluded too broadly in PRD updates

Update mode says “Do NOT re-run research. Research was already done for the existing PRD.” Changed scope, services, prices, and feasibility can invalidate prior evidence. A blanket prohibition lacks an exception for changed assumptions. [Update mode](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/prd-generation/SKILL.md#L39)

Test: change a requirement that invalidates a researched service capability; check whether GSR identifies and refreshes the affected claim.

### 4. Research reuse and weight rules are not consistently expressed

Scope runs a capability sweep; PRD then calls for a parallel sweep per feature. The matrix specifies inline/no agents for spike and one researcher for standard, while PRD's per-feature dispatch is unconditional. This creates potential duplicate work and inconsistent cost. [Scope sweep](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L94), [PRD sweep](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/prd-generation/SKILL.md#L141), [Weight matrix](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/patterns/weight.md#L23)

Test: log repeat investigations across scope and PRD and measure whether reuse reduces cost without reducing claim support.

### 5. Start C lacks a clear executable bridge into feature scoping

README describes learn → build → verify. Learn creates an empty feature directory and explicitly refuses to generate missing feature files. Build expects a selected feature spec. Feature scoping is documented conceptually but not clearly connected by the advertised command path. [README](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/README.md#L74), [Empty directory](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/learn/SKILL.md#L93), [No feature generation](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/learn/SKILL.md#L101), [Build expects feature](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L95), [Conceptual bridge](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/docs/phases/0c-existing-product.md#L58)

Test: add a feature to an existing small app with no PRD; measure whether the stated path produces a focused feature spec without forcing a whole-product rewrite.

### 6. Custom documentation roots are recognized but not consistently carried forward

Learn detects alternate roots and says subsequent creation uses that root. Scope, build, and verify use hardcoded `docs/` references. [Doc-root detection](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/learn/SKILL.md#L35), [Build reads](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L24), [Scope output](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/scope-shaping/SKILL.md#L263), [Verify state](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L22)

Test: resume across phases with all GSR artifacts in `.ai/`; check for duplicate documents or lost state.

### 7. Spec drift has conflicting meanings and an incomplete described algorithm

README promises zero-reference detection. Verification says search current IDs, then detect IDs in code that no longer exist in the spec. Searching only current IDs cannot discover deleted IDs. Neither definition necessarily catches semantic changes under a surviving ID. [README promise](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/README.md#L171), [Verification algorithm](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L194)

Test separately: missing code reference, orphan code reference, changed requirement text with unchanged ID, and implementation that references a pin but violates its behavior.

### 8. Pin acceptance ordering is ambiguous

A pending row counts as an unverified blocker; statuses are updated only after PASS. There is no explicit reconciliation step for newly observed evidence against initially pending rows. [Pending blocks](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L284), [Update after PASS](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L340)

Test: first verification of a fully implemented feature whose pins start pending; observe whether evidence correctly advances state without circular blocking.

### 9. Static clues and behavioral proof can be conflated

Truth verification permits grep, the spec reviewer can pass from a code-location map, and the artifact heuristic includes line count. These are useful evidence of implementation presence but do not establish runtime behavior. The browser tier already offers a stronger route. [Truth checks](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L180), [Spec map](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/agents/reviewer-spec.md#L34), [Artifact heuristic](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/verification/SKILL.md#L165)

Test: seeded runtime defects that compile and contain correct-looking pin references; measure false PASS, not merely check completion.

### 10. A design sketch is currently an engineering sketch

The sketch contains an approach, file map, data shape, risks, and scope. This can help implementation but is not a visual or interactive product preview a novice can judge. [Sketch fields](https://github.com/kmajerowicz/get-shit-right/blob/fa92074c5044dfd0de9dda577ef5c53cf5bc2307/gsr/skills/build/SKILL.md#L142)

Test: compare text-sketch approval with a small working preview for an ambiguous UI decision; measure user comprehension and later reversals.

## Product hypotheses to investigate

| Hypothesis | Existing foundation | Proposed experiment | Useful measures |
|---|---|---|---|
| Guided continuity improves beginner completion | State, next-action guidance, batch mode | Observe current v0.5, then compare a manually facilitated continuous journey before building a new interface | Completed usable outcome, facilitator rescues, unnecessary approvals, understanding of next action |
| Earlier concrete previews improve product decisions | D-pins, demo sentences, feature flows | Compare scope-first with a small end-to-end preview before elaborating all features | Time to useful feedback, misunderstood decisions, rework, comprehension of approval |
| Outcome-based evals identify where stronger models help | Persistent artifacts, gates, pin evidence | Run the same scripted scenarios across model/effort choices and repeat trials | False PASS, task success, interruptions, latency, cost, recovery after context loss |
| Reusable research evidence improves accuracy and cost | Researcher role, assumption triage, don't-hand-roll sweeps | Track claim/source/date/decision links and refresh when a relevant constraint changes | Supported-claim rate, stale claims caught, duplicate research, decision usefulness |
| Clear evidence types improve trust | Pins and browser verification | Present outcomes with distinguishable static/test/browser/human evidence | Seeded defect detection, user comprehension, false confidence |
| First-real-user support completes the promise | Deployment check, feedback capture | Follow novices through configuration, live core-flow exercise, and feedback from one intended user | Time to first use, setup stalls, founder intervention, live defects |

These experiments should establish baselines before assigning numerical improvement targets. A small initial cohort can reveal usability failures; it cannot establish population-wide conversion or model superiority.

## Planning implications

Recommended sequence for discussion:

1. Observe current v0.5 with fresh beginners and document where they need rescue.
2. Define outcome-based evaluation scenarios, including uncertainty, batch work, alternate stacks, missing browser tools, changed requirements, and interrupted sessions.
3. Resolve contradictory protocol semantics against those scenarios before adding more instructions.
4. Test guided continuity and preview-led decisions with the existing engine.
5. Choose larger investments only after evidence: a new interface, provider portability, deeper deployment assistance, or team integrations.

Open product questions: Is the main audience a domain expert without coding skills or a beginner in both product and engineering? Does success mean a personal tool, public prototype, or business with real users? How much setup is acceptable? Which approvals are meaningful? What cost/latency tradeoff will users accept? Do they want to learn engineering or simply obtain a useful product?

The intent is to preserve research, human ownership, and evidence while reducing the effort required to understand and operate GSR.
