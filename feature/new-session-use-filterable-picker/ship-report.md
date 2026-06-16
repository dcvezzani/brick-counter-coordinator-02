# Ship report — new-session-use-filterable-picker (#88)

**Validate date:** 2026-06-16  
**Verdict:** **PASS** (7/7 criteria, 100%)  
**PR:** [#89](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/89)  
**Scorecard:** [validate-scorecard.md](./validate-scorecard.md)

---

## Summary

New session now uses **SetSearchCombobox** backed by a fixture **set-catalog** (~6 sets). Coordinators search by set number or name, see resolved set names, and get BrickLink-style normalization (`10281` → `10281-1`). The redundant `Card` wrapper was removed so the FilterablePicker dropdown is not clipped.

---

## Delivered

| Area | Artifact |
|------|----------|
| Component | `src/components/SetSearchCombobox.vue` |
| Catalog | `src/lib/set-catalog.js`, `src/fixtures/storyboard-sets.js` |
| View | `src/views/NewSessionView.vue` |
| Tests | `tests/unit/lib/set-catalog.test.js`, `tests/unit/components/SetSearchCombobox.test.js` |

---

## Validation evidence

- **CI:** green on PR #89
- **Local:** 245 unit tests, production build OK
- **UI:** `/session/new` — default `10281-1` + "Bonsai Tree"; filter `apollo` → Apollo set; Create session → import with set **10281-1**

---

## Next steps

1. Merge PR #89
2. Run `/learn new-session-use-filterable-picker`
3. Close [#88](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/88)
