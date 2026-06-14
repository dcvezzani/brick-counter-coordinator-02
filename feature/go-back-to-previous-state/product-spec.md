# Product Spec — Go back to previous state

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Go back to previous state — backward session phase / mode navigation |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Work item** | [#53 Go back to previous session phase/mode](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) |
| **Related** | [session-phases-state.mmd](../../docs/session-phases-state.mmd) · [application-views.md](../../docs/support/application-views.md) · [storyboard-ui](../storyboard-ui/product-spec.md) |

## Problem & audience

### Problem statement

After advancing a counting session (e.g. from **Count** to **Reconcile**, or **Organize** to **Export**), there is **no reliable way to step backward** to an earlier phase and work there again. Session navigation (`SessionNav`) still links to earlier screens, but the session **phase** often stays at the advanced step — so the user is on the wrong screen for the current mode, or primary actions and chapter labels no longer match what they need to do.

Examples reported:

- In **Reconcile**, user cannot return to **Count** to fix lot entry.
- In **Organize**, user may need **Reconcile** or **Count** again — only “Return to reconciling” exists today (organizer mode on List lots).
- From **Export** (`updating_inventory`), no path back to Organize, Reconcile, or Count.
- **List cups** offers “Return to lot entry” but does not consistently restore **Count** phase — route and phase can desync.

Forward jumps should remain gated (confirm buttons, resolved rows, etc.). **Backward** moves should be explicit and predictable so coordinators can correct mistakes without restarting the session.

### Who it's for

- **Primary:** Coordinator running a long counting session — needs to fix data or re-do a step after advancing.
- **Secondary:** Demo presenter (storyboard) — needs to walk backward in the flow without Home “Jump to phase” hacks.
- **Tertiary:** Future production users when the coordinator server owns phase — same UX expectations.

### Current experience (baseline)

| Transition | Today |
|------------|--------|
| Organize → Reconcile | **Works** — “Return to reconciling” on organizer List lots; phase updates |
| Cups → Lot entry | **Partial** — navigates to lot route; phase may **not** revert to `counting` |
| Reconcile → Count | **Missing** — no explicit control; nav to Lot does not regress phase |
| Organize → Count | **Missing** |
| Export → earlier phases | **Missing** |
| Import → (from Count) | **Missing** — import is pre-nav; Back on import goes Home only |
| Session progress strip | **Display only** — past steps are not actionable |
| Home “Jump to phase” | Demo-only; arbitrary phase set — not a in-session back affordance |

Phase diagram ([session-phases-state.mmd](../../docs/session-phases-state.mmd)) documents one backward edge: `organizing → reconciling`.

## Outcomes & business impact

### Desired outcomes

- User can **explicitly go back one or more steps** along the session lifecycle to a **previous phase**, land on the correct default screen, and continue work there.
- **Phase and screen stay aligned** after any backward move — no “on Lot entry but still in Reconcile phase.”
- **Forward progression rules unchanged** — advance actions still require the same confirmations and gates.
- **Session data preserved** when stepping back (lots, reconciliation rows, organizer flags) unless product decides otherwise with confirmation.
- Back affordances are **discoverable** (not only hidden demo controls on Home).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | From `reconciling`, user can return to `counting` and lot entry works as Count chapter | UI walkthrough + phase equals `counting` on lot route |
| 2 | From `organizing`, user can return to `reconciling` (existing) and optionally to `counting` if in scope | Walkthrough organizer + reconcile + count paths |
| 3 | From `updating_inventory`, user can return to at least one earlier in-scope phase | Walkthrough from Export chapter |
| 4 | Cups “return to lot entry” (or replacement) sets phase to `counting` when that is the target | Automated test + manual check |
| 5 | No new arbitrary **forward** skips (e.g. Count → Organize without reconcile gates) | Phase matrix / regression tests |
| 6 | `session-phases-state.mmd` and `application-views.md` updated for all allowed backward edges | Doc review |
| 7 | `npm test` / `npm run build` pass | CI |

### Business impact

Reduces dead-ends and session restarts during counting — especially important before production coordinator enforces phase server-side. Improves demo credibility when presenters need to back up and show an earlier step.

## User experience & scenarios

### Key scenarios

1. **Fix a lot after reconcile** — User advanced to Reconcile, notices a lot quantity error. User chooses “Back to counting” (or equivalent), lands on Lot entry in Count mode, edits, then advances to Reconcile again via existing forward control.
2. **Re-open reconcile from organize** — User in Organize mode realizes a discrepancy. User taps “Return to reconciling” (exists) or a clearer shared pattern; reconcile rows and organizer progress remain as left.
3. **Undo export chapter** — User entered Export (`updating_inventory`) too early. User steps back to Organize or Reconcile, completes work, advances forward again.
4. **Cups detour** — User opened Cups during Reconcile, then returns to Count — phase becomes `counting`, not a mismatched Reconcile-on-lot screen.
5. **Presenter demo** — Without Home jump controls, presenter backs up one phase from the session chrome and re-narrates the prior step.

### Experience principles

- **Explicit over implicit** — Going back changes **phase**, not just the URL; optional confirm for destructive-feeling jumps (Export → Count).
- **Same vocabulary as progress strip** — Labels align with SessionProgress: Import, Count, Reconcile, Organize, Export.
- **Preserve work by default** — Stepping back does not wipe lots, resolved rows, or organizer flags unless user confirms a reset (out of scope unless requested).
- **No forward cheating** — SessionNav or progress UI must not let users skip ahead of current phase without existing forward actions.

## Scope

### In scope

- Define **allowed backward transitions** along the main session chain (see open questions).
- **In-session controls** to trigger backward transitions (per-view actions, shared pattern, and/or clickable past steps on SessionProgress — Design decides).
- **Phase + route sync** on every backward transition (use same landing routes as forward defaults in [application-views.md](../../docs/support/application-views.md)).
- Fix **Cups → Count** desync and gaps for **Reconcile → Count**, **Export → earlier** as approved in chat.
- Update phase diagram and application-views docs.
- Storyboard in-memory session (`storyboard-session.js`) — production API deferred but behavior should not block future server-owned phase.

### Out of scope

- Arbitrary **forward** jumps (Home demo “Jump to phase” may remain for storyboard only — separate from this Feature).
- **Closed → anything** or restarting a session from scratch.
- **Importing → pre-session** beyond existing Back to Home on import screen.
- Wiping or resetting session data on backward move (unless explicitly added after product decision).
- Coordinator server / WebSocket phase authority (future Feature — this Feature defines client storyboard behavior and UX contract).
- Changing which SessionNav items are visible per phase (unless required for backward UX — prefer minimal nav rule changes).

### Dependencies on other teams or features

- Builds on [storyboard-ui](../docs/feature/00-shipped/storyboard-ui/product-spec.md) phase model and [consolidate-and-clean-ui](../docs/feature/00-shipped/consolidate-and-clean-ui/product-spec.md) ViewActions / SessionProgress chrome.
- Should land after or alongside integration of #5 UI shells so back actions use shared `ViewActions` pattern.

## Constraints (non-technical where possible)

- Must not break existing **forward** gates (all reconciliation rows resolved before Organize, etc.).
- Must remain consistent with **docs/session-phases-state.mmd** as source of truth for allowed edges.
- Accessibility: back actions need visible labels and keyboard reachability (detail in Design).
- Storyboard-only today — no backend persistence; backward moves affect in-memory session only.

## Decisions (optional)

| Date | Decision |
|------|----------|
| *(pending)* | Full backward chain vs subset of transitions |
| *(pending)* | Whether SessionNav clicks on “past” destinations auto-regress phase or only dedicated “Go back to …” buttons |
| *(pending)* | Confirm dialog for multi-step back (e.g. Export → Count) |
| *(pending)* | Whether `importing →` backward from `counting` is in scope |

## Related documents

- Tech Spec: *(pending `/design`)*
- Phase diagram: [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd)
- Routes: [docs/support/application-views.md](../../docs/support/application-views.md)
- Issue: [#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53)
