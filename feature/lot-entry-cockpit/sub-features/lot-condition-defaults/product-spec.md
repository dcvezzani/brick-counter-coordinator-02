# Product Spec — Lot condition defaults

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Condition defaults |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63) |
| **Delivery wave** | Wave B |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | `src/lib/lot-entry-defaults.js`, session `partOutOptions.condition` |

## Problem & audience

### Problem statement

Every lot requires **condition** (New/Used); sessions that are all-new or all-used part-out should default condition so workers tap less, while mixed sessions allow choice.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Session condition rules (new/used/mixed); resolveDefaultLotCondition; UI read-only or choosable per sibling LotForm**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- resolveDefaultLotCondition returns N/U per session rules.
- Form shows condition as read-only or choosable matching sibling LotForm rules.
- Demo seed documents condition mode for presenters.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | All-new part-out → default New | Unit test |
| 2 | All-used part-out → default Used | Unit test |
| 3 | Mixed session allows user choice when product rules say so | Manual + unit |

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

- Port/adapt `lot-entry-defaults.js`.
- Session seed fields for part-out condition mode.

**Primary touchpoints (engineering):** `src/lib/lot-entry-defaults.js`, demo seed `partOutOptions.condition`

### Out of scope

- Full LotEntryForm layout — `lot-entry-form`.
- Changing phase machine.

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
