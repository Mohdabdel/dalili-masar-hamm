import { useMemo, useState } from "react";
import { Search, Globe, MapPin, FolderPlus, ShieldCheck, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ACCESS_LABELS,
  COMPLETENESS_LABELS,
  DOMAIN_LABELS,
  EMIRATE_LABELS,
  PROVIDER_TYPE_LABELS,
  SCOPE_LABELS,
  filterServices,
  label,
  listAccessMethods,
  listDomains,
  listEmirates,
  withProviders,
  type Service,
  type ServiceWithProvider,
} from "@/lib/service-directories";

/**
 * DALILI-SUPPORT-DIRECTORIES-PRODUCTION-INJECTION-01
 * واجهة دليل مزوّدي الخدمات — Data-driven بالكامل من طبقة البيانات.
 * لا ترتيب تفضيلي ولا تقييم ولا لغة توصية.
 */
export function ServiceDirectory({
  intro,
  services,
  emptyTitle,
  emptyBody,
}: {
  intro: string;
  services: Service[];
  emptyTitle: string;
  emptyBody: string;
}) {
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState("all");
  const [domain, setDomain] = useState("all");
  const [access, setAccess] = useState("all");

  const items = useMemo(() => withProviders(services), [services]);
  const emirates = useMemo(() => listEmirates(services), [services]);
  const domains = useMemo(() => listDomains(services), [services]);
  const accessMethods = useMemo(() => listAccessMethods(services), [services]);

  const results = useMemo(
    () => filterServices(items, { query, emirate, domain, accessMethod: access }),
    [items, query, emirate, domain, access],
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
            placeholder="ابحث باسم الجهة أو الخدمة"
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
              {emirates.map((e) => (
                <SelectItem key={e} value={e}>
                  {label(EMIRATE_LABELS, e)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="min-h-11 text-right" aria-label="مجال الخدمة">
              <SelectValue placeholder="مجال الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل المجالات</SelectItem>
              {domains.map((d) => (
                <SelectItem key={d} value={d}>
                  {label(DOMAIN_LABELS, d)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={access} onValueChange={setAccess}>
            <SelectTrigger className="min-h-11 text-right" aria-label="طريقة الوصول">
              <SelectValue placeholder="طريقة الوصول" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل طرق الوصول</SelectItem>
              {accessMethods.map((a) => (
                <SelectItem key={a} value={a}>
                  {label(ACCESS_LABELS, a)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex min-h-11 items-center justify-center rounded-md border border-border/60 bg-secondary/40 px-3 text-xs font-semibold text-muted-foreground">
            {results.length} خدمة معروضة
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-bold text-foreground">مجالات الخدمة</h2>
        <div className="flex flex-wrap gap-2">
          {domains.map((d) => {
            const active = domain === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDomain(active ? "all" : d)}
                className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {label(DOMAIN_LABELS, d)}
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
          {results.map((item) => (
            <li key={item.service.id}>
              <ServiceCardItem item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ServiceCardItem({ item }: { item: ServiceWithProvider }) {
  const { service, provider } = item;
  const pending = service.serviceCompleteness !== "COMPLETE";

  return (
    <article className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <h3 className="min-w-0 text-base font-bold leading-snug text-foreground">
          {service.nameAr}
        </h3>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
          {label(DOMAIN_LABELS, service.serviceDomain)}
        </span>
      </div>

      {provider && (
        <p className="mt-1.5 text-sm font-semibold text-foreground">
          {provider.nameAr}
          <span className="ms-2 text-xs font-normal text-muted-foreground">
            {label(PROVIDER_TYPE_LABELS, provider.providerType)}
          </span>
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-muted-foreground">
        {provider?.emirate && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {label(EMIRATE_LABELS, provider.emirate)}
          </span>
        )}
        <span>{label(SCOPE_LABELS, service.serviceScope)}</span>
        <span>{label(ACCESS_LABELS, service.accessMethod)}</span>
        {service.targetAge && <span>الفئة العمرية: {service.targetAge}</span>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            pending
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {pending ? <Clock className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
          {label(COMPLETENESS_LABELS, service.serviceCompleteness)}
        </span>
        {service.lastVerified && (
          <span className="text-[11px] text-muted-foreground">
            آخر تحقق: {service.lastVerified}
          </span>
        )}
      </div>

      {provider?.website && (
        <div className="mt-3">
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold text-foreground hover:border-primary/50"
          >
            <Globe className="h-4 w-4" />
            الموقع الرسمي للجهة
          </a>
        </div>
      )}
    </article>
  );
}
