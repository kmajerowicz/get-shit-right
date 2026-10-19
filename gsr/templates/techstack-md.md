# Tech Stack — [Project Name]

---

## Core Stack

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | | | |
| Language | | | |
| Styling | | | |
| Database | | | |
| Auth | | | |
| Hosting | | | |

---

## Gate

_Commands GSR runs before any completion claim (`${CLAUDE_PLUGIN_ROOT}/skills/gate/SKILL.md`). Replace the defaults below with this project's actual equivalents._

1. `npm run build` — must pass with 0 errors
2. `npx tsc --noEmit` — must report 0 TypeScript errors
3. Lint if configured — must pass

---

## Project-Wide Skills

_Skills that apply to every feature in this project. Loaded automatically during build._

[List installed skills that apply project-wide]
<!-- Example:
- responsive-design — mobile-first layout
- tailwind-design-system — consistent token usage
-->

---

## Tech Decisions

_Key choices made during scope/PRD, with rationale._

| Decision | Choice | Why |
|---------|--------|-----|
| | | |

---

## Research Areas — Blocking Build

_Resolved when you get to the relevant feature._

| Area | Status | Notes |
|------|--------|-------|
| | | |

## Machine verification configuration

During authorized work, record the exact project checks in project-root `.gsr.json`
(schemaVersion 1). Preserve the legacy Gate prose; reconcile it against real scripts.
Each check has `id`, `argv` (argument array, shell disabled), `kind` (`static`,
`test`, `runtime`), optional project-relative `cwd`, `required` and `timeoutMs`.
No universal npm/TypeScript defaults. Named `profiles` select check IDs; default
selects all required checks plus explicitly listed default optional checks. An explicit
`profiles.default` cannot reduce required coverage; other profiles stay explicit subsets. A docs-only profile needs documented bounded
`profileApplicability`; uncertainty selects default. See the plugin's
`docs/patterns/verification-contract.md` for the internal runner and evidence limits.


## Installed guidance references

_Record only genuinely project-wide choices from the actual host catalog: skill/provider,
source, applicable task/output, available version or identity (unknown if unavailable),
and actual load/use observation or limit. Reconcile availability/current content on resume.
These references grant no installation/publishing/spending permission and prove no skill
use by themselves. Task-only guidance belongs in the existing feature Task Context or
plan Skills Confirmed bullets, preserving plan headings/table._
