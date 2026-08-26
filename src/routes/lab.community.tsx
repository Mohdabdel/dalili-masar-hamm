import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabStateBoundary,
  LabNote,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { getStations } from "@/lab/data/knowledge-read";
import { safeText } from "@/lab/data/lexicon";

export const Route = createFileRoute("/lab/community")({
  component: LabCommunity,
  head: labHead("خارج البيت", "مشاركة في المحيط المجتمعي، ومسار دعم مساند منفصل عنها."),
});

function LabCommunity() {
  const { dispatch } = useLab();
  const stations = useMemo(() => getStations("community").slice(0, 10), []);

  return (
    <LabPage
      title="خارج البيت"
      intro="نفس المبدأ: نبدأ من مشوار يحدث عندكم أصلاً، ثم نبحث فيه عن دور صغير."
    >
      <LabStateBoundary emptyTitle="لا توجد مواقف معروضة">
        <LabSection title="مشاوير ومواقف معتادة">
          {stations.length === 0 ? (
            <LabNote>لا توجد أحداث مجتمعية في المستودع الحالي.</LabNote>
          ) : (
            <LabGrid>
              {stations.map((s) => (
                <LabChoiceCard
                  key={s.id}
                  title={safeText(s.title)}
                  hint={s.domainName}
                  to="/lab/event/$eventId"
                  params={{ eventId: s.id }}
                  onClick={() => dispatch({ type: "context", value: "community" })}
                />
              ))}
            </LabGrid>
          )}
        </LabSection>

      </LabStateBoundary>
    </LabPage>
  );
}
