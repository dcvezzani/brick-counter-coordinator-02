# Product Spec — UI rules publish

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | UI rules publish — canonical `docs/ui-rules.md` |
| **Status** | **Complete** — [PR #45](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/45) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #45](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/45) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#39](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/39) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Implementers lack a **single written UI rules document**. Issue #5 references `docs/ui-rules.md` but it was never committed. ViewSubnav contract (`SessionNav`) must be documented here—not a separate feature.

### Who it's for

- Contributors and agents adding or migrating views.
- Reviewers checking PRs against agreed layout rules.

## Outcomes & business impact

### Desired outcomes

- Committed `docs/ui-rules.md` matching shipped components.
- Documents: shell taxonomy, ViewFrame/ViewHeader/ViewActions/ResponsiveData, FormField, **SessionNav as ViewSubnav**, breakpoint matrix, ban on raw table/sticky copy-paste in views.
- Linked from PROJECT.md or AGENTS.md.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | File exists at `docs/ui-rules.md` | Path check |
| 2 | Component map matches repo after migrations | Doc review vs `src/components/` |
| 3 | Link from PROJECT.md | Link check |

## Scope

### In scope

- Authoritative rules doc after primitive + migration builds (or draft outline updated incrementally—final publish after migrations).

### Out of scope

- Feedback primitives section (defer to #9).
- Changing application-views route/phase rules.

## Dependencies

- Child features 1–10 built or spec-stable.
- Consolidates former “view-subnav-contract” into this doc.

## Related documents

- [ux-concerns.md](../../../dcv/ux-concerns.md)
- [application-views.md](../../../docs/support/application-views.md)
