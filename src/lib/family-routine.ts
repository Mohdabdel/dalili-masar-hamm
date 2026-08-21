// طبقة الوصول لبيانات روتين الأسرة في Lovable Cloud.
// لا تُخزَّن هنا أي بيانات مشاركة (عناوين/خطوات/مجالات) — فقط المعرفات.

import { supabase } from "@/integrations/supabase/client";
import type { PartOfDay } from "@/lib/daily-events";

export interface FamilyRoutine {
  id: string;
  name: string;
  description: string | null;
}

export interface RoutineStation {
  id: string;
  routine_id: string;
  daily_event_id: string;
  domain_id: string | null;
  label: string | null;
  part_of_day: string;
  position: number;
  status: string;
  completed_at: string | null;
}

export async function getActiveRoutine(): Promise<FamilyRoutine | null> {
  const { data, error } = await supabase
    .from("family_routines")
    .select("id, name, description")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createRoutine(name = "روتين يومنا"): Promise<FamilyRoutine> {
  const { data, error } = await supabase
    .from("family_routines")
    .insert({ name })
    .select("id, name, description")
    .single();
  if (error) throw error;
  return data;
}

export async function getStations(routineId: string): Promise<RoutineStation[]> {
  const { data, error } = await supabase
    .from("routine_stations")
    .select(
      "id, routine_id, daily_event_id, domain_id, label, part_of_day, position, status, completed_at",
    )
    .eq("routine_id", routineId)
    .order("position", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addStation(input: {
  routineId: string;
  dailyEventId: string;
  domainId?: string | null;
  label?: string | null;
  partOfDay: PartOfDay;
  position: number;
}): Promise<void> {
  const { error } = await supabase.from("routine_stations").insert({
    routine_id: input.routineId,
    daily_event_id: input.dailyEventId,
    domain_id: input.domainId ?? null,
    label: input.label ?? null,
    part_of_day: input.partOfDay,
    position: input.position,
  });
  if (error) throw error;
}

export async function removeStation(stationId: string): Promise<void> {
  const { error } = await supabase
    .from("routine_stations")
    .delete()
    .eq("id", stationId);
  if (error) throw error;
}

export async function setStationPosition(
  stationId: string,
  position: number,
): Promise<void> {
  const { error } = await supabase
    .from("routine_stations")
    .update({ position })
    .eq("id", stationId);
  if (error) throw error;
}

/** إكمال محطة — التريجر في قاعدة البيانات يكمل المشاركات المرتبطة تلقائياً. */
export async function completeStation(stationId: string): Promise<void> {
  const { error } = await supabase
    .from("routine_stations")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", stationId);
  if (error) throw error;
}

export async function reopenStation(stationId: string): Promise<void> {
  const { error } = await supabase
    .from("routine_stations")
    .update({ status: "planned", completed_at: null })
    .eq("id", stationId);
  if (error) throw error;
}
