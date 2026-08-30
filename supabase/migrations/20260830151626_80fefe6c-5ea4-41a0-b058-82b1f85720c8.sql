-- مسودات مساحة الأسرة (تحل محل sessionStorage)
CREATE TABLE public.participation_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  spec_id text NOT NULL,
  event_id text,
  selection jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, spec_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_drafts TO authenticated;
GRANT ALL ON public.participation_drafts TO service_role;
ALTER TABLE public.participation_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_drafts_owner ON public.participation_drafts FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_participation_drafts_updated BEFORE UPDATE ON public.participation_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- حالة البطاقة المعتمدة (مفتوحة/مغلقة) — لا تعدّل النسخة المجمّدة نفسها
CREATE TABLE public.participation_card_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_id uuid NOT NULL REFERENCES public.participation_snapshots(id) ON DELETE CASCADE,
  closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, snapshot_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_card_states TO authenticated;
GRANT ALL ON public.participation_card_states TO service_role;
ALTER TABLE public.participation_card_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_card_states_owner ON public.participation_card_states FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_participation_card_states_updated BEFORE UPDATE ON public.participation_card_states
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- انطباع الأسرة بعد المشاركة (ليس تقييماً ولا درجات)
CREATE TABLE public.participation_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_id uuid NOT NULL REFERENCES public.participation_snapshots(id) ON DELETE CASCADE,
  log_date date NOT NULL DEFAULT current_date,
  tone text NOT NULL,
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_feedback TO authenticated;
GRANT ALL ON public.participation_feedback TO service_role;
ALTER TABLE public.participation_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_feedback_owner ON public.participation_feedback FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- مخرجات الدعم المستقلة (وسيلة تواصل / تنظيم زمني / جدول مصور)
CREATE TABLE public.family_support_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  spec_id text NOT NULL,
  snapshot_id uuid REFERENCES public.participation_snapshots(id) ON DELETE SET NULL,
  type text NOT NULL,
  label text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_support_assets TO authenticated;
GRANT ALL ON public.family_support_assets TO service_role;
ALTER TABLE public.family_support_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY family_support_assets_owner ON public.family_support_assets FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_family_support_assets_updated BEFORE UPDATE ON public.family_support_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- اختيار الأسرة لما بعد البطاقة (نكررها / نغيّر / نوسّع / محطة / ليس الآن)
ALTER TABLE public.active_participations ADD COLUMN IF NOT EXISTS lifecycle_choice text;