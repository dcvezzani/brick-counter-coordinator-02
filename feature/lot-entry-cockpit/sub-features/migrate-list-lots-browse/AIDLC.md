# AIDLC — migrate-list-lots-browse

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/migrate-list-lots-browse/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-migrate-list-lots-browse` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/migrate-list-lots-browse` |
| **Delivery wave** | D |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Approved** | `/design migrate-list-lots-browse` — [tech-spec.md](tech-spec.md) |
| Build | **Complete** (PR open) | `/build` — [#72](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/72) |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/views/ListLotsView.vue`
- `tests/unit/views/ListLotsView.test.js (if present)`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-migrate-list-lots-browse
gh pr create --base feature/lot-entry-cockpit --title "#10 · migrate-list-lots-browse" --body "Child of #10. Closes #66."
```
