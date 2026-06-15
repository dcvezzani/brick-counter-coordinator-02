# Ship Report — Compare with Part-Out List on List lots (#79)

**Feature:** [compare-part-out-list-from-list-lots](./)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%**  
**Merged:** [PR #81](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/81)  
**Ship date:** 2026-06-15

## Summary

Added sticky **Compare with Part-Out List** to **List lots browse** during Count — parity with Lot entry. Three unit tests; docs updated in `application-views.md` and `ui-rules.md`.

## Evidence

| Type | Reference |
|------|-----------|
| Review | [review-report.md](./review-report.md) — five dimensions PASS |
| UI | Chrome DevTools MCP — Count → Lots → Compare → Reconciliation |
| Tests | `ListLotsView.test.js` (+3); full suite 160 tests |

## Code touchpoints

- `src/views/ListLotsView.vue` — `compareWithPartOut`, `ViewActions` in browse mode
- `tests/unit/views/ListLotsView.test.js`
