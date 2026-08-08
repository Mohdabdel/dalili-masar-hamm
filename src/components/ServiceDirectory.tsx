import { useMemo, useState } from "react";
import { Search, Phone, Globe, MapPin, Accessibility, FolderPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EMIRATES,
  filterProviders,
  type ServiceProvider,
} from "@/lib/service-directories";

/**
 * DALILI-THREE-SERVICE-HOME-01
 * واجهة دليل وصول عامة تُستخدم في الخدمتين المستقلتين (المجتمعي والتعليمي).
 * لا ترتبط ببطاقات المشاركة أو فرص المشاركة.
 */
export function ServiceDirectory({
  intro,
  categories,
  providers,
  emptyTitle,
  emptyBody,
}: {
  intro: string;
  categories: readonly string[];
  providers: ServiceProvider[];
  emptyTitle: string;
  emptyBody: string;
}) {
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState("all");
  const [category, setCategory] = useState("all");

  const results = useMemo(
    () => filterProviders(providers, { query, emirate, category }),
    [providers, query, emirate, category],
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
            placeholder="ابحث باسم الجهة أو نوع الخدمة"
            className="min-h-11 pe-9 text-right"
            aria-label="بحث في الدليل"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={emirate} onValueChange={setEmirate}>
            <SelectTrigger className="min-h-11 text-right" aria-label="الإمارة">
              <SelectValue placeholder="الإمارة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الإمارات</SelectItem>
              {EMIRATES.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="min-h-11 text-right" aria-label="نوع الخدمة">
              <SelectValue placeholder="نوع الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الخدمات</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-bold text-foreground">فئات الوصول</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(active ? "all" : c)}
                className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center shadow-card-soft">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <FolderPlus className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3 className="mt-3 text-base font-bold text-foreground">{emptyTitle}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {emptyBody}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.map((p) => (
            <li key={p.id}>
              <ProviderCard provider={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProviderCard({ provider }: { provider: ServiceProvider }) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="min-w-0 text-base font-bold leading-snug text-foreground">
          {provider.name}
        </h3>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          {provider.category}
        </span>
      </div>

      <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        {provider.emirate}
      </p>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{provider.summary}</p>

      {provider.accessibilityNotes && (
        <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-secondary/60 p-2.5 text-xs leading-relaxed text-foreground">
          <Accessibility className="mt-0.5 h-4 w-4 shrink-0" />
          {provider.accessibilityNotes}
        </p>
      )}

      {(provider.phone || provider.website) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/50"
            >
              <Phone className="h-4 w-4" />
              {provider.phone}
            </a>
          )}
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/50"
            >
              <Globe className="h-4 w-4" />
              الموقع الإلكتروني
            </a>
          )}
        </div>
      )}
    </article>
  );
}
