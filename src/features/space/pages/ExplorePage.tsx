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
} from "@/lab/components/lab-ui";
import { allSpaceEvents, defaultStations, type SpaceContext } from "@/lab/data/space/catalog";
import { useSpaceBase } from "@/features/space/store";
import { cn } from "@/lib/utils";

type Lens = "event" | "station";

export function ExplorePage() {
  const base = useSpaceBase();
  const [lens, setLens] = useState<Lens>("event");
  const [context, setContext] = useState<SpaceContext>("home");

  const events = allSpaceEvents().filter((e) => e.contexts.includes(context) && e.participationCount > 0);
  const stations = defaultStations(context);

  return (
    <LabPage
      title="استكشف المشاركات الممكنة"
      intro="اطّلعوا على ما يحدث في يومكم، ثم اختاروا مشاركة واحدة تريدون العمل عليها."
    >
      <div role="group" aria-label="عدسة الاستكشاف" className="mb-5 grid grid-cols-2 gap-2">
        <Tab on={lens === "event"} onClick={() => setLens("event")}>
          حسب أحداث اليوم
        </Tab>
        <Tab on={lens === "station"} onClick={() => setLens("station")}>
          حسب محطات روتيننا
        </Tab>
      </div>

      <div role="group" aria-label="مكان المشاركة" className="mb-5 grid grid-cols-2 gap-2">
        <Tab on={context === "home"} onClick={() => setContext("home")}>
          داخل المنزل
        </Tab>
        <Tab on={context === "community"} onClick={() => setContext("community")}>
          خارج المنزل
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
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}
