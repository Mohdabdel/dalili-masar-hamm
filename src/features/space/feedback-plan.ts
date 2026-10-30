import type { SliceAction } from "./store";

/** لا يمكن تحويل مشاركة خاصة إلى محطة بلا اختيار محطة حقيقية. */
export function routineFeedbackActions(specId: string, eventId?: string): SliceAction[] | null {
  if (!eventId) return null;
  return [
    { type: "station.add", eventId },
    { type: "station.link", eventId, specId },
    { type: "lifecycle", specId, value: "make_routine" },
  ];
}

/** تذكر الكتابات الناجحة لتجنب تكرار الانطباع عند إعادة المحاولة بعد فشل لاحق. */
export async function persistFeedbackActions(
  actions: SliceAction[],
  persist: (action: SliceAction) => void | Promise<void>,
  completed: Set<string>,
) {
  for (const action of actions) {
    const key = JSON.stringify(action);
    if (completed.has(key)) continue;
    await persist(action);
    completed.add(key);
  }
}
