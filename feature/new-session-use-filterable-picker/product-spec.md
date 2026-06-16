# Product Spec — New session set search picker

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | New session — searchable set picker (`SetSearchCombobox`) |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Related Tech Spec** | `feature/new-session-use-filterable-picker/tech-spec.md` (after `/design`) |
| **Prior art** | `src/components/PartSearchCombobox.vue`; sibling [new-session.md](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/docs/view-specs/new-session.md) (SetSearchCombobox behavior) |

## Problem & audience

### Problem statement

On **New session** (`/session/new`), the coordinator enters a LEGO **set number** before starting a storyboard counting session. Today the field is a plain text input with a hard-coded default (`10281`). Users cannot discover valid sets, see set names alongside numbers, or get the same searchable picker experience already shipped for **part numbers** on the lot entry form.

This Feature adds a **set search combobox** — modeled on `PartSearchCombobox` — and wires it into New session so coordinators **find and select** a set from a fixture catalog instead of guessing a number.

### Who it's for

- **Primary:** Coordinator creating a demo/storyboard session from Home → New session.
- **Secondary:** Future production New session (same component; catalog source may grow later).

### Current experience (baseline)

[`NewSessionView.vue`](../../../src/views/NewSessionView.vue) uses `FormField` + shadcn `Input` bound to `setNumber` (default `10281`). No search, no resolved set name, no list of known sets. [`PartSearchCombobox.vue`](../../../src/components/PartSearchCombobox.vue) and [`FilterablePicker.vue`](../../../src/components/FilterablePicker.vue) already exist for parts but are not used on New session. No set catalog module exists in coordinator-02.

## Outcomes & business impact

### Desired outcomes

- Coordinator can **search by set number or name** and pick a set from a dropdown (same interaction pattern as part search).
- Selected value is stored as a **normalized set number string** on the form (not ambiguous free text).
- After selection, the UI shows the **resolved set name** (e.g. label hint next to “Set number”), matching part picker affordance.
- New session form uses the new picker instead of the plain input.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | New session shows a searchable set picker, not a plain text field | UI validation on `/session/new`; component test |
| 2 | Typing filters the fixture set list by number or name | Unit test on catalog + manual |
| 3 | Selecting a set updates `v-model` with the set number string | Unit test on `SetSearchCombobox` |
| 4 | Resolved set name appears after a valid selection | Unit test (`set-search-resolved` or equivalent) |
| 5 | Creating a session still works end-to-end (Home → New session → Import) | Manual demo walkthrough |
| 6 | Picker reuses shared `FilterablePicker` behavior (debounce, keyboard, min filter chars) | Code review + component tests |

### Business impact

Improves New session UX parity with lot entry pickers and aligns coordinator-02 with the documented target for New session in the sibling app. De-risks a later live coordinator integration by establishing the set-picker contract and fixture catalog early. No revenue impact — storyboard milestone.

## User experience & scenarios

### Key scenarios

1. **Search and select** — Coordinator opens New session, clicks the set field, types `102` (or a set name fragment), picks a row from the filtered list; the form shows set number + name; **Create session** proceeds as today.

2. **Type exact number and blur** — Coordinator types a valid set number without clicking a row; on close/blur the picker resolves to the catalog entry when possible (same “resolve on close” behavior as part search).

3. **Default on load** — Page opens with a sensible default set pre-selected (see open product question: `10281` vs `10281-1` vs catalog default).

4. **Empty / no match** — Filter yields no rows; user sees “No sets match” (or equivalent) and cannot submit a resolved catalog value until they pick or type a resolvable number.

### Experience principles

- **Picker parity:** Set picker should feel like part picker — filter, list rows with number + name, resolved name in label area.
- **Mobile-first:** Touch targets inherited from `FilterablePicker` (`min-h-11` trigger); no extra-small controls.
- **Storyboard honesty:** Catalog is fixture data only — not live BrickLink search.

## Scope

### In scope

- New **`SetSearchCombobox`** component wrapping `FilterablePicker`, analogous to `PartSearchCombobox`.
- **`set-catalog` module** with fixture set list plus `searchSets`, `lookupSet`, `resolveSetNumber` (names aligned with part-catalog patterns).
- **Fixture set data** — at minimum the demo set used by storyboard (`10281` family) plus enough additional entries to prove search (product decision on count).
- **Wire `NewSessionView`** — replace plain `Input` with `SetSearchCombobox`; keep existing submit → `createDemoSession` flow.
- **Unit tests** for catalog helpers and component (v-model, resolve label, FilterablePicker integration).

**Primary touchpoints:** `SetSearchCombobox.vue`, `set-catalog.js`, `NewSessionView.vue`.

### Out of scope

- Live BrickLink or coordinator-server set API (`GET /bricklink/sets`) — future Feature.
- **Condition** (New/Used) radio on New session — not on screen today; separate Feature.
- Display-name route guard, Back to Home, client pattern validation alerts, `-1` suffix normalization on blur/submit — **recommended follow-up** (see Decisions); sibling spec defines these for production New session but coordinator-02 storyboard does not implement them yet.
- `ViewHeader` migration for New session (existing debt).
- Changes to `FilterablePicker` itself.

### Dependencies on other teams or features

- **Shipped:** `FilterablePicker`, `PartSearchCombobox` (pattern reference), `FormField`, storyboard session create flow.
- **None blocking** from other in-flight Features.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Fixture catalog only — offline demo must keep working (`npm run dev` with no backend).
- Product Spec approval before `/design`.

## Decisions (optional)

| Date | Decision |
|------|----------|
| — | *Pending conversation* — see questions below |

## Open questions (resolve in chat — not a substitute for talking)

1. **Default set number:** Keep storyboard default `10281`, or normalize to BrickLink-style `10281-1` / sibling default `70404-1`?
2. **Catalog size:** Minimal (demo set + 2–3 extras) vs a broader storyboard list (~10–20 popular sets)?
3. **Normalization in this Feature:** Include auto-append `-1` when user enters `10281` without suffix (sibling New session rule), or store exactly what they pick/type for now?
4. **Label copy:** “Set number” only, or “Set” with number + name in the row template?

## Related documents

- [Storyboard UI product spec (New session row)](../../00-shipped/storyboard-ui/product-spec.md)
- [Part search combobox product spec (picker pattern)](../../00-shipped/lot-entry-cockpit/sub-features/part-search-combobox/product-spec.md)
- Sibling target UX: [new-session.md](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/docs/view-specs/new-session.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
