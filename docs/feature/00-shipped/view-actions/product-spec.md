# Product Spec — ViewActions

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | ViewActions — shared workflow action bar |
| **Status** | **Complete** — [PR #46](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/46) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #46](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/46) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#31](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/31) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Phase-gate buttons (confirm import, declare ready to organize, export, return to counting) use **identical sticky footer styling** copy-pasted across five views. Changing safe-area or sticky behavior requires editing multiple files.

### Who it's for

- Coordinators and workers advancing the session workflow on phone or laptop.
- Contributors maintaining phase CTAs consistently.

### Current experience (baseline)

Sticky footer pattern shipped inline in #6 slices: blur, border-top, safe-area padding on phone; static inline on `md+`. Helper text sometimes sits outside the sticky region.

## Outcomes & business impact

### Desired outcomes

- One **ViewActions** wrapper for all workflow gate buttons.
- **Phone:** sticky bottom bar with optional hint text above buttons.
- **Laptop:** static placement below content (no sticky).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | No view contains duplicated sticky footer class string | Grep / code review |
| 2 | Import, lot entry, lots (organizer), reconcile, cups use ViewActions | Per-view check |
| 3 | Phase button enable/disable behavior unchanged | Manual phase matrix |

### Business impact

Consolidates proven #6 UX into maintainable chrome; reduces regression risk when safe-area rules change.

## User experience & scenarios

1. **Phone counting session** — Primary phase CTA visible without scrolling past long tables.
2. **Reconcile gate** — “Declare ready to organize” disabled until all rows resolved; hint visible in action region.
3. **Laptop reconcile** — Export and complete buttons inline below content.

## Scope

### In scope

- ViewActions component: default slot for buttons, optional hint slot.
- Responsive sticky vs static behavior per ux-concerns pattern C.

### Out of scope

- Button labels, phase logic, routing (unchanged in views/lib).
- Confirm dialogs ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)).

## Dependencies

- Parent #5 shell taxonomy.
- Consumed by migration child features 5–9.

## Related documents

- [dcv/ux-concerns.md](../../../../dcv/ux-concerns.md) — pattern C
