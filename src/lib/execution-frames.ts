// طبقة قراءة مركزية لإطارات التوضيح البصري ووصفات التشغيل.
// المصدر الوحيد للحقيقة هو ملفا CSV؛ تخصيص الجلسة يبقى في ذاكرة الواجهة فقط.

import framesCsv from "@/data/execution/09_visual_frames.csv?raw";
import recipesCsv from "@/data/execution/10_execution_recipes.csv?raw";

function parseCsv(text: string): Record<string, string>[] {
  const src = text.replace(/^\uFEFF/, "").trim();
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      cur.push(field);
      field = "";
    } else if (ch === "\n") {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  cur.push(field);
  if (cur.length > 1 || cur[0] !== "") rows.push(cur);

  const header = (rows.shift() ?? []).map((h) => h.trim());
  return rows.map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, i) => {
      o[h] = (r[i] ?? "").trim();
    });
    return o;
  });
}

const bool = (v: string) => v.toLowerCase() === "true";
const list = (v: string) => v.split("|").map((s) => s.trim()).filter(Boolean);

export interface VisualFrame {
  frameId: string;
  sceneId: string;
  actionId: string;
  assetPath: string;
  titleAr: string;
  altTextAr: string;
  defaultOrder: number;
  optional: boolean;
  skippable: boolean;
  repeatable: boolean;
  status: string;
  version: string;
}

export interface ExecutionRecipe {
  recipeId: string;
  executionUnitId: string;
  frameIds: string[];
  defaultOrder: string[];
  optionalFrameIds: string[];
  reorderAllowed: boolean;
  skipAllowed: boolean;
  repeatAllowed: boolean;
  displayMode: string;
  status: string;
  version: string;
}

const frames: VisualFrame[] = parseCsv(framesCsv).map((r) => ({
  frameId: r["frame_id"] ?? "",
  sceneId: r["scene_id"] ?? "",
  actionId: r["action_id"] ?? "",
  assetPath: r["asset_path"] ?? "",
  titleAr: r["title_ar"] ?? "",
  altTextAr: r["alt_text_ar"] ?? "",
  defaultOrder: Number(r["default_order"] ?? 0),
  optional: bool(r["optional"] ?? ""),
  skippable: bool(r["skippable"] ?? ""),
  repeatable: bool(r["repeatable"] ?? ""),
  status: r["status"] ?? "",
  version: r["version"] ?? "",
}));

const recipes: ExecutionRecipe[] = parseCsv(recipesCsv).map((r) => ({
  recipeId: r["recipe_id"] ?? "",
  executionUnitId: r["execution_unit_id"] ?? "",
  frameIds: list(r["frame_ids"] ?? ""),
  defaultOrder: list(r["default_order"] ?? ""),
  optionalFrameIds: list(r["optional_frame_ids"] ?? ""),
  reorderAllowed: bool(r["reorder_allowed"] ?? ""),
  skipAllowed: bool(r["skip_allowed"] ?? ""),
  repeatAllowed: bool(r["repeat_allowed"] ?? ""),
  displayMode: r["display_mode"] ?? "",
  status: r["status"] ?? "",
  version: r["version"] ?? "",
}));

const frameById = new Map(frames.map((f) => [f.frameId, f]));

/** الوصفة المرتبطة بوحدة تنفيذ محددة. */
export function getRecipeByExecutionUnit(executionUnitId: string): ExecutionRecipe | null {
  return recipes.find((r) => r.executionUnitId === executionUnitId) ?? null;
}

/** إطارات الوصفة مرتبة حسب default_order (لا تُعرض إطارات خارج الوصفة). */
export function getRecipeFrames(recipe: ExecutionRecipe): VisualFrame[] {
  const source = recipe.defaultOrder.length ? recipe.defaultOrder : recipe.frameIds;
  return source
    .filter((id) => recipe.frameIds.includes(id))
    .map((id) => frameById.get(id))
    .filter((f): f is VisualFrame => !!f)
    .sort((a, b) => {
      const ia = source.indexOf(a.frameId);
      const ib = source.indexOf(b.frameId);
      return ia === ib ? a.defaultOrder - b.defaultOrder : ia - ib;
    });
}

export function isFrameOptional(recipe: ExecutionRecipe, frameId: string): boolean {
  const f = frameById.get(frameId);
  return recipe.optionalFrameIds.includes(frameId) || !!f?.optional;
}
