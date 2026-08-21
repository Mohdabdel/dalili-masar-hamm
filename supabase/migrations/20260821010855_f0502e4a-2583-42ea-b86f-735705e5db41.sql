-- ============================================================
-- DALILI PHASE 1 — FAMILY-OWNED FOUNDATION (ADDITIVE ONLY)
-- Canonical Participation / DailyEvent data lives in CSV files
-- (src/data/knowledge/*.csv) with TEXT business keys:
--   DailyEvent    -> TEXT  e.g. 'CLO-001'
--   Participation -> TEXT  e.g. 'CLO-001-OP001'
-- We therefore reference them by TEXT code, never by FK.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- 1. family_routines
-- ------------------------------------------------------------
CREATE TABLE public.family_routines (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL DEFAULT 'روتين يومنا',
  description  TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_routines TO authenticated;
GRANT ALL ON public.family_routines TO service_role;
ALTER TABLE public.family_routines ENABLE ROW LEVEL SECURITY;
CREATE POLICY family_routines_owner ON public.family_routines FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_family_routines_updated BEFORE UPDATE ON public.family_routines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_family_routines_user ON public.family_routines(user_id);

-- ------------------------------------------------------------
-- 2. routine_stations  (RoutineStationInstance -> references a DailyEvent code)
-- ------------------------------------------------------------
CREATE TABLE public.routine_stations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  routine_id    UUID NOT NULL REFERENCES public.family_routines(id) ON DELETE CASCADE,
  daily_event_id TEXT NOT NULL,
  domain_id     TEXT,
  label         TEXT,
  part_of_day   TEXT NOT NULL DEFAULT 'morning'
                CHECK (part_of_day IN ('morning','afternoon','evening')),
  position      INTEGER NOT NULL DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'planned'
                CHECK (status IN ('planned','completed','skipped')),
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_stations TO authenticated;
GRANT ALL ON public.routine_stations TO service_role;
ALTER TABLE public.routine_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY routine_stations_owner ON public.routine_stations FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_routine_stations_updated BEFORE UPDATE ON public.routine_stations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_routine_stations_routine ON public.routine_stations(routine_id, part_of_day, position);
CREATE INDEX idx_routine_stations_user ON public.routine_stations(user_id);

-- ------------------------------------------------------------
-- 3. active_participations (references canonical Participation TEXT code)
-- ------------------------------------------------------------
CREATE TABLE public.active_participations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id      TEXT NOT NULL,
  daily_event_id      TEXT,
  routine_station_id  UUID REFERENCES public.routine_stations(id) ON DELETE SET NULL,
  source              TEXT NOT NULL DEFAULT 'browse'
                      CHECK (source IN ('browse','routine_station','search','my_day')),
  status              TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active','completed','closed')),
  completion_source   TEXT CHECK (completion_source IN ('manual','routine_station','daily_log')),
  notes               TEXT,
  started_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at        TIMESTAMPTZ,
  closed_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.active_participations TO authenticated;
GRANT ALL ON public.active_participations TO service_role;
ALTER TABLE public.active_participations ENABLE ROW LEVEL SECURITY;
CREATE POLICY active_participations_owner ON public.active_participations FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_active_participations_updated BEFORE UPDATE ON public.active_participations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_active_participations_user_status ON public.active_participations(user_id, status);
CREATE INDEX idx_active_participations_station ON public.active_participations(routine_station_id);
CREATE UNIQUE INDEX uq_active_participation_open
  ON public.active_participations(user_id, opportunity_id, COALESCE(routine_station_id, '00000000-0000-0000-0000-000000000000'::uuid))
  WHERE status = 'active';

-- ------------------------------------------------------------
-- 4. participation_daily_logs (per calendar date, never a permanent boolean)
-- ------------------------------------------------------------
CREATE TABLE public.participation_daily_logs (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  active_participation_id  UUID NOT NULL REFERENCES public.active_participations(id) ON DELETE CASCADE,
  log_date                 DATE NOT NULL,
  did_participate          BOOLEAN NOT NULL DEFAULT true,
  note                     TEXT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (active_participation_id, log_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.participation_daily_logs TO authenticated;
GRANT ALL ON public.participation_daily_logs TO service_role;
ALTER TABLE public.participation_daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY participation_daily_logs_owner ON public.participation_daily_logs FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_participation_daily_logs_updated BEFORE UPDATE ON public.participation_daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_daily_logs_user_date ON public.participation_daily_logs(user_id, log_date);

-- ------------------------------------------------------------
-- 5. visual_assets (private storage references)
-- ------------------------------------------------------------
CREATE TABLE public.visual_assets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path  TEXT NOT NULL,
  label         TEXT,
  mime_type     TEXT,
  size_bytes    BIGINT,
  width         INTEGER,
  height        INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, storage_path)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visual_assets TO authenticated;
GRANT ALL ON public.visual_assets TO service_role;
ALTER TABLE public.visual_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY visual_assets_owner ON public.visual_assets FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_visual_assets_updated BEFORE UPDATE ON public.visual_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 6. learner_card_customizations
-- ------------------------------------------------------------
CREATE TABLE public.learner_card_customizations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id  TEXT NOT NULL,
  title_override  TEXT,
  intro_note      TEXT,
  settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_card_customizations TO authenticated;
GRANT ALL ON public.learner_card_customizations TO service_role;
ALTER TABLE public.learner_card_customizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY learner_card_customizations_owner ON public.learner_card_customizations FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_learner_card_customizations_updated BEFORE UPDATE ON public.learner_card_customizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 7. learner_card_steps
-- ------------------------------------------------------------
CREATE TABLE public.learner_card_steps (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  customization_id  UUID NOT NULL REFERENCES public.learner_card_customizations(id) ON DELETE CASCADE,
  position          INTEGER NOT NULL DEFAULT 0,
  text              TEXT NOT NULL,
  visual_asset_id   UUID REFERENCES public.visual_assets(id) ON DELETE SET NULL,
  canonical_asset_code TEXT,
  is_hidden         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_card_steps TO authenticated;
GRANT ALL ON public.learner_card_steps TO service_role;
ALTER TABLE public.learner_card_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY learner_card_steps_owner ON public.learner_card_steps FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_learner_card_steps_updated BEFORE UPDATE ON public.learner_card_steps
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_learner_card_steps_card ON public.learner_card_steps(customization_id, position);

-- ------------------------------------------------------------
-- 8. learner_card_exports
-- ------------------------------------------------------------
CREATE TABLE public.learner_card_exports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  customization_id  UUID REFERENCES public.learner_card_customizations(id) ON DELETE CASCADE,
  opportunity_id    TEXT,
  format            TEXT NOT NULL DEFAULT 'link'
                    CHECK (format IN ('link','pdf','image')),
  storage_path      TEXT,
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_card_exports TO authenticated;
GRANT ALL ON public.learner_card_exports TO service_role;
ALTER TABLE public.learner_card_exports ENABLE ROW LEVEL SECURITY;
CREATE POLICY learner_card_exports_owner ON public.learner_card_exports FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_learner_card_exports_updated BEFORE UPDATE ON public.learner_card_exports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- 9. resource_attachments
-- ------------------------------------------------------------
CREATE TABLE public.resource_attachments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scope            TEXT NOT NULL DEFAULT 'participation'
                   CHECK (scope IN ('participation','routine_station','service','resource','learner_card')),
  ref_id           TEXT NOT NULL,
  visual_asset_id  UUID REFERENCES public.visual_assets(id) ON DELETE CASCADE,
  external_url     TEXT,
  label            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_attachments TO authenticated;
GRANT ALL ON public.resource_attachments TO service_role;
ALTER TABLE public.resource_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY resource_attachments_owner ON public.resource_attachments FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_resource_attachments_updated BEFORE UPDATE ON public.resource_attachments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_resource_attachments_scope ON public.resource_attachments(user_id, scope, ref_id);

-- ------------------------------------------------------------
-- 10. Station completion -> cascade to linked active participations
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_participations_on_station()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND COALESCE(OLD.status, '') <> 'completed' THEN
    UPDATE public.active_participations
       SET status = 'completed',
           completion_source = 'routine_station',
           completed_at = COALESCE(NEW.completed_at, now())
     WHERE routine_station_id = NEW.id
       AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_station_completion
AFTER UPDATE OF status ON public.routine_stations
FOR EACH ROW EXECUTE FUNCTION public.complete_participations_on_station();