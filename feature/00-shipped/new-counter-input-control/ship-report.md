# Ship report — new-counter-input-control (#83)

**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS** (100%, 7/7)  
**Merged:** [PR #85](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/85) → `main` @ `2ab9e84`  
**Date:** 2026-06-16

## Summary

Replaced the lot entry form's one-tap `+`/`−` quantity stepper with the sibling app's **SteppedSwipeNumberInput** — swipe ±1/±10, hold-repeat, typed entry, keyboard nudging — while preserving save, duplicate confirm, and min qty 1.

## Evidence

| Artifact | Link |
|----------|------|
| UI screenshot (mobile lot entry) | [validate-lot-entry-qty-control.png](./validate-lot-entry-qty-control.png) |
| CI (PR branch) | [actions/runs/27622469244](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27622469244) |
| Tests | 228 passing (`npm test` on `main`) |

## Files touched (implementation)

- `src/components/SteppedSwipeNumberInput.vue` (new)
- `src/components/LotEntryForm.vue` (qty control swap + tab chain)
- `src/composables/useNumericField.js`, `src/lib/numeric-field*.js`, `src/lib/stepped-swipe-number-input.js` (new)
- `tests/unit/components/SteppedSwipeNumberInput.test.js`, `tests/unit/lib/stepped-swipe-number-input.test.js`, `tests/setup.js`
