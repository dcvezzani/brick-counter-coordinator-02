# Product Spec — Consistent button sizes

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Consistent button sizes across key views |
| **Status** | Draft — awaiting human approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Parent work item** | [#86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86) |
| **Related Tech Spec** | `feature/button-sizes-are-inconsistent/tech-spec.md` (after `/design`) |

## Problem & audience

### Problem statement

Primary action buttons **look and feel different heights** depending on which screen the user is on. The app already documents touch-target expectations in [docs/ui-rules.md](../../docs/ui-rules.md), and some workflow screens (reconciliation, lot entry Compare, confirm dialogs) follow a taller minimum on phone — but **Home**, **New session**, **Part-out import**, and **Organizer — pick lists** (including **Declare ready to import**) still use the shorter default button size. That makes the product feel uneven and can make phone taps harder on screens that were missed during earlier UI consolidation.

### Who it's for

- **Coordinators and demo users** moving through the session workflow on phone or laptop.
- **Contributors** who should not need per-view `min-h-*` class patches to match an undocumented standard.

### Current experience (baseline)

| Screen | Primary buttons observed | Height today (approx.) |
|--------|--------------------------|-------------------------|
| **Home** (`/`) | Start demo session, Resume demo, Go | Short default (~32px) |
| **New session** (`/session/new`) | Create session | Short default (~32px) |
| **Part-out import** | Confirm and begin counting | Short default in sticky `ViewActions` |
| **Organizer — pick lists** | Declare ready to import | Short default in sticky `ViewActions` |
| **Peer screens (for contrast)** | Compare with Part-Out List, Reconcile CTAs, Mark complete | Taller on phone (`min-h-11` / ~44px), slightly taller on laptop (`md:min-h-9` / ~36px) |

Organizer row toggles (**Moved**, **Needs location**) remain `size="sm"` in the table — **out of scope** for this Feature (see Decisions).

## Outcomes & business impact

### Desired outcomes

- **One coherent button height** for primary actions on the four screens called out in intake, matching the touch-target standard already used on sibling workflow screens.
- **No visual “size cliff”** when moving from Home → New session → Import → Organizer.
- **Documented rule** so future views inherit sizing without rediscovering gaps.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Home primary buttons match the agreed minimum height on phone and laptop | Visual check on `/` at `< md` and `≥ md`; unit/snapshot test if Tech Spec adds one |
| 2 | New session **Create session** matches the same standard | Visual check on `/session/new` |
| 3 | Part-out import **Confirm and begin counting** matches sticky CTA height on Reconcile / Compare peers | Visual check on import route; compare with Reconciliation `ViewActions` |
| 4 | Organizer **Declare ready to import** matches other phase-gate CTAs | Visual check on `/lots?mode=organizer` |
| 5 | No regression to button labels, routing, or phase logic | Existing view unit tests still pass |

### Business impact

Low direct revenue impact; improves **perceived polish** and **mobile usability** on demo/storyboard flows stakeholders review. Reduces ongoing UI drift after parent [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) consolidation.

## User experience & scenarios

### Key scenarios

1. **Start workflow on phone** — From Home, user taps **Start demo session**, creates a session, confirms import, and later declares ready to import. Every primary tap target feels the same size; nothing unexpectedly shrinks or grows between steps.
2. **Resume on laptop** — User opens Home on a wide screen; hub buttons align with session CTAs on the same breakpoint rules as Reconcile.
3. **Organizer on phone** — User taps **Declare ready to import** after row work; the phase gate matches other sticky CTAs (row toggles unchanged).

### Experience principles

- **Mobile-first touch targets** — Primary actions meet the project minimum (documented as 44px-class height on phone in [ui-rules.md](../../docs/ui-rules.md)).
- **Consistency over novelty** — Reuse the established sticky-CTA sizing pattern; do not invent a third button height tier.
- **Accessibility** — Sized for fingers; keyboard focus rings unchanged.

## Scope

### In scope

- Primary / workflow action buttons on:
  - **Home** — Start demo session, Resume demo, Go (jump to phase)
  - **New session** — Create session
  - **Part-out import** — Confirm and begin counting (`ViewActions`)
  - **Organizer — pick lists** — Declare ready to import (`ViewActions`)
- Aligning these with the **existing** touch-target convention already applied on Reconciliation, Compare CTAs, and `ConfirmDialog` — **on both phone and laptop**.
- Updating [docs/ui-rules.md](../../docs/ui-rules.md) to state explicitly that marketing-shell primary buttons follow the same minimum heights.

### Out of scope

- Changing button **labels**, **variants** (primary vs outline), or **workflow logic**.
- **Back** link on Part-out import header (secondary escape; intentionally compact).
- **Organizer row toggles** (**Moved**, **Needs location**).
- **SessionNav** tab targets, progress strip links, or numeric stepper controls (separate cockpit rules).
- New button component library or full theme redesign (unless `/design` finds a minimal shared wrapper is the only maintainable fix).
- Every button in the app — only the intake list plus any shared primitive needed to keep them aligned.

### Dependencies on other teams or features

- [docs/ui-rules.md](../../docs/ui-rules.md) — breakpoint matrix and `ViewActions` / `ConfirmDialog` touch-target notes.
- Shipped [#31 ViewActions](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/31) — sticky wrapper already shared; sizing may belong in wrapper or children per `/design`.

## Constraints (non-technical where possible)

- Must not break the storyboard demo workflow or phase transitions.
- Must respect safe-area padding on sticky `ViewActions` footers.
- **Organizer row toggles** (**Moved**, **Needs location**) are out of scope.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-16 | **Organizer row toggles** (**Moved**, **Needs location**) are **out of scope** — only **Declare ready to import** is in scope on that screen. |
| 2026-06-16 | **Home** and **New session** buttons use the **same minimum heights as session workflow CTAs on both phone and laptop** (match Reconcile / Compare / confirm pattern). |

## Related documents

- UI rules: [docs/ui-rules.md](../../docs/ui-rules.md)
- Application views: [docs/support/application-views.md](../../docs/support/application-views.md)
- Shipped ViewActions spec: [feature/00-shipped/view-actions/product-spec.md](../00-shipped/view-actions/product-spec.md)
- Parent UI consolidation: [feature/00-shipped/consolidate-and-clean-ui/product-spec.md](../00-shipped/consolidate-and-clean-ui/product-spec.md)
