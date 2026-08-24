import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { LabPage, LabNote, labHead } from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { safeText } from "@/lab/data/lexicon";
import { stepsUpToStop } from "@/lab/state/actions";
import { learnerCardFor, visualsForOpportunity } from "@/lab/data/visual-read";

export const Route = createFileRoute("/lab/learner/$participationId")({
  component: LabLearner,
  head: labHead("نسخة المشارك", "شاشة مبسطة جداً: خطوة واحدة، خط كبير، وتباين عالٍ."),
});

function LabLearner() {
  const { participationId } = Route.useParams();
  const { participationById, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const versions = cardsFor(participationId);
  const card = versions[versions.length - 1];
  const [index, setIndex] = useState(0);

  const learner = useMemo(
    () => (participation ? learnerCardFor(participation.opportunityId) : null),
    [participation],
  );
  const visuals = useMemo(
    () => (participation ? visualsForOpportunity(participation.opportunityId) : []),
    [participation],
  );

  if (!participation || !card) {
    return (
      <LabPage title="لا توجد نسخة مشارك">
        <LabNote>اعتمدوا بطاقة أولاً من مساحة الأسرة.</LabNote>
      </LabPage>
    );
  }

  const steps = stepsUpToStop(card.steps, card.stopPointStepIndex);
  const image = learner?.steps[index]?.image ?? visuals[index]?.src ?? null;
  const imageAlt = learner?.steps[index]?.imageAlt ?? visuals[index]?.title ?? "";

  return (
    <div className="mx-auto flex min-h-[85vh] w-full max-w-2xl flex-col px-5 py-6">
      <div className="mb-4 flex justify-end">
        <Link
          to="/lab/card/$participationId"
          params={{ participationId }}
          aria-label="إغلاق نسخة المشارك"
          className="grid h-12 w-12 place-items-center rounded-xl border-2 border-foreground/20"
        >
          <X className="h-6 w-6" aria-hidden />
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {image && (
          <img src={image} alt={imageAlt} className="mb-6 max-h-72 w-full rounded-3xl object-contain" />
        )}
        <p className="text-4xl font-bold leading-snug text-foreground sm:text-5xl">
          {safeText(steps[index])}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-foreground/25 text-xl font-bold disabled:opacity-40"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
          السابق
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          disabled={index === steps.length - 1}
          className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-bold text-primary-foreground disabled:opacity-40"
        >
          التالي
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}
