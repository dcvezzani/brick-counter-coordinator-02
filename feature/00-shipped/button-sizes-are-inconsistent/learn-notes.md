# Learn notes — Consistent button sizes

**Feature:** [button-sizes-are-inconsistent](./) · [#86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-16)  
**Learn date:** 2026-06-16  
**Merged:** [PR #87](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/87) → `main` @ `832f8ed`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 14 |
| UI rules | [docs/ui-rules.md](../../../docs/ui-rules.md) — marketing-shell + `ViewActions` primary heights |
| Shared chrome | [ADR-0002](../../../adr/0002-shared-session-ui-chrome.md) — `ViewActions` slot sizing |
| Specs | [product-spec.md](./product-spec.md), [tech-spec.md](./tech-spec.md) |
| Validate / ship | [validate-scorecard.md](./validate-scorecard.md), [ship-report.md](./ship-report.md) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Optional per-view patches on Import / Organizer | **No view edits** — `ViewActions` wrapper only | Tech Spec architecture; fewer files to touch |
| New shadcn `Button` size variant | **`PRIMARY_ACTION_BUTTON_CLASS` + `min-h-*`** | Matches `ConfirmDialog` / Reconciliation without design-system churn |
| `/review` before Validate | **Skipped** — build approved → `/ship` | Human expedited; Validate MCP + units sufficient for scope |
| Dedup Compare `min-h-11` only | **Removed** redundant classes on Lot entry + List lots browse | Wrapper supplies both breakpoints |

---

## Patterns to reuse

- **Marketing routes:** import `PRIMARY_ACTION_BUTTON_CLASS` from `src/lib/primary-action-button-ui.js` on hub/session-create buttons.
- **Phase-gate CTAs:** put primary actions in `ViewActions`; slot row applies `[&_[data-slot=button]]:min-h-11` and `md:min-h-9` — no per-button height classes unless layout needs more (e.g. `w-full`).
- **MCP UI validation:** storyboard state is in-memory — **full page reload** drops the demo session; use click-through or `router.push` in the same tab after seeding.
- **Worktree dev:** load `.aidlc/dev.env` (port **18000** for this slug) before `npm run dev:aidlc`.

---

## Process friction

1. **Worktree at `/plan`** — correct isolation; parent `main` AIDLC refresh had to merge into feature branch once.
2. **`/build` + PR** — skill text is clear post-`af473d9`; no extra AI-DLC doc change required.
3. **Validate before merge checklist** — scorecard “merge pending” until `/ship` merged; Learn updates gates.

---

## Git hygiene

| Item | Result |
|------|--------|
| Worktree | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/button-sizes-are-inconsistent` — removed |
| Branch | `feature/button-sizes-are-inconsistent` — pruned (merged via squash) |
| Ports | `aidlc-ports.sqlite` rows for `button-sizes-are-inconsistent` removed |
| PR | [#87](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/87) (merged) |

---

## Feature closure

- [x] Validate PASS approved
- [x] PROJECT.md updated
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/button-sizes-are-inconsistent/`
- [x] GitHub issue #86 closed (at merge)
- [x] Worktree + port registry cleaned up
