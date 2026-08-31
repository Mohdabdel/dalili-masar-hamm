import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabButton, LabLinkButton } from "@/lab/components/lab-ui";
import { StepBlocks, type ComposerItem } from "@/lab/components/space/FamilyComposer";
import { StepComposer, type ComposerStepRow } from "@/features/space/components/StepComposer";
import { ConsiderationsPanel } from "@/features/space/components/ConsiderationsPanel";
import {
  SupportGenerator,
  type SupportSourceRow,
} from "@/features/space/components/SupportGenerator";
import {
  buildDraftSelection,
  buildSpaceSnapshot,
  findSpaceStep,
  flatSteps,
  getSpaceSpec,
  sourceTextFor,
} from "@/lab/data/space/catalog";
import {
  refFromLegacySrc,
  resolveStepImage,
  resolvedAssetCode,
  suggestStepImage,
} from "@/features/space/step-image";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import type {
  LabStepImageRef,
  LabSupportAssetConfig,
  LabSupportAssetType,
  LabThisTimeSelection,
} from "@/lab/slice/types";

export function WorkspacePage({ specId }: { specId: string }) {
  const base = useSpaceBase();
  const spec = getSpaceSpec(specId);
  const { state, dispatch } = useSlice();
  const { snapshotsFor, supportAssetsFor } = useSliceHelpers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const versions = snapshotsFor(specId);
  const assets = supportAssetsFor(specId);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  

  // المسودة الفعلية تُحسب في نفس دورة العرض الأولى:
  // إمّا مسودة الأسرة المحفوظة، أو المسودة المرجعية الجاهزة — بلا استبدال بعد التركيب.
  const selection: LabThisTimeSelection = useMemo(() => {
    const saved = state.selections[specId];
    if (saved) return saved;
    if (spec) return buildDraftSelection(spec);
    return {
      specId,
      selected: [],
      chosenExecutionOptionByStepId: {},
      supportTools: [],
    };
  }, [state.selections, spec, specId]);

  const leaves = useMemo(() => {
    if (!spec) return [];
    return flatSteps(spec).filter(
      (e) => !e.isMajor || spec.majorSteps.find((m) => m.id === e.step.id)?.substeps.length === 0,
    );
  }, [spec]);

  if (!spec) {
    return (
      <LabPage
        title="هذه المشاركة غير متاحة"
        intro="لم نجد المشاركة المرجعية لهذا الرابط. اختاروا مشاركة من قوائم دليلي ثم افتحوا مساحة العمل."
      >
        <div className="flex flex-wrap gap-3">
          <LabLinkButton to={`${base}`}>رجوع إلى مساحة الأسرة</LabLinkButton>
          <LabLinkButton to="/activities/level" variant="ghost">
            اختيار مشاركة جديدة
          </LabLinkButton>
        </div>
      </LabPage>
    );
  }

  const setSelection = (next: Partial<LabThisTimeSelection>) =>
    dispatch({ type: "selection", value: { ...selection, ...next, specId } });

  const renumber = (ids: string[]) => ids.map((stepId, i) => ({ stepId, order: i + 1 }));
  const orderedIds = [...selection.selected].sort((a, b) => a.order - b.order).map((s) => s.stepId);

  const startId = orderedIds[0] ?? "";
  const endId = orderedIds[orderedIds.length - 1] ?? "";

  const withRange = (ids: string[]) => ({
    selected: renumber(ids),
    startStepId: ids[0],
    endStepId: ids[ids.length - 1],
  });

  const addStep = (stepId: string) => {
    // الترتيب المرجعي هو المرجع الوحيد لموضع الخطوة المُعادة.
    const reference = leaves.map((l) => l.step.id);
    const next = reference.filter((id) => orderedIds.includes(id) || id === stepId);
    setSelection(withRange(next));
  };

  const removeStep = (stepId: string) => {
    if (orderedIds.length <= 1) return;
    setSelection(withRange(orderedIds.filter((id) => id !== stepId)));
  };

  const move = (stepId: string, direction: -1 | 1) => {
    const i = orderedIds.indexOf(stepId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[i], next[j]] = [next[j], next[i]];
    setSelection(withRange(next));
  };

  const applyRange = (nextStartId: string, nextEndId: string) => {
    const ids = leaves.map((l) => l.step.id);
    const a = ids.indexOf(nextStartId);
    const b = ids.indexOf(nextEndId);
    if (a < 0 || b < 0) return;
    const [from, to] = a <= b ? [a, b] : [b, a];
    setSelection(withRange(ids.slice(from, to + 1)));
  };

  // ---------- كتلة الصورة وكتلة العبارة: حالتان مستقلتان ----------

  const imageRefFor = (stepId: string): LabStepImageRef | null =>
    composeImageRefFor(spec, selection, stepId);

  const imageVisibleFor = (stepId: string) => composeImageVisibleFor(selection, stepId);

  const textVisibleFor = (stepId: string) => composeTextVisibleFor(selection, stepId);


  /** يحافظ على توافق الحقول القديمة (presentation/visual) دون ربط الحالتين ببعضهما. */
  const syncLegacy = (
    stepId: string,
    imageVisible: boolean,
    textVisible: boolean,
    src: string | null,
  ) => ({
    presentationByStepId: {
      ...(selection.presentationByStepId ?? {}),
      [stepId]: imageVisible && textVisible ? ("both" as const) : imageVisible ? ("visual" as const) : ("text" as const),
    },
    visualByStepId: { ...(selection.visualByStepId ?? {}), [stepId]: src ?? "" },
  });

  const toggleImage = (stepId: string, visible: boolean) => {
    const src = resolveStepImage(imageRefFor(stepId)).src;
    setSelection({
      imageVisibleByStepId: { ...(selection.imageVisibleByStepId ?? {}), [stepId]: visible },
      ...syncLegacy(stepId, visible, textVisibleFor(stepId), src),
    });
  };

  const toggleText = (stepId: string, visible: boolean) => {
    const src = resolveStepImage(imageRefFor(stepId)).src;
    setSelection({
      textVisibleByStepId: { ...(selection.textVisibleByStepId ?? {}), [stepId]: visible },
      ...syncLegacy(stepId, imageVisibleFor(stepId), visible, src),
    });
  };

  const pickImage = (stepId: string, assetCode: string | null) => {
    const ref: LabStepImageRef | null = assetCode ? { sourceAssetCode: assetCode } : null;
    const src = resolveStepImage(ref).src;
    setSelection({
      imageRefByStepId: { ...(selection.imageRefByStepId ?? {}), [stepId]: ref },
      ...syncLegacy(stepId, imageVisibleFor(stepId), textVisibleFor(stepId), src),
    });
  };

  const setText = (stepId: string, text: string) =>
    setSelection({
      familyTextByStepId: { ...(selection.familyTextByStepId ?? {}), [stepId]: text },
    });

  const resetText = (stepId: string) => setText(stepId, sourceTextFor(spec, stepId));

  const rows: ComposerStepRow[] = orderedIds
    .map((stepId): ComposerStepRow | null => {
      const step = findSpaceStep(spec, stepId);
      if (!step) return null;
      const sourceText = sourceTextFor(spec, stepId);
      const custom = selection.familyTextByStepId?.[stepId];
      return {
        stepId,
        sourceText,
        familyText: custom !== undefined ? custom : sourceText,
        image: resolveStepImage(imageRefFor(stepId)),
        imageVisible: imageVisibleFor(stepId),
        textVisible: textVisibleFor(stepId),
      };
    })
    .filter((r): r is ComposerStepRow => Boolean(r));

  const previewItems: ComposerItem[] = rows.map((r) => ({
    stepId: r.stepId,
    familyText: r.textVisible ? r.familyText : "",
    visual: r.imageVisible ? r.image.src : null,
    presentation: r.imageVisible ? (r.textVisible ? "both" : "visual") : "text",
    blockOrder: selection.blockOrderByStepId?.[r.stepId] ?? "visual-text",
  }));

  const spares = leaves
    .filter((l) => !orderedIds.includes(l.step.id))
    .map((l) => ({ stepId: l.step.id, label: l.step.instruction_family_ar }));

  /** اعتبار تحتفظ به الأسرة مع هذه المشاركة — اختياري ولا يظهر للمشارك. */
  const toggleConsideration = (id: string, next: boolean) => {
    const current = selection.considerationIds ?? [];
    setSelection({
      considerationIds: next ? [...new Set([...current, id])] : current.filter((c) => c !== id),
    });
  };

  /** مصدر توليد الوسائل: الخطوات الباقية في مسودّتنا بعباراتها وصورها. */
  const supportRows: SupportSourceRow[] = rows
    .filter((r) => r.textVisible || r.imageVisible)
    .map((r) => ({
      stepId: r.stepId,
      text: r.textVisible ? r.familyText : "",
      assetCode: r.imageVisible ? resolvedAssetCode(imageRefFor(r.stepId)) : null,
      src: r.imageVisible ? r.image.src : null,
    }));

  const addSupportAsset = (input: {
    type: LabSupportAssetType;
    label: string;
    items: string[];
    config: LabSupportAssetConfig;
  }) => {
    dispatch({
      type: "support.add",
      value: {
        id: crypto.randomUUID(),
        type: input.type,
        label_ar: `${input.label} — ${spec.title_ar}`,
        specId,
        createdAt: new Date().toISOString().slice(0, 10),
        items: input.items,
        config: input.config,
      },
    });
  };

  const approve = () => {
    if (rows.length === 0) return;
    const snapshot = buildSpaceSnapshot({
      spec,
      selection,
      version: versions.length + 1,
      label_ar: label.trim() || `${spec.title_ar} — بطاقة ${versions.length + 1}`,
      date,
      supportAssetIds: assets.map((a) => a.id),
    });
    dispatch({ type: "snapshot", value: snapshot });
    navigate({ to: `${base}/card/$specId`, params: { specId } });
  };

  return (
    <LabPage title={spec.title_ar} intro={spec.eventTitle_ar}>
      <LabSection
        title="مسودّتنا"
        description="هذه خطوات المشاركة كما اقترحتها دليلي. أبقوا ما يناسبكم، واحذفوا ما لا تحتاجونه."
      >
        <StepComposer
          rows={rows}
          onText={setText}
          onResetText={resetText}
          onToggleImage={toggleImage}
          onToggleText={toggleText}
          onPickImage={pickImage}
          onMove={move}
          onRemove={removeStep}
        />
        {rows.length <= 1 && <LabNote>تبقى خطوة واحدة على الأقل في مسودّتكم.</LabNote>}
      </LabSection>

      <LabSection title="نبدأ من… ونتوقف عند…">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">نبدأ من</span>
            <select
              value={startId}
              onChange={(e) => applyRange(e.target.value, endId || e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {leaves.map((l) => (
                <option key={l.step.id} value={l.step.id}>
                  {l.step.instruction_family_ar}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold">نتوقف عند</span>
            <select
              value={endId}
              onChange={(e) => applyRange(startId || e.target.value, e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {leaves.map((l) => (
                <option key={l.step.id} value={l.step.id}>
                  {l.step.instruction_family_ar}
                </option>
              ))}
            </select>
          </label>
        </div>
      </LabSection>

      {spares.length > 0 && (
        <details className="rounded-2xl border border-border bg-card p-3">
          <summary className="cursor-pointer text-sm font-bold">
            خطوات أخرى يمكن إضافتها ({spares.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {spares.map((s) => (
              <li key={s.stepId} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-semibold">{s.label}</span>
                <button
                  type="button"
                  onClick={() => addStep(s.stepId)}
                  className="min-h-11 shrink-0 rounded-xl border border-border px-3 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  أضيفوها
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <details className="rounded-2xl border border-border bg-card p-3">
        <summary className="cursor-pointer text-sm font-bold">
          كيف ستظهر البطاقة، واسمها
        </summary>
        <div className="mt-3 space-y-4">
          {rows.length === 0 ? (
            <LabNote>أضيفوا خطوة واحدة على الأقل.</LabNote>
          ) : (
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previewItems.map((item, i) => (
                <li key={item.stepId} className="rounded-2xl border border-border bg-card p-2">
                  <StepBlocks item={item} index={i + 1} />
                </li>
              ))}
              <li className="grid place-items-center rounded-2xl border border-dashed border-border p-4 text-lg font-bold text-muted-foreground">
                انتهينا
              </li>
            </ol>
          )}

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

          <div className="flex flex-wrap items-center gap-3">
            <LabButton onClick={approve} disabled={rows.length === 0}>
              {versions.length === 0 ? "نعتمد البطاقة" : "نعتمد بطاقة جديدة"}
            </LabButton>
            {versions.length > 0 && (
              <LabLinkButton to={`${base}/card/$specId`} params={{ specId }} variant="ghost">
                بطاقات هذه المشاركة ({versions.length})
              </LabLinkButton>
            )}
          </div>
        </div>
      </details>

      <ConsiderationsPanel
        spec={spec}
        texts={rows.map((r) => r.familyText)}
        stepCount={rows.length}
        selectedIds={selection.considerationIds ?? []}
        onToggle={toggleConsideration}
      />

      <details className="rounded-2xl border border-border bg-card p-3">
        <summary className="cursor-pointer text-sm font-bold">
          هل هناك شيء قد يجعل المشاركة أسهل؟
        </summary>
        <div className="mt-3">
          <SupportGenerator rows={supportRows} onGenerate={addSupportAsset} />
        </div>
        {assets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {assets.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{a.label_ar}</span>
                  <span className="block text-xs text-muted-foreground">
                    مستقل عن بطاقة المشارك — {a.items.length} عنصر
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "support.remove", id: a.id })}
                  className="min-h-11 shrink-0 rounded-xl border border-border px-3 text-xs font-bold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  إزالة
                </button>
              </li>
            ))}
          </ul>
        )}
      </details>

      <div className="mt-2">
        <LabLinkButton to="/tools" variant="ghost">
          أدوات المساندة
        </LabLinkButton>
      </div>
    </LabPage>
  );
}
