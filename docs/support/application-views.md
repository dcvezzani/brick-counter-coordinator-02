# Application views & routes

**Status:** Storyboard MVP (Feature `storyboard-ui`)  
**Last updated:** 2026-06-12  
**Session phases:** [dcv/session-phases-state.mmd](../../dcv/session-phases-state.mmd)

Canonical route map for the Vue SPA. Storyboard and production share these paths; storyboard uses fixture data and in-memory session state.

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
| `/session/:sessionId/lot` | `session-lot` | `LotEntryView` | visible | `counting` (default landing) |
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

## Reconciliation view modes

Single component `ReconciliationView`; content varies by phase:

| Phase | Primary story actions |
|-------|------------------------|
| `reconciling` | Compare part-out vs lots; resolve rows; **Declare ready to organize** |
| `updating_inventory` | Export XML (stub); **Mark session complete** → `closed` |

## Production note

The state diagram references post-join path `/reconciliation` without a session prefix when session context is already established server-side. The SPA uses session-prefixed paths consistently; a future coordinator Feature may add aliases or redirects.
