import { createFileRoute, useParams } from "@tanstack/react-router";
import { LevelPage } from "@/features/space/pages/LevelPage";

export const Route = createFileRoute("/_authenticated/space/$eventId/level")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مستوى المشاركة — دليلي" },
      { name: "description", content: "المستوى يصف المهمة نفسها، ولا يصف الشخص." },
      { property: "og:title", content: "مستوى المشاركة — دليلي" },
      { property: "og:description", content: "المستوى يصف المهمة نفسها، ولا يصف الشخص." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { eventId } = useParams({ from: "/_authenticated/space/$eventId/level" });
  return <LevelPage eventId={eventId} />;
}
