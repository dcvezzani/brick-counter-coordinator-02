# Tech Spec — Unit 1: Frontend scaffold and hello landing

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-12). No existing ADRs in repo; stack choices documented in [docs/tech-stack.md](../../docs/tech-stack.md).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Vue 3 + Vite frontend scaffold, hello landing route, Vitest baseline, GitHub Actions CI, README quick-start |
| **Feature** | [initial-setup](./) · [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 (Node 24 decision) |

## Context

### Summary

Create a **runnable JavaScript Vue 3 application** in this repo using Vite, Tailwind CSS v4, and the shadcn-vue **toolchain** (config + theme tokens + `cn()` helper — no UI primitives required for hello). Wire Vue Router with a single default route that renders the literal text `hello`. Add Vitest with one component test, npm scripts, root README, and a PR CI workflow. Update `docs/tech-stack.md` so its status line matches the delivered scaffold.

This is **frontend-only**; no coordinator server, API, or persistence.

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [docs/tech-stack.md](../../docs/tech-stack.md) | Canonical stack and directory layout — **must match after Build** |
| [docs/AIDLC.md](../../docs/AIDLC.md) | Process; Build opens PR with green CI |
| [AGENTS.md](../../AGENTS.md) | GitHub Issues parent for this Feature |
| `.claude/deps/ai-dlc` | AI-DLC submodule (unchanged by this Unit) |
| `adr/` | **Does not exist** — no ADR required for scaffold; consider ADR in Learn if stack becomes org-wide policy |

### Out of scope for this Unit

Per approved Product Spec — do not implement:

- Node coordinator / WebSockets
- BrickLink integration
- Storyboard views, fixtures, `docs/support/application-views.md`
- `config/app-preferences.json`, `src/lib/app-config.js`
- Playwright / e2e suite
- Deployment pipeline
- shadcn-vue components beyond toolchain files (`button`, `card`, etc.)
- `PROJECT.md` (Learn phase)
- `.cursor/mcp.json`, `.agents/skills/` (optional follow-up; not blocking hello)

## Architecture

### High-level design

```
┌─────────────────────────────────────────┐
│  Browser                                 │
│  GET /  →  Vue Router  →  HomeView       │
│            (renders "hello")             │
└─────────────────────────────────────────┘
         ▲
         │  Vite dev server (local)
         │  static build output (CI: build + test only)
```

Single-page Vue app bootstrapped in `src/main.js`, mounted on `#app`. No backend calls.

### Target repository layout (after Build)

```
brick-counter-coordinator-02/
├── .github/workflows/ci.yml
├── README.md
├── package.json
├── vite.config.js
├── vitest.config.js          # optional if merged into vite.config.js
├── jsconfig.json
├── components.json           # shadcn-vue config (typescript: false)
├── index.html
├── .gitignore                # node_modules, dist, .env
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── style.css             # Tailwind + theme CSS variables
│   ├── router/
│   │   └── index.js          # single route: / → HomeView
│   ├── views/
│   │   └── HomeView.vue      # displays literal "hello"
│   ├── lib/
│   │   └── utils.js          # cn() for future shadcn-vue components
│   └── components/ui/        # empty dir or .gitkeep — CLI target path
└── docs/tech-stack.md        # status line updated
```

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| None | N/A | Static client only |

## Data

No persistent data, database, or API payloads in this Unit.

## APIs & contracts

No HTTP API. **UI contract:**

| Route | View | Visible content |
|-------|------|-----------------|
| `/` | `HomeView` | Literal text `hello` (case-sensitive per Product Spec) |

Unknown routes: redirect to `/` or show minimal 404 — **default: redirect to `/`** to keep Validate simple.

## UI / client

### Stack (pinned intent)

| Layer | Choice | Config |
|-------|--------|--------|
| Framework | Vue 3 + Vite | JS template, `<script setup>` without `lang="ts"` |
| Router | Vue Router 4 | History mode, base `/` |
| Styling | Tailwind CSS v4 | `@tailwindcss/vite` plugin |
| Components | shadcn-vue toolchain | `npx shadcn-vue@latest init` with `typescript: false`, style `new-york`, base color `olive` |
| Icons | Lucide | Install `@lucide/vue` as shadcn-vue init dependency; **not used on hello page** |
| Tests | Vitest + `@vue/test-utils` + `jsdom` | Via `vite.config.js` test config |

### HomeView behavior

- Renders the string `hello` in the DOM (plain text node or single element — e.g. `<p>hello</p>`).
- No layout chrome, nav, or shadcn components required.
- Accessible: use a semantic element (`<main>` wrapper optional) so assistive tech can read the text.

### npm scripts (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Local development |
| `build` | `vite build` | Production bundle (CI) |
| `preview` | `vite preview` | Optional local preview of build |
| `test` | `vitest run` | Unit tests (CI) |
| `test:watch` | `vitest` | Local TDD |

### Environment

- **Node.js 24.x** required locally and in CI (`engines` field in `package.json`: `"node": ">=24"` recommended).
- No secrets required for hello.
- Optional `.env.example` with commented `VITE_*` placeholders — **not required** for this Unit.

## Security & privacy

- Static SPA; no auth, cookies, or PII.
- `.gitignore` must exclude `node_modules/`, `dist/`, `.env`, `.env.local`.
- CI does not publish artifacts or deploy.

## Acceptance criteria (for Review)

Review traces implementation to this spec section-by-section.

- [ ] `npm install && npm run dev` serves `/` with visible text `hello` (manual or unit test).
- [ ] `npm run build` completes without errors.
- [ ] `npm test` passes; at least one test asserts `hello` is present when rendering the home route/view.
- [ ] Client source files use **JavaScript** only (no `.ts` / `.tsx`, no `lang="ts"` in SFCs).
- [ ] `components.json` has `"typescript": false`; shadcn-vue init style `new-york`, base `olive`.
- [ ] `jsconfig.json` maps `@/*` → `src/*`.
- [ ] `src/lib/utils.js` exports `cn()` helper per shadcn-vue convention.
- [ ] `src/style.css` includes Tailwind v4 entry and theme CSS variables from shadcn-vue init.
- [ ] Root `README.md` documents clone, `npm install`, `npm run dev`, `npm test`.
- [ ] `.github/workflows/ci.yml` runs on `pull_request`: checkout, Node **24.x**, `npm ci`, `npm test`, `npm run build`.
- [ ] `docs/tech-stack.md` status updated to reflect scaffold is present (remove misleading “in repo” if still wrong before merge).
- [ ] Open PR references this Tech Spec and issue #1; **CI green** on latest commit.
- [ ] No coordinator server, Playwright, or `app-preferences.json` added.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | `HomeView` (or mounted app at `/`) renders text matching `/hello/` | Use `@vue/test-utils` + Vitest; one focused test file e.g. `src/views/HomeView.spec.js` |
| Integration | N/A | No API boundaries |
| E2E / manual | Dev server shows hello | Manual for Validate; Playwright **out of scope** |

**Test principles (AIDLC):** fast, deterministic, one clear assertion per test where practical.

Example test intent (not prescriptive code):

```javascript
// HomeView.spec.js — assert wrapper.text() includes 'hello'
```

CI must run `npm test` (not `npm run test:watch`).

## Rollout & operations

### Rollout plan

- Merge PR to `main`; no deployment or feature flags.
- Consumers run locally via README.

### Monitoring & observability

N/A for local-only scaffold.

### Rollback

Revert the merge commit or PR; no production state to migrate.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| shadcn-vue CLI + Tailwind v4 version drift | Pin major versions in `package.json`; document versions in README or tech-stack |
| shadcn-vue init overwrites Vite files | Run init on fresh Vite scaffold; review diff before commit |
| `docs/tech-stack.md` references files not created yet (MCP, skills, app-preferences) | Update status line only in this Unit; leave forward references as “planned” |
| Node version mismatch local vs CI | Use Node **24.x** in CI via `actions/setup-node` with `node-version: 24`; README documents same |
| Submodule not initialized on clone | README note: `git submodule update --init --recursive` if AI-DLC needed; **not required** to run hello |

### Open for human confirmation (chat)

| # | Question | Proposed default |
|---|----------|------------------|
| 1 | Node version | **24.x** in CI and README *(resolved 2026-06-12 — David)* |
| 2 | Dev server port | Vite default **5173** |
| 3 | Unknown routes | **Redirect to `/`** |
| 4 | `vitest.config.js` separate file | **Merge into `vite.config.js`** unless split improves clarity |

## Design review passes (merged findings)

### Architecture

- Single Unit is correct — no backend dependency; independently testable.
- Empty `src/components/ui/` preserves future shadcn-vue CLI path without pulling components now.

### Frontend

- JS-only SFCs align with Product Spec and `docs/tech-stack.md`.
- Hello in dedicated `HomeView.vue` (not hard-coded only in `App.vue`) establishes `views/` pattern for storyboard work later.

### Backend / API

- N/A — no concerns.

### Testing

- One Vitest spec for hello is sufficient for Test→Review gate at this scope.
- CI `npm run build` catches Vite/Tailwind config regressions.

### CI / deploy

- No existing workflows — add `.github/workflows/ci.yml`.
- Use `npm ci` with committed `package-lock.json`.
- Cache `~/.npm` in workflow optional, not required for v1.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-12 | AI draft | Initial Tech Spec for Unit 1 |
| 2026-06-12 | David Vezzani | Node version set to **24.x** (CI + README) |

## Related documents

- [product-spec.md](./product-spec.md)
- [docs/tech-stack.md](../../docs/tech-stack.md)
- [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1)
