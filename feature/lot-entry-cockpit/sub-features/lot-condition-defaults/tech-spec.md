# Tech Spec — Lot condition defaults

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-15). Aligns with [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md) (JavaScript Vue client). Parent context: [lot-entry-cockpit product-spec](../../product-spec.md) · [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Session part-out condition mode (`partOutOptions.condition`), `resolveDefaultLotCondition` and choosable/read-only helpers, demo seed field, unit tests — **no form UI** |
| **Feature** | [lot-condition-defaults](./) · child of [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [#63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | **Draft** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **PR target** | `feature/lot-entry-cockpit` (integration branch) |

## Context

### Summary

Port the sibling **lot condition default resolver** into coordinator-02 as a pure JS module (`lot-entry-defaults.js`). Session seed gains `partOutOptions.condition` (`new` / `used` / `mixed`) so storyboard presenters see which rule applies. Export `resolveDefaultLotCondition(session)` returning `'N'` or `'U'`, plus `isConditionChoosable` / `isConditionReadOnly` for `lot-entry-form` (Wave C) to mirror sibling `LotForm` — read-only when session is all-new or all-used, choosable when mixed.

Condition remains part of **lot identity** (`partId` + `colorId` + `condition`); this Unit does not change `saveLot` or merge-on-duplicate semantics ([lot-data-model](../lot-data-model/tech-spec.md)).

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [product-spec.md](./product-spec.md) | Approved child scope — resolver + seed + tests |
| [../lot-data-model/tech-spec.md](../lot-data-model/tech-spec.md) | Lot `condition: 'N' \| 'U'`; demo lots default `'U'` until this child refines seed mode |
| [../product-spec.md](../product-spec.md) | Parent: condition in lot triple; session new/used/mixed rules |
| [AIDLC.md](./AIDLC.md) | File ownership; branch `feature/lot-entry-cockpit-lot-condition-defaults` |
| [src/fixtures/demo-session.js](../../../../src/fixtures/demo-session.js) | Add `partOutOptions.condition` only (no lot row edits in this child if `lot-data-model` already migrated) |
| Sibling prior art | [`lot-entry-defaults.js`](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/src/lib/lot-entry-defaults.js), sibling `LotForm.vue` condition field behavior |

### Out of scope for this Unit

Per approved Product Spec — do not implement:

- `LotEntryForm.vue` / condition control UI (`lot-entry-form`)
- `saveLot`, `lotKey`, fixture lot row migration (`lot-data-model`)
- Part/color pickers, catalog, list-lots presentation
- Phase machine or import UI for setting condition mode at runtime (storyboard seed only)
- Production API / persistence

## Architecture

### High-level design

```
┌─────────────────────────────────────────────────────────────┐
│  lot-entry-form (Wave C — consumer, not this Unit)          │
│    isConditionReadOnly(session) → render static label         │
│    isConditionChoosable(session) → N/U toggle or select       │
│    resolveDefaultLotCondition(session) → initial v-model      │
└───────────────────────────┬─────────────────────────────────┘
                            │ imports
┌───────────────────────────▼─────────────────────────────────┐
│  lot-entry-defaults.js (pure helpers)                       │
│    getPartOutConditionMode(session)                         │
│    resolveDefaultLotCondition(session) → 'N' | 'U'          │
│    isConditionChoosable(session) → boolean                  │
│    isConditionReadOnly(session) → boolean                   │
│    conditionDisplayLabel(condition) → 'New' | 'Used'        │
│    CONDITION_OPTIONS (for form select/radio)                │
└───────────────────────────┬─────────────────────────────────┘
                            │ reads
┌───────────────────────────▼─────────────────────────────────┐
│  session (from demo-session seed / storyboard-session)      │
│    partOutOptions: { condition: 'new'|'used'|'mixed' }      │
│    lots[].condition — unchanged by this Unit                │
└─────────────────────────────────────────────────────────────┘
```

**Boundary:** Condition **rules** live in `lot-entry-defaults.js`. Session **storage** of chosen condition on each lot remains `lot-data-model`. UI wiring is `lot-entry-form`.

### Integration points

| Consumer | Contract | Notes |
|----------|----------|-------|
| `lot-entry-form` (future) | `resolveDefaultLotCondition`, `isConditionChoosable`, `isConditionReadOnly`, `CONDITION_OPTIONS`, `conditionDisplayLabel` | Form resets condition to default on save-and-add-another |
| `lot-data-model` (upstream) | Lot `condition: 'N' \| 'U'` | **Build dependency** — merge Wave A first |
| `demo-session.js` | `partOutOptions.condition` | Touch only this field (+ comment for presenters) |
| Presenters / docs | Seed value documents mode | Demo uses `'used'` (see Data) |

## Data

### Session: `partOutOptions.condition`

| Field | Type | Required | Values | Meaning |
|-------|------|----------|--------|---------|
| `partOutOptions.condition` | string | yes (in seed) | `'new'` \| `'used'` \| `'mixed'` | Part-out import condition mode for the session |

**Normalization:** If `partOutOptions` or `condition` is missing when helpers run, treat as `'mixed'` (permissive storyboard default — choosable, default `'U'`).

### Condition mode → behavior

| Mode | `resolveDefaultLotCondition` | `isConditionChoosable` | `isConditionReadOnly` | UX (for `lot-entry-form`) |
|------|------------------------------|------------------------|-------------------------|---------------------------|
| `new` | `'N'` | `false` | `true` | Show **New**; worker cannot change |
| `used` | `'U'` | `false` | `true` | Show **Used**; worker cannot change |
| `mixed` | `'U'` (initial default) | `true` | `false` | Worker picks **New** or **Used** |

**Mixed initial default `'U'`:** Aligns with parent counting scenario (Used default) and `lot-data-model` demo lot condition. `lot-entry-form` may persist worker’s last choice within the session for save-and-add-another; that persistence is **out of scope** here (form local state).

### Demo seed (`demo-session.js`)

Add to `createDemoSessionSeed()` return object:

```javascript
partOutOptions: {
  condition: 'used', // all-used part-out — condition field read-only, default Used
},
```

**Rationale:** Parent workflow scenario: worker sees **Used** as session default. Matches migrated demo lots (`condition: 'U'`) from `lot-data-model`. Presenters can change to `'new'` or `'mixed'` in fixture for alternate demos.

**Merge coordination:** If `lot-data-model` is not yet on the integration branch, rebase this child onto merged Wave A before `/build`. Touch **only** `partOutOptions` in `demo-session.js`; do not edit `lots[]` or `reconciliationRows[]` here.

### Lot condition constants

```javascript
export const LOT_CONDITION = {
  NEW: 'N',
  USED: 'U',
}

export const PART_OUT_CONDITION_MODE = {
  NEW: 'new',
  USED: 'used',
  MIXED: 'mixed',
}

export const CONDITION_OPTIONS = [
  { value: 'N', label: 'New' },
  { value: 'U', label: 'Used' },
]
```

Storage values `'N'` / `'U'` match [lot-data-model](../lot-data-model/tech-spec.md); display labels **New** / **Used** match parent product spec.

## APIs & contracts

### `getPartOutConditionMode(session)`

- **Input:** session object (plain or reactive).
- **Returns:** `'new'` \| `'used'` \| `'mixed'`.
- **Behavior:** Read `session.partOutOptions?.condition`; if absent or invalid, return `'mixed'`.

### `resolveDefaultLotCondition(session)`

- **Returns:** `'N'` \| `'U'`.
- **Behavior:**
  - `new` → `'N'`
  - `used` → `'U'`
  - `mixed` → `'U'` (initial default; user may override when choosable)

### `isConditionChoosable(session)`

- **Returns:** `boolean`.
- **Behavior:** `true` iff mode is `'mixed'`.

### `isConditionReadOnly(session)`

- **Returns:** `boolean`.
- **Behavior:** `!isConditionChoosable(session)`.

### `conditionDisplayLabel(condition)`

- **Input:** `'N'` \| `'U'`.
- **Returns:** `'New'` \| `'Used'`.
- **Behavior:** Unknown values fall through to `'Used'` (defensive; should not occur in storyboard).

**No side effects** on any export. Session mutation stays in `storyboard-session` / form layer.

## UI / client

No new Vue components in this Unit.

**Contract for `lot-entry-form` (documentation only):**

| Session mode | Condition control |
|--------------|-------------------|
| Read-only (`new` / `used`) | Static text via `conditionDisplayLabel(resolveDefaultLotCondition(session))` — no toggle |
| Choosable (`mixed`) | Two-option control (radio group or select) bound to `'N'` / `'U'`; options from `CONDITION_OPTIONS`; initialize from `resolveDefaultLotCondition(session)` |

Mobile: choosable control uses `default` button size minimum per parent ui-rules (enforced in `lot-entry-form`).

## Security & privacy

- In-memory fixture/session only; no PII.
- No network surface.

## Acceptance criteria (for Review)

- [ ] `getPartOutConditionMode` returns `'new'`, `'used'`, or `'mixed'` from seed; missing → `'mixed'`.
- [ ] `resolveDefaultLotCondition` returns `'N'` for `new`, `'U'` for `used` and `mixed`.
- [ ] `isConditionChoosable` is `true` only for `mixed`; `isConditionReadOnly` is inverse.
- [ ] `conditionDisplayLabel('N')` → `'New'`; `conditionDisplayLabel('U')` → `'Used'`.
- [ ] `CONDITION_OPTIONS` exposes both N/U with display labels.
- [ ] Demo seed includes `partOutOptions.condition: 'used'` with brief comment.
- [ ] Unit tests cover all three modes per product success criteria (#1–#3).
- [ ] `npm test` and `npm run build` pass on branch.
- [ ] No TypeScript; plain JS module exports only.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | Mode detection + default resolution | `tests/unit/lib/lot-entry-defaults.test.js` (new) |
| Unit | Choosable vs read-only flags | One `describe` per mode |
| Unit | Display label helper | Trivial mapping |
| Integration | N/A | No routes |
| E2E / manual | Mixed choosable UX | Deferred to `lot-entry-form` + parent Validate |

**Test principles:** build minimal session fixtures inline (`{ partOutOptions: { condition: 'new' } }`); no `createDemoSession()` required for resolver tests.

Example scenarios:

```javascript
it('all-new part-out defaults to New', () => {
  const session = { partOutOptions: { condition: 'new' } }
  expect(resolveDefaultLotCondition(session)).toBe('N')
  expect(isConditionReadOnly(session)).toBe(true)
})

it('mixed session allows choice', () => {
  const session = { partOutOptions: { condition: 'mixed' } }
  expect(isConditionChoosable(session)).toBe(true)
  expect(resolveDefaultLotCondition(session)).toBe('U')
})
```

## Rollout & operations

### Rollout plan

- Child PR → `feature/lot-entry-cockpit`.
- **Rebase on merged `lot-data-model`** (Wave A) before `/build` if integration branch lacks lot `condition` field.
- Coordinate `demo-session.js` with `lot-data-model` / `part-color-catalog` — this child adds **only** `partOutOptions`.

### Monitoring & observability

N/A — local storyboard.

### Rollback

Revert child PR; remove `lot-entry-defaults.js` and `partOutOptions` from seed.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Sibling `lot-entry-defaults.js` not verified in-repo (private/unavailable) | API shaped from product spec + parent scenario; reconcile on `/build` if sibling diverges |
| `lot-data-model` not merged when Wave B starts | Document build-order blocker; rebase worktree |
| `demo-session.js` merge conflicts | Touch only `partOutOptions` block; single insertion after `setNumber` or before `partOutLines` |
| Mixed mode initial default `'U'` vs sibling | Documented decision; change only via product chat |
| Invalid `condition` string in seed | Normalize to `'mixed'` in `getPartOutConditionMode` |

### Resolved decisions

| # | Decision | Resolved |
|---|----------|----------|
| 1 | Condition in lot identity | `partId` + `colorId` + `condition` (parent — not reopened) |
| 2 | Session rules | `new` / `used` / `mixed` via `partOutOptions.condition` |
| 3 | Read-only vs choosable | Locked modes read-only; mixed choosable (product spec) |
| 4 | Storage values | `'N'` / `'U'` per `lot-data-model` |
| 5 | Demo seed mode | `'used'` — matches parent “Used default” scenario |
| 6 | Mixed initial default | `'U'` until worker selects otherwise in form |
| 7 | No UI in this Unit | Helpers only; `lot-entry-form` owns controls |

## Design review passes (merged findings)

### Architecture

- **Pure functions** in `lot-entry-defaults.js` — no Vue dependency; testable without mount.
- **Sibling parity** on export names (`resolveDefaultLotCondition`, session `partOutOptions.condition`) eases port diff and `lot-entry-form` copy.
- **Single file ownership** per [AIDLC.md](./AIDLC.md); avoid duplicating condition logic in form or session module.
- Do **not** derive mode from scanning `partOutLines` at runtime — seed field is source of truth for storyboard (production import would set this later).

### Frontend

- No SFCs; `CONDITION_OPTIONS` gives stable list for future shadcn `Select` or radio group.
- `conditionDisplayLabel` centralizes New/Used copy for read-only and selected states.
- Reactive session from `storyboard-session` works unchanged — helpers accept plain session snapshots.

### Backend / API

- N/A — no server.

### Testing

- Dedicated `lot-entry-defaults.test.js`; keep tests independent of `storyboard-session` lot API.
- Three mode matrix tests map directly to product Validate criteria #1–#3.
- Optional test: missing `partOutOptions` → mixed + choosable.

### CI / deploy

- Existing PR CI (`npm test`, `npm run build`) sufficient.
- No workflow changes.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-15 | AI draft | Initial Tech Spec for lot-condition-defaults (#63) |

## Related documents

- [product-spec.md](./product-spec.md)
- [../product-spec.md](../product-spec.md)
- [../lot-data-model/tech-spec.md](../lot-data-model/tech-spec.md)
- [AIDLC.md](./AIDLC.md)
- [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md)
- Sibling prior art: [lot-entry-defaults.js](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/src/lib/lot-entry-defaults.js)
- [GitHub issue #63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63)
