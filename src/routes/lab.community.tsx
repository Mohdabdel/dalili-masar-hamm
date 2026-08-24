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
import { getCommunityServices, withProviders } from "@/lib/service-directories";
import { safeText } from "@/lab/data/lexicon";

export const Route = createFileRoute("/lab/community")({
  component: LabCommunity,
  head: labHead("خارج البيت", "مشاركة في المحيط المجتمعي، ومسار دعم مساند منفصل عنها."),
});

function LabCommunity() {
  const { dispatch } = useLab();
  const stations = useMemo(() => getStations("community").slice(0, 10), []);
  const services = useMemo(() => withProviders(getCommunityServices()).slice(0, 6), []);

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

        <LabSection
          title="دعم مساند عند الحاجة"
          description="مسار منفصل عن المشاركة اليومية — جهات وخدمات، وليس جزءاً من الروتين."
        >
          {services.length === 0 ? (
            <LabNote>لا توجد خدمات معروضة الآن.</LabNote>
          ) : (
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.service.id} className="rounded-2xl border border-border bg-card p-4">
                  <h3 className="text-base font-bold">{s.service.nameAr}</h3>
                  {s.provider && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.provider.nameAr}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
