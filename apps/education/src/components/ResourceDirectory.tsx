import { useMemo, useState } from "react";
import { Search, ExternalLink, FolderPlus, Clock, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMPLETENESS_LABELS,
  filterResources,
  label,
  listAudiences,
  listResourceTypes,
  type Resource,
} from "@/lib/service-directories";

/**
 * DALILI-SUPPORT-DIRECTORIES-PRODUCTION-INJECTION-01
 * دليل المصادر التعليمية — منفصل تمامًا عن مقدمي الخدمات وعن بطاقات المشاركة.
 */
export function ResourceDirectory({
  intro,
  resources,
}: {
  intro: string;
  resources: Resource[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [audience, setAudience] = useState("all");

  const types = useMemo(() => listResourceTypes(resources), [resources]);
  const audiences = useMemo(() => listAudiences(resources), [resources]);
  const results = useMemo(
    () => filterResources(resources, { query, resourceType: type, audience }),
    [resources, query, type, audience],
  );

  return (
    <div className="space-y-5" dir="rtl">
      <p className="rounded-2xl border border-border/60 bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-card-soft">
        {intro}
      </p>

      <section className="space-y-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
        <div className="relative">
          <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في عنوان المصدر أو الجهة الناشرة"
            className="min-h-11 pe-9 text-right"
            aria-label="بحث في المصادر"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="min-h-11 text-right" aria-label="نوع المصدر">
              <SelectValue placeholder="نوع المصدر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الأنواع</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={audience} onValueChange={setAudience}>
            <SelectTrigger className="min-h-11 text-right" aria-label="الفئة المستهدفة">
              <SelectValue placeholder="الفئة المستهدفة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {audiences.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-xs font-semibold text-muted-foreground">
          {results.length} مصدر معروض
        </p>
      </section>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-card-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <FolderPlus className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3 className="mt-3 text-base font-bold text-foreground">لا توجد نتائج مطابقة</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            جرّب تعديل كلمة البحث أو إعادة ضبط المرشحات.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((r) => {
            const pending = r.serviceCompleteness !== "COMPLETE";
            return (
              <li key={r.id}>
                <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <h3 className="min-w-0 text-base font-bold leading-snug text-foreground">
                      {r.titleAr}
                    </h3>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                      {r.resourceType}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm font-semibold text-foreground">{r.publisher}</p>
                  {r.qualityNotes && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {r.qualityNotes}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                    <span className="rounded-full bg-secondary/70 px-2.5 py-1 text-secondary-foreground">
                      {r.targetAudience}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                        pending
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {pending ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                      {label(COMPLETENESS_LABELS, r.serviceCompleteness)}
                    </span>
                    {r.lastVerified && (
                      <span className="font-normal text-muted-foreground">
                        آخر تحقق: {r.lastVerified}
                      </span>
                    )}
                  </div>

                  {r.officialUrl && (
                    <div className="mt-3">
                      <a
                        href={r.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        فتح المصدر الرسمي
                      </a>
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
