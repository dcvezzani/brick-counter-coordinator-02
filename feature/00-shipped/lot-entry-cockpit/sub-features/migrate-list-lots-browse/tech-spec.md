# Tech Spec — Migrate list lots browse

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-15). Consumes lot shape from [#62 lot-data-model](../lot-data-model/tech-spec.md). Aligns with [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Browse-mode `ListLotsView` columns and mobile cards: part / color / condition / qty from new lot model; drop Lot A/B/C `label` column |
| **Feature** | [migrate-list-lots-browse](./) · child of [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | **Draft** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **PR target** | `feature/lot-entry-cockpit` (integration branch) |

## Context

### Summary

Update **browse mode** (`/session/:sessionId/lots` without `?mode=organizer`) so the lot table and mobile cards show **part id**, **resolved color name**, **condition label**, and **qty** — matching parent [#10](../product-spec.md) lot identity (part + color + condition). Remove the legacy **`label`** column (Lot A/B/C) as primary row identity. **Organizer mode** (`?mode=organizer`) is unchanged: same pick-list tables, actions, and copy.

This Unit is **presentation only** in `ListLotsView.vue` and its unit tests. Lot save semantics, fixture migration, and reconciliation rollup remain [#62 lot-data-model](../lot-data-model/tech-spec.md).

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [product-spec.md](./product-spec.md) | Approved child scope — browse columns, organizer unchanged |
| [../product-spec.md](../product-spec.md) | Parent: lot triple identity; browse on SessionNav **Lots** route |
| [../lot-data-model/tech-spec.md](../lot-data-model/tech-spec.md) | Canonical lot shape: `{ id, partId, colorId, condition, qty }` |
| [../part-color-catalog/tech-spec.md](../part-color-catalog/tech-spec.md) | `bricklink-colors-subset.js` + optional `lookupColor` for id → name |
| [src/views/ListLotsView.vue](../../../../src/views/ListLotsView.vue) | **Primary** — browse vs organizer split already exists |
| [src/components/ResponsiveDataTable.vue](../../../../src/components/ResponsiveDataTable.vue) | Column `accessor` functions for derived cells |
| [tests/unit/views/ListLotsView.test.js](../../../../tests/unit/views/ListLotsView.test.js) | Assert browse vs organizer; update Lot A assertion |
| Sibling [LotListTable.vue](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/src/components/LotListTable.vue) | Prior art: Part + Color + Qty (no condition column in sibling cup mode — parent #10 adds condition here) |
| [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md) | JS-only Vue SFCs |

### Out of scope for this Unit

Per approved Product Spec — do not implement:

- Organizer pick-list UI, flags, or `ViewActions` changes
- Lot entry cockpit / `LotEntryView` layout ([#65 lot-entry-cockpit-shell](../lot-entry-cockpit-shell/product-spec.md))
- `saveLot`, fixture migration, or `storyboard-session.js` API changes ([#62](../lot-data-model/tech-spec.md))
- Part/color picker components (Wave B)
- Reconciliation compare logic
- New routes or SessionNav changes
- Swatches in browse table (color-picker owns swatch UX; name string is sufficient here)

## Architecture

### High-level design

```
┌──────────────────────────────────────────────────────────────┐
│  ListLotsView.vue (browse branch only)                        │
│    session.lots[] ──► ResponsiveDataTable columns             │
│    mobile #mobile slot ──► part / color / condition / qty    │
└────────────────────────────┬─────────────────────────────────┘
                             │ reads
┌────────────────────────────▼─────────────────────────────────┐
│  storyboard-session.js → session.lots (post #62)             │
│    { partId, colorId, condition, qty }                         │
└────────────────────────────┬─────────────────────────────────┘
                             │ resolve color name
┌────────────────────────────▼─────────────────────────────────┐
│  lookupColor(colorId) — part-catalog or colors-subset fixture │
│  formatLotCondition(condition) — local helper in view/lib     │
└──────────────────────────────────────────────────────────────┘
```

**Boundary:** Browse presentation lives in `ListLotsView.vue`. Color id → display name uses catalog fixture layer (not inline Lot A/B strings). Organizer branch is a **no-touch** except shared imports if extracted helpers are module-level.

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| [#62 lot-data-model](../lot-data-model/tech-spec.md) | `session.lots[]` with `colorId`, `condition`, `qty` | **Hard dependency** — rebase onto merged Wave A before Build |
| [#59 part-color-catalog](../part-color-catalog/tech-spec.md) | `lookupColor(colorId)` → name (or read `bricklink-colors-subset.js`) | Soft dependency for name resolution; see [Color display](#color-display) |
| `ResponsiveDataTable` | `columns[].accessor(item)` | Derived color/condition cells |
| Organizer mode | `session.organizerLists` | **Unchanged** — no column edits |

## Data

### Input lot shape (from lot-data-model)

| Field | Type | Browse display |
|-------|------|----------------|
| `partId` | string | Column **Part** — raw id |
| `colorId` | number | Column **Color** — resolved name via catalog |
| `condition` | `'N' \| 'U'` | Column **Condition** — `New` / `Used` |
| `qty` | number | Column **Qty** |

**Not displayed in browse:** `id` (row key only), legacy `label`, legacy `color` name string, legacy `quantity`.

### Color display

**Preferred:** `lookupColor(colorId)` exported from `src/lib/part-catalog.js` when [#59](../part-color-catalog/tech-spec.md) is merged — returns `{ name }` or `name` string from `bricklink-colors-subset.js`.

**Fallback (if catalog not merged at Build):** import name map from `src/fixtures/bricklink-colors-subset.js` in a tiny `src/lib/lot-display.js` helper; replace with `lookupColor` when catalog lands (single call site in `ListLotsView`).

**Unknown colorId:** show em dash `—` or numeric id (test with missing id only in unit test — not in demo fixture).

### Condition display

Module-local helper (view file or `src/lib/lot-display.js`):

```javascript
export function formatLotCondition(condition) {
  if (condition === 'N') return 'New'
  if (condition === 'U') return 'Used'
  return condition ?? '—'
}
```

Matches parent product spec storage (`N` / `U`) vs UI labels (`New` / `Used`).

## APIs & contracts

No HTTP API. **UI contract — browse mode table:**

| Column key | Header | Source |
|------------|--------|--------|
| `partId` | Part | `lot.partId` |
| `color` | Color | `lookupColor(lot.colorId)?.name ?? '—'` |
| `condition` | Condition | `formatLotCondition(lot.condition)` |
| `qty` | Qty | `lot.qty` |

**Removed column:** `label` / header `Lot`.

### Mobile card layout (browse)

Replace label-primary card with identity-first layout (aligned with parent mobile-first policy):

| Element | Content |
|---------|---------|
| Primary line | `{{ lot.partId }}` (font-medium) |
| Secondary line | `{{ colorName }} · {{ conditionLabel }}` (muted) |
| Trailing | `×{{ lot.qty }}` (tabular-nums) |

No `Lot A` / `Lot B` text in browse mobile or desktop.

### Organizer mode (unchanged)

| Area | Behavior |
|------|----------|
| `organizerColumns` | Same keys: Part, Name (accessor), Qty, Status |
| Pick-list sections | Same `session.organizerLists` loop |
| `ViewActions` | Declare ready / Return to reconciling — unchanged |
| Mobile organizer cards | Unchanged |
| Tests | Existing organizer tests must pass without modification |

## UI / client

### Files to change

| File | Change |
|------|--------|
| `src/views/ListLotsView.vue` | Replace `lotColumns`; update browse `#mobile` slot; use `qty`; add color/condition accessors |
| `src/lib/lot-display.js` | **New (optional)** — `formatLotCondition`; thin `colorNameForId` wrapper if catalog export missing |
| `tests/unit/views/ListLotsView.test.js` | Drop `Lot A` expectation; assert part id, color name, condition, qty |

**Do not change:** organizer template blocks, `organizerColumns`, route/query handling, `storyboard-session.js`, `demo-session.js` (owned by #62).

### Column definition (target)

```javascript
import { formatLotCondition, colorNameForId } from '@/lib/lot-display.js'

const lotColumns = [
  { key: 'partId', header: 'Part' },
  {
    key: 'color',
    header: 'Color',
    accessor: (lot) => colorNameForId(lot.colorId),
  },
  {
    key: 'condition',
    header: 'Condition',
    accessor: (lot) => formatLotCondition(lot.condition),
  },
  { key: 'qty', header: 'Qty' },
]
```

### Accessibility

- Table headers remain plain text (`Part`, `Color`, `Condition`, `Qty`).
- Mobile list keeps `role="list"` from `ResponsiveDataTable`.
- Condition and color on secondary line separated by ` · ` with `aria-hidden` on separator (match existing browse pattern).

## Security & privacy

- Read-only display of in-memory demo session data; no new network or storage.

## Acceptance criteria (for Review)

- [ ] Browse mode table has columns **Part**, **Color**, **Condition**, **Qty** — no **Lot** / `label` column.
- [ ] Browse mobile cards show part id, color name, condition label, and qty — no Lot A/B/C text.
- [ ] Color column resolves demo fixture color ids to names (e.g. Red, Blue, Black per merged subset map).
- [ ] Condition column shows `New` or `Used` for `N` / `U`.
- [ ] Header badge still shows `N lots` count from `session.lots.length`.
- [ ] Organizer mode (`?mode=organizer`) unchanged: titles, pick lists, Moved/Needs location, ViewActions.
- [ ] Unit test browse mode asserts new columns/content; does not assert `Lot A`.
- [ ] `npm test` and `npm run build` pass on branch after rebase onto #62 lot shape.
- [ ] No TypeScript introduced.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | Browse columns render part/color/condition/qty | `ListLotsView.test.js` — mount browse route |
| Unit | No `Lot A` in browse output | Replaces current assertion |
| Unit | Organizer mode regression | Existing organizer tests unchanged |
| Integration | N/A | No new routes |
| E2E / manual | Browse readable on ~375px | Optional in Review UI pass; parent #10 criterion |

**Test setup:** `__resetSessionsForTests()` + `createDemoSession()` in `beforeEach`. Tests assume migrated fixture from #62 (`colorId`, `condition`, `qty` on lots).

Example browse assertion:

```javascript
it('browse mode shows part, color, condition, and qty — not Lot labels', async () => {
  createDemoSession()
  // ... mount browse route
  expect(wrapper.text()).not.toContain('Lot A')
  expect(wrapper.text()).toContain('3001')
  expect(wrapper.text()).toContain('Red')      // or resolved name from subset
  expect(wrapper.text()).toContain('Used')     // demo lots default U per #62
  expect(wrapper.text()).toContain('10')       // qty for lot-1
})
```

## Rollout & operations

### Rollout plan

- Child PR → `feature/lot-entry-cockpit`.
- **Rebase** onto merged [#62 lot-data-model](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) before Build; Wave D parallel with [#65 shell](../lot-entry-cockpit-shell/product-spec.md).

### Monitoring & observability

N/A — local storyboard.

### Rollback

Revert child PR; browse reverts to legacy columns (acceptable only if #62 also reverted).

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| #62 not merged — lots still have `label` / `quantity` | Block Build until lot-data-model on integration branch; document in PR |
| Color id map drift between #62 and #59 subset fixtures | Rebase and use **integration branch** `bricklink-colors-subset.js` as single source; flag mismatch in PR if names wrong |
| `lookupColor` not yet in part-catalog | `lot-display.js` reads subset fixture directly; swap import when #59 merges |
| Sibling list lots has no condition column | Parent #10 explicitly requires condition in browse — not a regression vs sibling |
| Parallel edit to `ListLotsView` from #65 shell | File ownership: this child owns browse table; shell owns lot entry route — coordinate if both touch same file |

### Resolved decisions

| # | Decision | Resolved |
|---|----------|----------|
| 1 | Primary browse identity | part + color + condition + qty (parent product — not reopened) |
| 2 | Drop `label` column | Yes — no Lot A/B/C in browse |
| 3 | Organizer mode | Unchanged (product spec) |
| 4 | Quantity field | `qty` per lot-data-model |
| 5 | Condition labels | `N`→New, `U`→Used |
| 6 | Color resolution | Catalog subset / `lookupColor`; not raw `colorId` in UI |
| 7 | Swatches in browse | Out of scope — text color name only |

## Design review passes (merged findings)

### Architecture

- **Thin view change:** presentation only; no session API edits keeps Wave D parallel with shell safe.
- **Display helpers** in `lot-display.js` avoid duplicating condition formatting in future views (reconciliation browse may reuse later).
- **Accessor pattern** on `ResponsiveDataTable` already supports derived cells — no new table component.
- Organizer branch isolation: single `v-if="isOrganizerMode"` — browse edits stay in `v-else` block.

### Frontend

- Mobile card hierarchy matches parent “identity first” — part id prominent, metadata secondary.
- Reuse existing `SessionViewFrame` / `ViewHeader` / badge (`N lots`) — no layout redesign.
- Touch targets: browse mode has no new buttons; organizer `min-h-11` buttons untouched.
- Do not add `size="xs"` on any new controls (N/A for this Unit).

### Backend / API

- N/A — no server.

### Testing

- Update one browse test (remove `Lot A`); keep organizer tests as regression guard.
- Assert **negative** (`not.toContain('Lot A')`) plus positive field checks.
- When #62 lands, fixture `condition: 'U'` for all three demo lots — tests should expect `Used`.

### CI / deploy

- Existing PR CI (`npm test`, `npm run build`) sufficient.
- No workflow changes.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | AI draft | Initial Tech Spec for migrate-list-lots-browse (#66) |

## Related documents

- [product-spec.md](./product-spec.md)
- [../product-spec.md](../product-spec.md)
- [../lot-data-model/tech-spec.md](../lot-data-model/tech-spec.md)
- [../part-color-catalog/tech-spec.md](../part-color-catalog/tech-spec.md)
- [AIDLC.md](./AIDLC.md)
- [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md)
- [GitHub issue #66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66)
