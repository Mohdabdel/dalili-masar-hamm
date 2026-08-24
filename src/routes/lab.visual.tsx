import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { partOfDayLabel, PARTS_OF_DAY } from "@/lab/data/knowledge-read";
import { sampleVisualLibrary, visualsForOpportunity } from "@/lab/data/visual-read";
import { safeText } from "@/lab/data/lexicon";
import { SUPPORT_TOOLS } from "@/lab/data/fixtures";

export const Route = createFileRoute("/lab/visual")({
  component: LabVisual,
  head: labHead("الوسائل البصرية", "جدول بصري مولّد من روتينكم، وتسلسل للمشاركة عند الحاجة."),
});

function LabVisual() {
  const { state } = useLab();
  const library = useMemo(() => sampleVisualLibrary(8), []);
  const first = state.participations[0];
  const sequence = useMemo(
    () => (first ? visualsForOpportunity(first.opportunityId) : []),
    [first],
  );

  return (
    <LabPage
      title="وسائل بصرية من يومكم"
      intro="لا نبني وسيلة من الصفر. نولّدها مما رتبتموه فعلاً، وتُستخدم عند الحاجة فقط."
    >
      <LabStateBoundary emptyTitle="لا توجد وسائل بعد">
        <LabSection title="جدول اليوم البصري" description="مولّد مباشرة من محطات روتينكم.">
          {state.routine.events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-5 text-center">
              <p className="text-sm text-muted-foreground">ابنوا روتينكم أولاً ليظهر الجدول هنا.</p>
              <div className="mt-3">
                <LabLinkButton to="/lab/routine" variant="ghost">
                  فتح روتيننا
                </LabLinkButton>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {PARTS_OF_DAY.map((part) => {
                const list = state.routine.events.filter((e) => e.timeOfDay === part);
                if (list.length === 0) return null;
                return (
                  <div key={part}>
                    <h3 className="mb-2 text-sm font-bold text-muted-foreground">{partOfDayLabel[part]}</h3>
                    <div className="flex flex-wrap gap-2">
                      {list.map((e) => (
                        <div
                          key={e.id}
                          className={`min-w-[120px] rounded-2xl border p-3 text-center text-sm font-bold ${
                            e.isParticipationStation ? "border-primary bg-primary/5" : "border-border bg-card"
                          }`}
                        >
                          {e.label}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </LabSection>

        {first && sequence.length > 0 && (
          <LabSection title={`تسلسل بصري: ${safeText(first.opportunityName)}`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sequence.slice(0, 6).map((v, i) => (
                <figure key={v.src} className="overflow-hidden rounded-xl border border-border bg-card">
                  <img src={v.src} alt={v.title} loading="lazy" className="h-28 w-full object-cover" />
                  <figcaption className="p-2 text-xs">
                    <span className="font-bold">{i + 1}. </span>
                    {v.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </LabSection>
        )}

        <LabSection title="وسائل جاهزة" description="يمكن استخدامها كما هي أو تجاهلها تماماً.">
          <div className="flex flex-wrap gap-2">
            {SUPPORT_TOOLS.map((t) => (
              <span key={t.id} className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
                <span className="font-bold">{t.label}</span>
                <span className="text-muted-foreground"> — {t.hint}</span>
              </span>
            ))}
          </div>
        </LabSection>

        {library.length > 0 && (
          <LabSection title="من مكتبة الصور الحالية">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {library.map((v) => (
                <figure key={v.src} className="overflow-hidden rounded-xl border border-border bg-card">
                  <img src={v.src} alt={v.title} loading="lazy" className="h-24 w-full object-cover" />
                  <figcaption className="p-2 text-[11px] text-muted-foreground">{v.title}</figcaption>
                </figure>
              ))}
            </div>
          </LabSection>
        )}

        <LabNote>الوسيلة البصرية ليست شرطاً للمشاركة. كثير من المشاركات لا تحتاج أي وسيلة.</LabNote>
      </LabStateBoundary>
    </LabPage>
  );
}
