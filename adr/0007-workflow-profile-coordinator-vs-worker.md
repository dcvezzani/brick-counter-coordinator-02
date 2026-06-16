# ADR-0007: Workflow profile (coordinator vs worker journeys)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | David Vezzani |
| **Related** | [Feature diff-workflows-for-desktop-and-phone](../feature/00-shipped/diff-workflows-for-desktop-and-phone/), [issue #90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90), [ADR-0006](0006-role-aware-shell-taxonomy.md), [docs/ui-rules.md](../docs/ui-rules.md), [application-views.md](../docs/support/application-views.md) |

## Context

[ADR-0006](0006-role-aware-shell-taxonomy.md) introduced **shell density** by route (`meta.sessionShell`) but not **which activities** each persona sees. Workers on phones still reached coordinator-only surfaces (import, reconcile, full organizer). [#90](../feature/00-shipped/diff-workflows-for-desktop-and-phone/product-spec.md) splits **journeys** while reusing the same URLs and phase machine.

Constraints: storyboard-only (no auth server); JavaScript client; `md` (768px) breakpoint; display name in `localStorage` for assignment labels.

## Decision

We introduce an **effective workflow profile** (`coordinator` | `worker`) computed client-side:

| Input | Rule |
|-------|------|
| Viewport `< md` | **Always worker** (ignores stored preference) |
| Viewport `≥ md` | **Coordinator \| Worker** radio on Home; stored in `localStorage` key `bcc.workflowProfile` (default coordinator) |

**Profile drives:**

- Home layout (hub + create vs session join list)
- `SessionNav` item set and `/session/:id/my-list` vs `/lots?mode=organizer`
- Filtered `SessionProgress` (worker: Count → Organize → Done)
- `workflowGuard` route redirects (worker blocked from coordinator-only routes; coordinator blocked from `meta.workerOnly` routes via phase-appropriate `landingRouteLocation`)
- Profile-aware shell on browse routes (`resolveSessionShell` in `session-shell.js`)

**New worker route:** `/session/:id/my-list` — assigned put-away list only (`useVirtualList` for ≥50 lines).

**Router bootstrap:** `sessionGuard` calls `ensureStoryboardFixtures()` so fixture sessions resolve on cold deep links.

**State modules:** `useWorkflowProfile` + `workflow-profile-state.js` (synced snapshot for router guards outside Vue setup); `useDisplayName` for `bcc.displayName`.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| Viewport-only (no radio) | Phone vs desktop by width alone | Tablet ambiguity; demo needs worker preview at full width |
| Separate worker app / routes tree | Fork router | Duplicates phase machine and fixtures |
| Server RBAC | Real roles | Out of scope for storyboard milestone |
| Pinia global store | Profile in store | Overkill; composable + small sync module sufficient |

## Consequences

### Positive

- Workers get task-focused nav and My list; coordinators retain full lifecycle.
- Same phase gates and storyboard module — profile changes surfaces only.
- Contracts documented for future coordinator server (join registry, assignment push).

### Negative / trade-offs

- Guards are **client-side only** — not security boundaries.
- Coordinator on phone is forced worker (accepted product decision).
- `effectiveProfile` must stay synced in `workflow-profile-state.js` for `beforeEach` guards.

### Neutral / follow-ups

- WebSocket push when phase → organizing (future Feature).
- Enforce duplicate display names server-side when backend exists.

## Compliance & verification

- [validate-scorecard.md](../feature/00-shipped/diff-workflows-for-desktop-and-phone/validate-scorecard.md) — 16/16 Product Spec criteria.
- `tests/unit/lib/workflow-guard.test.js`, `tests/integration/workflow-profile.test.js`, component tests for nav/progress/My list.

## References

- [product-spec.md](../feature/00-shipped/diff-workflows-for-desktop-and-phone/product-spec.md)
- [tech-spec.md](../feature/00-shipped/diff-workflows-for-desktop-and-phone/tech-spec.md)
- [workflow-diagrams.md](../feature/00-shipped/diff-workflows-for-desktop-and-phone/workflow-diagrams.md)
