import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabButton, LabLinkButton } from "@/lab/components/lab-ui";
import { WorkspaceSteps } from "@/lab/components/space/WorkspaceSteps";
import { FrameEditor, type FrameEditRow } from "@/lab/components/space/FrameEditor";
import { FamilyComposer, StepBlocks, type ComposerItem } from "@/lab/components/space/FamilyComposer";
import { SpaceDrawer } from "@/lab/components/space/SpaceDrawer";
import {
  blockOrderFor,
  buildDraftSelection,
  buildSpaceSnapshot,
  familyTextFor,
  findSpaceStep,
  flatSteps,
  getSpaceSpec,
  presentationFor,
  sourceTextFor,
  visualFor,
  visualStatusFor,
  SPACE_SUPPORT_ASSET_TYPES,
} from "@/lab/data/space/catalog";
import { coverageSummary, visualStatusLabel } from "@/lab/data/space/coverage";
import { considerationsFor } from "@/lab/data/space/considerations";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import type {
  LabSupportAssetType,
  StepBlockOrder,
  StepPresentationMode,
} from "@/lab/slice/types";
import { cn } from "@/lib/utils";


const STAGES = [
  { id: "select", label: "اختيار" },
  { id: "prepare", label: "تجهيز" },
  { id: "compose", label: "تركيب" },
  { id: "preview", label: "معاينة" },
] as const;
type Stage = (typeof STAGES)[number]["id"];

