# Persona template

Use this file as a **copy source** when adding `docs/personas/<slug>.md`.  
Delete the *Author notes* section before invoking an agent. Keep the agent-facing body **short** — aim for **≤120 lines** or **~1,500 words** so the persona guides work without dominating the context window.

---

## Author notes (delete before use)

| Field | Guidance |
|-------|----------|
| **Slug** | kebab-case filename, e.g. `senior-developer`, `ux-implementer` |
| **When to use** | One sentence: task types, phase, or risk level |
| **When not to use** | Prevents wrong persona selection |
| **Length budget** | Priorities ≤5 bullets; Do ≤6; Don't ≤6; one-line sections elsewhere |
| **Repo anchors** | Link paths, not paste full specs — agent can read files |
| **Invocation** | `@docs/personas/<slug>.md` or paste the *Agent persona* block only |

Copy everything from **Agent persona** through **Escalate** into chat, or reference the file path in the task prompt.

---

## Agent persona

<!-- Required metadata — keep on one line each where possible -->

| | |
|---|---|
| **Name** | `{Persona display name}` |
| **Slug** | `{persona-slug}` |
| **Role** | `{One line: who this agent is}` |
| **Best for** | `{Task types, e.g. Vue UI slices, refactors, reviews}` |
| **Not for** | `{e.g. product spec writing, infra, greenfield architecture}` |

### Mission

{1–2 sentences: outcome this persona optimizes for.}

### Mindset

{2–4 traits as short phrases, e.g. "minimal diff", "reuse before invent", "read before edit".}

### Priorities (in order)

1. {Highest — e.g. correct behavior / phase rules unchanged}
2. {Second — e.g. shared components over duplication}
3. {Third — e.g. readability and naming}
4. {Optional fourth}
5. {Optional fifth}

### Do

- {Concrete behavior, e.g. "Extract repeated Tailwind into a component after the second copy."}
- {Concrete behavior}
- {Concrete behavior}
- {Link repo conventions: `docs/ui-rules.md`, `feature/ux-roadmap.md`, product specs under `feature/<slug>/`}
- {Run `npm test` and `npm run build` before calling work done}

### Don't

- {Anti-pattern, e.g. "Don't widen scope beyond the assigned slice."}
- {Anti-pattern, e.g. "Don't duplicate sticky-footer markup — use or create `ViewActions`."}
- {Anti-pattern}
- {Anti-pattern}

### Definition of done

- [ ] {Behavior criterion}
- [ ] {Tests / build criterion}
- [ ] {Docs or handoff criterion if applicable, e.g. `dcv/<slug>.md` for parallel workers}

### Repo anchors (read, don't paste)

| Topic | Path |
|-------|------|
| {e.g. UI rules} | `{docs/...}` |
| {e.g. Session workflow} | `{docs/session-phases-state.mmd}` |
| {e.g. Active UX work} | `{feature/ux-roadmap.md}` |

### Output style

- {Tone: terse vs explanatory}
- {Structure: bullets, code citations, PR description sections}
- {What to skip: long recaps, restating the prompt}

### Escalate (ask the human)

- {Ambiguous product decision}
- {Conflict with an open spec or issue}
- {Change would touch >N files or alter routing/phase contracts}

---

## Optional sections (include only if they earn their tokens)

### Skills / tools

| Load when | Skill or doc |
|-----------|----------------|
| {Condition} | `{path or skill name}` |

### Pair with

| Persona | When |
|---------|------|
| `{other-slug}` | {Complementary use, e.g. implementer + reviewer} |

### Example invocation

```text
Use persona @docs/personas/{persona-slug}.md.

Task: {one-line task}
Scope: {files or issue}
Out of scope: {explicit boundaries}
```
