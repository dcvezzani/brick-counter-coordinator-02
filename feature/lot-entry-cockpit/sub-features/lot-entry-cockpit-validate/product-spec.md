# Product Spec — Lot entry cockpit validate

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Parent validate |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Parent work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Parent spec** | [../product-spec.md](../product-spec.md) |
| **Child work item** | *(GitHub issue — assign after create)* |
| **Delivery wave** | Wave E |
| **Related Tech Spec** | *(pending `/design` on this child)* |
| **Prior art** | [consolidate-ui-validate](../00-shipped/consolidate-ui-validate/product-spec.md) pattern |

## Problem & audience

### Problem statement

Parent #10 success criteria need a scored Validate pass and published UI rules for worker counting before closing the epic.

Part of parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit. This child is scoped to: **Parent #10 Validate scorecard; update docs/ui-rules.md worker counting; close parent or note debt**.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase (via parent cockpit).
- **Secondary:** Demo presenter proving picker/catalog behavior in storyboard.

### Current experience (baseline)

Coordinator-02 lacks this slice; sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) and parent spec define target behavior. See parent [product-spec](../product-spec.md) baseline table.

## Outcomes & business impact

### Desired outcomes

- validate-scorecard.md documents PASS/FAIL vs parent spec criteria.
- ui-rules.md documents worker counting / lot cockpit expectations.
- Parent issue #10 closed or explicit debt listed.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | All parent #10 Validate rows scored with evidence | Scorecard file |
| 2 | ui-rules.md updated per parent scope | Doc diff review |
| 3 | npm test && npm run build pass on integration branch | CI |

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

- Scorecard artifact under `feature/lot-entry-cockpit/`.
- ui-rules worker counting section.
- Optional application-views.md one-liner.

**Primary touchpoints (engineering):** `feature/lot-entry-cockpit/validate-scorecard.md`, `docs/ui-rules.md`

### Out of scope

- New product functionality — validation only.
- Playwright e2e requirement.

Parent-level out of scope (swipe input, live BrickLink API, #11 shells, #53 back nav) remains in [../product-spec.md](../product-spec.md).

### Dependencies on other teams or features

- [lot-entry-cockpit-shell](./lot-entry-cockpit-shell/product-spec.md), [migrate-list-lots-browse](./migrate-list-lots-browse/product-spec.md).
- **Depends on (build order):** `lot-entry-cockpit-shell`, `migrate-list-lots-browse`
- **Complete:** [#9 UI feedback primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) where toasts/confirms apply.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Child PRs target integration branch `feature/lot-entry-cockpit`, not `main` directly.
- Product Spec approval before `/design` on this child.

## Related documents

- Parent: [../product-spec.md](../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- Sub-feature index: [../README.md](../README.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
