import { useSyncExternalStore } from "react";
import {
  getProjectsSnapshot,
  getServerSnapshot,
  subscribeProjects,
} from "./store";
import type { VisualToolProject, VisualToolType } from "./types";

/** كل مشاريع الأسرة، مرتبة بالأحدث تعديلًا. */
export function useVisualToolProjects(type?: VisualToolType): VisualToolProject[] {
  const all = useSyncExternalStore(subscribeProjects, getProjectsSnapshot, getServerSnapshot);
  const sorted = [...all].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return type ? sorted.filter((p) => p.type === type) : sorted;
}

/** مشروع واحد، أو null قبل الترطيب أو عند عدم وجوده. */
export function useVisualToolProject(id: string): VisualToolProject | null {
  const all = useSyncExternalStore(subscribeProjects, getProjectsSnapshot, getServerSnapshot);
  return all.find((p) => p.id === id) ?? null;
}

/** هل اكتمل الترطيب (لتفادي وميض "غير موجود" أثناء SSR). */
export function useHydratedTools(): boolean {
  return useSyncExternalStore(
    subscribeProjects,
    () => true,
    () => false,
  );
}
