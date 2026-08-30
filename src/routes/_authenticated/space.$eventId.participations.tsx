import { createFileRoute, useParams } from "@tanstack/react-router";
import { EventParticipationsPage } from "@/features/space/pages/EventParticipationsPage";

export const Route = createFileRoute("/_authenticated/space/$eventId/participations")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مشاركات الحدث — دليلي" },
      { name: "description", content: "مساهمات حقيقية داخل الحدث بنتيجة مفهومة للأسرة." },
      { property: "og:title", content: "مشاركات الحدث — دليلي" },
      { property: "og:description", content: "مساهمات حقيقية داخل الحدث بنتيجة مفهومة للأسرة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { eventId } = useParams({ from: "/_authenticated/space/$eventId/participations" });
  return <EventParticipationsPage eventId={eventId} />;
}
