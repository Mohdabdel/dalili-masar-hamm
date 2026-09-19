// استكشف المشاركات الممكنة: عدستان للاكتشاف فقط — حدث اليوم، أو محطة الروتين.
// الحدث ليس مشاركة وظيفية، والمحطة ليست مشاركة وظيفية؛ كلاهما طريق إلى اختيار مشاركة صالحة.
// لا حالة إنجاز ولا التزام على محطة الروتين (Foundation 04).

import { useState } from "react";
import {
  LabPage,
  LabSection,
  LabNote,
  LabGrid,
  LabChoiceCard,
  LabLinkButton,
  LabBackLink,
} from "@/lab/components/lab-ui";
import {
  allSpaceEvents,
  defaultStations,
  mvpDefaultStations,
  mvpSpaceEvents,
} from "@/lab/data/space/catalog";
import { useSpaceBase } from "@/features/space/store";
import { cn } from "@/lib/utils";

type Lens = "event" | "station";

export function ExplorePage({ initialLens = "event" }: { initialLens?: Lens }) {
  const base = useSpaceBase();
  const [lens, setLens] = useState<Lens>(initialLens);

  const production = base === "/space";
  const events = (production ? mvpSpaceEvents() : allSpaceEvents()).filter(
    (e) => e.participationCount > 0,
  );
  const stations = [...new Map(
    (["home", "community"] as const)
      .flatMap((place) => production ? mvpDefaultStations(place) : defaultStations(place))
      .map((station) => [station.id, station] as const),
  ).values()];

  return (
    <LabPage
      title="استكشف المشاركات الممكنة"
      intro="اطّلعوا على ما يحدث في يومكم، ثم اختاروا مشاركة واحدة تريدون العمل عليها."
      back={<LabBackLink to="/">الصفحة الرئيسية</LabBackLink>}
    >
      <div role="group" aria-label="عدسة الاستكشاف" className="mb-5 grid grid-cols-2 gap-2">
        <Tab on={lens === "event"} onClick={() => setLens("event")}>
          حسب أحداث اليوم
        </Tab>
        <Tab on={lens === "station"} onClick={() => setLens("station")}>
          حسب محطات روتيننا
        </Tab>
      </div>

      {lens === "event" ? (
        <LabSection
          title={`أحداث اليوم (${events.length})`}
          description="الحدث نفسه ليس مشاركة؛ افتحوه لتروا المشاركات التي يمكن اختيارها بداخله."
        >
          {events.length === 0 ? (
            <LabNote>لا توجد أحداث في هذا المكان الآن.</LabNote>
          ) : (
            <LabGrid>
              {events.map((e) => (
                <LabChoiceCard
                  key={e.id}
                  title={e.title}
                  hint={e.domainName}
                  to={`${base}/$eventId/level`}
                  params={{ eventId: e.id }}
                />
              ))}
            </LabGrid>
          )}
        </LabSection>
      ) : (
        <LabSection
          title={`محطات روتيننا (${stations.length})`}
          description="المحطة وصف لوقت من يومكم، وليست مهمة تُنجَز ولا قائمة تُعلَّم عليها."
        >
          {stations.length === 0 ? (
            <LabNote>لا توجد محطات في هذا المكان الآن.</LabNote>
          ) : (
            <LabGrid>
              {stations.map((s) => (
                <LabChoiceCard
                  key={s.id}
                  title={s.title}
                  hint={s.domainName}
                  to={`${base}/$eventId/level`}
                  params={{ eventId: s.id }}
                />
              ))}
            </LabGrid>
          )}
        </LabSection>
      )}

      <div className="flex flex-wrap gap-3">
        <LabLinkButton to={`${base}/library`} variant="ghost">
          كل المشاركات
        </LabLinkButton>
        <LabLinkButton to="/" variant="ghost">
          رجوع
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

function Tab({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-xl border text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        on
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}
