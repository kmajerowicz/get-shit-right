# Project Weight Pattern

Rigor scales with stakes. Weight is set once at entry (changeable anytime),
stored in STATE.md as `**Weight:** <value>`, and read by every skill at Step 0.

| Weight | Meaning |
|--------|---------|
| `spike` | Demo, experiment, toy, learning project. Minimal ceremony. |
| `standard` | Side project, internal tool. Default. |
| `production` | Real users, real stakes. Full rigor. |

## Classification

Infer from the conversation (words like "demo", "for my kid", "quick experiment"
→ spike; "customers", "launch", "clients" → production), then confirm with one
AskUserQuestion — inferred value first, "(Recommended)". Never set silently.

## The matrix — what weight controls

| Procedure | spike | standard | production |
|---|---|---|---|
| Competitive mapping (scope Step 2) | skip | offer via gate | default on |
| Don't-hand-roll sweep | inline, no agents | 1 researcher agent | parallel agents |
| v2 backlog | skip | only if content exists | on |
| PRD size | 1 page max | 200–300 lines | 200–300 + full feature files |
| Skills-matching (build Step 3.5) | auto-match, note in output, no stop | table shown, no hard stop | table + confirm gate |
| Infra pre-check (build Step 0) | skip | ask once, don't gate | gate |
| Sketch gate heuristic | off (--sketch only) | current heuristic | fire on ANY single heuristic condition |
| Verification depth | gate function + assumptions check only | + grep sweeps + pins | full ladder (all checks) |
| Questions per topic (scope) | 1 | 2–3 | full progressive flow |

## Invariants — NEVER scaled by weight

Evidence format & gate function before "done" · human owns product decisions ·
D-pin recording on deferral · atomic commits · Learned Rules capture · never
reference nonexistent assets. These hold at `spike` exactly as at `production`.

## Promotion

"Promote to production" (any phrasing) → update STATE.md, then list which
skipped procedures now apply (from the matrix) and offer to run the gap-fill:
competitive mapping, full verification ladder on already-built features.
