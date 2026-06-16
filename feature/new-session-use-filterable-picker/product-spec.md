# Product Spec — New session set search picker

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | New session — searchable set picker (`SetSearchCombobox`) |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Approved** | 2026-06-16 — David Vezzani (chat) |
| **Parent work item** | [#88](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/88) |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Approved for build** |
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
- Selected value is stored as a **normalized set number string** in BrickLink-style `{base}-{variant}` form (e.g. `10281-1`).
- After selection, the UI shows the **resolved set name** next to the “Set number” label, matching part picker affordance.
- New session form uses the new picker instead of the plain input.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | New session shows a searchable set picker, not a plain text field | UI validation on `/session/new`; component test |
| 2 | Typing filters the fixture set list by number or name | Unit test on catalog + manual |
| 3 | Selecting a set updates `v-model` with the normalized set number string | Unit test on `SetSearchCombobox` |
| 4 | Resolved set name appears after a valid selection | Unit test (`set-search-resolved` or equivalent) |
| 5 | Typing `10281` without suffix normalizes to `10281-1` on blur/submit; `10281-2` stays as-is | Unit test on catalog + component |
| 6 | Creating a session still works end-to-end (Home → New session → Import) | Manual demo walkthrough |
| 7 | Picker reuses shared `FilterablePicker` behavior (debounce, keyboard, min filter chars) | Code review + component tests |

### Business impact

Improves New session UX parity with lot entry pickers and aligns coordinator-02 with the documented target for New session in the sibling app. De-risks a later live coordinator integration by establishing the set-picker contract and fixture catalog early. No revenue impact — storyboard milestone.

## User experience & scenarios

### Key scenarios

1. **Search and select** — Coordinator opens New session, clicks the set field, types `102` (or a set name fragment), picks a row from the filtered list; the form shows set number + name; **Create session** proceeds as today.

2. **Type exact number and blur** — Coordinator types `10281` without clicking a row; on close/blur the picker normalizes to `10281-1` and resolves the catalog name when possible (same “resolve on close” behavior as part search).

3. **Explicit variant** — Coordinator types or selects `10281-2`; value is stored **as-is** (no forced `-1`).

4. **Default on load** — Page opens with **`10281-1`** pre-selected and the resolved set name shown.

5. **Empty / no match** — Filter yields no rows; user sees “No sets match” (or equivalent).

### Field copy & layout

| Element | Copy / behavior |
|---------|-----------------|
| Label | **Set number** |
| Resolved name | Shown in muted text next to the label after a valid selection (same pattern as part picker) |
| Helper text | **Search by set number or name.** |
| List rows | Set number (primary line) + set name (secondary line), e.g. `10281-1` / “Bonsai Tree” |
| Placeholder | e.g. `Search sets…` (engineering may align with part picker tone in Tech Spec) |

### Set number normalization

Stored form value is always `{base}-{variant}` when normalization applies:

| User input | Stored value |
|------------|--------------|
| `10281` | `10281-1` |
| `10281-1` | `10281-1` |
| `10281-2` | `10281-2` (preserved) |

- Apply normalization on **blur** and **submit** (and when resolving on picker close), matching sibling New session intent.
- Catalog fixture entries use normalized ids (e.g. `10281-1`, `10281-2` where variants exist).

### Experience principles

- **Picker parity:** Set picker should feel like part picker — filter, list rows with number + name, resolved name in label area.
- **Mobile-first:** Touch targets inherited from `FilterablePicker` (`min-h-11` trigger); no extra-small controls.
- **Storyboard honesty:** Catalog is fixture data only — not live BrickLink search.

## Scope

### In scope

- New **`SetSearchCombobox`** component wrapping `FilterablePicker`, analogous to `PartSearchCombobox`.
- **`set-catalog` module** with fixture set list plus `searchSets`, `lookupSet`, `resolveSetNumber`, and normalization helper (names aligned with part-catalog patterns).
- **Fixture set data** — **minimal demo catalog**: the storyboard demo set (`10281` family) plus **3–5 additional sets** (~4–6 entries total), enough to prove search by number and name.
- **Set number normalization** — auto-append `-1` when input has no `-` suffix; preserve explicit variants (e.g. `10281-2`).
- **Wire `NewSessionView`** — replace plain `Input` with `SetSearchCombobox`; default `10281-1`; keep existing submit → `createDemoSession` flow.
- **Unit tests** for catalog helpers, normalization, and component (v-model, resolve label, FilterablePicker integration).

**Primary touchpoints:** `SetSearchCombobox.vue`, `set-catalog.js`, `NewSessionView.vue`.

### Out of scope

- Live BrickLink or coordinator-server set API (`GET /bricklink/sets`) — future Feature.
- **Condition** (New/Used) radio on New session — not on screen today; separate Feature.
- Display-name route guard, Back to Home, client pattern validation alerts — sibling production New session concerns; separate follow-up Features.
- `ViewHeader` migration for New session (existing debt).
- Changes to `FilterablePicker` itself.

### Dependencies on other teams or features

- **Shipped:** `FilterablePicker`, `PartSearchCombobox` (pattern reference), `FormField`, storyboard session create flow.
- **None blocking** from other in-flight Features.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Fixture catalog only — offline demo must keep working (`npm run dev` with no backend).
- Product Spec approval before `/design`.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-16 | **Default set:** `10281-1` on page load (normalized BrickLink-style). |
| 2026-06-16 | **Variant handling:** If user provides `<set-number>-<version>` (e.g. `10281-2`), accept and store as-is; otherwise normalize bare numbers with `-1`. |
| 2026-06-16 | **Catalog size:** Minimal fixture list — demo set plus 3–5 additional sets (~4–6 total). |
| 2026-06-16 | **Normalization timing:** Apply `-1` suffix on blur, submit, and picker close-resolve (in this Feature). |
| 2026-06-16 | **Label & copy:** Label “Set number”; helper “Search by set number or name.”; rows show number + name; resolved name beside label after selection. |

## Related documents

- [Storyboard UI product spec (New session row)](../../00-shipped/storyboard-ui/product-spec.md)
- [Part search combobox product spec (picker pattern)](../../00-shipped/lot-entry-cockpit/sub-features/part-search-combobox/product-spec.md)
- Sibling target UX: [new-session.md](https://github.com/dcvezzani/brick-counter-coordinator/blob/main/docs/view-specs/new-session.md)
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
