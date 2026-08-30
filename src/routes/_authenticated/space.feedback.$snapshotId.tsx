import { createFileRoute, useParams } from "@tanstack/react-router";
import { FeedbackPage } from "@/features/space/pages/FeedbackPage";

export const Route = createFileRoute("/_authenticated/space/feedback/$snapshotId")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "كيف كانت اليوم؟ — دليلي" },
      { name: "description", content: "انطباع الأسرة بعد المشاركة، ثم اختيار ما بعد البطاقة." },
      { property: "og:title", content: "كيف كانت اليوم؟ — دليلي" },
      { property: "og:description", content: "انطباع الأسرة بعد المشاركة، ثم اختيار ما بعد البطاقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { snapshotId } = useParams({ from: "/_authenticated/space/feedback/$snapshotId" });
  return <FeedbackPage snapshotId={snapshotId} />;
}
