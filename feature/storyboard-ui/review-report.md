# Review Report — storyboard-ui

**Feature:** [storyboard-ui](./) · [GitHub issue #3](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/3)  
**PR:** *(none yet — branch `feature/storyboard-ui` not pushed / no open PR)*  
**Branch:** `feature/storyboard-ui` → `main`  
**Review date:** 2026-06-12  
**Commit:** `3e82354` — storyboard-ui /build  
**Local CI:** `npm test` 12/12 pass · `npm run build` success  
**GitHub CI:** Not run (no PR to `main` yet)

---

## Summary

| Dimension | Verdict | Blocking | Advisory |
|-----------|---------|----------|----------|
| Tech Spec | **PASS** | 0 | 2 |
| Testing | **PASS** | 0 | 2 |
| DevOps | **PASS** | 0 | 2 |
| Frontend/UX | **PASS** | 0 | 2 |
| Security | **PASS** | 0 | 0 |

**Overall recommendation:** Approve for merge after **open PR**, **green GitHub CI**, and human sign-off. No implementation blockers against [tech-spec.md](./tech-spec.md).

**PR comments:** Not posted — no open PR. Paste sections below when PR is created, or run `/review storyboard-ui` again after `gh pr create`.

---

## 1. AIDLC Review — Tech Spec

### Acceptance criteria trace

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Full demo path without backend | Met | Browser walkthrough: Home → New session → Import → Lot → Reconcile → Organizer → Complete → Home |
| Eight views with distinct purpose + fixtures | Met | `src/views/*.vue`; fixture data in `src/fixtures/demo-session.js` |
| SessionNav hidden on import | Met | `/session/demo/import` snapshot: no `Session navigation`; `meta.hideSessionNav` on import route |
| Cups hidden in `updating_inventory`; Reconcile visible | Met | Jump to phase → reconciliation nav: Home, Lot, Lots, Reconcile only; `sessionNavModel` + `SessionNav.spec.js` |
| ReconciliationView phase modes | Met | Reconciling: Resolve + Declare organize; updating_inventory: Export XML + Mark complete |
| Organizer lots + return to reconciling preserves state | Met | `returnToReconciling` test in `storyboard-session.spec.js`; UI shows Return button on organizer view |
| Closed session routes → Home | Met | `router/index.spec.js`; Mark complete → `/` in browser |
| Home is session hub (not hello) | Met | `HomeView.vue`; `HomeView.spec.js` |
| JavaScript only | Met | No `.ts` / `lang="ts"` under `src/` |
| `npm test` passes | Met | 12 tests, 4 files |
| `npm run build` succeeds | Met | Local build OK |
| `application-views.md` matches routes | Met | [docs/support/application-views.md](../../docs/support/application-views.md) aligns with `src/router/index.js` |
| Out of scope absent | Met | No coordinator, Playwright, `app-preferences.json` |

### Findings

**Advisory**

1. ~~**`dcv/session-phases-state.mmd` not in repo**~~ **Resolved:** diagram lives at [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd).
2. **`PROJECT.md` not updated** — Deferred to Learn per Product Spec; track in `/learn`.

**Blocking:** None.

---

## 2. AIDLC Review — Testing

### What is tested

| File | Proves |
|------|--------|
| `storyboard-session.spec.js` | Phase transitions, nav model, landing routes, organizer state on return |
| `SessionNav.spec.js` | Cups hidden in `updating_inventory`; shown in counting |
| `HomeView.spec.js` | Session hub content |
| `router/index.spec.js` | Closed-session redirect; active session routes |

### CI

- Workflow unchanged: `.github/workflows/ci.yml` — Node 24, `npm ci`, test, build on PR to `main`.
- **GitHub CI pending** until PR opened.

### Findings

**Advisory**

1. **No view-level unit tests** for `ReconciliationView`, `ListLotsView`, etc. Acceptable for storyboard MVP; behaviors covered by session module tests + manual UI walkthrough.
2. **Open PR for CI gate** — Local test/build green; merge should wait for GitHub Actions on PR.

**Blocking:** None.

---

## 3. AIDLC Review — DevOps

### Rollout / CI

- Static SPA; no deploy pipeline (per Tech Spec).
- Rollback: revert merge commit.

### Findings

**Advisory**

1. **No PR / no remote CI run yet** — Push branch and open PR before merge.
2. **Rolldown build warnings** — `INVALID_ANNOTATION` from `@vueuse/core` (shadcn-vue dependency); build succeeds; monitor if it becomes an error in future Vite/Rolldown versions.

**Blocking:** None.

---

## 4. AIDLC Review — Frontend/UX

### UI validation

**Environment:** `http://localhost:5173` (Vite dev server)  
**Tooling:** Cursor IDE browser MCP (full walkthrough). Project Chrome DevTools MCP exposes snapshot/screenshot only — formal MCP walkthrough partially delegated to IDE browser (same pattern as initial-setup review).

### Walkthrough evidence

| Step | URL / action | Result |
|------|----------------|--------|
| Session hub | `/` | Title, Start demo session |
| New session | `/session/new` → Create | → import |
| Import | `/session/demo/import` | No SessionNav; Confirm CTA |
| Counting | `/session/demo/lot` | Full SessionNav; Compare CTA |
| Reconciling | `/session/demo/reconciliation` | Resolve rows; Declare organize |
| Organizing | `/session/demo/lots?mode=organizer` | Pick list; Moved/Needs location |
| Cups | `/session/demo/cups` | Fixture cups listed |
| Updating inventory | Jump to phase → reconciliation | Export XML, Mark complete; **no Cups** in nav |
| Closed | Mark complete | Home; Resume hidden |

### Findings

**Advisory**

1. **In-memory session lost on full page reload** — Expected for storyboard; remind demo presenters to stay in SPA navigation during walkthroughs.
2. **Chrome DevTools MCP** — Limited tool surface in this repo’s MCP config; IDE browser used for navigation validation. Consider full DevTools MCP for `/ship` Validate evidence.

**Blocking:** None.

---

## 5. AIDLC Review — Security

- Static client; fixture data only; no auth, secrets, or external API calls.
- shadcn-vue adds `@vueuse/core` — standard dependency; no user-controlled HTML injection in views reviewed.

**Blocking:** None.

---

## Human sign-off

- [ ] Reviewer confirms Tech Spec acceptance criteria met
- [ ] PR opened and GitHub CI green
- [ ] Ready for `/ship storyboard-ui` (Validate)

## Related documents

- [product-spec.md](./product-spec.md)
- [tech-spec.md](./tech-spec.md)
- [docs/support/application-views.md](../../docs/support/application-views.md)
- [GitHub issue #3](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/3)
