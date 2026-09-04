# DALILI CANONICAL LEARNER SNAPSHOT SELECTION 01

Foundation 05 — canonical learner surface + explicit approved snapshot selection (D06, D07, SN-07, LC-01).
Controlled use-surface correction only. No entry architecture, no Easy Beginning, no content migration,
no FP validity or identity change, no schema migration.

## LEARNER SURFACES BEFORE

| ROUTE | CALLER | FP ID | SNAPSHOT ID | VERSION | HOW SELECTED | APPROVED REQUIRED | RUN LINK | CAN BYPASS APPROVAL |
|---|---|---|---|---|---|---|---|---|
| `/space/learner/$snapshotId` | `CardsPage` (list of approved versions), `SpaceHomePage` (per open card) | resolved from `participationBySnapshot` → `active_participations.id` | route param, explicit | version of that exact snapshot row | family clicks a specific approved version card | yes (state only holds `participation_snapshots` rows) | `run.start` inserts `participation_runs(family_participation_id, snapshot_id)` | NO |
| `/space/card/$specId` | library / home | canonical id via spec compatibility map | none (list only) | lists all versions | no launch without picking a version | n/a | n/a | NO |
| `/space/preview/$specId` | Workspace | canonical id | pre-approval composition | n/a | draft preview, not learner use | n/a | none | NO (preview is not learner use) |
| `/learner/$id` (legacy) | `ParticipationCard` sheet, `SupportDuringExecution` | **none** | **none** | **none** | built frames from CSV / Master reference via `getLearnerCard()` | **no** | none | **YES** |
| `/lab/slice/learner/$snapshotId` | Lab fixtures (sessionStorage) | Lab-only | Lab snapshot | Lab | prototype | n/a | n/a | not production |

Root drift = the legacy CSV route only. Production launch links already carried an explicit snapshot id;
what was missing was an enforced resolution guard inside the learner surface itself.

## CANONICAL SURFACE AFTER

`/space/learner/$snapshotId` → `src/features/space/pages/LearnerPage.tsx` is the single production
learner implementation. It now resolves through the pure guard
`src/features/space/learner-resolution.ts` (`resolveLearnerLaunch`), which requires:
explicit snapshot id → present in the owner-scoped loaded approved snapshots → (optionally) matching
family participation → non-empty frozen frames. Any failure renders a block message. There is no
"latest approved" query anywhere in the learner runtime and no fallback to another version.

## LEGACY /learner/$id DISPOSITION

REDIRECTED (neutral, non-learner). `src/routes/learner.$id.tsx` now `beforeLoad`-redirects to
`/space/workspace/$specId` (family draft space) and renders no content. `getLearnerCard()` is no longer
reachable from any route. The two callers were repointed to the workspace and relabelled
«جهّزوا بطاقة المشارك». Verified: `GET /learner/KB-CLO-001-OP001` → `/space/workspace/KB-CLO-001-OP001`.

## SELECTION STATE

No schema change and no new table. Explicit selection lives in exactly two existing places:
1. navigation state — the `$snapshotId` route param, produced only by UI that lists concrete approved
   versions (CardsPage version list, Home per-card action);
2. durable use record — `participation_runs.snapshot_id`, written at run start with the exact resolved id.
Selection is family/use state; nothing is written into the snapshot row or into Master/reference content.

## SNAPSHOT OWNERSHIP CHECK

State snapshots come solely from `participation_snapshots` under RLS `user_id = auth.uid()`, so an
unknown or foreign-user snapshot id resolves to `not-found` and is blocked. Cross-participation use is
blocked by the `expectedSpecId` check; run insertion resolves the family participation via
`participationBySnapshot` / `reference_spec_id` and aborts when it cannot be resolved.

## RUN LINKAGE

`run.start` writes `family_participation_id` = canonical `active_participations.id` and
`snapshot_id` = the exact selected snapshot; it never queries "latest". Guarded by `startedRuns` so one
insert per run id. `run.end` only stamps `ended_at`.

## VERSION TEST

Live production data (no new writes, no history rewrite):

| FP | version | snapshot | runs |
|---|---|---|---|
| 37b39290… | v1 | ac2b95e1… | 1 |
| 37b39290… | v2 | cd830ead… | 2 |
| 6452f213… | v1 | 70c8f338… | 6 |
| 6452f213… | v2 | e5ea259f… | 0 |
| 6452f213… | v3 | 39ac68f7… | 1 |

v1 runs remained attached to v1 after v2 and v3 were approved; approving a new version created a new row
and mutated nothing. Aggregate checks: runs = 27, snapshots = 19, runs with a null snapshot = 0,
runs whose snapshot belongs to a different family participation = 0, feedback whose snapshot ≠ its run's
snapshot = 0.

## NEGATIVE TESTS

`src/features/space/__tests__/learner-resolution.test.ts` (6 tests, all pass):
A unapproved/absent selection → `missing-selection`, blocked; B nonexistent id → `not-found`, no fallback;
C snapshot of another family participation → `wrong-participation`; D foreign-user id is not in the
RLS-scoped set → `not-found`; E newer v2 present while v1 selected → still v1; F legacy CSV route no
longer serves learner content (redirect verified over HTTP).

## LEARNER PROJECTION

Unchanged UI: frozen frames only, one execution block per screen, «التالي» / «السابق», ends with «انتهينا».
No considerations, complexity rationale, provenance, ability, mastery, progress, independence or scores
reach the learner surface.

## ROUTINE STATION SAFETY

No learner/run code path writes `routine_stations.status` or `completed_at`; `routine_stations` with
`status='completed'` = 0. Foundation 04 intact.

## REMAINING DRIFT

- Route params and draft keys remain `specId` (compatibility only; Foundation 03 boundary).
- Selection is passed per launch rather than persisted as a named "current version" field — sufficient
  for SN-07, revisit only if a persisted family default is later required.
- Lab prototype learner route remains (`/lab/slice/...`), isolated from production data.
