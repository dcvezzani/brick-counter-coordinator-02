# PROJECT.md — Brick Counter Coordinator

**Last updated:** 2026-06-16  
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
| `src/components/` | SessionNav, SessionLayout, **SessionProgress** (clickable past steps for phase back), **ViewHeader, ViewActions, SessionViewFrame, ResponsiveDataTable, ConfirmDialog, TableLoadingSkeleton, FilterablePicker, PartSearchCombobox, SetSearchCombobox, ColorPicker, LotEntryForm, SteppedSwipeNumberInput** |
| `src/components/ui/` | shadcn-vue components (CLI adds here) — includes **sonner, alert-dialog, alert, skeleton** |
| `src/fixtures/` | Storyboard demo session seed data, **`storyboard-sets.js`** (set picker catalog) |
| `src/lib/` | `utils.js`, `storyboard-session.js` (**`goBackToPhase`**, **`isProgressStepClickable`**, **`sessionNavModel`**, **`landingRouteLocation`**, **`ensureStoryboardFixtures`**), **`workflow-guard.js`**, **`workflow-profile-state.js`**, **`session-progress-model.js`**, **`feedback.js`** (toast helpers), **`completion-celebration.js`**, **`part-catalog.js`**, **`set-catalog.js`**, **`filterable-picker.js`**, **`lot-entry-defaults.js`**, **`bricklink-colors.js`**, **`lot-display.js`**, **`numeric-field.js`**, **`numeric-field-ui.js`**, **`stepped-swipe-number-input.js`**, **`primary-action-button-ui.js`**, **`session-shell.js`** |
| `src/composables/` | **`usePhaseNavigation.js`** — strip back + confirm copy; **`useNumericField.js`** — swipe qty inputs; **`useWorkflowProfile.js`**, **`useDisplayName.js`** — profile + display name |
| `src/main.js` | App bootstrap — **must** import `vue-sonner/style.css` for floating toasts |
| `tests/unit/` | Vitest unit tests mirroring `src/` layout (`*.test.js`) |
| `tests/integration/` | Route-flow and cross-module Vitest scenarios (e.g. **`workflow-profile.test.js`**) |
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

Tabular session views use bordered HTML tables on laptop and card lists on phone (import, lots browse, organizer pick lists, reconciliation resolve). Lot entry counting UX superseded by [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot-entry-cockpit (shipped 2026-06-15).

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

### Feature 9 — toast-look-and-feel *(quick fix — no issue)*

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-14, Learn 2026-06-14) |
| **Merged** | `main` @ `87ae980` |

Polished global toast **presentation**: import `vue-sonner/style.css` (fixes inline rendering), **top-right** fixed overlay with close button and safe-area offsets, shared bordered popover card with colored type icons. No message/duration changes — export stub and celebration toasts use the same `feedback.js` API.

**Key decisions:** Supersedes #9 bottom-right default; documented in [docs/ui-rules.md](docs/ui-rules.md) and [ADR-0003](adr/0003-ui-feedback-layer.md) follow-ups.

**Artifacts:** `feature/00-shipped/toast-look-and-feel/` (product-spec, validate-scorecard, ship-report, learn-notes, UI screenshots)

**Demo:** Jump to **Updating inventory** → **Export XML** → toast floats top-right.

