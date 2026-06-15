# Product Spec — Color picker

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Color picker |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#61](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/61) |
| **Delivery wave** | Wave B |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | `brick-counter-coordinator`: `ColorPicker.vue`, `src/lib/bricklink-colors.js` |

## Problem & audience

### Problem statement

After a part is chosen, workers pick a color by name; the form must store **color id** with visible swatches for confidence.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Color picker: search by name → stores color id; swatch in trigger/list; disabled until part chosen**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Color control disabled until part id is set.
- Search filters colors for the selected part; selection sets **color id**.
- Swatch visible in list rows and trigger when available.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Disabled when no part id | Unit test |
| 2 | Selecting color sets numeric/string color id per catalog | Unit test |
| 3 | Swatch helper does not break without image URL | Unit test |

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

- Port/adapt `ColorPicker.vue` and swatch helper.
- Wire to getColorsForPart from catalog child.

**Primary touchpoints (engineering):** `ColorPicker.vue`, `src/lib/bricklink-colors.js` (swatch helper)

### Out of scope

- Part search, lot save, condition defaults.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- [filterable-picker](./filterable-picker/product-spec.md), [part-color-catalog](./part-color-catalog/product-spec.md).
- **Depends on (build order):** `filterable-picker`, `part-color-catalog`
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
