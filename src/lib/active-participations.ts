// طبقة الوصول للمشاركات النشطة وسجلات الإنجاز اليومي.
// تُخزَّن المعرفات فقط؛ كل محتوى العرض يُستخرج من مستودع المعرفة (CSV).

import { supabase } from "@/integrations/supabase/client";
import { buildFamilyParticipationRow } from "@/lib/family-participation";

export interface ActiveParticipation {
  id: string;
  /** مرجع المكتبة — قد يكون فارغاً لمشاركة أنشأتها الأسرة بنفسها. */
  opportunity_id: string | null;
  routine_station_id: string | null;
  status: string;
  completion_source: string | null;
  started_at: string;
  completed_at: string | null;
  closed_at: string | null;
}

export const todayISO = () => new Date().toISOString().slice(0, 10);

export async function listActiveParticipations(): Promise<ActiveParticipation[]> {
  const { data, error } = await supabase
    .from("active_participations")
    .select(
      "id, opportunity_id, routine_station_id, status, completion_source, started_at, completed_at, closed_at",
    )
    .order("started_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function startParticipation(input: {
  opportunityId: string;
  routineStationId?: string | null;
  source?: string;
}): Promise<void> {
  const { error } = await supabase.from("active_participations").insert(
    buildFamilyParticipationRow({
      origin: "reference",
      reference: { specId: input.opportunityId, source: "legacy_master" },
      routineStationId: input.routineStationId ?? null,
      source: input.source ?? "routine_station",
    }),
  );
  if (error) throw error;
}

export async function closeParticipation(id: string): Promise<void> {
  const { error } = await supabase
    .from("active_participations")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function completeParticipationManually(id: string): Promise<void> {
  const { error } = await supabase
    .from("active_participations")
    .update({
      status: "completed",
      completion_source: "manual",
      completed_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
}

export interface DailyLog {
  id: string;
  active_participation_id: string;
  log_date: string;
  did_participate: boolean;
}

export async function listTodayLogs(): Promise<DailyLog[]> {
  const { data, error } = await supabase
    .from("participation_daily_logs")
    .select("id, active_participation_id, log_date, did_participate")
    .eq("log_date", todayISO());
  if (error) throw error;
  return data ?? [];
}

export async function setTodayLog(
  activeParticipationId: string,
  didParticipate: boolean,
  existingLogId?: string,
): Promise<void> {
  if (existingLogId) {
    const { error } = await supabase
      .from("participation_daily_logs")
      .update({ did_participate: didParticipate })
      .eq("id", existingLogId);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from("participation_daily_logs").insert({
    active_participation_id: activeParticipationId,
    log_date: todayISO(),
    did_participate: didParticipate,
  });
  if (error) throw error;
}

/** يبحث عن مشاركة نشطة للمستخدم الحالي مرتبطة بهذه الفرصة (إن وُجدت). */
export async function findActiveParticipationByOpportunity(
  opportunityId: string,
): Promise<ActiveParticipation | null> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase
    .from("active_participations")
    .select(
      "id, opportunity_id, routine_station_id, status, completion_source, started_at, completed_at, closed_at",
    )
    .eq("opportunity_id", opportunityId)
    .neq("status", "closed")
    .order("started_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  return data?.[0] ?? null;
}

/** يقرأ سجل اليوم لمشاركة نشطة محددة. */
export async function getTodayLog(
  activeParticipationId: string,
): Promise<DailyLog | null> {
  const { data, error } = await supabase
    .from("participation_daily_logs")
    .select("id, active_participation_id, log_date, did_participate")
    .eq("active_participation_id", activeParticipationId)
    .eq("log_date", todayISO())
    .limit(1);
  if (error) throw error;
  return data?.[0] ?? null;
}
