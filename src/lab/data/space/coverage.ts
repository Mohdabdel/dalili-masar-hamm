// طبقة "التغطية البصرية" داخل Lab: جاهزية تكييف المشاركة — لا تقييم لأي شخص.
// ترتيب البحث: صورة مطابقة → صورة وظيفية قابلة لإعادة الاستخدام → صورة شيء/سياق → نص فقط.

import { getRenderableVisualAssets } from "@/lib/visual-asset-catalog";
import type { LabVisualStatus } from "@/lab/slice/types";

export interface VisualLibraryItem {
  code: string;
  title: string;
  src: string;
}

let libCache: VisualLibraryItem[] | null = null;

/** كل الصور الجاهزة فعلاً للعرض داخل المشروع. */
export function visualLibrary(): VisualLibraryItem[] {
  if (!libCache) {
    libCache = getRenderableVisualAssets()
      .filter((a) => a.assetPath)
      .map((a) => ({ code: a.assetCode, title: a.titleAr, src: a.assetPath as string }));
  }
  return libCache;
}

export function visualTitleForSrc(src: string | null): string | null {
  if (!src) return null;
  return visualLibrary().find((v) => v.src === src)?.title ?? null;
}

/** أفعال وظيفية قابلة لإعادة الاستخدام عبر أكثر من مشاركة. */
const FUNCTIONAL_WORDS = [
  "اختيار",
  "اختر",
  "إحضار",
  "أحضر",
  "وضع",
  "ضع",
  "انتظار",
  "إخبار",
  "أخبر",
  "جمع",
  "اجمع",
  "حمل",
  "فتح",
  "افتح",
  "إغلاق",
  "أغلق",
  "ترتيب",
  "رتّب",
  "طي",
  "غسل",
  "سقي",
  "رش",
];

function score(text: string, title: string): number {
  const t = text.replace(/[.،]/g, " ");
  const words = title.replace(/[.،]/g, " ").split(/\s+/).filter((w) => w.length > 2);
  let hits = 0;
  for (const w of words) if (t.includes(w)) hits += 1;
  return hits;
}

export interface VisualSuggestion {
  src: string | null;
  status: LabVisualStatus;
}

/** اقتراح صورة لخطوة: مطابقة إن وُجدت، ثم وظيفية، ثم شيء/سياق، وإلا نحتاج معينًا. */
export function suggestVisual(text: string, exactAsset?: string | null): VisualSuggestion {
  if (exactAsset) return { src: exactAsset, status: "exact" };
  let best: { src: string; hits: number } | null = null;
  for (const item of visualLibrary()) {
    const hits = score(text, item.title);
    if (hits > 0 && (!best || hits > best.hits)) best = { src: item.src, hits };
  }
  if (best) {
    const functional = FUNCTIONAL_WORDS.some((w) => text.includes(w));
    return { src: best.src, status: functional ? "functional" : "object" };
  }
  return { src: null, status: "needed" };
}

export const visualStatusLabel: Record<LabVisualStatus, string> = {
  exact: "صورة مطابقة",
  functional: "صورة وظيفية",
  object: "صورة شيء أو مكان",
  sequence: "تسلسل مصوّر",
  communication: "وسيلة تواصل",
  schedule: "جدول بصري",
  needed: "يحتاج معينًا",
  not_required: "لا يحتاج صورة",
};

export function isReady(status: LabVisualStatus): boolean {
  return status !== "needed";
}

/** عبارة مؤشر التغطية — جاهزية تكييف فقط. */
export function coverageSummary(statuses: LabVisualStatus[]): string {
  const total = statuses.length;
  if (total === 0) return "لا توجد خطوات بعد";
  const ready = statuses.filter(isReady).length;
  if (ready === total) return "الدعم البصري مكتمل";
  if (total - ready === 1) return "تحتاج هذه المشاركة معينًا واحدًا";
  return `${ready} من ${total} جاهزة`;
}
