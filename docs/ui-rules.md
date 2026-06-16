# UI rules — Brick Counter Coordinator

**Status:** Published (2026-06-13) — foundation primitives and session view migrations merged. Parent Validate [#5](../feature/00-shipped/consolidate-and-clean-ui/product-spec.md) complete.

**Audience:** Contributors and agents implementing or reviewing views.

**Related:** [application-views.md](support/application-views.md) (routes, phases, nav visibility) · [session-phases-state.mmd](session-phases-state.mmd) · [PROJECT.md](../PROJECT.md)

---

## Purpose

One authoritative reference for **layout shells**, **shared chrome**, **form controls**, and **responsive patterns**. Route and phase rules live in `application-views.md` — this doc covers **presentation only**.

---

## Shell taxonomy

Three presentation shells share one design token set (shadcn-vue + Tailwind). Pick the shell from the route; do not invent a fourth layout per view.

| Shell | Routes | Structure |
|-------|--------|-----------|
| **MarketingShell** | `/`, `/session/new` | `ViewFrame` (`max-w-2xl`) — optional `#header` slot for site title, bordered inner frame for content |
| **SessionCoordinatorShell** | Lot, Lots, Reconcile, Cups | `SessionLayout` → `SessionNav` (ViewSubnav) + `SessionProgress` → **session frame** → `ViewHeader` → body → `ViewActions` |
| **ImportFocusShell** | Part-out import | Nav hidden (`meta.hideSessionNav`); session frame → `ViewHeader` (`#leading` Back) → body → `ViewActions` |

**Nesting rule:** Session frame lives **inside** `SessionLayout`'s `RouterView`, below nav and progress — never wrap `SessionLayout` with the frame.

**Migration status (2026-06-13):** All seven MVP views use the shell taxonomy above. MarketingShell on Home and New session. Session routes use `SessionViewFrame` + `ViewHeader` + `ViewActions`; tabular session content uses `ResponsiveDataTable`. Home retains `Card` + `CardHeader` only for hub sections inside MarketingShell — not as session page shells.

---

## Breakpoint matrix

Tailwind default **`md`** = **768px** is the project breakpoint unless noted.

| Concern | Phone (`< md`) | Laptop (`≥ md`) |
|---------|----------------|-----------------|
| Session nav (`SessionNav`) | Fixed bottom bar, icons + labels, safe-area padding | Horizontal link row under top border |
| Phase CTAs (`ViewActions`) | Sticky footer with blur + safe-area bottom | Static inline below content |
| Tabular data (`ResponsiveData`) | Card list (`md:hidden`) | Bordered HTML table (`hidden md:block`) |
| Session layout main | Extra bottom padding for bottom nav clearance | Standard padding |
| Touch targets | Minimum `Button` size `default`; **ban `size="xs"`** for row actions | `sm` acceptable for dense tables |

**Safe area:** Use `env(safe-area-inset-*)` on sticky footers, bottom nav, and marketing page bottom padding. See `ViewFrame.vue` and `SessionLayout.vue` for reference.

---

## Components

### ViewFrame (MarketingShell)

**Path:** `src/components/ViewFrame.vue`  
**Used on:** Home, New session

- Outer `<main>`: `max-w-2xl`, horizontal padding, safe-area bottom padding.
- Optional `#header` slot: page-level title and tagline **outside** the bordered frame.
- Default slot: content inside `rounded-xl border … ring-1` inner frame.

```vue
<ViewFrame>
  <template #header>
    <h1>…</h1>
    <p class="text-muted-foreground">…</p>
  </template>
  <!-- cards / forms inside bordered frame -->
</ViewFrame>
```

**Rule:** Exactly **one `<h1>` per route**. On Home, the site title is the page `h1` in `#header` until `ViewHeader` migration lands.

---

### Session view frame (session routes)

**Status:** Complete — [#32 session-view-frame](../feature/00-shipped/session-view-frame/product-spec.md)

- **Width:** `max-w-4xl` (matches `SessionLayout` container).
- **Visual language:** Same border/background/ring as `ViewFrame` inner area.
- **Implementation:** Extend `ViewFrame` with a width prop or add `SessionViewFrame.vue` (Tech Spec decision).

Session views wrap **header + body + actions** inside this frame instead of a top-level shadcn `Card`.

---

### ViewHeader

**Status:** Complete — [#30 view-header](../feature/00-shipped/view-header/product-spec.md)  
**Path (planned):** `src/components/ViewHeader.vue`

Shared page title block for all seven MVP views.

| Slot / prop | Use |
|-------------|-----|
| `title` | Primary page heading — renders as **one `<h1>` per route** |
| `description` | One-line subtitle |
| `#badge` | Chapter labels (reconciliation step, organizer mode) |
| `#leading` | Back action (Import escape → Home) |

**Placement:** First child inside session frame (or `ViewFrame` `#header` on Home after migration).

**Chapter examples:**

- Reconciliation: “Resolve discrepancies” vs “Export to BrickLink” by phase.
- Lots organizer: badge “Organizer” when `?mode=organizer`.

---

### ViewActions

**Status:** Complete — [#31 view-actions](../feature/00-shipped/view-actions/product-spec.md)  
**Path (planned):** `src/components/ViewActions.vue`

Workflow gate buttons (confirm import, declare ready to organize, export, return to counting).

| Slot | Use |
|------|-----|
| default | Primary/secondary `Button` cluster |
| `#hint` | Optional helper text above buttons (e.g. disabled reconcile CTA reason) |

**Responsive behavior (pattern C from UX review):**

- **Phone:** sticky bottom bar — blur, top border, safe-area bottom padding.
- **Laptop:** static placement below content — no sticky, no footer border.

**Canonical sticky classes** (must live only in `ViewActions`, not views):

```
sticky bottom-0 z-10 border-t border-border bg-background/95 backdrop-blur
supports-[backdrop-filter]:bg-background/80 p-4
pb-[max(1rem,env(safe-area-inset-bottom))]
md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none
```

---

### ResponsiveData

**Status:** Complete — [#33 responsive-data-table](../feature/00-shipped/responsive-data-table/product-spec.md)  
**Path (planned):** `src/components/ResponsiveData.vue` (name per Tech Spec)

One component for tabular session content: laptop table + phone card list.

| Breakpoint | Renders |
|------------|---------|
| `≥ md` | Dense table in bordered wrapper |
| `< md` | Card-style list rows with equivalent fields |

**API intent:** Column definitions + slots for custom cells and mobile row layout. Row actions stay in view slots — not hidden inside opaque table logic.

**Consumers (after migration):** Part-out import, Lot entry, Lots browse/organizer, Reconciliation.

---

### FormField

**Path:** `src/components/FormField.vue`

Wrap every labeled control (shadcn `Input`, `Select`, etc.).

```vue
<FormField label="Phase" description="Optional help text" :error="err" :required="true">
  <template #default="{ fieldId, ariaDescribedBy, ariaInvalid }">
    <Select v-model="value">
      <SelectTrigger
        :id="fieldId"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="ariaInvalid"
      />
      …
    </Select>
  </template>
</FormField>
```

**Rules:**

- Use shadcn `Input` / `Select` — not raw `<input>` / `<select>`.
- Pass slot props to the control for a11y (`id`, `aria-describedby`, `aria-invalid`).
- Required fields: `:required="true"` adds visual asterisk; validate in view/lib.

**Current usage:** Home, New session. Session form views should adopt on migration.

---

### SessionNav (ViewSubnav)

**Path:** `src/components/SessionNav.vue`  
**Contract name:** **ViewSubnav** — `SessionNav` is the canonical implementation; do not build a parallel subnav component.

**Data source:** `sessionNavModel(sessionId)` in `src/lib/storyboard-session.js` — views must not redefine nav items or visibility.

| Breakpoint | Presentation |
|------------|--------------|
| `≥ md` | Horizontal `RouterLink` row in `max-w-4xl` container |
| `< md` | Fixed bottom bar with Lucide icons + truncated labels |

**Visibility rules** (from [application-views.md](support/application-views.md)):

- Hidden entirely on import route (`meta.hideSessionNav: true`).
- Phase-gated items: `sessionNavModel` filters keys by phase (`importing`, `updating_inventory`, etc.).
- Organizer mode: `Badge` on Lots item when `route.query.mode === 'organizer'`.

**Do not change:** Route targets, phase gating logic, or hide rules without updating `application-views.md` and tests.

---

### SessionLayout + SessionProgress

**Paths:** `src/components/SessionLayout.vue`, `SessionProgress.vue`

`SessionLayout` wraps all `/session/:sessionId/*` child routes:

1. `SessionNav` (unless hidden)
2. `SessionProgress` — compact phase stepper (`Import → Count → Reconcile → Organize → Export → Done`)
3. `StoryboardPhaseControls` (demo-only)
4. `RouterView` — view content

Main area uses bottom padding on phone to clear fixed bottom nav.

---

## View composition recipes

### MarketingShell (Home / New session)

```
ViewFrame
├── #header → h1 + tagline (→ ViewHeader after #30)
└── default slot → Card sections / FormField + shadcn controls
```

### SessionCoordinatorShell (Lot, Lots, Reconcile, Cups)

```
SessionLayout
├── SessionNav (ViewSubnav)
├── SessionProgress
└── RouterView
    └── SessionViewFrame (target)
        ├── ViewHeader
        ├── body (ResponsiveData, forms, alerts, …)
        └── ViewActions
```

### ImportFocusShell

```
SessionLayout (nav hidden)
└── RouterView
    └── SessionViewFrame
        ├── ViewHeader (#leading → Back to Home)
        ├── ResponsiveData (part-out lines)
        └── ViewActions (Confirm and begin counting)
```

---

## Anti-patterns (do not copy-paste)

These patterns were **removed from session views** during parent #5. **Do not reintroduce them.** Use the shared components above.

| Anti-pattern | Replace with |
|--------------|--------------|
| Duplicated sticky footer class string in views | `ViewActions` |
| `hidden md:block` table + `md:hidden` card list pair per view | `ResponsiveData` |
| Per-view `Card` + `CardHeader` as page shell on session routes | Session view frame + `ViewHeader` |
| Raw `<input>` / `<select>` without `FormField` | `FormField` + shadcn controls |
| `Button size="xs"` for primary row actions on phone | `size="default"` minimum |
| Custom horizontal nav or duplicate bottom bar | `SessionNav` only |
| Redefining nav items or phase visibility in a view | `sessionNavModel()` + router meta |

**Verification:** Parent Validate [#5](../feature/00-shipped/consolidate-and-clean-ui/product-spec.md) greps for zero inline sticky strings and zero duplicate table/card shells in migrated views.

---

## shadcn-vue baseline

CLI adds primitives to `src/components/ui/`. Import via `@/components/ui/…`.

| Need | Component |
|------|-----------|
| Actions | `button` |
| Grouping | `card` (inside frames — not as session page shell) |
| Status | `badge` |
| Text input | `input` inside `FormField` |
| Selects | `select` inside `FormField` |
| Tables (inside ResponsiveData) | `table` at `md+` |
| Transient feedback | `sonner` via `@/lib/feedback.js` |
| Confirm before irreversible | `ConfirmDialog` (wraps `alert-dialog`) |
| Persistent page context | `alert` inline |
| Loading placeholders | `skeleton` / `TableLoadingSkeleton` |

---

## Feedback primitives ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9))

Use the shared feedback layer — do not add inline stub messages or ad-hoc confirms in views.

| Need | Use | Do not use |
|------|-----|------------|
| Transient outcome (export stub, save success) | `showInfoToast` / `showSuccessToast` from `@/lib/feedback.js` | Inline `<p>` that appears after click |
| Irreversible / high-stakes action | `ConfirmDialog` with controlled `open` ref | `window.confirm` or immediate CTA side effects |
| Persistent chapter/page context | shadcn `Alert` or `role="status"` banner | Toast |
| Field validation | `FormField` `:error` | Toast for per-field errors |
| Submit / network failure | `showErrorToast` | Raw alert text |
| Async table/card loading | `TableLoadingSkeleton` or `Skeleton` rows | Empty flash |

### Global toast host

Mount `<Toaster />` once in `App.vue` (**top-right**, fixed overlay; import `vue-sonner/style.css` in `main.js`). Views call helpers — never mount a second toaster.

### ConfirmDialog pattern

- Parent owns `open` ref; sticky CTA sets `open = true` on click.
- Do **not** wrap sticky `ViewActions` buttons in `AlertDialogTrigger`.
- Consumer Features supply title, body, and confirm handler.
- **Touch targets:** Footer actions use `w-full min-h-11` on phone and `md:min-h-9 md:w-auto` on laptop — same minimum heights as sticky phase CTAs in `ViewActions`. Applied in shared `ConfirmDialog.vue` so all confirms inherit it.
- **Stacking:** Alert dialog overlay/content must sit above mobile `SessionNav` (`z-20`); content uses `pointer-events-auto` and `z-[100]` in `AlertDialogContent.vue`.
- **Shipped example ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)):** `ReconciliationView` — **Mark session complete** → `ConfirmDialog` (`Are you sure?` / `Not yet` / `Complete session`) → `completion-celebration.js` stages summary → Home `showSuccessToast`.
- **Shipped example (go-back, [#80](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/80)):** `SessionProgress` — tap a past step that skips &gt;1 phase → `ConfirmDialog` via `usePhaseNavigation`:
  - Title: destination-first — `Go back to Count?`
  - Body: skipped steps + data kept — `You'll skip Reconcile and Organize. Your counted lots and progress so far are kept.`
  - Actions: `Stay on {current}` / `Go to {target}` (SessionProgress vocabulary)
  - Past steps that require confirm use dotted underline + `title="Confirm before skipping steps"` on the strip button.

### One-shot celebration toast

When a toast must appear **only once** after a cross-route action (not on every visit to the destination):

1. Build summary in `src/lib/completion-celebration.js` (or feature-specific module).
2. `stageCompletionCelebration(summary)` before `router.push`.
3. `consumeCompletionCelebration()` in destination view `onMounted`; call `showSuccessToast` if non-null.

Do not use router query params for celebration payloads.

### Default toast duration

`DEFAULT_TOAST_DURATION_MS` (6 seconds) in `@/lib/feedback.js`. Consumer Features may override per toast.

---

## Accessibility checklist (implementers)

- One `<h1>` per route (`ViewHeader` or marketing `#header`).
- `SessionNav`: `aria-label="Session navigation"` (already on component).
- `FormField`: wire `fieldId`, `aria-describedby`, `aria-invalid` to controls.
- Sticky regions must not trap focus; phase buttons remain keyboard reachable.
- Card lists: `role="list"` on `<ul>` where used.

Full audit is out of scope for #5 — see accessibility persona.

---

## Worker counting (lot entry cockpit) — [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)

| Topic | Rule |
|-------|------|
| **Route** | `/session/:sessionId/lot` — counting-phase landing; browse saved lots on **Lots** (`/lots`), not on lot entry |
| **Shell** | `SessionCoordinatorShell` with **compact chrome**: short `ViewHeader` description (`"Count parts into lots."`); tighter vertical rhythm (`space-y-3` interior) vs coordinator browse views |
| **Primary content** | `LotEntryForm` during `phase === 'counting'` only — **no** `ResponsiveDataTable` on lot entry |
| **Lot identity** | UI stores **part id + color id + condition**; count is `qty`. Names in pickers; ids in session |
| **Pickers** | `PartSearchCombobox` → part id (part-out lines ranked first); `ColorPicker` → color id (disabled until part chosen) |
| **Condition** | Required every save; read-only label or N/U toggle per `lot-entry-defaults.js` |
| **Quantity** | Large `+` / `−` stepper (`Button` `default` / `min-h-11`) — **no** swipe input in coordinator-02 |
| **Save actions** | **Save** and **Save and add another**; success via `showSuccessToast` — not inline stub text |
| **Duplicate triple** | `ConfirmDialog` before merge — same part + color + condition |
| **Phase gate** | Sticky **Compare with Part-Out List** in `ViewActions` when `phase === 'counting'` on **Lot entry** and **List lots browse**; `min-h-11` on Compare |
| **Wrong phase** | Muted phase note; no form; no Compare |
| **Touch targets** | Primary cockpit actions: `min-h-11` minimum; **ban `size="xs"`** on Save, stepper, Compare |
| **Browse table** | List lots browse shows Part / Color / Condition / Qty — not Lot A/B/C labels ([#66](../feature/lot-entry-cockpit/sub-features/migrate-list-lots-browse/product-spec.md)) |

Cross-ref: [dcv/ux-concerns.md](../dcv/ux-concerns.md) pattern E (compact chrome, thumb zone).

---

## Out of scope (this doc)

- Route definitions, phase machine, nav visibility rules → [application-views.md](support/application-views.md)
- Role-aware shells ([#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11))

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-15 | Worker counting section (#10); removed out-of-scope note |
| 2026-06-14 | Feedback primitives section — toast, confirm, alert, skeleton (issue [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)) |
| 2026-06-13 | Initial publish — shell taxonomy, component map, breakpoints, anti-patterns (issue [#39](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/39)) |
