# ADR-0006: Role-aware shell taxonomy (worker vs coordinator)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-16 |
| **Deciders** | David Vezzani |
| **Related** | [Feature role-aware-shells](../feature/role-aware-shells/), [issue #11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11), [ADR-0002](0002-shared-session-ui-chrome.md), [docs/ui-rules.md](../docs/ui-rules.md) |

---

## Context

[ADR-0002](0002-shared-session-ui-chrome.md) defined three presentation shells and assigned **lot entry** to `SessionCoordinatorShell`. [#10 lot entry cockpit](../feature/00-shipped/lot-entry-cockpit/product-spec.md) delivered counting UX but used **view-level compact spacing** as a stopgap. [dcv/ux-concerns.md](../dcv/ux-concerns.md) concern 10 (persona collapse) remains: coordinator dashboard chrome on worker-first routes wastes phone viewport.

Constraints unchanged from ADR-0002: **presentation only** — routes, phase machine, and SessionNav visibility rules must not change. “Role-aware” means **task-appropriate layout**, not authenticated RBAC (storyboard has no login).

## Decision

We extend the shell taxonomy to **four named shells** and assign shells via **Vue Router `meta.sessionShell`**, resolved in `src/lib/session-shell.js`:

| Shell | Routes | Structure |
|-------|--------|-----------|
| **MarketingShell** | `/`, `/session/new` | `ViewFrame` — unchanged |
| **ImportFocusShell** | Part-out import | `SessionLayout` (nav hidden) → `SessionViewFrame` → `ViewHeader` (Back) → body → `ViewActions` |
| **SessionCoordinatorShell** | Lots, Cups, Reconciliation | Full `SessionLayout` chrome → `SessionViewFrame` (default) → `ViewHeader` → body → `ViewActions` |
| **SessionWorkerShell** | Lot entry | `SessionLayout` with **compact progress + tighter main padding** → `SessionViewFrame variant="worker"` → title-only `ViewHeader` → body → `ViewActions` |

**Rules:**

- Shell assignment is **declarative on routes** — views must not invent per-route compact spacing hacks.
- Worker shell **keeps** SessionNav and SessionProgress (compact on phone); it reduces frame/header/padding density only.
- Shared primitives (`ViewHeader`, `ViewActions`, `SessionViewFrame`, `SessionProgress`) gain **variant/compact props** — no duplicate shell components.
- List cups remains **coordinator** in v1; future worker routes add `meta.sessionShell: 'worker'`.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| Separate `SessionWorkerLayout.vue` | Fork entire layout tree | Duplicates nav/progress wiring |
| Hide progress strip on worker phone | Maximum chrome savings | Loses #80 backward navigation affordance on counting screen |
| Pinia shell store | Runtime shell switching | Overkill; shell is route-derived |
| Auth-gated shells | Hide reconcile from workers | Out of product scope for storyboard |

## Consequences

### Positive

- Closes concern 10; authoritative route → shell map for agents and contributors.
- Lot entry measurable chrome reduction without changing counting form behavior.
- Production can later map real roles to the same shell meta.

### Negative / trade-offs

- ADR-0002 session shell table is superseded for lot entry — link to this ADR from ADR-0002 follow-ups.
- Demo `StoryboardPhaseControls` hidden on phone for worker routes only.

### Neutral / follow-ups

- Worker shell for List cups if product revisits.
- Further progress-strip minimization if Validate evidence shows insufficient fold gain.

## Compliance & verification

- [#11 Validate scorecard](../feature/role-aware-shells/) — 10 product criteria.
- `tests/unit/lib/session-shell.test.js`, layout/view regressions.
- [docs/ui-rules.md](../docs/ui-rules.md) shell taxonomy section.

## References

- [product-spec.md](../feature/role-aware-shells/product-spec.md)
- [tech-spec.md](../feature/role-aware-shells/tech-spec.md)
- [ADR-0005](0005-progress-strip-backward-navigation.md) — progress strip interactions on worker routes
