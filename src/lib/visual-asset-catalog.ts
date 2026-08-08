// Resolver نهائي لمكتبة الأصول البصرية التجريبية (DALILI-EXECUTION-ASSETS-PILOT-V1).
// أصل Canonical واحد فقط لكل asset_code. لا fallback ولا روابط مكسورة.

import catalogCsv from "@/data/execution/18_visual_asset_catalog_final.csv?raw";
import { parseCsv } from "@/lib/execution-frames";

export interface CanonicalVisualAsset {
  assetCode: string;
  titleAr: string;
  fileName: string;
  /** المسار العام، أو null إذا لم يصل الملف الثنائي بعد. */
  assetPath: string | null;
  version: string;
  status: string;
  source: string;
  qaStatus: string;
  libraryRole: "canonical";
  missingBinary: boolean;
}

// الملفات الموجودة فعليًا داخل المشروع (public + أصول مجمّعة في src/assets).
// المفتاح = اسم الملف، القيمة = رابط قابل للعرض.
const presentFiles = new Map<string, string>();

for (const p of Object.keys(
  import.meta.glob("../../public/assets/execution/**/*.{webp,jpg,jpeg,png}", {
    query: "?url",
  }),
)) {
  const fileName = p.split("/").pop() as string;
  const publicPath = p.replace("../../public", "");
  presentFiles.set(fileName, publicPath);
}

const bundled = import.meta.glob("../assets/*.{webp,jpg,jpeg,png}", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

for (const [p, url] of Object.entries(bundled)) {
  const fileName = p.split("/").pop() as string;
  if (!presentFiles.has(fileName)) presentFiles.set(fileName, url);
}


function warn(message: string) {
  if (import.meta.env.DEV) console.warn(`[visual-asset-catalog] ${message}`);
}

const byCode = new Map<string, CanonicalVisualAsset>();

for (const r of parseCsv(catalogCsv)) {
  const assetCode = r["asset_code"] ?? "";
  const fileName = r["file_name"] ?? "";
  const libraryRole = r["library_role"] ?? "";

  if (!assetCode || !fileName) continue;
  if (libraryRole !== "canonical") continue; // الأرشيف لا يدخل المكتبة إطلاقًا
  if (byCode.has(assetCode)) {
    warn(`asset_code مكرر — تم تجاهل النسخة الثانية: ${assetCode}`);
    continue;
  }

  const exists = presentFiles.has(fileName);

  byCode.set(assetCode, {
    assetCode,
    titleAr: r["title_ar"] ?? "",
    fileName,
    assetPath: exists ? `/assets/execution/visual/${fileName}` : null,
    version: r["version"] ?? "",
    status: r["status"] ?? "",
    source: r["source"] ?? "",
    qaStatus: r["qa_status"] ?? "",
    libraryRole: "canonical",
    missingBinary: !exists,
  });
}

const assets = Array.from(byCode.values());

/** كل الأصول Canonical (بما فيها ما ينقصه الملف الثنائي). */
export function getCanonicalVisualAssets(): CanonicalVisualAsset[] {
  return assets;
}

/** أصل Canonical واحد فقط، أو null. */
export function getCanonicalVisualAsset(
  assetCode: string,
): CanonicalVisualAsset | null {
  return byCode.get(assetCode.trim()) ?? null;
}

/** المسار القابل للعرض فقط؛ null عند غياب الملف الثنائي (لا img مكسورة). */
export function resolveVisualAssetSrc(assetCode: string): string | null {
  const a = byCode.get(assetCode.trim());
  return a && !a.missingBinary ? a.assetPath : null;
}

/** الأصول الجاهزة للعرض فعليًا. */
export function getRenderableVisualAssets(): CanonicalVisualAsset[] {
  return assets.filter((a) => !a.missingBinary);
}

/** الأصول التي ما زالت تنتظر ملفها الثنائي. */
export function getMissingBinaryAssets(): CanonicalVisualAsset[] {
  return assets.filter((a) => a.missingBinary);
}
