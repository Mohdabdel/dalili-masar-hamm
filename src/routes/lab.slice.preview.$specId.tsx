// غلاف Lab لمعاينة بطاقة المشاركة قبل الاعتماد.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { PreviewPage } from "@/features/space/pages/PreviewPage";

export const Route = createFileRoute("/lab/slice/preview/$specId")({
  component: LabWrapper,
  head: labHead(
    "معاينة بطاقة المشاركة",
    "معاينة بطاقة المشاركة كما ستظهر تماماً قبل اعتمادها كنسخة ثابتة.",
  ),
});

function LabWrapper() {
  const { specId } = useParams({ from: "/lab/slice/preview/$specId" });
  return <PreviewPage specId={specId} />;
}

