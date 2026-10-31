import { describe, expect, it } from "vitest";
import { latestTimestamp, pickLatestParticipation } from "../latest-participation";

describe("متابعة المشاركة — آخر مشاركة استُخدمت أو عُدّلت", () => {
  it("يختار صاحب أحدث نشاط وليس آخر إدخال", () => {
    const picked = pickLatestParticipation([
      { specId: "A", title: "أ", kind: "card", lastActivity: "2026-10-30T10:00:00Z" },
      { specId: "B", title: "ب", kind: "draft", lastActivity: "2026-10-31T09:00:00Z" },
      { specId: "C", title: "ج", kind: "card", lastActivity: "2026-10-29T10:00:00Z" },
    ]);
    expect(picked?.specId).toBe("B");
  });

  it("عند التعادل تُقدَّم البطاقة المعتمدة على المسودة", () => {
    const t = "2026-10-31T09:00:00Z";
    const picked = pickLatestParticipation([
      { specId: "D", title: "د", kind: "draft", lastActivity: t },
      { specId: "E", title: "هـ", kind: "card", lastActivity: t },
    ]);
    expect(picked?.specId).toBe("E");
  });

  it("لا مرشحين يعني لا متابعة", () => {
    expect(pickLatestParticipation([])).toBeNull();
  });

  it("latestTimestamp يتجاهل القيم الفارغة وغير الصالحة", () => {
    expect(latestTimestamp([null, "x", "2026-01-01T00:00:00Z", "2026-02-01T00:00:00Z"])).toBe("2026-02-01T00:00:00Z");
  });
});
