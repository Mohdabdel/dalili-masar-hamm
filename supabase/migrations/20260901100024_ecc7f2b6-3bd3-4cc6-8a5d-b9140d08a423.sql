ALTER TABLE public.participation_feedback
  ADD COLUMN IF NOT EXISTS run_id uuid REFERENCES public.participation_runs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS participation_feedback_run_id_idx
  ON public.participation_feedback (run_id);