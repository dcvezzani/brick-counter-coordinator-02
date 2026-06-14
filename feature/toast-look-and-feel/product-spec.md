# Product Spec — Toast look and feel

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, stakeholders — **product language only** (no implementation or stack). Unresolved product questions should be **asked in chat** first; this file records **decisions** after they are made.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Toast look and feel — floating overlay presentation |
| **Status** | **Validate PASS** — 2026-06-14 |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-14 |
| **Last updated** | 2026-06-14 |
| **Approved** | 2026-06-14 — David Vezzani (Plan phase; approved as drafted) |
| **Related Tech Spec** | *(optional — quick fix; implementation may ship without `/design`)* |
| **Work item** | *(none — quick fix; no tracker item)* |
| **Related** | [ui-feedback-primitives](../00-shipped/ui-feedback-primitives/product-spec.md) · [acknowledge-mission-complete](../00-shipped/acknowledge-mission-complete/product-spec.md) · [docs/ui-rules.md](../../docs/ui-rules.md) · [ADR-0003](../../adr/0003-ui-feedback-layer.md) |

## Problem & audience

### Problem statement

The app ships a global toast host and helpers ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)), but **toasts do not read as floating notifications**. Today they appear as plain text **below page content** in the document flow, so transient feedback feels like part of the page rather than a brief overlay. That undermines export stub feedback, the session-complete celebration toast ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)), and future error/success messages.

### Who it's for

- **Primary:** Coordinator using any route (Home, session chapters) who triggers export, completion, or future save actions.
- **Secondary:** Demo presenter — celebration and info toasts should feel polished and clearly separate from page copy.
- **Tertiary:** Contributors — one consistent toast presentation without per-view styling hacks.

### Current experience (baseline)

| Situation | Today |
|-----------|--------|
| Export XML stub | Info toast message renders **inline below** the current view content |
| Session complete → Home | Celebration toast same inline placement |
| Visual treatment | Minimal card styling; does not clearly float above the UI |
| Documented placement | Shipped #9 spec targeted **bottom-right** with safe-area offset |

## Outcomes & business impact

### Desired outcomes

- **Toasts float above content** — they overlay the page without shifting layout.
- **Consistent corner placement** — anchored **top-right** of the viewport on all routes.
- **Readable card treatment** — visible **border** and **pleasant background** so messages stand out from page chrome.
- **Existing behavior preserved** — same messages, durations, and one-shot celebration flow; only presentation changes.

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Toast appears **top-right**, fixed over page content (not in document flow below components) | Manual on Home + one session route; screenshot |
| 2 | Toast has a clear **border** and **shared neutral background**; info/success/error keep sonner **type icons** | Visual review / screenshot |
| 2b | **Close control** dismisses toast immediately (starts fade-out without waiting for auto-dismiss) | Manual |
| 3 | Page layout does **not** jump or reserve space when a toast shows or dismisses | Manual |
| 4 | Export stub and celebration toasts still fire with correct copy | Existing unit tests + manual |
| 5 | Toast stays **top-right on mobile** (same as desktop); clears top safe area | Manual on narrow viewport |
| 6 | `npm test` / `npm run build` pass | CI |

### Business impact

Polishes the feedback layer shipped in #9/#54 so transient messages feel intentional. Low risk, high perceived quality for demo and coordinator workflows. No new user flows.

## User experience & scenarios

### Key scenarios

1. **Export stub** — Coordinator on Export chapter taps **Export XML** → toast slides/fades in at **top-right**, floating over the chapter → auto-dismisses → page content unchanged.
2. **Celebration toast** — After confirming session complete, Home loads → celebration message appears **top-right** overlay → auto-dismisses → not confused with Home marketing copy.
3. **Ordinary browsing** — User scrolls or interacts while toast is visible → toast stays anchored top-right; does not scroll away with page body.
4. **Mobile session route** — Toast clears top safe area; does not cover primary nav labels in an unusable way.

### Experience principles

- **Non-blocking** — Overlay only; no modal trap.
- **Subtle but visible** — Shared bordered card with pleasant neutral background; **type icons** (info/success/error) remain for quick scanning.
- **Dismissible** — Close control starts fade-out immediately; auto-dismiss still applies when user does not close.
- **Accessible** — Retain polite live region behavior from existing sonner host.
- **Tone unchanged** — Same factual info and light celebration copy as today.

## Scope

### In scope

- Global toast host presentation: **top-right** placement (all viewports), **fixed overlay**, **shared bordered background**, **close button**.
- Verify on routes that already use toasts (Reconciliation export, Home celebration).
- Update [docs/ui-rules.md](../../docs/ui-rules.md) placement note if it still says bottom-right.

### Out of scope

- New toast types, copy, or duration changes.
- Per-toast variant color systems beyond what shadcn/vue-sonner already provides for info/success/error.
- Moving confirm dialogs or inline alerts.
- Stacking animations, action buttons on toasts, or swipe-to-dismiss customization (unless required for baseline sonner).

### Dependencies on other teams or features

- **Consumes** [#9 ui-feedback-primitives](../00-shipped/ui-feedback-primitives/) — `App.vue` Toaster, `feedback.js`, `Sonner.vue` wrapper.
- **Does not change** [#54 acknowledge-mission-complete](../00-shipped/acknowledge-mission-complete/) logic — only how the celebration toast looks.

## Constraints (non-technical where possible)

- Must keep a **single global** toast host in `App.vue` ([ADR-0003](../../adr/0003-ui-feedback-layer.md)).
- Must not reintroduce inline stub paragraphs for export feedback.
- Brand-consistent with existing shadcn neutral palette (popover/card-like surfaces).

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-14 | **Placement:** top-right viewport (replaces shipped #9 bottom-right default). |
| 2026-06-14 | **Presentation:** float over content; bordered card with pleasant background. |
| 2026-06-14 | **Behavior:** keep existing auto-dismiss durations and message copy. |
| 2026-06-14 | **Variant styling:** shared neutral bordered card; keep sonner type icons (info/success/error). |
| 2026-06-14 | **Mobile:** top-right on phone (no bottom-right fallback). |
| 2026-06-14 | **Close control:** visible close icon; tap starts immediate dismiss fade. |
| 2026-06-14 | **Tracker:** quick fix — no GitHub issue. |

## Related documents

- Tech Spec: *(pending `/design`)*
- [ui-feedback-primitives product spec](../00-shipped/ui-feedback-primitives/product-spec.md)
- [ui-feedback-primitives tech spec](../00-shipped/ui-feedback-primitives/tech-spec.md)
- [docs/ui-rules.md](../../docs/ui-rules.md) § Feedback primitives
