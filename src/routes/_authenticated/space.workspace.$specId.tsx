import { createFileRoute, useParams } from "@tanstack/react-router";
import { WorkspacePage } from "@/features/space/pages/WorkspacePage";

export const Route = createFileRoute("/_authenticated/space/workspace/$specId")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مساحة الأسرة — دليلي" },
      { name: "description", content: "اختيار ← تجهيز ← تركيب ← معاينة ← اعتماد، وكل شيء محفوظ لأسرتكم." },
      { property: "og:title", content: "مساحة الأسرة — دليلي" },
      { property: "og:description", content: "اختيار ← تجهيز ← تركيب ← معاينة ← اعتماد، وكل شيء محفوظ لأسرتكم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { specId } = useParams({ from: "/_authenticated/space/workspace/$specId" });
  return <WorkspacePage specId={specId} />;
}
