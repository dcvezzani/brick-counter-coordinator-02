# Workflow diagrams — desktop coordinator vs phone worker

**Feature:** `diff-workflows-for-desktop-and-phone` · [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90)  
**AIDLC phase:** Plan  
**Last updated:** 2026-06-16

These diagrams split the **user journey** by persona. They complement — not replace — the shared **session phase machine** in [docs/session-phases-state.mmd](../../docs/session-phases-state.mmd), which still defines valid phase transitions for the whole session.

| Diagram | Persona | Primary device | File |
|---------|---------|----------------|------|
| **Coordinator laptop workflow** | Session coordinator | Laptop / desktop | [coordinator-laptop-workflow.mmd](./coordinator-laptop-workflow.mmd) |
| **Worker phone workflow** | Counter / put-away worker | Phone | [worker-phone-workflow.mmd](./worker-phone-workflow.mmd) |

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
- **Different surfaces** — Coordinator sees import, reconcile, all organizer lists, and export. Worker sees session list → count → **their** assigned organize list.
- **Push at organize** — When the coordinator enters organizing, workers receive a prompt to open their put-away list (production: WebSocket; storyboard: simulated).

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
    HomeList["Home — session list"] --> LotEntry["Lot entry — count"]
    LotEntry --> Prompt{{"Organize prompt"}}
    Prompt --> MyList["My assigned pick list"]
```

Full detail: [worker-phone-workflow.mmd](./worker-phone-workflow.mmd)

## Plan → Design handoff

On Product Spec approval:

1. **Learn / ship:** Move or link canonical copies under `docs/` if the team wants repo-wide diagrams (optional — Design decision).
2. **Design:** Tech Spec maps each diagram node to routes, components, and storyboard fixtures.
3. **Validate:** Walk coordinator laptop path and worker phone path against [product-spec.md](./product-spec.md) success criteria.
