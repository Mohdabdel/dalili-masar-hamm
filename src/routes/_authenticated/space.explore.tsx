import { createFileRoute } from "@tanstack/react-router";
import { ExplorePage } from "@/features/space/pages/ExplorePage";

const title = "استكشف المشاركات الممكنة — دليلي";
const description = "اكتشفوا المشاركات من خلال أحداث يومكم أو محطات روتينكم، واختاروا واحدة تبدأون بها.";

export const Route = createFileRoute("/_authenticated/space/explore")({
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
  return <ExplorePage />;
}
