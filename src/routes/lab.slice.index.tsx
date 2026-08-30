// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { SpaceHomePage } from "@/features/space/pages/SpaceHomePage";

export const Route = createFileRoute("/lab/slice/")({
  component: LabWrapper,
  head: labHead("دليلي", "المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها."),
});

function LabWrapper() {
  return <SpaceHomePage />;
}
