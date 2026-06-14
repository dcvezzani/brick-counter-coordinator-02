# ADR-0001: Frontend stack — Vue 3, JavaScript, shadcn-vue v2

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-12 |
| **Deciders** | David Vezzani |
| **Related** | [Feature initial-setup](../docs/feature/00-shipped/initial-setup/), [issue #1](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/1), [docs/tech-stack.md](../docs/tech-stack.md) |

---

## Context

Brick Counter Coordinator needs a maintainable frontend that supports future storyboard and live coordinator modes. The owner prefers **JavaScript over TypeScript** on the client. The UI should use a component toolkit compatible with Tailwind and accessible primitives without locking into a heavyweight framework-specific design system.

## Decision

We standardize on:

- **Vue 3 + Vite** for the SPA build and dev server
- **JavaScript only** for client source (no `lang="ts"` in SFCs)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **shadcn-vue v2** toolchain (`reka-nova` style preset, **olive** base color, **Inter** font, Lucide icons) — copy-in components under `src/components/ui/`
- **Vue Router** for client-side routing
- **Vitest + @vue/test-utils** for unit tests, scoped to `src/` (exclude AI-DLC submodule)
- **Node.js 24.x** for local dev and CI

The coordinator server remains a separate future decision; this ADR covers the **browser client only**.

## Options considered

| Option | Summary | Why not chosen |
|--------|---------|----------------|
| React + TypeScript | Common ecosystem | Owner preference for Vue + JS |
| Vue + TypeScript | Strong typing | Explicitly out of scope for client |
| shadcn-vue v1 / `new-york` naming | Older docs referenced this | v2 CLI uses `reka-nova` presets; olive base still supported |
| Plain Tailwind without shadcn | Lighter bootstrap | Future storyboard needs shadcn-vue primitives; init toolchain now |
| Playwright for UI validation | E2e in CI | Deferred; AIDLC UI validation uses Chrome DevTools MCP |

## Consequences

### Positive

- Single documented stack in `docs/tech-stack.md` and `PROJECT.md`
- shadcn-vue CLI path ready for storyboard components
- JS-only client reduces toolchain friction for owner and agents
- Vitest + CI on every PR catches regressions early

### Negative / trade-offs

- shadcn-vue v2 naming differs from older `new-york` references in early drafts
- No e2e suite yet — rely on unit tests + MCP UI validation for Features with UI criteria
- `engines: >=24` may warn on developers still on Node 22 until they upgrade

### Neutral / follow-ups

- Add Playwright when storyboard navigation warrants e2e CI
- ADR for coordinator server when that Feature is designed

## Compliance & verification

- `components.json` enforces `typescript: false`
- CI runs `npm test` and `npm run build` on PRs to `main`
- Review checklist traces Tech Spec acceptance criteria
- New Features should link this ADR from their Tech Spec if touching the client stack

## References

- [docs/feature/00-shipped/initial-setup/tech-spec.md](../docs/feature/00-shipped/initial-setup/tech-spec.md)
- [shadcn-vue](https://shadcn-vue.com/)
- [validate-scorecard.md](../docs/feature/00-shipped/initial-setup/validate-scorecard.md)
