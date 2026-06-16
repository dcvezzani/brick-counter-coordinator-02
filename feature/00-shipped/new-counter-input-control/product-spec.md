# Product Spec — New counter input control

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | New counter input control |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Parent work item** | [#83](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/83) |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Approved for build** |
| **Prior art** | Sibling [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) — `SteppedSwipeNumberInput` on `LotForm.vue` |
| **Supersedes** | [lot-entry-cockpit](../00-shipped/lot-entry-cockpit/product-spec.md) out-of-scope note deferring swipe quantity input |

## Problem & audience

### Problem statement

During lot entry counting, workers adjust quantity one tap at a time with large `+` / `−` buttons. Entering counts above a handful feels **slow and tedious** compared to the sibling app, which supports swipe-to-step, hold-to-repeat at extremes, vertical ±10 gestures, direct numeric typing, and keyboard nudging. The counting cockpit shipped in [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) intentionally omitted swipe input; field feedback now says that tradeoff hurts throughput.

### Who it's for

- **Primary:** Worker counting parts during session `counting` phase on the lot entry form.
- **Secondary:** Demo presenter showing fast bulk entry during storyboard walkthroughs.

### Current experience (baseline)

`LotEntryForm` shows quantity as a centered number with `+` / `−` outline buttons. Each tap changes count by exactly 1. Minimum quantity is 1 (minus disabled at 1). No swipe, no hold-repeat, no ±10 shortcut, no inline numeric field. See `src/components/LotEntryForm.vue`.

## Outcomes & business impact

### Desired outcomes

- Workers can raise or lower lot quantity **faster** without leaving the counting flow.
- Quantity entry on coordinator-02 **matches the proven sibling control** workers already know from `brick-counter-coordinator`.
- Save, save-and-add-another, duplicate confirm, and validation behavior stay unchanged — only the quantity control interaction changes.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Lot entry quantity field uses the stepped swipe number control (not the legacy `+` / `−` span stepper) | Visual check on `/session/:id/lot` + unit test asserting control presence |
| 2 | Tap `+` / `−` on the control changes quantity by 1 | Unit or component test |
| 3 | Horizontal drag / swipe changes quantity in single-digit steps; vertical drag changes by 10 (sibling behavior) | Manual on phone + component tests where feasible |
| 4 | User can type a quantity directly in the control's numeric field | Manual + component test |
| 5 | Minimum quantity remains **1**; values below 1 are rejected on save with existing error copy | Unit test on `LotEntryForm` validation |
| 6 | Save and save-and-add-another still persist correct `qty` via storyboard session | Existing `LotEntryForm` tests updated and passing |
| 7 | `npm test` and `npm run build` pass | CI |

### Business impact

Improves counting throughput on the highest-frequency action in the counting phase — reducing friction that was accepted as a temporary divergence when lot-entry-cockpit shipped.

## User experience & scenarios

### Key scenarios

1. **Small adjustment** — Worker saved a lot at qty 3, realizes it should be 4: taps `+` once or nudges handle one slot right; count updates immediately.
2. **Bulk count** — Worker counts a handful of identical parts: drags handle horizontally through several slots and/or drags vertically for +10; hold at extreme slot accelerates toward target without repeated taps.
3. **Exact entry** — Worker knows count is 47: focuses numeric field, types `47`, blurs; save accepts value.
4. **Floor guard** — Worker tries to go below 1 via control or validation; quantity stays at or resets to minimum 1; save blocked with "Quantity must be at least 1" if somehow invalid.
5. **Save unchanged** — Worker sets quantity via new control, taps Save; duplicate handling, toast, and form reset (save-and-add-another) behave as today.

### Experience principles

- **Speed over simplicity** for quantity — accept the richer control because counting is repetitive.
- **Parity with sibling** — same interaction model as `LotForm` in brick-counter-coordinator unless coordinator-02 constraints force a documented exception.
- **Mobile-first** — control must remain usable one-handed on phone (44px touch targets, swipe on track).
- **Accessibility** — keyboard and screen-reader affordances from sibling control preserved (slider role, aria labels, arrow keys on field).
- **No regression** on part/color/condition pickers or sticky Compare CTA.

## Scope

### In scope

- Replace quantity UI in **`LotEntryForm`** with ported **`SteppedSwipeNumberInput`** from sibling repo (component + its supporting behavior as implemented in sibling).
- Wire `v-model` to existing `qty` ref; preserve `min` of 1 and existing save validation.
- Wire **tab backward** from quantity to color picker filter (sibling `LotForm` parity).
- Update **`LotEntryForm` unit tests** (and any lot-entry tests that target `lot-entry-qty-plus` / `lot-entry-qty-minus` test ids) for the new control.
- Document reversal of lot-entry-cockpit swipe deferral in this spec's **Decisions** once approved.

### Out of scope

- Quantity controls on **other screens** (reconciliation, import, list lots browse) — lot form only.
- Changing lot **data model**, duplicate merge rules, or save API.
- **Coordinator server** / live catalog.
- **New preferences UI** for axis direction or step sizes (use sibling defaults: horizontal ±1, vertical ±10, increment right / up).
- **Dev demo route** for the control — optional nice-to-have; not required for Validate unless added in Design.
- **Playwright e2e** — Vitest + manual/MCP UI validation acceptable per project norms.

### Dependencies on other teams or features

- **Complete:** [#10 lot-entry-cockpit](../00-shipped/lot-entry-cockpit/product-spec.md) — form, pickers, save path exist.
- **Complete:** [#9 ui-feedback-primitives](../00-shipped/ui-feedback-primitives/product-spec.md) — toasts unchanged.
- **Informed by:** [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) — `SteppedSwipeNumberInput.vue`, `LotForm.vue`, component tests.

## Constraints (non-technical where possible)

- Quantity remains a **positive integer**; minimum 1 per existing lot entry rules.
- Must not break **counting-phase** route `/session/:sessionId/lot` or session nav visibility.
- Storyboard-only app — no new backend contracts.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-15 | **Problem confirmed:** `+` / `−` stepper feels slow; user requested sibling `SteppedSwipeNumberInput` on lot form. |
| 2026-06-15 | **No max quantity cap** — match current coordinator-02 (uncapped). |
| 2026-06-15 | **Tab backward** from quantity to color picker — in scope (sibling parity). |
| 2026-06-15 | **Field label** stays **Quantity** (coordinator-02 convention; sibling uses "Count"). |
| 2026-06-15 | **Min quantity 1** — stricter than sibling config (`countMin: 0`); keep coordinator-02 validation. |

## Related documents

- Shipped baseline: [lot-entry-form product spec](../00-shipped/lot-entry-cockpit/sub-features/lot-entry-form/product-spec.md)
- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md)
- ADR (awareness): [ADR-0004 lot identity](../../adr/0004-lot-identity-and-counting-model.md)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
