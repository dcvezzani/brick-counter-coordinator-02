# Product Spec — Migrate Lot entry view

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate Lot entry view |
| **Status** | **Complete** — [PR #50](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/50) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #50](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/50) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#36](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/36) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Lot entry uses Card shell and inline responsive table/cards + sticky compare CTA. Consolidation prepares for future cockpit ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)) without implementing it here.

### Current experience (baseline)

Read-only lot table/cards; sticky “Compare with Part-Out List” when counting phase.

## Outcomes & business impact

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Frame + ViewHeader + ResponsiveData + ViewActions | Code review |
| 2 | Compare CTA phase gating unchanged | Manual counting phase test |

## Scope

### In scope

- `LotEntryView` presentation migration.

### Out of scope

- Lot entry cockpit (#10), swipe input, worker shell redesign.

## Dependencies

- All four primitive child features.
