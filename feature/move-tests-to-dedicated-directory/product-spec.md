# Product Spec — Move tests to dedicated directory

**AIDLC phase:** Plan  
**Audience:** Product, engineering leads, contributors — **product language only** (implementation details belong in `/design`).

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Move tests to dedicated `tests/` directory |
| **Status** | **Approved** (2026-06-13) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-13 |
| **Related Tech Spec** | *(pending `/design`)* |
| **Work item** | [#47 Move tests to dedicated tests/ directory](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/47) |

## Problem & audience

### Problem statement

Automated tests live beside production code under `./src` (e.g. `ViewHeader.spec.js` next to `ViewHeader.vue`). That makes the source tree harder to scan, blurs “what ships to users” vs “what verifies behavior,” and encourages inconsistent placement as the test count grows with UI consolidation work.

Contributors want a **single, predictable home** for all tests: unit tests under `./tests/unit`, integration tests under `./tests/integration`.

### Who it's for

- **Contributors and agents** adding or updating tests during feature work.
- **Reviewers** who need a clear separation between app code and verification assets.
- **Future CI/maintainers** who may split test tiers (fast unit vs slower integration) without reshuffling files again.

### Current experience (baseline)

- Multiple Vitest files are tracked under `src/` (components, views, router, lib).
- `npm test` runs them via `vite.config.js` pattern `src/**/*.{test,spec}.js`.
- No `./tests` directory exists; no integration test tier is defined.
- Older Tech Specs (`initial-setup`, `storyboard-ui`) document co-located tests under `src/` — docs will drift until updated in Design.

## Outcomes & business impact

### Desired outcomes

- **All application unit tests** live under `./tests/unit`, **mirroring `src/` layout** (e.g. `tests/unit/components/ViewHeader.test.js`).
- **File suffix standardized** on `.test.js` (rename during migration from `.spec.js`).
- **`tests/integration/`** includes README plus **one exemplar** integration test (router redirect flow).
- **`./src` contains no test files** after migration — production tree is clean.
- **CI blocks** new test files under `src/` so the policy cannot regress silently.
- **`npm test` and CI** pass with the same or greater behavioral coverage (unit migration + integration exemplar).

### Success criteria (for Validate)

| # | Criterion | How we'll verify |
|---|-----------|------------------|
| 1 | Zero `*.test.js` / `*.spec.js` under `src/` | Repo search + CI guard step fails on violation |
| 2 | All former unit tests run from `tests/unit/` with `.test.js` suffix | `npm test` pass count ≥ pre-migration baseline |
| 3 | Layout mirrors `src/` under `tests/unit/` | Spot-check paths (e.g. `tests/unit/components/`, `tests/unit/views/`) |
| 4 | Integration tier has README + router redirect exemplar | `tests/integration/` present; exemplar passes in `npm test` |
| 5 | CI enforces no tests in `src/` | CI step fails if `src/**/*.{test,spec}.js` exists |
| 6 | CI unchanged for contributors otherwise | PR CI: `npm test` + `npm run build` green |
| 7 | Contributor guidance updated | PROJECT.md references `tests/unit` and `tests/integration` |

### Business impact

Lower friction and fewer mistakes as the test suite grows. Clear separation of production vs verification assets. Integration folder establishes pattern for route-level tests without a future tree move.

## User experience & scenarios

These are **contributor** scenarios, not end-user product flows.

1. **Add a component test** — Contributor creates `tests/unit/components/ViewHeader.test.js`, imports the component via `@/` alias, runs `npm test`.
2. **Add a route flow test** — Contributor adds scenarios under `tests/integration/` (see README + router redirect exemplar).
3. **Review a PR** — Reviewer inspects `src/` for production changes only; `tests/` for behavioral changes.
4. **Accidental co-location** — Contributor adds `src/foo.test.js`; CI fails with a clear message to use `tests/unit/`.

## Scope

### In scope

- Move **all existing application** Vitest files from `src/` to **`tests/unit/`** mirroring `src/` directory structure.
- **Rename** `*.spec.js` → `*.test.js` during the move.
- Add **`tests/integration/`** with README and **one router redirect flow exemplar**.
- Update **Vitest discovery** for `tests/unit/**` and `tests/integration/**` (Design/Tech Spec).
- Add **CI guard** that fails the build if any `src/**/*.{test,spec}.js` exists.
- Update **contributor-facing docs** (PROJECT.md key directories).

### Out of scope

- Tests inside **`.claude/deps/ai-dlc`** submodule (separate package with its own Vitest config).
- Changing **test framework** (stay on Vitest + `@vue/test-utils`).
- **E2E / browser automation** (Playwright, etc.) — future feature if needed.
- Rewriting **historical Tech Spec path diagrams** in closed features unless they confuse active work (Design may note drift only).
- **Optional** `test:unit` / `test:integration` npm script split — Design may add if low cost; not required for Validate.

### Dependencies on other teams or features

- **Standalone** feature — land **whenever** convenient; not gated on #5 merge waves.
- Rebase coordination if parallel branches add co-located tests before this merges.

## Constraints (non-technical where possible)

- **No regression:** migrated unit tests must preserve assertions and pass count.
- **Minimal churn:** move + rename + import fixes; do not rewrite test logic unnecessarily.
- **Node 24 / existing CI** must remain green without new secrets or infra.
- **Alias `@/` → `src/`** must keep working for tests importing components (Design detail).

## Decisions

| Date | Decision |
|------|----------|
| 2026-06-13 | **Layout:** `tests/unit/` mirrors `src/` (e.g. `tests/unit/components/ViewHeader.test.js`). |
| 2026-06-13 | **Suffix:** standardize on `.test.js`; rename all `.spec.js` during migration. |
| 2026-06-13 | **Integration:** include README + one exemplar (router redirect flow), not empty scaffold only. |
| 2026-06-13 | **Enforcement:** CI must fail if `src/**/*.{test,spec}.js` exists — in scope for this feature. |
| 2026-06-13 | **Timing:** standalone whenever; not tied to consolidate-and-clean-ui wave merges. |
| 2026-06-13 | **Product Spec approved** — proceed to `/design`. |

## Related documents

- Tech Spec: *(pending `/design`)*
- [PROJECT.md](../../PROJECT.md) — key directories (to update)
- [initial-setup/tech-spec.md](../00-shipped/initial-setup/tech-spec.md) — documents co-located pattern (baseline)
- [AGENTS.md](../../AGENTS.md) — issue tracker
