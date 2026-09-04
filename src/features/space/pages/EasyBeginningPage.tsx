// بداية سهلة: نبدأ ممّا يحبه الشخص أو يطلبه أو يعود إليه.
// لا سؤال عن القدرة أو الجاهزية أو الاستقلالية أو المستوى، ولا تصنيف لأحد.

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
  REFERENCE_PREFERRED_CONTEXTS,
  type PreferredContextValue,
} from "@/lib/entry/preferred-context";
import { candidatesForPreferredContext } from "@/lib/framework/easy-beginning-corpus";
import {
  createFamilyAuthoredParticipation,
  createFrameworkCandidateParticipation,
} from "@/features/space/entry-create";
import { useSlice, useSpaceBase } from "@/features/space/store";

export function EasyBeginningPage() {
  const base = useSpaceBase();
  const { dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  const [context, setContext] = useState<PreferredContextValue | null>(null);
  const [ownText, setOwnText] = useState("");
  const [refine, setRefine] = useState("");
  const [writingOwn, setWritingOwn] = useState(false);
  const [error, setError] = useState("");

  const goWorkspace = (specId: string) =>
    navigate({ to: `${base}/workspace/$specId`, params: { specId } });

  const candidates = context?.source === "reference" ? candidatesForPreferredContext(context.id) : [];

  if (!context) {
    return (
      <LabPage
        title="بداية سهلة"
        intro="نبدأ من شيء يحبه، أو يطلبه، أو يعود إليه — ثم نصنع له مكاناً معنا فيه."
      >
        <LabSection title="ما الشيء الذي يحبه ويعود إليه؟">
          <LabGrid>
            {REFERENCE_PREFERRED_CONTEXTS.map((c) => (
              <LabChoiceCard
                key={c.id}
                title={c.text}
                hint={c.hint}
                onClick={() =>
                  setContext({ id: c.id, source: "reference", referenceText: c.text })
                }
              />
            ))}
          </LabGrid>
        </LabSection>

        <LabSection title="أو اكتبوا شيئاً من حياتكم">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              شيء يحبه أو يطلبه أو يعود إليه في بيتكم.
            </span>
            <input
              type="text"
              value={ownText}
              onChange={(e) => setOwnText(e.target.value)}
              placeholder="مثال: يحب أن يجلس معنا وقت تحضير الشاي"
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <div className="mt-3">
            <LabButton
              disabled={ownText.trim().length < 3}
              onClick={() => {
                setWritingOwn(true);
                setContext({
                  id: `PCTX-FAMILY-${Date.now()}`,
                  source: "family",
                  familyText: ownText.trim(),
                });
              }}
            >
              نكمل من هنا
            </LabButton>
          </div>
        </LabSection>

        <LabNote>لا نسأل هنا عمّا يستطيعه، بل عمّا يحبه ويشاركنا فيه.</LabNote>
        <div className="mt-6">
          <LabLinkButton to="/" variant="ghost">
            رجوع
          </LabLinkButton>
        </div>
      </LabPage>
    );
  }

  const shownContext = context.familyText || context.referenceText || "";

  if (writingOwn || (context.source === "reference" && candidates.length === 0)) {
    return (
      <LabPage title="بداية سهلة" intro={shownContext}>
        <FamilyParticipationForm
          intro="اكتبوا الدور الذي يمكن أن يشارك به داخل هذا الموقف بالذات."
          submitLabel="نبدأ بهذه المشاركة"
          initial={{ lifeContext: shownContext }}
          onSubmit={async (answers) => {
            try {
              const specId = await createFamilyAuthoredParticipation({
                answers,
                origin: "easy_beginning",
                preferredContext: {
                  ...context,
                  ...(refine.trim() ? { familyText: refine.trim() } : {}),
                },
                dispatch,
              });
              goWorkspace(specId);
            } catch {
              setError("لم نستطع بدء المشاركة الآن. جرّبوا مرة أخرى.");
            }
          }}
        />
        {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <LabButton
            variant="ghost"
            onClick={() => {
              setWritingOwn(false);
              setContext(null);
            }}
          >
            اختيار موقف آخر
          </LabButton>
        </div>
      </LabPage>
    );
  }

  return (
    <LabPage title="بداية سهلة" intro={shownContext}>
      <LabSection
        title="بكلماتكم أنتم (اختياري)"
        description="يبقى نص المقترح كما هو، وتُحفظ صياغتكم بجانبه."
      >
        <input
          type="text"
          value={refine}
          onChange={(e) => setRefine(e.target.value)}
          placeholder="مثال: ليلة الجمعة بعد العشاء"
          className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </LabSection>

      <LabSection
        title="ما الذي يمكن أن يشارك به هنا؟"
        description="اختاروا دوراً واحداً يبدو قريباً من هذا الموقف."
      >
        <LabGrid>
          {candidates.map((c) => (
            <LabChoiceCard
              key={c.id}
              title={c.title}
              hint={c.functional_intent}
              meta={`${c.execution_blocks.length} خطوة`}
              onClick={async () => {
                try {
                  const specId = await createFrameworkCandidateParticipation({
                    participation: c,
                    preferredContext: {
                      ...context,
                      ...(refine.trim() ? { familyText: refine.trim() } : {}),
                    },
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

      <div className="flex flex-wrap gap-3">
        <LabButton variant="ghost" onClick={() => setWritingOwn(true)}>
          نكتب مشاركتنا بأنفسنا
        </LabButton>
        <LabButton variant="ghost" onClick={() => setContext(null)}>
          اختيار موقف آخر
        </LabButton>
      </div>
    </LabPage>
  );
}
