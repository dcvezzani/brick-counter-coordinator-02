# Product Spec — Migrate List cups view

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Migrate List cups view |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#35](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/35) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

List cups is the **simplest session view** (list + return CTA) but still uses Card shell and inline sticky footer. Good smoke test for frame + header + actions without a data table.

### Current experience (baseline)

Card header, cup list, sticky “Return to lot entry” from #6 slice.

## Outcomes & business impact

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Uses session frame, ViewHeader, ViewActions | Code review |
| 2 | Return to lot entry navigation unchanged | Manual test |

## Scope

### In scope

- `ListCupsView` migration.

### Out of scope

- Responsive data table (no tabular data).
- Cups data model changes.

## Dependencies

- view-header, view-actions, session-view-frame (not responsive-data-table).
