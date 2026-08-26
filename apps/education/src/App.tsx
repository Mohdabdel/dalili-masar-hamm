import { useMemo, useState } from "react";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { ResourceDirectory } from "@/components/ResourceDirectory";
import { getEducationServices, getResources } from "@/lib/service-directories";
import { cn } from "@/lib/utils";

export default function App() {
  const services = useMemo(() => getEducationServices(), []);
  const resources = useMemo(() => getResources(), []);
  const [tab, setTab] = useState<"providers" | "resources">("providers");

  return (
    <div dir="rtl" className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold">مصادر الدعم التعليمي</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            مقدمو الخدمات التعليمية والتأهيلية، ومكتبة المصادر التعليمية
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <div role="tablist" aria-label="أقسام الدعم التعليمي" className="mb-4 grid grid-cols-2 gap-2">
          {(
            [
              ["providers", "مقدمو الخدمات"],
              ["resources", "المصادر التعليمية"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "min-h-11 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tab === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-accent",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "providers" ? (
          <ServiceDirectory
            intro="مزودو الخدمات التعليمية والتأهيلية: التربية الخاصة، التعليم العالي وتسهيلات الطلبة، التدريب المهني، وخدمات الانتقال. معلومات وصول فقط دون تقييم أو تفضيل."
            services={services}
            emptyTitle="لا توجد نتائج مطابقة"
            emptyBody="جرّب تعديل كلمة البحث أو إعادة ضبط المرشحات لعرض مقدمي الخدمات المتاحين."
          />
        ) : (
          <ResourceDirectory
            intro="مكتبة مصادر تعليمية وأدلة وقوائم مراجعة صادرة عن جهات رسمية ومنظمات متخصصة. المصادر ليست مقدمي خدمة، وتُفتح روابطها في نافذة جديدة."
            resources={resources}
          />
        )}
      </main>
    </div>
  );
}
