# Application views & routes

**Status:** Storyboard MVP — routes unchanged; session chrome updated (Features #5–#8)  
**Last updated:** 2026-06-16  
**Session phases:** [session-phases-state.mmd](../session-phases-state.mmd)  
**Presentation detail:** [ui-rules.md](../ui-rules.md) (shells, responsive nav, sticky CTAs, tables)

Canonical route map for the Vue SPA. Storyboard and production share these paths; storyboard uses fixture data and in-memory session state.

**Scope:** This doc owns **routes**, **phase landing**, **nav visibility**, and **shared-route chapter labels**. Layout shells and responsive presentation live in [ui-rules.md § Shell taxonomy](../ui-rules.md).

## Demo session

| Constant | Value |
|----------|-------|
| Fixed demo session ID | `demo` |
| Created from | Home → **Start demo session** or New session submit |

## Routes

| Route | Route name | View component | Shell | SessionNav | Primary phases |
|-------|------------|----------------|-------|------------|----------------|
| `/` | `home` | `HomeView` | Marketing | — | pre-session, closed |
| `/session/new` | `session-new` | `NewSessionView` | Marketing | — | pre-import |
| `/session/:sessionId/import` | `session-import` | `PartOutImportView` | Import focus | **hidden** | `importing` |
| `/session/:sessionId/lot` | `session-lot` | `LotEntryView` — **counting cockpit** | **Worker** | visible | `counting` (default landing) |
| `/session/:sessionId/lots` | `session-lots` | `ListLotsView` | Coordinator | visible | `counting`, `reconciling`, `organizing` |
| `/session/:sessionId/lots?mode=organizer` | `session-lots-organizer` | `ListLotsView` (organizer mode) | Coordinator | visible | `organizing` (default landing) |
| `/session/:sessionId/cups` | `session-cups` | `ListCupsView` | Coordinator | visible | `counting`–`organizing` |
| `/session/:sessionId/reconciliation` | `session-reconciliation` | `ReconciliationView` | Coordinator | visible | `reconciling`, `updating_inventory` (default landing) |

**Catch-all:** unknown paths → redirect `/`.

**Closed session:** any `/session/:sessionId/*` when phase is `closed` → redirect `/`.

## Phase default landing

When advancing phase (storyboard controls) or resuming demo at a phase, navigate to:

| Phase | Landing route |
|-------|----------------|
| `importing` | `/session/:sessionId/import` |
| `counting` | `/session/:sessionId/lot` |
| `reconciling` | `/session/:sessionId/reconciliation` |
| `organizing` | `/session/:sessionId/lots?mode=organizer` |
| `updating_inventory` | `/session/:sessionId/reconciliation` |
| `closed` | `/` |

## SessionNav items

Shown on session routes except import (nav hidden entirely on import screen).

| Nav label | Target route | Hidden when |
|-----------|--------------|-------------|
| Home | `/` | — |
| Lot | `/session/:sessionId/lot` | phase is `importing` |
| Lots | `/session/:sessionId/lots` | phase is `importing` |
| Reconcile | `/session/:sessionId/reconciliation` | phase is `importing` |
| Cups | `/session/:sessionId/cups` | phase is `importing` or `updating_inventory` |

## Session chrome (presentation)

All `/session/:sessionId/*` routes render inside `SessionLayout` unless noted. **Route targets and hide rules below are unchanged** since `storyboard-ui`; only presentation was updated in Features [#6](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/6)–[#8](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/8).

| Element | Behavior | Detail |
|---------|----------|--------|
| **SessionNav** | Visible on session routes except import | **Laptop (`≥ md`):** horizontal link row under top border. **Phone (`< md`):** fixed bottom bar with icon + label per item. Same items and phase hide rules in both layouts. |
| **SessionProgress** | Always shown when `sessionId` present | Compact stepper: Import → Count → Reconcile → Organize → Export → Done. Highlights current phase. |
| **Import escape** | Import route only | `SessionNav` hidden (`meta.hideSessionNav`). **Back** in `ViewHeader` `#leading` returns to Home — does not advance phase. |
| **Organizer badge** | Lots nav item | When on `/session/:sessionId/lots?mode=organizer`, Lots link shows an **Organizer** badge (nav + page header). |

Breakpoint, safe-area, and touch-target rules: [ui-rules.md § SessionNav](../ui-rules.md), [§ Breakpoint matrix](../ui-rules.md).

## Shared-route chapter labels

Some routes serve more than one workflow chapter. Chapter context is shown in `ViewHeader` (badge) and, for reconciliation export, a status banner — **routes are not duplicated**.

| Route | Condition | Chapter label / cue |
|-------|-----------|---------------------|
| `/session/:sessionId/reconciliation` | phase `reconciling` | Badge: **Step 4: Resolve discrepancies** |
| `/session/:sessionId/reconciliation` | phase `updating_inventory` | Badge: **Step 5: Export to BrickLink**; status banner explains export chapter |
| `/session/:sessionId/lots` | `?mode=organizer` | Title **Organizer — pick lists**; badge **Organizer** |
| `/session/:sessionId/lots` | default (browse) | Badge shows lot count (e.g. **3 lots**); sticky **Compare with Part-Out List** when phase is `counting` |

## Reconciliation view modes

Single component `ReconciliationView`; content varies by phase:

| Phase | Primary story actions |
|-------|------------------------|
| `reconciling` | Compare part-out vs lots; resolve rows; **Declare ready to organize** |
| `updating_inventory` | Export XML (stub); **Mark session complete** → `closed` |

## Backward phase transitions

Allowed backward moves along the main session chain (storyboard `goBackToPhase` / `usePhaseNavigation`). Data (lots, reconciliation rows, organizer flags) is **preserved** unless product adds an explicit reset later.

| Current phase | Allowed back targets | Confirm when skipping >1 step? |
|---------------|----------------------|--------------------------------|
| `reconciling` | `counting` | No |
| `organizing` | `reconciling`, `counting` | No for reconcile; **Yes** for counting |
| `updating_inventory` | `organizing`, `reconciling`, `counting` | No for organize; **Yes** for reconcile and counting |
| `counting` | *(none on main chain)* | — |
| `importing`, `closed` | *(none)* | — |

**Not allowed:** `counting → importing`, `closed → anything`.

**Controls:**

- **Session progress strip** — click a **past, allowed** phase step to go back (phase + default landing route). Multi-step regressions open `ConfirmDialog` on the strip. **Import** (from Count+) and **future** steps are not clickable. **Current** step (highlighted badge) is not clickable — use an earlier step in the strip to go back.
- **SessionNav** — route links only; does **not** change session phase.

## Production note

Session-prefixed routes are used consistently in the SPA. A future coordinator Feature may add server-driven phase transitions and optional route aliases.
