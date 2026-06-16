# Workflow diagrams — desktop coordinator vs phone worker

**Feature:** `diff-workflows-for-desktop-and-phone` · [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90)  
**AIDLC phase:** Plan  
**Last updated:** 2026-06-16 (product decisions recorded)

These diagrams split the **user journey** by persona. They complement — not replace — the shared **session phase machine** in [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd), which still defines valid phase transitions for the whole session.

| Diagram | Persona | Primary device | Profile rule | File |
|---------|---------|----------------|--------------|------|
| **Coordinator laptop workflow** | Session coordinator | Laptop / desktop | Viewport **≥ md** | [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) |
| **Worker phone workflow** | Counter / put-away worker | Phone | Viewport **< md** + display name on join | [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) |

## How they relate

```mermaid
flowchart LR
    PhaseMachine["docs/session-phases-state.mmd\n(shared phase machine)"]
    Coord["coordinator-laptop-workflow.mmd\n(all screens + phase gates)"]
    Worker["worker-phone-workflow.mmd\n(subset of screens)"]
    PhaseMachine --> Coord
    PhaseMachine --> Worker
    Coord -->|"organizing phase + list assignment"| Worker
```

- **Same session, same phases** — Coordinator actions (e.g. Declare ready to organize) still advance the session per the phase machine.
- **Viewport profiles** — Same URL; `< md` shows worker nav (Lot, Lots, Cups) and surfaces; `≥ md` shows full coordinator workflow.
- **Worker join** — Display name on join (storyboard); coordinator assigns pick lists on laptop; unassigned lists auto-assign to workers without a list.
- **Push at organize** — Dismissible toast with “Go to my put-away list”; nav fallback if dismissed.

## Coordinator laptop (preview)

```mermaid
flowchart TB
    subgraph pre["Pre-session"]
        Home["Home"]
        New["New session"]
    end
    subgraph setup["Setup"]
        Import["Part-out import"]
    end
    subgraph count["Counting oversight"]
        Lot["Lot entry"]
        Lots["List lots"]
        Cups["Cups"]
    end
    subgraph coord["Coordination"]
        Reconcile["Reconcile"]
        Organize["All pick lists + assign workers"]
        Export["Export / complete"]
    end
    Home --> New --> Import --> Lot
    Lot <--> Lots
    Lot <--> Cups
    Lots --> Reconcile --> Organize --> Export
```

Full detail: [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd)

## Worker phone (preview)

```mermaid
flowchart TB
    Name["Enter display name"] --> HomeList["Home — 2–3 sessions"]
    HomeList --> LotEntry["Lot entry"]
    LotEntry <--> Lots["List lots"]
    LotEntry <--> Cups["Cups"]
    LotEntry --> Prompt{{"Organize toast"}}
    Prompt --> MyList["My assigned list"]
```

Full detail: [worker-phone-workflow.mmd](./worker-phone-workflow.mmd)

## Plan → Design handoff

On Product Spec approval:

1. **Learn / ship:** Move or link canonical copies under `docs/` if the team wants repo-wide diagrams (optional — Design decision).
2. **Design:** Tech Spec maps each diagram node to routes, components, and storyboard fixtures.
3. **Validate:** Walk coordinator laptop path and worker phone path against [product-spec.md](./product-spec.md) success criteria.
