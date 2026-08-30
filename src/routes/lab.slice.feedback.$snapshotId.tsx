// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { FeedbackPage } from "@/features/space/pages/FeedbackPage";

export const Route = createFileRoute("/lab/slice/feedback/$snapshotId")({
  component: LabWrapper,
  head: labHead("كيف كانت اليوم؟", "انطباع سريع، ثم ما الخطوة القادمة."),
});

function LabWrapper() {
  const { snapshotId } = useParams({ from: "/lab/slice/feedback/$snapshotId" });
  return <FeedbackPage snapshotId={snapshotId} />;
}
