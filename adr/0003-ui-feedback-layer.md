# ADR-0003: UI feedback layer (toasts, confirm, alerts, skeletons)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-14 |
| **Deciders** | David Vezzani |
| **Related** | [Feature ui-feedback-primitives](../feature/00-shipped/ui-feedback-primitives/), [issue #9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9), [PR #55](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/55), [docs/ui-rules.md](../docs/ui-rules.md), [ADR-0001](0001-frontend-vue-js-shadcn-stack.md), [ADR-0002](0002-shared-session-ui-chrome.md) |

---

## Context

After shared session chrome ([#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5), [ADR-0002](0002-shared-session-ui-chrome.md)), views still used ad-hoc inline text for transient feedback (e.g. export stub paragraph). Confirm-before-irreversible actions and loading placeholders were deferred to [#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9). Downstream Features ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54), [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10)) need a single feedback vocabulary documented in [docs/ui-rules.md](../docs/ui-rules.md).

Constraints: presentation only; JS-only Vue 3 + shadcn-vue; storyboard in-memory session; one global toast host.

## Decision

We add a **feedback layer** on top of #5 shell primitives:

| Layer | Location | Role |
|-------|----------|------|
| shadcn primitives | `src/components/ui/{sonner,alert-dialog,alert,skeleton}/` | CLI-generated; do not fork |
| Toast API | `src/lib/feedback.js` | `showInfoToast`, `showSuccessToast`, `showErrorToast`, `DEFAULT_TOAST_DURATION_MS` |
| Confirm shell | `src/components/ConfirmDialog.vue` | Controlled `open`; parent owns copy and side effects |
| Loading reference | `src/components/TableLoadingSkeleton.vue` | Pattern for async table/card loading |
| Global host | `src/App.vue` | Single `<Toaster />` — **top-right**, close button, safe-area offsets; import `vue-sonner/style.css` in `main.js` |

**Rules:**

- **Transient outcomes** → toast via `feedback.js` (default 6s duration).
- **Irreversible actions** → `ConfirmDialog`; sticky CTAs set `open = true` — no `AlertDialogTrigger` on `ViewActions` buttons.
- **Persistent page context** → inline shadcn `Alert` or `role="status"` banner — not toast.
- **Field validation** → `FormField` `:error` — not toast.
- **Submit/network errors** → `showErrorToast` (future API Features).
- Consumer Features (**#54**, etc.) import shared wrappers — **do not** re-run `npx shadcn-vue add alert-dialog sonner`.

First production adopters: Reconciliation **Export XML** stub → `showInfoToast`; session **Mark session complete** → `ConfirmDialog` + one-shot celebration toast ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54), `completion-celebration.js`).

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| Per-view toast/confirm | Each view imports sonner/alert-dialog directly | Drift; duplicated install risk (#54) |
| Pinia feedback store | Central queue for toasts/confirms | Overkill for storyboard SPA |
| Inline messages only | Keep export stub as `<p>` | Violates UX pattern G; blocks #54 |
| Bundle confirm into #54 only | Install primitives in acknowledge-mission-complete | Duplicates CLI; #9 unblocks multiple Features |

## Consequences

### Positive

- One documented vocabulary in `docs/ui-rules.md` § Feedback primitives.
- #54 can wire session-complete confirm without new dependencies.
- Accessible polite live region via sonner; confirm focus trap via Reka alert-dialog.

### Negative / trade-offs

- `ConfirmDialog` unit tests stub alert-dialog (portal/jsdom limitation).
- Export chapter still uses hand-rolled status div — optional `Alert` migration later.
- ~~Mobile toaster may need larger bottom offset on session routes with bottom nav.~~ **Resolved** — [toast-look-and-feel](../feature/00-shipped/toast-look-and-feel/learn-notes.md) moved placement to top-right (2026-06-14).

### Neutral / follow-ups

- ~~Wire `ConfirmDialog` on session complete ([#54](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/54)).~~ **Done** — [learn-notes](../feature/00-shipped/acknowledge-mission-complete/learn-notes.md).
- ~~Tune `Toaster` offset if sticky nav overlap reported.~~ **Superseded** — top-right placement + safe-area top offset ([toast-look-and-feel learn-notes](../feature/00-shipped/toast-look-and-feel/learn-notes.md)).
- Use `TableLoadingSkeleton` when coordinator API adds async fetches.
- **Sonner CSS required** — `import 'vue-sonner/style.css'` in `main.js` or toasts render inline (see toast-look-and-feel).

## Compliance & verification

- [docs/ui-rules.md](../docs/ui-rules.md) feedback section and anti-patterns (no inline stub paragraphs after click).
- Validate scorecard [#9](../feature/00-shipped/ui-feedback-primitives/validate-scorecard.md).
- New confirms must use `ConfirmDialog`; new transient feedback must use `feedback.js`.

## References

- [learn-notes.md](../feature/00-shipped/ui-feedback-primitives/learn-notes.md)
- [acknowledge-mission-complete learn-notes](../feature/00-shipped/acknowledge-mission-complete/learn-notes.md)
- [toast-look-and-feel learn-notes](../feature/00-shipped/toast-look-and-feel/learn-notes.md)
- [product-spec.md](../feature/00-shipped/ui-feedback-primitives/product-spec.md)
- [tech-spec.md](../feature/00-shipped/ui-feedback-primitives/tech-spec.md)
