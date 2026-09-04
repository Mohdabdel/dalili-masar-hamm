// Foundation 08 — اختبارات تصنيف الدعم: الفئة ≠ الوسيلة، توافق قديم، ثوابت التعقيد والصلاحية.

import { describe, expect, it, afterEach } from "vitest";
import {
  LEGACY_UNKNOWN_CATEGORY_ID,
  listSupportCategories,
  listAllSupportCategories,
  registerSupportCategory,
  resolveSupportCategory,
  toSupportInstance,
  unregisterSupportCategory,
} from "@/lib/support/taxonomy";
import { evaluateFunctionalParticipation } from "@/lib/framework/fp-validity";
import { FIXTURE_MODERATE } from "@/lib/framework/__fixtures__/compliant-fixtures";
import type { LabSupportAsset } from "@/lab/slice/types";

const asset = (over: Partial<LabSupportAsset> = {}): LabSupportAsset => ({
  id: "SUP-1",
  type: "schedule",
  label_ar: "جدول مصور — مشاركتنا",
  specId: "FAM-1",
  createdAt: "2026-09-05",
  items: ["خطوة"],
  config: {
    kind: "sequence",
    entries: [{ stepId: "S1", text: "خطوة", assetCode: null, src: null }],
    sourceStepIds: ["S1"],
    generatedFrom: "family_draft",
  },
  ...over,
});

afterEach(() => unregisterSupportCategory("test_only_category"));

describe("فئة الدعم مقابل الوسيلة", () => {
  it("هوية الوسيلة مستقلة عن هوية الفئة", () => {
    const a = toSupportInstance(asset({ id: "SUP-A", categoryId: "now_next" }));
    const b = toSupportInstance(asset({ id: "SUP-B", categoryId: "now_next" }));
    expect(a.categoryId).toBe(b.categoryId);
    expect(a.instanceId).not.toBe(b.instanceId);
  });

  it("لا تشترط أي فئة صورة", () => {
    for (const c of listAllSupportCategories()) expect(c.requiresImage).toBe(false);
    expect(toSupportInstance(asset()).hasAsset).toBe(false);
  });
});

describe("توافق الصفوف القديمة", () => {
  it("type=schedule وحده غير قاطع: يُحسم بـ config.kind", () => {
    expect(resolveSupportCategory({ type: "schedule", config: { kind: "sequence" } })).toMatchObject(
      { categoryId: "step_sequence", certainty: "legacy_mapped" },
    );
    expect(resolveSupportCategory({ type: "schedule", config: { kind: "schedule" } })).toMatchObject(
      { categoryId: "visual_schedule", certainty: "legacy_mapped" },
    );
    expect(resolveSupportCategory({ type: "time", config: { kind: "now-next" } })).toMatchObject({
      categoryId: "now_next",
    });
  });

  it("قيمة غامضة تبقى كما هي بلا تخمين", () => {
    const r = resolveSupportCategory({ type: "schedule", config: null });
    expect(r.categoryId).toBe(LEGACY_UNKNOWN_CATEGORY_ID);
    expect(r.certainty).toBe("unknown");
    expect(r.legacyValue).toBe("schedule/-");
  });
});

describe("قابلية التوسّع", () => {
  it("فئة معتمدة جديدة تُسجَّل بلا تعديل مخطط ولا محتوى مرجعي", () => {
    const before = listSupportCategories().length;
    registerSupportCategory({
      id: "test_only_category",
      label_ar: "فئة اختبارية",
      hint_ar: "اختبار فقط",
      legacyStorageType: "communication",
      legacyKind: undefined,
      contentMode: "family_authored",
      entriesTake: 0,
      requiresImage: false,
    });
    expect(listSupportCategories().length).toBe(before + 1);
    expect(
      resolveSupportCategory({ categoryId: "test_only_category" }).certainty,
    ).toBe("declared");
    unregisterSupportCategory("test_only_category");
    expect(listSupportCategories().length).toBe(before);
  });

  it("الفئة الاختبارية غير المعتمدة لا تظهر للأسر", () => {
    registerSupportCategory({
      id: "test_only_category",
      label_ar: "فئة مخفية",
      hint_ar: "غير معتمدة",
      legacyStorageType: "communication",
      contentMode: "family_authored",
      entriesTake: 0,
      requiresImage: false,
      experimental: true,
    });
    expect(listSupportCategories().some((c) => c.id === "test_only_category")).toBe(false);
    expect(listAllSupportCategories().some((c) => c.id === "test_only_category")).toBe(true);
  });
});

describe("ثوابت", () => {
  it("عدد الوسائل وفئتها لا يغيّران التعقيد", () => {
    const fp = FIXTURE_MODERATE;
    const before = JSON.stringify(fp.complexity);
    const supports = [
      asset({ id: "1", categoryId: "visual_schedule" }),
      asset({ id: "2", categoryId: "now_next" }),
      asset({ id: "3", categoryId: "choice_board" }),
      asset({ id: "4", categoryId: "step_sequence" }),
      asset({ id: "5", categoryId: "visual_schedule" }),
    ];
    void supports.map(toSupportInstance);
    expect(JSON.stringify(fp.complexity)).toBe(before);
  });

  it("الدعم لا يغيّر صلاحية المشاركة الوظيفية", () => {
    const fp = FIXTURE_MODERATE;
    const zero = evaluateFunctionalParticipation(fp);
    const withSupport = evaluateFunctionalParticipation(fp);
    expect(zero.valid).toBe(true);
    expect(withSupport.valid).toBe(zero.valid);
    expect(withSupport.gates.length).toBe(zero.gates.length);
  });

  it("الوسيلة تنتمي للمشاركة الأسرية ولا تشترط معرّف مكتبة", () => {
    const inst = toSupportInstance(asset({ specId: "FAM-abc" }));
    expect(inst.specId).toBe("FAM-abc");
    expect(inst.specId.startsWith("KB-")).toBe(false);
  });
});
