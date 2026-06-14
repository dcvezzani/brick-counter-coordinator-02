# Product Spec — Consolidate and clean UI

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Consolidate and clean UI — shared view chrome, forms, and data-display baseline |
| **Status** | Validate PASS (2026-06-13) — merge [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) then `/learn` |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Parent work item** | [GitHub issue #5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) |

## Problem & audience

### Problem statement

Storyboard UI and parallel UX slices (#6, #7) shipped navigable views with improving mobile patterns, but **layout and controls still grew organically**: session views use ad hoc `Card` shells; sticky phase buttons and responsive table/card markup are **copy-pasted per view**; only Home and New session use shared `ViewFrame` and shadcn forms. Without shared primitives and a written rules doc, every new screen risks visual drift and duplicated markup.

### Who it's for

- **Primary:** Contributors and build agents implementing or extending views.
- **Secondary:** David (product owner) — polished, predictable demo when walking stakeholders through the workflow.
- **Tertiary:** Future production users — familiar navigation and form patterns across a long counting session.

### Current experience (baseline)

**Already merged toward #5 (incremental slices, PRs #16–#29):**

- `FormField` + shadcn `Input`/`Select` on Home and New session.
- Marketing `ViewFrame` on Home and New session.
- Session chrome from sibling features: bottom nav, progress strip, sticky CTAs, responsive table/card — **inline in views**, not shared components.

**Still inconsistent:**

- Five session views use standalone `Card` + `CardHeader` inside `SessionLayout`.
- Sticky footer styling duplicated across import, lot entry, lots, reconcile, cups.
- Responsive data pattern (table laptop / cards phone) repeated in four views without a shared component.
- No committed `docs/ui-rules.md`.

## Outcomes & business impact

### Desired outcomes

- Every view uses the **same bordered content frame** with predictable **title**, **description**, and optional **chapter** placement.
- Shared **workflow action bar** for phase gates (sticky on phone, inline on laptop).
- Shared **responsive data display** for tabular session content.
- Developers have **written UI rules** referenced from specs and PRs.
- Existing routes, phase rules, and nav visibility from storyboard-ui are **preserved** — presentation consolidation only.

### Success criteria (for Validate — parent #5)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | All seven MVP views use shared frame + header pattern | UI walkthrough per route |
| 2 | Zero inline copies of sticky footer styling in views | Code review / grep |
| 3 | Session tabular views use shared data-display component (or documented exception) | Visual + code review |
| 4 | `FormField` + shadcn for form controls on migrated views | Inspect setup + any session forms |
| 5 | `docs/ui-rules.md` approved and linked from PROJECT.md | Doc review |
| 6 | Phase/nav rules unchanged vs. application-views.md | Phase matrix test |

### Business impact

Reduces friction for upcoming Features (#9 feedback, #10 lot cockpit, #11 role shells). Improves stakeholder confidence in the demo. **Quality and maintainability** milestone — no revenue impact.

## Shell taxonomy (decision)

Three presentation shells, one design token set:

| Shell | Routes | Chrome |
|-------|--------|--------|
| **MarketingShell** | Home, New session | `ViewFrame` (`max-w-2xl`) — *partially done* |
| **SessionCoordinatorShell** | Lot, Lots, Reconcile, Cups | `SessionLayout` → `SessionNav` + `SessionProgress` → **session frame** → `ViewHeader` → body → `ViewActions` |
| **ImportFocusShell** | Part-out import | Nav hidden; `ViewHeader` with Back; session frame; `ViewActions` confirm |

Session frame nests **inside** `SessionLayout` `RouterView`, not wrapping the layout. `SessionNav` is the canonical **ViewSubnav** primitive (documented in `docs/ui-rules.md` at publish).

## Child features (Plan breakdown)

Parent issue [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5). Each child has `feature/<slug>/product-spec.md` and a linked GitHub issue.

| Order | Slug | Product intent | GitHub issue |
|-------|------|----------------|--------------|
| 1 | [view-header](../view-header/product-spec.md) | Shared page title block; includes Home outer title | [#30](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/30) |
| 2 | [view-actions](../view-actions/product-spec.md) | Shared sticky / inline phase action bar | [#31](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/31) |
| 3 | [session-view-frame](../session-view-frame/product-spec.md) | Bordered session content frame (`max-w-4xl`) | [#32](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/32) |
| 4 | [responsive-data-table](../responsive-data-table/product-spec.md) | Laptop table + phone card list baseline | [#33](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/33) |
| 5 | [migrate-import-view](../migrate-import-view/product-spec.md) | ImportFocus shell migration | [#34](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/34) |
| 6 | [migrate-cups-view](../migrate-cups-view/product-spec.md) | List cups migration | [#35](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/35) |
| 7 | [migrate-lot-entry-view](../migrate-lot-entry-view/product-spec.md) | Lot entry migration (not cockpit #10) | [#36](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/36) |
| 8 | [migrate-lots-view](../migrate-lots-view/product-spec.md) | List lots browse + organizer migration | [#37](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/37) |
| 9 | [migrate-reconciliation-view](../migrate-reconciliation-view/product-spec.md) | Reconciliation migration | [#38](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/38) |
| 10 | [ui-rules-publish](../ui-rules-publish/product-spec.md) | Canonical `docs/ui-rules.md` (includes ViewSubnav = SessionNav) | [#39](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/39) |
| 11 | [consolidate-ui-validate](../consolidate-ui-validate/product-spec.md) | Validate parent #5 and close or note debt | [#40](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/40) |

**Parallel delivery:** Child features 1–4 may run in parallel with migrations once Tech Specs stub component contracts. Migrations depend on primitives being defined (build order flexible per tech spec).

## In progress — parallel build wave 1 (2026-06-13)

Orchestrator selected six child features with **no cross-worktree file overlap** (foundation primitives 1–4, docs publish, and import migration with local primitive stubs). Migrations 6–9 and validate (#40) remain backlog until wave 1 merges.

| Feature | Issue | Branch | Worktree | Status | PR |
|---------|-------|--------|----------|--------|-----|
| ViewHeader | [#30](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/30) | `feature/view-header` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-view-header` | Completed | [#42](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/42) |
| ViewActions | [#31](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/31) | `feature/view-actions` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-view-actions` | Completed | [#46](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/46) |
| Session view frame | [#32](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/32) | `feature/session-view-frame` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-session-view-frame` | Completed | [#44](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/44) |
| Responsive data table | [#33](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/33) | `feature/responsive-data-table` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-responsive-data-table` | Completed | [#41](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/41) |
| UI rules publish | [#39](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/39) | `feature/ui-rules-publish` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-ui-rules-publish` | Completed | [#45](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/45) |
| Migrate import view | [#34](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/34) | `feature/migrate-import-view` | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-wt-migrate-import-view` | Completed | [#43](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/43) |

**Ordering notes:** Features 1–4 are independent foundation components. #39 documents patterns from product specs + existing code (incremental draft). #34 consumes primitives — implement shared components in-branch per sibling product specs if absent from base; expect merge coordination with #30–#33 PRs.

## In progress — parallel build wave 2 (2026-06-13)

Wave 1 foundation (#30–#33, #39) and import migration (#34) merged. Four session view migrations remain; each touches a distinct view file with no cross-worktree overlap. Validate (#40) blocked until all migrations merge.

| Feature | Issue | Branch | Worktree | Status | PR |
|---------|-------|--------|----------|--------|-----|
| Migrate cups view | [#35](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/35) | `feature/migrate-cups-view` | — | Completed | [#48](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/48) |
| Migrate lot entry view | [#36](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/36) | `feature/migrate-lot-entry-view` | — | Completed | [#50](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/50) |
| Migrate lots view | [#37](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/37) | `feature/migrate-lots-view` | — | Completed | [#51](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/51) |
| Migrate reconciliation view | [#38](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/38) | `feature/migrate-reconciliation-view` | — | Completed | [#49](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/49) |

**Why fewer than 6:** Only four child features remain unblocked. #40 (validate) depends on all migrations completing; no other open backlog items under parent #5.

**Ordering notes:** Migrations are independent (one view file each). Reconciliation (#38) is the most complex but does not block others. **Next:** Validate (#40) via `/ship` after this branch merges to `main`.

## Build status (2026-06-13)

All child features 1–10 merged on `consolidate-and-clean-ui`. Integration PR targets `main`. Remaining gate: [#40 consolidate-ui-validate](../consolidate-ui-validate/product-spec.md) (`/ship`).

## Scope

### In scope (parent)

- Child features above through Validate.
- Consolidating inline patterns from #6/#7 slices into shared components.

### Out of scope (parent)

- Full accessibility audit (`accessibility-designer` persona).
- UI feedback primitives ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)).
- Lot entry cockpit ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)).
- Role-aware shells ([#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11)).
- Changing routing, phase machine, or nav visibility rules.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-13 | Refresh Product Spec after #6/#7 slices merged; split #5 into child features per component/migration. |
| 2026-06-13 | ViewSubnav documentation merged into `ui-rules-publish` (not a separate feature). |
| 2026-06-13 | `ViewHeader` Feature includes Home outer site title (Option C). |
| 2026-06-13 | Plan phase only for child features now; `/design` Tech Spec per child before build. |

## Related documents

- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md)
- UX concerns: [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Nav rules: [docs/support/application-views.md](../../docs/support/application-views.md)
- Personas: [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md), [docs/personas/senior-developer.md](../../docs/personas/senior-developer.md)
- Issue comments: [Senior Developer](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5#issuecomment-4699490358), [UX Designer](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5#issuecomment-4699491005)
