// سجل موحّد لـFixtures الـVertical Slice داخل Lab + تطبيق Mapping الصور.

import type {
  LabCardFrame,
  LabCardSnapshot,
  LabMajorStep,
  LabParticipationSpec,
  LabSubstep,
  LabThisTimeSelection,
  SliceLevel,
  SlicePhase,
} from "@/lab/slice/types";
import { assetForStep } from "@/lab/data/slice/visual-map";
import { BREAKFAST_SPECS } from "@/lab/data/slice/breakfast";
import { LAUNDRY_SPECS } from "@/lab/data/slice/laundry";
import { SHOPPING_SPECS } from "@/lab/data/slice/shopping";

function withAssets(spec: LabParticipationSpec): LabParticipationSpec {
  return {
    ...spec,
    majorSteps: spec.majorSteps.map((m) => ({
      ...m,
      visual_asset: assetForStep(m.id),
      substeps: m.substeps.map((s) => ({ ...s, visual_asset: assetForStep(s.id) })),
    })),
  };
}

export const SLICE_SPECS: LabParticipationSpec[] = [
  ...BREAKFAST_SPECS,
  ...LAUNDRY_SPECS,
  ...SHOPPING_SPECS,
].map(withAssets);

export interface SliceEvent {
  id: string;
  title_ar: string;
  hint_ar: string;
  context: "home" | "community";
  hasPhases: boolean;
}

export const SLICE_EVENTS: SliceEvent[] = [
  {
    id: "BREAKFAST",
    title_ar: "الإفطار",
    hint_ar: "حدث يومي له مراحل: قبل الإفطار وأثناءه وبعده.",
    context: "home",
    hasPhases: true,
  },
  {
    id: "LAUNDRY",
    title_ar: "الغسيل والملابس",
    hint_ar: "مجالات متتابعة بلا مراحل ثابتة.",
    context: "home",
    hasPhases: false,
  },
  {
    id: "SHOPPING",
    title_ar: "التسوق",
    hint_ar: "يبدأ في البيت ويكمل خارجه.",
    context: "community",
    hasPhases: true,
  },
];

export const levelLabel: Record<SliceLevel, string> = {
  simple: "بسيط",
  moderate: "متوسط",
  advanced: "متقدم",
};

export const levelHint: Record<SliceLevel, string> = {
  simple: "مساحة مشاركة صغيرة داخل هذا الحدث.",
  moderate: "مساحة مشاركة أوسع قليلاً في الحدث نفسه.",
  advanced: "مشاركة تغطي جزءاً أكبر من الحدث.",
};

export const phaseLabelSlice: Record<SlicePhase, string> = {
  before: "قبل الحدث",
  during: "أثناء الحدث",
  after: "بعد الحدث",
};

export function getSliceEvent(eventId: string): SliceEvent | null {
  return SLICE_EVENTS.find((e) => e.id === eventId) ?? null;
}

export function getSpec(specId: string): LabParticipationSpec | null {
  return SLICE_SPECS.find((s) => s.id === specId) ?? null;
}

export function phasesForEvent(eventId: string): SlicePhase[] {
  const out: SlicePhase[] = [];
  for (const s of SLICE_SPECS) {
    if (s.eventId === eventId && s.phase && !out.includes(s.phase)) out.push(s.phase);
  }
  return (["before", "during", "after"] as SlicePhase[]).filter((p) => out.includes(p));
}

export function specsFor(
  eventId: string,
  level: SliceLevel,
  phase?: SlicePhase,
): LabParticipationSpec[] {
  return SLICE_SPECS.filter(
    (s) => s.eventId === eventId && s.level === level && (!phase || s.phase === phase),
  );
}

/** كل الخطوات (رئيسية وفرعية) بترتيب العرض. */
export function flattenSteps(spec: LabParticipationSpec): Array<{
  step: LabMajorStep | LabSubstep;
  major: LabMajorStep;
  isMajor: boolean;
}> {
  const out: Array<{ step: LabMajorStep | LabSubstep; major: LabMajorStep; isMajor: boolean }> = [];
  for (const m of [...spec.majorSteps].sort((a, b) => a.order - b.order)) {
    out.push({ step: m, major: m, isMajor: true });
    for (const s of [...m.substeps].sort((a, b) => a.order - b.order)) {
      out.push({ step: s, major: m, isMajor: false });
    }
  }
  return out;
}

export function findStep(
  spec: LabParticipationSpec,
  stepId: string,
): LabMajorStep | LabSubstep | null {
  return flattenSteps(spec).find((e) => e.step.id === stepId)?.step ?? null;
}

/**
 * يبني Snapshot مجمّداً وقت الاعتماد: النصوص والصور منسوخة، لا مراجع حية.
 * تغيّر الـFixture لاحقاً لا يغيّر بطاقة معتمدة سابقاً.
 */
export function buildSnapshot(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
  version: number,
): LabCardSnapshot {
  const ordered = [...selection.selected].sort((a, b) => a.order - b.order);
  const frames: LabCardFrame[] = [];
  ordered.forEach((sel, i) => {
    const step = findStep(spec, sel.stepId);
    if (!step) return;
    const optionId = selection.chosenExecutionOptionByStepId[sel.stepId];
    const option = (step as LabSubstep).executionOptions?.find((o) => o.id === optionId);
    frames.push({
      sourceStepId: step.id,
      order: i + 1,
      text_short_ar: step.instruction_short_ar,
      assetRef: step.visual_asset ?? null,
      executionOptionLabel_ar: option?.label_ar,
    });
  });
  frames.push({
    sourceStepId: "__done__",
    order: frames.length + 1,
    text_short_ar: "انتهينا",
    assetRef: null,
  });

  return {
    id: `snap-${spec.id}-v${version}-${Date.now()}`,
    participationSpecId: spec.id,
    version,
    createdAt: new Date().toISOString().slice(0, 10),
    title_ar: spec.title_ar,
    frames,
    supportTools: [...selection.supportTools],
  };
}

/** الخطوات التي لم تجد صورة مطابقة — للتقرير داخل Lab. */
export function stepsWithoutAsset(): Array<{ specId: string; stepId: string; text: string }> {
  const out: Array<{ specId: string; stepId: string; text: string }> = [];
  for (const spec of SLICE_SPECS) {
    for (const entry of flattenSteps(spec)) {
      if (!entry.step.visual_asset) {
        out.push({
          specId: spec.id,
          stepId: entry.step.id,
          text: entry.step.instruction_family_ar,
        });
      }
    }
  }
  return out;
}
