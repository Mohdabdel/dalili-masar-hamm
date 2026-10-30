import { listMvpScopeParticipations } from "@/lib/framework/mvp-scope";
import type { FunctionalParticipation } from "@/lib/framework/reference-model";

export type EasyStartInterest =
  "food" | "music" | "water" | "organizing" | "outings" | "hosting" | "clothing" | "other";
export type EasyStartRoutine =
  "meal" | "home" | "laundry" | "shopping" | "gathering" | "health" | "leisure" | "other";
export type EasyStartPlace = "home" | "outside" | "either";
export type EasyStartTime = "daily" | "evening" | "weekend" | "outing" | "gathering" | "flexible";
export type EasyStartShape = "short" | "shared" | "connected" | "unsure";

export interface EasyStartAnswers {
  interest: EasyStartInterest;
  routine: EasyStartRoutine;
  place: EasyStartPlace;
  time: EasyStartTime;
  shape: EasyStartShape;
}

const TOKENS: Record<EasyStartInterest | EasyStartRoutine | EasyStartTime, string[]> = {
  food: ["طعام", "وجبة", "إفطار", "مائدة", "مشروب", "ضيافة", "بوب كورن"],
  music: ["موسيقى", "أغنية", "مقطع", "جهاز", "تحكم"],
  water: ["ماء", "إبريق", "تعبئة", "سكب", "شرب"],
  organizing: ["ترتيب", "إعادة", "رف", "تجهيز", "توزيع", "وضع"],
  outings: ["خروج", "حديقة", "نزهة", "سيارة", "متجر", "موعد", "لقاء"],
  hosting: ["ضيف", "ضيوف", "ضيافة", "لقاء", "اجتماع"],
  clothing: ["ملابس", "غسيل", "عناية", "عبوات"],
  other: [],
  meal: ["طعام", "وجبة", "إفطار", "مائدة", "مشروب", "ضيافة", "بوب كورن"],
  home: ["منزل", "بيت", "غرفة", "رف", "ترتيب", "مائدة"],
  laundry: ["ملابس", "غسيل", "خزانة"],
  shopping: ["تسوق", "مشتريات", "متجر", "بائع", "أكياس"],
  gathering: ["ضيف", "ضيوف", "ضيافة", "لقاء", "أسرة", "عائلة"],
  health: ["صحة", "دواء", "جرعة", "عيادة", "موعد"],
  leisure: ["موسيقى", "أغنية", "مقطع", "تلفاز", "نزهة", "حديقة"],
  daily: ["يومي", "مائدة", "منزل", "غسيل", "ترتيب", "إفطار"],
  evening: ["مساء", "ضيافة", "موسيقى", "بوب كورن"],
  weekend: ["نزهة", "حديقة", "خروج", "تسوق", "زيارة"],
  outing: ["خروج", "حديقة", "متجر", "سيارة", "عيادة", "موعد"],
  flexible: [],
};

function textOf(participation: FunctionalParticipation): string {
  return [participation.title, participation.life_context, participation.functional_intent].join(
    " ",
  );
}

function tokenScore(text: string, tokens: string[], weight: number): number {
  return tokens.reduce((score, token) => score + (text.includes(token) ? weight : 0), 0);
}

function isOutside(participation: FunctionalParticipation): boolean {
  return (
    /-(COMM|SHOP|HEALTH)-/.test(participation.id) ||
    /(خارج|متجر|حديقة|عيادة|موعد|سيارة)/.test(textOf(participation))
  );
}

export function recommendEasyStartParticipations(
  answers: EasyStartAnswers,
  limit = 5,
): FunctionalParticipation[] {
  return listMvpScopeParticipations()
    .map((participation, index) => {
      const text = textOf(participation);
      let score = tokenScore(text, TOKENS[answers.interest], 3);
      score += tokenScore(text, TOKENS[answers.routine], 3);
      score += tokenScore(text, TOKENS[answers.time], 1);
      const outside = isOutside(participation);
      if (answers.place === "either" || (answers.place === "outside") === outside) score += 2;
      if (answers.shape === "short" && participation.complexity.level === "simple") score += 2;
      if (answers.shape === "shared" && participation.participation_mode === "shared") score += 2;
      if (answers.shape === "connected" && participation.complexity.level !== "simple") score += 2;
      if (answers.shape === "unsure") score += 1;
      return { participation, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ participation }) => participation);
}

export function easyStartContextText(answers: EasyStartAnswers): string {
  const labels: { [K in keyof EasyStartAnswers]: Record<EasyStartAnswers[K], string> } = {
    interest: { food: "الطعام أو المشروبات", music: "الموسيقى أو المقاطع", water: "الماء والتعبئة والسكب", organizing: "ترتيب الأشياء وإعادتها", outings: "التسوق والخروج", hosting: "الضيوف والاجتماعات الأسرية", clothing: "الملابس والعناية بها", other: "شيء آخر" },
    routine: { meal: "إعداد الطعام أو المائدة", home: "ترتيب المنزل", laundry: "غسل الملابس أو ترتيبها", shopping: "التسوق وتجهيز الخروج", gathering: "زيارة أو لقاء عائلي", health: "موعد صحي أو إجراء يومي", leisure: "وقت الترفيه الأسري", other: "موقف آخر" },
    place: { home: "داخل المنزل", outside: "أثناء خروج قصير", either: "لا فرق؛ اعرضوا الأنسب" },
    time: { daily: "أثناء حدث يومي قائم", evening: "في المساء", weekend: "في نهاية الأسبوع", outing: "أثناء خروج مخطط", gathering: "عندما تجتمع الأسرة", flexible: "لا وقت محدد" },
    shape: { short: "مساهمة قصيرة وواضحة", shared: "دور مشترك مع الأسرة", connected: "عدة إجراءات مترابطة", unsure: "لا نعرف؛ اقترحوا علينا" },
  };
  const label = (key: keyof EasyStartAnswers) => {
    const group = labels[key] as Record<string, string>;
    const value = answers[key];
    return Object.prototype.hasOwnProperty.call(group, value) ? group[value] : "غير محدد";
  };
  return `اهتمام: ${label("interest")}، موقف: ${label("routine")}، مكان: ${label("place")}، وقت: ${label("time")}، وبداية: ${label("shape")}`;
}

