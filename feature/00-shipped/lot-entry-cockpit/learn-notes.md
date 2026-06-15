# Learn notes — lot-entry-cockpit

**Feature:** [lot-entry-cockpit](./) · Parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-15)  
**Learn date:** 2026-06-15  
**Merged:** [PR #68](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/68) → `main` @ `ac14d67` (+ child PRs #69–#78)

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) |
| Lot identity ADR | [adr/0004-lot-identity-and-counting-model.md](../../../adr/0004-lot-identity-and-counting-model.md) |
| UI rules — worker counting | [docs/ui-rules.md](../../../docs/ui-rules.md) § Worker counting |
| Routes | [docs/support/application-views.md](../../../docs/support/application-views.md) |
| GitHub issue spec links | [docs/github-issues.md](../../../docs/github-issues.md) |
| Product spec retrospective | [product-spec.md](./product-spec.md) § Learn retrospective |
| Validate / review evidence | [ship-report.md](./ship-report.md), [review-report.md](./review-report.md), [validate-lot-entry-mobile.png](./validate-lot-entry-mobile.png) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Single parent Tech Spec | Per-child `tech-spec.md` only (10 children) | Epic split for parallel worktrees; parent criteria in Product Spec |
| Port swipe quantity input | `+`/`−` stepper only | Product decision in Plan chat |
| Compact chrome (minimal header) | `ViewHeader` + description retained | Shell delivered compact rhythm (`space-y-3`, `min-h-11`); full chrome trim deferred to #11 |
| Arrow-key picker navigation | Enter-only (sibling parity) | Tech-spec P1 deferred; not a parent Product Spec criterion |
| Validate on integration branch only | Re-scored on `main` after full merge | Wave E scorecard was 18% FAIL until Waves A–D landed |
| `queen-of-code/AI-DLC` doc links | `dcvezzani/AI-DLC` after fork/rebrand | Consumer + AI-DLC merge during delivery |

---

## Patterns to reuse

- **10 child sub-features** under `sub-features/<slug>/` with waves A→E ([README](./sub-features/README.md)).
- **Git worktrees** per child branch; PRs target parent integration branch `feature/lot-entry-cockpit`, then single PR #68 → `main`.
- **Blob URLs** for GitHub issue bodies — [docs/github-issues.md](../../../docs/github-issues.md); never relative `feature/…` paths in issues.
- **Picker stack:** `FilterablePicker` → `PartSearchCombobox` / `ColorPicker` → `LotEntryForm` → `LotEntryView` shell.
- **Port map** from sibling `brick-counter-coordinator` documented in parent Product Spec and child AIDLC files.

---

## Child issues completed

| # | Slug | Issue |
|---|------|-------|
| 58 | filterable-picker | [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58) |
| 59 | part-color-catalog | [#59](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/59) |
| 60 | part-search-combobox | [#60](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/60) |
| 61 | color-picker | [#61](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/61) |
| 62 | lot-data-model | [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) |
| 63 | lot-condition-defaults | [#63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63) |
| 64 | lot-entry-form | [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64) |
| 65 | lot-entry-cockpit-shell | [#65](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) |
| 66 | migrate-list-lots-browse | [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) |
| 67 | lot-entry-cockpit-validate | [#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67) |

---

## Process friction (feeds AIDLC improvement)

1. **Stale validate scorecard** — Wave E `/ship` ran before upstream merges; required explicit re-score on `main`.
2. **AI-DLC submodule + merge conflicts** — canonical spec-link docs landed in fork; consumer bump + merge resolution needed mid-epic.
3. **10 worktrees** — powerful for parallel `/design` and `/build`, but commit hygiene across branches + integration consolidation takes orchestration.
4. **GitHub issue relative links** — broke until `GITHUB-ISSUE-SPEC-LINKS` consumer docs added.

---

## Follow-up Features

| Item | Issue |
|------|-------|
| Role-aware shells (further compact worker chrome) | [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) |
| Go back to previous phase | [#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) |

---

## Feature closure

- [x] Validate PASS approved (2026-06-15)
- [x] PROJECT.md updated
- [x] ADR-0004 written
- [x] Learn notes (this file)
- [x] Parent issue #10 closed
- [x] Child #67 closed
- [x] Feature folder → `feature/00-shipped/lot-entry-cockpit/`
