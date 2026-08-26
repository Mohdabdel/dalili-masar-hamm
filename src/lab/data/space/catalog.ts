// طبقة قراءة موحّدة داخل Lab: مكتبة الحياة العامة (من CSV) + Fixtures التفصيلية.
// قراءة فقط — لا كتابة على أي مصدر مشترك.

import {
  getAllEvents,
  findEventById,
  getDomainCategory,
  type FlatEvent,
} from "@/lib/knowledge-base";
import { SLICE_SPECS } from "@/lab/data/slice";
import type {
  LabCardFrame,
  LabCardSnapshot,
  LabMajorStep,
  LabParticipationSpec,
  LabSubstep,
  LabThisTimeSelection,
  LabVisualStatus,
  SliceLevel,
  StepBlockOrder,
  StepPresentationMode,
} from "@/lab/slice/types";
import { suggestVisual } from "@/lab/data/space/coverage";

export type SpaceContext = "home" | "community";

export interface SpaceEvent {
  id: string;
  title: string;
  hint: string;
  domainName: string;
  contexts: SpaceContext[];
  participationCount: number;
}

/** ربط Fixtures التفصيلية بأحداث المكتبة الحقيقية. */
const FIXTURE_EVENT_MAP: Record<string, string> = {
  BREAKFAST: "FOOD-001",
  LAUNDRY: "CLO-011",
  SHOPPING: "SHOP-004",
};

/** محطات منزلية مألوفة تُعرض افتراضياً. */
export const DEFAULT_HOME_STATION_IDS = [
  "FOOD-001",
  "FOOD-002",
  "FOOD-003",
  "CLO-004",
  "CLO-011",
  "CLO-012",
  "HOME-052",
  "FOOD-017",
];

/** محطات مألوفة خارج المنزل. */
export const DEFAULT_COMMUNITY_STATION_IDS = [
  "SHOP-004",
  "COMM-002",
  "COMM-019",
  "COMM-054",
  "COMM-040",
  "COMM-001",
  "COMM-003",
  "SHOP-001",
];

function contextsOf(domainId: string): SpaceContext[] {
  const category = getDomainCategory(domainId);
  if (category === "منزلي") return ["home"];
  if (category === "مجتمعي") return ["community"];
  return ["home", "community"];
}

function toSpaceEvent(ctx: FlatEvent): SpaceEvent {
  return {
    id: ctx.event.id,
    title: ctx.event.name,
    hint: ctx.domain.name,
    domainName: ctx.domain.name,
    contexts: contextsOf(ctx.domain.id),
    participationCount: ctx.event.opportunities.length,
  };
}

let cache: SpaceEvent[] | null = null;

/** كل أحداث مكتبة الحياة التي تحتوي مشاركات فعلية. */
export function allSpaceEvents(): SpaceEvent[] {
  if (!cache) {
    cache = getAllEvents()
      .filter((c) => c.event.opportunities.length > 0)
      .map(toSpaceEvent);
  }
  return cache;
}

export function getSpaceEvent(eventId: string): SpaceEvent | null {
  const ctx = findEventById(eventId);
  return ctx ? toSpaceEvent(ctx) : null;
}

export function listLibraryEvents(options: {
  context?: SpaceContext;
  domainName?: string;
  query?: string;
  limit?: number;
}): SpaceEvent[] {
  const q = options.query?.trim();
  let list = allSpaceEvents();
  if (options.context) list = list.filter((e) => e.contexts.includes(options.context!));
  if (options.domainName) list = list.filter((e) => e.domainName === options.domainName);
  if (q) list = list.filter((e) => e.title.includes(q) || e.hint.includes(q));
  return options.limit ? list.slice(0, options.limit) : list;
}

export function libraryDomainNames(context?: SpaceContext): string[] {
  const out: string[] = [];
  for (const e of allSpaceEvents()) {
    if (context && !e.contexts.includes(context)) continue;
    if (!out.includes(e.domainName)) out.push(e.domainName);
  }
  return out;
}

