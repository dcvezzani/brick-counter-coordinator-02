# Tech Spec — Session progress breadcrumb navigation (go-back v2)

**AIDLC phase:** Design  
**Grounding:** [product-spec.md](./product-spec.md) (approved 2026-06-15). Reuses phase matrix from [#53 go-back-to-previous-state](../go-back-to-previous-state/tech-spec.md).  
**Work item:** [#80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80)  
**Status:** **Shipped** — [PR #82](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/82) → `main` @ `637fdf5`

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Clickable **past** steps on `SessionProgress`; strip-owned `ConfirmDialog`; remove ViewActions back buttons and SessionNav phase auto-regress |
| **Key files** | `SessionProgress.vue`, `usePhaseNavigation.js`, `storyboard-session.js` (`isProgressStepClickable`), `ConfirmDialog.vue`, `AlertDialogContent.vue` |

## Acceptance criteria → implementation

| Criterion | Implementation |
|-----------|----------------|
| Past allowed steps clickable | `SessionProgress` button when `isProgressStepClickable(phase, session.phase)` |
| Current step no-op | `Badge` with `aria-current="step"` |
| Future / Import not clickable | Plain `<span>`; `isAllowedBackwardTarget` rejects `importing` |
| Multi-step confirm | `needsBackwardConfirm` → `ConfirmDialog` on strip; dynamic copy in composable |
| Phase + route sync | `goBackToPhase` + `router.push(landingRouteLocation(...))` |
| SessionNav route-only | Removed phase handlers from `SessionNav.vue` |
| ViewActions backs removed | `ListLotsView`, `ListCupsView`, `ReconciliationView` |
| Forward gates unchanged | Existing view tests + `isAllowedBackwardTarget` |

## Tests

- `SessionProgress.test.js` (7)
- `usePhaseNavigation.test.js`
- `ConfirmDialog.test.js` (race + pointer-events stack)
- View regressions: `ListLotsView`, `ListCupsView`, `ReconciliationView`, `SessionNav`

## Docs

- [application-views.md](../../docs/support/application-views.md) — strip-only backward controls
- [ui-rules.md](../../docs/ui-rules.md) — ConfirmDialog go-back example
- [ADR-0005](../../adr/0005-progress-strip-backward-navigation.md)

---

## Retrospective (Learn 2026-06-16)

| Planned | Delivered | Why |
|---------|-----------|-----|
| Tech Spec committed at `/design` | Restored at `/learn` | Spec approved in chat but never pushed before Build |
| #53 ViewActions + SessionNav regress | **Strip only** | Product decision at Plan — simpler single affordance |
| ConfirmDialog race guard only | Also `AlertDialogContent` `pointer-events-auto` | Overlay intercepted clicks in real browser; found during Validate UX pass |
| 154 tests at first build | 162 at ship | UX copy + affordance tests added with polish commit |

**Easier than expected:** Reusing `goBackToPhase` / `needsBackwardConfirm` from #53 — v2 was mostly UX relocation.

**Harder than expected:** shadcn/reka alert-dialog stacking (`pointer-events`, z-index) and `AlertDialogAction` auto-close race with confirm handler.
