# Project Weight Pattern

Rigor scales with stakes, not authority or review cadence. Weight is set once at entry (changeable anytime),
stored in STATE.md as `**Weight:** <value>`, and read by every skill at Step 0.

| Weight | Meaning |
|--------|---------|
| `spike` | Demo, experiment, toy, learning project. Minimal ceremony. |
| `standard` | Side project, internal tool. Default. |
| `production` | Real users, real stakes. Full rigor. |

## Classification

Infer from the conversation (words like "demo", "for my kid", "quick experiment"
→ spike; "customers", "launch", "clients" → production); record the value with a brief explanation when useful. No compulsory selector or confirmation. Ask only when a consequential ambiguity remains.

## The matrix — what weight controls

| Procedure | spike | standard | production |
|---|---|---|---|
| Competitive mapping (scope Step 2) | material uncertainty only | material uncertainty | deeper material research |
| Don't-hand-roll sweep | material uncertainty, brief | material uncertainty, bounded research | material uncertainty, deeper research |
| v2 backlog | skip | only if content exists | on |
| PRD size | 1 page max | 200–300 lines | 200–300 + full feature files |
| Skills-matching (build Step 3.5) | load installed matches | explain relevant matches | deeper matching, no approval gate |
| Infra pre-check (build Step 0) | inspect relevant config | inspect config and limits | deeper readiness checks; no routine setup gate |
| Sketch preparation | when useful or requested | inspect heuristic risks | deeper risk inspection, no automatic approval |
| Verification depth | proportionate configured checks | applicable static/behavior/pin checks | deeper applicable behavioral coverage |
| Questions per topic (scope) | 1 | 2–3 | full progressive flow |

## Invariants — NEVER scaled by weight

Actual evidence & freshness before verification claims · human owns unresolved product decisions ·
D-pin recording on deferral · commits only when authorized · Learned Rules capture · never
reference nonexistent assets. These hold at `spike` exactly as at `production`.

## Promotion

"Promote to production" (any phrasing) → update STATE.md, then list which
applicable rigor increases from the matrix. Continue relevant gap checks within authorized work; do not add an approval screen or irrelevant competitive/browser checks.
