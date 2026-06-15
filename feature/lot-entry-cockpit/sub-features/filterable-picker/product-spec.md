# Product Spec — Filterable picker — shared dropdown

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Filterable picker |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58) |
| **Delivery wave** | Wave A |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | `brick-counter-coordinator`: `src/components/FilterablePicker.vue`, `src/lib/filterable-picker.js` |

## Problem & audience

### Problem statement

Part and color pickers need a reusable searchable dropdown with keyboard navigation and debounced filter — not ad-hoc selects on every screen.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Port shared filterable dropdown (search panel, keyboard, debounce) from sibling app**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Users can type to filter a long list and pick with keyboard or pointer.
- Debounce prevents janky filtering on every keystroke.
- Component is reusable by part and color pickers without duplicating behavior.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Filter panel opens, accepts search text, filters visible options | Unit test + manual |
| 2 | Arrow keys / Enter select an option; Escape closes | Manual + a11y spot check |
| 3 | Debounce delays filter until typing pauses | Unit test on filterable-picker.js |

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

- Port/adapt `FilterablePicker.vue` and `filterable-picker.js` into coordinator-02 (JavaScript SFCs).
- Storybook-style demo or minimal unit test proving filter + select contract.

**Primary touchpoints (engineering):** `FilterablePicker.vue`, `src/lib/filterable-picker.js`, minimal picker config

### Out of scope

- Part-specific or color-specific ranking — sibling children `part-search-combobox` and `color-picker`.
- BrickLink live API.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- None (Wave A foundation).
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
