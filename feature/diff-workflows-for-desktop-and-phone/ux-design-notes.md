# UX design review — incorporated into Plan (#90)

**Persona:** [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md)  
**Feature:** `diff-workflows-for-desktop-and-phone`  
**Last updated:** 2026-06-16

Review of Product Spec + workflow diagrams. Items below are **recorded in the Product Spec** for `/design` and Build — not open-ended options.

---

## Profile selection (Dave decision)

| Viewport | Effective profile |
|----------|-------------------|
| **Phone (`< md`)** | Always **worker** — no radio; stored preference does not override |
| **Tablet / laptop (`≥ md`)** | **Radio:** Coordinator \| Worker — default **Coordinator**; choice persisted in **`localStorage`** |

Enables demo/stakeholder **worker preview on laptop** without DevTools resize.

---

## Incorporated recommendations

| Topic | Plan decision |
|-------|----------------|
| **SessionProgress (worker)** | Filtered strip — worker-reachable phases only (Count → Organize → Done, or Count-only until organizing) |
| **Worker organize route** | New route **`/session/:id/my-list`** — assigned list only; not `/lots?mode=organizer` |
| **Nav during organizing (worker)** | **My list** replaces **Lots** in bottom nav; no dual Lots + organizer confusion |
| **Lots / Cups on worker profile** | **Worker shell variant** at `< md` or when profile = worker — tighter chrome, not full coordinator shell |
| **Waiting states** | `Alert` (info) + **Back to session list** — no session nav or tables |
| **Home layout** | Worker profile: name + session list; Coordinator profile: existing hub + create session + **profile radio** on `≥ md` |
| **Assign worker (coordinator)** | Per-list assignee control on coordinator organizer (`Select` / joined display names) |
| **50+ line list** | Windowed/virtual scroll on worker **My list** — do not overload `ResponsiveDataTable` for this view |
| **Organize toast** | Dismissible toast + nav fallback; Design may use bottom-biased action placement for thumb reach |
| **Docs** | Update **`application-views.md`** and **`ui-rules.md`** with worker-profile nav table and new route |

---

## Design handoff checklist

- [ ] Profile composable: resolve effective profile (`phone → worker`, else `localStorage` + radio)
- [ ] Home breakpoint matrix (worker vs coordinator content + radio)
- [ ] Route guards redirect coordinator-only paths when profile = worker
- [ ] `SessionNav` model filtered by profile + phase
- [ ] `SessionProgress` filtered by profile
- [ ] `MyListView` (or equivalent) + virtual scroll spec
- [ ] Coordinator organizer assign UI wireframe
