import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabLinkButton,
} from "@/lab/components/lab-ui";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import type { SliceLifecycleChoice, SliceTone } from "@/lab/slice/types";
import { cn } from "@/lib/utils";


const TONES: { id: SliceTone; label: string }[] = [
  { id: "comfortable", label: "كانت مريحة" },
  { id: "usual", label: "كالمعتاد" },
  { id: "difficult_today", label: "كانت صعبة اليوم" },
];

const REASONS = [
  "الوقت كان ضيقاً",
  "الخطوات كثيرة",
  "المكان مزدحم",
  "كان يوماً مختلفاً",
  "احتجنا مساندة أكثر",
];

const LIFECYCLE: { id: SliceLifecycleChoice; label: string; hint: string }[] = [
  { id: "repeat", label: "نكررها", hint: "نفس البطاقة في المرة القادمة." },
  { id: "adjust", label: "نغيّر شيئاً", hint: "نرجع إلى مساحة العمل ونغيّر الأجزاء." },
  { id: "expand", label: "نوسّعها", hint: "نضيف جزءاً آخر من الحدث نفسه." },
  { id: "make_routine", label: "نجعلها من محطاتنا", hint: "محطة متكررة ومستقرة في حياتنا." },
  { id: "not_now", label: "ليس الآن", hint: "نعود إليها في وقت آخر." },
  { id: "close_card", label: "نغلق هذه البطاقة", hint: "هذه البطاقة فقط، لا المشاركة كلها." },
];

/** إغلاق المشاركة الأسرية كلها — خيار منفصل عن إغلاق البطاقة. */
const CLOSE_PARTICIPATION = "close_participation" as const;

export function FeedbackPage({
  snapshotId,
  runId,
}: {
  snapshotId: string;
  runId?: string;
}) {
  const base = useSpaceBase();
  const { snapshotById } = useSliceHelpers();
  const { dispatch } = useSlice();
  const snap = snapshotById(snapshotId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const [tone, setTone] = useState<SliceTone | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [lifecycle, setLifecycle] = useState<
    SliceLifecycleChoice | typeof CLOSE_PARTICIPATION | null
  >(null);

  if (!snap) {
    return (
      <LabPage title="لا توجد بطاقة" intro="لم تُعتمد بطاقة بهذا الرقم في هذه الجلسة.">
        <LabLinkButton to={`${base}`}>رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const save = () => {
    // الانطباع اختياري تماماً؛ يُحفظ فقط إن اختارته الأسرة.
    if (tone) {
      dispatch({
        type: "feedback",
        value: {
          snapshotId,
          runId,
          date: new Date().toISOString().slice(0, 10),
          tone,
          reasons,
        },
      });
    }
    if (lifecycle === "close_card") {
      dispatch({ type: "card.close", snapshotId });
    } else if (lifecycle === CLOSE_PARTICIPATION) {
      dispatch({ type: "participation.close", specId: snap.participationSpecId });
    } else if (lifecycle) {
      dispatch({ type: "lifecycle", specId: snap.participationSpecId, value: lifecycle });
    }
    if (lifecycle === "make_routine" && snap.eventId) {
      dispatch({ type: "station.add", eventId: snap.eventId });
    }
    if (lifecycle === "adjust" || lifecycle === "expand") {
      navigate({
        to: `${base}/workspace/$specId`,
        params: { specId: snap.participationSpecId },
      });
    } else {
      navigate({ to: `${base}/card/$specId`, params: { specId: snap.participationSpecId } });
    }
  };

  return (
    <LabPage
      title={`كيف كانت ${snap.title_ar} اليوم؟`}
      intro="أغلقنا هذه المرة. ما يلي اختياري بالكامل: انطباع الأسرة فقط، لا تقييم ولا درجات ولا نِسَب."
    >
      <LabSection title="انطباع اليوم" description="اختياري.">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Chip key={t.id} on={tone === t.id} onClick={() => setTone(t.id)} label={t.label} />
          ))}
        </div>
      </LabSection>

      {tone === "difficult_today" && (
        <LabSection title="ما الذي جعلها صعبة؟" description="اختياري.">
          <div className="flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <Chip
                key={r}
                label={r}
                on={reasons.includes(r)}
                onClick={() =>
                  setReasons((v) => (v.includes(r) ? v.filter((x) => x !== r) : [...v, r]))
                }
              />
            ))}
          </div>
          <div className="mt-3">
            <LabNote>صعوبة اليوم تخص الظرف، لا الشخص.</LabNote>
          </div>
        </LabSection>
      )}

      <LabSection title="ماذا بعد؟" description="اختياري — يمكنكم تخطّيه.">
        <ul className="space-y-2">
          {[
            ...LIFECYCLE,
            {
              id: CLOSE_PARTICIPATION,
              label: "نغلق هذه المشاركة كلها",
              hint: "تُحفظ كل البطاقات والمرات السابقة، ويمكن إعادة فتحها لاحقاً.",
            },
          ].map((l) => (
            <li key={l.id}>
              <button
                type="button"
                aria-pressed={lifecycle === l.id}
                onClick={() => setLifecycle(l.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  lifecycle === l.id ? "border-primary bg-primary/5" : "border-border bg-card",
                )}
              >
                <span className="block text-lg font-bold">{l.label}</span>
                <span className="block text-sm text-muted-foreground">{l.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </LabSection>

      <div className="flex flex-wrap gap-3">
        <LabButton onClick={save}>حفظ</LabButton>
        <LabButton
          variant="ghost"
          onClick={() =>
            navigate({ to: `${base}/card/$specId`, params: { specId: snap.participationSpecId } })
          }
        >
          تخطّي الآن
        </LabButton>
      </div>

      <div className="mt-4">
        <LabNote>
          إغلاق البطاقة أو المشاركة لا يحذف شيئاً — سجل المرات السابقة يبقى محفوظاً.
        </LabNote>
      </div>
    </LabPage>
  );
}

function Chip({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-xl border px-4 text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
      )}
    >
      {label}
    </button>
  );
}
