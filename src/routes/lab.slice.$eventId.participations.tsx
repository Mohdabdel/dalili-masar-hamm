// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { EventParticipationsPage } from "@/features/space/pages/EventParticipationsPage";

export const Route = createFileRoute("/lab/slice/$eventId/participations")({
  component: LabWrapper,
  head: labHead("المشاركات الوظيفية", "مساهمات حقيقية داخل الحدث بنتيجة مفهومة."),
});

function LabWrapper() {
  const { eventId } = useParams({ from: "/lab/slice/$eventId/participations" });
  return <EventParticipationsPage eventId={eventId} />;
}
