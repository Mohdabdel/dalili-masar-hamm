// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { WorkspacePage } from "@/features/space/pages/WorkspacePage";

export const Route = createFileRoute("/lab/slice/workspace/$specId")({
  component: LabWrapper,
  head: labHead("مساحة الأسرة", "اختيار ← تجهيز ← تركيب ← معاينة ← اعتماد."),
});

function LabWrapper() {
  const { specId } = useParams({ from: "/lab/slice/workspace/$specId" });
  return <WorkspacePage specId={specId} />;
}
