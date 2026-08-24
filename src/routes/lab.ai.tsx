import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { LabPage, LabSection, LabStateBoundary, LabNote, labHead } from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { buildSuggestions } from "@/lab/data/suggestions";

export const Route = createFileRoute("/lab/ai")({
  component: LabAi,
  head: labHead("اقتراحات", "اقتراحات اختيارية تختار منها الأسرة أو تتجاهلها بالكامل."),
});

function LabAi() {
  const { state, dispatch } = useLab();
  const suggestions = useMemo(() => buildSuggestions(state), [state]);

  return (
    <LabPage
      title="اقتراحات"
      intro="مجرد اقتراحات مبنية على ما رتبتموه أنتم. لا شيء يُطبّق تلقائياً، والتجاهل خيار كامل."
    >
      <LabStateBoundary emptyTitle="لا توجد اقتراحات الآن">
        <LabSection title="ما قد يفيد اليوم">
          {suggestions.length === 0 ? (
            <LabNote>لا اقتراح الآن. هذا مؤشر جيد على أن يومكم مستقر.</LabNote>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((s) => (
                <li key={s.id} className="rounded-2xl border border-border bg-card p-4">
                  <h3 className="text-base font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
                    {s.to && s.actionLabel && (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      <Link to={s.to as any} className="text-primary">
                        {s.actionLabel}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "suggestion.accept", id: s.id })}
                      className="text-muted-foreground"
                    >
                      ليس الآن
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}
