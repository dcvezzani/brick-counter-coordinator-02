# Product Spec — Part & color catalog (storyboard)

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Part/color catalog |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#59](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/59) |
| **Delivery wave** | Wave A |
| **Related Tech Spec** | [tech-spec.md](tech-spec.md) |
| **Prior art** | Sibling session/catalog patterns; coordinator-02 `demo-session.js` part-out lines |

## Problem & audience

### Problem statement

Pickers and lot save need **part id** and **color id** resolved from searchable names, using session part-out data first — without a live BrickLink API.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Storyboard catalog: searchParts, lookupPart, resolvePartId, getColorsForPart; part-out lines ranked first**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Part search returns session part-out lines before other fixture parts.
- Selecting a part yields stable **part id**; colors for that part yield **color id**.
- Fixture data includes color ids on part-out lines where reconciliation needs them.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | searchParts ranks part-out list lines first for same query | Unit test |
| 2 | lookupPart / resolvePartId return consistent ids for fixture data | Unit test |
| 3 | getColorsForPart returns color ids + display names for a part | Unit test |

### Business impact

Enables parallel delivery of parent #10; this slice is required before dependent children in later waves.

## User experience & scenarios

### Key scenarios

1. **Happy path** — User completes this slice's interaction as part of the counting workflow described in parent spec.
2. **Dependency** — If upstream child not merged, this feature is not testable end-to-end (track in integration branch).

### Experience principles

- Match sibling app behavior where parent spec says "adopt, don't reinvent."
- Mobile-first touch targets on any UI this child owns (no `size="xs"` on primary actions).

## Scope

### In scope

- Catalog module in `src/lib/` with searchParts, lookupPart, resolvePartId, getColorsForPart.
- Subset of bricklink color map for storyboard swatches.
- Extend demo-session part-out lines with `colorId` where needed.

**Primary touchpoints (engineering):** `src/lib/` catalog module, fixture color map, extend `demo-session.js` part-out with `colorId`

### Out of scope

- Vue picker UI (`part-search-combobox`, `color-picker`).
- Lot save / merge semantics (`lot-data-model`).

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- None (Wave A). Informs Wave B pickers.
- **Depends on (build order):** —
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
