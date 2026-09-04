// نموذج تعريف مشاركة تكتبها الأسرة — أسئلة بلغة يومية.
// خلف الكواليس: نفس عقد صلاحية المشاركة الوظيفية، بلا أي مصطلح تقني للأسرة،
// وبلا أي سؤال عن قدرة الشخص أو جاهزيته أو استقلاليته.

import { useMemo, useState } from "react";
import { LabButton, LabNote } from "@/lab/components/lab-ui";
import {
  EMPTY_FAMILY_ANSWERS,
  hasExecutionSteps,
  validateFamilyAnswers,
  type FamilyParticipationAnswers,
} from "@/lib/entry/family-spec";
import { cn } from "@/lib/utils";
import type { SliceContext } from "@/lab/slice/types";

interface FieldSpec {
  key: keyof Pick<
    FamilyParticipationAnswers,
    "title" | "lifeContext" | "functionalIntent" | "observableEffect" | "naturalCompletion" | "roleMeaning"
  >;
  label: string;
  hint: string;
  placeholder: string;
}

const FIELDS: FieldSpec[] = [
  {
    key: "title",
    label: "ما الدور الذي سيشارك به؟",
    hint: "اسم قصير للدور كما تسمّونه في بيتكم.",
    placeholder: "مثال: إحضار الخبز إلى المائدة",
  },
  {
    key: "lifeContext",
    label: "متى يحدث هذا عادةً في يومكم؟",
    hint: "الموقف الحقيقي الذي يقع فيه الدور.",
    placeholder: "مثال: قبل جلوس الأسرة للعشاء",
  },
  {
    key: "functionalIntent",
    label: "لماذا يحتاج هذا الموقف إلى هذا الدور؟",
    hint: "ما الذي لن يكتمل في الموقف لو لم يقم به أحد.",
    placeholder: "مثال: المائدة تحتاج الخبز قبل بدء الأكل",
  },
  {
    key: "observableEffect",
    label: "ما الذي يتغيّر فعلاً عندما يقوم به؟",
    hint: "أثر ملحوظ في المكان أو في الموقف.",
    placeholder: "مثال: يصبح الخبز أمام الجالسين",
  },
  {
    key: "naturalCompletion",
    label: "متى نعرف أن الدور انتهى طبيعياً؟",
    hint: "النهاية الطبيعية للموقف، لا نهاية مفروضة.",
    placeholder: "مثال: يستقر طبق الخبز على المائدة",
  },
  {
    key: "roleMeaning",
    label: "لو ذُكر هذا الدور وحده، ماذا يعني؟",
    hint: "معناه بذاته حتى بلا بقية الحدث.",
    placeholder: "مثال: تجهيز ما يشاركه الجميع على المائدة",
  },
];

export function FamilyParticipationForm({
  submitLabel,
  onSubmit,
  initial,
  intro,
}: {
  submitLabel: string;
  onSubmit: (answers: FamilyParticipationAnswers) => Promise<void> | void;
  initial?: Partial<FamilyParticipationAnswers>;
  intro?: string;
}) {
  const [answers, setAnswers] = useState<FamilyParticipationAnswers>({
    ...EMPTY_FAMILY_ANSWERS,
    ...initial,
  });
  const [stepsText, setStepsText] = useState((initial?.steps ?? []).join("\n"));
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  const merged: FamilyParticipationAnswers = useMemo(
    () => ({
      ...answers,
      steps: stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    }),
    [answers, stepsText],
  );

  const validity = useMemo(() => validateFamilyAnswers(merged), [merged]);
  const stepsOk = hasExecutionSteps(merged);
  const ready = validity.valid && stepsOk;

  const set = (key: keyof FamilyParticipationAnswers, value: string) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const submit = async () => {
    setTouched(true);
    if (!ready || busy) return;
    setBusy(true);
    try {
      await onSubmit(merged);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {intro && <LabNote>{intro}</LabNote>}

      {FIELDS.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-1 block text-base font-bold text-foreground">{f.label}</span>
          <span className="mb-1.5 block text-sm text-muted-foreground">{f.hint}</span>
          <input
            type="text"
            value={answers[f.key]}
            onChange={(e) => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      ))}

      <fieldset className="rounded-2xl border border-border p-3">
        <legend className="px-1 text-base font-bold text-foreground">كيف تكون المشاركة؟</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(
            [
              { id: "shared", label: "مع الأسرة" },
              { id: "individual", label: "بمفرده داخل الموقف" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={answers.mode === m.id}
              onClick={() => set("mode", m.id)}
              className={cn(
                "min-h-11 rounded-xl border text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                answers.mode === m.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-border p-3">
        <legend className="px-1 text-base font-bold text-foreground">أين يحدث؟</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(
            [
              { id: "home", label: "داخل المنزل" },
              { id: "community", label: "خارج المنزل" },
            ] as const
          ).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={answers.context === c.id}
              onClick={() => setAnswers((a) => ({ ...a, context: c.id as SliceContext }))}
              className={cn(
                "min-h-11 rounded-xl border text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                answers.context === c.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-base font-bold text-foreground">
          ما الخطوات التي يمرّ بها الدور؟
        </span>
        <span className="mb-1.5 block text-sm text-muted-foreground">
          خطوة في كل سطر، بلغتكم. يمكنكم تعديلها لاحقاً في مساحة العمل.
        </span>
        <textarea
          value={stepsText}
          onChange={(e) => setStepsText(e.target.value)}
          rows={5}
          placeholder={"يفتح الكيس\nيضع الخبز في الطبق\nيحمل الطبق إلى المائدة"}
          className="w-full rounded-xl border border-border bg-card p-3 text-base leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      {touched && !ready && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3">
          <p className="text-sm font-bold text-foreground">ينقص شيء بسيط قبل أن نكمل:</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-muted-foreground">
            {validity.gates
              .filter((g) => !g.passed)
              .map((g) => (
                <li key={g.gate}>{g.reason ?? g.name}</li>
              ))}
            {!stepsOk && <li>اكتبوا خطوة واحدة على الأقل.</li>}
          </ul>
        </div>
      )}

      <LabButton onClick={submit} disabled={busy}>
        {busy ? "جارٍ التجهيز…" : submitLabel}
      </LabButton>
    </div>
  );
}
