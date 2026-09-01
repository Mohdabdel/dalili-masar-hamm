import { createFileRoute, useParams } from "@tanstack/react-router";
import { FeedbackPage } from "@/features/space/pages/FeedbackPage";

export const Route = createFileRoute("/_authenticated/space/feedback/$snapshotId")({
  component: SpaceRoute,
  validateSearch: (search: Record<string, unknown>) => ({
    runId: typeof search['runId'] === "string" ? (search['runId'] as string) : undefined,
  }),
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
  const { runId } = Route.useSearch();
  return <FeedbackPage snapshotId={snapshotId} runId={runId} />;
}
