# PROJECT.md — Brick Counter Coordinator

**Last updated:** 2026-06-12  
**Repo:** [brick-counter-coordinator-02](https://github.com/dcvezzani/brick-counter-coordinator-02)  
**Process:** [docs/AIDLC.md](docs/AIDLC.md) · Issue tracker: [AGENTS.md](AGENTS.md)

---

## What this project is

A **frontend application** for coordinating LEGO brick counting sessions. The coordinator **server** (Node.js, WebSockets) is planned but not built yet. Today the repo is a runnable **Vue 3 + Vite** SPA with AIDLC specs and CI.

---

## Architecture overview

```
┌─────────────────────────────────────┐
│  Browser (Vue 3 SPA)                │
│  Vite dev / static build            │
│  Route / → HomeView ("hello")       │
└─────────────────────────────────────┘
         (future: WebSocket coordinator)
```

| Layer | Status | Location |
|-------|--------|----------|
| **Frontend** | Shipped (Unit 1) | `src/`, `vite.config.js`, `components.json` |
| **Coordinator API** | Planned | Future Feature |
| **CI** | Active | `.github/workflows/ci.yml` (PRs → `main`, Node 24) |
| **AIDLC specs** | `feature/<slug>/` | Product + Tech Specs per Feature |
| **ADRs** | `adr/` | Architectural decisions |
| **AI-DLC library** | Submodule | `.claude/deps/ai-dlc` |

### Key directories

| Path | Purpose |
|------|---------|
| `src/views/` | One view per application screen |
| `src/components/ui/` | shadcn-vue components (CLI adds here) |
| `src/lib/utils.js` | `cn()` helper for shadcn-vue |
| `feature/initial-setup/` | Specs, review, validate, learn artifacts for Feature 1 |
| `docs/tech-stack.md` | Canonical stack reference |

---

## Implemented features

### Feature 1 — initial-setup ([issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-12) |
| **Merged** | [PR #2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2) → `main` |

Scaffolded the Vue 3 + Vite JavaScript app with shadcn-vue toolchain (Tailwind v4, olive theme), Vue Router, Vitest, GitHub Actions CI, README quick-start, and Chrome DevTools MCP config for AIDLC UI validation. Default route renders literal **hello**.

**Key decisions:** [ADR-0001](adr/0001-frontend-vue-js-shadcn-stack.md)

**Artifacts:** `feature/initial-setup/` (product-spec, tech-spec, review-report, validate-scorecard, learn-notes)

---

## Conventions

| Topic | Rule |
|-------|------|
| **Client language** | JavaScript only — no TypeScript in Vue SFCs (`components.json` → `"typescript": false`) |
| **Node** | 24.x locally and in CI (`engines` in `package.json`) |
| **UI components** | shadcn-vue CLI → `src/components/ui/`; use `@/` imports |
| **Tests** | Vitest; scope to `src/**` only (`exclude: .claude/**`) |
| **Branches** | Feature work on `feature/<slug>`; merge to `main` via PR |
| **Commits** | `./git-commit.sh` via [git-commit skill](.claude/deps/ai-dlc/skills/git-commit/SKILL.md) pattern |
| **UI validation** | Chrome DevTools MCP — `.cursor/mcp.json`; URL in `AGENTS.md` |
| **Specs** | `feature/<slug>/product-spec.md` + `tech-spec.md` per AIDLC |

---

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
```

See [README.md](README.md).

---

## What is not built yet

- Coordinator Node.js server and WebSockets
- BrickLink session integration
- Storyboard views / `application-views.md` route map
- `config/app-preferences.json` and product behavior loader
- Playwright e2e (Vitest + MCP UI validation for now)
- Deployment / hosting

---

## For agents

1. Read this file + [docs/tech-stack.md](docs/tech-stack.md) before implementing.
2. Check `feature/<slug>/` for active Feature specs.
3. Check `adr/` for architectural commitments.
4. Follow AIDLC phase skills: `/plan` → `/design` → `/build` → `/review` → `/ship` → `/learn`.
