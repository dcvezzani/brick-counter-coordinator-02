# PROJECT.md — Brick Counter Coordinator

**Last updated:** 2026-06-12  
**Repo:** [brick-counter-coordinator-02](https://github.com/dcvezzani/brick-counter-coordinator-02)  
**Process:** [docs/AIDLC.md](docs/AIDLC.md) · Issue tracker: [AGENTS.md](AGENTS.md)

---

## What this project is

A **frontend application** for coordinating LEGO brick counting sessions. The coordinator **server** (Node.js, WebSockets) is planned but not built yet. Today the repo is a runnable **Vue 3 + Vite** SPA with **storyboard demo UI** (navigable session lifecycle), AIDLC specs, and CI.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────┐
│  Browser (Vue 3 SPA)                                     │
│  Vite dev / static build                                 │
│  / → session hub · /session/* → storyboard views         │
│  In-memory demo session (fixtures) — no backend yet      │
└─────────────────────────────────────────────────────────┘
         (future: WebSocket coordinator)
```

| Layer | Status | Location |
|-------|--------|----------|
| **Frontend** | Shipped (Units 1–2) | `src/`, `vite.config.js`, `components.json` |
| **Storyboard session** | Shipped (in-memory) | `src/lib/storyboard-session.js`, `src/fixtures/` |
| **Coordinator API** | Planned | Future Feature |
| **CI** | Active | `.github/workflows/ci.yml` (PRs → `main`, Node 24, actions v6) |
| **AIDLC specs** | `feature/<slug>/` | Product + Tech Specs per Feature |
| **ADRs** | `adr/` | Architectural decisions |
| **AI-DLC library** | Submodule | `.claude/deps/ai-dlc` |

### Key directories

| Path | Purpose |
|------|---------|
| `src/views/` | One view per application screen |
| `src/components/` | SessionNav, SessionLayout, storyboard controls |
| `src/components/ui/` | shadcn-vue components (CLI adds here) |
| `src/fixtures/` | Storyboard demo session seed data |
| `src/lib/` | `utils.js`, `storyboard-session.js` |
| `docs/support/application-views.md` | Canonical route map |
| `docs/session-phases-state.mmd` | Session phase ↔ screen diagram |
| `feature/<slug>/` | Specs, review, validate, learn artifacts per Feature |
| `docs/tech-stack.md` | Canonical stack reference |

---

## Implemented features

### Feature 1 — initial-setup ([issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-12) |
| **Merged** | [PR #2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2) → `main` |

Scaffolded the Vue 3 + Vite JavaScript app with shadcn-vue toolchain (Tailwind v4, olive theme), Vue Router, Vitest, GitHub Actions CI, README quick-start, and Chrome DevTools MCP config for AIDLC UI validation.

**Key decisions:** [ADR-0001](adr/0001-frontend-vue-js-shadcn-stack.md)

**Artifacts:** `feature/initial-setup/` (product-spec, tech-spec, review-report, validate-scorecard, learn-notes)

### Feature 2 — storyboard-ui ([issue #3](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/3))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-12) |
| **Merged** | [PR #4](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/4) → `main` |

Delivers MVP **storyboard views** and navigation for the counting session lifecycle: Home session hub → new session → part-out import → lot entry → lots/cups → reconciliation → organizer pick lists → mark complete. Uses fixture data and `storyboard-session.js` (in-memory demo session `demo`); no coordinator server or BrickLink.

**Key decisions:** Session-prefixed routes per [application-views.md](docs/support/application-views.md); shared `ReconciliationView` across reconciling and updating_inventory phases; no Pinia for storyboard state.

**Artifacts:** `feature/storyboard-ui/` (product-spec, tech-spec, review-report, validate-scorecard, ship-report, learn-notes)

**Demo:** `npm run dev` → http://localhost:5173 → **Start demo session**

---

## Conventions

| Topic | Rule |
|-------|------|
| **Client language** | JavaScript only — no TypeScript in Vue SFCs (`components.json` → `"typescript": false`) |
| **Node** | 24.x locally and in CI (`engines` in `package.json`) |
| **UI components** | shadcn-vue CLI → `src/components/ui/`; use `@/` imports |
| **Storyboard state** | `src/lib/storyboard-session.js` + `src/fixtures/` until coordinator Feature |
| **Routes** | Align with [docs/support/application-views.md](docs/support/application-views.md) |
| **Tests** | Vitest; scope to `src/**` only (`exclude: .claude/**`) |
| **Branches** | Feature work on `feature/<slug>`; merge to `main` via PR |
| **Commits** | `./git-commit.sh` via [git-commit skill](.claude/deps/ai-dlc/skills/git-commit/SKILL.md) pattern |
| **UI validation** | Chrome DevTools MCP — `.cursor/mcp.json`; URL in `AGENTS.md` |
| **Specs** | `feature/<slug>/product-spec.md` + `tech-spec.md` per AIDLC |

---

## Local development

```bash
npm install
npm run dev      # http://localhost:5173 — storyboard demo
npm test
npm run build
```

See [README.md](README.md).

---

## What is not built yet

- Coordinator Node.js server and WebSockets
- BrickLink session integration
- `config/app-preferences.json` and product behavior loader
- Playwright e2e (Vitest + MCP/manual UI validation for now)
- Deployment / hosting
- Live session persistence (storyboard is in-memory only)

---

## For agents

1. Read this file + [docs/tech-stack.md](docs/tech-stack.md) before implementing.
2. Check `feature/<slug>/` for active Feature specs.
3. Check `adr/` for architectural commitments.
4. Use [docs/session-phases-state.mmd](docs/session-phases-state.mmd) + [application-views.md](docs/support/application-views.md) for phase/route/nav rules.
5. Follow AIDLC phase skills: `/plan` → `/design` → `/build` → `/review` → `/ship` → `/learn`.
