import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Clock, Plus, Trash2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { createProject, deleteProject } from "@/lib/visual-tools/store";
import { useVisualToolProjects } from "@/lib/visual-tools/use-visual-tools";
import { VISUAL_TOOL_TYPES, getToolMeta } from "@/lib/visual-tools/types";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "أدوات ووسائل داعمة | دليلي" },
      {
        name: "description",
        content:
          "أنشئ جدولًا بصريًا، تسلسلًا بصريًا، لوحة اختيار، لوحة تواصل بسيطة، أو صمّم مشاركة خاصة بأسرتك. أدوات خاصة تُحفظ على جهازك.",
      },
      { property: "og:title", content: "أدوات ووسائل داعمة | دليلي" },
      {
        property: "og:description",
        content: "خمس أدوات بصرية بمحرر واحد بسيط، وكل ما تنشئه الأسرة يبقى خاصًا بها.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ToolsHomePage,
});

function ToolsHomePage() {
  const navigate = useNavigate();
  const projects = useVisualToolProjects();

  function start(type: (typeof VISUAL_TOOL_TYPES)[number]["type"]) {
    const p = createProject(type);
    navigate({ to: "/tools/$projectId", params: { projectId: p.id } });
  }

  return (
    <PageShell
      title="أدوات ووسائل داعمة"
      description="أدوات بصرية تصنعها الأسرة بنفسها، وتبقى محفوظة على جهازها فقط"
      breadcrumbs={[
        { label: "دليلي", to: "/activities" },
        { label: "أدوات ووسائل داعمة" },
      ]}
    >
      <div dir="rtl" className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">اختر أداة لتبدأ</h2>
          <div className="grid gap-3">
            {VISUAL_TOOL_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => start(t.type)}
                className="rounded-2xl border border-border bg-card p-4 text-right shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-foreground">{t.titleAr}</span>
                  <Plus className="h-5 w-5 shrink-0 text-primary" />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.descriptionAr}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground">أدواتي المحفوظة</h2>
          {projects.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              لم تنشئ أي أداة بعد.
            </p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm"
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-right"
                    onClick={() =>
                      navigate({ to: "/tools/$projectId", params: { projectId: p.id } })
                    }
                  >
                    <span className="block truncate text-sm font-bold text-foreground">
                      {p.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {getToolMeta(p.type).titleAr} · {p.items.length} عنصر
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="حذف الأداة"
                    className="text-destructive"
                    onClick={() => deleteProject(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  );
}
