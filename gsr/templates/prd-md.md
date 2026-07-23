# [Project Name] — PRD

**Version:** 0.1
**Status:** Draft
**Last Updated:** [date]

---

## 1. What We're Building

[2-3 sentences: what the app does, for whom, and why it matters.]

---

## 2. Business Goals

- [Primary goal — measurable]
- [Secondary goal]

**Success metrics:**
- [Metric with target]

---

## 3. Target Users

**Primary:** [Who they are, their context, what they need]

**Day 1 user:** [What they do on day 1]
**Day 7 user:** [What they do a week in]
**Day 30 user:** [What they do a month in]

---

## 4. MVP Scope

**In scope:**
- [Feature 1]
- [Feature 2]

**Explicitly out of scope (v2):**
- [Item 1 — reason]

---

## 5. High-Level Architecture

[System diagram in plain text or ASCII: main components and how they connect]

```
[Client] → [API/Backend] → [Database]
              ↓
         [External Services]
```

---

## 6. Conceptual Data Model

[Entities and relationships — not schemas. What exists, how it relates, key rules.]

```
User 1──* [Entity]
[Entity] has: [attribute], [attribute], optional [attribute]
Key rule: [business rule about optionality or cascading behavior]
```

_Implementation: `[path to schema/migrations]`_

---

## 7. Feature Index

| Feature | File | Status | Phase |
|---------|------|--------|-------|
| [Feature 1] | `docs/features/[name].md` | not started | 1 |
| [Feature 2] | `docs/features/[name].md` | not started | 1 |

---

## 8. Constraints

_Project-wide requirements that every feature must respect. Each gets a stable pin ID (`<project>.C<n>`) — feature files reference these by ID._

| ID | Constraint | Target |
|----|-----------|--------|
| `<project>.C1` | Performance | [e.g., Page load <2s on 3G] |
| `<project>.C2` | Accessibility | [e.g., WCAG 2.1 AA] |
| `<project>.C3` | Mobile | [e.g., Mobile-first, iOS Safari + Android Chrome] |

---

## 9. Design Direction

[Inspiration apps, visual tone, color palette intent, typography intent]

_Design tokens: `[path in code]`_

---

## 10. Build Phases

| # | Phase | Type | Features | Demo |
|---|-------|------|---------|------|
| 1 | [Name] | creative | [features] | [What user can do after this phase] |
| 2 | [Name] | systematic | [features] | [What user can do after this phase] |

**Must-haves per phase defined in feature files** (`docs/features/*.md` → Must-haves section).

---

## 11. Research Areas

| Area | Tier | Status | Notes |
|------|------|--------|-------|
| [Area] | blocking PRD / blocking build | open / resolved | |

---

## Assumptions Ledger

_Deferred decisions — see deferred-decisions pattern. Append-only._

| ID | Assumption (default taken) | Source question | Severity | Status | Date |
|----|---------------------------|-----------------|----------|--------|------|
| `<project>.D1` | [Default taken, e.g. "Paper sizes: A4 + Letter only"] | [What was asked] | non-blocking / blocking | assumed | [date] |
