import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { getSliceEvent, levelHint, levelLabel } from "@/lab/data/slice";
import { useSlice } from "@/lab/slice/state";
import type { SliceLevel } from "@/lab/slice/types";

export const Route = createFileRoute("/lab/slice/$eventId/level")({
  component: SliceLevelPage,
  head: labHead("مساحة المشاركة", "تُحدَّد مرة واحدة لهذا الحدث، ويمكن تغييرها لاحقاً."),
});

const LEVELS: SliceLevel[] = ["simple", "moderate", "advanced"];

function SliceLevelPage() {
  const { eventId } = useParams({ from: "/lab/slice/$eventId/level" });
  const event = getSliceEvent(eventId);
  const { state, dispatch } = useSlice();
  const navigate = useNavigate();
  const current = state.levelByEvent[eventId];

  if (!event) {
    return (
      <LabPage title="حدث غير موجود" intro="هذا الحدث ليس ضمن نموذج التجربة.">
        <LabLinkButton to="/lab/slice">رجوع إلى الأحداث</LabLinkButton>
      </LabPage>
    );
  }

  return (
    <LabPage
      title={`مساحة المشاركة في ${event.title_ar}`}
      intro="تُحدَّد مرة واحدة لهذا الحدث. هي تصف حجم المساحة داخل الحدث، ولا تصف الشخص."
    >
      <LabSection title="اختاروا حجم المساحة">
        <LabGrid>
          {LEVELS.map((lv) => (
            <LabChoiceCard
              key={lv}
              title={levelLabel[lv]}
              hint={levelHint[lv]}
              selected={current === lv}
              onClick={() => {
                dispatch({ type: "level", eventId, value: lv });
                navigate({
                  to: "/lab/slice/$eventId/participations",
                  params: { eventId },
                });
              }}
            />
          ))}
        </LabGrid>
      </LabSection>

      <LabNote>
        في هذا النموذج المحتوى متاح لمساحة «بسيط» فقط؛ باقي المساحات تظهر كقوائم فارغة مقصودة.
      </LabNote>
    </LabPage>
  );
}
