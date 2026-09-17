import { describe, expect, it } from "vitest";
import { recommendEasyStartParticipations, type EasyStartAnswers } from "../easy-start-quiz";

const answers: EasyStartAnswers = {
  interest: "food",
  routine: "meal",
  place: "home",
  time: "daily",
  shape: "short",
};

describe("ساعدني أبدأ", () => {
  it("يعيد خمسة ترشيحات من نطاق MVP دون محتوى Legacy", () => {
    const result = recommendEasyStartParticipations(answers);
    expect(result).toHaveLength(5);
    expect(new Set(result.map((item) => item.id)).size).toBe(5);
    expect(result.every((item) => !item.id.startsWith("KB-"))).toBe(true);
  });

  it("يجعل سياق الطعام اليومي أقرب من نتيجة غير مرتبطة", () => {
    expect(recommendEasyStartParticipations(answers)[0]?.title).toMatch(
      /إفطار|مائدة|بوب كورن|طعام|ضيافة/,
    );
  });
});
