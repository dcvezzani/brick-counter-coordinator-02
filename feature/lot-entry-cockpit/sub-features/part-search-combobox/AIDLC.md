# AIDLC — part-search-combobox

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#60](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/60) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-search-combobox/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-part-search-combobox` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/part-search-combobox` |
| **Delivery wave** | B |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Approved** | `/design part-search-combobox` — [tech-spec.md](tech-spec.md) |
| Build | Pending | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/components/PartSearchCombobox.vue`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-part-search-combobox
gh pr create --base feature/lot-entry-cockpit --title "#10 · part-search-combobox" --body "Child of #10. Closes #60."
```
