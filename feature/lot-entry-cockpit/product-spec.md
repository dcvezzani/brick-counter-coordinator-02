# Product Spec — Lot entry cockpit

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Lot entry cockpit — mobile-first counting screen |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-14 |
| **Last updated** | 2026-06-15 |
| **Approved** | 2026-06-15 — David Vezzani |
| **Prior art** | [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) — `LotForm`, part/color pickers |
| **Related Tech Spec** | *(pending `/design`)* |
| **Work item** | [#10 Lot entry cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) |
| **Related** | [ux-roadmap.md](../ux-roadmap.md) · [dcv/ux-concerns.md](../../dcv/ux-concerns.md) (pattern E) · [application-views.md](../../docs/support/application-views.md) · [storyboard-ui](../00-shipped/storyboard-ui/product-spec.md) · [#9 UI feedback primitives](../00-shipped/ui-feedback-primitives/product-spec.md) · [#11 Role-aware shells](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) |

## Problem & audience

### Problem statement

**Lot entry** is the primary **worker** screen during the counting phase — used at the table, often one-handed, with parts in front of the user. Today it is a **read-only lot table** with a storyboard placeholder (“Production will add lot entry forms here”). That matches a coordinator dashboard pattern, not a counting workflow.

Workers need to **identify a part**, **color**, and **condition**, enter a **count**, and **save** — in whatever order matches the physical pile on the table, not a forced march through the import list. A **lot** is not a user-assigned label like “Lot A”; it is the unique combination **part id + color id + condition**. Saving the same combination again should add to (or update) that lot’s count, not create a parallel row with a different name. On a phone, shared session chrome (progress strip, nav, title, description, bordered frame) pushes counting controls **below the fold** — the opposite of what the workflow demands ([dcv/ux-concerns.md](../../dcv/ux-concerns.md) concerns 2, 7; pattern E).

This Feature delivers a **dedicated counting cockpit** on `/session/:sessionId/lot` as the default experience during `counting`, replacing the read-only table as the primary UX while preserving phase rules, routes, and the **Compare with Part-Out List** gate to reconciliation.

### Who it's for

- **Primary:** Worker (or coordinator acting as counter) entering quantities into lots during **counting** — phone-first, thumb-zone actions.
- **Secondary:** Demo presenter — can narrate “this is how counting feels on a phone” without apologizing for a spreadsheet.
- **Tertiary:** Future production users when the coordinator server syncs counts — same screen contract, real persistence later.

### Current experience (baseline)

| Aspect | Today (coordinator-02 storyboard) |
|--------|-----------------------------------|
| Layout | `SessionViewFrame` + `ViewHeader` + `ResponsiveDataTable` (read-only lots) |
| Lot model | Fixture rows use `label` (Lot A/B/C), `partId`, color **name** string, `quantity` — no `colorId` or `condition` |
| Data entry | None — muted note says forms are future |
| Required counting fields | Not captured — part id, color id, condition, count are all missing |
| Phase gate | Sticky **Compare with Part-Out List** when `phase === 'counting'` (unchanged behavior required) |
| Browse lots | Separate **List lots** route in SessionNav |
| Feedback | [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) toasts/confirm available for consumers |

**Prior art (sibling app):** [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) already implements lot entry with **part id**, **color id**, **condition**, and **count** via `LotForm.vue`, using searchable pickers for part and color. This Feature should **reuse that interaction model** in coordinator-02 (port/adapt components — Design detail).

Responsive cards for lot browse were a **stopgap** ([#28](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/28)); this Feature supersedes them as the **primary** lot-entry experience, not an incremental table tweak.

## Outcomes & business impact

### Desired outcomes

- **Counting feels like counting** — part + color + condition + count in one focused form, large quantity control, clear save — not a read-only grid.
- **Correct lot identity** — each saved lot is keyed by **part id + color id + condition**; duplicate triples merge or prompt (Design aligns with sibling `LotForm` duplicate behavior).
- **Mobile-first** — primary actions in thumb zone; minimal vertical chrome on this screen; counting content starts near the top on a short viewport.
- **Free-form order, objective finish** — workers count parts in any order; the session still holds the **part-out list** for **Compare with Part-Out List** / reconciliation at the end.
- **Storyboard demo is credible** — presenter can search a part, pick color, confirm condition, set count, and save using fixture data (no backend).
- **Coordinator path preserved** — **Compare with Part-Out List** remains the phase gate to reconciliation; SessionNav and progress strip unchanged.
- **Foundation for production** — same route and view; later Features swap in API sync, part search, and swipe input without redesigning the screen.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Lot entry shows a **counting cockpit** with **part id**, **color id**, **condition**, and **count** — not a read-only lot table | Manual phone + laptop walkthrough; screenshot evidence |
| 2 | User can set all four fields and **Save**; session lot data stores **part id**, **color id**, **condition**, and **count** | Manual test + unit test |
| 3 | Saving the same **part + color + condition** again updates that lot (merge/add qty) rather than creating an unrelated duplicate row | Manual test + unit test |
| 4 | **Part search** favors part-out list lines first; picker resolves **part id** from searchable name/number | Manual test |
| 5 | **Color picker** resolves **color id** from searchable color name (enabled after part is chosen) | Manual test |
| 6 | **Save** gives clear feedback (success toast per [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) rules) | Manual + test |
| 7 | After **Save**, user can count another part/color without leaving the route | Manual test |
| 8 | **Compare with Part-Out List** still appears only in `counting` phase and advances to `reconciling` | Existing `LotEntryView` tests updated + manual |
| 9 | Touch targets on primary cockpit actions meet mobile policy (no `size="xs"` on primary actions) | Code review + ui-rules |
| 10 | Counting content is usable on ~375px width without horizontal scroll for core controls | Chrome DevTools / MCP mobile viewport |
| 11 | `npm test` / `npm run build` pass | CI |

### Business impact

Addresses the **largest remaining P2 UX gap** on the roadmap — core worker experience. Unblocks [#11 Role-aware shells](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) by proving a worker-optimized layout on a real screen. No revenue impact; **demo credibility** and **production UI contract** for counting.

## User experience & scenarios

### What is a “lot”?

A **lot** is one inventory bucket identified by:

| Field | Meaning |
|-------|---------|
| **Part id** | BrickLink-style part number (e.g. `3001`) |
| **Color id** | BrickLink color id (numeric) |
| **Condition** | New or Used (`N` / `U` in storage; shown as “New” / “Used” in UI) |

**Count** is the quantity in that bucket. Two saves with the same part + color + condition refer to the **same lot** (quantities combine — sibling app prompts on duplicate; Design confirms storyboard behavior).

This replaces the current storyboard fiction of user-named lots (“Lot A”, “Lot B”).

### Counting workflow (approved)

Counting is **free-form**: the worker enters **part → color → condition → count** in any order that matches the table. The **part-out list** from import is the **objective checklist** at **Compare with Part-Out List** / reconciliation — not a forced queue.

1. **Part id** — search by part number or name; results **favor lines from the session part-out list**; selection sets **part id** (not just display text).
2. **Color id** — after part is chosen, search/select color by name; selection sets **color id** (with color swatch where available).
3. **Condition** — required on every lot; may default from session rules (e.g. all-new or all-used part-out) or be choosable when the session allows mixed — Design aligns with sibling `LotForm` / `resolveDefaultLotCondition` behavior unless product revises in chat.
4. **Count** — large `+` / `−` stepper (coordinator-02 uses buttons, not swipe — see Decisions).
5. **Save** — persist lot (four fields); brief success toast.
6. **Count another** — form ready for next entry; user picks part/color again as needed.

There is **no “end of list”** — workers finish when ready, then **Compare with Part-Out List**.

Users who need a **tabular overview** of saved lots use **Lots** in SessionNav — list presentation may need to show part/color/condition instead of Lot A/B/C labels (Design scope).

### Picker UX (prior art — adopt, don’t reinvent)

The sibling **brick-counter-coordinator** app already solves “find by name, store id” for parts and colors. **Plan intent:** port or adapt these components into coordinator-02 for this Feature:

| Component | Role |
|-----------|------|
| `FilterablePicker.vue` | Shared filterable dropdown (search panel, keyboard, debounce) |
| `PartSearchCombobox.vue` | Part number search → sets **part id**; shows resolved part name |
| `ColorPicker.vue` | Color name search → sets **color id**; color swatch in trigger and list |

`/design` owns porting details (dependencies: `useSession` / catalog data, `app-config`, color swatch helpers, JS-only constraint). Product requirement: **same user-facing behavior** — searchable labels, stored ids.

### Key scenarios

1. **Worker counts at the table (phone)** — Session in `counting` → search part **3023** (part-out line favored) → pick **Blue** color → condition shows **Used** (session default) → tap `+` for count → **Save** → toast → search next part in any order → **Compare with Part-Out List** when done.

2. **Same part, different color** — Worker saves `3001` + Red + Used + 10, then `3001` + Blue + Used + 4 → **two lots** (different color ids).

3. **Duplicate triple** — Worker saves `3023` + Blue + Used + 5, then same triple again → qty merges or confirm dialog (per sibling behavior).

4. **Coordinator spot-check (laptop)** — Same cockpit on wide viewport; pickers and `+` / `−` usable with pointer/keyboard; **Compare** CTA in sticky footer.

5. **Demo walkthrough** — Presenter counts one part with real pickers (not placeholder table) → mobile viewport → Compare.

6. **Wrong phase** — Session not in `counting` → cockpit hidden or read-only; **Compare** not shown.

7. **Browse vs count** — **Lots** nav shows saved lots by part/color/condition; **Lot** nav is the counting cockpit.

### Experience principles

- **Worker-first on this route** — Reduce nonessential chrome on lot entry compared to coordinator views; counting controls above the fold on phone ([pattern E](../../dcv/ux-concerns.md), concern 7).
- **One lot identity in focus** — part + color + condition defines the bucket; count is the value being entered.
- **Ids in storage, names in UI** — users search by familiar names/numbers; system stores part id and color id.
- **Thumb zone** — Primary actions (quantity, save, part pick) and sticky **Compare** reachable without precision tapping.
- **Part-out list is the scorecard, not the queue** — counting order is flexible; reconciliation compares totals against import lines.
- **Honest storyboard** — Fixture data only; labels make clear when behavior is simulated (no fake BrickLink images required).
- **Feedback on save** — Transient success toast; errors inline or toast per [ui-rules.md](../../docs/ui-rules.md) § Feedback.
- **Accessible** — Quantity and lot controls keyboard-operable; part context in headings/labels for screen readers (audit depth in Design).

## Scope

### In scope

- **Replace primary lot-entry content** on `LotEntryView` with counting cockpit capturing **part id**, **color id**, **condition**, and **count**.
- **Port/adapt picker components** from sibling `brick-counter-coordinator`: `FilterablePicker`, `PartSearchCombobox`, `ColorPicker` (plus supporting catalog/session search — Design scope).
- **Part search (storyboard)** — rank session part-out lines first; resolve to **part id**.
- **Color search** — colors for selected part; resolve to **color id**; disabled until part chosen.
- **Condition** — required field on every lot record; session-level defaults when part-out is new-only or used-only (sibling pattern).
- **Storyboard lot model** — migrate fixtures and in-memory session from `label`/`color` name strings to **part id + color id + condition + count** (Design defines reconciliation impact).
- **Duplicate lot handling** — same part + color + condition merges qty or confirms (align with sibling `LotForm`).
- **Compact worker presentation** on lot entry — less vertical chrome than coordinator views (e.g. shorter description, tighter frame); full **SessionWorkerShell** taxonomy deferred to [#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11).
- **Quantity control** — large `+` / `−` stepper with shadcn-sized buttons (minimum `default` on phone).
- **Success toast on save** using [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) `feedback.js` helpers.
- **Preserve** sticky **Compare with Part-Out List** in `ViewActions` when `phase === 'counting'`.
- **Preserve** route `/session/:sessionId/lot`, phase landing, SessionNav visibility rules.
- Unit tests for save, part/color id resolution, duplicate triple, part-out search favoritism, and unchanged Compare gate.
- Update [docs/ui-rules.md](../../docs/ui-rules.md) — remove “out of scope” note for lot cockpit; add worker counting section (or pointer to rules added in Design).
- Optional: update [application-views.md](../../docs/support/application-views.md) one-line description of lot entry role (counting cockpit vs browse).

### Out of scope

- **SwipeNumberInput** / `SteppedSwipeNumberInput` — deferred; coordinator-02 uses `+` / `−` only (sibling app uses swipe — intentional divergence for this Feature).
- **Full live BrickLink catalog API** — storyboard uses fixture/session-scoped part and color data; production catalog wiring is a later Feature.
- **Coordinator server**, WebSockets, multi-device sync, conflict resolution.
- **Changing phase machine** or adding backward navigation ([#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53)).
- **Full role-aware shell taxonomy** ([#11](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11)) — this Feature proves worker layout on one screen only.
- **List lots / List cups** presentation changes.
- **Reconciliation** compare logic — cockpit only prepares lot data storyboard-side.
- **Playwright e2e** — Vitest + MCP/manual UI validation acceptable.
- **`config/app-preferences.json` loader** — not required for storyboard cockpit defaults.

### Dependencies on other teams or features

- **Complete:** [#5 consolidate-and-clean-ui](../00-shipped/consolidate-and-clean-ui/product-spec.md) — `ViewHeader`, `ViewActions`, `SessionViewFrame`.
- **Complete:** [#6 mobile-session-chrome](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/6) — sticky CTAs, bottom nav, safe areas.
- **Complete:** [#9 ui-feedback-primitives](../00-shipped/ui-feedback-primitives/product-spec.md) — toasts for save feedback.
- **Informed by:** [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) — `LotForm.vue`, picker components, lot identity and duplicate rules.
- **Softly blocks:** [#11 Role-aware shells](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) — worker shell patterns proven here first.

## Constraints (non-technical where possible)

- **Route and phase rules unchanged** — [application-views.md](../../docs/support/application-views.md), [session-phases-state.mmd](../../docs/session-phases-state.mmd).
- **JavaScript client** — no TypeScript in Vue SFCs ([ADR-0001](../../adr/0001-frontend-vue-js-shadcn-stack.md)).
- **Storyboard fixtures must gain** `colorId` and `condition` on lots; part-out lines may need color ids for reconcile — Design migrates `demo-session.js` and dependent views.
- **AIDLC:** Product Spec approval before `/design`.
- **Parent issue** [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) links to `feature/lot-entry-cockpit/`.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-14 | Feature slug: `lot-entry-cockpit`. |
| 2026-06-15 | **Lot identity:** unique **part id + color id + condition**; count is quantity in that bucket (not Lot A/B/C labels). |
| 2026-06-15 | **Required counting fields:** part id, color id, condition, count — all four on every save. |
| 2026-06-15 | **Pickers:** adopt sibling `FilterablePicker`, `PartSearchCombobox`, `ColorPicker` — search by name/number, store ids (Design ports into coordinator-02). |
| 2026-06-15 | **Counting workflow:** free-form order — any part/color/condition combination, any sequence. Part-out list is for objective compare at reconciliation, not a forced queue. |
| 2026-06-15 | **Part search:** favor part numbers from the session part-out list first; full BrickLink catalog deferred. |
| 2026-06-15 | **Quantity control:** `+` / `−` stepper only; SwipeNumberInput deferred. |
| 2026-06-15 | **No “end of list” / Next part** — after Save, user picks the next part manually; phase gate is **Compare with Part-Out List** when counting is done. |
| 2026-06-15 | **Read-only table removed** from lot entry; browse stays on List lots route. |
| 2026-06-15 | **Compact chrome** on lot entry in #10; full role-aware shells remain #11. |
| 2026-06-15 | Product Spec **approved** by David Vezzani — ready for `/design`. |

## Related documents

- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md)
- UX concerns (pattern E): [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Routes & phases: [docs/support/application-views.md](../../docs/support/application-views.md)
- UI rules: [docs/ui-rules.md](../../docs/ui-rules.md)
- Tech stack (future preferences): [docs/tech-stack.md](../../docs/tech-stack.md)
- Prior art (sibling app): [brick-counter-coordinator](https://github.com/dcvezzani/brick-counter-coordinator) — `src/components/FilterablePicker.vue`, `ColorPicker.vue`, `PartSearchCombobox.vue`, `LotForm.vue`
- Storyboard routes: [storyboard-ui](../00-shipped/storyboard-ui/product-spec.md)
- Issue: [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
