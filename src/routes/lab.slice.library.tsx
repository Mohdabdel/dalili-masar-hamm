// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { LibraryPage } from "@/features/space/pages/LibraryPage";

export const Route = createFileRoute("/lab/slice/library")({
  component: LabWrapper,
  head: labHead("مكتبة الحياة", "كل الأحداث المتاحة داخل النموذج، روتينية وغير روتينية."),
});

function LabWrapper() {
  return <LibraryPage />;
}
