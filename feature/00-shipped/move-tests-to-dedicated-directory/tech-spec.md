# Tech Spec — Unit 1: Dedicated `tests/` directory

**AIDLC phase:** Design (one **Unit** per Tech Spec)  
**Grounding:** Implements [product-spec.md](./product-spec.md) (approved 2026-06-13). Aligns with [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md). Supersedes co-located test layout documented in [initial-setup/tech-spec.md](../initial-setup/tech-spec.md) and [storyboard-ui/tech-spec.md](../storyboard-ui/tech-spec.md) for **active** work only.

---

## Overview

| Field | Value |
|-------|-------|
| **Unit / scope** | Relocate all Vitest files from `src/` to `tests/unit/` (mirroring layout), add `tests/integration/` tier with README + router redirect exemplar, update Vitest discovery, CI guard, contributor docs |
| **Feature** | [move-tests-to-dedicated-directory](./) · [GitHub issue #47](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47) |
| **Product Spec** | [product-spec.md](./product-spec.md) — **Approved** |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-14 |
| **Last updated** | 2026-06-14 |
| **Approved** | 2026-06-14 — David Vezzani (Design gate closed) |

## Context

### Summary

Today **13 Vitest files** (42 tests) live beside production code under `src/**/*.{spec,test}.js`. Vitest discovers them via `vite.config.js` → `include: ['src/**/*.{test,spec}.js']`. This Unit **moves** every app test to `tests/unit/**` mirroring `src/` structure, **renames** `*.spec.js` → `*.test.js`, **fixes imports** to use the `@/` alias for production modules, adds an **integration tier** (`tests/integration/`) with contributor README and a router redirect exemplar, **updates** Vitest include paths, adds a **CI guard** that fails if tests reappear under `src/`, and updates **PROJECT.md** key directories. No test framework change; no Playwright; AI-DLC submodule tests remain untouched.

**Pre-migration baseline (2026-06-14):** `npm test` → 13 files, 42 tests, all green.

### Existing system & documentation

| Artifact | Relevance |
|----------|-----------|
| [vite.config.js](../../../vite.config.js) | Vite + Vitest merged config; `@` alias → `./src` |
| [jsconfig.json](../../../jsconfig.json) | IDE path alias `@/*` → `src/*` |
| [.github/workflows/ci.yml](../../../.github/workflows/ci.yml) | PR CI: Node 24, `npm ci`, `npm test`, `npm run build` |
| [PROJECT.md](../../../PROJECT.md) | Key directories table — **update** with `tests/unit`, `tests/integration` |
| [docs/tech-stack.md](../../../docs/tech-stack.md) | Lists Vitest; optional one-line note that tests live under `tests/` (not required for Validate) |
| [feature/00-shipped/initial-setup/tech-spec.md](../initial-setup/tech-spec.md) | Documents co-located `HomeView.spec.js` — **historical**; do not rewrite shipped spec |
| [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md) | JS-only Vue 3 + Vitest stack unchanged |
| `.claude/deps/ai-dlc/**` | Separate Vitest config — **out of scope** per Product Spec |

### Out of scope for this Unit

Per approved Product Spec:

- Tests inside `.claude/deps/ai-dlc` submodule
- Switching off Vitest or `@vue/test-utils`
- Playwright / browser e2e
- Rewriting historical Tech Spec path diagrams in `feature/00-shipped/`
- Rewriting test logic beyond import path fixes required by the move

## Architecture

### High-level design

```
┌─────────────────────────────────────────────────────────────┐
│  Production (ships to users)                                 │
│  src/          — Vue SFCs, router, lib, fixtures (no tests)  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Verification (never deployed)                             │
│  tests/unit/        — mirrors src/; *.test.js only           │
│  tests/integration/ — cross-module / route-flow scenarios    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
  vite.config.js  test.include → tests/**/*.test.js
  npm test        → vitest run (unit + integration)
  CI              → npm test + guard: no tests under src/
```

### Target repository layout (after Build)

```
brick-counter-coordinator-02/
├── src/                          # NO *.test.js / *.spec.js
│   ├── components/
│   ├── views/
│   ├── router/
│   │   └── index.js
│   └── lib/
├── tests/
│   ├── unit/                     # mirrors src/
│   │   ├── components/
│   │   │   ├── ViewActions.test.js
│   │   │   ├── ViewHeader.test.js
│   │   │   ├── SessionNav.test.js
│   │   │   ├── SessionViewFrame.test.js
│   │   │   └── ResponsiveDataTable.test.js
│   │   ├── views/
│   │   │   ├── HomeView.test.js
│   │   │   ├── PartOutImportView.test.js
│   │   │   ├── LotEntryView.test.js
│   │   │   ├── ListLotsView.test.js
│   │   │   ├── ListCupsView.test.js
│   │   │   └── ReconciliationView.test.js
│   │   ├── router/
│   │   │   └── index.test.js
│   │   └── lib/
│   │       └── storyboard-session.test.js
│   └── integration/
│       ├── README.md
│       └── router-closed-session-redirect.test.js
├── vite.config.js                # test.include updated
└── .github/workflows/ci.yml      # + guard step
```

### Migration inventory

| Current path (`src/`) | Target path (`tests/unit/`) |
|-----------------------|----------------------------|
| `components/ViewActions.spec.js` | `components/ViewActions.test.js` |
| `components/ViewHeader.spec.js` | `components/ViewHeader.test.js` |
| `components/SessionNav.spec.js` | `components/SessionNav.test.js` |
| `components/SessionViewFrame.spec.js` | `components/SessionViewFrame.test.js` |
| `components/ResponsiveDataTable.spec.js` | `components/ResponsiveDataTable.test.js` |
| `views/HomeView.spec.js` | `views/HomeView.test.js` |
| `views/PartOutImportView.spec.js` | `views/PartOutImportView.test.js` |
| `views/LotEntryView.spec.js` | `views/LotEntryView.test.js` |
| `views/ListLotsView.spec.js` | `views/ListLotsView.test.js` |
| `views/ListCupsView.spec.js` | `views/ListCupsView.test.js` |
| `views/ReconciliationView.spec.js` | `views/ReconciliationView.test.js` |
| `router/index.spec.js` | `router/index.test.js` |
| `lib/storyboard-session.spec.js` | `lib/storyboard-session.test.js` |

**Delete** all 13 source files under `src/` after copy + import fix (git `mv` preferred for history).

### Import path rules (after move)

Tests no longer sit beside SFCs. **Standardize on `@/` imports** for all production modules:

| Was (co-located) | Becomes (dedicated) |
|------------------|---------------------|
| `import Foo from './Foo.vue'` | `import Foo from '@/views/Foo.vue'` or `@/components/Foo.vue` |
| `import { x } from './storyboard-session.js'` | `import { x } from '@/lib/storyboard-session.js'` |
| `import router from '@/router/index.js'` | unchanged |
| `import { x } from '@/lib/storyboard-session.js'` | unchanged |

Use **explicit `.vue` / `.js` extensions** (matches existing repo convention).

Do **not** introduce relative imports from `tests/` into `src/` (e.g. `../../src/...`) — always `@/`.

### Integration points

| System | Contract | Notes |
|--------|----------|-------|
| Vitest | `include: ['tests/**/*.test.js']` | Single runner for both tiers via `npm test` |
| Vite resolve alias | `@` → `./src` | Unchanged; tests import production code through alias |
| GitHub Actions CI | `npm test` + src guard | Guard runs **before** or **after** tests (either order OK) |
| jsconfig | `@/*` → `src/*` | No change required; tests are outside `src/` but alias still resolves |

## Data

No persistent data, schema, or API changes.

## APIs & contracts

No HTTP API. **Tooling contracts:**

### Vitest (`vite.config.js`)

```javascript
test: {
  environment: 'jsdom',
  include: ['tests/**/*.test.js'],
  exclude: ['node_modules', 'dist', '.claude/**'],
},
```

- Drop `src/**/*.{test,spec}.js` from `include`.
- **Only** `.test.js` suffix under `tests/` (no `.spec.js` in new layout).
- Keep `exclude: ['.claude/**']` so submodule tests are not picked up.

### npm scripts (`package.json`)

| Script | Command | Required? |
|--------|---------|-----------|
| `test` | `vitest run` | unchanged — runs all tiers |
| `test:watch` | `vitest` | unchanged |
| `test:unit` | `vitest run tests/unit` | **optional** — add if trivial |
| `test:integration` | `vitest run tests/integration` | **optional** — add if trivial |

### CI guard (`.github/workflows/ci.yml`)

Add a step that fails with a clear message when any test file exists under `src/`:

```yaml
- name: Guard — no tests under src/
  run: |
    if find src -type f \( -name '*.test.js' -o -name '*.spec.js' \) | grep -q .; then
      echo '::error::Test files must live under tests/unit/ or tests/integration/, not src/.'
      find src -type f \( -name '*.test.js' -o -name '*.spec.js' \)
      exit 1
    fi
```

Place after checkout (before or after `npm test` — both valid).

## UI / client

Not applicable — this Unit changes test layout and tooling only. Production Vue components, routes, and fixtures are unchanged.

## Security & privacy

No auth, secrets, or PII changes. CI guard is read-only filesystem check.

## Acceptance criteria (for Review)

Review traces implementation to this spec. Checklist for `/review`:

- [ ] **Zero** `*.test.js` / `*.spec.js` files under `src/` (repo search + CI guard green)
- [ ] All **13** migrated files present under `tests/unit/` with `.test.js` suffix and mirrored paths
- [ ] **No** `.spec.js` files remain anywhere in app test tree (only `.test.js`)
- [ ] `npm test` passes with **≥ 42** tests (baseline) **plus** integration exemplar test(s)
- [ ] `npm run build` still passes (unchanged CI step)
- [ ] `tests/integration/README.md` explains unit vs integration boundaries and how to run tiers
- [ ] `tests/integration/router-closed-session-redirect.test.js` passes and demonstrates closed-session redirect to Home (see Testing approach)
- [ ] `vite.config.js` `test.include` is `tests/**/*.test.js` only
- [ ] CI workflow includes guard step with actionable error message
- [ ] [PROJECT.md](../../../PROJECT.md) key directories lists `tests/unit/` and `tests/integration/`
- [ ] All test imports of production code use `@/` alias (no `../../src/` relative paths)
- [ ] `.claude/deps/ai-dlc` tests still excluded; submodule unchanged

## Testing approach

| Layer | What we prove | Notes |
|-------|----------------|-------|
| **Unit** (`tests/unit/`) | Component, view, lib, and router module behavior in isolation | All **13** migrated files; preserve existing assertions; **42** tests minimum |
| **Integration** (`tests/integration/`) | Multi-module route flow through production router | **One exemplar** + README; runs in same `npm test` |
| **E2E / manual** | N/A | Playwright out of scope |

### Unit tier

- **Mirror rule:** `tests/unit/<path>.test.js` corresponds to `src/<path>` (same folder names; test file replaces `.vue`/`.js` source name).
- **Conventions preserved:** explicit Vitest imports (no `globals: true`), `@vue/test-utils` `mount`, `__resetSessionsForTests()` in `beforeEach` where used today, `data-test` selectors, `vi.spyOn` for router pushes.
- **No logic rewrites:** move, rename, import fixes only unless a test breaks due to path change.

### Integration tier

**`tests/integration/README.md`** (content requirements):

- When to add integration tests (route guards, navigation side effects, App + router together)
- When to keep tests in `tests/unit/` (single component/view, mocked router)
- How to import production router: `import router from '@/router/index.js'`
- How to reset storyboard state: `__resetSessionsForTests()` before scenarios
- Commands: `npm test`, optional `npm run test:integration`

**Exemplar: `tests/integration/router-closed-session-redirect.test.js`**

Proves the **closed-session redirect flow** using the **production router** and storyboard session helpers — the pattern contributors should copy for future route-level tests.

**Minimum scenario (must pass):**

1. `__resetSessionsForTests()` in `beforeEach`
2. `createDemoSession()` then `markSessionComplete('demo')`
3. `await router.push('/session/demo/lot')` (or another closed-session child route)
4. Assert `router.currentRoute.value.name === 'home'`

This mirrors the existing unit test intent in `src/router/index.spec.js` but lives in the integration tier as the **documented exemplar**. The migrated `tests/unit/router/index.test.js` **retains all three** current router tests (including redirect) so baseline coverage is preserved; the exemplar establishes the integration folder pattern without removing unit coverage.

**Optional enhancement (Build may add if low cost):** mount `App.vue` with `router` plugin and assert DOM shows Home content after redirect — not required for Review if router assertions pass.

### Verification commands

```bash
npm test                    # all tiers — must pass
npm run build               # CI parity
find src -name '*.test.js' -o -name '*.spec.js'   # must return empty
find tests/unit -name '*.test.js' | wc -l           # expect 13
```

## Rollout & operations

### Rollout plan

- Single PR to `main`; no feature flags or deployment.
- **Rebase coordination:** if parallel branches add co-located tests under `src/`, rebase and migrate those files before merge.

### Monitoring & observability

N/A — local/CI test layout only.

### Rollback

Revert PR; restores co-located tests under `src/` and previous `vite.config.js` include pattern.

## Risks & open technical questions

| Risk / question | Mitigation or owner |
|-----------------|---------------------|
| Parallel PRs add new `src/**/*.spec.js` | Rebase before merge; CI guard prevents regression after merge |
| Import path misses after move | Run full `npm test`; Review checklist for `@/` usage |
| Vitest fails to resolve `.vue` from tests | `@/` alias already configured in `vite.config.js`; verify one component + one view test |
| Duplicate redirect coverage (unit + integration) | Acceptable for exemplar; unit keeps baseline; integration documents pattern |
| IDE “go to test” from source | No co-location — contributors use mirrored path convention |
| `docs/tech-stack.md` still silent on `tests/` | Optional one-line update in Build; PROJECT.md is required |

### Resolved decisions

| # | Decision | Resolved |
|---|----------|----------|
| 1 | Layout | `tests/unit/` mirrors `src/` (Product Spec) |
| 2 | Suffix | `.test.js` only under `tests/` |
| 3 | Integration exemplar | Router closed-session → Home redirect |
| 4 | CI enforcement | `find src` guard in `.github/workflows/ci.yml` |
| 5 | Vitest config location | Stay merged in `vite.config.js` (ADR-0001 pattern) |
| 6 | Submodule tests | Remain excluded via `.claude/**` |
| 7 | Optional script split | `test:unit` / `test:integration` — add if trivial, not blocking Validate |

## Design review passes (merged findings)

### Architecture

- **Separation of concerns:** production (`src/`) vs verification (`tests/`) is a clean boundary; mirrors common OSS layout without introducing a second test runner.
- **Single Unit:** move + config + CI guard + docs is one atomic PR — no partial migration state.
- **Alias-based imports:** keeps tests decoupled from relative depth; stable when `src/` files move between folders.

### Frontend

- No SFC or router production changes expected.
- `@/` alias and explicit extensions remain the project standard for tests importing Vue SFCs.

### Backend / API

- N/A — no server or API surface.

### Testing

- **Baseline lock:** 42 tests across 13 files must not regress; integration exemplar is additive.
- **Tier semantics:** unit = isolated component/view/lib/router module tests; integration = production router + session state flows (README makes this explicit).
- **Fast CI:** all tests remain in-memory jsdom; no new slow dependencies.
- **Determinism:** keep `__resetSessionsForTests()` in exemplar `beforeEach` — same as existing router tests.

### CI / Docker / deploy

- Existing workflow unchanged except **one guard step**; Node 24, `npm ci`, `submodules: false` preserved.
- No Docker or deploy pipeline in repo.
- Guard message must cite `tests/unit/` and `tests/integration/` so contributors know where to put files.

## Change history

| Date | Author | Changes |
|------|--------|---------|
| 2026-06-14 | AI draft | Initial Tech Spec for Unit 1 |
| 2026-06-14 | David Vezzani | **Approved** — Design gate closed |

## Related documents

- [product-spec.md](./product-spec.md)
- [GitHub issue #47](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47)
- [PROJECT.md](../../../PROJECT.md)
- [vite.config.js](../../../vite.config.js)
- [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md)
- [initial-setup/tech-spec.md](../initial-setup/tech-spec.md) — historical co-located pattern
