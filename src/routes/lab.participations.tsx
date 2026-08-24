import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { safeText } from "@/lab/data/lexicon";
import { lifecycleLabel, toneLabel } from "@/lab/state/actions";
import type { LabParticipation } from "@/lab/state/types";

export const Route = createFileRoute("/lab/participations")({
  component: LabParticipations,
  head: labHead("مشاركاتنا", "ما نكرره الآن، وما صار من مشاركاتنا المعتادة."),
});

function LabParticipations() {
  const { state, cardsFor, lastTone } = useLabHelpers();
  const current = state.participations.filter((p) => !p.stableInRoutine && p.lifecycle !== "archive");
  const stable = state.participations.filter((p) => p.stableInRoutine);
  const paused = state.participations.filter((p) => p.lifecycle === "archive");

  const Row = ({ p }: { p: LabParticipation }) => {
    const versions = cardsFor(p.id);
    const card = versions[versions.length - 1];
    const tone = card ? lastTone(card.id) : null;
    return (
      <li className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold">{safeText(p.opportunityName)}</h3>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
            {lifecycleLabel[p.lifecycle] ?? p.lifecycle}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{p.eventName}</p>
        <p className="mt-2 text-sm">
          {p.timesShared === 0
            ? "لم تبدأ بعد"
            : p.timesShared === 1
              ? "شاركنا فيها مرة"
              : `شاركنا فيها ${p.timesShared} مرات`}
          {tone && <span className="text-muted-foreground"> · آخر مرة: {toneLabel[tone]}</span>}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
          {card ? (
            <>
              <Link to="/lab/card/$participationId" params={{ participationId: p.id }} className="text-primary">
                البطاقة
              </Link>
              <Link to="/lab/run/$participationId" params={{ participationId: p.id }} className="text-primary">
                نبدأ الآن
              </Link>
            </>
          ) : (
            <Link to="/lab/workspace/$participationId" params={{ participationId: p.id }} className="text-primary">
              أكملوا الإعداد
            </Link>
          )}
          <Link to="/lab/workspace/$participationId" params={{ participationId: p.id }} className="text-muted-foreground">
            مساحة الأسرة
          </Link>
        </div>
      </li>
    );
  };

  const empty = state.participations.length === 0;

  return (
    <LabPage title="مشاركاتنا" intro="ليست قائمة مهام. هي ما وجد له مكاناً داخل يومكم.">
      <LabStateBoundary
        emptyTitle="لا توجد مشاركات بعد"
        emptyHint="ابدأوا من محطة واحدة في روتينكم."
      >
        {empty ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center">
            <p className="text-base text-muted-foreground">لم تبدأ أي مشاركة بعد.</p>
            <div className="mt-4">
              <LabLinkButton to="/lab/start">ابدأ من روتينكم</LabLinkButton>
            </div>
          </div>
        ) : (
          <>
            <LabSection title="نكررها الآن">
              {current.length === 0 ? (
                <LabNote>لا شيء قيد التكرار حالياً.</LabNote>
              ) : (
                <ul className="space-y-3">
                  {current.map((p) => (
                    <Row key={p.id} p={p} />
                  ))}
                </ul>
              )}
            </LabSection>

            <LabSection title="من مشاركاتنا المعتادة" description="صارت جزءاً من اليوم بلا تفكير كثير.">
              {stable.length === 0 ? (
                <LabNote>لا شيء هنا بعد، وهذا طبيعي تماماً.</LabNote>
              ) : (
                <ul className="space-y-3">
                  {stable.map((p) => (
                    <Row key={p.id} p={p} />
                  ))}
                </ul>
              )}
            </LabSection>

            {paused.length > 0 && (
              <LabSection title="مؤجلة الآن">
                <ul className="space-y-3">
                  {paused.map((p) => (
                    <Row key={p.id} p={p} />
                  ))}
                </ul>
              </LabSection>
            )}
          </>
        )}
      </LabStateBoundary>
    </LabPage>
  );
}
