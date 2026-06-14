# Learn notes — UI feedback primitives

**Feature:** [ui-feedback-primitives](./) · [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-14)  
**Learn date:** 2026-06-14  
**Merged:** [PR #55](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/55) → `main` @ `ed262e4`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) |
| UI rules — feedback section | [docs/ui-rules.md](../../../docs/ui-rules.md) § Feedback primitives |
| ADR — feedback layer | [adr/0003-ui-feedback-layer.md](../../../adr/0003-ui-feedback-layer.md) |
| ADR-0002 follow-up closed | [adr/0002-shared-session-ui-chrome.md](../../../adr/0002-shared-session-ui-chrome.md) |
| Validate evidence | [ship-report.md](./ship-report.md), [validate-export-toast.png](./validate-export-toast.png) |
| Review mirror | [review-report.md](./review-report.md) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Product spec on disk at Plan | Missing until Design recovered from issue #9 + roadmap | Issue #9 marked Plan complete without committed `product-spec.md` |
| PR scoped to #9 only | PR #55 also carried Design docs for #54 and #47 | Parallel Design session; implementation files correctly scoped to #9 |
| Optional shadcn `Alert` on export banner | Kept hand-rolled `role="status"` div | Correct semantics (`status` vs `alert`); optional refinement deferred |
| ConfirmDialog integration tests with Reka portal | Stubbed alert-dialog in unit tests | jsdom does not render Teleport/portals reliably |
| `review-report.md` on `main` at Review time | Written during Review; Validate added scorecard on branch | Review comments on PR #55; artifacts committed in Learn |

---

## Patterns to reuse

- **Install once, consume everywhere** — shadcn `alert-dialog`, `sonner`, `alert`, `skeleton` via CLI; single `<Toaster />` in `App.vue`.
- **Thin API** — `@/lib/feedback.js` for toasts; views should not import `vue-sonner` directly except through helpers.
- **Controlled confirm** — `ConfirmDialog.vue` with parent-owned `open` ref; never wrap sticky `ViewActions` buttons in `AlertDialogTrigger`.
- **Transient vs persistent** — toast for export stub; inline `role="status"` (or shadcn `Alert`) for chapter context that stays on page.
- **Reference skeleton** — `TableLoadingSkeleton.vue` documents loading pattern until async data exists.
- **Consumer Features** — [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54) imports `ConfirmDialog` + `showSuccessToast`; do not re-run shadcn CLI.

---

## Process friction (feeds AIDLC improvement)

1. **Missing product-spec at Design** — GitHub issue checkbox ≠ committed spec; verify file exists before `/design`.
2. **Multi-feature Design commit** — Keep spec-only PRs separate from implementation PRs when possible.
3. **Validate before Learn artifacts on `main`** — scorecard/ship-report written post-merge; Learn archives to `00-shipped/`.

---

## Follow-up Features (enabled by #9)

| Item | Slug | Notes |
|------|------|-------|
| Session complete confirm + toast | `acknowledge-mission-complete` ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)) | **Shipped** — [learn-notes](../acknowledge-mission-complete/learn-notes.md) |
| Lot entry feedback | `lot-entry-cockpit` ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)) | Toasts + skeleton when async |
| Phase-back confirm | `go-back-to-previous-state` ([#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53)) | Optional `ConfirmDialog` |

---

## Remaining debt (accepted)

| Item | Tracking |
|------|----------|
| Export banner → shadcn `Alert` | Optional polish |
| Mobile toaster offset vs bottom nav | **Resolved** — [toast-look-and-feel](../toast-look-and-feel/learn-notes.md) moved to top-right (2026-06-14) |
| `ConfirmDialog` portal integration test | Optional when #54 wires confirm |

---

## Feature closure

- [x] Validate PASS recorded
- [x] PROJECT.md updated
- [x] ADR-0003 written; ADR-0002 follow-up resolved
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/ui-feedback-primitives/`
- [x] GitHub #9 closed

**Next:** `lot-entry-cockpit` ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)).
