import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabButton, LabLinkButton } from "@/lab/components/lab-ui";
import { StepBlocks, type ComposerItem } from "@/lab/components/space/FamilyComposer";
import { buildDraftSelection, getSpaceSpec } from "@/lab/data/space/catalog";
import { buildFrozenSnapshot, composeDraft } from "@/features/space/compose";
import { useUploadedUrls } from "@/features/space/family-uploads";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import type { LabThisTimeSelection } from "@/lab/slice/types";

/**
 * معاينة بطاقة المشاركة: العرض الفعلي للمسودة كما هي الآن.
 * المعاينة ليست اعتماداً — الاعتماد إجراء منفصل يُنشئ نسخة مجمّدة جديدة.
 */
export function PreviewPage({ specId }: { specId: string }) {
  const base = useSpaceBase();
  const spec = getSpaceSpec(specId);
  const { state, dispatch } = useSlice();
  const { snapshotsFor, supportAssetsFor } = useSliceHelpers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const versions = snapshotsFor(specId);
  const assets = supportAssetsFor(specId);
  const latest = [...versions].sort((a, b) => b.version - a.version)[0];

  const [label, setLabel] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const selection: LabThisTimeSelection = useMemo(() => {
    const saved = state.selections[specId];
    if (saved) return saved;
    if (spec) return buildDraftSelection(spec);
    return { specId, selected: [], chosenExecutionOptionByStepId: {}, supportTools: [] };
  }, [state.selections, spec, specId]);

  // روابط صور الأسرة المرفوعة تُشتق قبل العرض والاعتماد.
  const uploadedPaths = useMemo(
    () =>
      Object.values(selection.imageRefByStepId ?? {})
        .map((ref) => ref?.uploadedPath ?? "")
        .filter((p): p is string => Boolean(p)),
    [selection.imageRefByStepId],
  );
  useUploadedUrls(uploadedPaths);

  const rows = useMemo(() => (spec ? composeDraft(spec, selection) : []), [spec, selection]);

  // خطوة صالحة للاعتماد: تعرض صورة، أو نصاً غير فارغ. الخطوة الفارغة لا تُعتمد.
  const validRows = useMemo(
    () =>
      rows.filter(
        (r) =>
          (r.imageVisible && Boolean(r.image.src)) ||
          (r.textVisible && r.familyText.trim().length > 0),
      ),
    [rows],
  );
  const blankRows = rows.length - validRows.length;

  if (!spec) {
    return (
      <LabPage title="هذه المشاركة غير متاحة">
        <LabLinkButton to={`${base}`}>رجوع إلى مساحة الأسرة</LabLinkButton>
      </LabPage>
    );
  }

  const items: ComposerItem[] = rows.map((r) => ({
    stepId: r.stepId,
    familyText: r.textVisible ? r.familyText : "",
    visual: r.imageVisible ? r.image.src : null,
    presentation: r.imageVisible ? (r.textVisible ? "both" : "visual") : "text",
    blockOrder: r.blockOrder,
  }));

  const approve = () => {
    if (validRows.length === 0) return;
    const snapshot = buildFrozenSnapshot({
      spec,
      selection,
      rows: validRows.map((r, i) => ({ ...r, order: i + 1 })),
      version: versions.length + 1,
      label_ar: label.trim() || `${spec.title_ar} — بطاقة ${versions.length + 1}`,
      date,
      supportAssets: assets,
    });
    dispatch({ type: "snapshot", value: snapshot });
    navigate({ to: `${base}/card/$specId`, params: { specId } });
  };

  return (
    <LabPage
      title={`معاينة بطاقة: ${spec.title_ar}`}
      intro="هذه هي البطاقة كما ستظهر تماماً. لم تُعتمد بعد — يمكنكم الرجوع والتعديل، أو اعتمادها كما هي."
    >
      <LabSection title="ما ستراه الأسرة">
        {rows.length === 0 ? (
          <LabNote>لا توجد خطوات في مسودّتكم بعد.</LabNote>
        ) : (
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((item, i) => (
              <li key={item.stepId} className="rounded-2xl border border-border bg-card p-2">
                <StepBlocks item={item} index={i + 1} />
              </li>
            ))}
            <li className="grid place-items-center rounded-2xl border border-dashed border-border p-4 text-lg font-bold text-muted-foreground">
              انتهينا
            </li>
          </ol>
        )}
      </LabSection>

      {assets.length > 0 && (
        <LabSection
          title={`وسائل الدعم المرتبطة (${assets.length})`}
          description="ستُحفظ مع هذه النسخة كما هي الآن."
        >
          <ul className="space-y-2">
            {assets.map((a) => (
              <li key={a.id} className="rounded-xl border border-border bg-card p-3 text-sm font-semibold">
                {a.label_ar}
                <span className="block text-xs font-normal text-muted-foreground">
                  {a.items.length} عنصر
                </span>
              </li>
            ))}
          </ul>
        </LabSection>
      )}

      <LabSection title="اسم البطاقة">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">اسم البطاقة</span>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`${spec.title_ar} — بطاقة ${versions.length + 1}`}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold">التاريخ (اختياري)</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </div>
      </LabSection>

      {blankRows > 0 && (
        <LabNote>
          {blankRows === 1
            ? "خطوة واحدة بلا صورة ولا عبارة ظاهرة — لن تدخل البطاقة المعتمدة."
            : `${blankRows} خطوات بلا صورة ولا عبارة ظاهرة — لن تدخل البطاقة المعتمدة.`}{" "}
          أعيدوا إظهار الصورة أو اكتبوا عبارة قبل الاعتماد.
        </LabNote>
      )}

      {validRows.length === 0 && rows.length > 0 && (
        <LabNote>لا توجد خطوة واحدة قابلة للعرض — الاعتماد غير متاح الآن.</LabNote>
      )}

      {latest && (
        <LabNote>
          لديكم بطاقة معتمدة حالياً: «{latest.title_ar}». اعتماد هذه المعاينة يضيف بطاقة جديدة، ولا
          يغيّر البطاقة السابقة.
        </LabNote>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <LabButton onClick={approve} disabled={validRows.length === 0}>
          اعتماد بطاقة المشاركة
        </LabButton>
        <LabLinkButton
          to={`${base}/workspace/$specId`}
          params={{ specId }}
          variant="ghost"
        >
          رجوع للتعديل
        </LabLinkButton>
        {versions.length > 0 && (
          <LabLinkButton to={`${base}/card/$specId`} params={{ specId }} variant="ghost">
            بطاقات هذه المشاركة ({versions.length})
          </LabLinkButton>
        )}
      </div>
    </LabPage>
  );
}
