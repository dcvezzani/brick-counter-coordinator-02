# Learn notes — Toast look and feel

**Feature:** [toast-look-and-feel](./) · *(no GitHub issue — quick fix)*  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-14)  
**Learn date:** 2026-06-14  
**Merged:** `main` @ `87ae980` (direct commit on `main`)

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) — Feature 9 |
| UI rules — toast placement | [docs/ui-rules.md](../../../docs/ui-rules.md) § Global toast host |
| ADR-0003 follow-up | [adr/0003-ui-feedback-layer.md](../../../adr/0003-ui-feedback-layer.md) — placement + CSS import |
| Validate evidence | [ship-report.md](./ship-report.md), [validate-export-toast-desktop.png](./validate-export-toast-desktop.png), [validate-export-toast-mobile.png](./validate-export-toast-mobile.png) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| Full AIDLC with Tech Spec + GitHub issue | Product spec + quick fix on `main` | Explicit product decision — polish only |
| Bottom-right placement (#9 tech spec) | **Top-right** on all viewports | Product approval during Plan chat |
| Hover-only close (sonner default docs) | Always-visible close button | Product requirement for immediate dismiss |
| Root cause assumed styling only | **Missing `vue-sonner/style.css`** in `main.js` | Toasts rendered in document flow without sonner CSS |

---

## Patterns to reuse

- **Import sonner CSS once** — `import 'vue-sonner/style.css'` in `src/main.js` before app styles; without it `<Toaster />` does not float.
- **Global host config in `App.vue`** — `position="top-right"`, `:close-button="true"`, shared `offset` / `mobile-offset` with `env(safe-area-inset-*)`.
- **Shared card, typed icons** — neutral popover background + border in `Sonner.vue`; color only on lucide type icons (not `richColors` per-toast backgrounds).
- **Do not wrap oklch tokens in `hsl()`** — sonner CSS variables must use `var(--popover)` directly.

---

## Process friction (feeds AIDLC improvement)

1. **Quick fix still benefits from `/plan` + `/ship`** — small scope, but Validate caught the CSS import gap with UI evidence.
2. **No issue/PR** — acceptable for internal polish; archive under `00-shipped/` so agents find placement rules.
3. **#9 archived tech spec still says bottom-right** — live rules in `docs/ui-rules.md` and ADR-0003 supersede; do not edit shipped #9 specs retroactively.

---

## Remaining debt (accepted)

| Item | Tracking |
|------|----------|
| Celebration toast end-to-end UI walk | Same global host; covered by `HomeView.test.js` |
| Shipped #9 tech spec bottom-right wording | Historical; ui-rules is source of truth |

---

## Feature closure

- [x] Validate PASS recorded
- [x] PROJECT.md updated
- [x] ADR-0003 follow-ups updated (placement, CSS import)
- [x] Learn notes (this file)
- [x] Archived to `feature/00-shipped/toast-look-and-feel/`
- [x] GitHub issue N/A

**Next:** [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) lot-entry-cockpit or [#53](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/53) go-back-to-previous-state per [ux-roadmap.md](../../ux-roadmap.md).
