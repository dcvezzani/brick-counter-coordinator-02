# Product Spec — Load part-out import from BrickLink

**AIDLC phase:** Plan — **Approved** 2026-06-16  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Load part-out import — fetch set inventory for Part-out import view |
| **Status** | **Approved** 2026-06-16 — David Vezzani (chat) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 |
| **Approved** | 2026-06-16 — David Vezzani (chat) |
| **Parent work item** | *(pending GitHub issue — create at first commit/push)* |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Draft — awaiting approval** |
| **UX design notes** | [ux-design-notes.md](./ux-design-notes.md) |
| **BrickLink reference** | [bricklink-part-out-reference.md](./bricklink-part-out-reference.md) · [invSetEdit.asp.request.md](./invSetEdit.asp.request.md) · [invSetEdit.asp.html](./invSetEdit.asp.html) · [invSetEdit.asp.html.md](./invSetEdit.asp.html.md) |
| **Prior art** | [new-session-use-filterable-picker](../../00-shipped/new-session-use-filterable-picker/product-spec.md) (set picker); [migrate-import-view](../../00-shipped/migrate-import-view/product-spec.md) (import shell); [ui-feedback-primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) (toasts, skeletons) |

## Problem & audience

### Problem statement

After a coordinator creates a session on **New session**, the **Part-out import** screen should show the **real parts list for that LEGO set** so they can confirm before counting. Today the import table is **fixture data** baked into the demo session seed — the same four sample rows regardless of which set was chosen. The set number from New session is stored on the session but **does not drive** the part-out list.

This Feature replaces the mock list with a **live load from BrickLink** for the selected set, with clear loading and error feedback, while keeping the coordinator on the import screen when something goes wrong.

BrickLink does not expose a supported API for this workflow. The app will use **session cookie authentication** supplied by the coordinator: they sign in to BrickLink in a **separate browser tab**, copy their browser cookie, and paste it into an **authentication dialog** in this app. That cookie is stored and reused for authenticated server requests until it expires. This is **not ideal architecture** (effectively web-scraping with a user-provided session), but it is the agreed bridge until a real API integration exists.

### Who it's for

- **Primary:** Coordinator on **tablet/laptop** (`≥ md`, coordinator workflow profile) — confirms BrickLink part-out before counting.
- **Not in scope for this Feature:** **Worker** profile and **phone (`< md`)** — workers do not authenticate with BrickLink, create coordinator sessions, or open Part-out import (per [diff-workflows](../00-shipped/diff-workflows-for-desktop-and-phone/ux-design-notes.md)).

### Current experience (baseline)

| Step | Today |
|------|-------|
| New session | Coordinator picks a set via `SetSearchCombobox`; `createDemoSession({ setNumber })` stores `session.setNumber`. **No BrickLink authentication.** |
| Part-out import | `PartOutImportView` renders `session.partOutLines` from `createDemoSessionSeed()` — **always the same four fixture rows** (3001, 3023, …). |
| BrickLink auth | None — no cookie capture, no login prompt. |
| Errors / loading | Synchronous; no loading state; no fetch failures. |
| Confirm | **Confirm and begin counting** advances phase unchanged. |

Reconciliation rows, lots, cups, and organizer lists in the demo seed are still **fixture data** and may not match a live part-out load.

## Outcomes & business impact

### Desired outcomes

- Coordinator sees the **BrickLink part-out inventory** for the set they chose on New session — not a hard-coded mock.
- While the list loads, the import screen shows a **clear loading state** (not an empty table or stale mock).
- If the load fails (network, auth, unknown set, BrickLink error), the coordinator sees an **error toast**, stays on Part-out import, and can retry or go back — **no silent failure** and **no advance** with bad data.
- The **set number** chosen on New session remains on the session and is the **source of truth** for which inventory to load throughout the session.
- Confirming import still advances to counting only after a **successful** part-out load is on screen.
- Coordinator can **authenticate once** by pasting a BrickLink cookie; the app **retains** that cookie until it expires and re-prompts only when auth is missing or invalid.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Creating a session for set `10281-1` (or agreed test set) shows **BrickLink-sourced** part rows on import — not the four-row fixture | Manual with pasted cookie + unit/integration tests with mocked API |
| 1b | **New session** shows authentication dialog when no valid BrickLink cookie is stored | Manual + component test |
| 1c | Pasted cookie is **stored** and reused on subsequent requests until expired | Manual + unit test |
| 1d | App API **`401` or `302`** (BrickLink upstream **`302`**) opens authentication dialog **on the current view** without navigation | Manual + integration test |
| 2 | Import view shows **loading** feedback until the list arrives | UI validation + component test |
| 3 | Simulated fetch failure shows **error toast** + **inline Alert**; user remains on import; **Retry** available; confirm disabled until success | Manual + test |
| 3b | Fixture fallback shows **persistent inline Alert** (not toast-only) that data is not live | Manual + test |
| 3c | Zero-part set shows **warning Alert** empty state; confirm disabled | Manual + test |
| 3d | **Worker / phone** cannot reach Part-out import or coordinator New session — blocked per workflow profile | Manual + route test |
| 3e | Coordinator import shows **filter** to search loaded part-out lines | Manual + component test |
| 4 | `session.setNumber` matches New session selection after create | Unit test on session create + import handoff |
| 5 | `session.partOutLines` populated from fetch (part id, name, color, quantity fields needed by existing table) | Code review + fixture contract test |
| 6 | Successful load → **Confirm and begin counting** still lands on lot entry | Manual walkthrough |
| 7 | `npm test` / `npm run build` pass | CI |

