# Learn notes — New session set search picker

**Feature:** [new-session-use-filterable-picker](./) · [#88](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/88) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-16)  
**Learn date:** 2026-06-16  
**Merged:** [PR #89](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/89) → `main` @ `a886ce9`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 15 |
| UI rules | [docs/ui-rules.md](../../../docs/ui-rules.md) — MarketingShell New session uses `SetSearchCombobox` |
| Specs | [product-spec.md](./product-spec.md), [tech-spec.md](./tech-spec.md) |
| Validate / ship | [validate-scorecard.md](./validate-scorecard.md), [ship-report.md](./ship-report.md) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| `FormField` + `Input` on New session | **`SetSearchCombobox`** only (component owns label + helper) | Matches `PartSearchCombobox` pattern; helper text lives in picker |
| Card inside `ViewFrame` | **`space-y-4` div** only | Post-build UX fix — `Card` `overflow-hidden` clipped FilterablePicker panel |
| `/review` before Validate | **Deferred** | Build + Validate evidence sufficient for storyboard slice |
| Sibling `SetSearchCombobox` port | **Greenfield** from `PartSearchCombobox` + new `set-catalog.js` | Sibling component not implemented yet |

---

## Patterns to reuse

- **Set picker stack:** `FilterablePicker` → `SetSearchCombobox` → `set-catalog.js` + `storyboard-sets.js` fixture (mirrors part picker + `part-catalog.js`).
- **Normalization:** `normalizeSetNumber` on blur/submit — bare digits → `-1`; explicit variants preserved.
- **MarketingShell forms:** Do not wrap searchable pickers in shadcn `Card` — use `ViewFrame` inner frame only; `Card` applies `overflow-hidden`.
- **Default demo set:** `10281-1` (Bonsai Tree) on New session load.

---

## Process friction

1. **CI delay on first PR push** — empty commit eventually triggered workflow; not blocking.
2. **Merge main into feature branch** — resolved `NewSessionView` conflict (picker + `PRIMARY_ACTION_BUTTON_CLASS`).
3. **Validate before merge** — scorecard recorded merge pending until human merged PR #89.

---

## Git hygiene

| Item | Result |
|------|--------|
| Worktree | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/new-session-use-filterable-picker` — removed |
| Branch | `feature/new-session-use-filterable-picker` — pruned (merged via squash) |
| Ports | `aidlc-ports.sqlite` rows for `new-session-use-filterable-picker` — N/A (never registered) |
| PR | [#89](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/89) (merged) |

---

## Feature closure

- [x] Validate PASS approved
- [x] PROJECT.md updated
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/new-session-use-filterable-picker/`
- [x] GitHub issue #88 closed (at merge)
- [x] Worktree cleaned up
