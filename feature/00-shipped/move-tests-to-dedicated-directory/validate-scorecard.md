# Validate Scorecard — move-tests-to-dedicated-directory

**Feature:** [move-tests-to-dedicated-directory](./) · [#47](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47)  
**Product Spec:** [product-spec.md](./product-spec.md)  
**Tech Spec:** [tech-spec.md](./tech-spec.md)  
**Ship candidate:** [PR #57](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/57) · merged `main` @ `b606a53` (2026-06-14)  
**Branch validated:** `feature/move-tests-to-dedicated-directory` · post-merge `main` @ `b606a53`  
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
| 1 | Zero `*.test.js` / `*.spec.js` under `src/` | **PASS** | `find src …` → 0 files; CI guard step in `.github/workflows/ci.yml` |
| 2 | All former unit tests run from `tests/unit/` with `.test.js` suffix | **PASS** | 17 unit files; `npm test` → **61 tests** (≥ 60 pre-migration on `main` + integration exemplar) |
| 3 | Layout mirrors `src/` under `tests/unit/` | **PASS** | `tests/unit/components/`, `views/`, `router/`, `lib/` present; spot-check `ViewHeader.test.js` → `@/components/ViewHeader.vue` |
| 4 | Integration tier has README + router redirect exemplar | **PASS** | `tests/integration/README.md`; `router-closed-session-redirect.test.js` passes in `npm test` |
| 5 | CI enforces no tests in `src/` | **PASS** | Guard step fails with `::error::` message citing `tests/unit/` and `tests/integration/` |
| 6 | CI unchanged for contributors otherwise | **PASS** | PR CI: Node 24, `npm ci`, `npm test`, `npm run build` — [run 27514444377](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27514444377) **SUCCESS** |
| 7 | Contributor guidance updated | **PASS** | [PROJECT.md](../../../PROJECT.md) key directories lists `tests/unit/` and `tests/integration/` |

---

## Gates exercised

| Gate | Result | Notes |
|------|--------|-------|
| **CI on PR #57** | PASS | Guard + test + build |
| **Local test/build** | PASS | 18 files, 61 tests; build success (2026-06-14) |
| **Review approved** | PASS | [review-report.md](./review-report.md) — 2026-06-14 |
| **UI validation** | N/A | Contributor tooling only — no end-user UI criteria |
| **Deploy / staging** | N/A | Local SPA; no deployment pipeline |

---

## Remaining debt (does not fail Validate)

| Item | Tracking |
|------|----------|
| `docs/tech-stack.md` omits `tests/` layout | Optional; `/learn` may add one line |
| Tech Spec inventory lists 13 files (Design baseline) | PR migrates 17 (includes tests added on `main` after Design) |

---

## Failures / rework

None. No phase return recommended.

---

## Tracker

| Item | Status |
|------|--------|
| GitHub [#47](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47) | **Closed** (Validate PASS) |
| PR [#57](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/57) | **Merged** @ `b606a53` |

---

## Human gate

Per AIDLC Validate phase:

- [x] Scorecard ≥ 90%
- [x] CI green on ship-candidate
- [x] **Merge PR #57** — `main` @ `b606a53`
- [ ] **`/learn move-tests-to-dedicated-directory`**

---

## Artifacts

- [ship-report.md](./ship-report.md)
- [review-report.md](./review-report.md)
