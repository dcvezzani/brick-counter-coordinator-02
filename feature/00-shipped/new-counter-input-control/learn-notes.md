# Learn notes — New counter input control

**Feature:** [new-counter-input-control](./) · [#83](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/83)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-16)  
**Learn date:** 2026-06-16  
**Merged:** [PR #85](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/85) → `main` @ `2ab9e84`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 13 |
| UI rules | [docs/ui-rules.md](../../../docs/ui-rules.md) — worker counting quantity row |
| Specs | [product-spec.md](./product-spec.md), [tech-spec.md](./tech-spec.md) |
| Validate / ship | [validate-scorecard.md](./validate-scorecard.md), [ship-report.md](./ship-report.md) |
| Supersedes | [#10 lot-entry-cockpit](../lot-entry-cockpit/product-spec.md) swipe deferral (out-of-scope note) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Lot-entry-cockpit: `+`/`−` only | **SteppedSwipeNumberInput** | Field feedback: counting felt slow; product reversal in #83 |
| Sibling `countMin: 0` | **`min: 1`** on control | Coordinator-02 validation unchanged |
| Test ids on span `lot-entry-qty` | **`lot-entry-qty-input`** text field | Control exposes typed input; plus/minus ids unchanged |
| No global test setup | **`tests/setup.js`** `matchMedia` stub | Component `onMounted` requires it for all form mounts |

---

## Patterns to reuse

- **Sibling port bundle:** Copy `SteppedSwipeNumberInput.vue` + `useNumericField` + `numeric-field*` + `stepped-swipe-number-input` + tests verbatim; wire with `:min="1"` and `test-id="lot-entry-qty"`.
- **Tab chain:** Part → color `focusFilter` → qty `focus()` → shift-tab `@tab-backward` → color `focusFilter`.
- **Form tests:** Qty via `lot-entry-qty-input` `.setValue` + `blur`, or `pointerdown` on ± + `pointerup` on `window` (not `click`).
- **Vitest:** Global `matchMedia` mock in `tests/setup.js` (see `vite.config.js` `setupFiles`).

---

## Process friction

1. **Fast cycle** — Plan, Design, Build, Validate, Learn in one day; specs committed before merge on Design approval (good).
2. **Port size** — ~2.5k lines copied; acceptable because sibling is canonical and tests travel with the component.

---

## Git hygiene

| Item | Result |
|------|--------|
| Branch | `feature/new-counter-input-control` — merged; safe to delete |
| PR | [#85](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/85) (merged) |

---

## Feature closure

- [x] Validate PASS approved
- [x] PROJECT.md updated
- [x] ui-rules.md quantity row updated
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/new-counter-input-control/`
- [x] GitHub issue #83 closed
