// حالة مساحة عمل الأسرة للصفحة الرئيسية — قراءة خفيفة من قاعدة البيانات
// دون تركيب المزوّد الإنتاجي الكامل. تُستخدم في الصفحة العامة "/".

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveSession } from "@/lib/auth-session";
import { getSpaceSpec } from "@/lab/data/space/catalog";
import type { LabCardSnapshot } from "@/lab/slice/types";

export interface FamilyDraftItem {
  specId: string;
  title: string;
}

export interface FamilyApprovedItem {
  specId: string;
  title: string;
  latestVersion: number;
}

export interface FamilySpaceStatus {
  loading: boolean;
  signedIn: boolean;
  drafts: FamilyDraftItem[];
  approved: FamilyApprovedItem[];
  current: FamilyApprovedItem | null;
}

const EMPTY: FamilySpaceStatus = {
  loading: true,
  signedIn: false,
  drafts: [],
  approved: [],
  current: null,
};

/** المشاركات المملوكة للأسرة تحمل عنوانها داخل مسودتها، لا في المكتبة المرجعية. */
function familySpecTitle(selection: unknown): string | undefined {
  const spec = (selection as { familySpec?: { title_ar?: string } } | null)?.familySpec;
  return spec?.title_ar?.trim() || undefined;
}

function specTitle(specId: string, fallback?: string): string {
  return getSpaceSpec(specId)?.title_ar ?? fallback ?? "مشاركة";
}

export function useFamilySpaceStatus(): FamilySpaceStatus {
  const [status, setStatus] = useState<FamilySpaceStatus>(EMPTY);

  const [authTick, setAuthTick] = useState(0);

  // إعادة القراءة عند تغيّر الهوية فقط (دخول/خروج/تحديث مستخدم).
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setAuthTick((t) => t + 1);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // لا قراءة مملوكة للمستخدم قبل حسم الجلسة.
      const session = await resolveSession();
      if (!session) {
        if (!cancelled) setStatus({ ...EMPTY, loading: false });
        return;
      }

      const [draftsRes, snapshotsRes, participationsRes, cardStatesRes] = await Promise.all([
        supabase.from("participation_drafts").select("spec_id, selection"),
        supabase
          .from("participation_snapshots")
          .select("id, family_participation_id, version_number, snapshot_data")
          .order("version_number", { ascending: true }),
        supabase.from("active_participations").select("id, status"),
        supabase.from("participation_card_states").select("snapshot_id, closed"),
      ]);

      if (cancelled) return;

      const drafts: FamilyDraftItem[] = (draftsRes.data ?? []).map((row) => ({
        specId: row.spec_id,
        title: specTitle(row.spec_id, familySpecTitle(row.selection)),
      }));

      // آخر نسخة معتمدة لكل مشاركة (الإدراج تصاعدي، فالأخير هو الأحدث).
      const latestBySpec = new Map<string, FamilyApprovedItem>();
      const openParticipationIds = new Set((participationsRes.data ?? [])
        .filter((row) => row.status === "active")
        .map((row) => row.id));
      const closedSnapshotIds = new Set((cardStatesRes.data ?? [])
        .filter((row) => row.closed)
        .map((row) => row.snapshot_id));
      let current: FamilyApprovedItem | null = null;
      for (const row of snapshotsRes.data ?? []) {
        const snap = row.snapshot_data as unknown as LabCardSnapshot;
        const specId = snap?.participationSpecId ?? "";
        if (!specId) continue;
        const item = {
          specId,
          title: specTitle(specId, snap?.participationTitle_ar),
          latestVersion: row.version_number,
        };
        latestBySpec.set(specId, item);
        if (openParticipationIds.has(row.family_participation_id) && !closedSnapshotIds.has(row.id)) {
          current = item;
        }
      }

      setStatus({
        loading: false,
        signedIn: true,
        drafts,
        approved: [...latestBySpec.values()],
        current,
      });
    })().catch(() => {
      if (!cancelled) setStatus((s) => ({ ...s, loading: false }));
    });

    return () => {
      cancelled = true;
    };
  }, [authTick]);

  return status;
}
