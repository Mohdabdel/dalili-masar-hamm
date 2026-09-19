import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  CalendarClock,
  Sparkles,
  Library,
  Images,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useFamilySpaceStatus } from "@/features/space/home-status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — المشاركة هي الحياة نفسها" },
      {
        name: "description",
        content:
          "دليلي يساعد الأسرة على تهيئة فرص مشاركة الأشخاص ذوي الإعاقة في أحداث حياتهم اليومية. الفرصة الموجودة تكفي.",
      },
      { property: "og:title", content: "دليلي — المشاركة هي الحياة نفسها" },
      {
        property: "og:description",
        content: "الفرصة الموجودة تكفي: جزء صغير من حدث معتاد يكفي لتبدأ المشاركة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LandingPage,
});

const INFO_TABS = [
  {
    id: "what",
    title: "ما هو دليلي؟",
    body: [
      "دليلي مساحة تساعد الأسرة على استثمار أحداث حياتها اليومية كما هي، وتحويل جزء منها إلى مشاركة حقيقية للابن أو الابنة — دون إضافة مهام جديدة إلى اليوم.",
      "لا نبحث عمّا يستطيع أن يتقنه لاحقًا، بل عمّا يستطيع أن يشارك فيه اليوم.",
    ],
  },
  {
    id: "why",
    title: "لماذا دليلي؟",
    body: [
      "لأن الفرص موجودة أصلًا في يومكم: وجبة، غسيل، تسوّق، ترتيب. ما ينقص عادةً هو طريقة بسيطة لإتاحة جزء من الحدث للمشاركة.",
      "لا يشترط إكمال الحدث كله؛ خطوة واحدة لها معنى تكفي، وتتكرر كلما عاد الحدث طبيعيًا في يومكم.",
    ],
  },
  {
    id: "guide",
    title: "دليل الاستخدام",
    body: [
      "اختاروا حدثًا معتادًا في يومكم، ثم حدّدوا الجزء الذي يمكن مشاركته، وجهّزوا بطاقة مشاركة قصيرة بلغتكم وصوركم.",
      "تجدون الشرح الكامل في صفحة دليل المشاركة.",
    ],
    link: true,
  },
];

// المسار الموجّه هو المدخل الأساسي الوحيد. بقية المداخل تظهر بعد «تخطّي».
const ALTERNATIVE_ENTRY_STRATEGIES = [
  {
    title: "خططها بنفسك",
    description: "خططوا لمشاركة خاصة بكم داخل مساحة عمل الأسرة.",
    icon: CalendarClock,
    to: "/space/plan" as const,
    search: undefined,
    tone: "coral" as const,
  },
  {
    title: "استكشف المشاركات الممكنة",
    description: "نتصفح أحداث يومنا أو محطات روتيننا، ونختار مشاركة تشبه حياتنا.",
    icon: Library,
    to: "/space/explore" as const,
    search: { lens: "event" as const },
    tone: "navy" as const,
  },
];

