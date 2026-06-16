## Issue tracker (AIDLC)

| Field | Value |
|--------|--------|
| **System** | `github-issues` |
| **Work item for a Feature** | GitHub issue in this repo |
| **Phase signal** | Manual (chat commands `/plan`, `/design`, …) until automation is wired |
| **Parent ↔ feature folder** | Active: `feature/<slug>/` · Shipped: `feature/00-shipped/<slug>/` |
| **Automation entry points** | Manual for now |
| **Notes** | Spec links in GitHub issue bodies use `blob/<branch>/…` per [docs/github-issues.md](docs/github-issues.md) and [GITHUB-ISSUE-SPEC-LINKS.md](.claude/deps/ai-dlc/docs/GITHUB-ISSUE-SPEC-LINKS.md). Default blob branch: `main`. |

## Git worktrees (AIDLC)

| Field | Value |
|--------|--------|
| **Parent directory** | `../brick-counter-coordinator-02-worktrees/` (sibling of repo root) |
| **Path pattern** | `../brick-counter-coordinator-02-worktrees/<slug>` |
| **Branch pattern** | `feature/<slug>` |
| **Port registry** | `../brick-counter-coordinator-02-worktrees/aidlc-ports.sqlite` |
| **Port base** | `18000` |
| **Ports per slug** | `10` |
| **Learn cleanup** | `/learn` or **`git-worktree-cleanup`** — [.claude/deps/ai-dlc/skills/git-worktree-cleanup/SKILL.md](.claude/deps/ai-dlc/skills/git-worktree-cleanup/SKILL.md) |

`git worktree remove` may leave an empty slug folder if dev caches (e.g. `.vite/`) exist; `/learn` should delete the orphan directory when Git no longer lists it.

**`/plan`** creates the worktree + `feature/<slug>/AIDLC.md` when this block is present. **`/build`** reuses that worktree; run **`git-worktree-port-registry`** to allocate ports and write `.aidlc/dev.env`. See [CONSUMER-SETUP.md](.claude/deps/ai-dlc/docs/CONSUMER-SETUP.md) § Git worktrees.

## Port role mapping (AIDLC)

| Role | Consumer env var | Used by |
|------|------------------|---------|
| `app` | `PORT` | `npm run dev`, `npm run dev:aidlc`, UI validation |
| `api` | `API_PORT` | backend / integration tests (reserved) |
| `debug` | `DEBUG_PORT` | Node inspector (reserved) |

**Dev env file:** `.aidlc/dev.env` in the worktree root (gitignored). Load before `npm run dev:aidlc`, `npm test`, or integration tests:

```bash
set -a && [ -f .aidlc/dev.env ] && . ./.aidlc/dev.env; set +a
```

Wired in this repo via `scripts/with-aidlc-env.sh` (`dev:aidlc`) and `scripts/load-aidlc-dev-env.mjs` (Vitest via `vite.config.js`). Integration tests should read `AIDLC_APP_URL` / `AIDLC_APP_PORT` when targeting a running dev server.

## UI validation environments

Procedure: [INTERACTIVE-UI-VALIDATION.md](.claude/deps/ai-dlc/docs/INTERACTIVE-UI-VALIDATION.md)

| Field | Value |
|--------|--------|
| **Local dev URL** | `http://localhost:5173` |
| **Local dev port role** | `app` |
| **Staging / pre-prod URL** | *(none yet)* |
| **Test credential env vars** | *(none — hello page has no login)* |
| **Login flow notes** | N/A for initial-setup |
