# Product Spec — UI feedback primitives

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | UI feedback primitives — toasts, confirm dialogs, inline alerts, loading skeletons |
| **Status** | **Approved** — scope from [GitHub issue #9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9), [ux-roadmap](../ux-roadmap.md) P1, [pattern G](../../dcv/ux-concerns.md) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-14 |
| **Last updated** | 2026-06-14 |
| **Approved** | 2026-06-14 — David Vezzani (Design phase; Product Spec recovered from issue #9 + roadmap) |
| **Related Tech Spec** | [tech-spec.md](./tech-spec.md) — **Approved for build** |
| **Work item** | [#9 UI feedback primitives](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9) |
| **Related** | [#5 consolidate-and-clean-ui](../00-shipped/consolidate-and-clean-ui/product-spec.md) · [#54 acknowledge-mission-complete](../acknowledge-mission-complete/product-spec.md) · [docs/ui-rules.md](../../docs/ui-rules.md) |

## Problem & audience

### Problem statement

After layout and form consolidation ([#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5)), the app still lacks **standard feedback patterns** for workflow actions. Export shows a plain inline sentence; **Mark session complete** closes the session with no confirm; there is no shared way to show success, info, or error messages; and future coordinator/API work has no loading placeholder pattern. Contributors and agents must invent ad-hoc copy placement per view, which drifts from [docs/ui-rules.md](../../docs/ui-rules.md) and blocks downstream Features ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54), [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)).

### Who it's for

- **Primary:** Coordinator completing export and session-close flows on laptop or phone.
- **Secondary:** Contributors and build agents — one documented feedback vocabulary instead of per-view hacks.
- **Tertiary:** Demo presenter — clear, polished reactions to stub export and future real API responses.

### Current experience (baseline)

| Situation | Today |
|-----------|--------|
| Export XML (stub) | Inline muted paragraph appears below export copy |
| Mark session complete | Immediate session close + redirect Home, no confirm or celebration |
| Form validation | `FormField` supports inline `:error` but no views wire it; no submit-level error pattern |
| Loading data | No skeleton or loading state — storyboard is synchronous |
| Errors / success elsewhere | No toast or alert primitives installed |

Feedback components were **explicitly deferred** from #5 and [docs/ui-rules.md](../../docs/ui-rules.md) to this Feature.

## Outcomes & business impact

### Desired outcomes

- **One feedback vocabulary** — toasts for transient messages, confirm dialog for irreversible actions, inline alerts for persistent context, skeletons for loading placeholders.
- **Export feedback feels intentional** — export stub (and future real export) uses a toast instead of buried inline text.
- **Confirm-before-irreversible is possible** — shared confirm pattern ready for session complete ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)) and future phase-back ([#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53)).
- **Rules doc updated** — [docs/ui-rules.md](../../docs/ui-rules.md) documents when to use each primitive; agents stop guessing.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Toast, confirm dialog, alert, and skeleton primitives are installed and documented | Code review + ui-rules section |
| 2 | Global toast host works on all routes (including Home and session views) | Manual + component test |
| 3 | Export XML on Reconciliation shows a **toast** (not inline paragraph) for stub feedback | Manual + view test |
| 4 | Shared **ConfirmDialog** wrapper exists with keyboard-friendly dismiss; documented for consumers | Code review + ui-rules |
| 5 | Inline **Alert** pattern documented for persistent status (replacing ad-hoc bordered divs where applicable) | ui-rules + optional migration note |
| 6 | **Skeleton** loading pattern documented with at least one reference usage or Storybook-style demo in tests | ui-rules + unit test |
| 7 | Form errors remain **inline** via `FormField`; toast reserved for submit/network-level errors per rules | ui-rules |
| 8 | `npm test` / `npm run build` pass | CI |
| 9 | [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54) can consume primitives without reinstalling duplicate components | Review of #54 Tech Spec dependency |

### Business impact

Unblocks session-complete UX ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)) and lot-entry cockpit ([#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)). Reduces accidental irreversible actions and makes the demo feel finished. Foundation for production API error handling later.

## User experience & scenarios

### Key scenarios

1. **Export stub feedback** — Coordinator on Export chapter taps **Export XML** → brief info toast explains stub (no file generated) → toast auto-dismisses → page layout unchanged.
2. **Future confirm consumer (#54)** — Coordinator taps **Mark session complete** → confirm dialog (**Are you sure?**) → **Not yet** stays on page; **Complete session** proceeds (implemented in #54 using primitives from this Feature).
3. **Persistent chapter context** — Export chapter keeps a visible inline alert explaining the chapter purpose (status that should not auto-dismiss).
4. **Future loading** — When coordinator data is fetched asynchronously, tabular areas show skeleton placeholders instead of empty flash (pattern established; full async wiring is future work).
5. **Form field error** — User submits invalid New session form → error appears inline under the field (`FormField`), not as a toast.

### Experience principles

- **Transient vs persistent** — Toasts for outcomes that need no further action; inline alerts for context that remains relevant while on the page.
- **Confirm before irreversible** — Destructive or session-ending actions use confirm dialog; cancel must be obvious and safe.
- **Accessible** — Confirm trap and toast live regions; errors associated with fields per existing `FormField` wiring.
- **Mobile-safe** — Toasts clear bottom safe areas on session routes; confirm dialog usable above sticky `ViewActions`.
- **Tone** — Info toasts factual; success toasts may be celebratory when used by consumer Features (#54); avoid modal stacking.

## Scope

### In scope

- Install and wire shared feedback primitives (toast, confirm dialog, alert, skeleton).
- Global toast host on the app shell.
- Thin shared helpers / wrapper components so views do not import low-level primitives directly everywhere.
- Migrate **Export XML stub** from inline message to info toast.
- Publish **feedback section** in [docs/ui-rules.md](../../docs/ui-rules.md) (replacing “deferred to #9”).
- Unit tests for helpers and export migration.
- Document confirm + toast patterns for [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54) consumption.

### Out of scope

- **Session complete confirm + celebration toast** — [#54 acknowledge-mission-complete](../acknowledge-mission-complete/product-spec.md) (consumes this Feature).
- Confirm on other phase gates (import, organize, declare ready) — separate Features.
- Real BrickLink export, API error handling, or network retry UX.
- Playwright e2e suite.
- Rewiring every form with validation logic.
- `sheet` drawer primitive (optional follow-up; not required for P1).

### Dependencies on other teams or features

- **Depends on:** [#5 consolidate-and-clean-ui](../00-shipped/consolidate-and-clean-ui/product-spec.md) — `FormField`, `ViewActions`, shell taxonomy.
- **Unblocks:** [#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54), [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10), future API Features.

## Constraints (non-technical where possible)

- Presentation only — phase machine, routes, and nav rules unchanged.
- Storyboard in-memory session only.
- Copy must not promise real BrickLink upload when export is still a stub.
- Accessibility per [accessibility-designer](../../docs/personas/accessibility-designer.md).
- Align with [ADR-0001](../../adr/0001-frontend-vue-js-shadcn-stack.md) (Vue 3 + shadcn-vue, JS-only).

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-14 | **Foundation Feature** — #9 owns primitive install + shared wrappers + ui-rules; #54 owns session-complete business flow |
| 2026-06-14 | **Export stub** — migrate to info toast in #9 (first real adopter besides global host) |
| 2026-06-14 | **Form errors** — stay inline via `FormField`; toasts for submit/network-level errors only |
| 2026-06-14 | **Default toast duration** — 6 seconds for info/success/error unless consumer Feature overrides (e.g. #54 celebration 8s) |
| 2026-06-14 | **Confirm wrapper** — shared `ConfirmDialog` component with controlled `open` state (no trigger wrapper on sticky CTAs) |
| 2026-06-14 | **Skeleton** — install + document pattern; no mandatory view migration until async data exists |

## Related documents

- Tech Spec: [tech-spec.md](./tech-spec.md)
- UX roadmap: [feature/ux-roadmap.md](../ux-roadmap.md)
- Pattern G: [dcv/ux-concerns.md](../../dcv/ux-concerns.md)
- Consumer Feature: [acknowledge-mission-complete/product-spec.md](../acknowledge-mission-complete/product-spec.md)
- Issue: [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)
