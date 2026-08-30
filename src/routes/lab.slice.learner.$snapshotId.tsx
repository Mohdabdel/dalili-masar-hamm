// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { LearnerPage } from "@/features/space/pages/LearnerPage";

export const Route = createFileRoute("/lab/slice/learner/$snapshotId")({
  component: LabWrapper,
  head: labHead("بطاقة المشارك", "صورة واحدة وكلمات قليلة في كل شاشة."),
});

function LabWrapper() {
  const { snapshotId } = useParams({ from: "/lab/slice/learner/$snapshotId" });
  return <LearnerPage snapshotId={snapshotId} />;
}
