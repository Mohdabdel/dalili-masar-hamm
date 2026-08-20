import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { VisualToolEditor } from "@/components/visual-tools/VisualToolEditor";
import { useHydratedTools, useVisualToolProject } from "@/lib/visual-tools/use-visual-tools";
import { getToolMeta } from "@/lib/visual-tools/types";

export const Route = createFileRoute("/tools/$projectId")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "تحرير أداة داعمة | دليلي" },
      {
        name: "description",
        content:
          "محرر واحد لكل الأدوات البصرية: أضف عناصر، اختر صورًا، رتّبها وأخفِ ما لا تحتاجه، ثم عاين واطبع.",
      },
      { property: "og:title", content: "تحرير أداة داعمة | دليلي" },
      {
        property: "og:description",
        content: "حرّر أدواتك البصرية الخاصة بأسرتك مع حفظ تلقائي على جهازك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ToolEditorPage,
});

function ToolEditorPage() {
  const { projectId } = Route.useParams();
  const project = useVisualToolProject(projectId);
  const hydrated = useHydratedTools();

  if (!project) {
    return (
      <PageShell
        title="أدوات ووسائل داعمة"
        breadcrumbs={[{ label: "أدوات ووسائل داعمة", to: "/tools" }]}
      >
        <p dir="rtl" className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {hydrated ? (
            <>
              لم نجد هذه الأداة على هذا الجهاز.{" "}
              <Link to="/tools" className="font-semibold text-primary underline">
                العودة إلى قائمة الأدوات
              </Link>
            </>
          ) : (
            "جارٍ فتح الأداة…"
          )}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={project.title}
      subtitle={getToolMeta(project.type).titleAr}
      description="خاص بأسرتك — يُحفظ تلقائيًا على هذا الجهاز"
      breadcrumbs={[
        { label: "أدوات ووسائل داعمة", to: "/tools" },
        { label: project.title },
      ]}
    >
      <VisualToolEditor project={project} />
    </PageShell>
  );
}
