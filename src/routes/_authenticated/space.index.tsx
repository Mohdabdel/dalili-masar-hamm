import { createFileRoute } from "@tanstack/react-router";
import { SpaceHomePage } from "@/features/space/pages/SpaceHomePage";

export const Route = createFileRoute("/_authenticated/space/")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مساحة مشاركة الأسرة — دليلي" },
      { name: "description", content: "بطاقات مشاركة أسرتكم: ما هو مفتوح الآن وما سبق أن أغلقتموه." },
      { property: "og:title", content: "مساحة مشاركة الأسرة — دليلي" },
      { property: "og:description", content: "بطاقات مشاركة أسرتكم: ما هو مفتوح الآن وما سبق أن أغلقتموه." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <SpaceHomePage />;
}
