import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { StepTree } from "@/lab/components/StepTree";
import { findStep, getSpec } from "@/lab/data/slice";
import { useSlice, useSliceHelpers } from "@/lab/slice/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/workspace/$specId")({
  component: SliceWorkspace,
  head: labHead("مساحة عمل الأسرة", "اختاروا ما سيشارك فيه هذه المرة، وأين تنتهي المشاركة."),
});

const SUPPORT_TOOLS = [
  { id: "photos", label: "صور الخطوات" },
  { id: "spoken", label: "تذكير بالكلام" },
  { id: "hand", label: "مساندة باليد" },
  { id: "timer", label: "مؤقّت هادئ" },
];

function SliceWorkspace() {
  const { specId } = useParams({ from: "/lab/slice/workspace/$specId" });
  const spec = getSpec(specId);
  const { dispatch } = useSlice();
  const { selectionFor } = useSliceHelpers();

  if (!spec) {
    return (
      <LabPage title="مشاركة غير موجودة" intro="هذه المشاركة ليست ضمن النموذج.">
        <LabLinkButton to="/lab/slice">رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const selection = selectionFor(specId);

  const toggle = (stepId: string) => {
    const exists = selection.selected.some((s) => s.stepId === stepId);
    const next = exists
      ? selection.selected
          .filter((s) => s.stepId !== stepId)
          .sort((a, b) => a.order - b.order)
          .map((s, i) => ({ ...s, order: i + 1 }))
      : [...selection.selected, { stepId, order: selection.selected.length + 1 }];
    dispatch({ type: "selection", value: { ...selection, selected: next } });
  };

  const chooseOption = (stepId: string, optionId: string) => {
    const map = { ...selection.chosenExecutionOptionByStepId };
    if (map[stepId] === optionId) delete map[stepId];
    else map[stepId] = optionId;
    dispatch({ type: "selection", value: { ...selection, chosenExecutionOptionByStepId: map } });
  };

  const toggleTool = (id: string) => {
    const on = selection.supportTools.includes(id);
    dispatch({
      type: "selection",
      value: {
        ...selection,
        supportTools: on
          ? selection.supportTools.filter((t) => t !== id)
          : [...selection.supportTools, id],
      },
    });
  };

  const ordered = [...selection.selected].sort((a, b) => a.order - b.order);
  const last = ordered.at(-1);
  const lastStep = last ? findStep(spec, last.stepId) : null;

  return (
    <LabPage
      title={spec.title_ar}
      intro="اختاروا ما تريدون فعلاً أن يشارك فيه هذه المرة. الترتيب يظهر بجانب كل اختيار، وآخر اختيار هو نهاية المشاركة."
      footer={
        <div className="flex flex-wrap gap-3">
          <LabLinkButton to="/lab/slice/card/$specId" params={{ specId }}>
            معاينة البطاقة
          </LabLinkButton>
          <LabLinkButton to="/lab/slice/participations" variant="ghost">
            مشاركاتنا
          </LabLinkButton>
        </div>
      }
    >
      <LabSection
        title="أجزاء المشاركة"
        description="الأجزاء الرئيسية ظاهرة، والتفاصيل تُفتح عند الحاجة فقط."
      >
        <StepTree
          spec={spec}
          selected={selection.selected}
          onToggle={toggle}
          chosenOptions={selection.chosenExecutionOptionByStepId}
          onChooseOption={chooseOption}
        />
      </LabSection>

      <LabSection title="نهاية المشاركة هذه المرة">
        {lastStep ? (
          <LabNote>
            تنتهي المشاركة عند: <strong className="text-foreground">{lastStep.instruction_family_ar}</strong> — بعدها تكمل الأسرة بقية الحدث كالمعتاد.
          </LabNote>
        ) : (
          <LabNote>لم تختاروا أي جزء بعد. اختاروا جزءاً واحداً على الأقل.</LabNote>
        )}
      </LabSection>

      <LabSection title="دعم أثناء المشاركة" description="ما الذي يسهّل المشاركة هذه المرة؟">
        <div className="flex flex-wrap gap-2">
          {SUPPORT_TOOLS.map((t) => {
            const on = selection.supportTools.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTool(t.id)}
                className={cn(
                  "min-h-[44px] rounded-xl border px-4 text-base font-semibold",
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </LabSection>
    </LabPage>
  );
}
