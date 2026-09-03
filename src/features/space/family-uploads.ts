// رفع صور الأسرة من الجهاز إلى مخزنها الخاص (family-visuals).
// الخصوصية أولاً: الحاوية خاصة ومحمية بسياسات RLS لكل أسرة — لا صورة تخرج من ملكية الأسرة.
// المسودة تحفظ مسار التخزين فقط؛ رابط العرض الموقّع يُشتق عند الحاجة ولا يُحفظ كمرجع.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "family-visuals";
/** صلاحية الرابط الموقّع — سنة كاملة حتى تبقى النسخ المعتمدة قابلة للعرض. */
const SIGNED_TTL_SECONDS = 60 * 60 * 24 * 365;

const urlCache = new Map<string, string>();

/** قراءة متزامنة من الذاكرة — null إذا لم يُشتق الرابط بعد. */
export function peekUploadedUrl(path: string): string | null {
  return urlCache.get(path) ?? null;
}

/** يشتق رابطاً موقّعاً لمسار مخزّن ويحتفظ به في الذاكرة. */
export async function ensureUploadedUrl(path: string): Promise<string | null> {
  const hit = urlCache.get(path);
  if (hit) return hit;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_TTL_SECONDS);
  if (error || !data?.signedUrl) return null;
  urlCache.set(path, data.signedUrl);
  return data.signedUrl;
}

/**
 * يضمن اشتقاق روابط كل المسارات المعطاة، ويعيد رقماً يتغير عند اكتمالها
 * حتى يعيد المكوّن العرض بالروابط الجاهزة.
 */
export function useUploadedUrls(paths: string[]): number {
  const [tick, setTick] = useState(0);
  const key = paths.filter(Boolean).sort().join("|");
  useEffect(() => {
    const list = key ? key.split("|") : [];
    const missing = list.filter((p) => !urlCache.has(p));
    if (missing.length === 0) return;
    let alive = true;
    void Promise.all(missing.map((p) => ensureUploadedUrl(p))).then(() => {
      if (alive) setTick((t) => t + 1);
    });
    return () => {
      alive = false;
    };
  }, [key]);
  return tick;
}

/**
 * يرفع صورة من جهاز الأسرة إلى مجلدها الخاص ويعيد مسار التخزين.
 * يسجّل الأصل في جدول visual_assets المملوك للأسرة.
 */
export async function uploadFamilyImage(file: File): Promise<string> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("لا توجد جلسة دخول فعالة");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${userData.user.id}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;

  // تسجيل الأصل في ملكية الأسرة — أفضل جهد ولا يمنع استخدام الصورة.
  await supabase
    .from("visual_assets")
    .insert({
      storage_path: path,
      label: file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .then(() => undefined, () => undefined);

  await ensureUploadedUrl(path);
  return path;
}
