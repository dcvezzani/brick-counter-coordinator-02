# PROJECT.md — Brick Counter Coordinator

**Last updated:** 2026-06-14  
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
| **Frontend** | Shipped (Units 1–3) | `src/`, `vite.config.js`, `components.json` |
| **Storyboard session** | Shipped (in-memory) | `src/lib/storyboard-session.js`, `src/fixtures/` |
| **Coordinator API** | Planned | Future Feature |
| **CI** | Active | `.github/workflows/ci.yml` (PRs → `main`, Node 24, actions v6) |
| **AIDLC specs (active)** | `feature/<slug>/` | In-flight Product + Tech Specs |
| **AIDLC specs (shipped)** | `feature/00-shipped/<slug>/` | Completed features |
| **ADRs** | `adr/` | Architectural decisions |
| **AI-DLC library** | Submodule | `.claude/deps/ai-dlc` |

### Key directories

| Path | Purpose |
|------|---------|
| `src/views/` | One view per application screen |
| `src/components/` | SessionNav, SessionLayout, SessionProgress, **ViewHeader, ViewActions, SessionViewFrame, ResponsiveDataTable, ConfirmDialog, TableLoadingSkeleton** |
| `src/components/ui/` | shadcn-vue components (CLI adds here) — includes **sonner, alert-dialog, alert, skeleton** |
| `src/fixtures/` | Storyboard demo session seed data |
| `src/lib/` | `utils.js`, `storyboard-session.js`, **`feedback.js`** (toast helpers), **`completion-celebration.js`** (one-shot session-complete toast) |
| `docs/ui-rules.md` | Layout shells, shared chrome, responsive patterns |
| `docs/support/application-views.md` | Canonical route map |
| `docs/session-phases-state.mmd` | Session phase ↔ screen diagram |
| `feature/<slug>/` | Active feature specs (in-flight work) |
| `feature/00-shipped/<slug>/` | Shipped feature specs, validate, learn artifacts |
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

**Artifacts:** `feature/00-shipped/initial-setup/` (product-spec, tech-spec, review-report, validate-scorecard, learn-notes)

