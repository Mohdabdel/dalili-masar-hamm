import { describe, expect, it, vi } from "vitest";

const created = vi.fn(async () => ({ id: "00000000-0000-0000-0000-000000000001" }));
vi.mock("@/lib/family-participation", () => ({ createFamilyParticipation: created }));

import { createBlankFamilyParticipation } from "@/features/space/entry-create";

describe("خططوها بأنفسكم: لا مسودة قبل الاسم وخطوة", () => {
  it("يرفض الإنشاء بلا اسم", async () => {
    await expect(createBlankFamilyParticipation({ dispatch: vi.fn(), title: " ", firstStep: "يحضر الدلو" })).rejects.toThrow();
    expect(created).not.toHaveBeenCalled();
  });
  it("يرفض الإنشاء بلا خطوة", async () => {
    await expect(createBlankFamilyParticipation({ dispatch: vi.fn(), title: "غسيل السيارة" })).rejects.toThrow();
    expect(created).not.toHaveBeenCalled();
  });
  it("ينشئ المسودة بالاسم والخطوة الأولى", async () => {
    const dispatch = vi.fn();
    await createBlankFamilyParticipation({ dispatch, title: "غسيل السيارة", firstStep: "يحضر الدلو" });
    const value = dispatch.mock.calls[0][0].value;
    expect(value.familySpec.title_ar).toBe("غسيل السيارة");
    expect(value.selected).toHaveLength(1);
    expect(value.familyBlocks[0].familyText).toBe("يحضر الدلو");
  });
});
