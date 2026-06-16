# Learn notes — Different workflows for desktop and phone

**Feature:** [diff-workflows-for-desktop-and-phone](./) · [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90) (closed)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (16/16, 2026-06-16)  
**Learn date:** 2026-06-16  
**Merged:** [PR #91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91) → `main` @ `5c54565`

---

## Documentation captured

| Artifact | Path |
|----------|------|
| ADR | [ADR-0007](../../../adr/0007-workflow-profile-coordinator-vs-worker.md) — workflow profile, guards, My list route |
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 16 |
| UI / routes | [docs/ui-rules.md](../../../docs/ui-rules.md), [application-views.md](../../../docs/support/application-views.md) — worker nav, My list, profile shells |
| Specs | [product-spec.md](./product-spec.md), [tech-spec.md](./tech-spec.md), [ux-design-notes.md](./ux-design-notes.md) |
| Diagrams | [workflow-diagrams.md](./workflow-diagrams.md), `*.mmd` |
| Validate / review | [validate-scorecard.md](./validate-scorecard.md), [ship-report.md](./ship-report.md), [review-report.md](./review-report.md) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Build waves U1–U5 sequential | U2/U3 parallel with rebase | Faster delivery; no merge conflicts |
| `workerOnly` meta documentation-only | **Enforced** in `workflowGuard` post-review | Review advisory gameplan (`9f01bbc`) |
| Organizing join E2E deferred to Validate | **Integration test** added (`2026347`) | Same advisory closeout |
| `ensureStoryboardFixtures` on Home only | **`sessionGuard` bootstrap** | Review blocking fix — cold deep links |
| Coordinator can open My list | Redirect to phase landing | Post-ship advisory hygiene |

---

## Patterns to reuse

- **Effective profile:** `useWorkflowProfile()` in views; `getEffectiveProfile()` in router `beforeEach` only (synced via `workflow-profile-state.js`).
- **Bidirectional guards:** `workflow-guard.js` — workers off coordinator routes; coordinators off `meta.workerOnly` routes.
- **Worker organizing landing:** `landingRouteLocation(..., { effectiveProfile: 'worker' })` → `session-my-list`; coordinator → `?mode=organizer`.
- **My list scale:** `useVirtualList` with fixed row height + 50-line fixture — not `ResponsiveDataTable`.
- **Organize prompt:** toast (`showActionToast`) + `OrganizePromptBanner`; `acknowledgeOrganizePrompt` on My list mount.
- **MCP / Validate:** in-memory sessions lost on **full page reload** — use SPA navigation or seed via Home/demo flow in same tab.
- **Worktree dev:** `.aidlc/dev.env` port **18000** for this slug.

---

## Process friction

1. **Review pass 2** needed after fixture bootstrap fix — expected; `/build` triage loop worked.
2. **Sub-agent parallel U2/U3** — clean rebase; document file ownership in Tech Spec helped.
3. **Validate vs Learn** — scorecard committed on feature branch before merge; squash PR included artifacts on `main`.

---

## Git hygiene

| Item | Result |
|------|--------|
| Worktree | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/diff-workflows-for-desktop-and-phone` — removed |
| Branch | `feature/diff-workflows-for-desktop-and-phone` — deleted locally (`-D`; squash merge on PR #91) |
| Ports | `aidlc-ports.sqlite` rows for `diff-workflows-for-desktop-and-phone` removed |
| PR | [#91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91) (merged 2026-06-16) |

---

## Feature closure

- [x] Validate PASS approved
- [x] ADR-0007
- [x] PROJECT.md updated
- [x] Learn notes (this file)
- [x] Tech Spec retrospective appended
- [x] Archived to `feature/00-shipped/diff-workflows-for-desktop-and-phone/`
- [x] GitHub issue #90 closed (at merge)
- [x] Worktree + port registry cleaned up
