# Product Spec — Migrate Part-out import view

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate Part-out import view — ImportFocus shell |
| **Status** | **Complete** — [PR #43](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/43) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #43](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/43) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#34](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/34) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Part-out import is the **ImportFocus** screen but still uses ad hoc `Card` markup and inline sticky/table patterns. It should be the reference migration for session frame + header + data + actions.

### Who it's for

- Coordinators confirming part-out before counting.
- Contributors validating the consolidated component stack.

### Current experience (baseline)

- Back button + Card header + inline table/cards + sticky confirm (from #6/#7 slices).
- SessionNav hidden via route meta (unchanged).

## Outcomes & business impact

### Desired outcomes

- Import uses **session frame**, **ViewHeader** (Back in `#leading`), **responsive data table**, **ViewActions**.
- First adopter for shared data component.
- Workflow unchanged: confirm → counting phase.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | No top-level Card shell | Code review |
| 2 | Nav still hidden on import | Route meta test |
| 3 | Confirm and Back behave as before | Manual walkthrough |

## Scope

### In scope

- `PartOutImportView` presentation migration only.

### Out of scope

- Part-out data source, phase transitions, routing.

## Dependencies

- [view-header](../view-header/product-spec.md), [view-actions](../view-actions/product-spec.md), [session-view-frame](../session-view-frame/product-spec.md), [responsive-data-table](../responsive-data-table/product-spec.md) — build may parallelize once Tech Spec APIs exist.

## Related documents

- [application-views.md](../../docs/support/application-views.md)
