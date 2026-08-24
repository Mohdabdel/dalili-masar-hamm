import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/participations")({
  component: LabParticipations,
  head: labHead("مشاركات نكررها", "عرض تجريبي للمشاركات التي صارت جزءاً من الروتين."),
});

function LabParticipations() {
  return (
    <LabPage title="مشاركات نكررها" intro="ما تكرر معكم وأصبح مألوفاً داخل اليوم.">
      <LabStateBoundary emptyTitle="لا توجد مشاركات بعد">
        <LabSection title="قائمة المشاركات">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
