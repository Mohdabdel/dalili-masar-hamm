// هوية مشاركة الأسرة (Foundation 03).
// الهوية القانونية = active_participations.id — صف الأسرة نفسه.
// مرجع المكتبة (specId) أصبح إثبات مصدر اختيارياً، لا هوية.
//
// origin  = كيف نشأت المشاركة (reference | easy_beginning | family_free) — ثابت، ليس حالة.
// reference = مصدر مرجعي اختياري (legacy_master | framework_reference).

import { supabase } from "@/integrations/supabase/client";

export type FamilyParticipationOrigin =
  | "reference"
  | "easy_beginning"
  | "family_free";

export type ReferenceSource = "legacy_master" | "framework_reference";

export interface FamilyParticipationReference {
  /** معرّف المرجع/المواصفة، مثل KB-<opportunity_id> أو معرّف مرجع متوافق. */
  specId: string;
  source: ReferenceSource;
}

export interface CreateFamilyParticipationInput {
  origin: FamilyParticipationOrigin;
  /** مطلوب فقط عندما يكون الأصل مرجعياً. */
  reference?: FamilyParticipationReference | null;
  dailyEventId?: string | null;
  routineStationId?: string | null;
  source?: string;
  notes?: string | null;
}

export interface FamilyParticipation {
  /** الهوية القانونية للمشاركة الأسرية. */
  id: string;
  origin: FamilyParticipationOrigin;
  reference: FamilyParticipationReference | null;
  status: string;
  dailyEventId: string | null;
  routineStationId: string | null;
}

export interface FamilyParticipationRow {
  origin: FamilyParticipationOrigin;
  reference_spec_id: string | null;
  reference_source: ReferenceSource | null;
  /** عمود توافق قديم — يساوي مرجع المكتبة عند وجوده فقط. */
  opportunity_id: string | null;
  daily_event_id: string | null;
  routine_station_id: string | null;
  source: string;
  status: string;
  notes?: string | null;
}

/**
 * بناء صف الإدراج بشكل حتمي — دالة نقية قابلة للاختبار بلا قاعدة بيانات.
 * لا يجوز اختلاق معرّف مرجعي لأصل غير مرجعي.
 */
export function buildFamilyParticipationRow(
  input: CreateFamilyParticipationInput,
): FamilyParticipationRow {
  const { origin, reference } = input;
  if (origin === "reference") {
    if (!reference?.specId) {
      throw new Error("origin=reference requires a reference specId");
    }
  } else if (reference) {
    throw new Error(`origin=${origin} must not carry a reference specId`);
  }

  return {
    origin,
    reference_spec_id: origin === "reference" ? reference!.specId : null,
    reference_source: origin === "reference" ? reference!.source : null,
    opportunity_id: origin === "reference" ? reference!.specId : null,
    daily_event_id: input.dailyEventId ?? null,
    routine_station_id: input.routineStationId ?? null,
    source: input.source ?? "family_workspace",
    status: "active",
    ...(input.notes ? { notes: input.notes } : {}),
  };
}

export function toFamilyParticipation(row: {
  id: string;
  origin: string;
  reference_spec_id: string | null;
  reference_source: string | null;
  status: string;
  daily_event_id: string | null;
  routine_station_id: string | null;
}): FamilyParticipation {
  return {
    id: row.id,
    origin: row.origin as FamilyParticipationOrigin,
    reference: row.reference_spec_id
      ? {
          specId: row.reference_spec_id,
          source: (row.reference_source ?? "legacy_master") as ReferenceSource,
        }
      : null,
    status: row.status,
    dailyEventId: row.daily_event_id,
    routineStationId: row.routine_station_id,
  };
}

const SELECT_COLUMNS =
  "id, origin, reference_spec_id, reference_source, status, daily_event_id, routine_station_id";

/** إنشاء مشاركة أسرية بأي أصل — بلا حاجة لأي معرّف مكتبة. */
export async function createFamilyParticipation(
  input: CreateFamilyParticipationInput,
): Promise<FamilyParticipation> {
  const { data, error } = await supabase
    .from("active_participations")
    .insert(buildFamilyParticipationRow(input))
    .select(SELECT_COLUMNS)
    .single();
  if (error || !data) throw error ?? new Error("insert failed");
  return toFamilyParticipation(data);
}

export async function getFamilyParticipation(
  id: string,
): Promise<FamilyParticipation | null> {
  const { data } = await supabase
    .from("active_participations")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  return data ? toFamilyParticipation(data) : null;
}

/** حدّ توافق: من مرجع المكتبة إلى الهوية القانونية (لا العكس). */
export async function findFamilyParticipationByReference(
  specId: string,
): Promise<FamilyParticipation | null> {
  const { data } = await supabase
    .from("active_participations")
    .select(SELECT_COLUMNS)
    .eq("reference_spec_id", specId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data ? toFamilyParticipation(data) : null;
}
