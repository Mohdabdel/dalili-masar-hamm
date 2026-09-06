# DALILI LEGACY CORPUS EXPORT 01

MODE: STRICT READ-ONLY DATA EXTRACTION — no classification, no migration, no production data mutation.

## SOURCE TRACE

Production discovery resolves reference content through `classifyReferenceSource()`
(`src/lib/framework/source-boundary.ts`), which asks the framework registry first and
falls back to `findOpportunityById()` in `src/lib/knowledge-base.ts`.
`knowledge-base.ts` is the only production Legacy Master reader; it loads four CSV files
as `?raw` and builds the domain → event → opportunity → card index. Every row it emits
carries `provenance: "legacy_master"` and is never auto-promoted.

Excluded by design: Lab fixtures (`src/lab/data/slice/*`), Golden corpus, Batch 02 derived
corpus, Easy Beginning corpus, sessionStorage, and any Supabase table (Supabase stores
family-owned records only — it holds no reference corpus).

## SOURCE FILES/TABLES

| File | SHA-256 |
| --- | --- |
| `src/data/knowledge/01_domains.csv` | c11bb3892935e77c37cb920aa27f0b3cb8e6382e3ea68e6e065642497c66eee6 |
| `src/data/knowledge/02_events.csv` | 103391bbb310b456df36a556274de855556a2c5100d08e791cfaac0a6f2a95d9 |
| `src/data/knowledge/03_participation_opportunities.csv` | 1423fe239d9e06f15f20987c4911e83fd3d5906f307560c3b552ee40fbceedcb |
| `src/data/knowledge/04_participation_cards.csv` | be3f18cd1022efed5118e900a0bb6d1c4919541ce4de97264d9fffb594f8d6d0 |

No database table contributes legacy reference rows. One canonical deduplicated export was
produced by joining opportunity rows (spine) to their parent event, domain, and first card row.

## EXPORT POPULATION

- Opportunity rows in canonical source: **1413**
- Exported legacy_master records: **1413**
- Rows excluded because they classify as `framework_reference`: **0**
- Of the 1413, **1139** currently resolve through the production boundary
  (`findOpportunityById` returns a row) and **274** are `card_pending`
  (their card row is missing or has an empty required field, so the boundary index skips them).
  Both groups are legacy rows in the canonical source, so both are exported, each flagged with
  `resolvable_in_production_boundary` and `card_pending`. No row was dropped, edited, or invented.

## FIELD INVENTORY

Raw fields: `legacy_id`, `opportunity_id`, `opportunity_title_ar`, `parent_event_id`,
`parent_event_title_ar`, `domain_id`, `domain_title_ar`, `domain_category`,
`event_description`, `event_environment`, `event_frequency`, `event_related_domains`,
`daily_event_id`, `routine_station_link` (always null — no legacy routine linkage exists),
`legacy_purpose_text`, `legacy_participation_level`, `legacy_future_participation_level`,
`legacy_role_scope`, `legacy_organization_demand`, `legacy_variation_demand`,
`legacy_classification_reason`, `legacy_safety_mode`, `legacy_assistance_levels`,
`legacy_performance_indicators`, `legacy_independence_mastery`,
`legacy_instructions_before_start`, `legacy_execution_steps`, `legacy_make_it_easier`,
`legacy_support_notes`, `legacy_card_id`, `legacy_card_count`, `display_order`, `status`,
`review_required`, `source_file_field`, `source_file`, `source_row_index`,
`reference_source`, `framework_validated`, `resolvable_in_production_boundary`,
`card_pending`, `superseded_by_framework_reference`.

Structural metadata (deterministic only): `normalized_title`, `has_parent_event`, `has_title`,
`has_purpose`, `has_execution_content`, `has_assistance_fields`, `has_performance_fields`,
`exact_title_equals_parent_event`, `matched_tokens`, `matched_fields`.

## MISSINGNESS COUNTS

| Check | Count |
| --- | --- |
| missing title | 0 |
| missing parent event | 0 |
| has_purpose = true | 1139 |
| has_execution_content = true | 1139 |
| has_assistance_fields = true | 1139 |
| has_performance_fields = true | 1139 |
| card_pending (no usable card row) | 274 |

## DUPLICATE COUNTS

- Duplicate legacy IDs: **0**
- Duplicate normalized titles: **13 groups / 26 rows** (e.g. «مغادرة المكان بانتظام»,
  «الجلوس في المكان المخصص», «دفع القيمة المالية», «الانتظار بهدوء», «جمع الأغراض الشخصية»).
  Group membership is listed in the JSON via `normalized_title`; nothing was merged or deleted.

## EXACT EVENT-TITLE DUPLICATION COUNT

Rows where `opportunity_title_ar` equals `parent_event_title_ar` exactly: **50**.

## LEXICAL LEAKAGE FLAG COUNTS

Rows with at least one matched token: **880**.

| Token | Rows |
| --- | --- |
| بمفرده | 616 |
| مستقلة | 242 |
| بمساعدة | 183 |
| مراقبة | 117 |
| تعلّم | 56 |
| لتعلّم | 38 |
| تقييم | 18 |
| موجهة | 10 |
| تدريب | 4 |
| تعلم / لتعلم / موجّهة / إتقان / اتقان / مؤشرات | 0 |

Lexical presence only — no semantic judgement was made.

## FRAMEWORK REFERENCE CONTROL COUNT

**15** framework_reference records (5 Golden + 5 Batch 02 Green + 5 Easy Beginning), exported
separately to `docs/audit/data/DALILI_FRAMEWORK_REFERENCE_CONTROL_01.json` with
`legacy_source_id` where lineage exists. Zero of them appear inside the legacy export.

## JSON/CSV CONSISTENCY

JSON `legacy_count` = 1413; CSV data rows = 1413; identical field set and ordering; nulls emitted
as empty CSV cells and preserved as `null` in JSON; Arabic preserved as UTF-8 (CSV written with BOM).
Consistency = PASS.

## HASHES

- JSON SHA-256: `e651921db9c46938c8b19edbc82859b8df7ca6427dae6f10d6e276f8e6dc2731`
- CSV SHA-256: `3678a8467880e596d438bf905c50178fab50e82651091bce794d54c7094ba471`
- Source file hashes: see table above.

## ZERO-MUTATION PROOF

Only `SELECT count(*)` statements were run against the database, before and after the export.

| Population | Before | After |
| --- | --- | --- |
| legacy_master (CSV rows) | 1413 | 1413 |
| framework_reference | 15 | 15 |
| active_participations | 19 | 19 |
| participation_snapshots | 32 | 32 |
| participation_runs | 46 | 46 |
| participation_feedback | 15 | 15 |

Production data writes: **0**. Source CSV hashes unchanged after the run.

## FILES CREATED

- `docs/audit/data/DALILI_LEGACY_CORPUS_EXPORT_01.json`
- `docs/audit/data/DALILI_LEGACY_CORPUS_EXPORT_01.csv`
- `docs/audit/data/DALILI_FRAMEWORK_REFERENCE_CONTROL_01.json`
- `docs/audit/DALILI_LEGACY_CORPUS_EXPORT_01.md`

DALILI LEGACY CORPUS EXPORT 01 = PASS
