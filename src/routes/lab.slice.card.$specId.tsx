import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { StepFrame } from "@/lab/components/StepFrame";
import { buildSnapshot, findStep, getSpec } from "@/lab/data/slice";
import { useSlice, useSliceHelpers } from "@/lab/slice/state";

export const Route = createFileRoute("/lab/slice/card/$specId")({
  component: SliceCardPreview,
  head: labHead("معاينة البطاقة", "شاهدوا البطاقة قبل اعتمادها."),
});

function SliceCardPreview() {
  const { specId } = useParams({ from: "/lab/slice/card/$specId" });
  const spec = getSpec(specId);
  const { dispatch } = useSlice();
  const { selectionFor, snapshotsFor } = useSliceHelpers();
  const navigate = useNavigate();

  if (!spec) {
    return (
      <LabPage title="مشاركة غير موجودة" intro="هذه المشاركة ليست ضمن النموذج.">
        <LabLinkButton to="/lab/slice">رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const selection = selectionFor(specId);
  const previous = snapshotsFor(specId);
  const ordered = [...selection.selected].sort((a, b) => a.order - b.order);

  const approve = () => {
    const snap = buildSnapshot(spec, selection, previous.length + 1);
    dispatch({ type: "snapshot", value: snap });
    navigate({ to: "/lab/slice/learner/$snapshotId", params: { snapshotId: snap.id } });
  };

  return (
    <LabPage
      title={`معاينة: ${spec.title_ar}`}
      intro="هذه معاينة للأسرة. عند الاعتماد تُجمَّد نسخة ثابتة لا تتأثر بأي تعديل لاحق."
    >
      <LabSection title="ما سيظهر للمشارك">
        {ordered.length === 0 ? (
          <LabNote>لم تختاروا أي جزء بعد.</LabNote>
        ) : (
          <ol className="grid gap-3 sm:grid-cols-2">
            {ordered.map((sel, i) => {
              const step = findStep(spec, sel.stepId);
              if (!step) return null;
              const optId = selection.chosenExecutionOptionByStepId[sel.stepId];
              const opt = ("executionOptions" in step ? step.executionOptions : undefined)?.find(
                (o) => o.id === optId,
              );
              return (
                <li key={sel.stepId} className="rounded-2xl border border-border bg-card p-3">
                  <StepFrame asset={step.visual_asset} label={step.instruction_short_ar} />
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {i + 1}. {step.instruction_short_ar}
                  </p>
                  {opt && <p className="text-sm text-muted-foreground">{opt.label_ar}</p>}
                </li>
              );
            })}
            <li className="rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-lg font-bold">
              انتهينا
            </li>
          </ol>
        )}
      </LabSection>

      {previous.length > 0 && (
        <LabNote>
          لهذه المشاركة {previous.length} نسخة معتمدة سابقاً. الاعتماد الآن ينشئ نسخة جديدة دون تغيير السابقة.
        </LabNote>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <LabButton onClick={approve} disabled={ordered.length === 0}>
          اعتماد البطاقة
        </LabButton>
        <LabLinkButton to="/lab/slice/workspace/$specId" params={{ specId }} variant="ghost">
          تعديل الاختيار
        </LabLinkButton>
      </div>
    </LabPage>
  );
}
