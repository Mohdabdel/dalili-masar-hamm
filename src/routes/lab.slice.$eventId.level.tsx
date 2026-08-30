// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { LevelPage } from "@/features/space/pages/LevelPage";

export const Route = createFileRoute("/lab/slice/$eventId/level")({
  component: LabWrapper,
  head: labHead("مستوى المشاركة", "المستوى يصف المهمة، ولا يصف الشخص."),
});

function LabWrapper() {
  const { eventId } = useParams({ from: "/lab/slice/$eventId/level" });
  return <LevelPage eventId={eventId} />;
}
