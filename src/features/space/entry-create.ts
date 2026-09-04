// إنشاء مشاركة أسرية من أي مدخل — نفس الكيان ونفس المصير.
// الهوية القانونية = active_participations.id (Foundation 03)؛ ولا مسار خاص لأي مدخل.

import { createFamilyParticipation } from "@/lib/family-participation";
import {
  draftSelectionForFamilySpec,
  specFromFamilyAnswers,
  specFromFrameworkParticipation,
  validateFamilyAnswers,
  type FamilyParticipationAnswers,
} from "@/lib/entry/family-spec";
import type { PreferredContextValue } from "@/lib/entry/preferred-context";
import type { FunctionalParticipation } from "@/lib/framework/reference-model";
import type { SliceAction } from "@/features/space/store";
import type { SliceContext } from "@/lab/slice/types";

/** مشاركة تكتبها الأسرة بنفسها — لا مرجع ولا معرّف مكتبة. */
export async function createFamilyAuthoredParticipation(input: {
  answers: FamilyParticipationAnswers;
  origin: "family_free" | "easy_beginning";
  preferredContext?: PreferredContextValue | null;
  dispatch: (action: SliceAction) => void;
}): Promise<string> {
  const validity = validateFamilyAnswers(input.answers);
  if (!validity.valid) {
    throw new Error(`INVALID_FUNCTIONAL_PARTICIPATION: ${validity.gates.filter((g) => !g.passed).map((g) => g.gate).join(",")}`);
  }
  const participation = await createFamilyParticipation({ origin: input.origin });
  const spec = specFromFamilyAnswers({
    participationId: participation.id,
    answers: input.answers,
    preferredContext: input.preferredContext ?? null,
  });
  const selection = draftSelectionForFamilySpec({
    spec,
    preferredContext: input.preferredContext ?? null,
    origin: input.origin,
  });
  input.dispatch({ type: "selection", value: selection });
  return spec.id;
}

/** مشاركة من مرشح مرجعي متوافق مع الإطار (بداية سهلة) — الصياغة المرجعية تبقى كما هي. */
export async function createFrameworkCandidateParticipation(input: {
  participation: FunctionalParticipation;
  preferredContext: PreferredContextValue;
  context?: SliceContext;
  dispatch: (action: SliceAction) => void;
}): Promise<string> {
  const created = await createFamilyParticipation({ origin: "easy_beginning" });
  const spec = specFromFrameworkParticipation({
    participationId: created.id,
    participation: input.participation,
    context: input.context,
    preferredContextText:
      input.preferredContext.familyText || input.preferredContext.referenceText,
  });
  const selection = draftSelectionForFamilySpec({
    spec,
    preferredContext: input.preferredContext,
    origin: "easy_beginning",
  });
  input.dispatch({ type: "selection", value: selection });
  return spec.id;
}
