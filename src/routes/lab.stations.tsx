import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabStateBoundary,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { getStations, partOfDayLabel, PARTS_OF_DAY } from "@/lab/data/knowledge-read";
import { contextLabel } from "@/lab/state/actions";

export const Route = createFileRoute("/lab/stations")({
  component: LabStations,
  head: labHead("محطات اليوم", "اختيار محطة واحدة من أحداث اليوم المعتادة."),
});

function LabStations() {
  const { state } = useLab();
  const stations = useMemo(() => getStations(state.context), [state.context]);

  return (
    <LabPage
      title="ما الذي يحدث في يومكم؟"
      intro={`محطات ${contextLabel[state.context]} كما هي عادة. اختاروا واحدة فقط الآن.`}
    >
      <LabStateBoundary emptyTitle="لا توجد محطات معروضة">
        {PARTS_OF_DAY.map((part) => {
          const list = stations.filter((s) => s.timeOfDay === part);
          if (list.length === 0) return null;
          return (
            <LabSection key={part} title={partOfDayLabel[part]}>
              <LabGrid>
                {list.map((s) => (
                  <LabChoiceCard
                    key={s.id}
                    title={s.title}
                    hint={s.domainName}
                    to="/lab/event/$eventId"
                    params={{ eventId: s.id }}
                  />
                ))}
              </LabGrid>
            </LabSection>
          );
        })}

        <LabNote>
          لا يلزم أن تكون كل محطة محطة مشاركة. أحياناً يكفي أن يمر الحدث كما هو.
        </LabNote>

        <div className="mt-5">
          <LabLinkButton to="/lab/routine" variant="ghost">
            أو رتّبوا روتينكم كاملاً
          </LabLinkButton>
        </div>
      </LabStateBoundary>
    </LabPage>
  );
}
