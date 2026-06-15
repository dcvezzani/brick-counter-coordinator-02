# Product Spec — Lot entry form

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Lot entry form |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64) |
| **Delivery wave** | Wave C |
| **Related Tech Spec** | [tech-spec.md](tech-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit-lot-entry-form/feature/lot-entry-cockpit/sub-features/lot-entry-form/tech-spec.md) |
| **Prior art** | `LotForm.vue` minus SteppedSwipeNumberInput |

## Problem & audience

### Problem statement

Workers need one focused form combining pickers, condition, quantity stepper, and save actions — without swipe input or read-only tables.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Four-field form: part, color, condition, count (+/−); Save + save-and-add-another; duplicate confirm; success toast (#9)**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- All four fields capturable; large +/− for count.
- Save persists via lot-data-model; success toast per #9.
- Save-and-add-another clears for next entry; duplicate triple shows confirm when required.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Save calls session save with part id, color id, condition, qty | Unit test |
| 2 | +/− updates count with mobile-sized controls | Manual + ui-rules |
| 3 | Success toast on save | Unit test mocking feedback.js |

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

- New `LotEntryForm.vue` composing pickers + condition + stepper + actions.
- Duplicate confirm dialog using #9 patterns.

**Primary touchpoints (engineering):** New `LotEntryForm.vue`

### Out of scope

- LotEntryView chrome / Compare CTA — `lot-entry-cockpit-shell`.
- SwipeNumberInput.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- Wave B pickers + [lot-data-model](./lot-data-model/product-spec.md) + [lot-condition-defaults](./lot-condition-defaults/product-spec.md).
- **Depends on (build order):** `part-search-combobox`, `color-picker`, `lot-data-model`, `lot-condition-defaults`
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
