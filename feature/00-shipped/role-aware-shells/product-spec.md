# Product Spec — Role-aware shells

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Role-aware shells — coordinator vs worker layout taxonomy |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Approved** | 2026-06-16 — David Vezzani |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Approved for build** |
| **Work item** | [#11 Role-aware shells](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) |
| **Related** | [ux-roadmap.md](../ux-roadmap.md) · [dcv/ux-concerns.md](../../dcv/ux-concerns.md) (concern 10) · [ui-rules.md](../../docs/ui-rules.md) · [application-views.md](../../docs/support/application-views.md) · [ADR-0002](../../adr/0002-shared-session-ui-chrome.md) · [#10 Lot entry cockpit](../00-shipped/lot-entry-cockpit/product-spec.md) |

## Problem & audience

### Problem statement

Brick Counter Coordinator serves two **task modes** in one session: **coordinator** work (compare tables, resolve discrepancies, organize, export) and **worker** work (enter counts at the table, quick lookups while hands are busy). Today every in-session route uses the same **coordinator dashboard** presentation — full `SessionLayout` chrome (nav, progress strip, bordered frame, title block) — even on **lot entry**, where [#10](../00-shipped/lot-entry-cockpit/product-spec.md) added a counting cockpit but only via **view-level compact spacing**, not a first-class shell.

That **persona collapse** ([dcv/ux-concerns.md](../../dcv/ux-concerns.md) concern 10) wastes vertical space on the phone-first counting screen, makes worker routes feel like “shrunk coordinator pages,” and leaves no authoritative **route → shell** map for contributors. `docs/ui-rules.md` lists `SessionCoordinatorShell` for Lot, Lots, Reconcile, and Cups, with lot entry called out as “compact chrome” inside that shell — a stopgap until this Feature.

This Feature **formalizes the layout taxonomy** (Marketing, Coordinator, Worker, and the existing import focus pattern), assigns each route to exactly one shell, and delivers measurable **chrome reduction** on worker routes without changing routes, phases, or nav visibility rules.

**Not in scope:** login, RBAC, or hiding routes by user role — “role-aware” means **task-appropriate layout**, not authenticated roles (storyboard has no login).

### Who it's for

- **Primary:** Worker (or coordinator acting as counter) on **lot entry** and other quick in-session lookups — phone at the table, thumb-zone priority.
- **Secondary:** Coordinator on laptop — dense session views keep full chrome where comparison and batch actions matter.
- **Tertiary:** Contributors and agents — one documented shell per route; no ad hoc “compact” spacing per view.
- **Demo presenter:** Can narrate “this is the counting screen” vs “this is reconciliation” with visibly different layout intent.

### Current experience (baseline)

| Aspect | Today |
|--------|--------|
| **Documented shells** | `MarketingShell`, `SessionCoordinatorShell`, `ImportFocusShell` in [ui-rules.md](../../docs/ui-rules.md) — **no `SessionWorkerShell`** |
| **Lot entry** | `SessionCoordinatorShell` + view-level compact copy/spacing (`space-y-3`, short description) — cockpit from #10 inside coordinator chrome |
| **List cups** | Full coordinator shell; simple list, no worker optimization |
| **List lots / Reconcile / Organizer** | Coordinator shell — appropriate for tabular/dense work |
| **Import** | `ImportFocusShell` — nav hidden, Back in header, confirm CTA |
| **Shell selection** | Implicit per view; no router meta or shared wrapper |
| **Session chrome stack** | Nav (or bottom bar) + progress strip + frame + header + body + sticky actions on **all** session routes except import |

**Pain:** Counting content on ~375px still starts below nav + progress + header + frame padding — concern 7 remains **partial** after #10.

## Outcomes & business impact

### Desired outcomes

- **Clear layout taxonomy** — Every MVP route maps to a named shell documented in `ui-rules.md` and enforceable in review.
- **Worker routes feel worker-first** — Lot entry (minimum) uses `SessionWorkerShell` with **measurably less vertical chrome** than coordinator routes while keeping phase gates and SessionNav rules.
- **Coordinator routes unchanged in intent** — Reconciliation, organizer, lots browse, import focus keep dashboard-appropriate density and full wayfinding (progress + nav).
- **No persona collapse** — Presenter and contributors can point to shell name when discussing “counting vs coordinating.”
- **Foundation for production** — When real roles arrive later, layout contracts already separate worker vs coordinator surfaces (auth may reuse the same map).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | `docs/ui-rules.md` defines **MarketingShell**, **SessionCoordinatorShell**, **SessionWorkerShell**, and **ImportFocusShell** (or documented coordinator variant) with a **route assignment table** | Doc review + grep for route map |
| 2 | **Lot entry** (`/session/:sessionId/lot`) is assigned to **SessionWorkerShell** — not coordinator-with-compact-hack | Doc + code review |
| 3 | On phone (~375px), **primary counting controls** in lot entry start **closer to the top** than on a coordinator route (e.g. List lots browse) — measurable via screenshot or DOM offset comparison | Manual / MCP mobile viewport |
| 4 | **SessionNav visibility and phase gating** unchanged vs [application-views.md](../../docs/support/application-views.md) | Existing router + storyboard tests pass |
| 5 | **Compare with Part-Out List** still appears only in `counting` on lot entry; sticky footer behavior preserved | Manual + existing `LotEntryView` tests |
| 6 | **SessionProgress** backward navigation ([#80](../00-shipped/go-back-to-previous-state-02/validate-scorecard.md)) still works on worker and coordinator routes | Manual + unit tests |
| 7 | Coordinator routes (Reconcile, List lots browse, organizer, List cups if coordinator) retain **full coordinator chrome** — no accidental regression | Side-by-side laptop + phone walkthrough |
| 8 | Import route retains **ImportFocusShell** behavior (nav hidden, Back escape, confirm CTA) | Manual |
| 9 | No new per-view copy-pasted shell layout strings — shared shell primitive(s) or router-driven composition | Code review |
| 10 | `npm test` / `npm run build` pass | CI |

### Business impact

Closes the **last P3 UX roadmap item** and concern 10 — **persona collapse**. Caps the UX program started under [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5). Demo credibility on mobile counting; maintainability for future Features. No revenue impact.

## User experience & scenarios

### Shell definitions (product language)

| Shell | Task mode | UX goal |
|-------|-----------|---------|
| **MarketingShell** | Pre-session | Orient, start or resume; relaxed spacing (`ViewFrame` `max-w-2xl`) |
| **ImportFocusShell** | Setup (in-session) | Confirm part-out before counting; **minimal wayfinding** — no session nav; explicit Back |
| **SessionWorkerShell** | Hands-busy counting / quick lookup | **Minimal vertical chrome**; primary task above the fold on phone; sticky actions preserved |
| **SessionCoordinatorShell** | Compare, resolve, organize, export | Full session wayfinding (nav + progress + header); table-friendly density |

All shells share design tokens and primitives (`ViewHeader`, `ViewActions`, frames) — they differ in **which chrome layers appear** and **spacing density**, not brand or route rules.

### Proposed route assignment (approved)

| Route | Shell | Rationale |
|-------|-------|-----------|
| `/` | MarketingShell | Unchanged |
| `/session/new` | MarketingShell | Unchanged |
| `/session/:sessionId/import` | ImportFocusShell | Unchanged — setup gate |
| `/session/:sessionId/lot` | **SessionWorkerShell** | Primary counting cockpit ([#10](../00-shipped/lot-entry-cockpit/product-spec.md)) |
| `/session/:sessionId/cups` | SessionCoordinatorShell | Reference list; worker optimization deferred |
| `/session/:sessionId/lots` (browse) | SessionCoordinatorShell | Tabular browse, Compare CTA when counting |
| `/session/:sessionId/lots?mode=organizer` | SessionCoordinatorShell | Dense pick-list coordination |
| `/session/:sessionId/reconciliation` | SessionCoordinatorShell | Tabular resolve / export |

### Worker shell experience (intent)

Compared to coordinator session routes, worker shell **reduces nonessential chrome** on phone while keeping safety nets:

- **Keep:** SessionNav (bottom bar on phone), phase-gated items, sticky **Compare** / save actions, access to progress strip for coordinators who need phase context.
- **Reduce or tighten (product + Design):** Progress strip prominence, header description length, frame padding, optional duplicate titles — anything that pushes `LotEntryForm` below the fold without removing required wayfinding.

Exact layer list is **Design** — Product requires **visible chrome reduction on lot entry** vs coordinator browse, not a specific CSS implementation.

### Key scenarios

1. **Worker counts on phone** — Session in `counting` → lands on lot entry → **worker shell** → part/color/condition/count visible without scrolling past full coordinator header stack → Save → Compare when done.

2. **Coordinator reconciles on laptop** — Reconciliation uses **coordinator shell** → full progress + nav + chapter badge → dense table → sticky Declare ready.

3. **Worker checks cups mid-count** — List cups uses **coordinator shell** (full chrome); worker optimization deferred beyond lot entry.

4. **Import setup** — Import focus shell unchanged; Back to Home; no session nav.

5. **Demo narrative** — Presenter: “Worker screen” (lot) vs “Coordinator screen” (reconcile) — visibly different layout density on same session.

6. **Phase change on worker route** — Session leaves `counting` → lot entry shows phase note; no form; shell assignment unchanged.

7. **Contributor adds a view** — Reads ui-rules route table; picks shell; does not invent fourth layout.

### Experience principles

- **Task-appropriate, not role-gated** — Same human may use worker and coordinator shells in one session; layout follows **route + task**, not login.
- **Wayfinding preserved** — Worker shell trims chrome; it does not trap users (nav, back, phase context remain reachable).
- **Phone-first worker** — Worker shell optimizations target `< md`; laptop may show more chrome without harming counting.
- **One h1 per route** — Unchanged accessibility rule.
- **Presentation only** — Phase machine, landing routes, nav hide rules immutable unless explicitly scoped elsewhere.

## Scope

### In scope

- **Formalize shell taxonomy** in `docs/ui-rules.md` — add `SessionWorkerShell`, route assignment table, composition recipes, anti-patterns (no coordinator shell on worker routes).
- **Implement worker shell** for **lot entry** (minimum viable worker route).
- **Router-level or layout-level shell selection** — explicit assignment (e.g. meta or wrapper component) so views do not each guess compact vs full.
- **Migrate lot entry** from coordinator + compact hack to worker shell; preserve #10 cockpit behavior and tests.
- **Update [application-views.md](../../docs/support/application-views.md)** if nav presentation notes change (not route rules).
- **ADR update or new ADR** if shell taxonomy amends [ADR-0002](../../adr/0002-shared-session-ui-chrome.md) — Design/Learn.
- Unit tests for shell assignment and lot entry non-regression.

### Out of scope

- **Authentication / RBAC** — no user roles, permissions, or route blocking by identity.
- **Changing phase machine**, default landing routes, or SessionNav hide rules.
- **Lot entry cockpit behavior** — four-field form, pickers, save merge ([#10](../00-shipped/lot-entry-cockpit/product-spec.md)) — only shell around it changes.
- **Responsive data tables, sticky CTAs, chapter labels** — already shipped ([#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5)–[#8](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/8)).
- **Redesigning List lots, Reconcile, or Import content** — coordinator/import shells stay functionally the same.
- **SwipeNumberInput**, live BrickLink API, production sync.
- **Playwright e2e** — Vitest + manual/MCP UI validation acceptable.

### Dependencies on other teams or features

- **Complete:** [#5 consolidate-and-clean-ui](../00-shipped/consolidate-and-clean-ui/product-spec.md) — shared primitives and baseline taxonomy.
- **Complete:** [#6 mobile-session-chrome](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/6) — nav, sticky actions, safe areas.
- **Complete:** [#10 lot-entry-cockpit](../00-shipped/lot-entry-cockpit/product-spec.md) — worker UX content to wrap.
- **Complete:** [#80 go-back-to-previous-state-02](../00-shipped/go-back-to-previous-state-02/validate-scorecard.md) — progress strip interactions must survive shell split.
- **Informed by:** [dcv/ux-concerns.md](../../dcv/ux-concerns.md) recommended screen taxonomy (Marketing / Coordinator / Worker).

## Constraints (non-technical where possible)

- **Routes and phases frozen** — [application-views.md](../../docs/support/application-views.md), [session-phases-state.mmd](../../docs/session-phases-state.mmd).
- **JavaScript client** — no TypeScript in Vue SFCs ([ADR-0001](../../adr/0001-frontend-vue-js-shadcn-stack.md)).
- **Storyboard demo** — no backend; shell split is presentation-only.
- **AIDLC:** Product Spec approval before `/design`.
- **Parent issue** [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) links to `feature/role-aware-shells/`.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-16 | Feature slug: `role-aware-shells`. Branch: `feature/role-aware-shells`. |
| 2026-06-16 | **“Role-aware” = task/layout taxonomy**, not authenticated roles — storyboard has no login. |
| 2026-06-16 | **Minimum worker route:** lot entry only for v1; **List cups stays coordinator**. |
| 2026-06-16 | **ImportFocusShell** retained as named fourth shell (setup variant), not folded into MarketingShell. |
| 2026-06-16 | **Worker chrome (Design):** compact progress strip + tighter layout padding + title-only header on lot entry — nav and progress strip remain visible. |
| 2026-06-16 | Product Spec **approved** by David Vezzani — ready for `/design`. |

## Related documents

- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md)
- UX concerns (concern 10): [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- UI rules (baseline): [docs/ui-rules.md](../../docs/ui-rules.md)
- Routes & phases: [docs/support/application-views.md](../../docs/support/application-views.md)
- Shell ADR: [adr/0002-shared-session-ui-chrome.md](../../adr/0002-shared-session-ui-chrome.md)
- Lot cockpit (worker content): [feature/00-shipped/lot-entry-cockpit/product-spec.md](../00-shipped/lot-entry-cockpit/product-spec.md)
- Issue: [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
