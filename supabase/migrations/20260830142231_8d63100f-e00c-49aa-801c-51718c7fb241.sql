CREATE TABLE public.participation_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  family_participation_id uuid NOT NULL REFERENCES public.active_participations(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  snapshot_data jsonb NOT NULL,
  schema_version integer NOT NULL DEFAULT 1,
  approved_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid,
  CONSTRAINT participation_snapshots_version_unique UNIQUE (family_participation_id, version_number),
  CONSTRAINT participation_snapshots_version_positive CHECK (version_number > 0)
);

CREATE INDEX participation_snapshots_participation_idx
  ON public.participation_snapshots (family_participation_id, version_number DESC);

GRANT SELECT, INSERT ON public.participation_snapshots TO authenticated;
GRANT ALL ON public.participation_snapshots TO service_role;

ALTER TABLE public.participation_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY participation_snapshots_select_own
  ON public.participation_snapshots
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY participation_snapshots_insert_own
  ON public.participation_snapshots
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

COMMENT ON TABLE public.participation_snapshots IS 'نسخ مجمّدة (immutable) من مشاركة الأسرة عند الاعتماد. لا UPDATE ولا DELETE من مسارات التطبيق؛ أي تعديل ينشئ version جديداً.';
COMMENT ON COLUMN public.participation_snapshots.snapshot_data IS 'محتوى مجمّد كامل: title, steps[] بترتيبها, family text overrides, visual overrides, presentation mode, block order, start/end, support asset refs, metadata.';