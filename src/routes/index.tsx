import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  CalendarClock,
  Sparkles,
  ListChecks,
  Library,
  PenLine,
  BadgeCheck,
  LogIn,
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
        content:
          "الفرصة الموجودة تكفي: جزء صغير من حدث معتاد يكفي لتبدأ المشاركة.",
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

const DISCOVERY_PATHS = [
  {
    title: "مساحة عمل الأسرة",
    description: "اختاروا فرصة مشاركة، جهّزوا بطاقتها بلغتكم وصوركم، ثم اعتمدوها كنسخة ثابتة محفوظة.",
    icon: Sparkles,
    to: "/space" as const,
    tone: "teal" as const,
  },
  {
    title: "مشاركات الروتين اليومي",
    description: "رتّبوا محطات يومكم واربطوا بها مشاركات مناسبة.",
    icon: CalendarClock,
    to: "/my-routine" as const,
    tone: "coral" as const,
  },
  {
    title: "ساعدني في الاختيار",
    description: "ثلاث خطوات قصيرة تقترح عليكم فرصة مشاركة مناسبة الآن.",
    icon: Sparkles,
    to: "/help-me-choose" as const,
    tone: "navy" as const,
  },
  {
    title: "مكتبة المشاركات",
    description: "تصفّحوا أحداث الحياة والمشاركات المتاحة داخل المنزل وخارجه.",
    icon: Library,
    to: "/activities/browse" as const,
    tone: "coral" as const,
  },
];

const JOURNEY_STEPS = ["اختيار", "تجهيز", "تركيب", "معاينة", "اعتماد"] as const;

function FamilySpaceSection() {
  const status = useFamilySpaceStatus();

  if (status.loading) {
    return (
      <div className="mt-3 space-y-2" role="status" aria-live="polite">
        <span className="sr-only">جارٍ تحميل حالة مساحة الأسرة</span>
        <div className="h-16 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!status.signedIn) {
    return (
      <Link
        to="/auth"
        className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-border bg-card p-4 transition-all hover:border-gold"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <LogIn className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="text-right">
            <span className="block text-base font-bold text-foreground">
              سجّلوا الدخول لفتح مساحة عمل أسرتكم
            </span>
            <span className="mt-0.5 block text-sm text-muted-foreground">
              مسوداتكم وبطاقاتكم المعتمدة محفوظة هناك.
            </span>
          </span>
        </span>
        <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
      </Link>
    );
  }

  const empty = status.drafts.length === 0 && status.approved.length === 0;

  return (
    <div className="mt-3 space-y-3">
      {empty && (
        <p className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          لم تبدأ مساحة عمل أسرتكم بعد. اختاروا فرصة مشاركة من المسارات أدناه
          لتجهيز أول بطاقة.
        </p>
      )}

      {status.drafts.map((draft) => (
        <Link
          key={draft.specId}
          to="/space/workspace/$specId"
          params={{ specId: draft.specId }}
          className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-gold/50 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary">
              <PenLine className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="min-w-0 text-right">
              <span className="block truncate text-base font-bold text-foreground">
                {draft.title}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                مسودة قيد التجهيز — أكملوا من حيث توقفتم
              </span>
            </span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
        </Link>
      ))}

      {status.approved.map((card) => (
        <Link
          key={card.specId}
          to="/space/card/$specId"
          params={{ specId: card.specId }}
          className="group flex items-center justify-between gap-3 rounded-2xl border-2 border-primary/30 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <BadgeCheck className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="min-w-0 text-right">
              <span className="block truncate text-base font-bold text-foreground">
                {card.title}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                بطاقة معتمدة — النسخة {card.latestVersion}
              </span>
            </span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
        </Link>
      ))}
    </div>
  );
}

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
            <p
              key={p}
              className="mt-1 text-sm leading-relaxed text-primary-foreground/85"
            >
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
  return (
    <PageShell
      title="دليلي"
      description="مساحة مشاركات الأسرة داخل الحياة اليومية"
      headerExtra={<InfoTabs />}
    >
      {/* مقدمة مختصرة */}
      <section className="mt-1 rounded-2xl border border-border bg-card p-5 shadow-card-soft">
        <p className="max-w-[52ch] text-[0.98rem] font-bold leading-relaxed text-foreground">
          دليلي يساعد الأسرة على تهيئة فرص مشاركة الأشخاص ذوي الإعاقة في أحداث
          حياتهم اليومية.
        </p>
        <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها.
        </p>
        <p className="mt-1 text-sm font-bold text-gold">الفرصة الموجودة تكفي.</p>
      </section>

      {/* مساحة عمل الأسرة — حالة الإنتاج الفعلية */}
      <section className="mt-7">
        <h2 className="px-1 font-display text-lg font-bold text-foreground">
          مساحة عمل أسرتكم
        </h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          كل بطاقة تمرّ برحلة واحدة: {JOURNEY_STEPS.join(" ← ")} — وتبقى
          محفوظة لأسرتكم.
        </p>
        <FamilySpaceSection />
      </section>

      {/* دعوة الاكتشاف */}
      <section className="mt-7">
        <h2 className="px-1 font-display text-lg font-bold leading-snug text-foreground">
          هل تفكرون في مشاركة ابنكم أو ابنتكم في بعض أحداث حياتكم اليومية؟
        </h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          هل تبحثون عن مشاركة مناسبة لكم؟ جرّبوا أحد المسارات التالية.
        </p>

        <div className="mt-3 space-y-3">
          {DISCOVERY_PATHS.map(({ title, description, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-right">
                <span className="block text-base font-bold text-foreground">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </span>
              <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* مشاركاتي النشطة */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="px-1 font-display text-lg font-bold text-foreground">
          مشاركاتي النشطة
        </h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          تابعوا المشاركات الجارية وسجّلوا ما فعلتموه اليوم.
        </p>
        <Link
          to="/active-participations"
          className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-primary/30 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <ListChecks className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-base font-bold text-foreground">
              افتحوا مشاركاتنا النشطة
            </span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </section>
    </PageShell>
  );
}
