# AIDLC Review — diff-workflows-for-desktop-and-phone

**PR:** [#91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91)  
**Branch:** `feature/diff-workflows-for-desktop-and-phone` @ `0b94fed`  
**Reviewed:** 2026-06-16  
**CI:** `test` pass (297 tests)  
**Local UI:** Chrome DevTools MCP @ `http://localhost:18000` (ports registered: app 18000)

---

## Summary

| Dimension | Verdict | Blocking | Advisory |
|-----------|---------|----------|----------|
| Tech Spec | **PASS with 1 gap** | 1 | 1 |
| Testing | **PASS** | 0 | 2 |
| DevOps | **PASS** | 0 | 0 |
| Frontend/UX | **PASS** | 0 | 1 |
| Security | **PASS** | 0 | 0 |

**Recommendation:** Address the **blocking** fixture bootstrap gap (or reply with rationale if out of scope), then proceed to `/build` triage or `/ship`.

---

## 1. Tech Spec compliance

**Verdict:** PASS with one blocking gap.

### Satisfied (major items)

| Acceptance area | Evidence |
|-----------------|----------|
| Phone → forced worker | `useWorkflowProfile.js` + `useWorkflowProfile.test.js` |
| ≥ md radio + persist | `HomeView.vue`, `localStorage` `bcc.workflowProfile` |
| Display name all profiles | `useDisplayName.js`, `HomeView.vue`, integration test |
| Worker Home session list | `HomeView.vue`, `storyboard-sessions.js` fixtures |
| Coordinator hub | `HomeView.vue` (integration test) |
| Worker guards | `workflow-guard.js`, `SessionWaitView.vue`, router `beforeEach` |
| Worker nav phases | `sessionNavModel()` in `storyboard-session.js`, `SessionNav.test.js` |
| Worker progress subset | `session-progress-model.js`, `SessionProgress.test.js` |
| Profile-aware shells | `session-shell.js`, `LotEntryView.test.js`, `ListLotsView.vue` |
| My list route + virtual scroll | `MyListView.vue`, `MyListView.test.js` (≥50 lines, bounded DOM) |
| Coordinator assign UI | `ListLotsView.vue`, `ListLotsView.test.js` |
| Auto-assign on organizing | `setPhase()` → `autoAssignOrganizerLists()` |
| Organize prompt | `OrganizePromptBanner.vue`, `LotEntryView.test.js`, `feedback.js` |
| Docs | `docs/support/application-views.md`, `docs/ui-rules.md` |

### Blocking

- **`sessionGuard` does not bootstrap fixtures on cold navigation.** `ensureStoryboardFixtures()` is only invoked from `listStoryboardSessions()` (Home). A hard refresh or deep link to `/session/:sessionId/*` before Home loads sees `getSession()` as null and redirects to `/` instead of the session or wait view. Tech Spec U1 documents `ensureStoryboardFixtures()` as seeding demo + storyboard sessions at import — expected at app/router bootstrap, not only via Home.  
  **Fix:** Call `ensureStoryboardFixtures()` in `sessionGuard` (or once in `main.js` / router init).

### Advisory

- **`workerOnly` route meta** on `session-my-list` is documented but not enforced in guards; coordinators can open My list (harmless for storyboard).

---

## 2. Practical testing sufficiency

**Verdict:** PASS.

- **297 tests**, 43 files — CI green.
- Strong unit coverage for profile, guards, nav model, progress model, auto-assign, My list virtual scroll.
- Integration tests cover worker join → lot, reconciling → wait, import guard redirect, display name persistence.
- `tests/setup.js` extended with `matchMedia` stubs per Tech Spec.

### Advisory

- **No test for cold deep-link / refresh** on fixture session routes — would catch the `sessionGuard` / `ensureStoryboardFixtures` gap.
- **Organizing worker journey** relies on component tests (`LotEntryView.test.js`) rather than integration — acceptable for storyboard; MCP partially covered coordinator organizer path.

---

## 3. DevOps

**Verdict:** PASS (N/A for deploy).

- Storyboard-only frontend change; no workflow, container, or infra edits.
- CI `test` job pass on PR.
- Rollback: revert PR; `localStorage` keys harmless (per Tech Spec).

---

## 4. Frontend / UX

**Verdict:** PASS (Chrome DevTools MCP).

**Environment:** Worktree port registry allocated (app **18000**); `npm run dev:aidlc` verified.

### Validated @ 375×812 (phone, worker)

- Home: display name field, **Join a session** list (no coordinator radio — correct phone override).
- Join **Counting session** → lot entry with bottom nav **Home · Lot · Lots · Cups**.
- SessionProgress shows **Count** only.

### Validated @ 1280×800 (coordinator)

- Home: profile radio (Coordinator default), display name pre-fill, **Session hub** + **Start demo session**.
- Full demo flow: import → count → reconcile → organizer.
- Organizer: **Unassigned** / assign Select, **Demo Worker** badge on long list, auto-assign visible.

### Advisory

- Worker **organizing** path (toast + sticky banner, My list nav swap) not re-walked end-to-end in MCP after full page reload (in-memory demo session lost); covered by unit/component tests. Re-test in `/ship` via in-SPA flow after fixture bootstrap fix.

---

## 5. Security

**Verdict:** PASS (storyboard scope).

- No secrets, auth, or backend surface.
- `localStorage` for profile/display name — appropriate for client-only demo.
- Route guards are client-side only (expected); no new dependency or XSS vectors observed.

---

## Handoff

Post review feedback on PR #91. Next: **`/build`** to triage/fix blocking item, or reply on PR if waived.
