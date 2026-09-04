// مولّد الوسائل البصرية داخل مساحة الأسرة.
// يبني الوسيلة من مسودّتنا الحالية: نفس الخطوات الباقية، ونفس عبارات الأسرة، ونفس الصور.
// الوسيلة مخرج مستقل — لا تُدمج في بطاقة المشارك ولا تعدّل مكتبة الحياة.

import { useMemo, useState } from "react";
import type {
  LabSupportAssetConfig,
  LabSupportAssetEntry,
  LabSupportAssetKind,
  LabSupportAssetType,
} from "@/lab/slice/types";
import { listSupportCategories, type SupportCategoryId } from "@/lib/support/taxonomy";
import { cn } from "@/lib/utils";

export interface SupportSourceRow {
  stepId: string;
  text: string;
  assetCode: string | null;
  src: string | null;
}

/** الفئات المعلنة في سجلّ الدعم — الواجهة لا تحمل قائمة خاصة بها. */
interface KindDef {
  categoryId: SupportCategoryId;
  kind: LabSupportAssetKind;
  type: LabSupportAssetType;
  label: string;
  hint: string;
  /** كم عنصراً تأخذ الوسيلة من المسودة (0 = كل الخطوات). */
  take: number;
}

const kindDefs = (): KindDef[] =>
  listSupportCategories().map((c) => ({
    categoryId: c.id,
    kind: (c.legacyKind ?? "schedule") as LabSupportAssetKind,
    type: c.legacyStorageType,
    label: c.label_ar,
    hint: c.hint_ar,
    take: c.entriesTake,
  }));

export function SupportGenerator({
  rows,
  onGenerate,
}: {
  rows: SupportSourceRow[];
  onGenerate: (input: {
    categoryId: SupportCategoryId;
    type: LabSupportAssetType;
    label: string;
    items: string[];
    config: LabSupportAssetConfig;
  }) => void;
}) {
  const KINDS = useMemo(() => kindDefs(), []);
  const [categoryId, setCategoryId] = useState<SupportCategoryId>(KINDS[0]?.categoryId ?? "");
  const def = (KINDS.find((k) => k.categoryId === categoryId) ?? KINDS[0]) as KindDef;
  const kind = def?.kind;

  const entries: LabSupportAssetEntry[] = useMemo(() => {
    const base = rows.map((r) => ({
      stepId: r.stepId,
      text: r.text,
      assetCode: r.assetCode,
      src: r.src,
    }));
    return def.take > 0 ? base.slice(0, def.take) : base;
  }, [rows, def]);

  const generate = () => {
    if (entries.length === 0) return;
    onGenerate({
      categoryId: def.categoryId,
      type: def.type,
      label: def.label,
      items: entries.map((e) => e.text),
      config: {
        kind: def.kind,
        entries,
        sourceStepIds: rows.map((r) => r.stepId),
        generatedFrom: "family_draft",
      },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.categoryId}
            type="button"
            title={k.hint}
            onClick={() => setCategoryId(k.categoryId)}
            aria-pressed={def?.categoryId === k.categoryId}
            className={cn(
              "min-h-11 rounded-xl border px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              def?.categoryId === k.categoryId ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {def.hint} تُبنى من مسودّتنا الحالية: الخطوات الباقية وعباراتنا وصورنا.
      </p>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-3 text-sm font-bold text-muted-foreground">
          لا توجد خطوات في مسودّتنا بعد.
        </p>
      ) : (
        <ol
          className={cn(
            "grid gap-2",
            kind === "now-next" ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4",
          )}
        >
          {entries.map((e, i) => (
            <li key={e.stepId} className="rounded-2xl border border-border bg-card p-2">
              <span className="mb-1 block text-xs font-bold text-muted-foreground">
                {kind === "now-next" ? (i === 0 ? "الآن" : "بعد") : `${i + 1}`}
              </span>
              {e.src ? (
                <img
                  src={e.src}
                  alt={e.text}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  بلا صورة
                </div>
              )}
              <p className="mt-1 text-sm font-bold leading-snug">{e.text}</p>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={generate}
        disabled={entries.length === 0}
        className="min-h-11 rounded-xl bg-primary px-5 text-base font-bold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
      >
        احفظوا هذه الوسيلة
      </button>
    </div>
  );
}
