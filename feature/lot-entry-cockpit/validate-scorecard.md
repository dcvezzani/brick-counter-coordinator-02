# Validate Scorecard — lot-entry-cockpit (#10)

**Feature:** [lot-entry-cockpit](./) · Parent [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) · Validate child [#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67)  
**Product Spec:** [product-spec.md](./product-spec.md)  
**Child Product Spec:** [sub-features/lot-entry-cockpit-validate/product-spec.md](./sub-features/lot-entry-cockpit-validate/product-spec.md)  
**Branch validated:** `feature/lot-entry-cockpit-lot-entry-cockpit-validate` @ `51a3a91` *(updated at commit)*  
**Validate date:** 2026-06-15  
**Threshold:** 90% (AIDLC default)

---

## Result

| Metric | Value |
|--------|-------|
| **Criteria passed** | 2 / 11 |
| **Score** | **18%** |
| **Verdict** | **FAIL** — Waves A–D not merged on integration branch; re-score after upstream `/build` PRs land |

> **Build note:** This Wave E PR delivers the scorecard artifact, `docs/ui-rules.md` worker counting section, and baseline MCP evidence. Parent criteria **#1–#7, #9–#10** remain **FAIL** until Waves A–D (`#60`–`#66`) merge to `feature/lot-entry-cockpit`.

---

## Scorecard (parent Product Spec success criteria)

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Counting **cockpit** with part, color, condition, count — **not** read-only table | **FAIL** | **Code:** `src/views/LotEntryView.vue` still mounts `ResponsiveDataTable` with `lot.label` columns. **Unit:** `tests/unit/views/LotEntryView.test.js` asserts `Lot A` fixture text (pre-cockpit). **MCP @ 375px:** [validate-lot-entry-mobile.png](./validate-lot-entry-mobile.png) — shows Lot A/B/C cards, no form fields. **Blocked by:** [#65 shell](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65), [#64 form](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64). |
| 2 | Save all four fields; session stores part id, color id, condition, count | **FAIL** | `src/components/LotEntryForm.vue` **missing**. `saveLot` four-field shape not wired on integration branch. **Blocked by:** [#64 form](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64), [#62 model](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62). |
| 3 | Duplicate triple merges qty | **FAIL** | No `LotEntryForm` / duplicate `ConfirmDialog` path. **Blocked by:** [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64), [#62](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/62). |
| 4 | Part search favors part-out lines first | **FAIL** | `PartSearchCombobox` not present in `src/`. **Blocked by:** [#60](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/60), Wave A pickers. |
| 5 | Color picker resolves color id after part chosen | **FAIL** | `ColorPicker` not present in `src/`. **Blocked by:** [#61](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/61), Wave A pickers. |
| 6 | Save success toast ([#9](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/9)) | **FAIL** | No save path on lot entry. **Doc:** [ui-rules.md § Feedback primitives](../../docs/ui-rules.md) + new § Worker counting cross-ref ready for consumers. **Blocked by:** [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64). |
| 7 | Count another without leaving route | **FAIL** | No save-and-add-another. **Blocked by:** [#64](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/64). |
| 8 | Compare only in `counting`; advances to `reconciling` | **PASS** | **Unit:** `tests/unit/views/LotEntryView.test.js` — three tests: Compare hidden outside counting; visible in counting; click sets `reconciling` + navigates. |
| 9 | Touch targets — no `size="xs"` on primary cockpit actions | **FAIL** (debt) | **Grep:** `rg 'size="xs"' src/views/LotEntryView.vue` → no matches. Compare `Button` lacks `min-h-11` (shell [#65](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) not merged). `LotEntryForm.vue` absent — Save/stepper not scorable. **Doc:** [ui-rules.md § Worker counting](../../docs/ui-rules.md) publishes `min-h-11` + ban rule. |
| 10 | Usable @ ~375px, no horizontal scroll on core controls | **FAIL** | **MCP:** [validate-lot-entry-mobile.png](./validate-lot-entry-mobile.png) @ 375×812 — read-only lot cards + Compare; **no** part/color/condition/qty/Save controls (cockpit not built). Horizontal scroll N/A on current table cards. **Blocked by:** Waves A–D. |
| 11 | `npm test` / `npm run build` pass | **PASS** | **Local (2026-06-15):** `npm test` — 18 files, 61 tests; `npm run build` — success. |

---

## Gates exercised

| Gate | Result | Notes |
|------|--------|-------|
| **Integration PR** | OPEN | Targets `feature/lot-entry-cockpit` — see child PR from this branch |
| **Local test/build** | **PASS** | `npm test` 18/18 files, 61 tests; `npm run build` OK |
| **UI validation (Chrome DevTools MCP)** | **PARTIAL** | Baseline screenshot captured; cockpit criteria **not** met — evidence documents current read-only state |
| **GitHub Actions CI** | **N/A** | `.github/workflows/ci.yml` triggers on PRs to `main` only — integration PR has no workflow run per Tech Spec |
| **Deploy / staging** | N/A | Local storyboard SPA |

---

## Remaining debt (blocks parent #10 close)

| Item | Tracking |
|------|----------|
| Merge Waves **A–D** to `feature/lot-entry-cockpit` | [#60](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/60)–[#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) — `/build` not started on child branches (Design approved only) |
| Re-score criteria #1–#7, #9–#10 | Re-run `/ship lot-entry-cockpit-validate` after upstream merges |
| Compare `min-h-11` | [#65 shell](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/65) |
| List lots browse columns (Part/Color/Condition/Qty) | [#66](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/66) |
| Parent #10 close | After **PASS** re-score + human gate — not on this FAIL snapshot |

---

## Failures / rework

**Verdict FAIL (18%).** Do **not** close [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10) on this scorecard.

**Recommended sequence:**

1. `/build` Waves A–D children onto `feature/lot-entry-cockpit` (dependency order per [sub-features/README.md](./sub-features/README.md)).
2. Rebase this branch; refresh scorecard rows + MCP screenshot with counting cockpit.
3. `/ship lot-entry-cockpit-validate` → human PASS → close [#67](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/67) and [#10](https://github.com/dcvezzani/brick-counter-coordinator-02/issues/10).

---

## Human gate

Per AIDLC Validate phase (pending upstream delivery):

- [ ] **Human approves Validate PASS** (after re-score ≥ 90%)
- [ ] **Merge Wave E PR** to `feature/lot-entry-cockpit`
- [ ] **Upstream Waves A–D merged** and scorecard refreshed
- [ ] **`/learn lot-entry-cockpit-validate`** after parent PASS
- [ ] **Close GitHub #10** (integration PASS or post-`main` merge — product choice)

---

## Artifacts

- [ship-report.md](./sub-features/lot-entry-cockpit-validate/ship-report.md)
- [validate-lot-entry-mobile.png](./validate-lot-entry-mobile.png) — baseline @ 375px (pre-cockpit)
- [docs/ui-rules.md](../../docs/ui-rules.md) — § Worker counting (lot entry cockpit)
