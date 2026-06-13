# Product Spec — Migrate Lot entry view

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate Lot entry view |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
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