function InfoTabs() {
  const [active, setActive] = useState<string | null>(null);
  const current = INFO_TABS.find((t) => t.id === active) ?? null;

  return (
    <div>
      <div
        role="tablist"
        aria-label="تعرّف على دليلي"
        className="grid grid-cols-3 gap-1.5 rounded-2xl bg-primary-foreground/10 p-1.5"
      >
        {INFO_TABS.map((item) => {
          const on = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(on ? null : item.id)}
              className={cn(
                "min-h-[44px] rounded-xl px-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on
                  ? "bg-coral text-coral-foreground shadow-card-soft"
                  : "text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground",
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      {current && (
        <div
          role="tabpanel"
          className="mt-2 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-3"
        >
          {current.body.map((p) => (
            <p key={p} className="mt-1 text-sm leading-relaxed text-primary-foreground/85">
              {p}
            </p>
          ))}
          {current.link && (
            <Link
              to="/participation-guide"
              search={{ tab: "guide" as const }}
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-coral"
            >
              افتحوا دليل المشاركة
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LandingPage() {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const family = useFamilySpaceStatus();
  const hasApprovedCard = family.signedIn && family.approved.length > 0;
  return (
    <PageShell
      title="دليلي"
      description="المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها."
      headerExtra={<InfoTabs />}
    >
      {/* أول إجراء حسب مشاركات الأسرة، بعد حسم حالة الدخول. */}
      <section className="mt-1">
        {family.loading ? (
          <p role="status" className="rounded-2xl border border-border p-5 text-sm text-muted-foreground">جارٍ تحميل مساحة الأسرة…</p>
        ) : family.current ? (
          <Link
            to="/space/card/$specId"
            params={{ specId: family.current.specId }}
            className="flex min-h-32 flex-col justify-between gap-3 rounded-[2rem] bg-teal p-5 text-teal-foreground shadow-card-soft"
          >
            <span className="text-xl font-bold">متابعة المشاركة</span>
            <span className="text-base">{family.current.title}</span>
          </Link>
        ) : (
          <Link
            to="/space/easy"
            className="flex min-h-40 flex-col justify-between gap-3 rounded-[2rem] bg-teal p-5 text-teal-foreground shadow-card-soft transition-all hover:shadow-elegant"
          >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-foreground/20">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block text-lg font-bold">لنجعل البداية سهلة</span>
            <span className="mt-1 block text-sm leading-relaxed text-teal-foreground/80">
              أجيبوا عن 5 أسئلة قصيرة لنقترح فرص مشاركة من مواقف حياة أسرتكم اليومية.
            </span>
          </span>
          </Link>
        )}

        {!hasApprovedCard && (
          <div className="mt-5 rounded-2xl border border-border bg-card p-4">
            <p className="font-bold leading-relaxed text-foreground">دليلي يساعد الأسرة على تهيئة فرص مشاركة الأشخاص ذوي الإعاقة في أحداث حياتهم اليومية.</p>
            <p className="mt-2 text-sm text-muted-foreground">الفرصة الموجودة تكفي.</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAlternatives((value) => !value)}
          aria-expanded={showAlternatives}
          className="mx-auto mt-3 block min-h-11 px-4 text-sm font-bold text-primary underline underline-offset-4"
        >
          {showAlternatives ? "إخفاء طرق البدء الأخرى" : "طرق أخرى لبدء المشاركة"}
        </button>

        {showAlternatives && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ALTERNATIVE_ENTRY_STRATEGIES.map(
              ({ title, description, icon: Icon, to, tone, search }) => {
                const filled = tone === "teal";
                return (
                  <Link
                    key={title}
                    to={to}
                    search={search}
                    className={cn(
                      "group flex min-h-36 flex-col justify-between gap-3 rounded-[2rem] border p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant",
                      filled ? "border-teal bg-teal text-teal-foreground" : "border-border bg-card",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-2xl",
                        filled
                          ? "bg-teal-foreground/20 text-teal-foreground"
                          : tone === "navy"
                            ? "bg-primary/10 text-primary"
                            : "bg-coral/10 text-coral",
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="text-right">
                      <span
                        className={cn(
                          "block text-base font-bold",
                          filled ? "text-teal-foreground" : "text-foreground",
                        )}
                      >
                        {title}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-sm leading-relaxed",
                          filled ? "text-teal-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {description}
                      </span>
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        )}
      </section>

      {/* أدوات دليلي — مدخل واضح من الصفحة العامة */}
      <section className="mt-5 rounded-[2rem] border border-border bg-card p-5 shadow-card-soft">
        <h2 className="font-display text-lg font-bold text-foreground">أدوات دليلي</h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          صمّموا معينات بصرية وجداول ووسائل تواصل تناسب أسرتكم.
        </p>
        <Link
          to="/tools"
          className="group mt-3 flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary p-4 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Images className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-base font-bold text-foreground">استكشفوا الأدوات</span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
        </Link>
      </section>
    </PageShell>
  );
}