export function defaultStations(context: SpaceContext): SpaceEvent[] {
  const ids = context === "home" ? DEFAULT_HOME_STATION_IDS : DEFAULT_COMMUNITY_STATION_IDS;
  const picked = ids.map(getSpaceEvent).filter((e): e is SpaceEvent => Boolean(e));
  // بعض الأحداث المفضلة قد لا تكون جاهزة في المكتبة بعد؛ نكمل بمحطات مألوفة أخرى من نفس السياق.
  if (picked.length < 8) {
    const seen = new Set(picked.map((e) => e.id));
    for (const e of allSpaceEvents().filter((e) => e.contexts.includes(context))) {
      if (picked.length >= 8) break;
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      picked.push(e);
    }
  }
  return picked;
}

// ---------- المشاركات الوظيفية ----------

function shortText(text: string): string {
  const words = text.replace(/[.،]/g, "").trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

/** تحويل فرصة من المكتبة إلى مسار تنفيذ قابل للعرض داخل Lab. */
function specFromLibrary(ctx: FlatEvent, opportunityId: string): LabParticipationSpec | null {
  const opp = ctx.event.opportunities.find((o) => o.id === opportunityId);
  if (!opp) return null;
  const steps = opp.card?.steps ?? [];
  if (steps.length === 0) return null;
  const majorSteps: LabMajorStep[] = steps.map((text, i) => ({
    id: `${opp.id}-S${i + 1}`,
    order: i + 1,
    instruction_family_ar: text,
    instruction_short_ar: shortText(text),
    visual_asset: null,
    substeps: [],
  }));
  return {
    id: `KB-${opp.id}`,
    eventId: ctx.event.id,
    eventTitle_ar: ctx.event.name,
    level: (opp.participationLevel as SliceLevel) ?? "moderate",
    context: contextsOf(ctx.domain.id)[0],
    title_ar: opp.name,
    majorSteps,
  };
}

function fixtureSpecsForEvent(eventId: string): LabParticipationSpec[] {
  return SLICE_SPECS.filter((s) => FIXTURE_EVENT_MAP[s.eventId] === eventId).map((s) => ({
    ...s,
    eventId,
    eventTitle_ar: getSpaceEvent(eventId)?.title ?? s.eventTitle_ar,
  }));
}

/** كل المشاركات الوظيفية داخل حدث (Fixtures أولاً ثم المكتبة). */
export function participationsForEvent(eventId: string): LabParticipationSpec[] {
  const ctx = findEventById(eventId);
  const fromLibrary = ctx
    ? ctx.event.opportunities
        .map((o) => specFromLibrary(ctx, o.id))
        .filter((s): s is LabParticipationSpec => Boolean(s))
    : [];
  return [...fixtureSpecsForEvent(eventId), ...fromLibrary];
}

export function participationsForLevel(
  eventId: string,
  level: SliceLevel,
): LabParticipationSpec[] {
  return participationsForEvent(eventId).filter((s) => s.level === level);
}

export function levelCounts(eventId: string): Record<SliceLevel, number> {
  const counts: Record<SliceLevel, number> = { simple: 0, moderate: 0, advanced: 0 };
  for (const s of participationsForEvent(eventId)) counts[s.level] += 1;
  return counts;
}

export function getSpaceSpec(specId: string): LabParticipationSpec | null {
  const fixture = SLICE_SPECS.find((s) => s.id === specId);
  if (fixture) {
    const mapped = FIXTURE_EVENT_MAP[fixture.eventId];
    return mapped
      ? {
          ...fixture,
          eventId: mapped,
          eventTitle_ar: getSpaceEvent(mapped)?.title ?? fixture.eventTitle_ar,
        }
      : fixture;
  }
  if (specId.startsWith("KB-")) {
    const oppId = specId.slice(3);
    const eventId = oppId.split("-OP")[0];
    const ctx = findEventById(eventId);
    if (ctx) return specFromLibrary(ctx, oppId);
  }
  return null;
}

/** الخطوات بترتيب العرض: رئيسية ثم تفاصيلها. */
export function flatSteps(spec: LabParticipationSpec): Array<{
  step: LabMajorStep | LabSubstep;
  majorId: string;
  isMajor: boolean;
}> {
  const out: Array<{ step: LabMajorStep | LabSubstep; majorId: string; isMajor: boolean }> = [];
  for (const m of [...spec.majorSteps].sort((a, b) => a.order - b.order)) {
    out.push({ step: m, majorId: m.id, isMajor: true });
    for (const s of [...m.substeps].sort((a, b) => a.order - b.order)) {
      out.push({ step: s, majorId: m.id, isMajor: false });
    }
  }
  return out;
}

export function findSpaceStep(
  spec: LabParticipationSpec,
  stepId: string,
): LabMajorStep | LabSubstep | null {
  return flatSteps(spec).find((e) => e.step.id === stepId)?.step ?? null;
}

/**
 * بطاقة مجمّدة: كل النصوص والصور تُنسخ الآن.
 * تغيّر المصدر لاحقاً لا يغيّر بطاقة معتمدة سابقاً.
 */
export function buildSpaceSnapshot(input: {
  spec: LabParticipationSpec;
  selection: LabThisTimeSelection;
  version: number;
  label_ar: string;
  date: string;
  supportAssetIds?: string[];
}): LabCardSnapshot {
  const { spec, selection, version, label_ar, date } = input;
  const ordered = [...selection.selected].sort((a, b) => a.order - b.order);
  const frames: LabCardFrame[] = [];
  ordered.forEach((sel) => {
    const step = findSpaceStep(spec, sel.stepId);
    if (!step) return;
    const optionId = selection.chosenExecutionOptionByStepId[sel.stepId];
    const option = (step as LabSubstep).executionOptions?.find((o) => o.id === optionId);
    frames.push({
      sourceStepId: step.id,
      order: frames.length + 1,
      text_short_ar: familyTextFor(spec, selection, step.id),
      sourceText_ar: step.instruction_family_ar,
      assetRef: visualFor(spec, selection, step.id),
      executionOptionLabel_ar: option?.label_ar,
      presentation: presentationFor(selection, step.id),
      blockOrder: blockOrderFor(selection, step.id),
    });
  });
  frames.push({
    sourceStepId: "__done__",
    order: frames.length + 1,
    text_short_ar: "انتهينا",
    sourceText_ar: "انتهينا",
    assetRef: null,
    presentation: "text",
    blockOrder: "visual-text",
  });

  return {
    id: `snap-${spec.id}-v${version}-${Date.now()}`,
    participationSpecId: spec.id,
    version,
    createdAt: new Date().toISOString().slice(0, 10),
    title_ar: label_ar || spec.title_ar,
    frames,
    supportTools: [...selection.supportTools],
    eventId: spec.eventId,
    eventTitle_ar: spec.eventTitle_ar,
    participationTitle_ar: spec.title_ar,
    level: spec.level,
    context: spec.context,
    domainName_ar: getSpaceEvent(spec.eventId)?.domainName,
    date,
    startText_ar: frames[0]?.text_short_ar,
    endText_ar: frames.length > 1 ? frames[frames.length - 2]?.text_short_ar : undefined,
    supportAssetIds: input.supportAssetIds ? [...input.supportAssetIds] : [],
  };
}

// ---------- النص المحلي والصورة ----------

/** النص المرجعي من مكتبة الحياة — لا يتغير أبداً بتعديل الأسرة. */
export function sourceTextFor(spec: LabParticipationSpec, stepId: string): string {
  return findSpaceStep(spec, stepId)?.instruction_family_ar ?? "";
}

/** نص الأسرة: المخصص إن وُجد، وإلا النص المختصر من المصدر. */
export function familyTextFor(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
  stepId: string,
): string {
  const custom = selection.familyTextByStepId?.[stepId];
  if (custom && custom.trim()) return custom.trim();
  return findSpaceStep(spec, stepId)?.instruction_short_ar ?? "";
}

/** الصورة المعتمدة للخطوة: اختيار الأسرة، أو أفضل صورة متاحة، أو بلا صورة. */
export function visualFor(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
  stepId: string,
): string | null {
  if (presentationFor(selection, stepId) === "text") return null;
  const chosen = selection.visualByStepId?.[stepId];
  if (chosen) return chosen;
  const step = findSpaceStep(spec, stepId);
  if (!step) return null;
  return suggestVisual(step.instruction_family_ar, step.visual_asset ?? null).src;
}

/** كيف تُعرض الخطوة للمشارك — الافتراضي صورة وجملة. */
export function presentationFor(
  selection: LabThisTimeSelection,
  stepId: string,
): StepPresentationMode {
  const mode = selection.presentationByStepId?.[stepId];
  if (mode) return mode;
  return selection.textOnlyStepIds?.includes(stepId) ? "text" : "both";
}

/** ترتيب الصورة والجملة — الافتراضي الصورة ثم الجملة. */
export function blockOrderFor(
  selection: LabThisTimeSelection,
  stepId: string,
): StepBlockOrder {
  return selection.blockOrderByStepId?.[stepId] ?? "visual-text";
}

export function visualStatusFor(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
  stepId: string,
): LabVisualStatus {
  if (presentationFor(selection, stepId) === "text") return "not_required";
  const step = findSpaceStep(spec, stepId);
  if (!step) return "needed";
  if (selection.visualByStepId?.[stepId]) return "exact";
  return suggestVisual(step.instruction_family_ar, step.visual_asset ?? null).status;
}

/**
 * مسودة تلقائية: الأسرة لا تبدأ من صفحة فارغة.
 * كل الخطوات القابلة للتنفيذ مختارة بالترتيب، بنصها المختصر وأفضل صورة متاحة.
 */
export function buildDraftSelection(spec: LabParticipationSpec): LabThisTimeSelection {
  const leaves = flatSteps(spec).filter(
    (e) => !e.isMajor || spec.majorSteps.find((m) => m.id === e.step.id)?.substeps.length === 0,
  );
  return {
    specId: spec.id,
    selected: leaves.map((l, i) => ({ stepId: l.step.id, order: i + 1 })),
    chosenExecutionOptionByStepId: {},
    supportTools: [],
    familyTextByStepId: {},
    visualByStepId: {},
    textOnlyStepIds: [],
    presentationByStepId: {},
    blockOrderByStepId: {},
    drafted: true,
  };
}

export const spaceLevelLabel: Record<SliceLevel, string> = {
  simple: "بسيط",
  moderate: "متوسط",
  advanced: "متقدم",
};

export const spaceLevelHint: Record<SliceLevel, string> = {
  simple: "مساهمة مباشرة قصيرة بنتيجة واضحة.",
  moderate: "تحتاج تنظيماً أو تسلسلاً أو أكثر من عنصر.",
  advanced: "تحتاج تخطيطاً أو تنسيقاً أو تكييفاً مع الموقف.",
};

export const SPACE_SUPPORT_TOOLS = [
  { id: "visual-schedule", label: "جدول بصري" },
  { id: "now-next", label: "الآن / بعد" },
  { id: "timer", label: "مؤقّت" },
  { id: "choice-board", label: "لوحة اختيارات" },
  { id: "tell-before", label: "أخبره مسبقاً" },
  { id: "picture-list", label: "قائمة مصورة" },
  { id: "builder", label: "أدوات بصرية جاهزة" },
];

/** الدعم الإضافي الأساسي — كل واحد ينتج مخرجًا مستقلاً خارج بطاقة المشارك. */
export const SPACE_SUPPORT_ASSET_TYPES = [
  {
    type: "communication" as const,
    label: "وسيلة تواصل",
    hint: "كيف أطلب أو أختار أو أخبر؟",
  },
  { type: "time" as const, label: "تنظيم زمني", hint: "ما الذي يساعد على فهم الوقت؟" },
  { type: "schedule" as const, label: "جدول مصور", hint: "بأي ترتيب؟" },
];
