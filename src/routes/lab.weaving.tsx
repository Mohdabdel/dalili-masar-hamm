import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabButton,
  LabChoiceCard,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { searchOpportunities } from "@/lab/data/knowledge-read";
import { WEAVING_EXAMPLES } from "@/lab/data/fixtures";
import { safeText } from "@/lab/data/lexicon";

export const Route = createFileRoute("/lab/weaving")({
  component: LabWeaving,
  head: labHead("شيء يحبه", "نبدأ من اهتمام أو فعل موجود، ونبحث له عن مكان حقيقي داخل اليوم."),
});

function LabWeaving() {
  const { state, dispatch } = useLab();
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchOpportunities(query, 10), [query]);

  const submit = () => {
    const value = text.trim();
    if (!value) return;
    dispatch({ type: "weaving.add", text: value });
    setQuery(value);
    setText("");
  };

  return (
    <LabPage
      title="شيء يحبه أو يفعله بالفعل"
      intro="لا نبحث عن شيء جديد يفعله. نبحث عن مكان حقيقي لما يفعله أصلاً داخل يومكم."
    >
      <LabStateBoundary emptyTitle="لم تضيفوا شيئاً بعد">
        <LabSection title="اكتبوه بكلماتكم">
          <div className="flex flex-wrap gap-2">
            <label htmlFor="weaving-input" className="sr-only">
              شيء يحبه أو يفعله بالفعل
            </label>
            <input
              id="weaving-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="مثال: يحب اللعب بالماء"
              className="min-h-[48px] flex-1 rounded-xl border border-border bg-card px-4 text-base"
            />
            <LabButton onClick={submit} disabled={!text.trim()}>
              ابحثوا عن مكان له
            </LabButton>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {WEAVING_EXAMPLES.map((ex) => (
              <button
                key={ex.text}
                type="button"
                onClick={() => {
                  dispatch({ type: "weaving.add", text: ex.text });
                  setQuery(ex.query);
                }}
                className="min-h-[40px] rounded-lg border border-border bg-card px-3 text-sm"
              >
                {ex.text}
              </button>
            ))}
          </div>
        </LabSection>

        {state.weaving.interests.length > 0 && (
          <LabSection title="ما ذكرتموه">
            <div className="flex flex-wrap gap-2">
              {state.weaving.interests.map((i) => (
                <span key={i.id} className="rounded-lg bg-muted px-3 py-1.5 text-sm">
                  {i.text}
                </span>
              ))}
            </div>
          </LabSection>
        )}

        {query && (
          <LabSection title="مواضع قريبة في يومكم">
            {results.length === 0 ? (
              <LabNote>
                لم نجد موضعاً قريباً بهذه الكلمة. جرّبوا كلمة أبسط مثل: ماء، ترتيب، توزيع.
              </LabNote>
            ) : (
              <div className="space-y-3">
                {results.map((m) => (
                  <LabChoiceCard
                    key={m.opportunityId}
                    title={safeText(m.name)}
                    hint={`${m.eventName} — ${m.domainName}`}
                    to="/lab/match/$opportunityId"
                    params={{ opportunityId: m.opportunityId }}
                  />
                ))}
              </div>
            )}
          </LabSection>
        )}
      </LabStateBoundary>
    </LabPage>
  );
}
