# Product Spec — Consolidate UI validate

**AIDLC phase:** Complete (Validate fulfilled by parent [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5))  
**Audience:** Product, engineering leads, stakeholders — **product language only**.

---

## Overview

| Field | Value |
|-------|-------|
| **Feature** | Consolidate UI validate — close parent #5 |
| **Status** | **Complete** — parent Validate PASS (6/6) · [#5 closed](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) |
| **Author** | David Vezzani (with AI draft) |
| **Created** | 2026-06-13 |
| **Last updated** | 2026-06-14 |
| **Validate evidence** | [validate-scorecard.md](../consolidate-and-clean-ui/validate-scorecard.md) · [ship-report.md](../consolidate-and-clean-ui/ship-report.md) |
| **Parent work item** | [#5](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/5) · [#40](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/40) |
| **Parent spec** | [consolidate-and-clean-ui/product-spec.md](../consolidate-and-clean-ui/product-spec.md) |

## Problem & audience

### Problem statement

Parent #5 spans many child features. A dedicated **Validate** pass ensures the parent success criteria are met before closing the epic and running `/learn`.

### Who it's for

- Product owner sign-off.
- Future contributors trusting #5 is complete vs incremental debt remaining.

## Outcomes & business impact

### Success criteria (Validate scorecard)

Uses parent #5 checklist:

- [ ] All seven views: shared frame + header
- [ ] Zero duplicated sticky footer strings in views
- [ ] Session tables use ResponsiveData (or documented exceptions)
- [ ] `docs/ui-rules.md` published
- [ ] Phase/nav rules unchanged
- [ ] `npm test` / `npm run build` pass
- [ ] Close GitHub #5 or list explicit remaining debt with issue links

### Business impact

Formal completion of UI consolidation milestone.

## Scope

### In scope

- AIDLC `/ship` scorecard for parent #5.
- UI walkthrough all routes; optional MCP validation per INTERACTIVE-UI-VALIDATION.md.

### Out of scope

- Accessibility full audit.
- Features #9, #10, #11 delivery.

## Dependencies

- All sibling child features 1–10 complete.
- [ui-rules-publish](../ui-rules-publish/product-spec.md) merged.

## Related documents

- [AIDLC.md](../../docs/AIDLC.md) — Validate phase
