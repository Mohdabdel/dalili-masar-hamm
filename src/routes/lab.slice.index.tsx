import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Home, Trees, Library, X } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabNote,
  labHead,
} from "@/lab/components/lab-ui";
import { defaultStations, getSpaceEvent, type SpaceContext } from "@/lab/data/space/catalog";
import { useSlice } from "@/lab/slice/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/")({
  component: SliceStart,
  head: labHead("محطات الأسرة", "ابدأوا من موقف حقيقي في يومكم داخل البيت أو خارجه."),
});

function SliceStart() {
  const [context, setContext] = useState<SpaceContext>("home");
  const { state, dispatch } = useSlice();

  const defaults = defaultStations(context).filter(
    (e) => !state.removedStations.includes(e.id),
  );
  const added = state.stations
    .map(getSpaceEvent)
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => e.contexts.includes(context))
    .filter((e) => !defaults.some((d) => d.id === e.id));

  const stations = [...defaults, ...added];

  return (
    <LabPage
      title="من أين تبدأ المشاركة اليوم؟"
      intro="اختاروا المكان الذي يحدث فيه الموقف، ثم المحطة التي تناسبكم هذه المرة."
    >
      <LabSection title="أين نحن الآن؟">
        <div role="group" aria-label="مكان المشاركة" className="grid grid-cols-2 gap-3">
          <ContextButton
            on={context === "home"}
            onClick={() => setContext("home")}
            icon={<Home className="h-5 w-5" aria-hidden />}
            label="داخل المنزل"
          />
          <ContextButton
            on={context === "community"}
            onClick={() => setContext("community")}
            icon={<Trees className="h-5 w-5" aria-hidden />}
            label="خارج المنزل"
          />
        </div>
      </LabSection>

      <LabSection
        title="محطاتنا"
        description="محطات متكررة ومستقرة في حياتكم — ولا حاجة لأي جدول أو تقويم."
      >
        {stations.length === 0 ? (
          <LabNote>لا توجد محطات هنا بعد. استكشفوا مكتبة الحياة وأضيفوا ما يناسبكم.</LabNote>
        ) : (
          <LabGrid>
            {stations.map((e) => (
              <div key={e.id} className="relative">
                <LabChoiceCard
                  title={e.title}
                  hint={e.hint}
                  meta={`${e.participationCount} مشاركة ممكنة`}
                  to="/lab/slice/$eventId/level"
                  params={{ eventId: e.id }}
                />
                <button
                  type="button"
                  aria-label={`إزالة ${e.title} من محطاتنا`}
                  onClick={() => dispatch({ type: "station.remove", eventId: e.id })}
                  className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ))}
          </LabGrid>
        )}
      </LabSection>

      <LabSection title="لم تجدوا الحدث؟">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/lab/slice/library"
            className="flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-start font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Library className="h-5 w-5 text-primary" aria-hidden />
            استكشفوا مكتبة الحياة
          </Link>
          <Link
            to="/lab/slice/participations"
            className="flex min-h-[64px] w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start font-bold text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Library className="h-5 w-5 text-muted-foreground" aria-hidden />
            بطاقاتنا المعتمدة
          </Link>
        </div>
      </LabSection>

      <LabNote>
        هذه مساحة تجريبية داخل المختبر، ولا تؤثر على النسخة الحالية من دليلي.
      </LabNote>
    </LabPage>
  );
}

function ContextButton({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