export function WorkspacePage({ specId }: { specId: string }) {
  const base = useSpaceBase();
  const spec = getSpaceSpec(specId);
  const { state, dispatch } = useSlice();
  const { selectionFor, snapshotsFor, supportAssetsFor } = useSliceHelpers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const selection = selectionFor(specId);
  const versions = snapshotsFor(specId);
  const assets = supportAssetsFor(specId);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [drawer, setDrawer] = useState<null | "considerations" | "coverage">(null);
  const [stage, setStage] = useState<Stage>("select");

  // مسودة تلقائية: لا تبدأ الأسرة من صفحة فارغة.
  useEffect(() => {
    if (spec && !state.selections[specId]) {
      dispatch({ type: "selection", value: buildDraftSelection(spec) });
    }
  }, [spec, specId, state.selections, dispatch]);

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

  const setSelection = (next: Partial<typeof selection>) =>
    dispatch({ type: "selection", value: { ...selection, ...next } });

  const renumber = (ids: string[]) => ids.map((stepId, i) => ({ stepId, order: i + 1 }));
  const orderedIds = [...selection.selected].sort((a, b) => a.order - b.order).map((s) => s.stepId);

  const toggle = (stepId: string) => {
    const next = orderedIds.includes(stepId)
      ? orderedIds.filter((id) => id !== stepId)
      : [...orderedIds, stepId];
    setSelection({ selected: renumber(next) });
  };

  const move = (stepId: string, direction: -1 | 1) => {
    const i = orderedIds.indexOf(stepId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[i], next[j]] = [next[j], next[i]];
    setSelection({ selected: renumber(next) });
  };

  const reorder = (fromId: string, toId: string) => {
    const next = orderedIds.filter((id) => id !== fromId);
    const at = next.indexOf(toId);
    if (at < 0) return;
    next.splice(at, 0, fromId);
    setSelection({ selected: renumber(next) });
  };

  const applyRange = (startId: string, endId: string) => {
    const ids = leaves.map((l) => l.step.id);
    const a = ids.indexOf(startId);
    const b = ids.indexOf(endId);
    if (a < 0 || b < 0) return;
    const [from, to] = a <= b ? [a, b] : [b, a];
    setSelection({ selected: renumber(ids.slice(from, to + 1)) });
  };

  const startId = orderedIds[0] ?? "";
  const endId = orderedIds[orderedIds.length - 1] ?? "";

  const chooseOption = (stepId: string, optionId: string) =>
    setSelection({
      chosenExecutionOptionByStepId: {
        ...selection.chosenExecutionOptionByStepId,
        [stepId]: selection.chosenExecutionOptionByStepId[stepId] === optionId ? "" : optionId,
      },
    });

  const rows: FrameEditRow[] = orderedIds
    .map((stepId): FrameEditRow | null => {
      const step = findSpaceStep(spec, stepId);
      if (!step) return null;
      const optionId = selection.chosenExecutionOptionByStepId[stepId];
      const option = ("executionOptions" in step ? step.executionOptions : undefined)?.find(
        (o) => o.id === optionId,
      );
      return {
        stepId,
        sourceText: sourceTextFor(spec, stepId),
        suggestedText: step.instruction_short_ar,
        familyText: familyTextFor(spec, selection, stepId),
        visual: visualFor(spec, selection, stepId),
        status: visualStatusFor(spec, selection, stepId),
        presentation: presentationFor(selection, stepId),
        blockOrder: blockOrderFor(selection, stepId),
        optionLabel: option?.label_ar,
      };
    })
    .filter((r): r is FrameEditRow => Boolean(r));

  const items: ComposerItem[] = rows.map((r) => ({
    stepId: r.stepId,
    familyText: r.familyText,
    visual: r.visual,
    presentation: r.presentation,
    blockOrder: r.blockOrder,
  }));

  const spares = leaves
    .filter((l) => !orderedIds.includes(l.step.id))
    .map((l) => ({ stepId: l.step.id, label: l.step.instruction_short_ar }));

  const coverage = coverageSummary(rows.map((r) => r.status));
  const needsVisual = rows.filter((r) => r.presentation !== "text" && r.status === "needed");

  const setText = (stepId: string, text: string) =>
    setSelection({
      familyTextByStepId: { ...(selection.familyTextByStepId ?? {}), [stepId]: text },
    });

  const setVisual = (stepId: string, src: string | null) =>
    setSelection({
      visualByStepId: { ...(selection.visualByStepId ?? {}), [stepId]: src ?? "" },
      presentationByStepId: {
        ...(selection.presentationByStepId ?? {}),
        [stepId]: src ? presentationFor(selection, stepId) : "text",
      },
    });

  const setPresentation = (stepId: string, mode: StepPresentationMode) =>
    setSelection({
      presentationByStepId: { ...(selection.presentationByStepId ?? {}), [stepId]: mode },
      textOnlyStepIds: (selection.textOnlyStepIds ?? []).filter((id) => id !== stepId),
    });

  const setBlockOrder = (stepId: string, order: StepBlockOrder) =>
    setSelection({
      blockOrderByStepId: { ...(selection.blockOrderByStepId ?? {}), [stepId]: order },
    });

  const addSupportAsset = (type: LabSupportAssetType, labelAr: string) => {
    dispatch({
      type: "support.add",
      value: {
        id: `sup-${type}-${Date.now()}`,
        type,
        label_ar: `${labelAr} — ${spec.title_ar}`,
        specId,
        createdAt: new Date().toISOString().slice(0, 10),
        items: rows.map((r) => r.familyText),
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

  const stageIndex = STAGES.findIndex((s) => s.id === stage);

  return (
    <LabPage title={spec.title_ar} intro={spec.eventTitle_ar}>
      {/* شريط المراحل */}
      <nav aria-label="مراحل التجهيز" className="flex flex-wrap gap-1.5">
        {STAGES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-current={stage === s.id ? "step" : undefined}
            onClick={() => setStage(s.id)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              stage === s.id
                ? "bg-primary text-primary-foreground"
                : i < stageIndex
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent",
            )}
          >
            {i + 1}. {s.label}
          </button>
        ))}
      </nav>

      {stage === "select" && (
        <>
          <LabSection
            title="اختاروا ما ستشاركون فيه"
            description="اختاروا الجزء المناسب لهذه المشاركة. ليس مطلوباً تنفيذ كل الخطوات."
          >
            <WorkspaceSteps
              spec={spec}
              selected={selection.selected}
              onToggle={toggle}
              onMove={move}
              chosenOptions={selection.chosenExecutionOptionByStepId}
              onChooseOption={chooseOption}
            />
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
                  <option value="">اختاروا نقطة البداية</option>
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
                  <option value="">اختاروا نقطة التوقف</option>
                  {leaves.map((l) => (
                    <option key={l.step.id} value={l.step.id}>
                      {l.step.instruction_family_ar}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </LabSection>
        </>
      )}

      {stage === "prepare" && (
        <LabSection
          title="جهّزوا كل خطوة"
          description="الصورة والجملة منفصلتان: غيّروا إحداهما دون الأخرى. لا يتغير شيء في المكتبة."
        >
          {rows.length === 0 ? (
            <LabNote>اختاروا خطوة واحدة على الأقل أولاً.</LabNote>
          ) : (
            <FrameEditor
              rows={rows}
              onText={setText}
              onVisual={setVisual}
              onPresentation={setPresentation}
              onBlockOrder={setBlockOrder}
              onMove={move}
              onRemove={toggle}
            />
          )}
        </LabSection>
      )}

      {stage === "compose" && (
        <LabSection
          title="ركّبوا البطاقة"
          description="انقلوا المكونات إلى البطاقة، أو استخدموا الأزرار للترتيب والإزالة."
        >
          <FamilyComposer
            items={items}
            spares={spares}
            onAdd={toggle}
            onRemove={toggle}
            onMove={move}
            onReorder={reorder}
          />
        </LabSection>
      )}

      {stage === "preview" && (
        <>
          <LabSection title="معاينة البطاقة" description="هذا ما سيراه المشارك، بلا أي إعدادات.">
            {rows.length === 0 ? (
              <LabNote>اختاروا خطوة واحدة على الأقل لتظهر المعاينة.</LabNote>
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

          <LabSection title="اسم البطاقة والتاريخ" description="تبقى في مساحة الأسرة فقط.">
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

          {needsVisual.length > 0 && (
            <LabNote>
              {needsVisual.length === 1
                ? "خطوة واحدة تحتاج دعماً بصرياً — اختاروا لها صورة أو اجعلوها جملة فقط."
                : `${needsVisual.length} خطوات تحتاج دعماً بصرياً — اختاروا لها صوراً أو اجعلوها جملاً فقط.`}
            </LabNote>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <LabButton onClick={approve} disabled={rows.length === 0 || needsVisual.length > 0}>
              {versions.length === 0 ? "نعتمد البطاقة" : "نعتمد بطاقة جديدة"}
            </LabButton>
            {versions.length > 0 && (
              <LabLinkButton to={`${base}/card/$specId`} params={{ specId }} variant="ghost">
                بطاقات هذه المشاركة ({versions.length})
              </LabLinkButton>
            )}
          </div>

          <LabNote>
            الاعتماد يصنع نسخة ثابتة: جُملكم وصوركم تُنسخ الآن، وأي تعديل لاحق ينشئ بطاقة جديدة ولا
            يغيّر بطاقة سابقة.
          </LabNote>
        </>
      )}

      {/* أدوات جانبية في كل المراحل */}
      <div className="mt-2 flex flex-wrap gap-2">
        <LabButton variant="ghost" onClick={() => setDrawer("considerations")}>
          اعتبارات المشاركة
        </LabButton>
        <LabButton variant="ghost" onClick={() => setDrawer("coverage")}>
          الدعم البصري: {coverage}
        </LabButton>
        {stageIndex < STAGES.length - 1 && (
          <LabButton onClick={() => setStage(STAGES[stageIndex + 1].id)}>
            التالي: {STAGES[stageIndex + 1].label}
          </LabButton>
        )}
      </div>

      <LabSection
        title="هل هناك شيء قد يجعل المشاركة أسهل؟"
        description="اختياري. كل واحد منها مخرج مستقل، ولا يدخل بطاقة المشارك."
      >
        <div className="flex flex-wrap gap-2">
          {SPACE_SUPPORT_ASSET_TYPES.map((t) => (
            <button
              key={t.type}
              type="button"
              title={t.hint}
              onClick={() => addSupportAsset(t.type, t.label)}
              className="min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.label}
            </button>
          ))}
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
      </LabSection>

      {drawer === "considerations" && (
        <SpaceDrawer title="اعتبارات المشاركة" onClose={() => setDrawer(null)}>
          <p className="mb-3 text-sm text-muted-foreground">
            أشياء بسيطة قد تساعد قبل المشاركة وأثناءها. للأسرة فقط، ولا تظهر للمشارك.
          </p>
          {considerationsFor(spec, selection.supportTools, rows.length).map((block) => (
            <section key={block.title} className="mb-4">
              <h3 className="mb-1 text-base font-bold text-foreground">{block.title}</h3>
              <ul className="list-disc space-y-1 pe-5 text-sm leading-relaxed text-muted-foreground">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </SpaceDrawer>
      )}

      {drawer === "coverage" && (
        <SpaceDrawer title="الدعم البصري" onClose={() => setDrawer(null)}>
          <p className="mb-3 text-sm text-muted-foreground">
            جاهزية الدعم لهذه المشاركة فقط — لا تصف أحداً.
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {rows.map((row) => (
              <li key={row.stepId} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate text-sm font-bold">{row.familyText}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {visualStatusLabel[row.status]}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-bold",
                    row.presentation !== "text" && row.status === "needed"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {row.presentation !== "text" && row.status === "needed" ? "يحتاج إعداد" : "جاهز"}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <LabLinkButton to="/tools" variant="ghost">
              أنشئوا معينًا بصريًا
            </LabLinkButton>
            <LabButton variant="ghost" onClick={() => addSupportAsset("schedule", "جدول مصور")}>
              أنشئوا جدولًا مصورًا
            </LabButton>
          </div>
        </SpaceDrawer>
      )}
    </LabPage>
  );
}
