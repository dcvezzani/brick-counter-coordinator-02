# Review Report — initial-setup

**Feature:** [initial-setup](./) · [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1)  
**PR:** [#2](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/2)  
**Branch:** `docs/feature/00-shipped/initial-setup` → `main`  
**Review date:** 2026-06-12  
**CI:** Green ([run 27443320509](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27443320509))

---

## Summary

| Dimension | Verdict | Blocking | Advisory |
|-----------|---------|----------|----------|
| Tech Spec | **PASS** | 0 | 2 |
| Testing | **PASS** | 0 | 1 |
| DevOps | **PASS** | 0 | 2 |
| Frontend/UX | **PASS with process gap** | 1 | 1 |
| Security | **PASS** | 0 | 0 |

**Overall recommendation:** Approve for merge after human sign-off. One **process** blocking item (Chrome DevTools MCP not configured in repo — UI behavior verified via alternate browser tooling during this review). No implementation blockers against [tech-spec.md](./tech-spec.md).

---

## 1. AIDLC Review — Tech Spec

### Acceptance criteria trace

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Dev server shows `hello` on `/` | Met | `src/views/HomeView.vue`; browser snapshot at `http://localhost:5173/` shows text `hello` |
| `npm run build` succeeds | Met | CI job `test` step |
| `npm test` + hello assertion | Met | `src/views/HomeView.spec.js` |
| JavaScript only (no TS SFCs) | Met | Grep: no `.ts` / `lang="ts"` under `src/` |
| `components.json` typescript false, olive base | Met | `components.json`: `"typescript": false`, `"baseColor": "olive"` |
| `jsconfig.json` `@/*` alias | Met | `jsconfig.json` |
| `src/lib/utils.js` exports `cn()` | Met | `src/lib/utils.js` |
| `src/style.css` Tailwind v4 + theme vars | Met | `@import "tailwindcss"`, shadcn theme blocks |
| README quick-start | Met | `README.md` |
| CI on PR, Node 24, test + build | Met | `.github/workflows/ci.yml` |
| `docs/tech-stack.md` status updated | Met | Status line updated 2026-06-12 |
| Open PR, green CI | Met | PR #2, CI SUCCESS |
| Out of scope items absent | Met | No coordinator, Playwright, `app-preferences.json` |

### Layout vs target tree

All required paths from Tech Spec § Target repository layout are present. Vitest config merged into `vite.config.js` (resolved open question #4).

### Findings

**Advisory**

1. **Style name drift** — Tech Spec § UI/client cites shadcn `new-york`; delivered `components.json` has `"style": "reka-nova"` (shadcn-vue v2 naming). Olive base is correct. `docs/tech-stack.md` was updated to match; consider updating Tech Spec acceptance wording in Learn.
2. **Tech Spec status** — ~~`tech-spec.md` still marked *Draft*~~ **Resolved:** status set to **Approved** (2026-06-12).

**Blocking:** None.

---

## 2. AIDLC Review — Testing

### What is tested

- `HomeView.spec.js` mounts `HomeView` and asserts text contains `hello` — matches Tech Spec § Testing approach.

### CI

- `npm test` and `npm run build` run on every PR to `main`; latest run **SUCCESS**.

### Findings

**Advisory**

1. **Router integration** — No test mounts `App` + router at `/`. Acceptable at this scope (hello proven at view level); add when navigation grows.

**Blocking:** None. Tests are fast, deterministic, and prove the right behavior for Unit 1.

---

## 3. AIDLC Review — DevOps

### Rollout / deploy / monitoring

Per Tech Spec: local-only scaffold, no deployment — correctly omitted.

### CI workflow

- Triggers: `pull_request` → `main`
- Node 24, `npm ci`, `npm test`, `npm run build`
- Submodules disabled in checkout (avoids AI-DLC test pollution)

### Findings

**Advisory**

1. **GitHub Actions Node 20 deprecation** — Workflow emitted runner warning for `actions/checkout@v4` / `actions/setup-node@v4`. Consider `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` or action upgrades when available.
2. **Default branch** — Repo default is still `docs/feature/00-shipped/initial-setup` on GitHub; set to `main` after merge (repo hygiene, not PR code).

**Blocking:** None.

---

## 4. AIDLC Review — Frontend/UX

### Code review

- `HomeView.vue`: semantic `<main>`, literal `<p>hello</p>` — matches Product Spec and UI contract.
- Unknown routes redirect to `/` — `src/router/index.js` catch-all redirect implemented.
- Minimal chrome — correct for Unit 1.

### Interactive UI validation

| Tool | Result |
|------|--------|
| **Chrome DevTools MCP** | **Not configured** in this workspace (no `chrome-devtools` server in `.cursor/mcp.json`) |
| **Supplemental check** | `cursor-ide-browser` navigated to `http://localhost:5173/` — snapshot shows visible text `hello`, title "Brick Counter Coordinator" |

Per AIDLC [INTERACTIVE-UI-VALIDATION.md](../../../../docs/INTERACTIVE-UI-VALIDATION.md), formal UI validation should use Chrome DevTools MCP.

### Findings

**Blocking (process)**

1. **Chrome DevTools MCP not loaded** — Add consumer `.cursor/mcp.json` from AI-DLC template before Validate phase UI criteria. *UI behavior for hello was verified supplementally during this review; implementation itself is correct.*

**Advisory**

1. **Font CSS mismatch** — `components.json` uses `"font": "inter"` and `style.css` imports Inter, but `@theme` references `'Geist Variable'`. Cosmetic only; no impact on hello.

---

## 5. AIDLC Review — Security

Static SPA, no auth, no secrets in repo.

- `.gitignore` excludes `node_modules/`, `dist/`, `.env`, `.env.local` ✓
- CI does not publish artifacts or deploy ✓
- External Google Fonts import in CSS (low risk; note for future CSP if deployed)

**Blocking:** None. **Advisory:** None material.

---

## Human gate

Per AIDLC, a human engineer must sign off before Validate (`/ship`).

- [ ] I have reviewed this report and PR #2 and approve merge to `main`.

**After merge:** Run `/ship initial-setup` (Validate) · configure Chrome DevTools MCP for formal UI scorecard · set default branch to `main` · `/learn` after Validate PASS.
