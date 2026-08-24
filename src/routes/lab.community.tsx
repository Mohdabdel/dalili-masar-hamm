import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/community")({
  component: LabCommunity,
  head: labHead("خارج البيت", "عرض تجريبي للمشاركة في المحيط المجتمعي."),
});

function LabCommunity() {
  return (
    <LabPage title="خارج البيت" intro="مشاوير وزيارات ومواقف يومية خارج المنزل.">
      <LabStateBoundary emptyTitle="لا توجد مواقف مضافة">
        <LabSection title="المواقف">
          <LabNote>سيتم بناء هذه الشاشة في الخطوة التالية من النموذج.</LabNote>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
