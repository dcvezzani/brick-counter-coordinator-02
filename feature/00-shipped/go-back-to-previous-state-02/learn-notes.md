# Learn notes — Session progress breadcrumb navigation (go-back v2)

**Feature:** [go-back-to-previous-state-02](./) · [#80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-15, approved)  
**Learn date:** 2026-06-16  
**Merged:** [PR #82](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/82) → `main` @ `637fdf5`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 12 |
| ADR | [adr/0005-progress-strip-backward-navigation.md](../../../adr/0005-progress-strip-backward-navigation.md) |
| Routes / backward nav | [docs/support/application-views.md](../../../docs/support/application-views.md) |
| Confirm pattern | [docs/ui-rules.md](../../../docs/ui-rules.md) § ConfirmDialog — go-back example |
| Phase diagram | [docs/session-phases-state.mmd](../../../docs/session-phases-state.mmd) |
| Specs | [product-spec.md](./product-spec.md), [tech-spec.md](./tech-spec.md) |
| Validate / review | [validate-scorecard.md](./validate-scorecard.md), [review-report.md](./review-report.md) |

---

## What differed from plan

| Planned (#53 follow-up) | Delivered | Why |
|-------------------------|-----------|-----|
| Clickable strip **or** ViewActions (Design open) | **Strip only** | Product approved strip as sole affordance; removed #53 back buttons |
| SessionNav Lot/Reconcile auto-regress | **Route-only nav** | Avoid phase desync on shared routes; strip owns phase back |
| Spec files on branch at Build | Committed at **Learn** | Plan/Design approved in chat; blob links 404 until now |
| Build = implementation only | UX polish + dialog fixes in same PR | Pointer-events and copy found during Validate |

---

## Patterns to reuse

- **Single backward affordance:** `SessionProgress` past steps → `usePhaseNavigation.goBack` → `goBackToPhase`.
- **Confirm on strip:** One `ConfirmDialog` on `SessionProgress`; dynamic title/body (`Go back to Count?`, skip list, `Stay on Export` / `Go to Count`).
- **Dialog stack:** `AlertDialogContent` needs `pointer-events-auto` and `z-[100]` above mobile `SessionNav` (`z-20`); `ConfirmDialog` uses pointerdown guard on confirm for reka auto-close race.
- **Detours:** On Cups during Reconcile, user clicks **Count** on strip (not current badge) — current step is intentionally not clickable.

---

## Process friction

1. **Issue closed at PR merge** (`Closes #80`) before Validate human gate — canonical close is `/ship`; GitHub automation is fine but gate checklist lagged.
2. **Missing committed specs** broke Review advisory and issue blob links — commit `product-spec.md` + `tech-spec.md` before `/build` on future features.
3. **Submodule bump in feature PR** (`AI-DLC`) — keep tooling commits separate when possible.

---

## Git hygiene

| Item | Result |
|------|--------|
| Branch | `feature/go-back-to-previous-state-02` — merged; safe to delete remote/local |
| Worktree | None for this feature |
| PR | [#82](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/82) (merged) |

---

## Feature closure

- [x] Validate PASS approved
- [x] PROJECT.md updated
- [x] ADR-0005 written
- [x] Learn notes (this file)
- [x] product-spec.md + tech-spec.md on `main`
- [x] Archived to `feature/00-shipped/go-back-to-previous-state-02/`
- [x] GitHub issue #80 closed (at merge)
