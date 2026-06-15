# AIDLC — part-color-catalog

| Field | Value |
|-------|-------|
| **Parent** | [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · [parent product-spec](../product-spec.md) |
| **Child issue** | [#59](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/59) |
| **Product Spec** | [product-spec.md](product-spec.md) · [blob](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-color-catalog/product-spec.md) |
| **Tech Spec** | [tech-spec.md](tech-spec.md) · **Approved for build** |
| **Branch** | `feature/lot-entry-cockpit-part-color-catalog` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/part-color-catalog` |
| **Delivery wave** | A |
| **PR target** | `feature/lot-entry-cockpit` (parent integration branch) — **not** `main` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** | `/plan` — Product Spec in this folder |
| Design | **Approved** | `/design part-color-catalog` — [tech-spec.md](tech-spec.md) |
| Build | **Complete** | PR [#70](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/70) |
| Review | Pending | `/review` |
| Ship | Pending | `/ship` |
| Learn | Pending | `/learn` |

## File ownership (minimize overlap)

- `src/lib/*catalog* (new module — name per tech spec)`
- `src/fixtures/demo-session.js (part-out `colorId` extensions only)`
- `src/lib/bricklink-colors.js or fixture color subset (if not owned by color-picker)`

Coordinate with sibling worktrees if a path above is shared (e.g. `demo-session.js` — touch only the rows documented for this child).

## Rebase note

Wave **B/C/D** work may need rebasing onto merged Wave **A** (and later) child PRs after they land on `feature/lot-entry-cockpit`.

## Open PR

```bash
git push -u origin feature/lot-entry-cockpit-part-color-catalog
gh pr create --base feature/lot-entry-cockpit --title "#10 · part-color-catalog" --body "Child of #10. Closes #59."
```
