# Feature: [Feature Name]

**Phase:** [1 / 2 / ...]
**Type:** creative / systematic
**Status:** not started
**Constraints:** [e.g., `<project>.C1`, `<project>.C2` — or "none"]

---

## Purpose

[One paragraph: what this feature does and why it exists in the product.]

---

## User Story / Flow

[What the user does, step by step. Plain language, user perspective.]

1. User [action]
2. System [response]
3. User [action]
4. [etc.]

---

## States

| State | What the user sees |
|-------|-------------------|
| Empty | [Day-0 experience] |
| Loading | [Loading state] |
| Partial | [Some data, not full] |
| Full | [Normal state] |
| Error | [What happens when something fails] |
| Offline | [If applicable] |

---

## Business Rules & Edge Cases

- [Rule 1 — e.g., "Goals are optional. When not set, streak is inactive."]
- [Rule 2]
- What happens when [optional field] is missing?
- What cascading effects does this have?

---

## Data Needs

[What data this feature needs — conceptual level, not schema fields]

- Needs: [entity/relationship description]
- Source: [where it comes from — another feature, user input, external API]

---

## UX Description

[Layout intent and key interactions — not component names or CSS]

- Layout: [e.g., "card grid, 2 columns on mobile, 3 on desktop"]
- Primary action: [what the main CTA does]
- Key interaction: [notable UX behavior]

---

## Must-Haves

_Defined now, verified at phase completion. Each item gets a stable ID — referenced in commits, tests, code comments, debug sessions, and verification reports._

**ID convention:** `<feature-slug>.T<n>` for Truths, `.A<n>` for Artifacts, `.K<n>` for Key Links. Sub-requirements append `.<m>` (e.g., `dashboard.T1.1`). Once assigned, never renumber — append only. Removing a requirement: strike-through until next major spec revision.

### Truths (observable behaviors)
| ID | Truth | Status |
|----|-------|--------|
| `<slug>.T1` | [User can do X] | pending |
| `<slug>.T2` | [System does Y when Z] | pending |

### Artifacts (files that must exist with real implementation)
| ID | Artifact | Status |
|----|----------|--------|
| `<slug>.A1` | `[path]` — [what it does, what it exports] | pending |

### Key Links (critical connections)
| ID | Link | Status |
|----|------|--------|
| `<slug>.K1` | [ComponentA] imports [ComponentB] via [mechanism] | pending |
| `<slug>.K2` | [RouteX] calls [ApiY] | pending |

_Status values: `pending` → `done` (verified by command or test) → `accepted` (human sign-off during `/gsr:verify` Step 4)._

---

## Don't Hand-Roll

_Only included if relevant — proven solutions to use instead of building from scratch._

| Need | Don't Build | Use Instead | Why |
|------|------------|------------|-----|
| | | | |

---

## Known Pitfalls

_Only included if relevant — common mistakes for this type of feature._

| Pitfall | Why It Happens | How to Avoid | Warning Signs |
|---------|---------------|-------------|--------------|
| | | | |

---

## Skills

_Loaded automatically during build._

**Project-wide:** see `docs/techstack.md`

**Feature-specific:**
- [skill-name] — [why needed for this feature]

<!-- If no marketplace skill found: ⚠️ No marketplace skill found for [tech] — rely on docs and learned rules -->

---

## Decision Log

| Date | Decision | Rationale |
|------|---------|-----------|
| | | |

---

## Related Features

- [Feature name] (`docs/features/[name].md`) — [how they interact]
