import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Hand, Volume2, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { SmallCard } from "@/components/SmallCard";
import { DetailSheet } from "@/components/DetailSheet";
import { messages, type InterpretedMessage } from "@/lib/data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "التصرفات والرسائل التعبيرية | دليلي - مسار همم" },
      { name: "description", content: "قراءة السلوكيات كرسائل تعبيرية مع توصيات ذكية تحفظ كرامة الشاب." },
    ],
  }),
  component: MessagesPage,
});

const iconMap: Record<string, LucideIcon> = {
  "MSG-01": Hand,
  "MSG-02": Hand,
  "MSG-03": Volume2,
};

function MessagesPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<InterpretedMessage | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return messages;
    return messages.filter((m) => [m.id, m.behavior].some((f) => f.includes(s)));
  }, [q]);

  return (
    <PageShell title="التصرفات والرسائل التعبيرية" subtitle={`${filtered.length} سلوك مُفسَّر`} breadcrumbs={[{ label: "الرسائل" }]}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن سلوك..." />
      <div className="mt-4 space-y-3">
        {filtered.map((m) => (
          <SmallCard
            key={m.id}
            title={m.behavior}
            meta="اضغط لعرض التفسير والتوصية"
            icon={iconMap[m.id] ?? MessageCircle}
            onClick={() => setActive(m)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
        )}
      </div>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.id}
        title={active?.behavior ?? ""}
        headlineLabel="السلوك الظاهري"
        headline={active?.behavior}
        sections={
          active
            ? [
                {
                  id: "meaning",
                  title: "ماذا يعني الشاب؟",
                  content: <span className="italic">«{active.meaning}»</span>,
                },
                {
                  id: "rec",
                  title: "التوصية الذكية",
                  content: active.recommendation,
                },
              ]
            : []
        }
      />
    </PageShell>
  );
}
