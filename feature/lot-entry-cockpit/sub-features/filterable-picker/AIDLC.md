# AIDLC — filterable-picker

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/filterable-picker/product-spec.md) |
| **Tech Spec** | [tech-spec.md](tech-spec.md) · [blob (child branch)](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit-filterable-picker/feature/lot-entry-cockpit/sub-features/filterable-picker/tech-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-filterable-picker` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/filterable-picker` |
| **Delivery wave** | A |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Draft** (pending human approval) | `/design filterable-picker` — [tech-spec.md](tech-spec.md) |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/components/FilterablePicker.vue`
- `src/lib/filterable-picker.js`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Design handoff (post `/design`)

After `tech-spec.md` is drafted:

1. Push child branch: `git push -u origin feature/lot-entry-cockpit-filterable-picker`
2. Update [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58) — add Tech Spec blob link (child branch until PR merges); leave Design unchecked until approved.
3. After PR merges to `feature/lot-entry-cockpit`, update issue Tech Spec link to integration branch.

See [docs/github-issues.md](../../../../docs/github-issues.md) § After `/design`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-filterable-picker
gh pr create --base feature/lot-entry-cockpit --title "#10 · filterable-picker" --body "Child of #10. Closes #58."
```
