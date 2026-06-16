# Ship Report — Consistent button sizes

**Validate date:** 2026-06-16  
**Approved:** 2026-06-16 — David Vezzani (chat)  
**Verdict:** **PASS**  
**Scorecard:** [validate-scorecard.md](./validate-scorecard.md)  
**Work item:** [#86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86)  
**Ship candidate:** [PR #87](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/87)

---

## TL;DR

- Feature **#86** meets all **5** Product Spec success criteria at **100%**.
- Shared `PRIMARY_ACTION_BUTTON_CLASS` (`min-h-11 md:min-h-9`) plus `ViewActions` slot sizing closes marketing and phase-gate gaps.
- Build approved and Validate PASS in chat; `/review` deferred to expedite ship.

---

## What was validated

### Automated

```
npm test   → 35 files, 231 tests passed (2026-06-16)
npm run build → success
```

### Code evidence

| Deliverable | Location |
|-------------|----------|
| Shared height constant | `src/lib/primary-action-button-ui.js` |
| ViewActions default sizing | `src/components/ViewActions.vue` |
| Marketing shell buttons | `src/views/HomeView.vue`, `NewSessionView.vue` |
| Import / Declare (via wrapper) | `PartOutImportView.vue`, `ListLotsView.vue` — no per-view height patches |
| Documentation | `docs/ui-rules.md` |
| Tests | `primary-action-button-ui.test.js`, `ViewActions.test.js`, `HomeView.test.js` |

### UI (Chrome DevTools MCP @ port 18000)

| Screen | Phone (375px) | Laptop (1280px) |
|--------|---------------|-----------------|
| Home — Start demo | 44px min-height | 36px |
| New session — Create | (via class + unit) | 36px |
| Import — Confirm | 44px | via `ViewActions` `md:min-h-9` |
| Organizer — Declare | 44px | via `ViewActions` `md:min-h-9` |

---

## Advisory

- **`/review` not run** — human approved build and requested `/ship` directly; no blocking findings from Validate.

---

## Next

Run **`/learn button-sizes-are-inconsistent`** after PR merge.
