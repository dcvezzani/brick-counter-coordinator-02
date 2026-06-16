# Validate scorecard — diff-workflows-for-desktop-and-phone

**Feature:** [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90)  
**Product Spec:** [product-spec.md](product-spec.md)  
**PR:** [#91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91) @ `2026347`  
**Validated:** 2026-06-16  
**Environment:** Worktree `http://localhost:18000` (Chrome DevTools MCP) + CI  
**Gate threshold:** 90%  
**Result:** **PASS** — 16 / 16 criteria (100%)

---

## CI / build gate

| Check | Status | Evidence |
|-------|--------|----------|
| GitHub Actions `test` | **PASS** | [run 27652931424](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27652931424) |
| Local `npm test` | **PASS** | 302 tests |
| Local `npm run build` | **PASS** | Vite build green |

---

## Success criteria scorecard

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Coordinator profile on ≥ md runs full import → count → reconcile → organize without regression | **PASS** | MCP @ 1280px: Start demo → import → count → reconcile → organizer lots with Select assign + Demo Worker badge |
| 2 | Phone (`< md`) always uses worker workflow regardless of stored profile | **PASS** | MCP @ 375px Home: session join list, no Coordinator/Worker radio; cold link `/session/session-counting/lot` loads worker nav |
| 3 | ≥ md Home shows Coordinator \| Worker radio (default Coordinator); persists in localStorage | **PASS** | MCP @ 1280px Home shows radio; `useWorkflowProfile.test.js` |
| 4 | All profiles: display name pre-filled, saved on leave Home | **PASS** | `HomeView` integration test; MCP pre-fill `Demo Worker` |
| 5 | Worker profile: session list → join counting session → lot entry | **PASS** | MCP @ 375px cold link + `workflow-profile.test.js` counting join |
| 6 | Worker nav: Lot, Lots, Cups, Home (counting); My list replaces Lots (organizing) | **PASS** | MCP worker join organizing → nav Home · Lot · My list; `SessionNav.test.js`, `storyboard-session.test.js` |
| 7 | Worker SessionProgress: Count → Organize → Done only | **PASS** | MCP my-list view shows Count + Organize steps only; `SessionProgress.test.js`, `session-progress-model.test.js` |
| 8 | List lots / cups: worker shell variant on worker profile or `< md` | **PASS** | `session-shell.test.js`, `ListLotsView.test.js`; `ui-rules.md` profile-aware browse |
| 9 | Organizing: toast + sticky banner on lot entry until My list opened | **PASS** | `LotEntryView.test.js` (banner + toast + nav); banner hidden after My list (acknowledged) per spec |
| 10 | `/session/:id/my-list` assigned list; coordinator Select + Unassigned; auto-assign; Badge | **PASS** | MCP organizer Select + badge; MCP my-list assignee badge; `ListLotsView.test.js`, `storyboard-session.test.js` |
| 11 | My list ≥50 rows uses virtual/windowed scroll | **PASS** | MCP my-list renders subset of rows; `MyListView.test.js` (55 lines, DOM bounded) |
| 12 | Worker line actions (moved / needs location) on My list | **PASS** | MCP buttons visible; `MyListView.test.js` toggle tests |
| 13 | Waiting states: Alert on MarketingShell + back; no SessionNav | **PASS** | MCP `/session/session-reconciling/wait` — Please wait + Alert + Back; `SessionWaitView.vue` |
| 14 | `application-views.md` + `ui-rules.md` updated | **PASS** | Worker SessionNav table, my-list route, profile/My list sections present |
| 15 | Diagrams + ux-design-notes match behavior | **PASS** | [workflow-diagrams.md](workflow-diagrams.md), [ux-design-notes.md](ux-design-notes.md) aligned with implemented nav/guards/routes |
| 16 | `npm test` / `npm run build` pass | **PASS** | CI + local (see above) |

---

## Post-review advisory fixes (included in validation)

| Advisory | Status | Commit |
|----------|--------|--------|
| `workerOnly` meta enforcement | **Fixed** | `9f01bbc` — unit tests + `workflow-guard.js` |
| Organizing join integration test | **Fixed** | `2026347` — `workflow-profile.test.js` |

---

## Validate verdict

**PASS** — All Product Spec success criteria met. Feature ready for merge and **`/learn`**.

### Handoff

Run **`/learn`** to capture ADRs, retrospective notes, and worktree cleanup after PR merge.