### Feature 2 — storyboard-ui ([issue #3](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/3))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-12) |
| **Merged** | [PR #4](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/4) → `main` |

Delivers MVP **storyboard views** and navigation for the counting session lifecycle: Home session hub → new session → part-out import → lot entry → lots/cups → reconciliation → organizer pick lists → mark complete. Uses fixture data and `storyboard-session.js` (in-memory demo session `demo`); no coordinator server or BrickLink.

**Key decisions:** Session-prefixed routes per [application-views.md](docs/support/application-views.md); shared `ReconciliationView` across reconciling and updating_inventory phases; no Pinia for storyboard state.

**Artifacts:** `feature/00-shipped/storyboard-ui/` (product-spec, tech-spec, review-report, validate-scorecard, ship-report, learn-notes)

**Demo:** `npm run dev` → http://localhost:5173 → **Start demo session**

### Feature 3 — consolidate-and-clean-ui ([issue #5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-13, Learn 2026-06-14) |
| **Merged** | [PR #52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) → `main` (integrates child PRs #41–#51) |

Consolidated **shared view chrome** across all MVP screens: `ViewHeader`, `ViewActions`, `SessionViewFrame`, `ResponsiveDataTable`, plus canonical [docs/ui-rules.md](docs/ui-rules.md) (three-shell taxonomy). Replaced per-view Card shells and duplicated sticky/responsive markup. Phase/nav rules unchanged.

**Key decisions:** [ADR-0002](adr/0002-shared-session-ui-chrome.md)

**Artifacts:** `feature/00-shipped/consolidate-and-clean-ui/` (product-spec, validate-scorecard, ship-report, learn-notes)

**Known follow-up:** New session route → `ViewHeader` (deferred; Home already migrated).

### Feature 4 — mobile-session-chrome ([issue #6](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/6))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (GitHub closed 2026-06-13) |
| **Merged** | Parallel fix PRs [#12](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/12)–[#22](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/22) → `main` |

Responsive session UX for phones: fixed bottom `SessionNav` below `md`, horizontal nav on laptop, `SessionProgress` strip, sticky phase CTAs via `ViewActions`, import back affordance, safe-area padding, and touch-target policy (no `size="xs"` row actions).

**Artifacts:** [feature/ux-roadmap.md](feature/ux-roadmap.md) (Completed work table) · presentation in [docs/ui-rules.md](docs/ui-rules.md) and [application-views.md](docs/support/application-views.md)

### Feature 5 — responsive-data-views ([issue #7](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/7))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (GitHub closed 2026-06-13) |
| **Merged** | Parallel fix PRs [#23](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/23)–[#29](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/29) → `main`; baseline primitive in [#52](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/52) (`ResponsiveDataTable`) |

Tabular session views use bordered HTML tables on laptop and card lists on phone (import, lots browse, organizer pick lists, reconciliation resolve, lot entry browse). Lot entry counting UX remains storyboard placeholder — see [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10).

**Artifacts:** [feature/ux-roadmap.md](feature/ux-roadmap.md) · [docs/ui-rules.md](docs/ui-rules.md) § ResponsiveDataTable

### Feature 6 — session-chapter-clarity ([issue #8](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/8))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (GitHub closed 2026-06-13) |
| **Merged** | Parallel fix PRs [#12](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/12), [#14](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/14) → `main` |

Chapter labels on shared routes: reconciliation badges for reconciling vs export phases, organizer mode title/badge on List lots, Organizer badge on Lots nav when `?mode=organizer`.

**Artifacts:** [feature/ux-roadmap.md](feature/ux-roadmap.md) · [application-views.md](docs/support/application-views.md) § Shared-route chapter labels

### Feature 7 — ui-feedback-primitives ([issue #9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-14, Learn 2026-06-14) |
| **Merged** | [PR #55](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/55) → `main` @ `ed262e4` |

Installed shared **feedback layer**: shadcn `sonner`, `alert-dialog`, `alert`, `skeleton`; global `<Toaster />`; `src/lib/feedback.js` toast helpers; `ConfirmDialog` wrapper; `TableLoadingSkeleton` reference. Migrated Reconciliation export stub from inline text to info toast. Published feedback rules in [docs/ui-rules.md](docs/ui-rules.md). Unblocks [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54) acknowledge-mission-complete.

**Key decisions:** [ADR-0003](adr/0003-ui-feedback-layer.md)

**Artifacts:** `feature/00-shipped/ui-feedback-primitives/` (product-spec, tech-spec, validate-scorecard, ship-report, review-report, learn-notes)

### Feature 8 — acknowledge-mission-complete ([issue #54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-14, Learn 2026-06-14) |
| **Merged** | [PR #56](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/56) → `main` @ `b09310a` |

First **#9 feedback consumer**: gates **Mark session complete** on Reconciliation export chapter with `ConfirmDialog` (locked copy); on confirm closes session and shows a **one-shot celebration toast** on Home with set number, lot count, piece count, and avg part-out value. Uses `completion-celebration.js` for summary + staging; `showSuccessToast` from `feedback.js`.

**Key decisions:** One-shot module flag (not router state); `avgPartOutValueUsd` fixture stub; consumes #9 primitives — no duplicate shadcn CLI. Aligns with [ADR-0003](adr/0003-ui-feedback-layer.md).

**Artifacts:** `feature/00-shipped/acknowledge-mission-complete/` (product-spec, tech-spec, review-report, validate-scorecard, ship-report, learn-notes)

**Demo:** Jump to **Updating inventory** on Home → Reconciliation → **Mark session complete** → confirm → celebration toast on Home.

---

## Conventions

| Topic | Rule |
|-------|------|
| **Client language** | JavaScript only — no TypeScript in Vue SFCs (`components.json` → `"typescript": false`) |
| **Node** | 24.x locally and in CI (`engines` in `package.json`) |
| **UI components** | shadcn-vue CLI → `src/components/ui/`; use `@/` imports |
| **Storyboard state** | `src/lib/storyboard-session.js` + `src/fixtures/` until coordinator Feature |
| **Routes** | Align with [docs/support/application-views.md](docs/support/application-views.md) |
| **UI layout** | Follow [docs/ui-rules.md](docs/ui-rules.md) — shells, ViewHeader, ViewActions, SessionViewFrame, ResponsiveDataTable, ViewFrame, FormField, SessionNav, **feedback.js toasts, ConfirmDialog, completion-celebration.js** |
| **Tests** | Vitest; scope to `src/**` only (`exclude: .claude/**`) |
| **Branches** | Feature work on `feature/<slug>`; merge to `main` via PR |
| **Commits** | `./git-commit.sh` via [git-commit skill](.claude/deps/ai-dlc/skills/git-commit/SKILL.md) pattern |
| **UI validation** | Chrome DevTools MCP — `.cursor/mcp.json`; URL in `AGENTS.md` |
| **Specs** | Active: `feature/<slug>/` · Shipped: `feature/00-shipped/<slug>/` |

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
- **UX roadmap (open):** [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot entry cockpit · [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) role-aware shells · [#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) go back to previous state — see [feature/ux-roadmap.md](feature/ux-roadmap.md)

---

## For agents

1. Read this file + [docs/tech-stack.md](docs/tech-stack.md) + [docs/ui-rules.md](docs/ui-rules.md) before implementing.
2. Check `feature/<slug>/` for active specs; shipped work is under `feature/00-shipped/`.
3. Check `adr/` for architectural commitments.
4. Use [docs/session-phases-state.mmd](docs/session-phases-state.mmd) + [application-views.md](docs/support/application-views.md) for phase/route/nav rules.
5. Follow AIDLC phase skills: `/plan` → `/design` → `/build` → `/review` → `/ship` → `/learn`.
