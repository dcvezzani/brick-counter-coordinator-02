# Tech Spec — Unit 1: Frontend scaffold and hello landing

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-12). No existing ADRs in repo; stack choices documented in [docs/tech-stack.md](../../../../docs/tech-stack.md).

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Vue 3 + Vite frontend scaffold, hello landing route, Vitest baseline, GitHub Actions CI, README quick-start |
| **Feature** | [initial-setup](./) · [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | **Approved** |
| **Author** | David Vezzani |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |
| **Approved** | 2026-06-12 — David Vezzani (Design gate; Build in [PR #2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2)) |

## Context

### Summary

Create a **runnable JavaScript Vue 3 application** in this repo using Vite, Tailwind CSS v4, and the shadcn-vue **toolchain** (config + theme tokens + `cn()` helper — no UI primitives required for hello). Wire Vue Router with a single default route that renders the literal text `hello`. Add Vitest with one component test, npm scripts, root README, and a PR CI workflow. Update `docs/tech-stack.md` so its status line matches the delivered scaffold.

This is **frontend-only**; no coordinator server, API, or persistence.

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [docs/tech-stack.md](../../../../docs/tech-stack.md) | Canonical stack and directory layout — **must match after Build** |
| [docs/AIDLC.md](../../../../docs/AIDLC.md) | Process; Build opens PR with green CI |
| [AGENTS.md](../../../../AGENTS.md) | GitHub Issues parent; **UI validation environments** (`http://localhost:5173`) |
| `.cursor/mcp.json` | Chrome DevTools MCP for AIDLC UI validation ([INTERACTIVE-UI-VALIDATION.md](../../.claude/deps/ai-dlc/docs/INTERACTIVE-UI-VALIDATION.md)) |
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
- `.agents/skills/` (optional follow-up)

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
├── .cursor/mcp.json          # chrome-devtools MCP (AIDLC UI validation)
├── .github/workflows/ci.yml
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js            # Vite + Vitest (test block merged here)
├── jsconfig.json
├── components.json           # shadcn-vue config (typescript: false)
├── index.html
├── .gitignore                # node_modules, dist, .env; !.cursor tracked
├── public/favicon.svg
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── style.css             # Tailwind + shadcn-vue theme CSS variables
│   ├── router/
│   │   └── index.js          # / → HomeView; catch-all redirect to /
│   ├── views/
│   │   ├── HomeView.vue      # literal "hello"
│   │   └── HomeView.spec.js
│   ├── lib/
│   │   └── utils.js          # cn() helper
│   └── components/ui/        # .gitkeep — shadcn-vue CLI target
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

Unknown routes: redirect to `/` — implemented via catch-all route in `src/router/index.js`.

### shadcn-vue v2 naming (supersedes draft wording)

The original draft referenced legacy **`new-york`** style naming. **shadcn-vue v2** uses preset style names. Delivered configuration (see `components.json`):

| Field | Delivered value |
|-------|-----------------|
| **style** | `reka-nova` |
| **baseColor** | `olive` |
| **font** | `inter` |
| **typescript** | `false` |
| **iconLibrary** | `lucide` |

Init command: `npx shadcn-vue@latest init -t vite --src-dir` (interactive or `-y -d` with manual `--base-color olive` if CLI defaults differ).

### Typography note

`components.json` sets `"font": "inter"`. `src/style.css` loads Inter from Google Fonts. The shadcn init template may still reference `--font-sans: 'Geist Variable'` in `@theme inline` — cosmetic only; does not affect hello landing behavior. Align in a future polish pass if desired.

## UI / client

### Stack (as delivered)

| Layer | Choice | Config |
|-------|--------|--------|
| Framework | Vue 3 + Vite | JS template, `<script setup>` without `lang="ts"` |
| Router | Vue Router 4 | History mode, base `/`; unknown paths → redirect `/` |
| Styling | Tailwind CSS v4 | `@tailwindcss/vite` plugin |
| Components | shadcn-vue toolchain | `reka-nova` style, `olive` base, `inter` font, `typescript: false` |
| Icons | Lucide | `@lucide/vue` via shadcn-vue init; **not used on hello page** |
| Tests | Vitest + `@vue/test-utils` + `jsdom` | `vite.config.js` `test` block; `include: src/**/*.{test,spec}.js`; `exclude: .claude/**` |
| UI validation | Chrome DevTools MCP | `.cursor/mcp.json`; environments in `AGENTS.md` |

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

Review traces implementation to this spec section-by-section. Status after [review-report.md](./review-report.md) (2026-06-12):

- [x] `npm install && npm run dev` serves `/` with visible text `hello` (unit test + Chrome DevTools MCP / manual).
- [x] `npm run build` completes without errors.
- [x] `npm test` passes; `HomeView.spec.js` asserts `hello` is present.
- [x] Client source files use **JavaScript** only (no `.ts` / `.tsx`, no `lang="ts"` in SFCs).
- [x] `components.json`: `"typescript": false`, `"style": "reka-nova"`, `"baseColor": "olive"`, `"font": "inter"`.
- [x] `jsconfig.json` maps `@/*` → `src/*`.
- [x] `src/lib/utils.js` exports `cn()` helper per shadcn-vue convention.
- [x] `src/style.css` includes Tailwind v4 entry and shadcn-vue theme CSS variables.
- [x] Root `README.md` documents clone, `npm install`, `npm run dev`, `npm test`.
- [x] `.github/workflows/ci.yml` runs on `pull_request` to `main`: Node **24.x**, `npm ci`, `npm test`, `npm run build`; submodule checkout disabled.
- [x] `docs/tech-stack.md` status updated to reflect scaffold is present.
- [x] Open PR references this Tech Spec and issue #1; **CI green** on latest commit ([PR #2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2)).
- [x] No coordinator server, Playwright, or `app-preferences.json` added.
- [x] `.cursor/mcp.json` + `AGENTS.md` UI validation environments configured for `/ship` UI criteria.

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| Unit | `HomeView` renders text matching `/hello/` | `src/views/HomeView.spec.js` — **delivered** |
| Integration | N/A | No API boundaries |
| Router | Optional | **Deferred:** no test mounts `App` + router at `/`; acceptable at Unit 1 scope — add when navigation grows |
| E2E / manual | Dev server shows hello | **Chrome DevTools MCP** per `AGENTS.md` for Validate; Playwright **out of scope** |

Vitest must **not** pick up tests under `.claude/deps/ai-dlc/` — enforced via `exclude: ['.claude/**']` in `vite.config.js`.

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
| Vitest discovers AI-DLC submodule tests | `vite.config.js` `test.exclude` includes `.claude/**` |
| GitHub Actions runner Node 20 deprecation on `actions/checkout` / `setup-node` | Advisory; upgrade actions or set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` when convenient |
| Default branch on GitHub | Set to `main` after PR #2 merge (repo hygiene) |

### Resolved decisions

| # | Decision | Resolved |
|---|----------|----------|
| 1 | Node version | **24.x** in CI and README (2026-06-12) |
| 2 | Dev server port | Vite default **5173** |
| 3 | Unknown routes | **Redirect to `/`** |
| 4 | Vitest config file | **Merged into `vite.config.js`** |
| 5 | shadcn style naming | **`reka-nova`** (shadcn-vue v2), not legacy `new-york` |
| 6 | shadcn base color | **`olive`** |
| 7 | shadcn font | **`inter`** |
| 8 | Design gate | **Approved** 2026-06-12 — David Vezzani |

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

- `.github/workflows/ci.yml` — PRs to `main`, Node 24, `npm ci`, test, build.
- Checkout uses `submodules: false` so CI does not run AI-DLC submodule tests.
- Use `npm ci` with committed `package-lock.json`.
- Cache `~/.npm` in workflow optional, not required for v1.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-12 | AI draft | Initial Tech Spec for Unit 1 |
| 2026-06-12 | David Vezzani | Node version set to **24.x** (CI + README) |
| 2026-06-12 | David Vezzani | Status set to **Approved** (Design gate closed) |

## Retrospective (Learn — 2026-06-12)

Delivered as a single Unit in [PR #2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2). Validate **PASS 100%** ([validate-scorecard.md](./validate-scorecard.md)).

**Easier than expected:** Vite + shadcn-vue init on greenfield repo; CI workflow straightforward; hello criterion trivially testable.

**Harder than expected:** shadcn-vue CLI interactive prompts in agent sessions; Vitest initially picked up AI-DLC submodule tests; GitHub default branch set to feature branch on first push.

**Differs from draft spec:** Style preset is `reka-nova` not `new-york`; `.cursor/mcp.json` added for UI validation; Tech Spec approved retroactively after review.

**Inform future specs:** Link [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md); assume Node 24, JS client, `views/` pattern; defer router integration tests until multi-route Features.

Full notes: [learn-notes.md](./learn-notes.md)

## Related documents

- [product-spec.md](./product-spec.md)
- [docs/tech-stack.md](../../../../docs/tech-stack.md)
- [ADR-0001](../../../../adr/0001-frontend-vue-js-shadcn-stack.md)
- [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1)
