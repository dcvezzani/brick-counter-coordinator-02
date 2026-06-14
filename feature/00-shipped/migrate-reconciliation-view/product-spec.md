# Product Spec — Migrate Reconciliation view

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate Reconciliation view |
| **Status** | **Complete** — [PR #49](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/49) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #49](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/49) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#38](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/38) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Reconciliation is the most complex session view: two phases on one URL, chapter badges, status banner, responsive resolve rows, dual sticky action sets. Card shell and inline patterns should consolidate last after other migrations prove the stack.

### Current experience (baseline)

Chapter badges, updating_inventory banner, table/cards, sticky organize vs export/complete blocks (#6/#7/#8 slices).

## Outcomes & business impact

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | ViewHeader carries chapter badges; banner preserved | Both phases |
| 2 | ViewActions for reconciling and updating_inventory phases | Manual test |
| 3 | Resolve row behavior unchanged | Fixture session |

## Scope

### In scope

- `ReconciliationView` migration.

### Out of scope

- Sheet/Dialog resolve UX; export file generation.

## Dependencies

- All four primitive child features.
- Recommended after import and lots migrations.

## Related documents

- Chapter labels shipped inline (see [dcv/organizer-chapter-touch.md](../../../dcv/organizer-chapter-touch.md)) — no separate product spec
