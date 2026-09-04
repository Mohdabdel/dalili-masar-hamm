DROP TRIGGER IF EXISTS trg_station_completion ON public.routine_stations;
DROP FUNCTION IF EXISTS public.complete_participations_on_station();
COMMENT ON COLUMN public.routine_stations.status IS 'DEPRECATED legacy field. Routine stations are a discovery/organization lens; no completion semantics. Not written by the app.';
COMMENT ON COLUMN public.routine_stations.completed_at IS 'DEPRECATED legacy field. Historical values preserved; no longer written or interpreted as completion.';
COMMENT ON COLUMN public.routine_stations.part_of_day IS 'Descriptive discovery metadata (morning/afternoon/evening). Not a schedule, deadline, or compliance marker.';
COMMENT ON TABLE public.participation_station_links IS 'Association only between a family participation and a routine station. Never implies a run, completion, or success.';