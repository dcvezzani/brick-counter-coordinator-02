# Learn notes — storyboard-ui

**Feature:** [storyboard-ui](./) · [issue #3](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/3)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-12)  
**Learn date:** 2026-06-12

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) |
| Session phase diagram | [docs/session-phases-state.mmd](../../../docs/session-phases-state.mmd) |
| Route map | [docs/support/application-views.md](../../../docs/support/application-views.md) |
| Tech Spec retrospective | [tech-spec.md](./tech-spec.md) § Retrospective |
| Validate evidence | [ship-report.md](./ship-report.md), [validate-home-hub.png](./validate-home-hub.png) |

No new ADR — storyboard patterns extend [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md) (same Vue/JS/shadcn stack; in-memory session is storyboard-only until coordinator Feature).

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Phase diagram in `dcv/` | [docs/session-phases-state.mmd](../../../docs/session-phases-state.mmd) | Cleaner doc aligned with shipped routes; removed references to missing view-specs |
| Build completes at local commit | PR #4 + green CI required for AIDLC Build gate | Process gap caught in review; second `/build` opened PR |
| `actions/checkout@v4` / `setup-node@v4` | Upgraded to **v6** on PR #4 | GitHub Actions Node 20 deprecation warnings |
| Chrome DevTools MCP for all UI gates | IDE browser used when MCP lacks `navigate_page` | Same workaround as initial-setup review/validate |
| HTML tables vs shadcn `table` | Semantic tables + Card/Button/Badge | Simpler in JS mode; sufficient for storyboard |

---

## Patterns to reuse

- **`src/lib/storyboard-session.js`** — module reactive singleton for demo phase/state; swap internals for coordinator API later without changing routes/views.
- **Nested `SessionLayout`** + `meta.hideSessionNav` on import route.
- **One view, multiple phases** — e.g. `ReconciliationView` for `reconciling` and `updating_inventory`.
- **Jump to phase** on Home for stakeholder prep (Product scenario 2).
- **Router guard** — closed/missing session → Home; phase vs URL not enforced in storyboard (CTAs drive story order).
- Commit **`docs/session-phases-state.mmd`** early so specs and agents share one diagram.

---

## Process friction (feeds AIDLC improvement)

1. **Build gate = open PR + green CI** — document explicitly in consumer onboarding; first `/build` run stopped at local commit.
2. **Validate/Learn commits on `main`** after merge — push `main` so remote has scorecard/learn artifacts (local was ahead after `/ship`).
3. **Learn deferred `PROJECT.md`** by design in Product Spec — review flagged it; Learn is the right place to update project memory.

---

## Feature closure

- [x] Validate PASS recorded (human approved 2026-06-12)
- [x] PROJECT.md updated
- [x] Retrospective on Tech Spec
- [x] learn-notes.md written
- [x] Parent issue #3 closed (2026-06-12)

**Next Feature:** coordinator server or BrickLink integration — start with `/plan <slug>`.
