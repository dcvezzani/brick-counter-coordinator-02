# AIDLC — lot-entry-cockpit-shell

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#65](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-shell/product-spec.md) |
| **Tech Spec** | [tech-spec.md](tech-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit-lot-entry-cockpit-shell/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-shell/tech-spec.md) |
| **Branch** | `feature/lot-entry-cockpit-lot-entry-cockpit-shell` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/lot-entry-cockpit-shell` |
| **Delivery wave** | D |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Approved** | `/design lot-entry-cockpit-shell` — [tech-spec.md](tech-spec.md) |
| Build | **Complete** | `/build` |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/views/LotEntryView.vue`
- `tests/unit/views/LotEntryView.test.js`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-lot-entry-cockpit-shell
gh pr create --base feature/lot-entry-cockpit --title "#10 · lot-entry-cockpit-shell" --body "Child of #10. Closes #65."
```