### Business impact

First step from **storyboard fixtures** toward **live coordinator** value: coordinators trust the part-out list before hours of counting. De-risks reconciliation and part search (which rank session part-out first). Enables future Features (persistence, export) to build on real inventory data.

## User experience & scenarios

### Key scenarios

1. **First-time connect on New session (coordinator, `≥ md`)** — No cookie → **inline info `Alert`** + **Connect BrickLink** button (set picker visible) → dialog → paste cookie → save → banner clears → pick set → create session.

2. **Happy path (coordinator, authenticated)** — Valid cookie → New session (no banner) → **Create session** → import shows loading → table + part count → filter if needed → **Confirm and begin counting** → lot entry.

3. **Slow network** — Loading skeleton visible until data arrives; confirm button not actionable until load completes.

4. **Expired cookie** — Import fetch → auth dialog (**required**, with **Back to Home** escape) → paste updated cookie → auto-reload → table fills.

5. **Other fetch failure** — Error toast + **inline Alert** → **Retry** or **Back**.

6. **Wrong / unknown set** — Error toast + Alert; no false success.

7. **Set variant** — `10281-2` loads that variant’s inventory.

8. **Fixture fallback (dev/CI)** — Persistent **Alert** on import + optional info toast on first load.

9. **Empty set** — Warning **Alert**; confirm blocked.

10. **Worker on phone** — Cannot open import or coordinator New session; sees waiting / session list per diff-workflows.

### Authentication (coordinator only)

| Element | Behavior |
|---------|----------|
| **Who** | **Coordinator profile** on **`≥ md` only** — workers and phone never see BrickLink auth UI |
| **New session (no cookie)** | **Inline info `Alert`** + **Connect BrickLink** button — **not** blocking modal; set picker stays visible |
| **Dialog** | Opens from Connect button or when import fetch returns auth required |
| **Import auth failure** | **Required** dialog; **Back to Home** ghost action; **Save** → auto-reload |
| **Input** | Textarea for pasted cookie |
| **Persistence** | Until BrickLink expires or user replaces |

### Field copy & behavior (product-level)

| Element | Behavior |
|---------|----------|
| Phase | **`Badge`:** “Step 1 — Part-out import” |
| Header | Description + **part count** after load (“{n} parts for set …”) |
| Filter | **Filter parts…** — search part id, name, color on loaded list (coordinator) |
| Table | Part, Name, Color, Qty — coordinator `≥ md` |
| Loading | `TableLoadingSkeleton` — no stale rows |
| Fixture mode | **Persistent `Alert`** — storyboard data, not live BrickLink |
| Error | **Toast + inline `Alert`** until Retry succeeds |
| Empty | **Warning `Alert`** — zero parts |
| Auth failure | Dialog in place (`401` / `302`) |
| Confirm | Enabled only after successful load with lines |

### Experience principles

- **Coordinator-only** — BrickLink features gated by `useWorkflowProfile` (`isCoordinatorProfile` + `≥ md`).
- **Fail loud, stay put** — Toast for momentary feedback; **inline `Alert`** for persistent import state per [ui-rules.md](../../../docs/ui-rules.md).
- **Phone = worker** — No part-out import table on phone; large mobile lists (cups, put-away) use lazy load + filter in diff-workflows, not this Feature.

## Scope

### In scope

- **Load part-out inventory** for `session.setNumber` from BrickLink when the coordinator **opens Part-out import** (fetch on view entry).
- **Transform** BrickLink `invSetEdit.asp` HTML response into the app’s part-out line shape — see [bricklink-part-out-reference.md](./bricklink-part-out-reference.md).
- **Client integration** — import view triggers load, binds table to `session.partOutLines`, handles loading/error/empty states.
- **Error handling** — toast + **inline `Alert`** on failure; remain on import view.
- **Part-out filter** — client-side filter on loaded lines (coordinator import).
- **Session persistence (in-tab)** — `setNumber` on session; replace seed `partOutLines` with fetched lines on success (still in-memory storyboard store until coordinator server Feature).
- **BrickLink cookie authentication** — store user-pasted BrickLink session cookie; reuse until expiry; prompt via authentication dialog when missing or when server reports **302**.
- **Authentication dialog** — shared modal with textarea; shown on New session (no valid cookie) and on any view when a BrickLink-backed request gets **302**; does not navigate away from current view.
- **Tests** with mocked BrickLink/proxy responses so CI does not require live cookies.

