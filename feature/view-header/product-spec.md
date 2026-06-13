# Product Spec — ViewHeader

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | ViewHeader — shared page title block |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Parent work item** | [#5 Consolidate and clean UI](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#30](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/30) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Every view repeats title and description markup (`CardHeader`, `CardTitle`, `CardDescription`, or custom `h1` on Home). Chapter labels (reconciliation steps, organizer mode) are inconsistent. Contributors cannot add a new screen with predictable header placement.

### Who it's for

- Contributors migrating session views under parent #5.
- Stakeholders who need clear “what step am I on?” framing at the top of each screen.

### Current experience (baseline)

- Home: site title in `ViewFrame` `#header` slot (hand-written `h1` + tagline).
- Session views: per-view `CardHeader` clusters; Reconciliation and Lots add `Badge` for chapter.

## Outcomes & business impact

### Desired outcomes

- One **page title block** component used on all seven MVP views.
- Exactly **one primary title** (`h1`) per route when ViewHeader is the page title.
- Optional **chapter badge** and **leading back action** (Import) via slots.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Home outer title uses ViewHeader | Home screenshot / DOM: one h1 |
| 2 | All session migrations use ViewHeader instead of CardHeader for page title | Code review per migrated view |
| 3 | Reconciliation and Lots chapter labels render via ViewHeader badge slot | Screenshots both modes |

### Business impact

Foundation for consistent demo narration and lower cost per new view.

## User experience & scenarios

1. **Land on any route** — User sees title, one-line description, optional chapter badge, in the same vertical position inside the content frame.
2. **Import escape** — User taps Back in the header leading slot; returns to Home (existing behavior preserved).
3. **Organizer vs browse** — Lots view title reflects mode via header title or badge without changing URL rules.

## Scope

### In scope

- ViewHeader component spec: title, description, `#badge`, `#leading` slots.
- First adopter: **Home** outer title (Option C — same component as session pages).
- Contract for session migrations (consumers in sibling child features).

### Out of scope

- Session frame (`session-view-frame` child).
- Data tables, sticky actions (`view-actions` child).
- Accessibility audit (separate persona).

## Dependencies

- Parent #5 approved shell taxonomy.
- Sibling migrations consume ViewHeader after build.

## Related documents

- Parent: [consolidate-and-clean-ui](../consolidate-and-clean-ui/product-spec.md)
