# DALILI FULL CORPUS INVENTORY & INTEGRITY GATE 01

Date: 2026-09-13
Governing plan: `docs/DALILI_FULL_CORPUS_GOVERNING_EXECUTION_PLAN_v1.0.md`
Inventory artifact: `docs/audit/data/DALILI_FULL_CORPUS_INVENTORY_01.json`

## Scope

Fresh read of the current canonical CSV source on `main`, with a current Framework lineage overlay from Batch02–Batch05. No Legacy content was edited, deleted, rewritten, or materialized by this gate.

## Current source counts

| Population | Count |
|---|---:|
| Domains | 6 |
| Events | 564 |
| Legacy opportunities | 1413 |
| Participation-card rows | 1139 |
| Card-pending Legacy opportunities | 274 |

Legacy accounting: **1413/1413**

Duplicate Legacy IDs: **0**

## Domain distribution

| Domain | Legacy opportunities |
|---|---:|
| DOM-CLO | 50 |
| DOM-COMM | 254 |
| DOM-FOOD | 293 |
| DOM-HEALTH | 232 |
| DOM-HOME | 277 |
| DOM-SHOP | 307 |
| **Total** | **1413** |

## Structural routing signals

- normalized-title duplicate groups: **13**
- rows inside those duplicate groups: **26**
- opportunity title equals parent Event title after normalization: **50**
- card_pending: **274**

These are routing signals only. No automatic merge, exclusion, Event-only decision, or rewrite decision was made from these flags.

## Current Framework lineage overlay

The refreshed inventory overlays currently materialized lineage from:
- Batch02
- Batch03
- Batch04
- Batch05

Results:
- Legacy rows with one or more existing Framework lineage relationships: **45**
- total lineage links from Legacy rows to Framework References: **47**
- Batch04 corrected source items: **12**
- Batch05 corrected source candidates: **12**

Easy Beginning and Golden references without Legacy source IDs are preserved in runtime but are not counted as Legacy-lineage rows.

## Integrity verdict

| Gate condition | Result |
|---|---|
| Canonical Legacy count = 1413 | PASS |
| 1413/1413 represented in inventory | PASS |
| Duplicate Legacy IDs = 0 | PASS |
| No silent drop during inventory generation | PASS |
| Current domain/event relationships available | PASS |
| Card-pending rows explicitly retained | PASS |
| Duplicate-title rows explicitly retained | PASS |
| Existing Framework lineage overlaid | PASS |
| Legacy source mutation | ZERO |

## Disposition policy

This gate intentionally does **not** assign final semantic dispositions.

Every row carries:

`provisional_disposition = PENDING_CLASSIFICATION`

Final values such as `ACCEPTED`, `MERGED_BY_PROVENANCE`, `SPLIT_REQUIRED`, `EVENT_ONLY`, `EXECUTION_BLOCK_ONLY`, `REWRITE_REQUIRED`, or `EXCLUDED_WITH_REASON` belong to Phase 2 classification and subsequent validation.

## Verdict

**PHASE 1 — 1413 CORPUS INVENTORY & INTEGRITY GATE = PASS**

Next authorized phase:

**PHASE 2 — CORPUS CLASSIFICATION**

Execution rule remains:

**Build → Validate → Audit → Materialize → Regression → Continue**
