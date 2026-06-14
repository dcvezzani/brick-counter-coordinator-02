# Learn notes — initial-setup

**Feature:** [initial-setup](./) · [issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1)  
**Validate:** [validate-scorecard.md](./validate-scorecard.md) — **PASS 100%** (2026-06-12)  
**Learn date:** 2026-06-12

---

## Documentation captured

| Artifact | Path |
|----------|------|
| Project memory | [PROJECT.md](../../../PROJECT.md) |
| ADR — frontend stack | [adr/0001-frontend-vue-js-shadcn-stack.md](../../../adr/0001-frontend-vue-js-shadcn-stack.md) |
| Tech Spec retrospective | [tech-spec.md](./tech-spec.md) § Retrospective |
| Validate evidence | [ship-report.md](./ship-report.md), [validate-hello-screenshot.png](./validate-hello-screenshot.png) |

---

## What differed from plan

| Planned | Delivered | Why |
|---------|-----------|-----|
| shadcn `new-york` style | `reka-nova` (v2) | shadcn-vue CLI v2 renamed presets |
| Tech Spec *Draft* through Build | Approved mid-cycle | Design gate closed after review feedback |
| `.cursor/mcp.json` out of scope | Added during Build | Required for AIDLC UI validation |
| Vitest optional separate config | Merged in `vite.config.js` | Simpler; one config file |
| First push set default branch | `feature/initial-setup` was default briefly | Empty remote + first branch pushed; fixed after merge |

---

## Patterns to reuse

- Create `feature/<slug>` git branch at **Build**, not Plan/Design
- Push **`main`** to GitHub before first feature branch
- Scope Vitest to `src/**` when AI-DLC submodule is present
- Run shadcn-vue init **interactively** or with confirmed flags — non-interactive retry can hang
- Use **Chrome DevTools MCP** (not cursor-ide-browser) for formal UI validation evidence

---

## Process friction (feeds AIDLC improvement)

1. **Branch default on new repo** — document “push `main` first” in consumer setup checklist.
2. **shadcn-vue CLI drift** — keep `docs/tech-stack.md` aligned with CLI v2 preset names, not legacy docs.
3. **Validate vs Learn** — scorecard committed on `main` after merge; Learn artifacts follow in separate commit (correct split).

---

## Feature closure

- [x] Validate PASS recorded
- [x] PROJECT.md updated
- [x] ADR-0001 written
- [x] Retrospective on Tech Spec
- [x] Parent issue #1 closed (2026-06-12)

**Next Feature:** storyboard or coordinator — start with `/plan <slug>`.
