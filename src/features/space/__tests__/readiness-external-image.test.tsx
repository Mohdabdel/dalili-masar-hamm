import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { buildStepImagePrompt, EXTERNAL_IMAGE_TOOLS, textOnlySelection } from "../image-generation-guide";
import { ExternalImageGuide } from "../components/ExternalImageGuide";
import { StepComposer } from "../components/StepComposer";
import { buildFrozenSnapshot, composeDraft } from "../compose";
import { StepBlocks } from "@/lab/components/space/FamilyComposer";
import type { LabParticipationSpec, LabThisTimeSelection } from "@/lab/slice/types";

const spec: LabParticipationSpec = {
  id: "FAM-image-test", eventId: "FOOD-001", eventTitle_ar: "إعداد المائدة",
  title_ar: "اختبار الصور", level: "simple", context: "home", provenance: "family",
  majorSteps: [{ id: "S1", order: 1, instruction_family_ar: "نضع الكوب على المائدة", instruction_short_ar: "نضع الكوب على المائدة", substeps: [] }],
};
const selection: LabThisTimeSelection = {
  specId: spec.id, selected: [{ stepId: "S1", order: 1 }], chosenExecutionOptionByStepId: {}, supportTools: [],
  familyTextByStepId: { S1: "عبارة الأسرة المعدلة" },
  imageRefByStepId: { S1: { sourceAssetCode: "", uploadedPath: "family/kept.jpg" } },
  imageVisibleByStepId: { S1: true }, textVisibleByStepId: { S1: false },
};

describe("external generation and intentional text-only choice", () => {
  it("changes the scene while keeping fixed no-caption single-scene guidance", () => {
    const a = buildStepImagePrompt("نضع الكوب");
    const b = buildStepImagePrompt("نرتب الملابس");
    expect(a).toContain("نضع الكوب");
    expect(b).toContain("نرتب الملابس");
    expect(a.replace("نضع الكوب", "")).toBe(b.replace("نرتب الملابس", ""));
    expect(a).toContain("دون كتابة أو تعليق نصي");
    expect(buildStepImagePrompt("   ")).toContain("[اكتبوا الفعل");
  });
  it("opens only generic service URLs with no automatic step transmission", () => {
    const html = renderToStaticMarkup(<ExternalImageGuide stepText={'نضع <كوبًا> "على المائدة"'} />);
    expect(html).toContain("نسخ مواصفة التوليد");
    expect(html).toContain("&lt;كوبًا&gt;");
    expect(html).toContain('rel="noopener noreferrer"');
    for (const tool of EXTERNAL_IMAGE_TOOLS) expect(new URL(tool.href).search).toBe("");
    expect(html).not.toContain("<iframe");
  });
  it("selects text-only atomically without removing the saved image or edited text", () => {
    const next = textOnlySelection(selection, "S1");
    expect(next.imageRefByStepId).toBe(selection.imageRefByStepId);
    expect(next.familyTextByStepId).toBe(selection.familyTextByStepId);
    expect(next.imageVisibleByStepId?.S1).toBe(false);
    expect(next.textVisibleByStepId?.S1).toBe(true);
    expect(selection.imageVisibleByStepId?.S1).toBe(true);
  });
  it("keeps the picture placeholder in the editor and offers intentional text-only", () => {
    const noop = () => {};
    const html = renderToStaticMarkup(<StepComposer rows={[{
      stepId: "S1", sourceText: "", familyText: "نضع الكوب", image: { src: null, compositePending: false, title: null },
      imageVisible: true, textVisible: true,
    }]} onText={noop} onResetText={noop} onToggleImage={noop} onToggleText={noop} onTextOnly={noop} onPickImage={noop} onMove={noop} onRemove={noop} />);
    expect(html).toContain("إضافة صورة مناسبة للخطوة");
    expect(html).toContain("هذا الرمز يظهر في المحرر فقط");
    expect(html).toContain("الاكتفاء بالنص");
  });
  it("freezes text-only without a picture and renders no placeholder in card/print content", () => {
    const next = textOnlySelection(selection, "S1");
    const rows = composeDraft(spec, next);
    const snapshot = buildFrozenSnapshot({ spec, selection: next, rows, version: 1, label_ar: "اختبار", date: "2026-10-30", supportAssets: [] });
    expect(snapshot.frames[0]).toMatchObject({ assetRef: null, imageVisible: false, textVisible: true, presentation: "text", text_short_ar: "عبارة الأسرة المعدلة" });
    const html = renderToStaticMarkup(<StepBlocks item={{ stepId: "S1", familyText: rows[0].familyText, visual: null, presentation: "text", blockOrder: "visual-text" }} />);
    expect(html).toContain("عبارة الأسرة المعدلة");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("بانتظار صورة");
  });
});
