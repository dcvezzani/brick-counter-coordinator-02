# Product Spec — Different workflows for desktop and phone

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Different workflows for desktop and phone |
| **Status** | **Approved** |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-16 |
| **Last updated** | 2026-06-16 (UX items 2–10 + display name for all profiles) |
| **Parent work item** | [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90) |
| **Approved** | 2026-06-16 — David Vezzani (chat) |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Approved for build** |
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
- **Universal display name** — **All users** (coordinator and worker) enter a display name on Home; persisted in **`localStorage`**, pre-filled on return, editable anytime, **saved when navigating away** from Home.
- **Coordinator-driven organize transition** — When the session enters **organizing**, workers get a **toast plus sticky banner** on lot entry until they open My list (nav fallback if both dismissed).
- **Assignable organize lists** — Each worker sees **one** pick list, not every list the coordinator manages on desktop.
- **Long lists stay usable** — Workers scrolling through long put-away lists experience smooth loading (windowed/virtual scroll as they scroll).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | **Coordinator profile** on `≥ md` can run import → count → reconcile → organize → export without regression | Side-by-side walkthrough vs current `main` |
| 2 | **Phone (`< md`)** always uses worker workflow regardless of stored profile | Resize test + MCP @ 375px |
| 3 | On **`≥ md`**, Home shows **Coordinator \| Worker** radio (default Coordinator); workflow profile **persists in localStorage** | Manual + unit test |
| 4 | **All profiles:** Home **display name** field pre-filled from **`localStorage`**; value **saved when leaving Home**; user may change name on Home | Manual + unit test |
| 5 | **Worker profile:** session list → join **counting** session → lot entry | MCP / manual |
| 6 | **Worker profile** nav: **Lot, Lots, Cups, Home** (counting); **My list** replaces **Lots** (organizing) | Nav model tests |
| 7 | **Worker profile:** **SessionProgress** shows **Count → Organize → Done** only (Count-only until organizing) — no Import/Reconcile/Export steps | Visual compare vs coordinator |
| 8 | **List lots / cups** on worker profile or `< md`: **worker shell variant** (tighter frame, shorter headers) — same routes | Screenshot / DOM compare vs coordinator shell |
| 9 | Organizing: **toast + sticky banner** on lot entry until My list opened; nav fallback | UI test + manual |
| 10 | **`/session/:id/my-list`** — assigned list only; coordinator **`Select`** assign + **Unassigned**; auto-assign on organize; **Badge** on list | Fixture ≥2 lists + 2 names |
| 11 | My list **≥50 rows** uses **virtual/windowed scroll** — not full ResponsiveDataTable render | Manual scroll fixture |
| 12 | Worker line actions (moved / needs location) on My list | Unit tests |
| 13 | Waiting states: **Alert** on MarketingShell + back — no session nav | Manual worker profile |
| 14 | **`application-views.md`** + **`ui-rules.md`** updated with worker nav table + My list route | Doc review |
| 15 | Diagrams + [ux-design-notes.md](./ux-design-notes.md) match behavior | Validate walkthrough |
| 16 | `npm test` / `npm run build` pass | CI |

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
| Home | **Display name** (saved on leave) + hub + create session + profile radio (`≥ md`) | **Display name** + **session list** + profile radio (`≥ md`) |
| New session / import | Yes | No |
| Count lots | Yes (oversight) | **Primary** — lot entry cockpit |
| Browse lots / cups | Coordinator shell | **Worker shell variant** on same routes (`< md` or worker profile) |
| Reconcile | Yes | No — **Alert** waiting state |
| Organize | `/lots?mode=organizer` — all lists + **`Select`** assign | **`/session/:id/my-list`** — assigned list only |
| Export / complete | Yes | No |

### Display name (all profiles)

Every user — including a session coordinator — provides a **display name** on Home before using session features:

- Field **pre-populated** from **`localStorage`** when a name was saved previously
- User may **edit** on Home at any time
- Name **persists when navigating away** from Home to the next view (not re-prompted every visit)
- Used for organizer **assignment labels**, My list header, and joined-worker registry in storyboard fixtures

### SessionProgress (worker vs coordinator)

| | Worker profile | Coordinator profile |
|---|----------------|---------------------|
| **Steps shown** | **Count → Organize → Done** *(Organize hidden until session phase is organizing)* | Full strip (Import through Done) |
| **Coordinator-only steps** | Import, Reconcile, Export **omitted** — not shown disabled | Unchanged |
| **Clickable back steps** | Worker-reachable phases only | Existing rules |

### Key scenarios

1. **Worker on phone** — Home (`< md`, always worker) → display name (pre-filled if saved) → session list → counting session → lot entry. Lots/Cups use **worker shell variant**. SessionProgress: **Count → Organize → Done** (filtered).

