# AIDLC — color-picker

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#61](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/61) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/color-picker/product-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-color-picker` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/color-picker` |
| **Delivery wave** | B |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Approved** | `/design color-picker` — [tech-spec.md](tech-spec.md) |
| Build | **Complete** | PR [#78](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/78) |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/components/ColorPicker.vue`
- `src/lib/bricklink-colors.js (swatch helpers)`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-color-picker
gh pr create --base feature/lot-entry-cockpit --title "#10 · color-picker" --body "Child of #10. Closes #61."
```
