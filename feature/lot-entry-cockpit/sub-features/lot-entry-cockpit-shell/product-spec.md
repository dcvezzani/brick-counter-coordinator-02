# Product Spec — Lot entry cockpit shell

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Cockpit shell |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#65](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) |
| **Delivery wave** | Wave D |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | Parent [#10](../product-spec.md); existing `LotEntryView.vue` |

## Problem & audience

### Problem statement

Lot entry route still shows a read-only lot table; parent #10 requires counting cockpit as primary content while keeping phase gate behavior.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Replace read-only table on LotEntryView with compact worker chrome + LotEntryForm; preserve Compare with Part-Out List gate**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Counting form is primary content on `/session/:sessionId/lot` during counting.
- Compact worker chrome — less vertical filler than coordinator views.
- Compare with Part-Out List unchanged for counting phase.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | No read-only lot table as primary UX | Manual + test |
| 2 | Compare CTA only when phase === counting | Existing tests updated |
| 3 | LotEntryForm mounted in view | Unit test |

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

- Wire `LotEntryForm` into `LotEntryView`.
- Tighter header/description per parent compact chrome decision.

**Primary touchpoints (engineering):** `LotEntryView.vue`, `tests/unit/views/LotEntryView.test.js`

### Out of scope

- Full SessionWorkerShell (#11).
- List lots browse changes.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- [lot-entry-form](./lot-entry-form/product-spec.md).
- **Depends on (build order):** `lot-entry-form`
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
