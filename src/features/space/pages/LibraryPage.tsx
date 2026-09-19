import { useMemo, useState } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { Plus, Check, Search } from "lucide-react";
import { LabPage, LabSection, LabNote, LabBackLink } from "@/lab/components/lab-ui";
import {
  listLibraryEvents,
  libraryDomainNames,
  allSpaceEvents,
  defaultStations,
  listMvpLibraryEvents,
  mvpDefaultStations,
  mvpLibraryDomainNames,
  mvpSpaceEvents,
} from "@/lab/data/space/catalog";
import { useSlice, useSpaceBase } from "@/features/space/store";
import { cn } from "@/lib/utils";

export function LibraryPage() {
  const base = useSpaceBase();
  const { state, dispatch } = useSlice();
  const [domain, setDomain] = useState<string>("");
  const [query, setQuery] = useState("");
  const production = base === "/space";

  const domains = useMemo(
    () => (production ? mvpLibraryDomainNames() : libraryDomainNames()),
    [production],
  );
  const events = useMemo(
    () =>
      (production ? listMvpLibraryEvents : listLibraryEvents)({
        domainName: domain || undefined,
        query,
        limit: 60,
      }),
    [domain, production, query],
  );
  const total = useMemo(
    () => (production ? mvpSpaceEvents().length : allSpaceEvents().length),
    [production],
  );

  const isStation = (id: string) =>
    (state.stations.includes(id) ||
      (["home", "community"] as const).some((place) =>
        (production ? mvpDefaultStations(place) : defaultStations(place)).some((e) => e.id === id),
      )) &&
    !state.removedStations.includes(id);

  return (
    <LabPage
      title="مكتبة الحياة"
      intro={`${total} حدثاً متاحاً في هذا النموذج. تصفحوا حسب المجال أو ابحثوا مباشرة.`}
      back={<LabBackLink to={`${base}/explore`}>الاستكشاف</LabBackLink>}
    >
      <LabSection title="تصفية">
        <div className="grid gap-3">
          <label className="relative block">
            <span className="sr-only">ابحثوا عن حدث</span>
            <Search
              className="pointer-events-none absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثال: حديقة، حيوان، شواء، هدية"
              className="min-h-11 w-full rounded-xl border border-border bg-card px-4 pe-10 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <FilterChip on={domain === ""} onClick={() => setDomain("")} label="كل المجالات" />
            {domains.map((d) => (
              <FilterChip key={d} on={domain === d} onClick={() => setDomain(d)} label={d} />
            ))}
          </div>
        </div>
      </LabSection>

      <LabSection title={`نتائج (${events.length})`}>
        {events.length === 0 ? (
          <LabNote>لا توجد أحداث مطابقة. جرّبوا كلمة أخرى أو مجالاً مختلفاً.</LabNote>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => {
              const added = isStation(e.id);
              return (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <Link
                    to={`${base}/$eventId/level`}
                    params={{ eventId: e.id }}
                    className="min-w-0 flex-1 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="block text-lg font-bold leading-snug">{e.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {e.domainName} — {e.participationCount} مشاركة ممكنة
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        added
                          ? { type: "station.remove", eventId: e.id }
                          : { type: "station.add", eventId: e.id },
                      )
                    }
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      added
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-card",
                    )}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden />
                        ضمن محطاتنا
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" aria-hidden />
                        أضف إلى محطاتنا
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </LabSection>

      <LabNote>إضافة محطة لا تعني جدولاً؛ تعني فقط أنها متكررة ومستقرة في حياتكم.</LabNote>
    </LabPage>
  );
}

function FilterChip({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-xl border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
      )}
    >
      {label}
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Link = RouterLink as any;