2. **Coordinator on laptop** — Home → display name (same persistence) → radio **Coordinator** → hub + create session → full lifecycle. SessionProgress: full strip.

3. **Demo presenter** — Radio **Worker** on `≥ md` → worker journey at full width.

4. **Organize transition** — Coordinator declares ready to organize → auto-assign unassigned lists → **`Select`** assign + assignee **Badge** on coordinator organizer → workers on lot entry see **toast + sticky banner** (“Go to my put-away list”) until they open **`/session/:id/my-list`**. Nav: **My list** replaces **Lots**.

5. **Worker put-away** — My list only; **≥50-line** virtual scroll; moved / needs-location actions.

6. **Worker joins too early** — **Alert** on MarketingShell + back to session list (no SessionNav).

7. **Browse routes** — `/lots` (browse) and `/cups` use **profile-aware worker shell** when worker profile or `< md`; coordinator shell when coordinator profile on `≥ md`.

### Experience principles

- **Right device, right work** — Phones force worker UX; coordinators opt in on larger displays.
- **Explicit profile on large screens** — Radio + persistence avoids viewport-only surprises on tablet.
- **Coordinator authority** — Phase gates unchanged; workers are notified, not self-promoting.
- **Assignment clarity** — My list header shows assignee (display name) and list title.
- **Phase clarity (worker)** — Progress strip and nav omit coordinator-only chapters.
- **Storyboard honesty** — Push and multi-session simulated until coordinator server ships.

## Scope

### In scope

- **Display name (all profiles)** — Home name field; **`localStorage`**; pre-fill; save-on-leave; used for assignment.
- **Workflow profile system** — Phone `< md` → always worker; `≥ md` → Coordinator \| Worker radio, **`localStorage`**.
- **Worker Home** — Name + **2–3 fixture sessions**; coordinator Home adds hub + create session.
- **Worker nav** — Lot, Lots, Cups, Home (counting); **My list** replaces Lots (organizing).
- **Route `/session/:id/my-list`** — Worker assigned list only; guards block coordinator organizer URL on worker profile.
- **Filtered SessionProgress** — Worker: Count → Organize → Done; coordinator: full strip.
- **Profile-aware shell on browse** — List lots + List cups: **worker shell variant** (`SessionViewFrame variant="worker"`, shorter headers) when worker profile or `< md`; coordinator shell otherwise.
- **Waiting states** — MarketingShell **Alert** + back; no SessionNav.
- **Organize prompt** — **Toast + sticky banner** on lot entry until My list opened; nav fallback.
- **Coordinator assign** — **`Select`** (not combobox): joined names + **Unassigned**; auto-assign on organize enter; **Badge** assignee on list.
- **My list scroll** — **New virtual/windowed list** for ≥50 lines — not full `ResponsiveDataTable` render.
- **Docs (required)** — [application-views.md](../../docs/support/application-views.md): **Worker profile SessionNav table** + My list route; [ui-rules.md](../../docs/ui-rules.md): profile shells, My list, filtered progress.

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
| 2026-06-16 | **UX #2:** Worker shell variant on Lots browse + Cups — same routes, profile-aware (`< md` or worker profile). |
| 2026-06-16 | **UX #3:** Worker SessionProgress — **Count → Organize → Done** only; coordinator steps hidden. |
| 2026-06-16 | **UX #4:** Worker **`/my-list`** + nav **My list** replaces **Lots** during organizing; coordinator stays on **`?mode=organizer`**. |
| 2026-06-16 | **UX #5:** **All profiles** enter display name on Home; **`localStorage`**; pre-fill; **save on leave**; coordinator included. |
| 2026-06-16 | **UX #6:** Waiting = MarketingShell **Alert** + back — no session nav. |
| 2026-06-16 | **UX #7:** Organize = **toast + sticky banner** on lot entry until accepted. |
| 2026-06-16 | **UX #8:** Assign = **`Select`** + Unassigned + auto-assign **Badge**. |
| 2026-06-16 | **UX #9:** My list only — new virtual scroll; not ResponsiveDataTable at scale. |
| 2026-06-16 | **UX #10:** Required doc updates — worker SessionNav table in **application-views.md** + **ui-rules.md**. |

## Related documents

- UX design notes: [ux-design-notes.md](./ux-design-notes.md)
- Workflow diagrams: [workflow-diagrams.md](./workflow-diagrams.md)
- Shared phase machine: [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd)
- UX concerns: [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Role-aware shells: [feature/00-shipped/role-aware-shells/product-spec.md](../00-shipped/role-aware-shells/product-spec.md)
- Routes & phases: [docs/support/application-views.md](../../docs/support/application-views.md)
- UX designer persona: [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
