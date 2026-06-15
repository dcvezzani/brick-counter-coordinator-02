# Product Spec — Lot data model & save semantics

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Lot data model |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) |
| **Delivery wave** | Wave A |
| **Related Tech Spec** | [tech-spec.md](tech-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit-lot-data-model/feature/lot-entry-cockpit/sub-features/lot-data-model/tech-spec.md) |
| **Prior art** | Sibling `useFixtureSession.js` — saveLot, lotKey, getLot |

## Problem & audience

### Problem statement

Storyboard lots still use Lot A/B/C labels and color names; counting needs **part + color + condition** identity with merge-on-duplicate and updated reconciliation rollups.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Lot identity part id + color id + condition + qty; saveLot / duplicate merge; fixture migration; reconciliation lotQty rollup**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- Session lots keyed by part id + color id + condition.
- Saving duplicate triple merges quantity or prompts per sibling behavior.
- Fixtures and in-memory session use `qty`, `colorId`, `condition`; reconciliation `lotQty` reflects saves.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | lotKey is stable for same triple | Unit test |
| 2 | saveLot merges or confirms duplicate triple | Unit test |
| 3 | Fixture migration: no required `label` for new model | Unit test + fixture review |

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

- Storyboard session API: saveLot, getLot, duplicate handling aligned with sibling.
- Migrate `demo-session.js` lot rows; update dependents for `qty`/`colorId`/`condition`.
- Reconciliation row `lotQty` derived or updated when lots change.

**Primary touchpoints (engineering):** `demo-session.js`, `storyboard-session.js`, completion-celebration tests (`quantity` → `qty`)

### Out of scope

- Counting form UI (`lot-entry-form`).
- List lots presentation (`migrate-list-lots-browse`) except data shape it consumes.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- None (Wave A). Blocks `lot-condition-defaults`, `lot-entry-form`, `migrate-list-lots-browse`.
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
