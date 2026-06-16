# UX design review — incorporated into Plan (#90)

**Persona:** [docs/personas/ux-designer.md](../../docs/personas/ux-designer.md)  
**Feature:** `diff-workflows-for-desktop-and-phone`  
**Last updated:** 2026-06-16 (Dave feedback on items 2–10)

Review of Product Spec + workflow diagrams. Items below are **recorded in the Product Spec** for `/design` and Build.

---

## Profile selection

| Viewport | Effective profile |
|----------|-------------------|
| **Phone (`< md`)** | Always **worker** — no radio; stored preference does not override |
| **Tablet / laptop (`≥ md`)** | **Radio:** Coordinator \| Worker — default **Coordinator**; choice persisted in **`localStorage`** |

---

## Incorporated recommendations (items 2–10)

### 2. Shell on Lots browse + Cups (high)

**Decision:** Option **A** — worker-scoped **presentation variant** on **`/session/:id/lots`** (browse) and **`/session/:id/cups`** when effective profile is worker **or** viewport is `< md`:

- Same routes — no duplicate views
- **`SessionViewFrame variant="worker"`** — tighter padding, shorter headers (match lot entry density)
- Coordinator profile on `≥ md` keeps **coordinator shell** on those routes

### 3. SessionProgress (medium–high)

| Element | Worker profile (incl. phone) | Coordinator profile |
|---------|------------------------------|---------------------|
| **Strip steps** | **Filtered subset:** Count → Organize → Done *(Count-only until session is organizing, then show Organize)* | Full strip unchanged (Import → Count → Reconcile → Organize → Export → Done) |
| **Clickable past steps** | Only worker-reachable phases | Existing [application-views.md](../../docs/support/application-views.md) rules |
| **Import / Reconcile / Export steps** | **Hidden** on worker profile — not shown as disabled ghosts | Visible |

### 4. Organize route + nav (medium–high)

| Profile | Route | Nav label (organizing phase) |
|---------|-------|------------------------------|
| **Coordinator** | `/session/:id/lots?mode=organizer` — all lists + assign UI | **Lots** + Organizer badge |
| **Worker** | **`/session/:id/my-list`** — assigned list only | **My list** replaces **Lots** — do not show both |

Route guards: worker profile cannot open coordinator organizer URL; redirect to My list or waiting state.

### 5. Home display name (medium)

**All users** (coordinator and worker profiles) provide a **display name** on Home:

| Behavior | Rule |
|----------|------|
| **First visit** | Name field empty or placeholder; user enters name before continuing |
| **Persistence** | Stored in **`localStorage`** (separate key from workflow profile) |
| **Re-prompt** | **Not** on every visit — field **pre-populated** with stored value |
| **Change name** | User may edit on Home anytime; **saved when leaving Home** (navigate to next view) |
| **Coordinator Home** | Hub + create session + profile radio (`≥ md`) **and** display name field (same persistence rules) |
| **Worker Home** | Display name + session list (+ profile radio on `≥ md`) |

Name is used for organizer list assignment labels and My list header.

### 6. Waiting states (medium)

Single block on **`MarketingShell`** (or minimal frame **without** session nav):

- shadcn **`Alert`** (info) — session still in setup / coordinator reconciling
- Primary **`Button`** — **Back to session list**
- No tables, no SessionNav, no coordinator chrome

### 7. Organize prompt (medium)

**Both** channels until worker accepts or navigates to My list:

1. **`sonner` toast** — dismissible, action **Go to my put-away list**
2. **Sticky banner** on **lot entry** — same action; remains until accepted or user opens My list

Nav fallback (**My list** item) if both dismissed — worker still in organizing phase.

### 8. Coordinator assign worker UI (medium)

On coordinator **`/lots?mode=organizer`**:

- Per pick list: shadcn **`Select`** (not combobox) — options = **joined display names** + **Unassigned**
- **Auto-assign** on phase enter (`importing` → … → **organizing**): unassigned lists get workers without a list
- After assign (manual or auto): **`Badge`** on list header showing assignee name

### 9. Lazy scroll — My list only (medium)

**New list behavior** for **`/session/:id/my-list` only**:

- Do **not** use full **`ResponsiveDataTable`** render for 50+ rows
- Design specifies windowed/virtual scroll (e.g. **`scroll-area`** + chunked render)
- Lot browse / coordinator organizer may keep existing table/card patterns

### 10. Documentation (process)

**In scope for this Feature:**

- Update **`docs/support/application-views.md`** — add **Worker profile SessionNav** table (parallel to existing SessionNav table); document **`/session/:id/my-list`** route
- Update **`docs/ui-rules.md`** — profile-aware shell rules for Lots/Cups browse; My list view; filtered SessionProgress

Validate includes doc review against shipped behavior.

---

## Breakpoint / profile matrix (Design handoff)

| Surface | Worker profile / phone `< md` | Coordinator profile `≥ md` |
|---------|------------------------------|----------------------------|
| **Home** | Name (pre-filled) + session list + radio | Name (pre-filled) + hub + create session + radio |
| **SessionNav (counting)** | Home, Lot, Lots, Cups | Full nav unchanged |
| **SessionNav (organizing)** | Home, Lot, **My list** | Full nav; Lots + Organizer badge |
| **SessionProgress** | Count → Organize → Done (filtered) | Full strip |
| **Lot entry** | SessionWorkerShell | Coordinator shell (oversight) |
| **List lots / cups** | **Worker shell variant** | Coordinator shell |
| **Organizer** | **`/my-list`** only | **`/lots?mode=organizer`** + Select assign |
| **Reconcile / Import** | Blocked → Alert waiting | Unchanged |

---

## Design handoff checklist

- [ ] `useWorkflowProfile` + `useDisplayName` composables (`localStorage` keys documented in Tech Spec)
- [ ] Home: name field all profiles; save-on-leave; pre-populate from storage
- [ ] Route guards + My list route registration
- [ ] `SessionNav` model: profile + phase (My list swap)
- [ ] `SessionProgress` filter component or props
- [ ] Profile-aware shell on `ListLotsView` / `ListCupsView` (browse)
- [ ] `MyListView` + virtual scroll (new — not ResponsiveDataTable)
- [ ] Organize: toast + **sticky banner** on lot entry
- [ ] Coordinator organizer: **Select** assign + assignee **Badge**
- [ ] Waiting state view/template
- [ ] **`application-views.md`** + **`ui-rules.md`** updates in same PR or tracked sub-unit
