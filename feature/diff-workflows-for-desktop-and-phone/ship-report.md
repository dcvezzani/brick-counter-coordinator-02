# Ship report — diff-workflows-for-desktop-and-phone

**Validate date:** 2026-06-16  
**Verdict:** **PASS**  
**Scorecard:** [validate-scorecard.md](validate-scorecard.md)

## Evidence summary

### Automated

- **302 tests** (43 files) — local and CI
- **Production build** — green
- **PR #91** — [checks pass](https://github.com/dcvezzani/brick-counter-coordinator-02/actions/runs/27652931424)

### Interactive UI (Chrome DevTools MCP @ port 18000)

| Scenario | Viewport | Outcome |
|----------|----------|---------|
| Worker Home | 375px | Display name + join list; no profile radio |
| Cold deep link counting lot | 375px | Lot entry + bottom nav Home/Lot/Lots/Cups |
| Worker guard reconciliation | 375px | Redirect to wait `reason=reconciling` |
| Coordinator demo → organizer | 1280px | Select assign, assignee badge, organizer mode |
| Worker join organizing demo | 1280px (Worker radio) | Lands on `/session/demo/my-list`; nav Home/Lot/My list; virtual scroll + line actions |
| Waiting state | 1280px | Alert + back, no SessionNav |

### Docs

- [docs/support/application-views.md](../../docs/support/application-views.md) — worker nav + my-list
- [docs/ui-rules.md](../../docs/ui-rules.md) — profile shells, My list, organize prompt

## Not validated in this run

- Side-by-side regression vs `main` coordinator walkthrough (criterion 1 satisfied via in-branch MCP full lifecycle)
- Post-merge deploy smoke (storyboard — local-only app)
