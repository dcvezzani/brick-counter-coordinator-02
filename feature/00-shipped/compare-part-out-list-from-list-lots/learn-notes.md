# Learn notes — Compare with Part-Out List on List lots

**Feature:** [compare-part-out-list-from-list-lots](./) · [#79](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/79) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-15)  
**Learn date:** 2026-06-15  
**Merged:** [PR #81](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/81) → `main` @ `9037293`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 11 |
| Routes / chapter labels | [docs/support/application-views.md](../../../docs/support/application-views.md) |
| Sticky CTA rules | [docs/ui-rules.md](../../../docs/ui-rules.md) § Worker counting — Phase gate |
| Validate / review | [validate-scorecard.md](./validate-scorecard.md), [review-report.md](./review-report.md) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Tech Spec via `/design` | Product Spec trace only | Small parity change; approved skip |
| Shared compare composable | Duplicated `compareWithPartOut` in `ListLotsView` | Matches `LotEntryView` inline handler; extraction deferred |
| PR open at end of Build | PR #81 opened as separate Build step | User workflow; CI green before merge |

---

## Patterns to reuse

- **Count-phase Compare gate** on both **Lot entry** and **List lots browse** — same label, `setPhase('reconciling')`, `landingRouteLocation`.
- **Phase-gated `ViewActions`** — `v-if="session.phase === 'counting'"` on browse template only; organizer branch unchanged.
- **Isolated Build** — git worktree `../brick-counter-coordinator-02-worktrees/<slug>` on branch `feature/<slug>`.

---

## Process friction (feeds AIDLC improvement)

1. **Worktree cleanup was manual folklore** until AI-DLC `git-worktree-cleanup` skill + Learn step — now documented for `/learn`.
2. **No `feature/<slug>/AIDLC.md`** for this feature — cleanup used `git worktree list` fallback; add `AIDLC.md` on future parallel builds.

---

## Git hygiene

| Item | Result |
|------|--------|
| Worktree | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/compare-part-out-list-from-list-lots` — removed at Learn |
| Branch | `feature/compare-part-out-list-from-list-lots` — pruned when remote gone |
| PR | [https://github.com/dcvezzani/brick-counter-coordinator-02/pull/81](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/81) (merged) |

---

## Feature closure

- [x] Validate PASS recorded
- [x] PROJECT.md updated
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/compare-part-out-list-from-list-lots/`
- [x] GitHub issue #79 closed (at merge)
- [x] Worktree removed

**Next:** [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) role-aware shells per [feature/ux-roadmap.md](../../ux-roadmap.md).
