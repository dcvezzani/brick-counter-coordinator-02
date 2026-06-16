# Product Spec — Session progress breadcrumb navigation (go-back v2)

**AIDLC phase:** Plan  
**Status:** **Approved** (2026-06-15)  
**Work item:** [#80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80)  
**Builds on:** [#53 go-back-to-previous-state](../go-back-to-previous-state/product-spec.md) (phase engine)  
**Related Tech Spec:** [tech-spec.md](./tech-spec.md)

---

## Problem

[#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) added backward phase navigation via per-view **Back to …** buttons and SessionNav auto-regress. That worked but duplicated affordances on every screen and made detours confusing (route vs phase).

## Outcome

**One control:** clickable **past** steps on the session progress strip. SessionNav is **route-only** again.

## Decisions (approved 2026-06-15)

| Decision | Choice |
|----------|--------|
| Primary affordance | **Progress strip only** — remove ViewActions back buttons |
| SessionNav | **Route-only** — no Lot/Reconcile phase auto-regress |
| Current step click | **No-op** — badge only; use an earlier past step |
| Multi-step confirm | **Keep** #53 rule — confirm when skipping >1 phase step |
| Import as back target | **Not allowed** from Count+ |

## Success criteria (Validate)

| # | Criterion |
|---|-----------|
| 1 | Reconcile → strip **Count** → `counting` + lot entry |
| 2 | Organize → strip **Reconcile** or **Count** → correct landing |
| 3 | Export → strip back targets; confirm when skip >1 |
| 4 | Future strip steps not clickable |
| 5 | ViewActions “Back to …” removed |
| 6 | Forward progression unchanged |
| 7 | `npm test` / `npm run build` pass |

## Out of scope

- Home “Jump to phase” demo controls
- Coordinator server phase authority
- Wiping session data on backward move

## Retrospective (Learn 2026-06-16)

- Spec files were approved in chat but not committed until `/learn` — caused 404 blob links during Build/Review.
- UX polish (confirm copy, touch targets, `AlertDialogContent` pointer-events) landed in the same PR after initial build; Validate scored the merged result at 100%.
