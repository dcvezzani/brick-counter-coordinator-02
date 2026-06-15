# Product Spec — Migrate list lots browse

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | List lots browse |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) |
| **Delivery wave** | Wave D |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | Existing `ListLotsView.vue` |

## Problem & audience

### Problem statement

Browse lots still shows fictional Lot A/B/C labels; after lot identity change, organizers and workers need truthful part/color/condition/qty columns.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **List lots shows part / color / condition / qty (drop Lot A/B/C labels); organizer mode unchanged**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Browse table/cards show part, color, condition, quantity from new model.
- Organizer mode behavior unchanged aside from column content.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | No Lot A/B/C label column as primary identity | Manual + unit |
| 2 | Displays resolve names from ids where applicable | Manual |

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

- Update ListLotsView columns/cards for new lot shape.
- Tests updated for fixture lots.

**Primary touchpoints (engineering):** `ListLotsView.vue`, related tests

### Out of scope

- Lot entry cockpit (`lot-entry-cockpit-shell`).
- Reconciliation compare logic.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- [lot-data-model](./lot-data-model/product-spec.md).
- **Depends on (build order):** `lot-data-model`
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
