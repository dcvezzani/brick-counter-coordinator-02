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
| **Last updated** | 2026-06-16 |
| **Parent work item** | [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90) |
| **Related Tech Spec** | *(pending `/design`)* |
| **Workflow diagrams** | [workflow-diagrams.md](./workflow-diagrams.md) · [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) · [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) |
| **Related** | [ux-concerns.md](../../dcv/ux-concerns.md) · [role-aware-shells](../00-shipped/role-aware-shells/product-spec.md) · [application-views.md](../../docs/support/application-views.md) · [session-phases-state.mmd](../../docs/session-phases-state.mmd) |

## Problem & audience

### Problem statement

Brick Counter Coordinator’s **full session workflow** — part-out import, reconciliation tables, organizer list management, export — is appropriate on a **laptop** where coordinators compare dense data and advance phase gates. The same navigation and screens are also available on **phones**, even though several coordinator activities are **too data-intensive** for a good mobile experience and are not what workers need at the counting table.

[#11 role-aware-shells](../00-shipped/role-aware-shells/product-spec.md) improved **layout density** (worker vs coordinator shells) but did **not** change **which activities** each device persona should see. A worker on a phone still encounters Reconcile, full organizer pick-list management, and import flows that belong on the coordinator’s desktop.

Workers on phones need a **narrow, task-focused journey**: pick a session, count lots, then — when the coordinator starts organizing — follow **their assigned put-away list** without wading through coordinator tooling. Coordinators on desktop should keep today’s **full workflow** unchanged in capability.

### Who it's for

- **Primary:** Worker with a phone at the counting table — hands busy, needs fast counting and a clear organize list when told to put parts away.
- **Secondary:** Session coordinator on laptop — full import → count oversight → reconcile → organize → export workflow (today’s experience preserved).
- **Tertiary:** Demo presenter — can show “worker phone” vs “coordinator laptop” as distinct product stories in the same session.

### Current experience (baseline)

| Aspect | Today |
|--------|--------|
| **Home** | Start/resume **one** demo session; no session list for workers joining an in-progress session |
| **Phone nav** | Same SessionNav items as laptop (Home, Lot, Lots, Reconcile, Cups) — all phases reachable |
| **Organize** | Coordinator view shows **all** organizer pick lists on `/lots?mode=organizer`; no per-worker assignment |
| **Phase transitions** | Local/storyboard only — no push when coordinator enters organize mode |
| **Organizer lists** | Small fixture lists; no product requirement for long-list scrolling performance |
| **Backend** | No coordinator server or WebSockets yet ([PROJECT.md](../../PROJECT.md)) |

**Pain:** Workers on phones see coordinator-scale surfaces; organizers cannot **push** workers into organize mode; workers cannot tell which put-away list is **theirs**.

## Outcomes & business impact

### Desired outcomes

- **Desktop workflow preserved** — Coordinators retain the current full session lifecycle on laptop-sized viewports without losing import, reconcile, organizer setup, or export.
- **Phone worker workflow** — On phone, workers follow a **short path**: Home → session list → select session → count lots → (when prompted) organize using **their** assigned list only.
- **Coordinator-driven organize transition** — When the session coordinator puts the session into **organize mode**, each connected worker is **prompted** to move to the organize view (production: real-time push; storyboard: simulated equivalent).
- **Assignable organize lists** — Each worker sees **one** pick list (or clearly labeled assignment), not every list the coordinator manages on desktop.
- **Long lists stay usable** — Workers scrolling through long put-away lists experience smooth loading (content loads as they scroll — no “load everything at once” stall).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | On **laptop/desktop**, coordinator can still run import → count → reconcile → organize → export without regression | Side-by-side walkthrough vs current `main` behavior |
| 2 | On **phone** (~375px), worker can open Home, see a **session list**, select a session, and land in **counting** (lot entry) | MCP / manual mobile validation |
| 3 | On phone, worker **does not** need coordinator-only screens (import, reconcile, export) to complete count → organize work | Nav/route scope check on phone worker profile |
| 4 | When session enters **organizing** phase, worker on phone receives a **visible prompt** to open organize view | Storyboard simulation + UI test |
| 5 | Worker organize view shows **only their assigned list** (not all coordinator lists) | Fixture with ≥2 lists + 2 workers; worker A sees list A only |
| 6 | Assigned list with **many rows** (product threshold TBD) scrolls without loading the full list upfront — user perceives continuous scroll | Manual scroll test on long fixture list |
| 7 | Worker can mark organize line status (moved / needs location) on their list — same semantics as today’s organizer rows | Manual + unit tests on worker organize view |
| 8 | **Coordinator laptop** and **worker phone** workflow diagrams exist, are linked from the Product Spec, and match implemented behavior after Build | Doc review + Validate walkthrough vs [workflow-diagrams.md](./workflow-diagrams.md) |
| 9 | `npm test` / `npm run build` pass | CI |

### Business impact

Aligns the product with real-world **multi-device counting sessions**: coordinator at laptop, workers at the table on phones. Reduces wrong-surface friction and sets contracts for the future coordinator server (session list, worker identity, list assignment, phase push). Demo credibility for stakeholder walkthroughs. No revenue impact — storyboard milestone with production-shaped boundaries.

## User experience & scenarios

### Workflow diagrams (Plan deliverable)

Persona-specific journey maps live in the feature folder and are **required Plan outputs** before Design:

| Persona | Diagram | What it shows |
|---------|---------|---------------|
| **Session coordinator (laptop)** | [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) | Full hub → new session → import → count oversight → reconcile → **all** organizer lists (assign workers) → export → closed; push to workers when organizing starts |
| **Worker (phone)** | [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) | Session list → count (lot entry) → **prompt** on organize phase → **assigned** pick list only; blocked/waiting states for import and reconcile |

Index and relationship to the shared phase machine: [workflow-diagrams.md](./workflow-diagrams.md). The existing [session-phases-state.mmd](../../docs/session-phases-state.mmd) remains the **canonical phase transition diagram** for the whole session; these new diagrams show **which screens each persona sees** at each phase.

### Workflow split (product intent)

| Activity | Desktop (coordinator) | Phone (worker) |
|----------|----------------------|----------------|
| Home / session discovery | Full hub + create session | **Session list** — pick active session |
| New session / import | Yes | **Out of scope** on phone worker path |
| Count lots | Yes (oversight) | **Primary** — lot entry cockpit |
| Browse all lots / cups | Yes | Optional / reduced *(TBD — see questions)* |
| Reconcile | Yes | **Not on worker phone path** |
| Organize — manage lists | Yes — all lists, coordinator tools | **Assigned list only** |
| Export / complete session | Yes | **Not on worker phone path** |

### Key scenarios

1. **Worker joins a session on phone** — Worker opens Home → sees sessions they can join → taps a session in **counting** phase → lands on lot entry → counts parts with existing cockpit ([#10](../00-shipped/lot-entry-cockpit/product-spec.md)).

2. **Coordinator keeps working on laptop** — Same session: coordinator uses reconcile, organizer setup, and export on desktop — **unchanged** full workflow.

3. **Coordinator starts organize** — Coordinator declares ready to organize (existing phase gate). Each worker’s phone shows a **prompt** (toast, banner, or dialog — Design) offering **Go to my put-away list**. Accepting navigates to worker organize view.

4. **Worker put-away** — Worker sees **their** list title and lines; marks lines moved or needs location; scrolls a long list without the UI freezing on initial load.

5. **Worker misses the prompt** — Worker can still reach organize view from phone worker nav while session is in **organizing** phase *(exact affordance TBD)*.

6. **Session not in worker-visible phase** — Worker selects a session still in import or reconcile → sees clear message (not coordinator screens) *(copy TBD)*.

### Experience principles

- **Right device, right work** — Data-heavy comparison and batch coordination stay on desktop; phones optimize for counting and following a single put-away list.
- **Coordinator authority** — Phase changes (especially into organize) are coordinator-driven; workers are **notified**, not self-promoting session phase.
- **Assignment clarity** — Worker always knows which list is theirs (title, worker name, or badge).
- **No trap doors** — Worker can return to counting when phase allows (existing backward rules) without seeing reconcile tables on phone.
- **Storyboard honesty** — Until the coordinator server ships, behavior is **simulated** with fixtures and local events, but user-visible contracts match production intent.

## Scope

### In scope

- **Workflow diagrams (Plan)** — Separate updated diagrams for coordinator laptop and worker phone journeys ([coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd), [worker-phone-workflow.mmd](./worker-phone-workflow.mmd), index [workflow-diagrams.md](./workflow-diagrams.md)). Update diagrams if product decisions change before approval; Design may promote copies to `docs/` when routes stabilize.
- **Phone worker workflow** — Home session list → select session → count → organize (assigned list), with reduced nav vs desktop coordinator.
- **Desktop coordinator workflow** — Preserve current full lifecycle and surfaces on laptop/desktop viewports.
- **Worker organize view** — Phone-appropriate presentation of **one assigned** pick list with existing line actions (moved / needs location).
- **Organize-mode prompt** — When session phase becomes `organizing`, workers receive a prompt to open their organize view (storyboard: simulated push).
- **Per-worker list assignment** — Data model and UX for mapping workers to organizer lists *(assignment rules TBD in conversation)*.
- **Long-list scrolling** — Worker organize list remains responsive when the assigned list has many lines (lazy loading as user scrolls).
- **Fixture / storyboard support** — Demo data for multiple sessions, multiple workers, multiple organizer lists, and at least one long list for scroll validation.

### Out of scope

- **Building the production coordinator Node server** — this Feature defines **contracts and storyboard simulation**; server implementation may be a separate Feature.
- **Authentication / login / RBAC** — worker identity may be fixture-based until auth Feature exists.
- **BrickLink live API**, export XML implementation changes, reconciliation algorithm changes.
- **Redesigning lot entry cockpit** — reuse [#10](../00-shipped/lot-entry-cockpit/product-spec.md) and [#83](../00-shipped/new-counter-input-control/product-spec.md).
- **Changing phase machine transitions** — same gates (Compare, Declare ready to organize, etc.); only **who sees which screens** changes by device/workflow profile.
- **Native mobile apps** — responsive web only.

### Dependencies on other teams or features

- **Complete:** [#6 mobile-session-chrome](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/6), [#10 lot-entry-cockpit](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10), [#11 role-aware-shells](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/11) — layout and counting baseline.
- **Informed by:** [dcv/ux-concerns.md](../../dcv/ux-concerns.md) three-mode table (Setup / Counting / Coordination).
- **Future:** Coordinator server + WebSockets Feature consumes push and assignment contracts defined here.

## Constraints (non-technical where possible)

- **Phase machine** — [session-phases-state.mmd](../../docs/session-phases-state.mmd) and [application-views.md](../../docs/support/application-views.md) remain source of truth for phases and landing routes.
- **JavaScript client** — no TypeScript in Vue SFCs.
- **Touch targets** — phone worker UI follows existing min-height / no `xs` row action policy.
- **AIDLC:** Product Spec approval before `/design`.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-16 | Feature slug: `diff-workflows-for-desktop-and-phone`. Branch: `feature/diff-workflows-for-desktop-and-phone`. |
| 2026-06-16 | **Seed intent (Dave):** Desktop keeps full workflow; phone worker path = Home session list → select session → count → organizer prompt on organize phase → assigned list with lazy scroll. |
| 2026-06-16 | **Plan includes separate workflow diagrams** for coordinator laptop and worker phone — see [workflow-diagrams.md](./workflow-diagrams.md). Shared phase machine stays in `docs/session-phases-state.mmd`. |
| *(pending)* | How worker vs coordinator profile is chosen (viewport, URL, fixture toggle, etc.) |
| *(pending)* | List assignment rules (coordinator assigns, round-robin, fixed fixture) |
| *(pending)* | Whether phone workers may browse Lots/Cups during counting |

## Related documents

- Workflow diagrams: [workflow-diagrams.md](./workflow-diagrams.md) · [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) · [worker-phone-workflow.mmd](./worker-phone-workflow.mmd)
- Shared phase machine: [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd)
- UX concerns: [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Role-aware shells: [feature/00-shipped/role-aware-shells/product-spec.md](../00-shipped/role-aware-shells/product-spec.md)
- Routes & phases: [docs/support/application-views.md](../../docs/support/application-views.md)
- Project status: [PROJECT.md](../../PROJECT.md)
- AIDLC: [docs/AIDLC.md](../../docs/AIDLC.md)
