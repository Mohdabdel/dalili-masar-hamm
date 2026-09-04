// مواصفة مشاركة تملكها الأسرة — تُبنى عند «البداية السهلة» و«أخطط المشاركة بنفسي».
// هوية المشاركة القانونية تبقى active_participations.id؛ هذه المواصفة مجرد محتوى مسودة.
// لا يُختلق أي معرّف مكتبة (KB-*) ولا نص مرجعي.

import type {
  CandidateFunctionalParticipation,
  FunctionalParticipation,
} from "@/lib/framework/reference-model";
import {
  evaluateFunctionalParticipation,
  type FpValidityResult,
} from "@/lib/framework/fp-validity";
import type {
  LabMajorStep,
  LabParticipationSpec,
  LabThisTimeSelection,
  SliceContext,
} from "@/lab/slice/types";
import type { PreferredContextValue } from "./preferred-context";

const FAMILY_PREFIX = "FAM-";

export function familySpecId(participationId: string): string {
  return `${FAMILY_PREFIX}${participationId}`;
}

export function isFamilySpecId(specId: string): boolean {
  return specId.startsWith(FAMILY_PREFIX);
}

export function participationIdFromFamilySpecId(specId: string): string | null {
  return isFamilySpecId(specId) ? specId.slice(FAMILY_PREFIX.length) : null;
}

/** إجابات الأسرة بلغة يومية — تُترجَم داخلياً إلى حقول عقد الصلاحية. */
export interface FamilyParticipationAnswers {
  title: string;
  lifeContext: string;
  functionalIntent: string;
  observableEffect: string;
  naturalCompletion: string;
  roleMeaning: string;
  mode: "individual" | "shared";
  context: SliceContext;
  steps: string[];
}

export const EMPTY_FAMILY_ANSWERS: FamilyParticipationAnswers = {
  title: "",
  lifeContext: "",
  functionalIntent: "",
  observableEffect: "",
  naturalCompletion: "",
  roleMeaning: "",
  mode: "shared",
  context: "home",
  steps: [],
};

export function toCandidate(
  answers: FamilyParticipationAnswers,
  id = "FAMILY-DRAFT",
): CandidateFunctionalParticipation {
  return {
    id,
    title: answers.title.trim(),
    life_context: answers.lifeContext.trim(),
    functional_intent: answers.functionalIntent.trim(),
    observable_effect: answers.observableEffect.trim(),
    natural_completion: answers.naturalCompletion.trim(),
    standalone_role_meaning: answers.roleMeaning.trim(),
    participation_mode: answers.mode,
    execution_blocks: answers.steps
      .map((t) => t.trim())
      .filter(Boolean)
      .map((text, i) => ({
        kind: "execution_block" as const,
        id: `${id}-B${i + 1}`,
        order: i + 1,
        text,
      })),
  };
}

/** الصلاحية تُفرض دائماً على تعريف الأسرة قبل أي استخدام لاحق (FP-09). */
export function validateFamilyAnswers(
  answers: FamilyParticipationAnswers,
): FpValidityResult {
  return evaluateFunctionalParticipation(toCandidate(answers));
}

/** هل توجد خطوة تنفيذ واحدة على الأقل؟ (شرط تشغيلي للمسودة، ليس بوابة صلاحية) */
export function hasExecutionSteps(answers: FamilyParticipationAnswers): boolean {
  return answers.steps.some((s) => s.trim().length > 0);
}

function stepsToMajor(specId: string, texts: string[]): LabMajorStep[] {
  return texts.map((text, i) => ({
    id: `${specId}-S${i + 1}`,
    order: i + 1,
    instruction_family_ar: text,
    instruction_short_ar: text,
    visual_asset: null,
    substeps: [],
  }));
}

/** مواصفة من صياغة الأسرة وحدها — لا نص مرجعي (provenance = family). */
export function specFromFamilyAnswers(input: {
  participationId: string;
  answers: FamilyParticipationAnswers;
  preferredContext?: PreferredContextValue | null;
}): LabParticipationSpec {
  const id = familySpecId(input.participationId);
  const steps = input.answers.steps.map((s) => s.trim()).filter(Boolean);
  return {
    id,
    eventId: "",
    eventTitle_ar:
      input.preferredContext?.familyText?.trim() ||
      input.preferredContext?.referenceText?.trim() ||
      input.answers.lifeContext.trim(),
    level: "moderate",
    context: input.answers.context,
    title_ar: input.answers.title.trim(),
    majorSteps: stepsToMajor(id, steps),
    provenance: "family",
  };
}

/** مواصفة من مرشح مرجعي متوافق مع الإطار — صياغته الثابتة تُنسخ كنص مصدر. */
export function specFromFrameworkParticipation(input: {
  participationId: string;
  participation: FunctionalParticipation;
  context?: SliceContext;
  preferredContextText?: string;
}): LabParticipationSpec {
  const id = familySpecId(input.participationId);
  const blocks = [...input.participation.execution_blocks].sort(
    (a, b) => a.order - b.order,
  );
  return {
    id,
    eventId: input.participation.event_id ?? "",
    eventTitle_ar:
      input.preferredContextText?.trim() || input.participation.life_context,
    level: input.participation.complexity.level,
    context: input.context ?? "home",
    title_ar: input.participation.title,
    majorSteps: stepsToMajor(id, blocks.map((b) => b.text)),
    provenance: "framework_reference",
  };
}

/** مسودة أولية للمواصفة المملوكة للأسرة — نفس شكل مسودة المرجع. */
export function draftSelectionForFamilySpec(input: {
  spec: LabParticipationSpec;
  preferredContext?: PreferredContextValue | null;
  origin: "easy_beginning" | "family_free";
}): LabThisTimeSelection {
  const { spec } = input;
  return {
    specId: spec.id,
    selected: spec.majorSteps.map((s, i) => ({ stepId: s.id, order: i + 1 })),
    chosenExecutionOptionByStepId: {},
    supportTools: [],
    familyTextByStepId: {},
    visualByStepId: {},
    presentationByStepId: {},
    blockOrderByStepId: {},
    drafted: true,
    familySpec: spec,
    origin: input.origin,
    ...(input.preferredContext
      ? {
          preferredContext: {
            id: input.preferredContext.id,
            source: input.preferredContext.source,
            ...(input.preferredContext.referenceText
              ? { referenceText: input.preferredContext.referenceText }
              : {}),
            ...(input.preferredContext.familyText
              ? { familyText: input.preferredContext.familyText }
              : {}),
          },
        }
      : {}),
  };
}
