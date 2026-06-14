# Product Spec — Session view frame

**AIDLC phase:** Complete (child of [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · on `main` via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Session view frame — bordered content frame for session routes |
| **Status** | **Complete** — [PR #44](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/44) merged · integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Merged** | [PR #44](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/44) → `consolidate-and-clean-ui` · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| **Architecture** | [ADR-0002](../../../../adr/0002-shared-session-ui-chrome.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#32](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/32) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Home and New session use `ViewFrame` (bordered card, marketing width). Session views use a **different** outer pattern (`Card` inside `SessionLayout`) so the demo feels like two products. Session content lacks the same bordered frame as marketing pages.

### Who it's for

- Users moving Home → session who expect visual continuity.
- Contributors adding session views with one frame primitive.

### Current experience (baseline)

- Marketing: `ViewFrame` `max-w-2xl`, rounded border, ring.
- Session: plain `Card` components without alignment to marketing inner frame styling.

## Outcomes & business impact

### Desired outcomes

- Session routes wrap body content in a **session-scoped frame** (`max-w-4xl`, matches layout container).
- Same border/background language as marketing `ViewFrame` inner area.
- Frame lives **inside** `SessionLayout` router outlet, below nav/progress.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | All five session views use session frame instead of top-level Card shell | Code review |
| 2 | Visual continuity with Home/New inner frame | Side-by-side screenshot |
| 3 | SessionLayout bottom-nav clearance unchanged on phone | Mobile walkthrough |

### Business impact

One product chrome language across pre-session and in-session screens.

## User experience & scenarios

1. **Session coordinator shell** — Nav + progress + bordered frame + header + data + actions reads as one cohesive page.
2. **Import focus** — Frame without session nav; minimal chrome inside frame.

## Scope

### In scope

- Session frame variant: extend `ViewFrame` or dedicated `SessionViewFrame` (decision in Tech Spec).
- Width `max-w-4xl`, compact mobile padding.

### Out of scope

- Changing `SessionLayout` safe-area or nav (already shipped).
- Marketing `ViewFrame` width change.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-13 | Frame nests inside RouterView, not wrapping SessionLayout |

## Dependencies

- Parent shell taxonomy.
- Used together with ViewHeader and ViewActions in migrations.

## Related documents

- Existing: [`ViewFrame.vue`](../../src/components/ViewFrame.vue)
