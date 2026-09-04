# DALILI PRODUCTION-LINEAGE AUDIT — 01

Read-only classification. Nothing was deleted, moved, or rewritten.

## Search terms audited

`/lab`, `LabStateProvider`, `dalili-lab-v1`, `sessionStorage`, `GoldenWorkspace`,
`TestWorkspace`, `GoldenComposer`, `TestComposer`, `GoldenStateProvider`,
`TestStateProvider`, `prototype`, `scenario`, `demo`.

## 1. PRODUCTION — canonical execution

- `src/routes/_authenticated/space*.tsx` (13 route files) + `space.tsx` provider mount
- `src/routes/_authenticated/{route,my-routine,active-participations,account}.tsx`
- `src/features/space/**` (pages, components, `compose.ts`, `store.tsx`, `production-store.tsx`,
  `step-image.ts`, `derived-assets.ts`, `family-uploads.ts`, `home-status.ts`,
  `considerations-context.ts`, `participation-link.ts`)
- `src/lib/{knowledge-base,auth-session,family-routine,active-participations}.ts`
- `src/routes/{index,activities*,search,resources,participation-guide,learner.$id}.tsx`
- Persistence: Supabase tables `active_participations`, `participation_drafts`,
  `participation_snapshots`, `participation_card_states`, `participation_runs`,
  `participation_feedback`, `family_support_assets`, `participation_station_links`,
  `routine_stations`, `visual_assets`; storage bucket `family-visuals`.

## 2. REFERENCE/LAB — non-production

- `src/routes/lab*.tsx` (33 route files), gated by `src/routes/lab.tsx` which mounts
  `LabStateProvider` (`src/lab/state/lab-state.tsx`, storage key `dalili-lab-v1`, sessionStorage).
- `src/lab/slice/state.tsx` — Lab-only slice provider, sessionStorage.
- `src/lab/state/**`, `src/lab/data/fixtures.ts`, `src/lab/data/slice/**` (demo fixtures).
- `apps/community`, `apps/education` — standalone reference apps, not part of the Production bundle.

## 3. POSSIBLE CONFLICT

| id | finding | evidence | assessment |
|----|---------|----------|------------|
| LIN-01 | Production modules import shared modules physically located under `src/lab/**`: `@/lab/slice/types`, `@/lab/components/lab-ui`, `@/lab/components/StepFrame`, `@/lab/components/space/{FamilyComposer,FrameEditor,WorkspaceSteps,SpaceDrawer}`, `@/lab/data/space/{catalog,considerations,coverage}` | `rg "from \"@/lab" src/features src/routes/_authenticated` | Directory-naming conflict only: these are pure types / presentational UI / read-only catalog. They contain no provider, no sessionStorage, no Lab state. Production behavior is unaffected. Relocation is a future non-behavioral move; NOT performed in this task. |
| LIN-02 | `src/lab/data/space/catalog.ts` merges Master CSV events with Lab `SLICE_SPECS` fixtures (BREAKFAST/LAUNDRY/SHOPPING) and is consumed by Production `compose.ts` / `home-status.ts` | `FIXTURE_EVENT_MAP` in `catalog.ts` | Fixture-derived step detail can reach Production specs for three mapped events. Recorded as anomaly; no change made. |
| LIN-03 | `src/routes/lab*.tsx` remain publicly routable alongside Production | `src/routeTree.gen.ts` | Read-only reference surface; does not write to Production tables (`LabStateProvider` persists to sessionStorage only). |

## 4. Proof: Production does not depend on Lab state

- `rg "LabStateProvider|dalili-lab-v1|sessionStorage" src` returns matches ONLY in
  `src/lab/state/lab-state.tsx`, `src/lab/slice/state.tsx`, `src/routes/lab.tsx`,
  and two explanatory comments in `src/features/space/{store,production-store}.tsx`.
- No file under `src/routes/_authenticated/**` or `src/features/space/**` imports
  `LabStateProvider`, `useLab`, or `src/lab/slice/state`.
- The only provider mounted on the Production `/space` subtree is `ProductionSpaceProvider`,
  whose every write targets Supabase (see manifest stage map).

## 5. Golden/Test parallel implementations

`GoldenWorkspace`, `TestWorkspace`, `GoldenComposer`, `TestComposer`, `GoldenStateProvider`,
`TestStateProvider`: **zero matches** in the repository. None were created by this task.
