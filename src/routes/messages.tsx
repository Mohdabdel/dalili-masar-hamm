import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AlertCircle, Lightbulb, Compass } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { messages } from "@/lib/data";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: "التصرفات والرسائل التعبيرية | دليلي - مسار همم" },
      { name: "description", content: "ترجمة تصرفات أصحاب الهمم إلى رسائل مفهومة مع توصيات علاجية." },
    ],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return messages;
    return messages.filter((m) =>
      [m.id, m.response, m.meaning, m.recommendation].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="التصرفات والرسائل التعبيرية" subtitle="افهم ما وراء التصرف قبل الاستجابة">
      <SearchBar value={q} onChange={setQ} placeholder="ابحث في التصرفات..." />
      <div className="space-y-4">
        {filtered.map((m) => (
          <article
            key={m.id}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-card-soft"
          >
            <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-l from-secondary/60 to-transparent px-5 py-3">
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                {m.id}
              </span>
            </div>

            <div className="space-y-4 px-5 py-4">
              <Block
                icon={<AlertCircle className="h-4 w-4" />}
                label="الاستجابة الملاحظة"
                accent="destructive"
              >
                {m.response}
              </Block>
              <Block icon={<Lightbulb className="h-4 w-4" />} label="ماذا تعني؟" accent="gold">
                {m.meaning}
              </Block>
              <Block
                icon={<Compass className="h-4 w-4" />}
                label="مسار العلاج والتوصية"
                accent="primary"
              >
                {m.recommendation}
              </Block>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
        )}
      </div>
    </PageShell>
  );
}

function Block({
  icon,
  label,
  children,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  accent: "destructive" | "gold" | "primary";
}) {
  const styles = {
    destructive: "border-r-4 border-destructive/70 bg-destructive/5",
    gold: "border-r-4 border-gold bg-gold/10",
    primary: "border-r-4 border-primary bg-primary/5",
  }[accent];
  const chip = {
    destructive: "text-destructive",
    gold: "text-primary",
    primary: "text-primary",
  }[accent];
  return (
    <div className={`rounded-2xl p-3.5 ${styles}`}>
      <div className={`mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold ${chip}`}>
        {icon}
        {label}
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}
