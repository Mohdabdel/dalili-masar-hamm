import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/routine")({
  component: LabRoutine,
  head: labHead("روتيننا", "عرض تجريبي لمحطات اليوم كما ترتبها الأسرة."),
});

function LabRoutine() {
  return (
    <LabPage title="روتيننا" intro="محطات يومكم كما هي. لاحقاً نختار محطة واحدة تصلح للمشاركة.">
      <LabStateBoundary emptyTitle="لم تبنوا روتيناً بعد">
        <LabSection title="محطات اليوم">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
