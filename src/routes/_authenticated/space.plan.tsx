import { createFileRoute } from "@tanstack/react-router";
import { PlanMyselfPage } from "@/features/space/pages/PlanMyselfPage";

const title = "أخطط المشاركة بنفسي — دليلي";
const description = "صفوا مشاركة من حياتكم كما هي عندكم، وابدأوا مساحة عمل الأسرة مباشرة.";

export const Route = createFileRoute("/_authenticated/space/plan")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <PlanMyselfPage />;
}