**Primary touchpoints (engineering mapping of your list):**

| Your item | Product outcome |
|-----------|-----------------|
| Service module → BrickLink | Reliable part-out fetch for a set number |
| Transform → JSON | App-ready part-out lines on the session |
| Client service call + consume JSON | Import table shows live data |
| Errors → toast, same view | Failure feedback without losing place |
| Persist set number | Session carries chosen set through the workflow |
| Cookie auth + dialog | User-pasted BrickLink cookie; re-prompt on 302 without leaving current view |

### Also in scope (confirmed in chat)

| Topic | Decision |
|-------|----------|
| **Loading skeleton** on import | Yes — use existing skeleton primitive while fetch runs |
| **Minimal Node.js API server** | New dedicated server directory in-repo; forwards BrickLink requests using the **user-supplied session cookie** (not OAuth app secrets); frontend calls this API (see Decisions) |
| **Cookie authentication UI** | Connect **`Alert`** on New session; dialog on Connect or auth failure (coordinator only) |
| **Dev fixture fallback** | Persistent **`Alert`** on import + optional info toast; prefer live when cookie exists |
| **Coordinator profile gate** | Worker + phone cannot access New session (coordinator) or Part-out import |
| **Import filter** | Filter input above part-out table on coordinator import |
| **Retry** after fetch failure | Yes — coordinator can retry without leaving import |
| **Empty inventory** | Yes — distinct empty state when set exists but has zero parts |
| **Reconciliation / lots** | **Part-out only** — replace `partOutLines`; leave lots, cups, reconciliation, organizer fixture data unchanged for now |

### Out of scope

