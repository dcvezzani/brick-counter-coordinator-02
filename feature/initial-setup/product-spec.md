# Product Spec — Initial setup

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Initial setup — app scaffold and hello landing page |
| **Status** | Approved |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-12 |
| **Last updated** | 2026-06-12 |
| **Approved** | 2026-06-12 — David Vezzani |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) (Design — draft awaiting approval) |
| **Parent work item** | [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1) |

## Problem & audience

### Problem statement

Brick Counter Coordinator is a new application. The repository has AIDLC process docs and a documented tech stack, but **no runnable application yet**. Without a minimal scaffold and proof that the stack works locally, every subsequent Feature would repeat bootstrap work and risk inconsistent tooling.

This Feature establishes the foundation: a developer (or agent) can clone the repo, install dependencies, start the dev server, and see a working page in the browser.

### Who it's for

- **Primary:** David (product owner / solo developer) — needs a trustworthy starting point for Brick Counter Coordinator UI work.
- **Secondary:** AI build agents — need a repo with working dev/test commands and documented conventions so later Features can follow `/build` without re-scaffolding.

### Current experience (baseline)

Today, cloning the repo yields docs (`docs/AIDLC.md`, `docs/tech-stack.md`, `AGENTS.md`) and the AI-DLC submodule, but no `package.json`, no frontend source, and no way to run the app. The tech stack doc describes intended choices but nothing is executable yet.

## Outcomes & business impact

### Desired outcomes

- A new contributor can run the app locally in under five minutes after clone (install + dev server).
- The default route shows a visible **hello** message — proof the UI pipeline works end-to-end.
- Project conventions from `docs/tech-stack.md` are reflected in the scaffold (Vue 3, JavaScript client, Tailwind/shadcn-vue toolchain wired — details belong in Tech Spec).
- Unit test and dev scripts exist so CI and later Features have a baseline to extend.

### Success criteria (for Validate)

These tie directly to the **scorecard** in `/ship`. Each should be **testable** or **evidence-based** without reading code.

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Fresh clone → install → dev server → browser shows hello | Manual or e2e: run documented commands; screenshot or Playwright assertion on visible hello text |
| 2 | Documented quick-start exists at repo root | README (or linked doc) lists clone, install, and `npm run dev` steps |
| 3 | Automated unit tests pass in CI | PR has green required checks; at least one test asserts hello content or route renders |
| 4 | Stack matches committed product defaults | `docs/tech-stack.md` accurately describes what is in the repo (no "scaffold exists" claim if it does not) |

### Business impact

Unblocks all future Brick Counter Coordinator Features. Reduces rework and agent confusion. No direct revenue impact — this is foundational infrastructure for the product.

## User experience & scenarios

### Key scenarios

1. **First run after clone** — Given a clean checkout, when the developer follows README steps, then the dev server starts without errors and the browser shows a page with **hello** visible on the default route.

2. **Verify tests locally** — Given the scaffold is installed, when the developer runs the unit test command, then tests pass including coverage of the hello landing behavior.

3. **Agent handoff** — Given an approved Tech Spec from `/design`, when a build agent implements this Feature, then it extends the scaffold rather than choosing a different framework or language than documented.

### Experience principles

- **Minimal:** The landing page is intentionally bare — no navigation chrome, storyboard views, or BrickLink integration yet.
- **Honest docs:** README and tech-stack doc must not overclaim what exists.
- **JavaScript-first client:** Matches owner preference (no TypeScript on the client) — enforced via project config, not this spec's implementation detail.

## Scope

### In scope

- Frontend application scaffold aligned with `docs/tech-stack.md` (Vue 3 + Vite, JavaScript, Tailwind, shadcn-vue toolchain, Vue Router, Vitest).
- Default route / landing view displaying the literal text **hello**.
- Root README with local development quick-start.
- Baseline npm scripts: dev, build, test (names as conventional for Vite/Vitest).
- CI workflow that runs unit tests on pull requests.
- Update `docs/tech-stack.md` status so it reflects reality after delivery.

### Out of scope

- Coordinator Node.js server and WebSockets.
- BrickLink session integration.
- Storyboard views, fixtures, or full `application-views.md` route map.
- `config/app-preferences.json` and product behavior sections (unless explicitly pulled into scope in Design).
- Playwright e2e suite (optional stretch — default out unless decided in chat).
- Deployment / hosting pipeline.
- shadcn-vue component library beyond what is needed to render hello (minimal theme + utils only).

### Dependencies on other teams or features

- None external. Depends on prior repo bootstrap: `docs/AIDLC.md`, `AGENTS.md`, AI-DLC submodule (already present).

## Constraints (non-technical where possible)

- Must follow AIDLC: Product Spec approval before `/design`.
- Parent work item: [GitHub issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1) links to `feature/initial-setup/`.
- Client code must remain JavaScript (no TypeScript on Vue SFCs) per owner preference documented in tech stack.
- BrickLink integration pattern (session-backed fetch, no iframes) is a future constraint — not exercised in this Feature.

## Decisions (optional)

| Date | Decision |
|------|----------|
| 2026-06-12 | Feature slug: `initial-setup`. Parent issue #1 created with link to `feature/initial-setup/`. |
| 2026-06-12 | Hello copy: literal text `hello` on the default route (per original feature seed). |
| 2026-06-12 | Playwright e2e: **out of scope** for this Feature; Validate may use manual browser check or unit tests. |
| 2026-06-12 | `config/app-preferences.json` scaffold: **out of scope**; defer until a Feature needs product defaults. |
| 2026-06-12 | `PROJECT.md`: **out of scope** for Build; create/update in **Learn** after Validate PASS. |
| 2026-06-12 | GitHub Actions CI (unit tests on PR): **in scope**. |
| 2026-06-12 | Product Spec **approved** by David Vezzani. Open questions resolved with defaults above where not explicitly answered in chat. |

## Related documents

- Tech stack (reference): [docs/tech-stack.md](../../docs/tech-stack.md)
- AIDLC process: [docs/AIDLC.md](../../docs/AIDLC.md)
- Issue tracker: [AGENTS.md](../../AGENTS.md)
- Tech Spec: [tech-spec.md](./tech-spec.md)
