# ADR-0005: Progress strip as sole backward phase control

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | David Vezzani |
| **Related** | [Feature go-back-to-previous-state-02](../feature/00-shipped/go-back-to-previous-state-02/), [issue #80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80), [PR #82](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/82), [#53 go-back-to-previous-state](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53), [application-views.md](../docs/support/application-views.md), [ui-rules.md](../docs/ui-rules.md) |

---

## Context

[#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) introduced `goBackToPhase`, multi-step confirm, and backward moves via **ViewActions** “Back to …” buttons plus **SessionNav** auto-regress on Lot/Reconcile clicks. That fixed phase/route desync but duplicated controls on every screen.

[#80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80) (go-back v2) asked whether the **session progress strip** (`SessionProgress`) could become the primary backward affordance — the #53 Tech Spec had deferred clickable strip steps.

Constraints: reuse existing phase matrix and `ConfirmDialog`; SessionNav serves shared routes (Lots browse vs organizer, Cups); storyboard client-only phase today.

## Decision

**Backward phase navigation uses the progress strip only:**

| UI | Backward phase change? |
|----|------------------------|
| `SessionProgress` — **past** allowed step (button) | **Yes** — `goBack(phase)` via `usePhaseNavigation` |
| `SessionProgress` — **current** step (badge) | **No** — display only |
| `SessionProgress` — **future** / disallowed steps | **No** |
| `SessionNav` links | **No** — route-only |
| `ViewActions` back buttons | **Removed** — no per-view “Back to …” |

Rules unchanged from #53:

- `goBackToPhase` / `isAllowedBackwardTarget` define allowed targets.
- `needsBackwardConfirm` when skipping **>1** phase step — `ConfirmDialog` owned by `SessionProgress`.
- Session data preserved on backward move (no wipe).

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| A — Keep #53 only (ViewActions + nav regress) | Already shipped | Duplicated affordances; strip stayed display-only |
| B — Strip **plus** ViewActions (additive) | Both controls | Product chose consolidation |
| C — **Strip only** (chosen) | Single discoverable control in session chrome | Approved 2026-06-15; detours use earlier past step |

## Consequences

### Positive

- One backward vocabulary aligned with strip labels (Count, Reconcile, Organize, Export).
- SessionNav simplification — no phase side effects on ambiguous shared routes.
- Fewer sticky footer buttons on Reconciliation, List lots, List cups.

### Negative / trade-offs

- **Current step not clickable** — user on Cups during Reconcile must click **Count** (or another past step), not the highlighted Reconcile badge.
- Strip confirm dialog must stack above mobile nav and receive pointer events — required `AlertDialogContent` z-index/pointer-events fix.

### Neutral / follow-ups

- [#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) phase engine remains; v2 is UX relocation only.
- Production coordinator may own phase server-side later — client contract unchanged.

## Compliance & verification

- `SessionProgress.test.js`, `usePhaseNavigation.test.js`, view regressions in CI.
- [application-views.md](../docs/support/application-views.md) § Backward phase transitions documents strip-only controls.
- [ui-rules.md](../docs/ui-rules.md) § ConfirmDialog — go-back shipped example.

## References

- [product-spec.md](../feature/00-shipped/go-back-to-previous-state-02/product-spec.md)
- [tech-spec.md](../feature/00-shipped/go-back-to-previous-state-02/tech-spec.md)
- [session-phases-state.mmd](../docs/session-phases-state.mmd)
