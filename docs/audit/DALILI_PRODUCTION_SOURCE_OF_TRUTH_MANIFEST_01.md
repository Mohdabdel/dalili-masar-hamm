# DALILI PRODUCTION SOURCE-OF-TRUTH MANIFEST — 01

Descriptive only. Records the CURRENT Production implementation as of generation.
No implementation was created, replaced, or refactored to produce this manifest.

- manifest_id: PRODUCTION-SOT-01
- generated_at: 2026-09-04 (UTC)
- production route namespace: `/space/*` under `src/routes/_authenticated/`
- auth gate: `src/routes/_authenticated/route.tsx`
- state provider (single, canonical): `ProductionSpaceProvider` — `src/features/space/production-store.tsx`
  mounted at `src/routes/_authenticated/space.tsx`
- shared reducer/model: `src/features/space/store.tsx` (`sliceReducer`, `SliceCtx`)
- persistence: Lovable Cloud (Supabase) with RLS, per-user ownership. No sessionStorage in Production.

## Stage map

| # | Stage | Route | Primary component/module | State/provider | Persistence | Key identifier / contract |
|---|-------|-------|--------------------------|----------------|-------------|---------------------------|
| 1 | Discovery / library | `/space/library`, `/activities/*`, `/search` | `LibraryPage.tsx`, `src/lib/knowledge-base.ts` | none (read-only CSV) | CSV corpus `src/data/knowledge/*` | `event_id`, `opportunity_id` |
| 2 | Level selection | `/space/$eventId/level` | `LevelPage.tsx` | ProductionSpaceProvider | none (navigation only) | `SliceLevel` |
| 3 | Participation selection | `/space/$eventId/participations`; also `ParticipationCard.tsx` CTA | `EventParticipationsPage.tsx` | ProductionSpaceProvider | none | `specId = workspaceSpecIdFor(opportunityId)` = `KB-<opportunity_id>` (`src/features/space/participation-link.ts`) |
| 4 | Family Participation create/reuse | (side effect of first save) | `ensureParticipation()` in `production-store.tsx` | ProductionSpaceProvider | table `active_participations` (unique per `opportunity_id`, retry-on-conflict reuse) | `active_participations.id` ↔ `opportunity_id = specId` |
| 5 | Workspace | `/space/workspace/$specId` | `WorkspacePage.tsx` | ProductionSpaceProvider | table `participation_drafts` (upsert on `user_id,spec_id`) | `LabThisTimeSelection` |
| 6 | Composer (steps, order, start/end) | same route | `components/StepComposer.tsx`, `@/lab/components/space/FamilyComposer` (shared UI) | dispatch `selection` | `participation_drafts.selection` | `selected[{stepId, order}]` |
| 7 | Family text override | same route | `@/lab/components/space/FrameEditor` + `compose.ts` | dispatch `selection` | `selection.familyTextByStepId` | `sourceText` immutable vs `familyText` |
| 8 | Image handling | same route | `step-image.ts`, `derived-assets.ts`, `family-uploads.ts` | ProductionSpaceProvider | Storage bucket `family-visuals` + table `visual_assets`; draft stores `uploadedPath` only | `LabStepImageRef` |
| 9 | Considerations | same route | `components/ConsiderationsPanel.tsx`, `considerations-context.ts` | dispatch `selection` | `selection.considerationIds` in `participation_drafts` | consideration ids |
| 10 | Visual support generation | same route | `components/SupportGenerator.tsx` | ProductionSpaceProvider | table `family_support_assets` | `LabSupportAsset` |
| 11 | Preview | `/space/preview/$specId` | `PreviewPage.tsx` + `composeDraft()` in `features/space/compose.ts` | ProductionSpaceProvider | read-only over draft | `ComposedRow[]` |
| 12 | Approval → Frozen Snapshot | same route (approve action) | `buildFrozenSnapshot()` in `compose.ts` | dispatch `snapshot` | table `participation_snapshots` (`snapshot_data` JSON) | `LabCardSnapshot` |
| 13 | Versioning | `/space/card/$specId` | `CardsPage.tsx` | ProductionSpaceProvider | `participation_snapshots.version_number`, next version resolved from DB with retry | `(family_participation_id, version_number)` |
| 14 | Learner Card | `/space/learner/$snapshotId` | `LearnerPage.tsx` | ProductionSpaceProvider | reads frozen `snapshot_data.frames` only | `snapshot.id` |
| 15 | Participation Run | learner/run actions (`run.start` / `run.end`) | `LearnerPage.tsx` + `production-store.tsx` | ProductionSpaceProvider (`startedRuns` guard) | table `participation_runs` (idempotent upsert) | `run.id` |
| 16 | Feedback | `/space/feedback/$snapshotId?runId=` | `FeedbackPage.tsx` | ProductionSpaceProvider | table `participation_feedback` (`run_id` FK) | `(snapshot_id, run_id)` |
| 17 | Card lifecycle (close card) | `/space/feedback/$snapshotId`, `/space/card/$specId` | `FeedbackPage.tsx`, `CardsPage.tsx` | dispatch `card.close` | table `participation_card_states.closed` | `snapshot_id` |
| 18 | Family Participation lifecycle | `/space/feedback/$snapshotId`, `/space/` | `FeedbackPage.tsx`, `SpaceHomePage.tsx` | dispatch `lifecycle` | `active_participations.lifecycle_choice`, `.status` | `SliceLifecycleChoice` |
| 19 | Routine station link | `/my-routine` | `src/lib/family-routine.ts`, `linkParticipationToStation()` | ProductionSpaceProvider refs | tables `routine_stations`, `participation_station_links` | `daily_event_id` |
| 20 | Home surfacing | `/` | `src/routes/index.tsx` + `features/space/home-status.ts` | ProductionSpaceProvider (via hook) | read-only | `specId`, `snapshotId` |

## Session handling

`src/lib/auth-session.ts` → `resolveSession()` is awaited before any owned read in
`production-store.tsx`, preventing unauthenticated reads at hydration.

## Notes / conflicts

See `DALILI_PRODUCTION_LINEAGE_AUDIT_01.md`. One structural anomaly is recorded there:
Production modules import **pure UI/type/catalog** modules that physically live under
`src/lab/**`. No Lab state provider or Lab storage is reachable from Production.
