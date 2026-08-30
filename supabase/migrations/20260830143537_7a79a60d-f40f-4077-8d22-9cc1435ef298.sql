-- M1: FamilyParticipation ↔ RoutineStation join table + ParticipationRun

CREATE TABLE public.participation_station_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  family_participation_id uuid NOT NULL REFERENCES public.active_participations(id) ON DELETE CASCADE,
  routine_station_id uuid NOT NULL REFERENCES public.routine_stations(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (family_participation_id, routine_station_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_station_links TO authenticated;
GRANT ALL ON public.participation_station_links TO service_role;
ALTER TABLE public.participation_station_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_station_links_owner ON public.participation_station_links
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_participation_station_links_updated
  BEFORE UPDATE ON public.participation_station_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_psl_participation ON public.participation_station_links(family_participation_id);
CREATE INDEX idx_psl_station ON public.participation_station_links(routine_station_id);

-- backfill existing 1:1 station membership (compat: legacy column stays)
INSERT INTO public.participation_station_links (user_id, family_participation_id, routine_station_id)
SELECT ap.user_id, ap.id, ap.routine_station_id
FROM public.active_participations ap
WHERE ap.routine_station_id IS NOT NULL
ON CONFLICT DO NOTHING;

COMMENT ON COLUMN public.active_participations.routine_station_id IS 'LEGACY: use participation_station_links (N:M). Kept for backward compatibility.';
COMMENT ON TABLE public.participation_daily_logs IS 'LEGACY historical records. New usage tracking lives in participation_runs.';

-- ParticipationRun: use of an approved snapshot in a real-life situation. No performance semantics.
CREATE TABLE public.participation_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  family_participation_id uuid NOT NULL REFERENCES public.active_participations(id) ON DELETE CASCADE,
  snapshot_id uuid NOT NULL REFERENCES public.participation_snapshots(id) ON DELETE RESTRICT,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_runs TO authenticated;
GRANT ALL ON public.participation_runs TO service_role;
ALTER TABLE public.participation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_runs_owner ON public.participation_runs
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_participation_runs_updated
  BEFORE UPDATE ON public.participation_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_runs_participation ON public.participation_runs(family_participation_id, started_at DESC);
CREATE INDEX idx_runs_snapshot ON public.participation_runs(snapshot_id);