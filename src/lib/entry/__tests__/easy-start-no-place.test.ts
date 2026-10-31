import { describe, expect, it } from "vitest";
import { easyStartContextText, recommendEasyStartParticipations } from "../easy-start-quiz";

describe("بداية سهلة بلا سؤال داخل/خارج المنزل", () => {
  const base = { interest: "food", routine: "meal", time: "daily", shape: "short" } as const;

  it("الاقتراحات لا تتأثر بقيمة المكان القديمة", () => {
    const ids = (a: object) => recommendEasyStartParticipations(a as never).map((p) => p.id);
    const without = ids(base);
    expect(without.length).toBeGreaterThan(0);
    expect(ids({ ...base, place: "home" })).toEqual(without);
    expect(ids({ ...base, place: "outside" })).toEqual(without);
  });

  it("نص السياق لا يذكر المكان", () => {
    expect(easyStartContextText({ ...base, place: "outside" })).not.toContain("مكان");
  });
});
