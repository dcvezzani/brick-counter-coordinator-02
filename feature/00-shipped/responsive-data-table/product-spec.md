# Product Spec — Responsive data table

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Responsive data table — laptop table + phone card list |
| **Status** | **Complete** — [PR #41](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/41) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #41](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/41) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#33](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/33) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Four session views duplicate the same responsive pattern: HTML `<table>` on laptop, card list on phone. Row actions and column layouts differ but shell markup repeats. [#7](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/7) slices proved the pattern inline; #5 consolidates it.

### Who it's for

- Coordinators reviewing part-out lines, lots, and reconciliation on laptop.
- Workers glancing at data on phone without horizontal scroll.

### Current experience (baseline)

Each view implements `hidden md:block` table + `md:hidden` card list independently (Import, Lot entry, Lots browse/organizer, Reconciliation).

## Outcomes & business impact

### Desired outcomes

- One **responsive data display** component for tabular session content.
- **Laptop:** dense table in bordered wrapper.
- **Phone:** card-style list rows with equivalent information.
- Row actions remain in views/slots — not hidden inside opaque table logic.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Component renders N rows for fixture data | Unit test |
| 2 | Four migration views use shared component (or documented exception) | Code review |
| 3 | No raw duplicate table/card shell in those views | Grep |

### Business impact

Completes consolidation started under responsive-data-views; lowers cost of new tabular screens.

## User experience & scenarios

1. **Import on phone** — Part-out lines as scannable cards, not wide table.
2. **Reconcile on laptop** — Full comparison table with inline resolve affordances.
3. **Organizer pick lists** — Same component, different row action slots.

## Scope

### In scope

- Column definition + slot API for mobile rows and custom cells.
- shadcn Table at `md+`; card list below breakpoint.

### Out of scope

- Sheet/Dialog resolve flows (future).
- Lot entry cockpit layout ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)).
- Business rules for resolve/organizer toggles.

## Dependencies

- Parent #5.
- First consumer: `migrate-import-view` child (recommended).

## Related documents

- [#7 Responsive data views](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/7) (closed; slices merged)
