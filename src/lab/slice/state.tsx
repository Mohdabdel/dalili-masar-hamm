// المزوّد التجريبي داخل Lab: نفس مخزن مساحة الأسرة، لكن بتخزين مؤقت في sessionStorage.
// المنطق نفسه مشترك مع الإنتاج في @/features/space/store.

import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import {
  SliceCtx,
  initialSliceState,
  sliceReducer,
  type SliceState,
} from "@/features/space/store";

export { useSlice, useSliceHelpers } from "@/features/space/store";
export type { SliceState } from "@/features/space/store";

const KEY = "dalili-lab-slice-v1";

export function SliceStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sliceReducer, initialSliceState);
  const [hydrated, markHydrated] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) dispatch({ type: "hydrate", value: JSON.parse(raw) as SliceState });
    } catch {
      /* التجربة لا تعتمد على التخزين */
    }
    markHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* تجاهل */
    }
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <SliceCtx.Provider value={value}>{children}</SliceCtx.Provider>;
}
