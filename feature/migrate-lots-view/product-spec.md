# Product Spec — Migrate List lots view

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate List lots view |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#37](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/37) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

List lots serves **browse** and **organizer** modes on one route with duplicated Card/table/card-list patterns and organizer sticky CTAs. Chapter labeling exists from #8 slices but header should move to ViewHeader.

### Current experience (baseline)

- Browse: lot table/cards.
- Organizer: section titles, pick-list tables/cards, Moved/Needs location actions, sticky declare/return CTAs.

## Outcomes & business impact

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Browse and organizer modes use shared chrome | Both `?mode=organizer` and default |
| 2 | Organizer chapter visible in ViewHeader | Screenshot |
| 3 | Row toggle and phase CTAs unchanged | Manual organizer flow |

## Scope

### In scope

- `ListLotsView` migration; two ResponsiveData instances in organizer sections.

### Out of scope

- Separate URLs for organizer mode; nav gating rules.

## Dependencies

- All four primitive child features.
