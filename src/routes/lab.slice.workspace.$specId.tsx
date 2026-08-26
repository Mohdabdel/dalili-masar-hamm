import { useMemo, useState } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabButton, LabLinkButton, labHead } from "@/lab/components/lab-ui";
import { WorkspaceSteps } from "@/lab/components/space/WorkspaceSteps";
import { StepFrame } from "@/lab/components/StepFrame";
import {
  buildSpaceSnapshot,
  findSpaceStep,
  flatSteps,
  getSpaceSpec,
  spaceLevelLabel,
  SPACE_SUPPORT_TOOLS,
} from "@/lab/data/space/catalog";
import { useSlice, useSliceHelpers } from "@/lab/slice/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/workspace/$specId")({
  component: SliceWorkspace,
  head: labHead("مساحة عمل الأسرة", "ما الذي تريدون أن تشمله المشاركة هذه المرة؟"),
});

function SliceWorkspace() {
  const { specId } = useParams({ from: "/lab/slice/workspace/$specId" });
  const spec = getSpaceSpec(specId);
  const { dispatch } = useSlice();
  const { selectionFor, snapshotsFor } = useSliceHelpers();
  const navigate = useNavigate();

  const selection = selectionFor(specId);
  const versions = snapshotsFor(specId);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const leaves = useMemo(() => {
    if (!spec) return [];
    // الخطوة القابلة للتنفيذ: التفصيل إن وُجد، وإلا الخطوة الرئيسية.
    return flatSteps(spec).filter(
      (e) => !e.isMajor || spec.majorSteps.find((m) => m.id === e.step.id)?.substeps.length === 0,
    );
  }, [spec]);

  if (!spec) {
    return (
      <LabPage title="هذه المشاركة غير متاحة" intro="ربما تغيّر الرابط.">
        <LabLinkButton to="/lab/slice">رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  const setSelection = (next: Partial<typeof selection>) =>
    dispatch({ type: "selection", value: { ...selection, ...next } });

  const renumber = (ids: string[]) => ids.map((stepId, i) => ({ stepId, order: i + 1 }));

  const orderedIds = [...selection.selected]
    .sort((a, b) => a.order - b.order)
    .map((s) => s.stepId);

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

  const toggleTool = (id: string) =>
    setSelection({
      supportTools: selection.supportTools.includes(id)
        ? selection.supportTools.filter((t) => t !== id)
        : [...selection.supportTools, id],
    });

  const approve = () => {
    if (orderedIds.length === 0) return;
    const snapshot = buildSpaceSnapshot({
      spec,
      selection,
      version: versions.length + 1,
      label_ar: label.trim() || `${spec.title_ar} — بطاقة ${versions.length + 1}`,
      date,
    });
    dispatch({ type: "snapshot", value: snapshot });
    navigate({ to: "/lab/slice/card/$specId", params: { specId } });
  };

  const previewFrames = orderedIds
    .map((id) => findSpaceStep(spec, id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <LabPage
      title={spec.title_ar}
      intro={`${spec.eventTitle_ar} — مستوى ${spaceLevelLabel[spec.level]}. ما الذي تريدون أن تشمله المشاركة هذه المرة؟`}
    >
      <LabSection
        title="المسار الكامل للمشاركة"
        description="اختاروا الجزء الذي يناسبكم اليوم — جزءاً منه أو كله. التالي داخل البطاقة يعني الخطوة التالية في نفس المشاركة."
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

      <LabSection title="من أين نبدأ؟ وأين ننتهي هذه المرة؟">
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
            <span className="mb-1 block text-sm font-bold">ننتهي عند</span>
            <select
              value={endId}
              onChange={(e) => applyRange(startId || e.target.value, e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">اختاروا نقطة النهاية</option>
              {leaves.map((l) => (
                <option key={l.step.id} value={l.step.id}>
                  {l.step.instruction_family_ar}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          يمكنكم بعد ذلك إضافة أو إزالة خطوة بعينها من القائمة أعلاه.
        </p>
      </LabSection>

      <LabSection title="ما الذي قد يساعد؟" description="اختياري تماماً، ولا يدخل بطاقة المشارك.">
        <div className="flex flex-wrap gap-2">
          {SPACE_SUPPORT_TOOLS.map((t) => {
            const on = selection.supportTools.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTool(t.id)}
                className={cn(
                  "min-h-11 rounded-xl border px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </LabSection>

      <LabSection title="بيانات البطاقة" description="تبقى في مساحة الأسرة فقط.">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">عنوان البطاقة</span>
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

      <LabSection title="معاينة البطاقة" description="هذا ما سيراه المشارك، بلا أي إعدادات.">
        {previewFrames.length === 0 ? (
          <LabNote>اختاروا خطوة واحدة على الأقل لتظهر المعاينة.</LabNote>
        ) : (
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previewFrames.map((step, i) => {
              const optionId = selection.chosenExecutionOptionByStepId[step.id];
              const option = step.executionOptions?.find((o) => o.id === optionId);
              return (
                <li key={step.id} className="rounded-2xl border border-border bg-card p-2">
                  <StepFrame asset={step.visual_asset} label={step.instruction_short_ar} />
                  <p className="mt-2 text-center text-base font-bold leading-snug">
                    {i + 1}. {step.instruction_short_ar}
                  </p>
                  {option && (
                    <p className="text-center text-sm text-muted-foreground">{option.label_ar}</p>
                  )}
                </li>
              );
            })}
            <li className="grid place-items-center rounded-2xl border border-dashed border-border p-4 text-lg font-bold text-muted-foreground">
              انتهينا
            </li>
          </ol>
        )}
      </LabSection>

      <div className="flex flex-wrap items-center gap-3">
        <LabButton onClick={approve} disabled={previewFrames.length === 0}>
          {versions.length === 0 ? "نعتمد البطاقة" : "نعتمد بطاقة جديدة"}
        </LabButton>
        {versions.length > 0 && (
          <LabLinkButton to="/lab/slice/card/$specId" params={{ specId }} variant="ghost">
            بطاقات هذه المشاركة ({versions.length})
          </LabLinkButton>
        )}
      </div>

      <div className="mt-6">
        <LabNote>
          الاعتماد يصنع نسخة مجمّدة: النصوص والصور تُنسخ الآن، وأي تعديل لاحق ينشئ بطاقة جديدة ولا
          يغيّر بطاقة سابقة.
        </LabNote>
      </div>
    </LabPage>
  );
}
