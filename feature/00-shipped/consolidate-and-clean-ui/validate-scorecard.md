# Validate Scorecard — consolidate-and-clean-ui

**Feature:** [consolidate-and-clean-ui](./) · Parent [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · Validate child [#40](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/40)  
**Product Spec:** [product-spec.md](./product-spec.md)  
**Ship candidate:** [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` (OPEN, CI green)  
**Branch validated:** `consolidate-and-clean-ui` @ `9869a02`  
**Validate date:** 2026-06-13  
**Threshold:** 90% (AIDLC default)

---

## Result

| Metric | Value |
|--------|-------|
| **Criteria passed** | 6 / 6 |
| **Score** | **100%** |
| **Verdict** | **PASS** (ship candidate — merge PR #52 before closing #5) |

---

## Scorecard (Product Spec success criteria)

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | All seven MVP views use shared frame + header pattern | **PASS** (1 debt) | **UI (Chrome DevTools MCP):** Home `h1` “Brick Counter Coordinator” via ViewHeader; Import `h1` “Part-out import”; Lot `h1` “Lot entry”; Reconcile `h1` “Reconciliation” + chapter badge ([screenshot](./validate-reconcile-screenshot.png)). **Unit tests:** `*.spec.js` on all migrated session views assert ViewHeader + SessionViewFrame. **Debt (accepted):** New session uses ViewFrame `#header` with hand-written `h1` — follow-up Feature per [PR #52 comment](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52#issuecomment-4700246581). Home hub Cards are content panels, not page shells (same PR comment). |
| 2 | Zero inline copies of sticky footer styling in views | **PASS** | `rg 'sticky bottom' src/views` → no matches. Sticky styling only in `src/components/ViewActions.vue`. |
| 3 | Session tabular views use ResponsiveDataTable (or documented exception) | **PASS** | Tabular: Import, Lot entry, Lots (browse + organizer), Reconciliation use `ResponsiveDataTable`. **Exception:** List cups uses `<ul>` list (non-tabular) — documented in [docs/ui-rules.md](../../../docs/ui-rules.md) migration status. |
| 4 | FormField + shadcn for form controls on migrated views | **PASS** | Home + New session: `FormField` + shadcn `Input`/`Select`. Session views are display/action-heavy; no raw inputs added in migration PRs. |
| 5 | `docs/ui-rules.md` published and linked from PROJECT.md | **PASS** | [docs/ui-rules.md](../../../docs/ui-rules.md) present; migration status updated post wave 2. [PROJECT.md](../../../PROJECT.md) links ui-rules in key directories + agent onboarding. |
| 6 | Phase/nav rules unchanged vs. application-views.md | **PASS** | `src/router/index.spec.js` — closed redirect, import `hideSessionNav`. `src/lib/storyboard-session.spec.js` — `sessionNavModel`, `landingRouteLocation`, cups hidden in `updating_inventory`. No router meta changes in migration PRs. |

---

## Gates exercised

| Gate | Result | Notes |
|------|--------|-------|
| **Integration PR** | OPEN | [#52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) mergeable; CI **SUCCESS** ([run 27483462824](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27483462824)) |
| **Local test/build** | PASS | `npm test` — 13 files, 42 tests; `npm run build` — success |
| **UI validation (Chrome DevTools MCP)** | PASS | `http://localhost:5173/` per [AGENTS.md](../../../AGENTS.md); walkthrough Home → New → Import → Lot → Reconcile |
| **Deploy / staging** | N/A | Local storyboard SPA |

---

## Remaining debt (does not fail Validate)

| Item | Tracking |
|------|----------|
| New session → `ViewHeader` | Follow-up Feature (product decision on PR #52) |
| Merge to `main` | Required before closing GitHub #5 |

---

## Failures / rework

None. No phase return recommended.

---

## Human gate

Per AIDLC Validate phase:

- [x] **Human approves Validate PASS**
- [x] **Merge PR #52** to `main` (`a40f27b`, 2026-06-14)
- [x] **`/learn consolidate-and-clean-ui`** (2026-06-14)
- [x] **Close GitHub #5**

**After approval:** Run **`/learn consolidate-and-clean-ui`** (PROJECT.md, ADRs, retrospective).

---

## Artifacts

- [ship-report.md](./ship-report.md)
- [validate-reconcile-screenshot.png](./validate-reconcile-screenshot.png)
