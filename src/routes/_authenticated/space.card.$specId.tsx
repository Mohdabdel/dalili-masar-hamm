import { createFileRoute, useParams } from "@tanstack/react-router";
import { CardsPage } from "@/features/space/pages/CardsPage";

export const Route = createFileRoute("/_authenticated/space/card/$specId")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "بطاقات المشاركة — دليلي" },
      { name: "description", content: "كل البطاقات المعتمدة داخل نفس المشاركة، محفوظة كنسخ ثابتة." },
      { property: "og:title", content: "بطاقات المشاركة — دليلي" },
      { property: "og:description", content: "كل البطاقات المعتمدة داخل نفس المشاركة، محفوظة كنسخ ثابتة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { specId } = useParams({ from: "/_authenticated/space/card/$specId" });
  return <CardsPage specId={specId} />;
}
