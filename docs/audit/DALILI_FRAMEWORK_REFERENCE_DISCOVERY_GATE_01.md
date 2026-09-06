# DALILI FRAMEWORK REFERENCE DISCOVERY GATE 01

MODE: BOUNDED IMPLEMENTATION / SINGLE BLOCKER FIX (P-1)
DATE: 2026-09 (live run on preview backend, authenticated family session)

---

## 1. SCOPE

Close blocker **P-1**: `framework_reference` records existed in the registry but were
undiscoverable in production Discovery, because Discovery read the legacy library only.

No corpus dry run was started. No auto-promotion. No legacy row deleted or edited.

---

## 2. REFERENCE INVENTORY (BEFORE = AFTER)

| Source | Count | IDs |
| --- | --- | --- |
| framework_reference (registry) | 15 | 5 Golden + 5 Batch02 Green + 5 Easy Beginning |
| Golden | 5 | GJ-EASY-001, GJ-SHARED-001, GJ-DISCOVERY-001, GJ-MODERATE-001, GJ-ADVANCED-001 |
| Batch02 Green | 5 | FR-B02-COMM-005-OP001, FR-B02-COMM-002-OP001, FR-B02-HEALTH-014-OP001, FR-B02-SHOP-066-OP001, FR-B02-SHOP-019-OP002 |
| Easy Beginning | 5 | FR-POPCORN-BRING-001, FR-POPCORN-SHARE-001, FR-WATER-JUG-001, FR-OUTING-BAG-001, FR-MUSIC-PLAY-001 |
| legacy_master (CSV library) | unchanged | not modified by this gate |

---

## 3. ROOT CAUSE (TRACED, NOT GUESSED)

Two exclusions in the discovery layer, both in `src/lab/data/space/catalog.ts`:

1. **Query exclusion** — `allSpaceEvents()` / `participationsForEvent()` built their result
   set exclusively from the legacy CSV library (`knowledge-base`) plus lab fixtures. The
   framework registry (`reference-registry.ts`) was never queried, so no framework record
   could appear in any lens.
2. **Resolver exclusion** — `getSpaceSpec(id)` resolved `KB-*` legacy ids and fixture ids
   only. Even a direct URL to a framework id returned `null`, so the workspace could not
   open a framework reference at all.

Consequence: registration succeeded (Batch 01/02 passed) while production surface coverage
was zero. This was a **read-path defect**, not a content defect.

---

## 4. IMPLEMENTATION (SMALLEST ARCHITECTURE-CONSISTENT CHANGE)

New file `src/lib/framework/discovery.ts`:

- `ensureFrameworkCorpora()` — idempotent registration of the three corpora.
- `discoverableFrameworkParticipations()` — the registry as a read-only list.
- `frameworkParticipationsForEvent(eventId)`
- `frameworkOnlyEvents()` — events that exist only through framework references.
- `legacyIdsSupersededByFramework()` — legacy ids that have a framework lineage.

Changes in `src/lab/data/space/catalog.ts`:

- `frameworkSpaceEvents()` builds SpaceEvents for framework-only events; merged into
  `allSpaceEvents()` and `getSpaceEvent()` fallback.
- `specFromFrameworkReference(p)` → spec with `provenance: "framework_reference"`,
  `id = p.id`, `eventId = p.event_id ?? ""`.
- `frameworkSpecsForEvent()` + `participationsForEvent()` → `[...framework, ...legacy]`.
- `librarySpecsForEvent()` filters out ids returned by `legacyIdsSupersededByFramework()`.
- `getSpaceSpec()` resolution order: framework id → `KB-*` legacy → fixture.

No semantic merge, no field copying between sources, no rewriting of legacy content.

---

## 5. PRECEDENCE RULE (DOCUMENTED)

