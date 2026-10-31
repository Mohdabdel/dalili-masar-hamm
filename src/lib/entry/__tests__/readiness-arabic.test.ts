import { describe, expect, it } from "vitest";
import { easyStartContextText, type EasyStartAnswers } from "../easy-start-quiz";
import { findEventDomainName } from "@/lib/knowledge-base";
import { mvpSpaceEvents } from "@/lab/data/space/catalog";
describe("Arabic readiness labels", () => {
  const answers: EasyStartAnswers = { interest: "food", routine: "meal", place: "home", time: "daily", shape: "short" };
  it("uses Arabic labels for the tested breakfast journey", () => {
    const text = easyStartContextText(answers);
    expect(text).toContain("الطعام أو المشروبات");
    // سؤال المكان المستقل أُزيل من البداية السهلة؛ السياق يُفهم من الموقف.
    expect(text).not.toContain("داخل المنزل");
    expect(text).not.toMatch(/food|meal|home|daily|short/);
  });
  it("does not leak unknown stored enum values", () => {
    const text = easyStartContextText({ ...answers, interest: "obsolete" as EasyStartAnswers["interest"] });
    expect(text).toContain("غير محدد");
    expect(text).not.toContain("obsolete");
  });
  it("resolves HOME-002's source domain even without complete legacy cards", () => {
    expect(findEventDomainName("HOME-002")).toBe("إدارة المنزل");
    expect(mvpSpaceEvents().find((e) => e.id === "HOME-002")?.domainName).toBe("إدارة المنزل");
  });
});
