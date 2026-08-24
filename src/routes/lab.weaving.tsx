import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/weaving")({
  component: LabWeaving,
  head: labHead("شيء يحبه", "مدخل تجريبي يبدأ من اهتمام أو فعل موجود فعلاً."),
});

function LabWeaving() {
  return (
    <LabPage title="شيء يحبه" intro="نبدأ من اهتمام موجود، ونبحث له عن مكان داخل يومكم.">
      <LabStateBoundary emptyTitle="لم تضيفوا اهتماماً بعد">
        <LabSection title="الاهتمامات">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
