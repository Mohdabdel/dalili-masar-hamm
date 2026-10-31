// المسار القديم "ساعدني في الاختيار" كان يوجّه الأسرة عبر مستوى المشاركة.
// دوره القانوني انتقل إلى «بداية سهلة»، التي تبدأ ممّا يحبه الشخص لا ممّا يُقاس عليه.
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/help-me-choose")({
  beforeLoad: () => {
    throw redirect({ to: "/space/easy" });
  },
});
