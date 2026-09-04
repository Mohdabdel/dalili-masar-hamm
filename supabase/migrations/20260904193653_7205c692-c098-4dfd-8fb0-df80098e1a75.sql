ALTER TABLE public.active_participations
  ADD COLUMN IF NOT EXISTS origin text NOT NULL DEFAULT 'reference',
  ADD COLUMN IF NOT EXISTS reference_spec_id text,
  ADD COLUMN IF NOT EXISTS reference_source text;

UPDATE public.active_participations
   SET origin = 'reference',
       reference_spec_id = COALESCE(reference_spec_id, opportunity_id),
       reference_source = COALESCE(reference_source, 'legacy_master')
 WHERE opportunity_id IS NOT NULL;

ALTER TABLE public.active_participations
  ALTER COLUMN opportunity_id DROP NOT NULL;

ALTER TABLE public.active_participations
  ADD CONSTRAINT active_participations_origin_check
  CHECK (origin IN ('reference', 'easy_beginning', 'family_free'));

ALTER TABLE public.active_participations
  ADD CONSTRAINT active_participations_reference_source_check
  CHECK (reference_source IS NULL OR reference_source IN ('legacy_master', 'framework_reference'));

ALTER TABLE public.active_participations
  ADD CONSTRAINT active_participations_origin_reference_check
  CHECK (
    (origin = 'reference' AND reference_spec_id IS NOT NULL AND reference_source IS NOT NULL)
    OR (origin <> 'reference' AND reference_spec_id IS NULL AND opportunity_id IS NULL)
  );

CREATE INDEX IF NOT EXISTS idx_active_participations_reference
  ON public.active_participations (user_id, reference_spec_id);