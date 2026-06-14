# Product Spec — Consolidate and clean UI

**AIDLC phase:** Complete (Plan → Build → Validate → Learn)  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Consolidate and clean UI — shared view chrome, forms, and data-display baseline |
| **Status** | **Complete** — Validate PASS 2026-06-13 · Learn 2026-06-14 · [#5 closed](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) merged to `main` |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-14 |
| **Architecture** | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) · [docs/ui-rules.md](../../../docs/ui-rules.md) |
| **Parent work item** | [GitHub issue #5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) *(closed)* |

## Problem & audience

### Problem statement

Storyboard UI and parallel UX slices (#6, #7) shipped navigable views with improving mobile patterns, but **layout and controls still grew organically**: session views use ad hoc `Card` shells; sticky phase buttons and responsive table/card markup are **copy-pasted per view**; only Home and New session use shared `ViewFrame` and shadcn forms. Without shared primitives and a written rules doc, every new screen risks visual drift and duplicated markup.

### Who it's for

- **Primary:** Contributors and build agents implementing or extending views.
- **Secondary:** David (product owner) — polished, predictable demo when walking stakeholders through the workflow.
- **Tertiary:** Future production users — familiar navigation and form patterns across a long counting session.

### Current experience (baseline at Plan refresh)

**Already merged toward #5 (incremental slices, PRs #16–#29):**

- `FormField` + shadcn `Input`/`Select` on Home and New session.
- Marketing `ViewFrame` on Home and New session.
- Session chrome from sibling features: bottom nav, progress strip, sticky CTAs, responsive table/card — **inline in views**, not shared components.

**Was inconsistent before #5 (now resolved):**

- Five session views used standalone `Card` + `CardHeader` inside `SessionLayout` → **migrated** to shared chrome.
- Sticky footer styling duplicated across import, lot entry, lots, reconcile, cups → **centralized in ViewActions**.
- Responsive data pattern repeated in four views → **ResponsiveDataTable**.
- No committed `docs/ui-rules.md` → **published** and linked from PROJECT.md.

### Delivered experience (post-#5)

Shared `ViewHeader`, `ViewActions`, `SessionViewFrame`, and `ResponsiveDataTable` on all session views; Home uses ViewHeader in MarketingShell. Phase/nav rules unchanged. **Accepted debt:** New session still uses hand-written `h1` in ViewFrame `#header` (follow-up Feature).

## Outcomes & business impact

### Desired outcomes

- Every view uses the **same bordered content frame** with predictable **title**, **description**, and optional **chapter** placement.
- Shared **workflow action bar** for phase gates (sticky on phone, inline on laptop).
- Shared **responsive data display** for tabular session content.
- Developers have **written UI rules** referenced from specs and PRs.
- Existing routes, phase rules, and nav visibility from storyboard-ui are **preserved** — presentation consolidation only.

### Success criteria (Validate — parent #5) — all met

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | All seven MVP views use shared frame + header pattern | **PASS** | [validate-scorecard.md](./validate-scorecard.md) · New session ViewHeader deferred |
| 2 | Zero inline copies of sticky footer styling in views | **PASS** | Only `ViewActions.vue` |
| 3 | Session tabular views use shared data-display component (or documented exception) | **PASS** | List cups `<ul>` exception documented |
| 4 | `FormField` + shadcn for form controls on migrated views | **PASS** | Home + New session |
| 5 | `docs/ui-rules.md` approved and linked from PROJECT.md | **PASS** | Merged in PR #52 |
| 6 | Phase/nav rules unchanged vs. application-views.md | **PASS** | Router + storyboard-session tests |

### Business impact

Reduces friction for upcoming Features (#9 feedback, #10 lot cockpit, #11 role shells). Improves stakeholder confidence in the demo. **Quality and maintainability** milestone — no revenue impact.

## Shell taxonomy (decision)

Three presentation shells, one design token set:

| Shell | Routes | Chrome |
|-------|--------|--------|
| **MarketingShell** | Home, New session | `ViewFrame` (`max-w-2xl`) — ViewHeader on Home; New session ViewHeader follow-up |
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

## Completed — parallel build wave 1 (2026-06-13)

Orchestrator selected six child features with **no cross-worktree file overlap** (foundation primitives 1–4, docs publish, and import migration). All merged via integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52).

| Feature | Issue | Branch | Status | PR |
|---------|-------|--------|--------|-----|
| ViewHeader | [#30](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/30) | `feature/view-header` | Completed | [#42](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/42) |
| ViewActions | [#31](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/31) | `feature/view-actions` | Completed | [#46](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/46) |
| Session view frame | [#32](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/32) | `feature/session-view-frame` | Completed | [#44](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/44) |
| Responsive data table | [#33](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/33) | `feature/responsive-data-table` | Completed | [#41](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/41) |
| UI rules publish | [#39](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/39) | `feature/ui-rules-publish` | Completed | [#45](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/45) |
| Migrate import view | [#34](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/34) | `feature/migrate-import-view` | Completed | [#43](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/43) |

**Ordering notes:** Features 1–4 are independent foundation components. #39 documents patterns from product specs + existing code (incremental draft). #34 consumes primitives — implement shared components in-branch per sibling product specs if absent from base; expect merge coordination with #30–#33 PRs.

## Completed — parallel build wave 2 (2026-06-13)

Four session view migrations; each touched a distinct view file. All merged via [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52).

| Feature | Issue | Branch | Status | PR |
|---------|-------|--------|--------|-----|
| Migrate cups view | [#35](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/35) | `feature/migrate-cups-view` | Completed | [#48](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/48) |
| Migrate lot entry view | [#36](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/36) | `feature/migrate-lot-entry-view` | Completed | [#50](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/50) |
| Migrate lots view | [#37](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/37) | `feature/migrate-lots-view` | Completed | [#51](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/51) |
| Migrate reconciliation view | [#38](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/38) | `feature/migrate-reconciliation-view` | Completed | [#49](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/49) |

## Feature completion (2026-06-14)

| Milestone | Status | Artifact |
|-----------|--------|----------|
| Build (integration) | Done | [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` |
| Validate | **PASS** (6/6) | [validate-scorecard.md](./validate-scorecard.md) · [ship-report.md](./ship-report.md) |
| Learn | Done | [learn-notes.md](./learn-notes.md) · [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) |
| Parent issue | Closed | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) |

**Remaining debt (out of scope for #5):** New session → `ViewHeader` follow-up Feature.

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
| 2026-06-13 | PR #52 product answers: New session ViewHeader follow-up; Home Cards OK; single integration PR. |

## Learn retrospective (2026-06-14)

| Topic | Note |
|-------|------|
| Delivery model | Two parallel waves (6 + 4 worktrees) + integration PR #52 |
| Specs | Product specs per child; no parent tech-spec — Validate used Product Spec criteria |
| Debt shipped | New session hand-written `h1` — follow-up Feature |
| Docs | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md), [learn-notes.md](./learn-notes.md) |

See [learn-notes.md](./learn-notes.md) for full retrospective.

## Related documents

- Validate: [validate-scorecard.md](./validate-scorecard.md) · [ship-report.md](./ship-report.md)
- Learn: [learn-notes.md](./learn-notes.md) · [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md)
- UX roadmap: [feature/ux-roadmap.md](../../../feature/ux-roadmap.md)
- UX concerns: [dcv/ux-concerns.md](../../../dcv/ux-concerns.md)
- Nav rules: [docs/support/application-views.md](../../../docs/support/application-views.md)
- Personas: [docs/personas/ux-designer.md](../../../docs/personas/ux-designer.md), [docs/personas/senior-developer.md](../../../docs/personas/senior-developer.md)
- Issue comments: [Senior Developer](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5#issuecomment-4699490358), [UX Designer](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5#issuecomment-4699491005)
