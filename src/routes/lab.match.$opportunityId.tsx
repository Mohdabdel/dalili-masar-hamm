import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabButton,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { getMatch, participationLevelLabel } from "@/lab/data/knowledge-read";
import { safeText } from "@/lab/data/lexicon";
import { buildParticipation, participationIdFor } from "@/lab/state/actions";
import { visualsForOpportunity } from "@/lab/data/visual-read";

export const Route = createFileRoute("/lab/match/$opportunityId")({
  component: LabMatch,
  head: labHead("لماذا هذه المشاركة", "شرح مختصر لمكان هذه المشاركة داخل الحدث قبل تجربتها."),
});

function LabMatch() {
  const { opportunityId } = Route.useParams();
  const { state, dispatch } = useLab();
  const navigate = useNavigate();
  const match = useMemo(() => getMatch(opportunityId), [opportunityId]);
  const visuals = useMemo(() => visualsForOpportunity(opportunityId), [opportunityId]);
  const existing = state.participations.find((p) => p.opportunityId === opportunityId);

  if (!match) {
    return (
      <LabPage title="لم نجد هذه المشاركة">
        <LabNote>عودوا إلى محطات اليوم واختاروا موضعاً آخر.</LabNote>
      </LabPage>
    );
  }

  const start = () => {
    const participation = existing ?? buildParticipation(match, state.context, state.path.level);
    dispatch({ type: "participation.upsert", value: participation });
    void navigate({ to: "/lab/workspace/$participationId", params: { participationId: participation.id } });
  };

  return (
    <LabPage title={safeText(match.name)} intro={`${match.eventName} — ${match.domainName}`}>
      <LabStateBoundary>
        <LabSection title="لماذا هذه المشاركة هنا؟">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-base leading-relaxed text-foreground">
              {safeText(match.whyParticipate) ||
                "لأن هذا الحدث يحدث عندكم أصلاً، وفيه موضع صغير يمكن أن يكون له فيه دور حقيقي."}
            </p>
            {match.level && (
              <p className="mt-2 text-sm font-semibold text-primary">
                حجم الدور: {participationLevelLabel[match.level]}
              </p>
            )}
          </div>
        </LabSection>

        <LabSection title="كيف تبدو عادة؟" description="خطوات مبدئية من المستودع — ستضبطونها بأنفسكم في الخطوة التالية.">
          <ol className="space-y-2">
            {match.steps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed">{safeText(s)}</span>
              </li>
            ))}
          </ol>
        </LabSection>

        {visuals.length > 0 && (
          <LabSection title="وسائل بصرية متاحة" description="اختيارية، وتُستخدم عند الحاجة فقط.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {visuals.slice(0, 6).map((v) => (
                <figure key={v.src} className="overflow-hidden rounded-xl border border-border bg-card">
                  <img src={v.src} alt={v.title} loading="lazy" className="h-28 w-full object-cover" />
                  <figcaption className="p-2 text-xs text-muted-foreground">{v.title}</figcaption>
                </figure>
              ))}
            </div>
          </LabSection>
        )}

        <div className="flex flex-wrap gap-3">
          <LabButton onClick={start}>
            <Sparkles className="h-4 w-4" aria-hidden />
            {existing ? "فتح مساحة الأسرة" : "نجرّبها معنا"}
          </LabButton>
          <LabLinkButton to="/lab/event/$eventId" params={{ eventId: match.eventId }} variant="ghost">
            مواضع أخرى في الحدث
          </LabLinkButton>
        </div>

        {existing && (
          <p className="mt-3 text-sm text-muted-foreground">
            هذه المشاركة موجودة عندكم بالفعل ({participationIdFor(opportunityId)}).
          </p>
        )}
      </LabStateBoundary>
    </LabPage>
  );
}
