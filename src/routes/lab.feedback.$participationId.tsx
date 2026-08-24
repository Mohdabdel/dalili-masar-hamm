import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabGrid,
  LabChoiceCard,
  labHead,
} from "@/lab/components/lab-ui";
import { useLabHelpers } from "@/lab/state/lab-state";
import { REASON_OPTIONS } from "@/lab/data/fixtures";
import { safeText } from "@/lab/data/lexicon";
import { toneLabel, todayISO } from "@/lab/state/actions";
import type { LabTone } from "@/lab/state/types";

export const Route = createFileRoute("/lab/feedback/$participationId")({
  component: LabFeedback,
  head: labHead("كيف كانت اليوم", "ملاحظة قصيرة عن المشاركة، وليست تقييماً لأحد."),
});

const TONES: LabTone[] = ["comfortable", "usual", "difficult_today"];

function LabFeedback() {
  const { participationId } = Route.useParams();
  const navigate = useNavigate();
  const { dispatch, participationById, cardsFor } = useLabHelpers();
  const participation = participationById(participationId);
  const versions = cardsFor(participationId);
  const card = versions[versions.length - 1];
  const [tone, setTone] = useState<LabTone | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  if (!participation || !card) {
    return (
      <LabPage title="لا توجد مشاركة">
        <LabNote>ابدأوا مشاركة أولاً.</LabNote>
      </LabPage>
    );
  }

  const save = () => {
    if (!tone) return;
    dispatch({ type: "feedback", value: { cardId: card.id, date: todayISO(), tone, reasons } });
    setSaved(true);
  };

  return (
    <LabPage
      title="كيف كانت اليوم؟"
      intro={`${safeText(participation.opportunityName)} — ملاحظة عن اليوم نفسه، لا عن الشخص.`}
    >
      {!saved ? (
        <>
          <LabSection title="اختاروا واحدة">
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tone === t}
                  onClick={() => setTone(t)}
                  className={`min-h-[52px] rounded-2xl border px-5 text-base font-bold ${
                    tone === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                  }`}
                >
                  {toneLabel[t]}
                </button>
              ))}
            </div>
          </LabSection>

          {tone === "difficult_today" && (
            <LabSection title="هل تودّون ذكر السبب؟" description="اختياري بالكامل.">
              <div className="flex flex-wrap gap-2">
                {REASON_OPTIONS.map((r) => {
                  const on = reasons.includes(r);
                  return (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setReasons(on ? reasons.filter((x) => x !== r) : [...reasons, r])
                      }
                      className={`min-h-[44px] rounded-xl border px-4 text-sm ${
                        on ? "border-primary bg-primary/10 font-bold" : "border-border bg-card"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </LabSection>
          )}

          <LabButton onClick={save} disabled={!tone}>
            حفظ الملاحظة
          </LabButton>
        </>
      ) : (
        <LabSection title="ماذا نفعل في المرة القادمة؟" description="كل الخيارات صحيحة، والقرار لكم.">
          <LabGrid>
            <LabChoiceCard
              title="نستمر كما هي"
              hint="لا تغيير؛ نكررها بنفس الشكل"
              onClick={() => {
                dispatch({ type: "participation.lifecycle", id: participationId, value: "continue" });
                void navigate({ to: "/lab/participations" });
              }}
            />
            <LabChoiceCard
              title="نجعلها أسهل"
              hint="نقصّر نقطة النهاية أو نضيف ما يساعد"
              onClick={() => {
                dispatch({ type: "participation.lifecycle", id: participationId, value: "adjust" });
                void navigate({
                  to: "/lab/workspace/$participationId",
                  params: { participationId },
                });
              }}
            />
            <LabChoiceCard
              title="مشاركة أوسع"
              hint="نعود لمساحة الأسرة ونختار التوسعة بأنفسنا"
              onClick={() => {
                dispatch({ type: "participation.lifecycle", id: participationId, value: "expand" });
                void navigate({
                  to: "/lab/workspace/$participationId",
                  params: { participationId },
                });
              }}
            />
            <LabChoiceCard
              title="صارت من روتيننا"
              hint="جزء معتاد من اليوم"
              onClick={() => {
                dispatch({
                  type: "participation.lifecycle",
                  id: participationId,
                  value: "routine",
                  stable: true,
                });
                void navigate({ to: "/lab/participations" });
              }}
            />
            <LabChoiceCard
              title="نؤجلها الآن"
              hint="نتركها ونعود إليها وقتاً آخر"
              onClick={() => {
                dispatch({ type: "participation.lifecycle", id: participationId, value: "archive" });
                void navigate({ to: "/lab/participations" });
              }}
            />
          </LabGrid>
          <LabNote>
            التوسعة لا تحدث تلقائياً؛ لا يقترح النظام الخطوة التالية إلا كخيار تختارونه في مساحة الأسرة.
          </LabNote>
        </LabSection>
      )}
    </LabPage>
  );
}
