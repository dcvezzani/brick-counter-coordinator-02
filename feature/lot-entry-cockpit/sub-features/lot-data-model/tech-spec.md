# Tech Spec — Lot data model & save semantics

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-15). Aligns with [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md) (JavaScript Vue client).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Storyboard lot identity (`partId` + `colorId` + `condition` + `qty`), `lotKey` / `getLot` / `saveLot`, fixture migration, reconciliation `lotQty` sync |
| **Feature** | [lot-data-model](./) · child of [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | **Approved for build** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani (chat) |
| **PR target** | `feature/lot-entry-cockpit` (integration branch) |

## Context

### Summary

Port the sibling storyboard **lot identity and save contract** into coordinator-02’s in-memory session layer (`storyboard-session.js`). Migrate `demo-session.js` lot rows from legacy `label` / color name / `quantity` to **`partId` + `colorId` + `condition` + `qty`**. Expose `lotKey`, `getLot`, and `saveLot` with duplicate-triple detection and optional merge. Recompute reconciliation row `lotQty` when lots change. Update `completion-celebration.js` and owned tests; apply **mechanical** `qty` field reads in views so CI stays green — full lot browse/entry presentation remains sibling children (`migrate-list-lots-browse`, `lot-entry-cockpit-shell`).

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [product-spec.md](./product-spec.md) | Approved child scope — identity, save, fixture, rollup |
| [../product-spec.md](../product-spec.md) | Parent decisions: lot triple identity, merge-on-duplicate, Vue 3 + Vite fixtures |
| [src/lib/storyboard-session.js](../../../../src/lib/storyboard-session.js) | In-memory session store — **extend** with lot API |
| [src/fixtures/demo-session.js](../../../../src/fixtures/demo-session.js) | Demo seed — **migrate** lot row shape |
| [src/lib/completion-celebration.js](../../../../src/lib/completion-celebration.js) | Aggregates `session.lots` — switch `quantity` → `qty` |
| Sibling [useFixtureSession.js](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/src/composables/useFixtureSession.js) | Prior art: `lotKey`, `saveLot`, `getLot`, duplicate merge |
| [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md) | JS-only Vue SFCs |

### Out of scope for this Unit

Per approved Product Spec — do not implement:

- Counting form UI (`lot-entry-form`)
- List lots / lot entry **presentation** redesign (`migrate-list-lots-browse`, `lot-entry-cockpit-shell`) beyond mechanical `qty` field reads
- Part/color catalog (`part-color-catalog`) — except shared fixture color id constants if extracted to avoid drift
- Condition default resolver (`lot-condition-defaults`)
- Confirm-dialog UX for duplicates (caller passes `mergeDuplicate: true`; UI in `lot-entry-form`)
- Production API / persistence

## Architecture

### High-level design

```
┌─────────────────────────────────────────────────────────────┐
│  Future: lot-entry-form (Wave C)                             │
│    saveLot(sessionId, { partId, colorId, condition, qty })   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  storyboard-session.js                                       │
│    lotKey(partId, colorId, condition) → stable string key    │
│    getLot(sessionId, lotId)                                  │
│    saveLot(sessionId, payload) → { lot, duplicate?, merged? }│
│    syncReconciliationLotQty(session)  [internal]             │
└───────────────────────────┬─────────────────────────────────┘
                            │ mutates
┌───────────────────────────▼─────────────────────────────────┐
│  reactive session (from demo-session seed)                   │
│    lots[]: { id, partId, colorId, condition, qty }           │
│    reconciliationRows[]: { …, colorId, condition, lotQty }   │
└─────────────────────────────────────────────────────────────┘
```

**Boundary:** Lot domain logic lives in `storyboard-session.js` (application layer). Fixtures supply seed data only. Views read session state but do not implement save/merge rules.

### Integration points

| Consumer | Contract | Notes |
|----------|----------|-------|
| `lot-entry-form` (future) | `saveLot(sessionId, payload)` | Passes `mergeDuplicate: true` after user confirms duplicate |
| `lot-condition-defaults` (future) | Reads lot shape | Depends on this Unit merging first |
| `migrate-list-lots-browse` (future) | `session.lots` with `colorId`, `condition`, `qty` | Presentation only; shape defined here |
| `completion-celebration.js` | `lot.qty` sum | Updated in this Unit |
| `ReconciliationView` | `reconciliationRows[].lotQty` | Updated via sync on save; display unchanged |

## Data

### Lot record (canonical)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | yes | Stable row id (`lot-1`, or `lot-${Date.now()}` on create) |
| `partId` | string | yes | BrickLink-style part number |
| `colorId` | number | yes | BrickLink color id |
| `condition` | `'N' \| 'U'` | yes | New / Used |
| `qty` | number | yes | Count in bucket (≥ 0) |

**Removed from lots (legacy):** `label`, `color` (name string), `quantity`.

### Lot identity key

```javascript
function lotKey(partId, colorId, condition) {
  return `${partId}:${colorId}:${condition}`
}
```

Same triple → same key. **Export** `lotKey` for unit tests and downstream children.

### Fixture migration (`demo-session.js`)

**Storyboard color map** (coordinator-02 demo names → BrickLink ids; shared with `part-color-catalog` when merged):

| Color name (legacy) | `colorId` |
|---------------------|-----------|
| Red | 4 |
| Blue | 7 |
| Black | 11 |

**Default condition** for migrated demo lots: `'U'` (Used) — matches mixed part-out storyboard; `lot-condition-defaults` may refine later.

**Lot rows (after migration):**

| id | partId | colorId | condition | qty |
|----|--------|---------|-----------|-----|
| lot-1 | 3001 | 4 | U | 10 |
| lot-2 | 3023 | 7 | U | 8 |
| lot-3 | 3069b | 11 | U | 3 |

**Reconciliation rows:** add `colorId` and `condition` to each row; set initial `lotQty` from matching lot triple (same values as today). `partOutQty` unchanged.

Organizer lines and part-out lines keep `quantity` field name for now (`part-color-catalog` owns part-out `colorId` extension).

## APIs & contracts

### `getLot(sessionId, lotId)`

- Returns lot object or `null`.
- No side effects.

### `saveLot(sessionId, payload)`

**Input `payload`:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `partId` | string | yes | |
| `colorId` | number | yes | |
| `condition` | string | yes | `'N'` or `'U'` |
| `qty` | number | yes | |
| `id` | string | no | Update existing lot by id |
| `mergeDuplicate` | boolean | no | When `true`, add `qty` to existing triple |

**Return shape** (aligned with sibling):

```javascript
// New or updated
{ lot, duplicate: false }
// Merged duplicate
{ lot, duplicate: false, merged: true }
// Duplicate detected — caller shows confirm
{ lot: existingLot, duplicate: true, existing: { qty: number } }
```

**Behavior (ordered):**

1. Resolve session; throw if missing.
2. Find existing lot with same `lotKey` (different `id`).
3. If duplicate and `mergeDuplicate` → add qty, sync reconciliation, return `merged: true`.
4. If duplicate and not merging → return `duplicate: true` with existing qty (no `createdBy` in coordinator-02 — no workers yet).
5. If `payload.id` matches a lot → update fields, sync reconciliation.
6. Else push new lot (`id: payload.id ?? \`lot-${Date.now()}\``), sync reconciliation.

### `syncReconciliationLotQty(session)` (internal)

For each `reconciliationRows` entry with `partId`, `colorId`, `condition`:

```javascript
lotQty = sum of lot.qty where lot matches triple
```

Called at end of every successful `saveLot` mutation.

## UI / client

No new UI in this Unit.

**Mechanical updates only** (prevent blank qty / broken tests; not presentation redesign):

| File | Change |
|------|--------|
| `LotEntryView.vue` | `lot.quantity` → `lot.qty` in template |
| `ListLotsView.vue` | `lot.quantity` → `lot.qty` in template |
| `completion-celebration.js` | `lot.quantity` → `lot.qty` in reducer |

Column headers still showing `label` / `color` name may display empty until `migrate-list-lots-browse` — acceptable at this wave.

## Security & privacy

- In-memory browser-tab state only; no PII beyond demo fixture data.
- No new network surface.

## Acceptance criteria (for Review)

- [ ] `lotKey('3001', 4, 'U')` is stable and equal for repeated calls with same args.
- [ ] `saveLot` creates a lot with `partId`, `colorId`, `condition`, `qty`.
- [ ] `saveLot` with same triple (no `id`, no `mergeDuplicate`) returns `duplicate: true`.
- [ ] `saveLot` with `mergeDuplicate: true` adds qty to existing lot; lot count unchanged.
- [ ] `getLot` returns lot by id after save.
- [ ] Fixture lots have no required `label`; use `colorId`, `condition`, `qty`.
- [ ] `syncReconciliationLotQty` updates `reconciliationRows[].lotQty` after save.
- [ ] `buildSessionCompletionSummary` uses `qty`; existing celebration test expectations still pass (21 pieces, 3 lots).
- [ ] `npm test` and `npm run build` pass on branch.
- [ ] No TypeScript introduced; exports remain plain JS.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | `lotKey` stability | `tests/unit/lib/storyboard-session.test.js` (extend) |
| Unit | `saveLot` create, duplicate, merge | New `describe('saveLot')` block |
| Unit | `getLot` lookup | Same file |
| Unit | reconciliation `lotQty` after save | Assert row updates |
| Unit | `completion-celebration` aggregates `qty` | Existing file — update if fixture totals change |
| Integration | N/A | No API |
| E2E / manual | N/A | No UI owned by this Unit |

**Test principles:** use `__resetSessionsForTests()` + `createDemoSession()` in `beforeEach`; deterministic ids in fixture for assertions.

Example scenarios:

```javascript
it('saveLot detects duplicate triple', () => {
  createDemoSession()
  const result = saveLot(DEMO_SESSION_ID, {
    partId: '3001', colorId: 4, condition: 'U', qty: 1,
  })
  expect(result.duplicate).toBe(true)
})

it('saveLot merges when mergeDuplicate is true', () => {
  createDemoSession()
  const before = getSession(DEMO_SESSION_ID).lots.length
  saveLot(DEMO_SESSION_ID, {
    partId: '3001', colorId: 4, condition: 'U', qty: 5, mergeDuplicate: true,
  })
  expect(getSession(DEMO_SESSION_ID).lots.length).toBe(before)
  expect(getLot(DEMO_SESSION_ID, 'lot-1').qty).toBe(15)
})
```

## Rollout & operations

### Rollout plan

- Child PR → `feature/lot-entry-cockpit` integration branch.
- Wave A parallel with `filterable-picker` and `part-color-catalog`; coordinate `demo-session.js` conflicts via merge order (distinct sections: lots vs catalog).

### Monitoring & observability

N/A — local storyboard.

### Rollback

Revert child PR; restore legacy lot shape if needed.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| `demo-session.js` merge conflicts with `part-color-catalog` | Touch only `lots` and `reconciliationRows` arrays; document line ranges in PR |
| Views show empty `label`/`color` columns | Expected until `migrate-list-lots-browse`; mechanical `qty` only here |
| Reconciliation match without `colorId` on part-out lines | Rollup uses lot triple vs reconciliation row triple; part-out `colorId` added by catalog child |
| Sibling has `createdBy` on duplicate | Omit in coordinator-02 until workers exist; `existing: { qty }` only |
| Integer `colorId` vs string | Use **number** per sibling and BrickLink convention |

### Resolved decisions

| # | Decision | Resolved |
|---|----------|----------|
| 1 | Lot identity | `partId` + `colorId` + `condition` (parent product — not reopened) |
| 2 | Quantity field name | `qty` on lots (sibling parity) |
| 3 | Duplicate handling | Sibling `saveLot` contract; merge via `mergeDuplicate: true` |
| 4 | Demo color ids | Red=4, Blue=7, Black=11 for fixture migration |
| 5 | Default migrated condition | `'U'` for all three demo lots |
| 6 | Reconciliation sync | Internal helper on every `saveLot` mutation |
| 7 | `lotKey` export | Public export for tests and downstream children |

## Design review passes (merged findings)

### Architecture

- **Single responsibility:** `storyboard-session.js` owns lot mutations and reconciliation rollup; fixtures stay declarative.
- **Sibling parity** on `lotKey` / `saveLot` return shape eases later port of `LotForm` confirm flow.
- **No composable wrapper** — coordinator-02 uses module functions (existing `storyboard-session` pattern), not sibling’s `useFixtureSession` composable.
- Export only `lotKey`, `getLot`, `saveLot`; keep `syncReconciliationLotQty` module-private.

### Frontend

- Reactive session object means `saveLot` mutations propagate to views without extra state layer.
- Mechanical `qty` template updates avoid runtime `undefined` during Wave A integration.
- Defer catalog display helpers (`colorName(colorId)`) to `part-color-catalog`.

### Backend / API

- N/A — no server.

### Testing

- Colocate lot API tests in `storyboard-session.test.js` beside phase/nav tests.
- One assertion per behavior (key stability, create, duplicate, merge, rollup).
- `completion-celebration.test.js` guards regression on aggregate totals after fixture migration.

### CI / deploy

- Existing PR CI (`npm test`, `npm run build`) sufficient.
- No workflow changes.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | AI draft | Initial Tech Spec for lot-data-model (#62) |
| 2026-06-15 | David Vezzani | **Approved for build** (chat) |

## Related documents

- [product-spec.md](./product-spec.md)
- [../product-spec.md](../product-spec.md)
- [AIDLC.md](./AIDLC.md)
- [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md)
- Sibling prior art: [useFixtureSession.js](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/src/composables/useFixtureSession.js)
- [GitHub issue #62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62)
