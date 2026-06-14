# ADR-0002: Shared session UI chrome and shell taxonomy

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-13 |
| **Deciders** | David Vezzani |
| **Related** | [Feature consolidate-and-clean-ui](../feature/00-shipped/consolidate-and-clean-ui/), [issue #5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5), [docs/ui-rules.md](../docs/ui-rules.md), [ADR-0001](0001-frontend-vue-js-shadcn-stack.md) |

---

## Context

Storyboard UI (#3) shipped seven views with inline `Card` shells, copy-pasted sticky phase CTAs, and duplicate responsive table/card markup. UX slices (#6, #7) improved mobile patterns but increased duplication. Contributors and agents need predictable layout primitives and a written rules doc before adding Features #9–#11.

Constraints: **presentation only** — phase machine, routes, and `SessionNav` visibility rules from [application-views.md](../docs/support/application-views.md) must not change.

## Decision

We consolidate session presentation into **four shared Vue components** and **three shells**, documented in [docs/ui-rules.md](../docs/ui-rules.md):

| Component | Role |
|-----------|------|
| `ViewHeader` | Page title block (`h1`), description, optional `#badge` and `#leading` slots |
| `ViewActions` | Sticky footer (phone) / inline (laptop) workflow action bar |
| `SessionViewFrame` | Bordered `max-w-4xl` session content frame inside `SessionLayout` |
| `ResponsiveDataTable` | Laptop HTML table + phone card list (`md` breakpoint) |

| Shell | Routes | Structure |
|-------|--------|-----------|
| **MarketingShell** | `/`, `/session/new` | `ViewFrame` + header (ViewHeader on Home; New session ViewHeader follow-up) |
| **SessionCoordinatorShell** | Lot, Lots, Reconcile, Cups | `SessionLayout` → nav/progress → `SessionViewFrame` → `ViewHeader` → body → `ViewActions` |
| **ImportFocusShell** | Part-out import | Nav hidden; frame → `ViewHeader` (Back) → body → `ViewActions` |

**Rules:**

- Session views **must not** use `Card` + `CardHeader` as the page shell.
- Sticky footer class strings **must not** appear in `src/views/` — only in `ViewActions.vue`.
- Tabular session content **must** use `ResponsiveDataTable` unless documented non-tabular exception (e.g. List cups `<ul>`).
- `Card` inside MarketingShell for hub **content panels** (Home session hub) is allowed — not a page shell.

Implementation merged via integration [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) (child PRs #41–#51).

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| Per-view cleanup only | Refactor each view without shared components | Duplication returns on next screen |
| Single mega-PR | One branch for all migrations | Review bottleneck; parallel waves preferred |
| Pinia layout store | Central layout state | Overkill for storyboard; shells are compositional |
| TypeScript shared library | Extract to typed package | Conflicts with JS-only client ADR-0001 |

## Consequences

### Positive

- One place to change sticky CTA, responsive table, and title placement.
- `docs/ui-rules.md` gives agents a single layout reference.
- View-level unit tests assert shell adoption.

### Negative / trade-offs

- Migration PRs temporarily duplicated primitives until foundation merged (#43 dedupe note).
- New session still uses hand-written `h1` in ViewFrame — follow-up Feature.

### Neutral / follow-ups

- [#9 UI feedback primitives](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) — alert-dialog, sonner still deferred.
- New session → `ViewHeader` follow-up.

## Compliance & verification

- Parent #5 Validate scorecard greps + view specs.
- [docs/ui-rules.md](../docs/ui-rules.md) anti-patterns section.
- Code review: new session views import shared chrome from `@/components/`.

## References

- [validate-scorecard.md](../feature/00-shipped/consolidate-and-clean-ui/validate-scorecard.md)
- [product-spec.md](../feature/00-shipped/consolidate-and-clean-ui/product-spec.md)
