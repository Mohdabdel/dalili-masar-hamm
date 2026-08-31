// حالة مساحة عمل الأسرة للصفحة الرئيسية — قراءة خفيفة من قاعدة البيانات
// دون تركيب المزوّد الإنتاجي الكامل. تُستخدم في الصفحة العامة "/".

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
}

const EMPTY: FamilySpaceStatus = {
  loading: true,
  signedIn: false,
  drafts: [],
  approved: [],
};

function specTitle(specId: string, fallback?: string): string {
  return getSpaceSpec(specId)?.title_ar ?? fallback ?? "مشاركة";
}

export function useFamilySpaceStatus(): FamilySpaceStatus {
  const [status, setStatus] = useState<FamilySpaceStatus>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        if (!cancelled) setStatus({ ...EMPTY, loading: false });
        return;
      }

      const [draftsRes, snapshotsRes] = await Promise.all([
        supabase.from("participation_drafts").select("spec_id"),
        supabase
          .from("participation_snapshots")
          .select("version_number, snapshot_data")
          .order("version_number", { ascending: true }),
      ]);

      if (cancelled) return;

      const drafts: FamilyDraftItem[] = (draftsRes.data ?? []).map((row) => ({
        specId: row.spec_id,
        title: specTitle(row.spec_id),
      }));

      // آخر نسخة معتمدة لكل مشاركة (الإدراج تصاعدي، فالأخير هو الأحدث).
      const latestBySpec = new Map<string, FamilyApprovedItem>();
      for (const row of snapshotsRes.data ?? []) {
        const snap = row.snapshot_data as unknown as LabCardSnapshot;
        const specId = snap?.participationSpecId ?? "";
        if (!specId) continue;
        latestBySpec.set(specId, {
          specId,
          title: specTitle(specId, snap?.participationTitle_ar),
          latestVersion: row.version_number,
        });
      }

      setStatus({
        loading: false,
        signedIn: true,
        drafts,
        approved: [...latestBySpec.values()],
      });
    })().catch(() => {
      if (!cancelled) setStatus((s) => ({ ...s, loading: false }));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
