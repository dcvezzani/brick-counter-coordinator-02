# AIDLC — lot-condition-defaults

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-condition-defaults/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-lot-condition-defaults` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/lot-condition-defaults` |
| **Delivery wave** | B |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | Pending | `/design lot-condition-defaults` |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/lib/lot-entry-defaults.js`
- `src/fixtures/demo-session.js (`partOutOptions.condition` seed only)`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-lot-condition-defaults
gh pr create --base feature/lot-entry-cockpit --title "#10 · lot-condition-defaults" --body "Child of #10. Closes #63."
```