### Feature 10 — lot-entry-cockpit ([issue #10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-15, Learn 2026-06-15) |
| **Merged** | [PR #68](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/68) → `main` @ `ac14d67` (+ child PRs #69–#78) |

Mobile-first **counting cockpit** on `/session/:sessionId/lot`: four-field form (part id, color id, condition, qty) with searchable pickers, **SteppedSwipeNumberInput** (swipe/hold/typed qty), save/merge duplicate confirm, success toast, and save-and-add-another. List lots browse shows Part/Color/Condition/Qty. Ten parallel child features (waves A–E) via git worktrees.

**Note:** Qty control upgraded by [#83](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/83) — superseded initial `+`/`−` stepper shipped with this epic.

**Key decisions:** [ADR-0004](adr/0004-lot-identity-and-counting-model.md) — lot identity triple + `saveLot` merge semantics; picker stack ported from sibling `brick-counter-coordinator`; Enter-only keyboard in `FilterablePicker` (sibling parity).

**Child issues:** [#58](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/58)–[#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67) (all closed).

**Artifacts:** `feature/00-shipped/lot-entry-cockpit/` (product-spec, child specs/tech-specs, validate-scorecard, ship-report, review-report, learn-notes)

**Demo:** `npm run dev` → Start demo session → Confirm import → **Lot** — search part, pick color, swipe or type qty, Save.

### Feature 13 — new-counter-input-control ([issue #83](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/83))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-16, Learn 2026-06-16) |
| **Merged** | [PR #85](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/85) → `main` @ `2ab9e84` |

Replaced lot entry `+`/`−` quantity stepper with sibling **`SteppedSwipeNumberInput`** — horizontal ±1 with hold-repeat, vertical ±10, typed entry, keyboard nudging. Preserves min qty 1, save/duplicate/toast behavior, and color ↔ qty tab chain.

**Key decisions:** Port-as-is from [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator); global `matchMedia` stub in `tests/setup.js`; `test-id="lot-entry-qty"`.

**Artifacts:** `feature/00-shipped/new-counter-input-control/` (product-spec, tech-spec, validate-scorecard, ship-report, learn-notes)

**Demo:** Count phase → **Lot** — drag swipe handle or type qty in the quantity field.

---

### Feature 11 — compare-part-out-list-from-list-lots ([issue #79](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/79))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-15, Learn 2026-06-15) |
| **Merged** | [PR #81](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/81) → `main` @ `9037293` |

Adds sticky **Compare with Part-Out List** to **List lots browse** during Count — same phase gate and reconciliation landing as Lot entry. Workers reviewing lots on `/session/:sessionId/lots` can advance to Reconcile without returning to Lot entry.

**Key decisions:** Reused inline `compareWithPartOut` pattern from `LotEntryView`; no new composable; organizer mode unchanged.

**Artifacts:** `feature/00-shipped/compare-part-out-list-from-list-lots/` (product-spec, review-report, validate-scorecard, ship-report, learn-notes)

**Demo:** Count phase → **Lots** nav → **Compare with Part-Out List** → Reconciliation.

### Feature 12 — go-back-to-previous-state-02 ([issue #80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-15, Learn 2026-06-16) |
| **Merged** | [PR #82](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/82) → `main` @ `637fdf5` |

Replaces per-view **Back to …** buttons with clickable **past** steps on the session progress strip. Reuses #53 `goBackToPhase` / multi-step confirm; **SessionNav** is route-only again.

**Key decisions:** [ADR-0005](adr/0005-progress-strip-backward-navigation.md) — strip-only backward affordance; current step badge not clickable; `AlertDialogContent` pointer-events for confirm on mobile.

**Artifacts:** `feature/00-shipped/go-back-to-previous-state-02/` (product-spec, tech-spec, validate-scorecard, review-report, ship-report, learn-notes)

**Demo:** Advance to Export → click **Count** on strip → confirm → lot entry in Count phase.

### Feature 14 — button-sizes-are-inconsistent ([issue #86](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/86))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-16, Learn 2026-06-16) |
| **Merged** | [PR #87](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/87) → `main` @ `832f8ed` |

Aligns primary action button heights on Home, New session, Part-out import, and Organizer **Declare ready to import** with the existing `min-h-11 md:min-h-9` standard via `PRIMARY_ACTION_BUTTON_CLASS` and `ViewActions` slot sizing.

**Key decisions:** Reuse ConfirmDialog / Reconciliation touch-target pattern — no new `Button` size variant; marketing shells import the constant explicitly; phase gates inherit heights from `ViewActions`.

**Artifacts:** `feature/00-shipped/button-sizes-are-inconsistent/` (product-spec, tech-spec, validate-scorecard, ship-report, learn-notes)

**Demo:** Home → Start demo → Create session → Confirm import — primary CTAs share the same tap height on phone and laptop.

### Feature 15 — new-session-use-filterable-picker ([issue #88](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/88))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-16, Learn 2026-06-16) |
| **Merged** | [PR #89](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/89) → `main` @ `a886ce9` |

New session uses **SetSearchCombobox** (FilterablePicker + fixture **set-catalog**) instead of a plain set-number input: search by number or name, resolved set label, BrickLink-style normalization (`10281` → `10281-1`). Post-merge layout fix removed redundant `Card` so the picker dropdown is not clipped.

**Key decisions:** Mirror `PartSearchCombobox` adapter pattern; fixture catalog only (no live BrickLink); `ViewFrame` inner frame is the form shell — avoid `Card` around pickers (`overflow-hidden`).

**Artifacts:** `feature/00-shipped/new-session-use-filterable-picker/` (product-spec, tech-spec, validate-scorecard, ship-report, learn-notes)

**Demo:** `/session/new` → search sets → Create session → Part-out import shows selected set number.

### Feature 16 — diff-workflows-for-desktop-and-phone ([issue #90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90))

| Field | Value |
|-------|--------|
| **Status** | **Complete** (Validate PASS 2026-06-16, Learn 2026-06-16) |
| **Merged** | [PR #91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91) → `main` @ `5c54565` |

Splits **coordinator** (full lifecycle on `≥ md`) vs **worker** (phone always worker; optional Worker radio on tablet/laptop): filtered SessionProgress, route guards, Home session list, **`/session/:id/my-list`** with virtual scroll, organize toast/banner, coordinator Select assign on organizer lists.

**Key decisions:** [ADR-0007](adr/0007-workflow-profile-coordinator-vs-worker.md) — effective profile from viewport + `localStorage`; bidirectional `workflowGuard`; `ensureStoryboardFixtures` in `sessionGuard` for cold links.

**Artifacts:** `feature/00-shipped/diff-workflows-for-desktop-and-phone/` (specs, diagrams, validate-scorecard, learn-notes)

**Demo:** Phone @ 375px → join counting session → lot entry; laptop Coordinator → demo through organizer; Worker radio → join organizing → My list.

---

## Conventions

| Topic | Rule |
|-------|------|
| **Client language** | JavaScript only — no TypeScript in Vue SFCs (`components.json` → `"typescript": false`) |
| **Node** | 24.x locally and in CI (`engines` in `package.json`) |
| **UI components** | shadcn-vue CLI → `src/components/ui/`; use `@/` imports |
| **Storyboard state** | `src/lib/storyboard-session.js` + `src/fixtures/` until coordinator Feature |
| **Routes** | Align with [docs/support/application-views.md](docs/support/application-views.md) |
| **UI layout** | Follow [docs/ui-rules.md](docs/ui-rules.md) — shells, ViewHeader, ViewActions, SessionViewFrame, ResponsiveDataTable, ViewFrame, FormField, SessionNav, **SessionProgress strip back**, **workflow profile (coordinator vs worker)**, **My list virtual scroll**, **feedback.js toasts (top-right overlay), ConfirmDialog, completion-celebration.js**, **`PRIMARY_ACTION_BUTTON_CLASS` on marketing primaries** |
| **Backward phase** | Progress strip past steps only — [ADR-0005](adr/0005-progress-strip-backward-navigation.md); SessionNav does not change phase |
| **Workflow profile** | Phone `< md` → worker; `≥ md` → Coordinator \| Worker radio — [ADR-0007](adr/0007-workflow-profile-coordinator-vs-worker.md) |
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
- **UX roadmap (open):** see [feature/ux-roadmap.md](feature/ux-roadmap.md) — role-aware shells (#11) and workflow profiles (#90) **shipped**

---

## For agents

1. Read this file + [docs/tech-stack.md](docs/tech-stack.md) + [docs/ui-rules.md](docs/ui-rules.md) before implementing.
2. Check `feature/<slug>/` for active specs; shipped work is under `feature/00-shipped/`.
3. Check `adr/` for architectural commitments.
4. Use [docs/session-phases-state.mmd](docs/session-phases-state.mmd) + [application-views.md](docs/support/application-views.md) for phase/route/nav rules.
5. Follow AIDLC phase skills: `/plan` → `/design` → `/build` → `/review` → `/ship` → `/learn`.