- Official BrickLink **OAuth / Store API** integration — this Feature uses **cookie-based session scraping** only.
- Live BrickLink **set search** on New session (fixture `set-catalog` remains until a separate Feature).
- **Iframe** or in-app BrickLink login — user always authenticates in a **separate browser tab**.
- Full **coordinator server** + WebSockets + multi-user sessions.
- **Persistence across browser refresh** for the **counting session** (still in-memory only).
- **BrickLink cookie** may persist across refresh until expiry — storage mechanism is a Design decision.
- BrickLink **export XML** / inventory upload (reconciliation export chapter).
- Changing import **layout/shell** (already migrated in #34).
- Part-out **condition** editing on import (session defaults remain as today).
- Mobile lazy scroll + filter for **cups** and **organize / My list** (diff-workflows scope).

### Dependencies on other teams or features

| Dependency | Status |
|------------|--------|
| `SetSearchCombobox` + normalized `setNumber` on create | **Shipped** — [new-session-use-filterable-picker](../../00-shipped/new-session-use-filterable-picker/product-spec.md) |
| Toasts + skeleton primitives | **Shipped** — [ui-feedback-primitives](../../00-shipped/ui-feedback-primitives/product-spec.md) |
| `PartOutImportView` shell + `ResponsiveDataTable` | **Shipped** — [migrate-import-view](../../00-shipped/migrate-import-view/product-spec.md) |
| `ConfirmDialog` / dialog primitives | **Shipped** — pattern reference for authentication dialog |
| `useWorkflowProfile` / diff-workflows | **Shipped / in repo** — [ux-design-notes](../00-shipped/diff-workflows-for-desktop-and-phone/ux-design-notes.md) |

## Constraints (non-technical where possible)

- Must work with the **existing session phase model** — import → counting gate unchanged ([session-phases-state.mmd](../../../docs/session-phases-state.mmd)).
- BrickLink access must follow project rule: **session-backed fetch, no iframes** ([docs/tech-stack.md](../../../docs/tech-stack.md)). User signs in on bricklink.com in another tab; this app never embeds BrickLink login.
- **No official BrickLink API** for this workflow — server uses the coordinator’s **pasted session cookie** to perform authenticated HTTP requests (scraping). Product accepts this as interim architecture.
- User-provided session cookies are **sensitive** — treat as credentials; storage and transport details belong in Tech Spec (not committed to repo).
- JavaScript-only Vue client per [ADR-0001](../../../adr/0001-frontend-vue-js-shadcn-stack.md).
- Product Spec approval before `/design`.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-16 | **Backend:** Add a **minimal Node.js API server** in a new top-level directory (e.g. `server/`). Frontend calls this server; server forwards requests to BrickLink using the **user’s session cookie**. First coordinator-server slice, scoped to part-out fetch only. `/design` names routes, ports (`API_PORT` via AIDLC registry), and dev startup. |
| 2026-06-16 | **Authentication:** **Cookie paste**, not OAuth. Coordinator copies BrickLink cookie from another browser tab into an **authentication dialog** (textarea). Cookie stored in the app until BrickLink expires it. |
| 2026-06-16 | **Profile gate:** BrickLink auth, New session (coordinator flow), and Part-out import — **coordinator profile on `≥ md` only**; phone is always worker. |
| 2026-06-16 | **New session auth:** Non-blocking **`Alert`** + **Connect BrickLink** button; no modal on mount. |
| 2026-06-16 | **Feedback:** Persistent states use inline **`Alert`** (fixture, error, empty); toasts supplementary per ui-rules. |
| 2026-06-16 | **Import UX:** **`Badge` “Step 1 — Part-out import”**; part count in header; **filter** above table; layout handoff in [ux-design-notes.md](./ux-design-notes.md). |
| 2026-06-16 | **Auth dialog escape:** **Back to Home** when blocking on import. |
| 2026-06-16 | **Large lists:** Part-out table coordinator-only; mobile lazy load + filter deferred to cups / My list (diff-workflows). |
| 2026-06-16 | **Auth HTTP codes:** BrickLink returns **`302`** when session expired. App API surfaces **`AUTH_REQUIRED`**; client treats app API **`401` or `302`** the same — open auth dialog, stay on view. |
| 2026-06-16 | **Cookie persistence:** BrickLink session cookie **outlives** the in-memory counting session — stored until BrickLink expires it (or user replaces it). Counting session data remains in-memory only (unchanged). |
| 2026-06-16 | **Fetch timing:** Load when **Part-out import view opens** (not on New session submit). |
| 2026-06-16 | **Dev fallback:** Persistent **`Alert`** on import when fixture; optional info toast. |
| 2026-06-16 | **Session seed:** On successful fetch, update **`partOutLines` only**; do not reset lots, reconciliation, cups, or organizer lists in this Feature. |
| 2026-06-16 | **UX extras:** Loading skeleton, retry on failure, distinct empty state for zero-part sets. |
| 2026-06-16 | **Errors:** Error toast + inline **`Alert`** on import; remain on view. |
| 2026-06-16 | **POST flags:** `incInstr=N` and `incParts=N` — confirmed in [invSetEdit.asp.request.md](./invSetEdit.asp.request.md); exclude instructions and spare extras from part-out list. |
| 2026-06-16 | **BrickLink source:** Part-out preview via **POST** `invSetEdit.asp` (`itemNo` + `itemSeq`, `incInstr=N`, `incParts=N`); HTML parsed to `partOutLines`. See [bricklink-part-out-reference.md](./bricklink-part-out-reference.md) and `invSetEdit.asp.*` captures. |

## Grounding review (repo context)

| Severity | Finding |
|----------|---------|
| **Blocking** | **No coordinator server exists today.** Live BrickLink requests require the **minimal Node `server/` slice** in this Feature. |
| **Resolved** | **BrickLink authentication** — user-pasted **session cookie**; **302** triggers re-auth dialog (2026-06-16). |
| **Advisory** | Cookie scraping is **fragile** (BrickLink HTML/cookie changes) — parser should be covered by fixtures in this folder; no automated cookie format validation beyond 302/success. |
| **Advisory** | **CORS / cookie forwarding** — browser cannot call BrickLink directly with user cookie; server proxy is required (Design). |
| **Advisory** | `session.setNumber` is **already stored** on create; main gap is **`partOutLines` still fixture** in `createDemoSessionSeed()`. |
| **Advisory** | Downstream **`part-catalog.js`** ranks `session.partOutLines` first — live load directly improves lot entry search. |
| **Advisory** | **`reconciliationRows`** in demo seed are fixture mismatches — consider regenerating from fetched part-out or clearing lots/reconciliation on load (Design decision). |
| **Advisory** | Overlaps **PROJECT.md** “BrickLink session integration” milestone — this Feature is the natural first slice; update PROJECT.md in `/learn`. |

## Related documents

- **BrickLink part-out reference:** [bricklink-part-out-reference.md](./bricklink-part-out-reference.md)
- **Source captures:** [invSetEdit.asp.request.md](./invSetEdit.asp.request.md) · [invSetEdit.asp.html](./invSetEdit.asp.html) · [invSetEdit.asp.html.md](./invSetEdit.asp.html.md)
- [application-views.md](../../../docs/support/application-views.md) — import route, nav hidden
- [ux-design-notes.md](./ux-design-notes.md) — layout, Alert vs toast, profile gate
- [ADR-0004 Lot identity](../../../adr/0004-lot-identity-and-counting-model.md) — part-out vs lots model
- AIDLC: [docs/AIDLC.md](../../../docs/AIDLC.md)
