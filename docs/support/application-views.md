# Application views & routes

**Status:** Storyboard MVP — routes unchanged; session chrome updated (Features #5–#8)  
**Last updated:** 2026-06-15  
**Session phases:** [session-phases-state.mmd](../session-phases-state.mmd)  
**Presentation detail:** [ui-rules.md](../ui-rules.md) (shells, responsive nav, sticky CTAs, tables)

Canonical route map for the Vue SPA. Storyboard and production share these paths; storyboard uses fixture data and in-memory session state.

**Scope:** This doc owns **routes**, **phase landing**, **nav visibility**, and **shared-route chapter labels**. Layout and responsive presentation live in [ui-rules.md](../ui-rules.md).

## Demo session

| Constant | Value |
|----------|-------|
| Fixed demo session ID | `demo` |
| Created from | Home → **Start demo session** or New session submit |

## Routes

| Route | Route name | View component | SessionNav | Primary phases |
|-------|------------|----------------|------------|----------------|
| `/` | `home` | `HomeView` | — | pre-session, closed |
| `/session/new` | `session-new` | `NewSessionView` | — | pre-import |
| `/session/:sessionId/import` | `session-import` | `PartOutImportView` | **hidden** | `importing` |
| `/session/:sessionId/lot` | `session-lot` | `LotEntryView` — **counting cockpit** (four-field form; not lot browse — see [ui-rules § Worker counting](../ui-rules.md)) | visible | `counting` (default landing) |
| `/session/:sessionId/lots` | `session-lots` | `ListLotsView` | visible | `counting`, `reconciling`, `organizing` |
| `/session/:sessionId/lots?mode=organizer` | `session-lots-organizer` | `ListLotsView` (organizer mode) | visible | `organizing` (default landing) |
| `/session/:sessionId/cups` | `session-cups` | `ListCupsView` | visible | `counting`–`organizing` |
| `/session/:sessionId/reconciliation` | `session-reconciliation` | `ReconciliationView` | visible | `reconciling`, `updating_inventory` (default landing) |

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
| `/session/:sessionId/lots` | default (browse) | Badge shows lot count (e.g. **3 lots**) |

## Reconciliation view modes

Single component `ReconciliationView`; content varies by phase:

| Phase | Primary story actions |
|-------|------------------------|
| `reconciling` | Compare part-out vs lots; resolve rows; **Declare ready to organize** |
| `updating_inventory` | Export XML (stub); **Mark session complete** → `closed` |

## Production note

Session-prefixed routes are used consistently in the SPA. A future coordinator Feature may add server-driven phase transitions and optional route aliases.
