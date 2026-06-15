# Product Spec — Compare with Part-Out List from List lots

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Compare with Part-Out List on List lots (browse) |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-15 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani (chat) |
| **Related Tech Spec** | *(pending `/design`)* |
| **Work item** | [#79 Compare with Part-Out List on List lots (browse)](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/79) |
| **Related** | [lot-entry-cockpit](../00-shipped/lot-entry-cockpit/product-spec.md) · [application-views.md](../../docs/support/application-views.md) · [ui-rules.md](../../docs/ui-rules.md) |

## Problem & audience

### Problem statement

During the **Count** phase, workers can browse saved lots on **List lots** (`/session/:sessionId/lots`) while counting continues on **Lot entry**. Today, the sticky **Compare with Part-Out List** action — the phase gate that advances the session to **Reconcile** — appears **only** on Lot entry. A coordinator who reviews lots on the browse screen has no equivalent affordance there and must switch back to Lot entry to finish counting and start reconciliation.

### Who it's for

- **Primary:** Coordinator or worker in **Count** phase who uses **Lots** nav to review what has been recorded before comparing against the part-out import.
- **Secondary:** Demo presenter walking the storyboard — parity between counting screens.

### Current experience (baseline)

| Screen | Count phase | Compare CTA |
|--------|-------------|-------------|
| **Lot entry** (`/lot`) | Counting form + sticky **Compare with Part-Out List** | **Present** — sets phase to `reconciling`, lands on Reconciliation |
| **List lots browse** (`/lots`, default) | Read-only part / color / condition / qty table | **Missing** — no `ViewActions` footer |
| **List lots organizer** (`/lots?mode=organizer`) | Organizer pick lists | Organizer CTAs only (Declare ready to import, back buttons) — **unchanged** |

Prior sticky-CTA work added Compare on Lot entry (`lot-entry-sticky-cta`) and organizer CTAs on List lots (`lots-sticky-cta`) but did not add Compare to browse mode.

## Outcomes & business impact

### Desired outcomes

- **List lots browse** offers the **same** **Compare with Part-Out List** action as Lot entry when the session is in **Count** phase.
- Tapping Compare advances the session to **Reconcile** and lands on the reconciliation screen — identical outcome to Lot entry.
- Organizer mode and non-counting phases are unaffected.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | List lots browse shows **Compare with Part-Out List** only when `phase === 'counting'` | Unit test + manual Count phase walkthrough |
| 2 | Compare is **not** shown in organizer mode (`?mode=organizer`) | Unit test + manual |
| 3 | Compare is **not** shown when phase is `reconciling`, `organizing`, or later | Unit test |
| 4 | Clicking Compare sets phase to `reconciling` and navigates to Reconciliation landing | Unit test (mirror `LotEntryView` behavior) |
| 5 | Lot entry Compare behavior **unchanged** | Existing `LotEntryView` tests still pass |
| 6 | Sticky footer uses `ViewActions`; Compare button meets touch-target rules (`min-h-11`) | Visual / code review per [ui-rules.md](../../docs/ui-rules.md) |
| 7 | `npm test` / `npm run build` pass | CI |

### Business impact

Small UX parity fix — reduces friction when reviewing lots during Count and aligns with the session model (Compare is the Count → Reconcile gate, not tied to a single route).

## User experience & scenarios

### Key scenarios

1. **Review lots, then compare** — Session in Count → user opens **Lots** from session nav → scans part/color/qty rows → taps sticky **Compare with Part-Out List** → session advances to Reconcile → Reconciliation screen opens with discrepancy workflow.
2. **Still counting on Lot entry** — User on Lot entry → Compare still works as today (no regression).
3. **Wrong phase on List lots** — Session in Reconcile or Organize → user opens List lots browse → **no** Compare CTA (browse remains read-only for that chapter).
4. **Organizer mode unchanged** — User on `/lots?mode=organizer` → organizer CTAs only; no Compare.

### Experience principles

- **Same label, same outcome** — Button copy is exactly **Compare with Part-Out List**; behavior matches Lot entry.
- **Phase-gated** — Compare is a Count-chapter action only; do not show it when the session has moved past Count.
- **Mobile-first** — Sticky `ViewActions` footer; Compare meets minimum touch height.
- **No confirmation** — Compare advances phase immediately (same as Lot entry today).

## Scope

### In scope

- Add sticky **Compare with Part-Out List** to **List lots browse** (`ListLotsView`, non-organizer template) when session phase is `counting`.
- Unit tests for visibility gating and Compare click behavior.
- Update [application-views.md](../../docs/support/application-views.md) and [ui-rules.md](../../docs/ui-rules.md) to note Compare on both Lot entry and List lots browse during Count.

### Out of scope

- Changing Compare label, confirmation dialog, or reconcile prerequisites.
- Compare on **List cups** or other session views.
- Organizer mode CTAs (already shipped).
- Backward navigation (#53) — orthogonal; List lots organizer back buttons stay as-is.
- Extracting shared compare logic into a composable *(Design may choose; not a product requirement)*.

### Dependencies on other teams or features

- **Lot entry cockpit** ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)) — shipped; defines Compare on Lot entry.
- **List lots browse columns** ([#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66)) — shipped; browse table shape.
- Storyboard `setPhase` + `landingRouteLocation` — existing; no API change.

## Constraints (non-technical where possible)

- JavaScript-only Vue SFCs per project conventions.
- Session phase machine unchanged — Compare remains the explicit Count → Reconcile transition (not automatic).
- Storyboard demo session (`demo`) must demonstrate the new CTA in Count phase.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-15 | **Parity with Lot entry** — same button label, same phase transition, same reconciliation landing; only during `counting` on browse mode (not organizer). |
| 2026-06-15 | **Approved** — browse-only, `counting` phase only, no confirmation; parity with Lot entry. |

## Related documents

- Prior Compare on Lot entry: [lot-entry-cockpit product-spec](../00-shipped/lot-entry-cockpit/product-spec.md)
- Routes & phases: [application-views.md](../../docs/support/application-views.md)
- Sticky CTA rules: [ui-rules.md](../../docs/ui-rules.md)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
