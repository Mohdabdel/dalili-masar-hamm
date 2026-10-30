import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { VisualToolEditor } from "@/components/visual-tools/VisualToolEditor";
import { useHydratedTools, useVisualToolProject, useVisualToolsError } from "@/lib/visual-tools/use-visual-tools";
import { getToolMeta } from "@/lib/visual-tools/types";

export const Route = createFileRoute("/tools/$projectId")({
  validateSearch: (search: Record<string, unknown>): { source?: "workspace"; specId?: string } => ({
    source: search.source === "workspace" && typeof search.specId === "string" && /^[A-Za-z0-9_-]{1,120}$/.test(search.specId)
      ? ("workspace" as const) : undefined,
    specId: typeof search.specId === "string" && /^[A-Za-z0-9_-]{1,120}$/.test(search.specId) ? search.specId : undefined,
  }),
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
  const { source, specId } = Route.useSearch();
  const returnSearch = {
    source: source === "workspace" && specId ? source : undefined,
    specId: source === "workspace" ? specId : undefined,
  };
  const project = useVisualToolProject(projectId);
  const hydrated = useHydratedTools();
  const error = useVisualToolsError();

  if (!project) {
    return (
      <PageShell
        title="أدوات ووسائل داعمة"
        backTo="/tools"
        backSearch={returnSearch}
        breadcrumbs={[{ label: "أدوات ووسائل داعمة", to: "/tools" }]}
      >
        <p dir="rtl" className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {error || (hydrated ? (
            <>
              هذه الأداة غير متاحة لهذا الحساب على هذا الجهاز.{" "}
              <Link to="/tools" search={returnSearch} className="font-semibold text-primary underline">
                العودة إلى قائمة الأدوات
              </Link>
            </>
          ) : (
            "جارٍ فتح الأداة…"
          ))}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={project.title}
      subtitle={getToolMeta(project.type).titleAr}
      description="تُحفظ أدوات الحساب على هذا الجهاز فقط؛ لا تُزامَن بين الأجهزة. أدوات الزائر مشتركة بين زوار المتصفح."
      backTo="/tools"
      backSearch={returnSearch}
      breadcrumbs={[
        { label: "أدوات ووسائل داعمة", to: "/tools" },
        { label: project.title },
      ]}
    >
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <VisualToolEditor key={project.userId + ":" + project.id} project={project} />
    </PageShell>
  );
}

