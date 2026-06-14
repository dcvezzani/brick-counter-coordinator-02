# Validate Scorecard — Toast look and feel

**Feature:** [toast-look-and-feel](./)  
**Product Spec:** [product-spec.md](./product-spec.md)  
**Tech Spec:** *(none — quick fix)*  
**Ship candidate:** `main` @ `87ae980` (2026-06-14)  
**Validate date:** 2026-06-14  
**Threshold:** 90% (AIDLC default)

---

## Result

| Metric | Value |
|--------|-------|
| **Criteria passed** | 7 / 7 |
| **Score** | **100%** |
| **Verdict** | **PASS** |

---

## Scorecard (Product Spec success criteria)

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Toast **top-right**, fixed over page content | **PASS** | **UI (Chrome DevTools MCP):** `data-y-position=top`, `data-x-position=right`, `position: fixed`, `z-index: 999999999` on `/session/demo/reconciliation` ([desktop screenshot](./validate-export-toast-desktop.png)) |
| 2 | Shared neutral **border** + **background**; type icons retained | **PASS** | `border-width: 1px`, `background: oklch(1 0 0)` (popover token); info icon + message in a11y snapshot; `Sonner.vue` icon color classes |
| 2b | **Close control** dismisses immediately | **PASS** | **UI:** `Close toast` button visible; click → no `[data-visible="true"]` toast within same session |
| 3 | Page layout does not jump when toast shows/dismisses | **PASS** | Toaster `position: fixed`; toast overlays main (`toastOverMain: true`); document flow unchanged |
| 4 | Export stub + celebration toasts fire with correct copy | **PASS** | **UI:** export message `Storyboard: XML export stub — no file generated.`; **Unit:** `ReconciliationView.test.js`, `HomeView.test.js`, `feedback.test.js` (61/61 pass) |
| 5 | **Top-right on mobile**; clears top safe area | **PASS** | **UI:** 390×844 mobile viewport — `topPx: 16`, `y=top`, `x=right` ([mobile screenshot](./validate-export-toast-mobile.png)); `App.vue` `mobile-offset` uses `env(safe-area-inset-top)` |
| 6 | `npm test` / `npm run build` pass | **PASS** | Local Validate 2026-06-14: 18 files, 61 tests; `vite build` success |

---

## Gates exercised

| Gate | Result | Notes |
|------|--------|-------|
| **Merge to `main`** | PASS | `87ae980` on `main` |
| **Local test/build** | PASS | 2026-06-14 Validate run |
| **UI validation (Chrome DevTools MCP)** | PASS | `http://localhost:5173` — export toast desktop + mobile; close dismiss |
| **Deploy / staging** | N/A | Local storyboard SPA |

---

## Remaining debt (does not fail Validate)

| Item | Tracking |
|------|----------|
| No GitHub issue / PR (quick fix) | By product decision |
| Celebration toast UI not manually re-walked end-to-end | Covered by existing `HomeView.test.js` + same global Toaster styling |
| Shipped #9 docs still reference bottom-right in archived tech spec | Superseded by `docs/ui-rules.md` update |

---

## Failures / rework

None. No phase return recommended.

---

## Tracker

| Item | Status |
|------|--------|
| GitHub issue | **N/A** — quick fix per Product Spec |

---

## Human gate

Per AIDLC Validate phase:

- [x] Scorecard ≥ 90%
- [x] Merge/commit toast changes to `main` (`87ae980`)
- [x] **`/learn toast-look-and-feel`** — 2026-06-14

---

## Artifacts

- [ship-report.md](./ship-report.md)
- [validate-export-toast-desktop.png](./validate-export-toast-desktop.png)
- [validate-export-toast-mobile.png](./validate-export-toast-mobile.png)
