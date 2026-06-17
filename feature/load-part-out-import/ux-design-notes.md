# UX design notes — load part-out import

**Persona:** [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md)  
**Feature:** `load-part-out-import`  
**Last updated:** 2026-06-16 (Dave feedback — UX review pass 2)

Review of Product Spec + Tech Spec. Items below are **recorded for Design approval and Build**.

**Related:** [diff-workflows ux-design-notes](../00-shipped/diff-workflows-for-desktop-and-phone/ux-design-notes.md) — workflow profile rules (`phone → worker`, coordinator on `≥ md`).

---

## Profile & device gate (item 1)

BrickLink cookie auth, **New session** (create + set picker), and **Part-out import** are **coordinator-only** surfaces.

| Viewport / profile | Access |
|--------------------|--------|
| **Phone (`< md`)** | Always **worker** effective profile — **no** BrickLink auth, **no** New session create for coordinator flow, **no** Part-out import |
| **Worker profile (`≥ md`)** | Same blocks — redirect to waiting / session list per diff-workflows |
| **Coordinator profile (`≥ md`)** | Full access — New session, cookie connect, Part-out import load |

**Rationale:** Cookie paste is a desktop coordinator task; narrow phone UX is reserved for **worker** counting and put-away lists.

**Implement:** `useWorkflowProfile()` — `isCoordinatorProfile` guards on `NewSessionView`, `PartOutImportView`; route guard on `session-import` and `session-new` when not coordinator.

---

## Feedback primitives (item 2) — per [ui-rules.md](../../docs/ui-rules.md)

| State | Toast | Inline `Alert` |
|-------|-------|----------------|
| Live load success | Optional brief `showSuccessToast` | No |
| **Fixture / storyboard fallback** | Optional one-time `showInfoToast` on load | **Required** — persistent `Alert` for whole visit on import |
| **Load error** | `showErrorToast` | **Required** — `Alert` until Retry succeeds |
| **Empty part-out (0 rows)** | No | **Required** — warning `Alert` |
| Auth required | No (dialog) | No |

---

## Import layout — ImportFocusShell (item 3)

**Vertical order (phone coordinator `≥ md` only — typically laptop):**

1. `ViewHeader` — title, description, **`Badge` “Step 1 — Part-out import”**, part count after load (“847 parts”)
2. **Status `Alert`** — fixture \| error \| empty (when applicable)
3. **Filter** — `Input` + label “Filter parts…” (coordinator scans large sets)
4. `TableLoadingSkeleton` \| filtered `ResponsiveDataTable`
5. `ViewActions` (sticky on phone if coordinator ever at `md` edge — primary laptop inline OK)

### Breakpoint matrix

| Element | Phone worker (`< md`) | Coordinator `≥ md` |
|---------|---------------------|---------------------|
| Part-out import route | **Blocked** — waiting `Alert` | Full layout below |
| Status `Alert` | N/A | Full width below header |
| Filter | N/A | Above table; filters `partId`, `name`, `color` client-side |
| Table | N/A | `ResponsiveDataTable` table mode (`hidden md:block` cards optional at `md`) |
| Retry | N/A | `outline` beside disabled Confirm |
| Confirm | N/A | Disabled until `success` with lines |

---

## Phase clarity (item 5)

`Badge` on `ViewHeader`: **Step 1 — Part-out import** (matches reconciliation chapter pattern).

After load, append to description or subtitle: **“{n} parts loaded for set {setNumber}”**.

---

## New session — BrickLink connect (item 6)

**Option A (approved):** Non-blocking inline pattern — **not** modal on mount.

| Element | Component |
|---------|-----------|
| Missing cookie banner | shadcn **`Alert`** (info) — “Connect BrickLink to load a real part-out list.” |
| Action | **`Button`** “Connect BrickLink” → opens `BrickLinkAuthDialog` |
| Set picker | **`SetSearchCombobox`** always visible below banner |
| After save | Brief success toast; banner hides when `hasBrickLinkCookie()` |

---

## Blocking auth on import (item 7)

When `required: true` on `BrickLinkAuthDialog`:

| Action | Behavior |
|--------|----------|
| **Save authentication** | Primary — `onSaved` → auto `loadPartOut()` |
| **Back to Home** | `ghost` secondary — `router.push({ name: 'home' })` — escape hatch |

---

## Large lists (item 4)

| Surface | List type | UX |
|---------|-----------|-----|
| **Part-out import** | Coordinator `≥ md` only | Full list + **client filter** (this Feature) — no mobile table |
| **Cups lots** | Worker phone | **Lazy / windowed load** + filter — [diff-workflows](../00-shipped/diff-workflows-for-desktop-and-phone/ux-design-notes.md) §9; **not this Feature** |
| **Organize / My list** | Worker phone | **Lazy / windowed load** + filter — diff-workflows §9; **not this Feature** |

**This Feature in scope:** `PartOutImportView` filter `Input` for coordinator part-out review only.

**Follow-up:** Ensure cups + My list implement lazy scroll + filter per diff-workflows (separate PR if not already shipped).

---

## Component mapping

| UI | Component |
|----|-----------|
| Fixture / error / empty banner | `Alert` |
| Step label | `Badge` |
| New session connect prompt | `Alert` + `Button` |
| Cookie dialog | `BrickLinkAuthDialog` → `AlertDialog` + `Textarea` + optional `ScrollArea` |
| Part filter | `Input` + `Label` (or `FormField`) |
| Loading | `TableLoadingSkeleton` |
| Data | `ResponsiveDataTable` |
| Transient errors | `feedback.js` toasts |
| Actions | `ViewActions` + `Button` |

**New custom:** `BrickLinkAuthDialog`, optional `PartOutImportFilter` (or inline in view).

---

## Design handoff checklist

- [ ] Route / profile guards: worker + `< md` cannot reach import or coordinator New session
- [ ] New session: info `Alert` + Connect button; no mount modal
- [ ] Import: layout order, `Badge`, part count, status `Alert`s per state
- [ ] Import: filter above table; client-side filter on loaded lines
- [ ] Auth dialog: `Back to Home` when `required`
- [ ] Feedback: fixture = persistent `Alert`, not toast-only
- [ ] `useWorkflowProfile` integrated on affected views

## Out of scope (this Feature)

- Mobile lazy scroll for cups / My list (owned by diff-workflows)
- Worker access to BrickLink or part-out import
- Virtual scroll on coordinator import table (filter sufficient for v1)
