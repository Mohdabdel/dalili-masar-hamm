import { useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, X, LifeBuoy } from "lucide-react";
import { LabPage, LabNote, labHead } from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { safeText } from "@/lab/data/lexicon";
import { supportToolLabel } from "@/lab/data/fixtures";
import { stepsUpToStop } from "@/lab/state/actions";
import { visualsForOpportunity } from "@/lab/data/visual-read";

export const Route = createFileRoute("/lab/run/$participationId")({
  component: LabRun,
  head: labHead("أثناء المشاركة", "شاشة واحدة لكل خطوة، بلا أي عدّادات أو تقييم."),
});

function LabRun() {
  const { participationId } = Route.useParams();
  const navigate = useNavigate();
  const { dispatch, participationById, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const versions = cardsFor(participationId);
  const card = versions[versions.length - 1];
  const [index, setIndex] = useState(0);
  const [supportOpen, setSupportOpen] = useState(false);

  const visuals = useMemo(
    () => (participation ? visualsForOpportunity(participation.opportunityId) : []),
    [participation],
  );

  if (!participation || !card) {
    return (
      <LabPage title="لا توجد بطاقة للمشاركة">
        <LabNote>اعتمدوا بطاقة أولاً من مساحة الأسرة.</LabNote>
      </LabPage>
    );
  }

  const steps = stepsUpToStop(card.steps, card.stopPointStepIndex);
  const isLast = index === steps.length - 1;

  const next = () => {
    dispatch({ type: "run.step", cardId: card.id, stepIndex: index });
    if (isLast) {
      dispatch({ type: "run.finish", cardId: card.id, participationId });
      void navigate({ to: "/lab/feedback/$participationId", params: { participationId } });
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-2xl flex-col px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {safeText(participation.opportunityName)}
        </span>
        <Link
          to="/lab/card/$participationId"
          params={{ participationId }}
          aria-label="إنهاء المشاركة والعودة للبطاقة"
          className="grid h-11 w-11 place-items-center rounded-xl border border-border"
        >
          <X className="h-5 w-5" aria-hidden />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <p className="mb-3 text-sm font-bold text-primary">الخطوة {index + 1} من {steps.length}</p>
        <h1 className="text-3xl font-bold leading-snug text-foreground sm:text-4xl">
          {safeText(steps[index])}
        </h1>
        {visuals[index] && (
          <img
            src={visuals[index].src}
            alt={visuals[index].title}
            className="mt-6 max-h-64 w-full rounded-2xl border border-border object-contain"
          />
        )}
      </div>

      {supportOpen && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-2 text-base font-bold">ما قد يساعد الآن</h2>
          <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
            {card.supports.length > 0 ? (
              card.supports.map((s) => <li key={s}>• {supportToolLabel(s)}</li>)
            ) : (
              <>
                <li>• يمكن تقصير المشاركة والتوقف هنا.</li>
                <li>• يمكن أن تشاركوا الخطوة معاً هذه المرة.</li>
              </>
            )}
            <li>• التوقف الآن خيار جيد، وليس انسحاباً.</li>
          </ul>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="inline-flex min-h-[52px] items-center gap-1 rounded-xl border border-border px-4 text-base font-bold disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
          السابق
        </button>
        <button
          type="button"
          onClick={next}
          className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-1 rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground"
        >
          {isLast ? "انتهت المشاركة" : "التالي"}
          {!isLast && <ChevronLeft className="h-5 w-5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={() => setSupportOpen((v) => !v)}
          aria-expanded={supportOpen}
          aria-label="دعم إضافي"
          className="grid h-[52px] w-[52px] place-items-center rounded-xl border border-border"
        >
          <LifeBuoy className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
