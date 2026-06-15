# ADR-0004: Lot identity and counting data model (storyboard)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | David Vezzani |
| **Related** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [lot-entry-cockpit product-spec](../feature/00-shipped/lot-entry-cockpit/product-spec.md) · [ADR-0001](0001-frontend-vue-js-shadcn-stack.md) |

---

## Context

Storyboard lot rows originally used user-facing labels (`Lot A`, `Lot B`) with loose part/color strings. Production counting (and sibling app `brick-counter-coordinator`) keys lots by **part id + color id + condition** with a numeric **qty**. Workers count free-form; duplicate triples should merge quantities.

Coordinator-02 needed a client-side model in `storyboard-session.js` before any coordinator API exists.

## Decision

1. **Lot identity** is the triple `(partId, colorId, condition)` where `condition` is `N` or `U` in storage and shown as New/Used in UI.
2. **`saveLot(sessionId, payload)`** accepts `{ partId, colorId, condition, qty, mergeDuplicate? }`. Duplicate triple without `mergeDuplicate: true` returns `{ duplicate: true, existing }` for `ConfirmDialog` flow ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)).
3. **Fixture migration** — demo lots use `partId`, `colorId`, `condition`, `qty` (no `label` column). List lots browse resolves display via `lot-display.js`.
4. **Catalog** — `part-catalog.js` searches part-out lines first, then catalog extras; colors scoped per part via `getColorsForPart`.
5. **UI composition** — `LotEntryForm` composes ported pickers + `lot-entry-defaults.js`; quantity via `+`/`−` stepper only (no swipe input).

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| Keep Lot A/B labels | Minimal migration | Contradicts production contract and reconciliation |
| Forced part-out queue | Walk import list in order | Rejected in Product Spec — free-form counting |
| Pinia store for lots | Central reactive store | Storyboard pattern stays in `storyboard-session.js` until coordinator Feature |

## Consequences

### Positive

- Same route and form contract for future API sync.
- Reconciliation can compare objective part-out list vs lot triples.
- Sibling `LotForm` behavior portable with coordinator-02 conventions.

### Negative / trade-offs

- In-memory only — refresh loses counts (acceptable for storyboard).
- `bricklink-colors.js` is a subset, not full sibling catalog.

### Neutral / follow-ups

- Production persistence and BrickLink search are future Features.
- Role-aware compact chrome ([#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11)) may further reduce vertical chrome on lot entry.
