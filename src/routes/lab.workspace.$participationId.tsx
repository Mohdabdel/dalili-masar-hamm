import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Flag } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { getMatch } from "@/lab/data/knowledge-read";
import { safeText } from "@/lab/data/lexicon";
import { SUPPORT_TOOLS } from "@/lab/data/fixtures";
import { buildCard } from "@/lab/state/actions";

export const Route = createFileRoute("/lab/workspace/$participationId")({
  component: LabWorkspace,
  head: labHead("مساحة الأسرة", "ضبط الخطوات ونقطة النهاية والدعم قبل إصدار البطاقة."),
});

function LabWorkspace() {
  const { participationId } = Route.useParams();
  const navigate = useNavigate();
  const { dispatch, participationById, setupFor, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const setup = setupFor(participationId);
  const versions = cardsFor(participationId);

  const match = useMemo(
    () => (participation ? getMatch(participation.opportunityId) : null),
    [participation],
  );

  if (!participation || !match) {
    return (
      <LabPage title="لا توجد مشاركة هنا">
        <LabNote>ابدأوا من محطة في روتينكم، ثم اختاروا موضع مشاركة.</LabNote>
      </LabPage>
    );
  }

  const steps = match.steps;

  const togglePrior = (i: number) =>
    dispatch({
      type: "setup",
      participationId,
      value: {
        priorSteps: setup.priorSteps.includes(i)
          ? setup.priorSteps.filter((x) => x !== i)
          : [...setup.priorSteps, i],
      },
    });

  const toggleSupport = (id: string) =>
    dispatch({
      type: "setup",
      participationId,
      value: {
        supports: setup.supports.includes(id)
          ? setup.supports.filter((x) => x !== id)
          : [...setup.supports, id],
      },
    });

  const approve = () => {
    const version = versions.length + 1;
    const card = buildCard(participation, setup, steps, version);
    dispatch({ type: "card.upsert", value: card });
    void navigate({ to: "/lab/card/$participationId", params: { participationId } });
  };

  return (
    <LabPage
      title={safeText(participation.opportunityName)}
      intro={`${participation.eventName} — هنا تضبط الأسرة شكل المشاركة قبل أن تبدأ. لا شيء إلزامي.`}
    >
      <LabStateBoundary>
        <LabSection
          title="ما الذي شارك فيه من قبل؟"
          description="اختياري تماماً، وعدم اختيار شيء لا يعني أي حكم."
        >
          <ul className="space-y-2">
            {steps.map((s, i) => {
              const on = setup.priorSteps.includes(i);
              return (
                <li key={i}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => togglePrior(i)}
                    className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border p-3 text-start ${
                      on ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border ${
                        on ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {on && <Check className="h-4 w-4" aria-hidden />}
                    </span>
                    <span className="text-base leading-relaxed">{safeText(s)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </LabSection>

        <LabSection
          title="أين تكون نهاية المشاركة هذه المرة؟"
          description="نقطة نهاية مريحة تجعل المشاركة تنتهي بشكل جيد."
        >
          <div className="space-y-2">
            {steps.map((s, i) => {
              const on = setup.stopPointStepIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={on}
                  onClick={() => dispatch({ type: "setup", participationId, value: { stopPointStepIndex: i } })}
                  className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl border p-3 text-start ${
                    on ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  <Flag
                    className={`h-4 w-4 shrink-0 ${on ? "text-primary" : "text-muted-foreground"}`}
                    aria-hidden
                  />
                  <span className="text-base">نتوقف بعد: {safeText(s)}</span>
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={setup.stopPointStepIndex === undefined}
              onClick={() =>
                dispatch({ type: "setup", participationId, value: { stopPointStepIndex: undefined } })
              }
              className="min-h-[44px] rounded-xl border border-border bg-card px-4 text-sm font-semibold"
            >
              نكملها إلى آخرها
            </button>
          </div>
        </LabSection>

        <LabSection title="ما الذي يساعد؟" description="دعم اختياري وفي سياقه فقط.">
          <div className="flex flex-wrap gap-2">
            {SUPPORT_TOOLS.map((t) => {
              const on = setup.supports.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  title={t.hint}
                  onClick={() => toggleSupport(t.id)}
                  className={`min-h-[44px] rounded-xl border px-4 text-sm font-bold ${
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </LabSection>

        {participation.timesShared >= 2 && (
          <LabNote>
            هذه المشاركة تكررت معكم {participation.timesShared} مرات. إن رأيتم أن الوقت مناسب، يمكنكم
            توسيع الدور من هنا بأنفسكم — ولا شيء يتوسع تلقائياً.
          </LabNote>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <LabButton onClick={approve}>
            {versions.length === 0 ? "نعتمد البطاقة" : "نعتمد نسخة جديدة"}
          </LabButton>
          {versions.length > 0 && (
            <span className="self-center text-sm text-muted-foreground">
              لديكم {versions.length} نسخة محفوظة
            </span>
          )}
        </div>
      </LabStateBoundary>
    </LabPage>
  );
}
