import { createFileRoute, useParams } from "@tanstack/react-router";
import { PreviewPage } from "@/features/space/pages/PreviewPage";

export const Route = createFileRoute("/_authenticated/space/preview/$specId")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "معاينة بطاقة المشاركة — دليلي" },
      {
        name: "description",
        content: "معاينة بطاقة المشاركة كما ستظهر تماماً قبل اعتمادها كنسخة ثابتة.",
      },
      { property: "og:title", content: "معاينة بطاقة المشاركة — دليلي" },
      {
        property: "og:description",
        content: "معاينة بطاقة المشاركة كما ستظهر تماماً قبل اعتمادها كنسخة ثابتة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { specId } = useParams({ from: "/_authenticated/space/preview/$specId" });
  return <PreviewPage specId={specId} />;
}
