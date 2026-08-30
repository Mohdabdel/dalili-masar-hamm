import { createFileRoute } from "@tanstack/react-router";
import { AllCardsPage } from "@/features/space/pages/AllCardsPage";

export const Route = createFileRoute("/_authenticated/space/participations")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "بطاقاتنا — دليلي" },
      { name: "description", content: "كل المشاركات التي اعتمدت لها الأسرة بطاقة." },
      { property: "og:title", content: "بطاقاتنا — دليلي" },
      { property: "og:description", content: "كل المشاركات التي اعتمدت لها الأسرة بطاقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <AllCardsPage />;
}
