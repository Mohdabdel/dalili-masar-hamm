import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/features/space/pages/LibraryPage";

export const Route = createFileRoute("/_authenticated/space/library")({
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مكتبة الحياة — دليلي" },
      { name: "description", content: "تصفحوا أحداث الحياة اليومية داخل المنزل وخارجه واختاروا ما يشبه حياتكم." },
      { property: "og:title", content: "مكتبة الحياة — دليلي" },
      { property: "og:description", content: "تصفحوا أحداث الحياة اليومية داخل المنزل وخارجه واختاروا ما يشبه حياتكم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <LibraryPage />;
}
