// طبقة قراءة مركزية لأصول التذكير القابلة للمشاركة.
// المصدر الوحيد للحقيقة هو 11_reminder_assets.csv.
// نسخ المشاركة تُنشأ داخل الجلسة فقط ولا تُكتب في أي ملف أو قاعدة بيانات.

import assetsCsv from "@/data/execution/11_reminder_assets.csv?raw";
import { parseCsv } from "@/lib/execution-frames";

const bool = (v: string) => v.toLowerCase() === "true";

export interface ReminderAsset {
  assetId: string;
  executionUnitId: string;
  assetType: string;
  titleAr: string;
  messageTemplateAr: string;
  targetAudience: string;
  executionStage: string;
  shareable: boolean;
  offlineCapable: boolean;
  version: string;
  status: string;
}

/** نسخة مشاركة مؤقتة داخل الذاكرة (لا تُحفظ). */
export interface SharingInstance {
  sharingInstanceId: string;
  assetId: string;
  version: string;
  title: string;
  resolvedMessage: string;
  createdAt: string;
}

/** الحمولة الوحيدة المسموح بنقلها إلى جهاز آخر. */
export interface ReminderPayload {
  assetId: string;
  version: string;
  title: string;
  resolvedMessage: string;
  createdAt: string;
}

const REQUIRED = [
  "asset_id",
  "execution_unit_id",
  "asset_type",
  "title_ar",
  "message_template_ar",
  "version",
  "status",
] as const;

const assets: ReminderAsset[] = parseCsv(assetsCsv)
  .filter((r) => {
    const ok = REQUIRED.every((k) => (r[k] ?? "").length > 0);
    if (!ok && import.meta.env.DEV) {
      console.warn(
        `[reminder-assets] سجل ناقص الحقول الإلزامية — تم تجاهله: ${r["asset_id"] ?? "(بدون معرف)"}`,
      );
    }
    return ok;
  })
  .map((r) => ({
    assetId: r["asset_id"] ?? "",
    executionUnitId: r["execution_unit_id"] ?? "",
    assetType: r["asset_type"] ?? "",
    titleAr: r["title_ar"] ?? "",
    messageTemplateAr: r["message_template_ar"] ?? "",
    targetAudience: r["target_audience"] ?? "",
    executionStage: r["execution_stage"] ?? "",
    shareable: bool(r["shareable"] ?? ""),
    offlineCapable: bool(r["offline_capable"] ?? ""),
    version: r["version"] ?? "",
    status: r["status"] ?? "",
  }));

/** الأصل التذكيري المرتبط بوحدة تنفيذ محددة. */
export function getReminderAssetByExecutionUnit(executionUnitId: string): ReminderAsset | null {
  return assets.find((a) => a.executionUnitId === executionUnitId) ?? null;
}

const MAX_PLACE = 60;
const LINKISH = /(https?:\/\/|www\.|[\w-]+\.(com|net|org|sa|io|co)\b)/i;

export type PlaceError = "empty" | "too_long" | "multiline" | "link";

/** تحقق بسيط من حقل المكان: عام، سطر واحد، بلا روابط. */
export function validatePlace(raw: string): PlaceError | null {
  if (/[\r\n]/.test(raw)) return "multiline";
  const v = raw.trim();
  if (!v) return "empty";
  if (v.length > MAX_PLACE) return "too_long";
  if (LINKISH.test(v)) return "link";
  return null;
}

/** تحقق من الوقت بصيغة HH:MM. */
export function validateTime(raw: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(raw.trim());
}

/** عرض الوقت بصيغة عربية مقروءة (صباحًا/مساءً). */
export function formatTimeAr(hhmm: string): string {
  if (!validateTime(hhmm)) return hhmm;
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "صباحًا" : "مساءً";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/** استبدال [الوقت] و[المكان] داخل الجلسة فقط. */
export function resolveMessage(asset: ReminderAsset, time: string, place: string): string {
  return asset.messageTemplateAr
    .replace("[الوقت]", formatTimeAr(time))
    .replace("[المكان]", place.trim());
}

/** ينشئ نسخة مشاركة مؤقتة، ويرفض الإنشاء عند نقص الوقت أو المكان. */
export function createSharingInstance(
  asset: ReminderAsset,
  time: string,
  place: string,
): SharingInstance | null {
  if (!asset.shareable) return null;
  if (!validateTime(time) || validatePlace(place) !== null) return null;
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return {
    sharingInstanceId: `SI-${Date.now().toString(36)}-${rand}`,
    assetId: asset.assetId,
    version: asset.version,
    title: asset.titleAr,
    resolvedMessage: resolveMessage(asset, time, place),
    createdAt: new Date().toISOString(),
  };
}

/** ترميز الحمولة بشكل آمن للـURL (base64url فوق UTF-8). */
export function encodePayload(p: ReminderPayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePayload(token: string): ReminderPayload | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, "="));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes)) as Partial<ReminderPayload>;
    if (!obj || typeof obj.resolvedMessage !== "string" || !obj.resolvedMessage.trim()) return null;
    if (typeof obj.title !== "string" || !obj.title.trim()) return null;
    return {
      assetId: typeof obj.assetId === "string" ? obj.assetId : "",
      version: typeof obj.version === "string" ? obj.version : "",
      title: obj.title,
      resolvedMessage: obj.resolvedMessage,
      createdAt: typeof obj.createdAt === "string" ? obj.createdAt : "",
    };
  } catch {
    return null;
  }
}

export function toPayload(instance: SharingInstance): ReminderPayload {
  return {
    assetId: instance.assetId,
    version: instance.version,
    title: instance.title,
    resolvedMessage: instance.resolvedMessage,
    createdAt: instance.createdAt,
  };
}
