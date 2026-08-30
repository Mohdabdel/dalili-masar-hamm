import { createFileRoute, useParams } from "@tanstack/react-router";
import { LearnerPage } from "@/features/space/pages/LearnerPage";

export const Route = createFileRoute("/_authenticated/space/learner/$snapshotId")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "بطاقة المشارك — دليلي" },
      { name: "description", content: "صورة واحدة وكلمات قليلة في كل شاشة، من النسخة المعتمدة." },
      { property: "og:title", content: "بطاقة المشارك — دليلي" },
      { property: "og:description", content: "صورة واحدة وكلمات قليلة في كل شاشة، من النسخة المعتمدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  const { snapshotId } = useParams({ from: "/_authenticated/space/learner/$snapshotId" });
  return <LearnerPage snapshotId={snapshotId} />;
}
