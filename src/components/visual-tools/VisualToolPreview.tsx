import { resolveItemImage } from "@/lib/visual-tools/resolve-image";
import type { VisualToolProject } from "@/lib/visual-tools/types";

const layoutClass: Record<VisualToolProject["layout"], string> = {
  list: "grid grid-cols-1 gap-3",
  grid2: "grid grid-cols-2 gap-3",
  grid3: "grid grid-cols-2 gap-3 sm:grid-cols-3",
};

/** معاينة موحّدة لكل الأدوات — نفس النواة، يتغير التوزيع فقط. */
export function VisualToolPreview({ project }: { project: VisualToolProject }) {
  const items = project.items.filter((i) => !i.hidden);
  const ordered = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const numbered = project.type === "visual_sequence" || project.type === "custom_participation";

  if (ordered.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        لا توجد عناصر ظاهرة بعد. أضف عنصرًا لتظهر المعاينة.
      </p>
    );
  }

  return (
    <div dir="rtl" className={layoutClass[project.layout]}>
      {ordered.map((item, idx) => {
        const src = resolveItemImage(item);
        return (
          <figure
            key={item.id}
            className="m-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            {src ? (
              <img
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className={
                  project.layout === "list" ? "h-40 w-full object-cover" : "h-28 w-full object-cover"
                }
              />
            ) : (
              <div className="flex h-20 items-center justify-center bg-muted text-xs text-muted-foreground">
                بدون صورة
              </div>
            )}
            <figcaption className="flex items-start gap-2 p-3 text-right">
              {numbered && (
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {idx + 1}
                </span>
              )}
              <span className="text-base font-bold leading-snug text-foreground">
                {item.text || "—"}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
