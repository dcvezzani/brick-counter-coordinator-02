# Product Spec — Different workflows for desktop and phone

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Different workflows for desktop and phone |
| **Status** | Draft — awaiting approval |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 (profile + UX review incorporated) |
| **Parent work item** | [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90) |
| **Related Tech Spec** | *(pending `/design`)* |
| **Workflow diagrams** | [workflow-diagrams.md](./workflow-diagrams.md) · [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) · [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) |
| **UX design notes** | [ux-design-notes.md](./ux-design-notes.md) |
| **Related** | [ux-concerns.md](../../dcv/ux-concerns.md) · [role-aware-shells](../00-shipped/role-aware-shells/product-spec.md) · [application-views.md](../../docs/support/application-views.md) · [session-phases-state.mmd](../../docs/session-phases-state.mmd) |

## Problem & audience

### Problem statement

Brick Counter Coordinator’s **full session workflow** — part-out import, reconciliation tables, organizer list management, export — is appropriate on a **laptop** where coordinators compare dense data and advance phase gates. The same navigation and screens are also available on **phones**, even though several coordinator activities are **too data-intensive** for a good mobile experience and are not what workers need at the counting table.

[#11 role-aware-shells](../00-shipped/role-aware-shells/product-spec.md) improved **layout density** (worker vs coordinator shells) but did **not** change **which activities** each device persona should see. A worker on a phone still encounters Reconcile, full organizer pick-list management, and import flows that belong on the coordinator’s desktop.

Workers on phones need a **narrow, task-focused journey**: pick a session, count lots, then — when the coordinator starts organizing — follow **their assigned put-away list** without wading through coordinator tooling. Coordinators on larger displays should keep today’s **full workflow** unchanged in capability.

### Who it's for

- **Primary:** Worker with a phone at the counting table — hands busy, needs fast counting and a clear organize list when told to put parts away.
- **Secondary:** Session coordinator on laptop or tablet — full import → count oversight → reconcile → organize → export workflow.
- **Tertiary:** Demo presenter — selects **Worker** profile on a laptop (via Home radio) to preview the worker journey without resizing the browser.

### Current experience (baseline)

| Aspect | Today |
|--------|--------|
| **Home** | Start/resume **one** demo session; no session list for workers joining an in-progress session |
| **Workflow profile** | None — same nav and screens at every viewport |
| **Phone nav** | Same SessionNav items as laptop (Home, Lot, Lots, Reconcile, Cups) — all phases reachable |
| **Organize** | Coordinator view shows **all** organizer pick lists on `/lots?mode=organizer`; no per-worker assignment |
| **Phase transitions** | Local/storyboard only — no push when coordinator enters organize mode |
| **Organizer lists** | Small fixture lists; no product requirement for long-list scrolling performance |
| **Backend** | No coordinator server or WebSockets yet ([PROJECT.md](../../PROJECT.md)) |

**Pain:** Workers on phones see coordinator-scale surfaces; organizers cannot **push** workers into organize mode; workers cannot tell which put-away list is **theirs**.

## Outcomes & business impact

### Desired outcomes

- **Coordinator workflow preserved** — Coordinators retain the current full session lifecycle when profile = **Coordinator** (default on `≥ md`).
- **Phone always worker** — Small phones (`< md`) **always** use the worker workflow — no accidental coordinator UI at the table.
- **Worker workflow on larger displays** — On tablet/laptop, user may choose **Worker** via Home profile radio (persisted) for demo or coordinator-as-counter scenarios.
- **Phone worker journey** — Home → display name → session list → select session → count lots → (when prompted) organize using **their** assigned list only.
- **Coordinator-driven organize transition** — When the session coordinator puts the session into **organize mode**, each connected worker is **prompted** to move to their list view (production: real-time push; storyboard: simulated equivalent).
- **Assignable organize lists** — Each worker sees **one** pick list, not every list the coordinator manages on desktop.
- **Long lists stay usable** — Workers scrolling through long put-away lists experience smooth loading (windowed/virtual scroll as they scroll).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | **Coordinator profile** on `≥ md` can run import → count → reconcile → organize → export without regression | Side-by-side walkthrough vs current `main` |
| 2 | **Phone (`< md`)** always uses worker workflow regardless of stored profile | Resize test + MCP @ 375px |
| 3 | On **`≥ md`**, Home shows **Coordinator \| Worker** radio (default Coordinator); choice **persists in localStorage** across refresh | Manual + unit test on profile store |
| 4 | **Worker profile:** user enters display name, sees **2–3 sessions**, selects one in **counting**, lands on lot entry | MCP / manual |
| 5 | **Worker profile** nav: **Lot, Lots, Cups, Home** while counting; **My list** replaces Lots during **organizing** — no Reconcile, Import, Export, or coordinator organizer | Nav model tests + manual |
| 6 | **Worker profile:** filtered **SessionProgress** shows worker-reachable phases only (not full Import/Reconcile/Export strip) | Visual compare vs coordinator profile |
| 7 | Organizing phase: **dismissible toast** with action to **My list**; nav fallback if dismissed | Storyboard simulation + UI test |
| 8 | **`/session/:id/my-list`** shows **only assigned list**; coordinator assigns on organizer; unassigned lists **auto-assign** | Fixture with ≥2 lists + 2 workers |
| 9 | Assigned list **≥50 rows** scrolls without upfront render of all rows | Manual scroll on fixture |
| 10 | Worker marks line status (moved / needs location) on My list — same semantics as organizer rows | Manual + unit tests |
| 11 | Import/reconcile waiting states use **Alert + back to list** — not coordinator screens | Manual on worker profile |
| 12 | Workflow diagrams + [ux-design-notes.md](./ux-design-notes.md) match shipped behavior | Doc review + Validate walkthrough |
| 13 | `npm test` / `npm run build` pass | CI |

### Business impact

Aligns the product with real-world **multi-device counting sessions**: coordinator at laptop, workers at the table on phones. Profile radio fixes demo friction and tablet ambiguity. Reduces wrong-surface friction and sets contracts for the future coordinator server. No revenue impact — storyboard milestone with production-shaped boundaries.

## User experience & scenarios

### Workflow profile (how the app picks coordinator vs worker)

| Viewport | Rule |
|----------|------|
| **Phone (`< md`, ~375px)** | **Always worker** — effective profile is worker even if `localStorage` says coordinator |
| **Tablet / laptop (`≥ md`)** | **Profile radio** on Home: **Coordinator** (default) \| **Worker** — persisted in **`localStorage`** |

Same URLs; **effective profile** drives nav scope, route guards, Home layout, SessionProgress filter, and shell density on browse routes. See [ux-design-notes.md](./ux-design-notes.md).

### Workflow diagrams (Plan deliverable)

| Persona | Diagram | When it applies |
|---------|---------|-----------------|
| **Coordinator** | [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) | Profile = **Coordinator** (default on `≥ md`) |
| **Worker** | [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) | Phone **always**; or profile = **Worker** on `≥ md` |

Index: [workflow-diagrams.md](./workflow-diagrams.md). [session-phases-state.mmd](../../docs/session-phases-state.mmd) remains the **shared phase machine**.

### Workflow split (product intent)

| Activity | Coordinator profile | Worker profile |
|----------|----------------------|----------------|
| Home | Hub + create session + profile radio (`≥ md`) | Display name + **session list** (+ radio on `≥ md`) |
| New session / import | Yes | No |
| Count lots | Yes (oversight) | **Primary** — lot entry cockpit |
| Browse lots / cups | Yes — coordinator shell | Yes — **worker shell variant**; Lot + Lots + Cups nav |
| Reconcile | Yes | No — waiting state if session phase is reconciling |
| Organize | All lists + assign workers on `/lots?mode=organizer` | **Assigned list only** on **`/session/:id/my-list`** |
| Export / complete | Yes | No |

### Key scenarios

1. **Worker on phone** — Opens Home (`< md`) → **always worker** → enters display name → session list → joins session in **counting** → lot entry. Nav: Lot, Lots, Cups, Home. SessionProgress: **filtered** (Count-focused).

2. **Demo presenter on laptop** — Sets Home radio to **Worker** (stored in `localStorage`) → same worker journey at full width without DevTools resize.

3. **Coordinator on laptop** — Radio **Coordinator** (default) → existing hub, new session, full lifecycle unchanged.

4. **Coordinator starts organize** — Declare ready to organize → auto-assign unassigned lists → workers get **dismissible toast** → **Go to my put-away list** → `/session/:id/my-list`. Nav: **My list** replaces **Lots** during organizing.

5. **Worker put-away** — My list view: one assigned list, moved/needs-location actions, **≥50-line** virtual/windowed scroll.

6. **Worker joins too early** — Session in importing or reconciling → **Alert** (“not ready yet”) + back to session list — no coordinator tables.

7. **Lots/Cups on worker profile** — Same routes as today but **worker shell density** (not coordinator dashboard chrome).

### Experience principles

- **Right device, right work** — Phones force worker UX; coordinators opt in on larger displays.
- **Explicit profile on large screens** — Radio + persistence avoids viewport-only surprises on tablet.
- **Coordinator authority** — Phase gates unchanged; workers are notified, not self-promoting.
- **Assignment clarity** — My list header shows assignee (display name) and list title.
- **Phase clarity (worker)** — Progress strip and nav omit coordinator-only chapters.
- **Storyboard honesty** — Push and multi-session simulated until coordinator server ships.

## Scope

### In scope

- **Workflow profile system** — Phone `< md` → always worker; `≥ md` → Coordinator \| Worker radio on Home, default Coordinator, **`localStorage`** persistence.
- **Workflow diagrams + UX notes** — [workflow-diagrams.md](./workflow-diagrams.md), [ux-design-notes.md](./ux-design-notes.md), `.mmd` journey maps.
- **Worker Home** — Display name + **2–3 fixture sessions** at different phases.
- **Coordinator Home (`≥ md`)** — Existing hub + profile radio.
- **Worker nav model** — Lot, Lots, Cups, Home (counting); **My list** replaces Lots (organizing); no Reconcile/Import/Export.
- **New route: `/session/:id/my-list`** — Worker assigned pick list only (not coordinator `/lots?mode=organizer`).
- **Filtered SessionProgress** — Worker profile shows worker-reachable steps only.
- **Worker shell on browse routes** — List lots + List cups use worker-density chrome when profile = worker (or phone).
- **Waiting states** — Alert + back for import/reconcile phases on worker profile.
- **Organize prompt** — Dismissible toast + nav fallback; Design may bias action for thumb reach.
- **Coordinator assign UI** — Per-list worker assignee on organizer view; unassigned auto-assign.
- **Virtual/windowed scroll** — My list for ≥50 lines (not full `ResponsiveDataTable` render).
- **Docs updates** — [application-views.md](../../docs/support/application-views.md) and [ui-rules.md](../../docs/ui-rules.md) — worker profile nav + My list route.

### Out of scope

- **Production coordinator server / WebSockets** — contracts + storyboard simulation only.
- **Authentication / RBAC** — display name is fixture join identity.
- **BrickLink API**, reconciliation algorithm, lot entry cockpit redesign.
- **Phase machine transition changes** — same gates; profile changes **surfaces and nav** only.
- **Native mobile apps.**

### Dependencies

- **Complete:** #6 mobile-session-chrome, #10 lot-entry-cockpit, #11 role-aware-shells.
- **Informed by:** [dcv/ux-concerns.md](../../dcv/ux-concerns.md), [ux-design-notes.md](./ux-design-notes.md).

## Constraints (non-technical where possible)

- **Phase machine** — [session-phases-state.mmd](../../docs/session-phases-state.mmd) gates unchanged; **application-views.md** updated for profile-specific nav and My list route.
- **Breakpoint** — Project `md` (768px) separates phone-always-worker from profile radio.
- **JavaScript client** — no TypeScript in Vue SFCs.
- **Touch targets** — existing min-height / no `xs` on primary row actions.
- **AIDLC:** Product Spec approval before `/design`.

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-16 | Feature slug: `diff-workflows-for-desktop-and-phone`. Issue [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90). |
| 2026-06-16 | **Seed intent:** Desktop coordinator workflow preserved; phone worker = session list → count → organize prompt → assigned list with lazy scroll. |
| 2026-06-16 | **Separate workflow diagrams** — coordinator vs worker journeys; shared phase machine in `docs/session-phases-state.mmd`. |
| 2026-06-16 | **Worker identity:** free-text **display name** on join. |
| 2026-06-16 | **List assignment:** coordinator assigns; **unassigned auto-assign**. |
| 2026-06-16 | **Worker counting nav:** Lot + List lots + Cups. |
| 2026-06-16 | **Organize prompt:** dismissible toast + nav fallback. |
| 2026-06-16 | **Long-list fixture:** ≥50 lines; virtual/windowed scroll on My list. |
| 2026-06-16 | **Home session list:** 2–3 fixture sessions. |
| 2026-06-16 | **Profile (Dave):** Phone `< md` → **always worker**. `≥ md` → **Coordinator \| Worker radio** (default Coordinator), persisted in **`localStorage`**. |
| 2026-06-16 | **UX review incorporated** — My list route, filtered progress, worker shell on browse, waiting Alert pattern, doc updates — see [ux-design-notes.md](./ux-design-notes.md). |

## Related documents

- UX design notes: [ux-design-notes.md](./ux-design-notes.md)
- Workflow diagrams: [workflow-diagrams.md](./workflow-diagrams.md)
- Shared phase machine: [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd)
- UX concerns: [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Role-aware shells: [feature/00-shipped/role-aware-shells/product-spec.md](../00-shipped/role-aware-shells/product-spec.md)
- Routes & phases: [docs/support/application-views.md](../../docs/support/application-views.md)
- UX designer persona: [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
