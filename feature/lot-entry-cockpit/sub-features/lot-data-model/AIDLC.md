# AIDLC — lot-data-model

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) |
| **Product Spec** | [feature/lot-entry-cockpit/sub-features/lot-data-model/product-spec.md](feature/lot-entry-cockpit/sub-features/lot-data-model/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-lot-data-model` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/lot-data-model` |
| **Delivery wave** | A |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | Done | `/plan` — Product Spec in this folder |
| Design | Pending | `/design lot-data-model` |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/fixtures/demo-session.js (lot rows shape, qty)`
- `src/lib/storyboard-session.js`
- `tests touching completion-celebration / lot qty`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-lot-data-model
gh pr create --base feature/lot-entry-cockpit --title "#10 · lot-data-model" --body "Child of #10. Closes #62."
```
