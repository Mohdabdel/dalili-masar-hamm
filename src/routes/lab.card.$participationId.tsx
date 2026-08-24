import { createFileRoute } from "@tanstack/react-router";
import { Play, Printer, User, Check } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabButton,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { safeText } from "@/lab/data/lexicon";
import { supportToolLabel } from "@/lab/data/fixtures";
import { stepsUpToStop } from "@/lab/state/actions";

export const Route = createFileRoute("/lab/card/$participationId")({
  component: LabCardPage,
  head: labHead("بطاقة المشاركة", "معاينة البطاقة واعتمادها قبل بدء المشاركة."),
});

function LabCardPage() {
  const { participationId } = Route.useParams();
  const { dispatch, participationById, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const versions = cardsFor(participationId);
  const card = versions[versions.length - 1];

  if (!participation || !card) {
    return (
      <LabPage title="لا توجد بطاقة بعد">
        <LabNote>اعتمدوا البطاقة من مساحة الأسرة أولاً.</LabNote>
      </LabPage>
    );
  }

  const steps = stepsUpToStop(card.steps, card.stopPointStepIndex);

  return (
    <LabPage
      title={safeText(participation.opportunityName)}
      intro={`${participation.eventName} — النسخة ${card.version}`}
    >
      <LabStateBoundary>
        <LabSection title="ما سيحدث">
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-base leading-relaxed">{safeText(s)}</span>
              </li>
            ))}
          </ol>
          {card.stopPointStepIndex !== undefined && (
            <p className="mt-2 text-sm font-semibold text-primary">
              نهاية المشاركة عند الخطوة {steps.length} — وهذا كافٍ تماماً.
            </p>
          )}
        </LabSection>

        {card.supports.length > 0 && (
          <LabSection title="ما اخترتموه ليساعد">
            <div className="flex flex-wrap gap-2">
              {card.supports.map((s) => (
                <span key={s} className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm">
                  {supportToolLabel(s)}
                </span>
              ))}
            </div>
          </LabSection>
        )}

        <div className="flex flex-wrap gap-3">
          {!card.approvedAt ? (
            <LabButton onClick={() => dispatch({ type: "card.approve", id: card.id })}>
              <Check className="h-4 w-4" aria-hidden />
              نعتمدها
            </LabButton>
          ) : (
            <LabLinkButton to="/lab/run/$participationId" params={{ participationId }}>
              <Play className="h-4 w-4" aria-hidden />
              نبدأ المشاركة
            </LabLinkButton>
          )}
          <LabLinkButton to="/lab/learner/$participationId" params={{ participationId }} variant="ghost">
            <User className="h-4 w-4" aria-hidden />
            نسخة المشارك
          </LabLinkButton>
          <LabLinkButton to="/lab/print/$participationId" params={{ participationId }} variant="ghost">
            <Printer className="h-4 w-4" aria-hidden />
            نسخة للطباعة
          </LabLinkButton>
          <LabLinkButton to="/lab/workspace/$participationId" params={{ participationId }} variant="ghost">
            تعديل في مساحة الأسرة
          </LabLinkButton>
        </div>

        {versions.length > 1 && (
          <LabSection title="النسخ السابقة">
            <ul className="space-y-2">
              {versions.map((v) => (
                <li key={v.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                  النسخة {v.version} — {v.date} · {v.steps.length} خطوة
                  {v.id === card.id && <span className="ms-2 font-bold text-primary">النسخة الحالية</span>}
                </li>
              ))}
            </ul>
            <LabNote>النسخة السابقة تبقى محفوظة دائماً، ويمكن العودة إليها.</LabNote>
          </LabSection>
        )}
      </LabStateBoundary>
    </LabPage>
  );
}
