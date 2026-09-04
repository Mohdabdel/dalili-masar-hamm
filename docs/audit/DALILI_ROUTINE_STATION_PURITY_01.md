# DALILI PRODUCTION FOUNDATION IMPLEMENTATION 04 — ROUTINE STATION PURITY

Scope: D05 / Cluster 6 / EN-03 / IM-05 drift only. No entry architecture, no Easy Beginning,
no station removal, no Master/reference content migration.

## TRACE (before editing)

FIELD: `status`
- TABLE/TYPE: `routine_stations.status` text default `'planned'`; mirrored in `RoutineStation` type (`src/lib/family-routine.ts`).
- WRITERS: `completeStation()` / `reopenStation()` in `src/lib/family-routine.ts` (no UI caller — dead but live-capable API);
  DB trigger `trg_station_completion` → `complete_participations_on_station()` propagated `status='completed'` to
  `active_participations` (`status='completed'`, `completion_source='routine_station'`, `completed_at=now()`).
- READERS: selected by `getStations()`; no UI read.
- UI EFFECT: none rendered directly; indirect — a completed station marked linked participations "مكتملة عبر محطة الروتين"
  in `/active-participations`.
- SEMANTIC PURPOSE (as found): checklist / completion state of a routine station.
- SAFE TO REMOVE FROM ACTIVE SEMANTICS: YES (no UI depends on it; column and historical values retained).

FIELD: `completed_at`
- TABLE/TYPE: `routine_stations.completed_at` timestamptz null; mirrored in `RoutineStation`.
- WRITERS: same two functions + trigger path.
- READERS: `getStations()` select only.
- UI EFFECT: none.
- SEMANTIC PURPOSE: timestamp of station "completion".
- SAFE TO REMOVE FROM ACTIVE SEMANTICS: YES.

FIELD: `part_of_day`
- TABLE/TYPE: `routine_stations.part_of_day` text default `'morning'`.
- WRITERS: `addStation()` (family choice at creation), production-store station creation.
- READERS: `getStations()`; `/active-participations` renders it as a label next to the station name.
- UI EFFECT: descriptive grouping label (صباح / ظهيرة / مساء).
- SEMANTIC PURPOSE: descriptive discovery/organization metadata. No deadline, reminder, compliance check,
  overdue state, or comparison against clock time anywhere in code.
- SAFE TO REMOVE FROM ACTIVE SEMANTICS: NO — preserved per D05.

FIELD: `participation_station_links`
- WRITERS: `production-store.tsx` link insert when a family participation is associated with a station.
- READERS: association/grouping only.
- UI EFFECT: grouping of family participations under a station heading.
- SEMANTIC PURPOSE: association.
- SAFE TO REMOVE: NO — preserved unchanged; carries no completion field.

HISTORICAL VALUES (before change): routine_stations = 2 rows; `status <> 'planned'` = 0; `completed_at IS NOT NULL` = 0;
participation_station_links = 1; participation_runs = 27; active_participations = 11, of which
`completion_source='routine_station'` = 1 (historical row preserved, untouched).

## BEFORE SEMANTICS
Routine Station carried live completion/checklist state (`status`, `completed_at`) and, through a database trigger,
could declare linked family participations complete — a second, non-Run occurrence model.

## AFTER SEMANTICS
Routine Station is a discovery / organization lens only: which daily event, optional domain, label, order,
descriptive part of day. It carries no state meaning "completed" or "succeeded".

## part_of_day
PRESERVED. Runtime use is purely descriptive grouping/discovery. No scheduling, deadline, or compliance use found.

## status
Deprecated legacy column. No longer selected by the app, no longer in the `RoutineStation` type,
no writer remains. Column and any historical values retained; column comment marks it deprecated.

## completed_at
Same treatment as `status`. No writers, no readers, values retained.

## HISTORICAL DATA
Nothing deleted or reinterpreted. No `completed_at` value was converted into a Run. The single historical
`completion_source='routine_station'` participation row was left exactly as-is.

## RUN BOUNDARY
`participation_runs` remains the only occurrence model. The trigger `trg_station_completion` and the function
`complete_participations_on_station()` were dropped, so no station action can now produce completion state.
Opening a station, linking a participation, or browsing creates no Run and mutates no station state.

## UI CHANGE
None required: no checklist, "mark done", streak, or progression affordance existed on the routine surfaces
(`/my-routine` uses a local planning selection for discovery, not completion). `/active-participations` still
groups by station label + part of day (association only). Navigation and discovery unchanged.

## CONTRACT EFFECT
- EN-03: improved — routine station state no longer encodes routine completion.
- IM-05: improved — station-derived completion inference removed; no performance/independence claim from station state.
- Not claimed: entry architecture, Easy Beginning, Family Free surfaces, or any broader Entry requirement.

## FILES CHANGED
- `src/lib/family-routine.ts` (removed `completeStation`/`reopenStation`, dropped `status`/`completed_at` from type and select)
- migration: dropped `trg_station_completion` + `complete_participations_on_station()`; added deprecation/semantic comments
- `docs/audit/DALILI_ROUTINE_STATION_PURITY_01.md`

## POST-CHANGE VERIFICATION
routine_stations = 2; `completed_at IS NOT NULL` = 0; `status <> 'planned'` = 0; links = 1; runs = 27;
active_participations = 11; `trg_station_completion` triggers = 0. Typecheck clean; 22/22 tests pass
(includes Foundation 03 family-participation identity tests).
