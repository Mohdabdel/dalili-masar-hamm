// «ساعدني أبدأ»: أسئلة سياقية غير تقييمية تقود إلى بدايات مشاركة مرشحة.
// لا سؤال عن القدرة أو الجاهزية أو الاستقلالية، ولا درجات أو نسب توافق.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabGrid,
  LabChoiceCard,
  LabButton,
  LabBackLink,
} from "@/lab/components/lab-ui";
import { FamilyParticipationForm } from "@/features/space/components/FamilyParticipationForm";
import {
  easyStartContextText,
  recommendEasyStartParticipations,
  type EasyStartAnswers,
} from "@/lib/entry/easy-start-quiz";
import {
  createFamilyAuthoredParticipation,
  createFrameworkCandidateParticipation,
} from "@/features/space/entry-create";
import { useSlice, useSpaceBase } from "@/features/space/store";
import type { FunctionalParticipation } from "@/lib/framework/reference-model";

const QUESTIONS = [
  {
    key: "interest",
    title: "ما المواقف التي تجذب اهتمامه أكثر؟",
    hint: "اختاروا الأقرب إلى اهتماماته الحالية.",
    options: [
      ["food", "الطعام أو المشروبات"],
      ["music", "الموسيقى أو المقاطع"],
      ["water", "الماء والتعبئة والسكب"],
      ["organizing", "ترتيب الأشياء وإعادتها"],
      ["outings", "التسوق والخروج"],
      ["hosting", "الضيوف والاجتماعات الأسرية"],
      ["clothing", "الملابس والعناية بها"],
      ["other", "شيء آخر"],
    ],
  },
  {
    key: "routine",
    title: "أي موقف يتكرر بصورة طبيعية في حياة أسرتكم؟",
    hint: "نبحث عن فرصة موجودة بالفعل، لا عن مهمة جديدة.",
    options: [
      ["meal", "إعداد الطعام أو المائدة"],
      ["home", "ترتيب المنزل"],
      ["laundry", "غسل الملابس أو ترتيبها"],
      ["shopping", "التسوق وتجهيز الخروج"],
      ["gathering", "زيارة أو لقاء عائلي"],
      ["health", "موعد صحي أو إجراء يومي"],
      ["leisure", "وقت الترفيه الأسري"],
      ["other", "موقف آخر"],
    ],
  },
  {
    key: "place",
    title: "أين تفضلون أن تكون البداية؟",
    hint: "اختاروا المكان الأسهل للأسرة في الوقت الحالي.",
    options: [
      ["home", "داخل المنزل"],
      ["outside", "أثناء خروج قصير"],
      ["either", "لا فرق؛ اعرضوا الأنسب"],
    ],
  },
  {
    key: "time",
    title: "متى يسهل على الأسرة إتاحة فرصة المشاركة؟",
    hint: "السؤال عن وقت الأسرة، وليس عن جاهزية الشخص.",
    options: [
      ["daily", "أثناء حدث يومي قائم"],
      ["evening", "في المساء"],
      ["weekend", "في نهاية الأسبوع"],
      ["outing", "أثناء خروج مخطط"],
      ["gathering", "عندما تجتمع الأسرة"],
      ["flexible", "لا وقت محدد"],
    ],
  },
  {
    key: "shape",
    title: "أي شكل من المشاركة تفضلونه للبداية؟",
    hint: "اختاروا شكل الدور، وليس مستوى الشخص.",
    options: [
      ["short", "مساهمة قصيرة وواضحة"],
      ["shared", "دور مشترك مع الأسرة"],
      ["connected", "عدة إجراءات مترابطة"],
      ["unsure", "لا نعرف؛ اقترحوا علينا"],
    ],
  },
] as const;

