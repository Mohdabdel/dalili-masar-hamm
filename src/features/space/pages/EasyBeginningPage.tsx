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
  LabLinkButton,
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
  const goWorkspace = (specId: string) =>
    navigate({ to: `${base}/workspace/$specId`, params: { specId } });

  if (writingOwn) {
    return (
      <LabPage title="لنجعل البداية سهلة" intro="اكتبوا مشاركة من موقف حقيقي في حياتكم.">
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
        <div className="mt-6">
          <LabButton variant="ghost" onClick={() => setWritingOwn(false)}>
            العودة إلى الأسئلة
          </LabButton>
        </div>
      </LabPage>
    );
  }

  if (step < QUESTIONS.length) {
    const question = QUESTIONS[step];
    return (
      <LabPage title="لنجعل البداية سهلة" intro="بضع أسئلة عن الاهتمامات ومواقف حياة الأسرة.">
        <div className="mb-4 text-sm text-muted-foreground">
          السؤال {step + 1} من {QUESTIONS.length}
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
        <div className="flex flex-wrap gap-3">
          {step > 0 && (
            <LabButton variant="ghost" onClick={() => setStep((current) => current - 1)}>
              السابق
            </LabButton>
          )}
          <LabLinkButton to="/" variant="ghost">
            رجوع
          </LabLinkButton>
        </div>
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

  return (
    <LabPage title="لنجعل البداية سهلة" intro="مشاركات يمكن أن تكون نقطة بداية لأسرتكم.">
      <p className="-mt-2 mb-5 text-xs font-light text-muted-foreground">
        المسار فعّال، وترشيحات المشاركات قيد التطوير.
      </p>
      <LabSection title="اقتراحات البداية">
        <LabGrid>
          {candidates.map((candidate) => (
            <LabChoiceCard
              key={candidate.id}
              title={candidate.title}
              hint={candidate.life_context}
              meta={`${candidate.execution_blocks.length} خطوات`}
              onClick={async () => {
                try {
                  const specId = await createFrameworkCandidateParticipation({
                    participation: candidate,
                    preferredContext,
                    dispatch,
                  });
                  goWorkspace(specId);
                } catch {
                  setError("لم نستطع بدء المشاركة الآن. جرّبوا مرة أخرى.");
                }
              }}
            />
          ))}
        </LabGrid>
        {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      </LabSection>
      <LabNote>يمكنكم اختيار اقتراح، أو تعديل الإجابات، أو كتابة مشاركة من حياتكم.</LabNote>
      <div className="flex flex-wrap gap-3">
        <LabButton variant="ghost" onClick={() => setStep(0)}>
          تعديل الإجابات
        </LabButton>
        <LabButton variant="ghost" onClick={() => setWritingOwn(true)}>
          نكتب مشاركتنا بأنفسنا
        </LabButton>
      </div>
    </LabPage>
  );
}
