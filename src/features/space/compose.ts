// تركيب مسودّة الأسرة — مصدر واحد يستخدمه مساحة العمل والمعاينة والاعتماد.
// ضمان التطابق: ما تراه الأسرة في المعاينة هو نفسه ما يُجمَّد في النسخة المعتمدة.

import {
  findSpaceStep,
  getSpaceEvent,
  sourceTextFor,
} from "@/lab/data/space/catalog";
import {
  refFromLegacySrc,
  resolveStepImage,
  resolvedAssetCode,
  suggestStepImage,
} from "@/features/space/step-image";
import { findFamilyBlock, isFamilyBlockId } from "@/features/space/family-blocks";
import type {
  LabCardFrame,
  LabCardSnapshot,
  LabParticipationSpec,
  LabStepImageRef,
  LabSupportAsset,
  LabThisTimeSelection,
  StepBlockOrder,
} from "@/lab/slice/types";

export interface ComposedRow {
  stepId: string;
  order: number;
  /** النص المرجعي من مكتبة الحياة — لا يتغير أبداً. */
  sourceText: string;
  /** عبارة الأسرة المعتمدة للعرض. */
  familyText: string;
  imageRef: LabStepImageRef | null;
  image: ReturnType<typeof resolveStepImage>;
  assetCode: string | null;
  imageVisible: boolean;
  textVisible: boolean;
  blockOrder: StepBlockOrder;
  /** كتلة أنشأتها الأسرة: لا نص مرجعي لها ولا إجراء «استرجاع العبارة المقترحة». */
  familyAuthored: boolean;
}

/** مرجع صورة الخطوة كما هو في المسودة (مع توافق الحقول القديمة والاقتراح). */
export function imageRefFor(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
  stepId: string,
): LabStepImageRef | null {
  const map = selection.imageRefByStepId;
  if (map && stepId in map) return map[stepId] ?? null;
  const legacy = refFromLegacySrc(selection.visualByStepId?.[stepId]);
  if (legacy) return legacy;
  if (isFamilyBlockId(stepId)) {
    // اقتراح الصورة يُشتق من عبارة الأسرة نفسها — لا من نص مرجعي لأنه غير موجود.
    return suggestStepImage(findFamilyBlock(selection, stepId)?.familyText ?? "");
  }
  return suggestStepImage(sourceTextFor(spec, stepId));
}

export function imageVisibleFor(selection: LabThisTimeSelection, stepId: string): boolean {
  return (
    selection.imageVisibleByStepId?.[stepId] ??
    (selection.presentationByStepId?.[stepId] ?? "both") !== "text"
  );
}

export function textVisibleFor(selection: LabThisTimeSelection, stepId: string): boolean {
  return (
    selection.textVisibleByStepId?.[stepId] ??
    (selection.presentationByStepId?.[stepId] ?? "both") !== "visual"
  );
}

/** التركيب الفعلي الحالي: الخطوات الباقية بترتيبها، بعباراتها وصورها وظهورها. */
export function composeDraft(
  spec: LabParticipationSpec,
  selection: LabThisTimeSelection,
): ComposedRow[] {
  return [...selection.selected]
    .sort((a, b) => a.order - b.order)
    .map((sel, index): ComposedRow | null => {
      const familyBlock = isFamilyBlockId(sel.stepId)
        ? findFamilyBlock(selection, sel.stepId)
        : null;
      const step = familyBlock ? null : findSpaceStep(spec, sel.stepId);
      if (!step && !familyBlock) return null;
      // كتلة الأسرة بلا نص مصدر — لا يُختلق لها نص مرجعي.
      const sourceText = familyBlock ? "" : sourceTextFor(spec, sel.stepId);
      const custom = selection.familyTextByStepId?.[sel.stepId];
      const ref = imageRefFor(spec, selection, sel.stepId);
      return {
        stepId: sel.stepId,
        order: index + 1,
        sourceText,
        familyText: custom !== undefined ? custom : (familyBlock?.familyText ?? sourceText),
        imageRef: ref,
        image: resolveStepImage(ref),
        assetCode: resolvedAssetCode(ref),
        imageVisible: imageVisibleFor(selection, sel.stepId),
        textVisible: textVisibleFor(selection, sel.stepId),
        blockOrder: selection.blockOrderByStepId?.[sel.stepId] ?? "visual-text",
        familyAuthored: Boolean(familyBlock),
      };
    })
    .filter((r): r is ComposedRow => Boolean(r));
}

/**
 * نسخة مجمّدة: نسخة كاملة مكتفية بذاتها من التركيب الذي شاهدته الأسرة واعتمدته.
 * لا تُعدَّل بعد إنشائها، ولا تتأثر بأي تعديل لاحق على المسودة.
 */
export function buildFrozenSnapshot(input: {
  spec: LabParticipationSpec;
  selection: LabThisTimeSelection;
  rows: ComposedRow[];
  version: number;
  label_ar: string;
  date: string;
  supportAssets: LabSupportAsset[];
  /** صورة المشاركة ككل — تُجمَّد كما هي وقت الاعتماد، أو تبقى غائبة. */
  participationImage?: LabCardSnapshot["participationImage"];
}): LabCardSnapshot {
  const { spec, selection, rows, version, label_ar, date, supportAssets } = input;

  const frames: LabCardFrame[] = rows.map((r) => ({
    sourceStepId: r.stepId,
    order: r.order,
    text_short_ar: r.textVisible ? r.familyText : "",
    familyText_ar: r.familyText,
    // كتلة الأسرة: لا نص مرجعي مجمّد (غائب وليس منسوخاً من نص الأسرة).
    ...(r.familyAuthored ? { familyAuthored: true } : { sourceText_ar: r.sourceText }),
    assetRef: r.imageVisible ? r.image.src : null,
    sourceAssetCode: r.imageRef?.sourceAssetCode ?? null,
    derivedAssetCode: r.assetCode,
    imageVisible: r.imageVisible,
    textVisible: r.textVisible,
    presentation: r.imageVisible ? (r.textVisible ? "both" : "visual") : "text",
    blockOrder: r.blockOrder,
  }));

  frames.push({
    sourceStepId: "__done__",
    order: frames.length + 1,
    text_short_ar: "انتهينا",
    sourceText_ar: "انتهينا",
    assetRef: null,
    imageVisible: false,
    textVisible: true,
    presentation: "text",
    blockOrder: "visual-text",
  });

  return {
    id: `snap-${spec.id}-v${version}-${Date.now()}`,
    participationSpecId: spec.id,
    version,
    createdAt: new Date().toISOString().slice(0, 10),
    approvedAt: new Date().toISOString(),
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
    selectedStepIds: rows.map((r) => r.stepId),
    startStepId: rows[0]?.stepId,
    endStepId: rows[rows.length - 1]?.stepId,
    startText_ar: rows[0]?.familyText,
    endText_ar: rows[rows.length - 1]?.familyText,
    considerationIds: [...(selection.considerationIds ?? [])],
    supportAssetIds: supportAssets.map((a) => a.id),
    participationImage: input.participationImage ?? null,
    supportAssetsFrozen: supportAssets.map((a) => ({
      id: a.id,
      type: a.type,
      label_ar: a.label_ar,
      items: [...a.items],
      config: a.config,
    })),
  };
}