export function EasyBeginningPage() {
  const base = useSpaceBase();
  const { dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<EasyStartAnswers>>({});
  const [writingOwn, setWritingOwn] = useState(false);
  const [error, setError] = useState("");
  const [openingId, setOpeningId] = useState<string | null>(null);
  const goWorkspace = (specId: string) =>
    navigate({ to: `${base}/workspace/$specId`, params: { specId } });

  if (writingOwn) {
    return (
      <LabPage title="لنجعل البداية سهلة" intro="اكتبوا مشاركة من موقف حقيقي في حياتكم."
        back={<LabButton variant="ghost" onClick={() => setWritingOwn(false)}>العودة إلى الاقتراحات</LabButton>}>
        <FamilyParticipationForm
          submitLabel="نبدأ بهذه المشاركة"
          onSubmit={async (familyAnswers) => {
            try {
              const specId = await createFamilyAuthoredParticipation({
                answers: familyAnswers,
                origin: "easy_beginning",
                dispatch,
              });
              goWorkspace(specId);
            } catch {
              setError("لم نستطع بدء المشاركة الآن. جرّبوا مرة أخرى.");
            }
          }}
        />
        {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      </LabPage>
    );
  }

  if (step < QUESTIONS.length) {
    const question = QUESTIONS[step];
    return (
      <LabPage title="لنجعل البداية سهلة" intro="بضع أسئلة عن الاهتمامات ومواقف حياة الأسرة."
        back={step > 0
          ? <LabButton variant="ghost" onClick={() => setStep((current) => current - 1)}>السؤال السابق</LabButton>
          : <LabBackLink to="/">الصفحة الرئيسية</LabBackLink>}>
        <div className="sticky top-0 z-20 mb-5 rounded-xl border border-border bg-background/95 p-3 backdrop-blur"
          role="progressbar" aria-label="تقدم أسئلة البداية"
          aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={step + 1}>
          <span className="mb-2 block text-sm font-bold">{step + 1} من {QUESTIONS.length}</span>
          <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden>
            <div className="h-full rounded-full bg-primary" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
        <LabSection title={question.title} description={question.hint}>
          <LabGrid>
            {question.options.map(([value, label]) => (
              <LabChoiceCard
                key={value}
                title={label}
                onClick={() => {
                  setAnswers((current) => ({ ...current, [question.key]: value }));
                  setStep((current) => current + 1);
                }}
              />
            ))}
          </LabGrid>
        </LabSection>
      </LabPage>
    );
  }

  const completed = answers as EasyStartAnswers;
  const candidates = recommendEasyStartParticipations(completed);
  const preferredContext = {
    id: `PCTX-QUIZ-${Date.now()}`,
    source: "family" as const,
    familyText: easyStartContextText(completed),
  };
  const openCandidate = async (candidate: FunctionalParticipation) => {
    if (openingId) return;
    setOpeningId(candidate.id);
    try {
      const specId = await createFrameworkCandidateParticipation({
        participation: candidate,
        preferredContext,
        dispatch,
      });
      goWorkspace(specId);
    } catch {
      setError("لم نستطع بدء المشاركة الآن. جرّبوا مرة أخرى.");
      setOpeningId(null);
    }
  };

  return (
    <LabPage title="لنجعل البداية سهلة" intro="مشاركات يمكن أن تكون نقطة بداية لأسرتكم."
      back={<LabButton variant="ghost" onClick={() => setStep(QUESTIONS.length - 1)}>السؤال السابق</LabButton>}>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        رتّبنا الاقتراحات استنادًا إلى إجاباتكم؛ اختاروا ما يناسب واقعكم.
      </p>
      {candidates[0] && (
        <LabSection title="أقرب اقتراح لإجاباتكم">
          <SuggestionCard candidate={candidates[0]} onOpen={() => void openCandidate(candidates[0])} disabled={openingId !== null} />
        </LabSection>
      )}
      {candidates.length > 1 && (
        <LabSection title="اقتراحات أخرى">
          <div className="space-y-3">
            {candidates.slice(1).map((candidate) => (
              <SuggestionCard key={candidate.id} candidate={candidate} onOpen={() => void openCandidate(candidate)} disabled={openingId !== null} />
            ))}
          </div>
        </LabSection>
      )}
      {candidates.length === 0 && <LabNote>لا توجد اقتراحات متاحة حاليًا. يمكنكم إضافة فرصة من حياتكم.</LabNote>}
      {error && <p role="alert" className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-primary">
        <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setStep(0)}>
          تعديل الإجابات
        </button>
        <button type="button" className="min-h-11 underline underline-offset-4" onClick={() => setWritingOwn(true)}>
          إضافة فرصة أخرى
        </button>
      </div>
    </LabPage>
  );
}

function SuggestionCard({ candidate, onOpen, disabled }: {
  candidate: FunctionalParticipation;
  onOpen: () => void;
  disabled: boolean;
}) {
  return (
    <button type="button" onClick={onOpen} disabled={disabled}
      className="w-full min-w-0 rounded-2xl border border-border bg-card p-4 text-start hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
      <span className="block break-words text-lg font-bold">{candidate.title}</span>
      <span className="mt-2 block break-words text-sm text-muted-foreground">الموقف: {candidate.life_context}</span>
      <span className="mt-1 block text-sm text-muted-foreground">عدد الخطوات: {candidate.execution_blocks.length}</span>
      <span className="mt-3 block font-bold text-primary">عرض الخطوات</span>
    </button>
  );
}
