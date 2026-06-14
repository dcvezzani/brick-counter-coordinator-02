# Ship report — Toast look and feel

**Validate date:** 2026-06-14  
**Verdict:** **PASS** ([validate-scorecard.md](./validate-scorecard.md))  
**Environment:** `http://localhost:5173` (local dev per [AGENTS.md](../../AGENTS.md))

---

## Summary

Polish pass on the global sonner toast host: import `vue-sonner/style.css` (fixes inline rendering), move placement to **top-right**, enable **close button**, apply shared bordered popover styling with colored type icons, and document placement in `docs/ui-rules.md`.

---

## Files changed

| File | Change |
|------|--------|
| `src/main.js` | Import `vue-sonner/style.css` |
| `src/App.vue` | `position="top-right"`, close button, safe-area offsets |
| `src/components/ui/sonner/Sonner.vue` | Popover CSS tokens, shadow/border classes, icon colors |
| `docs/ui-rules.md` | Top-right placement + CSS import note |

---

## UI validation evidence

| Route | Check | Result |
|-------|-------|--------|
| `/session/demo/reconciliation` (export chapter) | Export XML → top-right overlay toast with border/background | PASS — [desktop](./validate-export-toast-desktop.png) |
| Same route (390×844 mobile) | Top-right placement, safe top offset | PASS — [mobile](./validate-export-toast-mobile.png) |
| Export toast | Close button dismisses without waiting for auto-dismiss | PASS |
| `/` | `Notifications` live region present | PASS (a11y snapshot on Home) |

---

## Automated checks

| Command | Result |
|---------|--------|
| `npm test` | 61/61 pass |
| `npm run build` | Success |

---

## Handoff

Validate phase complete. Archived to `feature/00-shipped/toast-look-and-feel/` — see [learn-notes.md](./learn-notes.md).
