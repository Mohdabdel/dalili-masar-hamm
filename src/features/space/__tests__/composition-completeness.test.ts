import { describe, expect, it } from "vitest";
import { buildFrozenSnapshot, composeDraft } from "@/features/space/compose";
import { createFamilyBlock, isFamilyBlockId } from "@/features/space/family-blocks";
import type { LabParticipationSpec, LabThisTimeSelection } from "@/lab/slice/types";

const spec: LabParticipationSpec = {
  id: "FAM-test",
  eventId: "EV-1",
  eventTitle_ar: "سياق",
  level: "simple",
  context: "home",
  title_ar: "مشاركة الاختبار",
  provenance: "family",
  majorSteps: [
    {
      id: "S1",
      order: 1,
      instruction_family_ar: "خطوة مرجعية",
      instruction_short_ar: "خطوة مرجعية",
      substeps: [],
    },
  ],
};

function baseSelection(): LabThisTimeSelection {
  return {
    specId: spec.id,
    selected: [{ stepId: "S1", order: 1 }],
    chosenExecutionOptionByStepId: {},
    supportTools: [],
  };
}

describe("family-created execution blocks", () => {
  it("gets a stable id that is neither an index nor a master step id", () => {
    const block = createFamilyBlock("يمسك الوعاء");
    expect(isFamilyBlockId(block.id)).toBe(true);
    expect(block.id).not.toBe("S1");
    expect(block.id).not.toMatch(/^\d+$/);
  });

  it("composes with no fabricated source text and keeps identity across reorder and edit", () => {
    const block = createFamilyBlock("يمسك الوعاء");
    const selection: LabThisTimeSelection = {
      ...baseSelection(),
      familyBlocks: [block],
      selected: [
        { stepId: "S1", order: 1 },
        { stepId: block.id, order: 2 },
      ],
    };
    const rows = composeDraft(spec, selection);
    expect(rows.map((r) => r.stepId)).toEqual(["S1", block.id]);
    const familyRow = rows[1];
    expect(familyRow.familyAuthored).toBe(true);
    expect(familyRow.sourceText).toBe("");
    expect(familyRow.familyText).toBe("يمسك الوعاء");

    const reordered = composeDraft(spec, {
      ...selection,
      selected: [
        { stepId: block.id, order: 1 },
        { stepId: "S1", order: 2 },
      ],
      familyTextByStepId: { [block.id]: "يمسك الوعاء بكلتا يديه" },
    });
    expect(reordered[0].stepId).toBe(block.id);
    expect(reordered[0].familyText).toBe("يمسك الوعاء بكلتا يديه");
  });

  it("does not change authored complexity when blocks are added or removed", () => {
    const blocks = [1, 2, 3, 4, 5].map((n) => createFamilyBlock(`كتلة ${n}`));
    const selection: LabThisTimeSelection = {
      ...baseSelection(),
      familyBlocks: blocks,
      selected: [
        { stepId: "S1", order: 1 },
        ...blocks.map((b, i) => ({ stepId: b.id, order: i + 2 })),
      ],
    };
    const rows = composeDraft(spec, selection);
    expect(rows).toHaveLength(6);
    expect(spec.level).toBe("simple");
    const snapshot = buildFrozenSnapshot({
      spec,
      selection,
      rows,
      version: 1,
      label_ar: "بطاقة",
      date: "2026-09-05",
      supportAssets: [],
    });
    expect(snapshot.level).toBe("simple");
  });

  it("freezes family blocks and the participation image, without inventing source text", () => {
    const block = createFamilyBlock("يمسك الوعاء");
    const selection: LabThisTimeSelection = {
      ...baseSelection(),
      familyBlocks: [block],
      selected: [{ stepId: block.id, order: 1 }],
    };
    const rows = composeDraft(spec, selection);
    const snapshot = buildFrozenSnapshot({
      spec,
      selection,
      rows,
      version: 1,
      label_ar: "بطاقة",
      date: "2026-09-05",
      supportAssets: [],
      participationImage: {
        source: "family_library",
        assetCode: "P1",
        uploadedPath: null,
        src: "/p1.webp",
      },
    });
    const frame = snapshot.frames[0];
    expect(frame.sourceStepId).toBe(block.id);
    expect(frame.sourceText_ar).toBeUndefined();
    expect(frame.familyAuthored).toBe(true);
    expect(snapshot.participationImage?.assetCode).toBe("P1");

    // تعديل المسودة بعد الاعتماد لا يمس النسخة المجمّدة.
    const mutated = { ...selection, familyTextByStepId: { [block.id]: "نص جديد" } };
    composeDraft(spec, mutated);
    expect(snapshot.frames[0].text_short_ar).toBe("يمسك الوعاء");
  });

  it("keeps reference blocks' source text immutable and available for reset", () => {
    const rows = composeDraft(
      { ...spec, provenance: "legacy_master" },
      { ...baseSelection(), familyTextByStepId: { S1: "صياغتنا" } },
    );
    expect(rows[0].sourceText).toBe("خطوة مرجعية");
    expect(rows[0].familyText).toBe("صياغتنا");
    expect(rows[0].familyAuthored).toBe(false);
  });
});
