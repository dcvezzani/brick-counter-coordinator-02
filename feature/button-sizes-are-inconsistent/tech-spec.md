# Tech Spec — Unit 1: Consistent primary action button heights

**AIDLC phase:** Design (one **Unit**)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-16). Aligns with [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) and [docs/ui-rules.md](../../../docs/ui-rules.md).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Shared primary-action touch-target class; `ViewActions` default sizing; marketing-shell button updates; `ui-rules` doc |
| **Feature** | [button-sizes-are-inconsistent](./) · [#86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | Draft — awaiting human approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |

## Context

### Summary

Primary workflow and marketing buttons on four intake screens still use the shadcn **default** height (`h-8`, ~32px) while peer screens (Reconciliation, Compare CTAs, `ConfirmDialog`) already use **`min-h-11 md:min-h-9`** (~44px phone / ~36px laptop). This Unit introduces one **exported Tailwind class string**, applies it to **marketing-shell** buttons explicitly, and applies the same minimum heights to **all** `ViewActions` slot buttons via the shared wrapper — closing gaps without a new Button size variant or per-view copy-paste.

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [docs/ui-rules.md](../../../docs/ui-rules.md) | Breakpoint matrix; `ConfirmDialog` / sticky CTA touch-target notes (lines ~344) |
| [feature/00-shipped/view-actions/product-spec.md](../00-shipped/view-actions/product-spec.md) | Sticky vs static `ViewActions` layout — unchanged |
| [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) | `ViewActions` as shared session chrome |
| `src/components/ui/button/` | Default `size` = `h-8`; no `cta` size today |
| `src/components/ConfirmDialog.vue` | Canonical `min-h-11 md:min-h-9` on dialog actions |
| `src/views/ReconciliationView.vue` | Reference implementation for phase CTAs |

### Out of scope for this Unit

Per approved Product Spec:

- Organizer **Moved** / **Needs location** row toggles
- Part-out import **Back** header control (`size="sm"` ghost)
- `SessionNav`, `SessionProgress`, lot-entry stepper / swipe controls
- New shadcn `Button` size variant or theme token change
- Full-width sticky CTAs on phone (width unchanged unless already present)
- Refactoring every historical `min-h-11`-only usage outside the intake list (optional dedup only where noted below)

## Architecture

### High-level design

```
src/lib/primary-action-button-ui.js
  PRIMARY_ACTION_BUTTON_CLASS = 'min-h-11 md:min-h-9'
        │
        ├─► HomeView.vue          — class on Start / Resume / Go
        ├─► NewSessionView.vue    — class on Create session
        │
        └─► ViewActions.vue     — [&_[data-slot=button]]:min-h-11 md:min-h-9
              │
              ├─► PartOutImportView   Confirm and begin counting
              ├─► ListLotsView        Declare ready to import
              └─► (existing consumers) Lot entry / Reconcile / Compare — heights align; redundant per-button classes may be removed
```

**Why not a new `Button` size?** Product Spec asks to reuse the established pattern; `min-h-*` overrides on `default` size match `ConfirmDialog` and Reconciliation without fighting shadcn `h-8` padding. A dedicated `size="cta"` would touch the design system and every consumer — out of scope.

**Why `ViewActions` wrapper?** Import and Organizer gaps are single `ViewActions` children; centralizing in the wrapper prevents future phase-gate drift and fixes Part-out / Declare without repeating the class string. Marketing routes do not use `ViewActions` — they import the constant directly.

### Boundaries

| Layer | Responsibility |
|-------|----------------|
| `src/lib/primary-action-button-ui.js` | Single source of truth for primary action minimum height classes |
| `src/components/ViewActions.vue` | Applies minimum heights to direct slot `Button` primitives (`data-slot="button"`) |
| `src/views/HomeView.vue` | Apply constant to three hub buttons |
| `src/views/NewSessionView.vue` | Apply constant to Create session |
| `docs/ui-rules.md` | Document marketing-shell + `ViewActions` primary button heights |

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| shadcn `Button` | `data-slot="button"` on root | ViewActions selector targets this attribute |
| Vitest / CI | `npm test`, `npm run build` | Extend existing view tests; no workflow changes |
| Tailwind `md` | 768px breakpoint | Same as `ui-rules` matrix |

## Data

No data model or API changes.

## APIs & contracts

### `primary-action-button-ui.js`

```js
/** Minimum heights for primary workflow / marketing actions (matches ConfirmDialog). */
export const PRIMARY_ACTION_BUTTON_CLASS = 'min-h-11 md:min-h-9'
```

Consumers bind with `:class="PRIMARY_ACTION_BUTTON_CLASS"` or `class="…"` merge via `cn()` if needed.

### `ViewActions.vue`

Add to the inner button row (`flex flex-wrap gap-2`):

```html
class="flex flex-wrap gap-2 [&_[data-slot=button]]:min-h-11 [&_[data-slot=button]]:md:min-h-9"
```

Do **not** change sticky layout classes on the outer container.

## UI / client

### Files to modify

| File | Change |
|------|--------|
| `src/lib/primary-action-button-ui.js` | **New** — export `PRIMARY_ACTION_BUTTON_CLASS` |
| `src/components/ViewActions.vue` | Slot row targets `[data-slot=button]` min heights |
| `src/views/HomeView.vue` | `PRIMARY_ACTION_BUTTON_CLASS` on Start demo, Resume demo, Go |
| `src/views/NewSessionView.vue` | `PRIMARY_ACTION_BUTTON_CLASS` on Create session |
| `docs/ui-rules.md` | MarketingShell + `ViewActions` primary button rule (both breakpoints) |

### Files unchanged (behavior via `ViewActions`)

| File | Button | Notes |
|------|--------|-------|
| `src/views/PartOutImportView.vue` | Confirm and begin counting | No view edit required if wrapper applies |
| `src/views/ListLotsView.vue` | Declare ready to import | Organizer branch only; row toggles untouched |

### Optional dedup (same PR, no behavior change)

Remove redundant `min-h-11` (only) from `Button` inside `ViewActions` where the wrapper now supplies both breakpoints:

- `src/views/LotEntryView.vue` — Compare CTA
- `src/views/ListLotsView.vue` — Compare CTA (`min-h-11` only today)

Leave `ReconciliationView` flex/`w-full` classes intact — they add layout, not only height.

### Accessibility

- No change to focus rings or labels
- Minimum touch target height improves operability on phone; aligns with UX persona guidance (implementers own pixel sizing)

## Security & privacy

N/A — presentation-only change.

## Acceptance criteria (for Review)

- [ ] **AC1** — `PRIMARY_ACTION_BUTTON_CLASS` is `'min-h-11 md:min-h-9'` and documented in `ui-rules.md`
- [ ] **AC2** — Home: Start demo, Resume demo, and Go render with `min-h-11 md:min-h-9` (inspect or unit test)
- [ ] **AC3** — New session: Create session uses the same classes
- [ ] **AC4** — Part-out import: Confirm and begin counting matches Reconciliation sticky CTA height at `< md` and `≥ md`
- [ ] **AC5** — Organizer (`?mode=organizer`): Declare ready to import matches other phase-gate CTAs; Moved / Needs location unchanged (`size="sm"`)
- [ ] **AC6** — No changes to button labels, routing, or `setPhase` / phase guards
- [ ] **AC7** — `npm test` and `npm run build` pass on the feature branch

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | `primary-action-button-ui.js` exports expected class string | `tests/unit/lib/primary-action-button-ui.test.js` |
| Unit | `ViewActions` slot row includes `data-slot=button` height utilities | `tests/unit/components/ViewActions.test.js` (extend or add) |
| Unit | `HomeView` primary buttons include `PRIMARY_ACTION_BUTTON_CLASS` | Extend `tests/unit/views/HomeView.test.js` |
| Unit | Existing `PartOutImportView`, `ListLotsView` tests still pass | Phase logic unchanged |
| Review UI | Side-by-side Home → New session → Import → Organizer on phone + laptop | Chrome DevTools MCP per `INTERACTIVE-UI-VALIDATION.md`; compare with Reconcile CTA |

No Playwright e2e required for this Unit.

## Rollout & operations

Single PR to `main`. No feature flag. Rollback = revert PR.

### Monitoring

N/A — static UI.

### Rollback

Revert commit; no migrations.

## Risks & open technical questions

| Risk / question | Mitigation |
|-----------------|------------|
| `ViewActions` selector misses non-`Button` slot content | All phase gates use shadcn `Button` today; document in `ui-rules` that slot must use `Button` |
| `min-h-*` + `h-8` may look slightly different from native `h-9`/`h-11` sizes | Acceptable — matches existing Reconciliation / ConfirmDialog approach |
| Wrapper applies to secondary buttons in same `ViewActions` cluster | Reconciliation has multiple buttons — all get min height (already true today); acceptable |

## Design review passes (summary)

| Pass | Result |
|------|--------|
| Architecture | **Pass** — one constant + one chrome hook; no new shell |
| Frontend | **Pass** — Tailwind + existing `Button`; marketing explicit, session via `ViewActions` |
| Backend | N/A |
| Testing | **Pass** — lib + component + Home view coverage |
| CI / DevOps | **Pass** — no workflow changes |

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-16 | AI draft | Initial Tech Spec |
