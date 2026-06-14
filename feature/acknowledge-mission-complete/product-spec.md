# Product Spec — Acknowledge mission complete

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Acknowledge mission complete — confirm before close + celebration toast on Home |
| **Status** | Approved |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Approved** | 2026-06-13 — David Vezzani (chat decisions) |
| **Related Tech Spec** | *(pending `/design`)* |
| **Work item** | [#54 Acknowledge session complete](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54) |
| **Related** | [#9 UI feedback primitives](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) · [storyboard-ui](../storyboard-ui/product-spec.md) · [ReconciliationView](../../src/views/ReconciliationView.vue) |

## Problem & audience

### Problem statement

Completing a long counting session is a **meaningful milestone** — inventory from a LEGO set part-out is ready for the store. Today, tapping **Mark session complete** on the Export chapter **immediately** closes the session and sends the user to Home with **no confirmation** and **no acknowledgment**. Users can accidentally complete a session, and successful completion feels abrupt — missing a moment of closure and confidence that the workflow finished correctly.

### Who it's for

- **Primary:** Coordinator who just exported / verified inventory and closes the session intentionally.
- **Secondary:** Demo presenter — wants a satisfying end to the storyboard walkthrough.
- **Tertiary:** Future store operators — expect confirm-before-irreversible-action and clear success feedback.

### Current experience (baseline)

On `ReconciliationView` when phase is `updating_inventory`:

1. User taps **Mark session complete**.
2. App calls `markSessionComplete` (phase → `closed`) and navigates to `/`.
3. Home shows the hub with no message about what just happened.
4. No confirm dialog; no toast; no celebration.

Feedback primitives (`alert-dialog`, toast/sonner) are **not installed** — deferred to [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) in [docs/ui-rules.md](../../docs/ui-rules.md).

## Outcomes & business impact

### Desired outcomes

- **Accidental complete prevented** — user must confirm before the session is closed.
- **Successful complete acknowledged** — after confirm, user lands on Home and sees a **celebration toast** with set number, lots processed, total pieces, and average part-out value for the set (light celebratory tone).
- **Irreversible action is clear** — confirm copy states that completing ends the session (resume rules unchanged: closed session cannot re-enter session routes).
- **Accessible feedback** — confirm trap is keyboard-friendly; success message is announced to assistive tech (Design detail).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Tapping **Mark session complete** opens confirm with **Are you sure?** (or approved equivalent) before `closed` | Manual + automated test |
| 2 | Cancel / dismiss leaves session in `updating_inventory` on Reconciliation | Manual test |
| 3 | Confirm closes session and navigates to Home | Manual + existing router guard behavior |
| 4 | Home shows success toast with set #, lot count, piece count, and avg part-out value | Screenshot / test |
| 5 | Toast appears once per completion (not on every Home visit) | Manual + test |
| 6 | `npm test` / `npm run build` pass | CI |

### Business impact

Reduces mistaken session closure during long counts. Reinforces product narrative (part-out → store inventory). Small UX win that makes the demo ending memorable without changing phase rules or backend scope.

## User experience & scenarios

### Key scenarios

1. **Happy path** — User on Export chapter taps **Mark session complete** → dialog title **Are you sure?** → body explains session will close → **Complete session** → Home loads → celebration toast with set stats → toast auto-dismisses after configured duration.
2. **Changed mind** — User taps complete → confirm appears → **Not yet** → stays on Reconciliation in Export chapter; session still active.
3. **Demo finish** — Presenter completes session intentionally; audience sees confirm + toast as clear “mission accomplished” beat.
4. **Return to Home later** — User opens app again at `/`; **no** completion toast (only immediately after completing).

### Experience principles

- **Confirm before irreversible** — Match patterns planned for [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9); this Feature is the first adopter for session complete.
- **Celebrate without clutter** — One concise toast; no modal on Home after redirect.
- **Tone:** Light celebration (emoji acceptable) — specific to LEGO inventory outcome, not generic “Success!”
- **Mobile-safe** — Toast readable above bottom safe areas; confirm dialog usable on phone (sticky CTA context).

## Scope

### In scope

- **Confirm dialog** (shadcn `alert-dialog`, added in this Feature — minimal install, not blocked on #9):
  - **Title:** Are you sure?
  - **Body:** You are about to finish this session. Once you do, the session will be closed.
  - **Buttons:** Not yet (dismiss) · Complete session (proceed)
- **Success toast** on Home immediately after confirmed completion, **light celebration** tone. Include:
  - Set number (e.g. 10281)
  - Number of lots processed
  - Total number of pieces
  - Average part-out value for the set
- **Toast behavior:** Auto-dismiss after a **configurable** duration (default in Design/Tech Spec).
- Unit tests for confirm gate and toast trigger.

**Data note for Design:** Storyboard session today has `setNumber` and `lots` with quantities; **average part-out value** is not on the session model yet — `/design` must define storyboard source (fixture field, computed stub, or aggregated from part-out lines).

### Out of scope

- Confirm on other phase buttons (Import confirm, Declare ready to organize, etc.) — separate Features.
- Full [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) catalog (loading skeletons, generic error toasts, sheets).
- Production BrickLink export verification or real inventory sync.
- Undo / reopen closed session.
- Email, push, or external notifications.
- Changing `markSessionComplete` semantics or session-persisted history on Home.

### Dependencies on other teams or features

- **Minimal shadcn feedback in this Feature** — install `alert-dialog` + toast (e.g. sonner) here; [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) may generalize later.
- Reconciliation view shell from [consolidate-and-clean-ui](../consolidate-and-clean-ui/product-spec.md) (`ViewActions` sticky CTA).

## Constraints (non-technical where possible)

- Session close behavior unchanged: `closed` → session routes redirect Home ([application-views.md](../../docs/support/application-views.md)).
- Storyboard in-memory session only.
- Copy must not promise real BrickLink upload when export is still a stub.
- Accessibility: confirm focus trap and toast live region per [accessibility-designer](../../docs/personas/accessibility-designer.md).

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-13 | **Confirm title:** Are you sure? |
| 2026-06-13 | **Confirm body:** You are about to finish this session. Once you do, the session will be closed. |
| 2026-06-13 | **Confirm buttons:** Not yet / Complete session |
| 2026-06-13 | **Toast content:** Set number, lots processed, piece count, average part-out value for the set — light celebration (emoji OK) |
| 2026-06-13 | **Primitives:** Add minimal shadcn `alert-dialog` + toast in this Feature (do not block on #9) |
| 2026-06-13 | **Toast dismiss:** Auto-dismiss after configurable duration (default TBD in Tech Spec) |

## Related documents

- Tech Spec: *(pending `/design`)*
- Phase / routes: [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd) · [application-views.md](../../docs/support/application-views.md)
- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md) (pattern G — feedback on complete)
- Issue: [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)
