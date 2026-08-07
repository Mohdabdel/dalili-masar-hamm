// طبقة قراءة لأصول Staging البصرية (DALILI_VISUAL_BATCH_02).
// للقراءة والتحقق فقط — لا تُعرض هذه الأصول في واجهة المستخدم قبل اعتماد QA.

import stagingCsv from "@/data/execution/14_visual_asset_staging.csv?raw";
import { parseCsv } from "@/lib/execution-frames";

export interface StagedVisualAsset {
  assetCode: string;
  codedFilename: string;
  domainCode: string;
  visualFamily: string;
  variantNo: string;
  titleAr: string;
  assetLevel: string;
  qaStatus: string;
  version: string;
  productionNotes: string;
}

const REQUIRED: (keyof StagedVisualAsset)[] = [
  "assetCode",
  "codedFilename",
  "domainCode",
  "visualFamily",
  "variantNo",
  "titleAr",
  "qaStatus",
  "version",
];

function warn(message: string) {
  if (import.meta.env.DEV) console.warn(`[visual-asset-staging] ${message}`);
}

const rows: StagedVisualAsset[] = parseCsv(stagingCsv).map((r) => ({
  assetCode: r["asset_code"] ?? "",
  codedFilename: r["coded_filename"] ?? "",
  domainCode: r["domain_code"] ?? "",
  visualFamily: r["visual_family"] ?? "",
  variantNo: r["variant_no"] ?? "",
  titleAr: r["title_ar"] ?? "",
  assetLevel: r["asset_level"] ?? "",
  qaStatus: r["qa_status"] ?? "",
  version: r["version"] ?? "",
  productionNotes: r["production_notes"] ?? "",
}));

const seenCodes = new Set<string>();
const seenFiles = new Set<string>();
const assets: StagedVisualAsset[] = [];

for (const a of rows) {
  const missing = REQUIRED.filter((k) => !a[k]);
  if (missing.length) {
    warn(`سجل ناقص (${a.assetCode || "بدون معرف"}): ${missing.join(", ")}`);
    continue;
  }
  if (seenCodes.has(a.assetCode)) {
    warn(`asset_code مكرر: ${a.assetCode}`);
    continue;
  }
  if (seenFiles.has(a.codedFilename)) {
    warn(`coded_filename مكرر: ${a.codedFilename}`);
    continue;
  }
  seenCodes.add(a.assetCode);
  seenFiles.add(a.codedFilename);
  assets.push(a);
}

export function getAllStagedVisualAssets(): StagedVisualAsset[] {
  return assets;
}

export function getStagedAssetByCode(assetCode: string): StagedVisualAsset | null {
  return assets.find((a) => a.assetCode === assetCode) ?? null;
}

export function getStagedAssetsByFamily(visualFamily: string): StagedVisualAsset[] {
  const key = visualFamily.trim().toUpperCase();
  return assets.filter((a) => a.visualFamily.toUpperCase() === key);
}

export function getStagedAssetsByQaStatus(status: string): StagedVisualAsset[] {
  const key = status.trim().toLowerCase();
  return assets.filter((a) => a.qaStatus.toLowerCase() === key);
}
