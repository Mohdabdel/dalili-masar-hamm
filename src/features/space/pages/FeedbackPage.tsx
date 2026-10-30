import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabLinkButton,
  LabBackLink,
} from "@/lab/components/lab-ui";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import type { SliceLifecycleChoice, SliceTone } from "@/lab/slice/types";
import { cn } from "@/lib/utils";
import type { SliceAction } from "@/features/space/store";
import { persistFeedbackActions, routineFeedbackActions } from "@/features/space/feedback-plan";


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
  const { dispatch, persistDispatch } = useSlice();
  const snap = snapshotById(snapshotId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const [tone, setTone] = useState<SliceTone | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const completed = useRef(new Set<string>());
  const [saveError, setSaveError] = useState("");
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

  const save = async () => {
    if (savingRef.current) return;
    if (lifecycle === "make_routine" && !snap.eventId) {
      setSaveError("هذه المشاركة الخاصة غير مرتبطة بمحطة بعد. اختاروا محطة من مكتبة الحياة أولاً، أو اختاروا «نكررها» للاحتفاظ بها كمشاركة مستقلة.");
      return;
    }
    savingRef.current = true;
    setSaving(true);
    setSaveError("");
    const actions: SliceAction[] = [];
    try {
    // الانطباع اختياري تماماً؛ يُحفظ فقط إن اختارته الأسرة.
    if (tone) {
      actions.push({
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
      actions.push({ type: "card.close", snapshotId });
    } else if (lifecycle === CLOSE_PARTICIPATION) {
      actions.push({ type: "participation.close", specId: snap.participationSpecId });
    } else if (lifecycle === "make_routine") {
      actions.push(...(routineFeedbackActions(snap.participationSpecId, snap.eventId) ?? []));
    } else if (lifecycle) {
      actions.push({ type: "lifecycle", specId: snap.participationSpecId, value: lifecycle });
    }
    await persistFeedbackActions(actions, persistDispatch ?? dispatch, completed.current);
    if (lifecycle === "adjust" || lifecycle === "expand") {
      navigate({
        to: `${base}/workspace/$specId`,
        params: { specId: snap.participationSpecId },
      });
    } else {
      navigate({ to: `${base}/card/$specId`, params: { specId: snap.participationSpecId } });
    }
    } catch {
      setSaveError("لم تكتمل عملية الحفظ. بقيتم هنا لإعادة المحاولة؛ قد تكون بعض الاختيارات السابقة حُفظت.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <LabPage
      title={`كيف كانت ${snap.title_ar} اليوم؟`}
      intro="أغلقنا هذه المرة. ما يلي اختياري بالكامل: انطباع الأسرة فقط، لا تقييم ولا درجات ولا نِسَب."
      back={<LabBackLink to={`${base}/card/$specId`} params={{ specId: snap.participationSpecId }}>البطاقة المعتمدة</LabBackLink>}
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
        <LabButton onClick={save} disabled={saving}>{saving ? "جارٍ الحفظ…" : "حفظ"}</LabButton>
        <LabButton
          variant="ghost"
          disabled={saving}
          onClick={() =>
            navigate({ to: `${base}/card/$specId`, params: { specId: snap.participationSpecId } })
          }
        >
          تخطّي الآن
        </LabButton>
      </div>
      {saveError && <p role="alert" className="mt-3 text-destructive">{saveError}</p>}
      {lifecycle === "make_routine" && !snap.eventId && (
        <div className="mt-3">
          <LabNote>إضافة محطة من المكتبة لا تربط هذه المشاركة الخاصة بها تلقائيًا. يمكنكم إبقاء المشاركة مستقلة الآن؛ الربط المباشر بالمحطة يحتاج استكمالًا لاحقًا.</LabNote>
          <LabLinkButton to={`${base}/library`}>استعراض محطات مكتبة الحياة</LabLinkButton>
        </div>
      )}

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

