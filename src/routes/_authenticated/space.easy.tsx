import { createFileRoute } from "@tanstack/react-router";
import { EasyBeginningPage } from "@/features/space/pages/EasyBeginningPage";

const title = "لنجعل البداية سهلة — دليلي";
const description = "أسئلة قصيرة تقود الأسرة إلى بدايات مشاركة مبنية على الاهتمامات ومواقف الحياة.";

export const Route = createFileRoute("/_authenticated/space/easy")({
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
  return <EasyBeginningPage />;
}