> When a framework reference declares lineage to a legacy opportunity, the framework
> reference is the **only candidate shown inside that event's candidate set**; the legacy
> row remains stored, readable and resolvable by its own id with
> `reference_source = legacy_master`. Precedence is a display rule, never a deletion,
> never a promotion, never a rewrite.

Currently no framework reference declares legacy lineage in the discovery candidate set
(`legacyIdsSupersededByFramework()` is empty), so no legacy candidate is currently hidden.
The rule is implemented and active for future batches.

---

## 6. FAMILY-FACING LANGUAGE

No technical provenance label is rendered anywhere in the family UI. `framework_reference`
and `legacy_master` exist only in data and audit surfaces.

---

## 7. REACHABILITY MATRIX

| ID | spec resolves | provenance | appears in its event |
| --- | --- | --- | --- |
| GJ-EASY-001 | yes | framework_reference | yes |
| GJ-SHARED-001 | yes | framework_reference | yes |
| GJ-DISCOVERY-001 | yes | framework_reference | yes |
| GJ-MODERATE-001 | yes | framework_reference | yes |
| GJ-ADVANCED-001 | yes | framework_reference | yes |
| FR-B02-COMM-005-OP001 | yes | framework_reference | yes |
| FR-B02-COMM-002-OP001 | yes | framework_reference | yes |
| FR-B02-HEALTH-014-OP001 | yes | framework_reference | yes |
| FR-B02-SHOP-066-OP001 | yes | framework_reference | yes |
| FR-B02-SHOP-019-OP002 | yes | framework_reference | yes |
| FR-POPCORN-BRING-001 | yes | framework_reference | n/a — Easy Beginning entry (no event_id, by design, Foundation 06) |
| FR-POPCORN-SHARE-001 | yes | framework_reference | n/a — Easy Beginning entry |
| FR-WATER-JUG-001 | yes | framework_reference | n/a — Easy Beginning entry |
| FR-OUTING-BAG-001 | yes | framework_reference | n/a — Easy Beginning entry |
| FR-MUSIC-PLAY-001 | yes | framework_reference | n/a — Easy Beginning entry |

All 5 Golden and all 5 Batch02 Green references are reachable from Discovery.

---

## 8. LIVE DOWNSTREAM SMOKE — REFERENCE A: GJ-EASY-001

Discovery → Family Participation → Workspace → Preview → Approval → explicit Snapshot →
Learner → Run → Feedback.

- Discovery `/space/explore` (lens "حسب أحداث اليوم" → "داخل المنزل") lists the event.
- Workspace `/space/workspace/GJ-EASY-001` → H1 "إحضار البوب كورن إلى مكان جلوس الأسرة".
- Preview → "اعتماد بطاقة المشاركة" → redirect `/space/card/GJ-EASY-001`.
- Canonical Family Participation `active_participations.id = a65f6f41-bb2e-4030-95c6-d5b3d0d5aa95`
  `origin = reference`, `reference_source = framework_reference`, `functional_identity` present.
- Approved frozen snapshot `fd424579-9a4c-4d21-ad2d-7ceb538a2a60` (1 snapshot for this participation).
- Learner `/space/learner/fd424579-…` opened from the explicitly selected approved snapshot.
- Run `45f7f8fb-651b-4b93-a99e-6c82224cdff2`, `snapshot_id` exactly the approved snapshot, ended.
- Feedback `5b6d79f0-…` `run_id` = that exact run, `snapshot_id` = run snapshot, `tone = comfortable`.

## 9. LIVE DOWNSTREAM SMOKE — REFERENCE B: FR-B02-COMM-005-OP001

- Workspace H1 "تحديد موعد اللقاء الأسري ومكانه مع الأسرة".
- Family Participation `d420e275-6761-4a4d-b38f-e327bd3356e1`, `origin = reference`,
  `reference_source = framework_reference`, identity present.
- Snapshot `70975190-a535-4b09-99db-42d40c073f17`.
- Run `5ce6d69f-4aea-4c2e-8cd6-c9eb0b12b4c0` (snapshot_id exact match), Feedback `ad7df9a5-…`.
- Legacy counterpart `KB-COMM-005-OP001` still resolves independently as `legacy_master`.

