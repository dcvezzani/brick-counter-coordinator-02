# Learn notes — consolidate-and-clean-ui

**Feature:** [consolidate-and-clean-ui](./) · Parent [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-13)  
**Learn date:** 2026-06-13  
**Merged:** [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` @ `a40f27b`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) |
| UI rules (canonical) | [docs/ui-rules.md](../../../docs/ui-rules.md) |
| ADR — shared chrome | [adr/0002-shared-session-ui-chrome.md](../../../adr/0002-shared-session-ui-chrome.md) |
| Product spec retrospective | [product-spec.md](./product-spec.md) § Learn retrospective |
| Validate evidence | [ship-report.md](./ship-report.md), [validate-reconcile-screenshot.png](./validate-reconcile-screenshot.png) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Parent + per-child Tech Specs before Build | Product Specs only; no parent `tech-spec.md` | Plan phase split children; Build used child product specs + inline contracts |
| Sequential child delivery | **Two parallel waves** (6 + 4) via git worktrees | Independent files per child; orchestrator tracked in parent product-spec |
| ViewHeader on all marketing routes immediately | Home uses ViewHeader; **New session deferred** | Product decision on PR #52 — follow-up Feature |
| Full #9 feedback primitives | Deferred | Confirm/toast not in #5 scope; ui-rules notes #9 |
| `./git-commit.sh` at repo root | Script absent; commits used HEREDOC `git commit` | Consumer repo has not wired git-commit.sh; submodule skill path only |
| `./dcv/` handoffs in git | `dcv/` gitignored | Local agent summaries only; product-spec + PR bodies hold traceability |

---

## Patterns to reuse

- **Parent epic → child issues #30–#40** with `feature/<slug>/product-spec.md` each.
- **Wave tracking table** in parent product-spec (`In progress — parallel build wave N`).
- **Foundation PRs first** (#30–#33, #39), then migrations (#34–#38), then Validate (#40).
- **Integration branch** `consolidate-and-clean-ui` → single PR #52 to `main` after child merges.
- **Shared components** at `src/components/ViewHeader.vue`, `ViewActions.vue`, `SessionViewFrame.vue`, `ResponsiveDataTable.vue` — import in every session view.
- **View spec pattern** — assert `ViewHeader` + no Card page shell per migrated view.

---

## Process friction (feeds AIDLC improvement)

1. **No parent Tech Spec** — Validate still worked from Product Spec success criteria; consider lightweight parent tech-spec stub for epics.
2. **Worktree cleanup** — remove worktrees after wave merges; update product-spec status from `pr-open` → `Completed`.
3. **Validate before merge vs after** — scorecard written on integration branch; merge then `/learn` on `main` (correct order).
4. **Child PR count** — 10 child PRs + 1 integration PR; document merge order in integration PR body.

---

## Follow-up Features (out of #5 scope)

| Item | Suggested slug |
|------|----------------|
| New session → ViewHeader | TBD (small migration) |
| UI feedback primitives | `ui-feedback-primitives` ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)) — **Shipped** [PR #55](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/55) |
| Go back to previous phase | `go-back-to-previous-state` ([#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53)) |
| Mission complete toast + confirm | `acknowledge-mission-complete` ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)) |
| Move tests to `tests/` | `move-tests-to-dedicated-directory` ([#47](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47)) |

---

## Feature closure

- [x] Validate PASS recorded
- [x] PROJECT.md updated
- [x] ADR-0002 written
- [x] Learn notes (this file)
- [x] Parent issue #5 closed

**Next:** `/plan` or `/build` on follow-ups above; run `/ship` on [#40](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/40) validate child if treating it separately (parent criteria met on #52).
