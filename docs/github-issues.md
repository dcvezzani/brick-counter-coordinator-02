# GitHub Issues — spec links (this repo)

Canonical rules: [.claude/deps/ai-dlc/docs/GITHUB-ISSUE-SPEC-LINKS.md](../.claude/deps/ai-dlc/docs/GITHUB-ISSUE-SPEC-LINKS.md) (AI-DLC submodule).

## Repo defaults

| Field | Value |
|--------|--------|
| **Owner / repo** | `dcvezzani/brick-counter-coordinator-02` |
| **Default blob branch** | `feature/lot-entry-cockpit` while parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) is open; use `main` after merge |
| **Parent integration PR base** | Child PRs target `feature/lot-entry-cockpit`, not `main` |

## Blob URL pattern

```text
https://github.com/dcvezzani/brick-counter-coordinator-02/blob/<branch>/<repo-root-path>
```

Example (child Product Spec on integration branch):

```text
https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/filterable-picker/product-spec.md
```

Example (child Tech Spec on integration branch after consolidation):

```text
https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/filterable-picker/tech-spec.md
```

Before a child PR merges, the Tech Spec may exist only on the **child branch** — use that branch name in the blob URL until the integration branch copy lands.

## Where to use which link style

| Where | Link style |
|-------|------------|
| In-repo markdown (`feature/…`, PR on same branch) | Relative paths, e.g. `[product-spec.md](./filterable-picker/product-spec.md)` |
| GitHub issue or comment body | Full `blob/<branch>/…` URL (see table below) |
| Agent plain-text path | Backticks only: `` `feature/<slug>/product-spec.md` `` |

**Do not** use `(feature/…/product-spec.md)` in issue bodies — GitHub resolves that under `/issues/` and the link breaks.

## Parent Feature (#10)

- Issue: https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10
- Folder: `` `feature/lot-entry-cockpit/` ``
- Product Spec: [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/product-spec.md)

## Child work items (lot-entry-cockpit)

| Slug | Issue | Product Spec (blob) | Tech Spec (blob) |
|------|-------|---------------------|------------------|
| filterable-picker | [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/filterable-picker/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit-filterable-picker/feature/lot-entry-cockpit/sub-features/filterable-picker/tech-spec.md) (approved, child branch) |
| part-color-catalog | [#59](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/59) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-color-catalog/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-color-catalog/tech-spec.md) (draft) |
| part-search-combobox | [#60](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/60) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-search-combobox/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/part-search-combobox/tech-spec.md) (draft) |
| color-picker | [#61](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/61) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/color-picker/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/color-picker/tech-spec.md) (draft) |
| lot-data-model | [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-data-model/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-data-model/tech-spec.md) (draft) |
| lot-condition-defaults | [#63](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/63) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-condition-defaults/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-condition-defaults/tech-spec.md) (draft) |
| lot-entry-form | [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-form/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-form/tech-spec.md) (draft) |
| lot-entry-cockpit-shell | [#65](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-shell/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-shell/tech-spec.md) (draft) |
| migrate-list-lots-browse | [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/migrate-list-lots-browse/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/migrate-list-lots-browse/tech-spec.md) (draft) |
| lot-entry-cockpit-validate | [#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67) | [product-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-validate/product-spec.md) | [tech-spec.md](https://github.com/dcvezzani/brick-counter-coordinator-02/blob/feature/lot-entry-cockpit/feature/lot-entry-cockpit/sub-features/lot-entry-cockpit-validate/tech-spec.md) (draft) |

## After `/design` (child work items)

`/design` writes `tech-spec.md` locally; it does **not** update GitHub issues automatically. From the child worktree:

1. **Push** the child branch so the Tech Spec blob URL resolves.
2. **`gh issue edit`** — add a Tech Spec line under **Feature folder** (use child branch in the blob URL until the PR merges).
3. Leave **Design** unchecked until the human approves the Tech Spec; note *draft on child branch* in the issue body if helpful.
4. After the child PR merges into `feature/lot-entry-cockpit`, update the Tech Spec blob link to the integration branch.

```bash
OWNER=dcvezzani
REPO=brick-counter-coordinator-02
CHILD_BRANCH=feature/lot-entry-cockpit-filterable-picker
ISSUE=58
SLUG=filterable-picker

git push -u origin "$CHILD_BRANCH"

gh issue edit "$ISSUE" --repo "$OWNER/$REPO" --body "$(gh issue view "$ISSUE" --repo "$OWNER/$REPO" --json body -q .body)"
# Edit the body to add:
# - Tech Spec (draft): [tech-spec.md](https://github.com/${OWNER}/${REPO}/blob/${CHILD_BRANCH}/feature/lot-entry-cockpit/sub-features/${SLUG}/tech-spec.md)
```

See each child worktree `AIDLC.md` for issue number, branch, and slug.

## `gh issue create` example

```bash
OWNER=dcvezzani
REPO=brick-counter-coordinator-02
BRANCH=feature/lot-entry-cockpit
SLUG=filterable-picker
PARENT=10

gh issue create --repo "$OWNER/$REPO" \
  --title "#${PARENT} · Filterable picker" \
  --body "$(cat <<EOF
## Summary

Port shared filterable dropdown primitive.

## Parent

Part of [#${PARENT}](https://github.com/${OWNER}/${REPO}/issues/${PARENT}).

## Feature folder

\`feature/lot-entry-cockpit/sub-features/${SLUG}/\`

- Product Spec: [product-spec.md](https://github.com/${OWNER}/${REPO}/blob/${BRANCH}/feature/lot-entry-cockpit/sub-features/${SLUG}/product-spec.md)

## AIDLC phase

- [x] Plan (Product Spec draft)
- [ ] Design (Tech Spec)
- [ ] Build
- [ ] Review
- [ ] Ship / Validate
- [ ] Learn
EOF
)"
```
