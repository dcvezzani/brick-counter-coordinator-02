# AIDLC — button-sizes-are-inconsistent

| Field | Value |
|-------|-------|
| **Work item** | [#86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86) |
| **Product Spec** | [product-spec.md](./product-spec.md) |
| **Branch** | `feature/button-sizes-are-inconsistent` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/button-sizes-are-inconsistent` |
| **PR target** | `main` |
| **App port** | `18000` |
| **API port** | `18001` |
| **Debug port** | `18002` |
| **Dev env file** | `.aidlc/dev.env` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** (2026-06-16) | `/plan button-sizes-are-inconsistent` |
| Design | **Approved** (2026-06-16) | `/design button-sizes-are-inconsistent` |
| Build | | `/build button-sizes-are-inconsistent` — runs **`git-worktree-port-registry`** before local dev/tests |
| Review | | `/review button-sizes-are-inconsistent` |
| Ship | | `/ship button-sizes-are-inconsistent` |
| Learn | | `/learn button-sizes-are-inconsistent` — runs **`git-worktree-cleanup`** after merged PR |

## Ports registry

Parallel worktrees share **`../brick-counter-coordinator-02-worktrees/aidlc-ports.sqlite`**. Ports are allocated per slug by **`git-worktree-port-registry`**. Load **`.aidlc/dev.env`** before `npm run dev:aidlc` or integration tests.

## File ownership

Primary paths (to be refined in Tech Spec):

- `src/views/HomeView.vue`
- `src/views/NewSessionView.vue`
- `src/views/PartOutImportView.vue`
- `src/views/ListLotsView.vue`
- `src/components/ViewActions.vue` (if sizing centralized)
- `docs/ui-rules.md`

## Notes

- Product decisions recorded in [product-spec.md](./product-spec.md) (organizer row toggles out of scope; marketing + session CTAs same heights on phone and laptop).
