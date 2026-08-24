import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/visual")({
  component: LabVisual,
  head: labHead("الوسائل البصرية", "عرض تجريبي للصور والتسلسلات الداعمة للمشاركة."),
});

function LabVisual() {
  return (
    <LabPage title="الوسائل البصرية" intro="صور وتسلسلات بسيطة تُستخدم عند الحاجة فقط.">
      <LabStateBoundary emptyTitle="لا توجد وسائل مضافة">
        <LabSection title="الوسائل المتاحة">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