---

## 10. SOURCE IMMUTABILITY

`familyText` was edited in the workspace for both references. The registry entries are
frozen (`Object.freeze` on record, `complexity`, `dimensions`, `execution_blocks`), and the
family edit is written to family-owned state only. After the edit:

- reference definition text unchanged,
- `reference_spec_id` / `reference_source` unchanged on the family row,
- no write attempted against Reference Knowledge (IM-01 holds).

---

## 11. COUNTS BEFORE / AFTER

| Metric | Before | After | Delta |
| --- | --- | --- | --- |
| active_participations (total) | 17 | 19 | +2 (the two smoke references) |
| … with reference_source = legacy_master | 13 | 13 | 0 |
| … with reference_source = framework_reference | 0 | 2 | +2 |
| participation_snapshots | 30 | 32 | +2 |
| participation_runs | 38 | 46 | +8 (repeated learner passes during verification) |
| participation_feedback | 13 | 15 | +2 |
| routine_stations status='completed' | 0 | 0 | 0 |

Registry counts (legacy_master / framework_reference reference records) unchanged: no
content was migrated, created, or promoted by this gate.

---

## 12. NEGATIVE TESTS A–J

| # | Test | Result |
| --- | --- | --- |
| A | Legacy row deleted or mutated by discovery | NOT OBSERVED — legacy CSV untouched, 13 legacy family rows unchanged |
| B | Auto-promotion of a legacy id to framework_reference | NOT OBSERVED — `classifyReferenceSource` promotes nothing |
| C | Semantic merge of legacy + framework fields | NOT OBSERVED — specs built from a single source each |
| D | Duplicate candidate (same participation twice in one event) | NOT OBSERVED — precedence filter applied |
| E | Technical provenance label leaking to the family UI | NOT OBSERVED |
| F | Family edit writing back to the reference definition | NOT OBSERVED (§10) |
| G | Learner reading live CSV instead of the frozen snapshot | NOT OBSERVED — learner resolves the explicitly selected approved snapshot only |
| H | Run bound to a snapshot other than the selected one | NOT OBSERVED — `run.snapshot_id` exact match, both references |
| I | Feedback orphaned or bound to the wrong run | NOT OBSERVED — `feedback.run_id` = exact run for both |
| J | Unintended write to routine_stations / auto-completion | NOT OBSERVED — completed stations still 0 |

---

## 13. TARGETED REGRESSION

- Typecheck `bunx tsgo --noEmit -p tsconfig.json` → clean.
- `bunx vitest run src/lib/framework src/features/space` → 7 files, **55/55 pass**,
  including the new `src/lib/framework/__tests__/discovery-gate.test.ts` (4 tests).
- Browser console during the live smoke: 0 errors.

---

## 14. FILES CHANGED

- `src/lib/framework/discovery.ts` (new)
- `src/lab/data/space/catalog.ts` (discovery + resolver inclusion, precedence filter)
- `src/lib/framework/__tests__/discovery-gate.test.ts` (new)
- `docs/audit/DALILI_FRAMEWORK_REFERENCE_DISCOVERY_GATE_01.md` (this file)

No schema change. No migration. No content file changed.

---

## 15. RESIDUAL NOTES

- The 5 Easy Beginning references intentionally carry no `event_id`; they are reached through
  the "بداية سهلة" entry, per Foundation 06. This is design, not a discovery gap.
- `legacyIdsSupersededByFramework()` is currently empty; the precedence rule is implemented
  and will engage automatically when a future batch declares legacy lineage.

---

## 16. VERDICT

DALILI FRAMEWORK REFERENCE DISCOVERY GATE 01 = PASS

CORPUS DRY RUN ALLOWED: YES

(Dry run not started — stopped here as instructed.)
