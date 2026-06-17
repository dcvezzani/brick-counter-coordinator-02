# AIDLC — load-part-out-import

| Field | Value |
|-------|-------|
| **Work item** | *(pending — create after Product Spec approval)* |
| **Product Spec** | [product-spec.md](./product-spec.md) — Approved |
| **Tech Spec** | [tech-spec.md](./tech-spec.md) |
| **Branch** | `feature/load-part-out-import` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/load-part-out-import` |
| **PR target** | `main` |
| **App port** | *(filled by `git-worktree-port-registry`)* |
| **API port** | *(filled by `git-worktree-port-registry`)* |
| **Debug port** | *(filled by `git-worktree-port-registry`)* |
| **Dev env file** | `.aidlc/dev.env` |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** 2026-06-16 | `/plan load-part-out-import` |
| Design | In progress | `/design load-part-out-import` |
| Build | | `/build load-part-out-import` |
| Review | | `/review load-part-out-import` |
| Ship | | `/ship load-part-out-import` |
| Learn | | `/learn load-part-out-import` |

## File ownership

- `src/views/PartOutImportView.vue`
- `src/views/NewSessionView.vue` (session create + auth gate)
- `src/components/BrickLinkAuthDialog.vue` (or equivalent — authentication dialog)
- `src/lib/bricklink-auth.js` (cookie storage / validity — name per Tech Spec)
- `src/lib/storyboard-session.js` (session seed / part-out load)
- `src/lib/part-out-client.js` (API client)
- `server/` — minimal Node.js API (BrickLink `invSetEdit.asp` proxy + HTML→JSON transform)
- `feature/load-part-out-import/bricklink-part-out-reference.md` — part-out service contract
- `feature/load-part-out-import/invSetEdit.asp.request.md` — curl + POST field reference
- `feature/load-part-out-import/invSetEdit.asp.html` — full HTML fixture (set 10281-1)
- `feature/load-part-out-import/invSetEdit.asp.html.md` — single-row HTML fragment
- `src/composables/useBrickLinkAuth.js`
- `src/App.vue` (or shell — mount global auth dialog)
- `server/index.js`, `server/lib/*`
- `vite.config.js` (dev proxy)
- `package.json` (dev:api scripts)
- `tests/unit/server/*`, `tests/integration/part-out-api.test.js`

## Notes

First live BrickLink integration slice — **cookie-based session scraping** via `invSetEdit.asp` (no official API). Reference captures in this folder. Depends on set number from **new-session-use-filterable-picker** (shipped). Downstream consumers: `part-catalog.js`, reconciliation compare, lot entry pickers.
