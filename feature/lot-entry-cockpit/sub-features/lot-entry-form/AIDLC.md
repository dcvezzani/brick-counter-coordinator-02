# AIDLC — lot-entry-form

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64) |
| **Product Spec** | [feature/lot-entry-cockpit/sub-features/lot-entry-form/product-spec.md](feature/lot-entry-cockpit/sub-features/lot-entry-form/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-lot-entry-form` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/lot-entry-form` |
| **Delivery wave** | C |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | Done | `/plan` — Product Spec in this folder |
| Design | Pending | `/design lot-entry-form` |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/components/LotEntryForm.vue`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-lot-entry-form
gh pr create --base feature/lot-entry-cockpit --title "#10 · lot-entry-form" --body "Child of #10. Closes #64."
```
