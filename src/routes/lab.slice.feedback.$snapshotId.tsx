import { useState } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useSlice, useSliceHelpers } from "@/lab/slice/state";
import type { SliceLifecycleChoice, SliceTone } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/feedback/$snapshotId")({
  component: SliceFeedback,
  head: labHead("كيف كانت اليوم؟", "انطباع سريع، ثم ما الخطوة القادمة."),
});

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
  { id: "repeat", label: "نكررها كما هي", hint: "نفس البطاقة في المرة القادمة." },
  { id: "adjust", label: "نعدّل الاختيار", hint: "نرجع إلى مساحة العمل ونغيّر الأجزاء." },
  { id: "expand", label: "نوسّعها", hint: "نضيف جزءاً آخر من الحدث نفسه." },
  { id: "make_routine", label: "صارت جزءاً من روتيننا", hint: "لم تعد تحتاج ترتيباً كل مرة." },
  { id: "not_now", label: "نتركها الآن", hint: "نعود إليها في وقت آخر." },
];

function SliceFeedback() {
  const { snapshotId } = useParams({ from: "/lab/slice/feedback/$snapshotId" });
  const { snapshotById } = useSliceHelpers();
  const { dispatch } = useSlice();
  const snap = snapshotById(snapshotId);
  const navigate = useNavigate();

  const [tone, setTone] = useState<SliceTone | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [lifecycle, setLifecycle] = useState<SliceLifecycleChoice | null>(null);

  if (!snap) {
    return (
      <LabPage title="لا توجد بطاقة" intro="لم تُعتمد بطاقة بهذا الرقم في هذه الجلسة.">
        <LabLinkButton to="/lab/slice">رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const save = () => {
    if (!tone || !lifecycle) return;
    dispatch({
      type: "feedback",
      value: { snapshotId, date: new Date().toISOString().slice(0, 10), tone, reasons },
    });
    dispatch({ type: "lifecycle", specId: snap.participationSpecId, value: lifecycle });
    if (lifecycle === "adjust" || lifecycle === "expand") {
      navigate({
        to: "/lab/slice/workspace/$specId",
        params: { specId: snap.participationSpecId },
      });
    } else {
      navigate({ to: "/lab/slice/participations" });
    }
  };

  return (
    <LabPage
      title={`كيف كانت ${snap.title_ar} اليوم؟`}
      intro="انطباع الأسرة فقط. لا تقييم ولا درجات ولا نِسَب."
    >
      <LabSection title="انطباع اليوم">
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

      <LabSection title="ماذا بعد؟">
        <ul className="space-y-2">
          {LIFECYCLE.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                aria-pressed={lifecycle === l.id}
                onClick={() => setLifecycle(l.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-start",
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

      <LabButton onClick={save} disabled={!tone || !lifecycle}>
        حفظ وإغلاق اليوم
      </LabButton>
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
        "min-h-[44px] rounded-xl border px-4 text-base font-semibold",
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
      )}
    >
      {label}
    </button>
  );
}
