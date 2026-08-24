import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { LabPage, LabNote, LabButton, labHead } from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { safeText } from "@/lab/data/lexicon";
import { supportToolLabel } from "@/lab/data/fixtures";
import { stepsUpToStop } from "@/lab/state/actions";
import { visualsForOpportunity } from "@/lab/data/visual-read";

export const Route = createFileRoute("/lab/print/$participationId")({
  component: LabPrint,
  head: labHead("نسخة للطباعة", "ورقة بسيطة يمكن تعليقها في البيت."),
});

function LabPrint() {
  const { participationId } = Route.useParams();
  const { participationById, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const versions = cardsFor(participationId);
  const card = versions[versions.length - 1];

  if (!participation || !card) {
    return (
      <LabPage title="لا توجد نسخة للطباعة">
        <LabNote>اعتمدوا بطاقة أولاً من مساحة الأسرة.</LabNote>
      </LabPage>
    );
  }

  const steps = stepsUpToStop(card.steps, card.stopPointStepIndex);
  const visuals = visualsForOpportunity(participation.opportunityId);

  return (
    <LabPage title="نسخة للطباعة" intro="ورقة واحدة: الخطوات، وما يساعد، ومكان المشاركة في اليوم.">
      <div className="mb-4 print:hidden">
        <LabButton onClick={() => window.print()}>
          <Printer className="h-4 w-4" aria-hidden />
          طباعة
        </LabButton>
      </div>

      <article className="rounded-2xl border-2 border-border bg-card p-6">
        <h2 className="text-2xl font-bold">{safeText(participation.opportunityName)}</h2>
        <p className="mt-1 text-base text-muted-foreground">{participation.eventName}</p>

        <ol className="mt-5 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-4 border-b border-border pb-3 last:border-0">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-foreground/30 text-lg font-bold">
                {i + 1}
              </span>
              {visuals[i] && (
                <img src={visuals[i].src} alt="" className="h-16 w-16 rounded-lg object-cover" />
              )}
              <span className="text-lg leading-relaxed">{safeText(s)}</span>
            </li>
          ))}
        </ol>

        {card.supports.length > 0 && (
          <p className="mt-5 text-base">
            <span className="font-bold">ما يساعد: </span>
            {card.supports.map((s) => supportToolLabel(s)).join(" · ")}
          </p>
        )}
      </article>
    </LabPage>
  );
}
