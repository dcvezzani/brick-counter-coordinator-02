# AIDLC — lot-entry-cockpit-validate

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-validate/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-lot-entry-cockpit-validate` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/lot-entry-cockpit-validate` |
| **Delivery wave** | E |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Draft** (pending human approval) | `/design lot-entry-cockpit-validate` — [tech-spec.md](tech-spec.md) |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `feature/lot-entry-cockpit/validate-scorecard.md`
- `docs/ui-rules.md (worker counting section)`
- `docs/support/application-views.md (optional one-liner)`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-lot-entry-cockpit-validate
gh pr create --base feature/lot-entry-cockpit --title "#10 · lot-entry-cockpit-validate" --body "Child of #10. Closes #67."
```
