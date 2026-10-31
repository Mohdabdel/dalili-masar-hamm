import { createFileRoute } from "@tanstack/react-router";
import { SpaceHomePage } from "@/features/space/pages/SpaceHomePage";

export const Route = createFileRoute("/_authenticated/space/participations")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مشاركاتنا — دليلي" },
      { name: "description", content: "مسودات الأسرة ومشاركاتها الحالية وبطاقاتها المعتمدة وتسجيل اليوم والسجل." },
      { property: "og:title", content: "مشاركاتنا — دليلي" },
      { property: "og:description", content: "مسودات الأسرة ومشاركاتها الحالية وبطاقاتها المعتمدة وتسجيل اليوم والسجل." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <SpaceHomePage />;
}
