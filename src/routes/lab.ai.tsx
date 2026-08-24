import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/ai")({
  component: LabAi,
  head: labHead("اقتراحات", "اقتراحات تجريبية تختار منها الأسرة أو تتجاوزها."),
});

function LabAi() {
  return (
    <LabPage title="اقتراحات" intro="مجرد اقتراحات. القرار دائماً لكم، ويمكن تجاهلها بالكامل.">
      <LabStateBoundary emptyTitle="لا توجد اقتراحات الآن">
        <LabSection title="اقتراحات اليوم">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
