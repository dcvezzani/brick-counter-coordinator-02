# Integration tests

Cross-module scenarios that exercise the **production router**, session state, and navigation together.

## When to add tests here

- Route guards and redirects (e.g. closed session → Home)
- Flows that need the real `src/router/index.js` plus storyboard session helpers
- App-level navigation side effects

## When to use `tests/unit/` instead

- Single component or view in isolation (mocked or minimal router)
- Pure lib module behavior (`storyboard-session`, `feedback`, etc.)
- Fast, focused assertions with `@vue/test-utils` `mount`

## Conventions

- File suffix: `*.test.js`
- Import production code via `@/` (e.g. `@/router/index.js`, `@/lib/storyboard-session.js`)
- Reset storyboard state in `beforeEach`: `__resetSessionsForTests()`
- See `router-closed-session-redirect.test.js` for the router redirect exemplar

## Commands

```bash
npm test                      # unit + integration
npm run test:integration      # this folder only
npm run test:unit             # tests/unit only
```
