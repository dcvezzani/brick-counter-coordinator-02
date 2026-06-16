# AIDLC — diff-workflows-for-desktop-and-phone

| Field | Value |
|-------|-------|
| **Work item** | [#90](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/90) |
| **Product Spec** | [product-spec.md](product-spec.md) — **Approved** 2026-06-16 |
| **Tech Spec** | [tech-spec.md](tech-spec.md) — **Approved for build** 2026-06-16 |
| **Branch** | `feature/diff-workflows-for-desktop-and-phone` |
| **Worktree** | `/Users/dcvezzani/personal-projects/lego/brick-counter-coordinator-02-worktrees/diff-workflows-for-desktop-and-phone` |
| **PR target** | `main` |
| **Ports (app / api / debug)** | 18000 / 18001 / 18002 |

## Phase commands

| Phase | Status | Command |
|-------|--------|---------|
| Plan | **Approved** 2026-06-16 | `/plan diff-workflows-for-desktop-and-phone` |
| Design | **Approved** 2026-06-16 | `/design` — [tech-spec.md](tech-spec.md) |
| Build | **PR open** — [#91](https://github.com/dcvezzani/brick-counter-coordinator-02/pull/91) @ `2026347` (CI pass) | `/build` |
| Review | **Complete** 2026-06-16 — [review-report.md](review-report.md) pass 2 clear | `/review` |
| Ship | **PASS** 2026-06-16 — [validate-scorecard.md](validate-scorecard.md) 16/16 | `/ship` |
| Learn | **Complete** 2026-06-16 — [learn-notes.md](learn-notes.md) | `/learn` |

## Build waves (sub-agents)

| Wave | Slug (suggested) | Tech Spec unit |
|------|------------------|----------------|
| 0 | `workflow-profile-foundation` | U1 |
| 1a | `workflow-home-guards` | U2 |
| 1b | `workflow-session-chrome` | U3 |
| 2 | `workflow-my-list-organize` | U4 |
| 3 | `workflow-docs-closeout` | U5 |

## File ownership

See [tech-spec.md § UI / client file map](tech-spec.md).
