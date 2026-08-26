import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarRange,
  ChevronLeft,
  Home,
  Images,
  Info,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trees,
  X,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "دليلي — مساحة مشاركات الأسرة" },
      {
        name: "description",
        content:
          "المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها. الفرصة الموجودة تكفي: ابدأوا من حدث معتاد في يومكم داخل المنزل أو خارجه.",
      },
      { property: "og:title", content: "دليلي — مساحة مشاركات الأسرة" },
      {
        property: "og:description",
        content:
          "الفرصة الموجودة تكفي — مساحة الأسرة لإعداد مشاركات حقيقية داخل أحداث الحياة اليومية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DaliliHome,
});

function DaliliHome() {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <PageShell title="دليلي" subtitle="مساحة مشاركات الأسرة">
      <div dir="rtl" className="text-start">
        {/* هوية وفلسفة */}
        <section className="rounded-3xl border border-border/70 bg-card p-5 shadow-card-soft sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="max-w-[46ch] text-lg font-bold leading-relaxed text-foreground sm:text-xl">
              المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها.
            </p>
            <button
              type="button"
              onClick={() => setInfoOpen(true)}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Info className="h-4 w-4" aria-hidden />
              عن دليلي
            </button>
          </div>

          <p className="mt-4 text-base font-bold text-gold">الفرصة الموجودة تكفي.</p>
          <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-muted-foreground">
            لا تحتاجون إلى تخصيص وقت للمشاركة. عندما يحدث شيء معتاد في يومكم، يمكن
            إتاحة جزء صغير منه للمشاركة — ولو للحظات، وبالقدر الذي يناسب الموقف
            والأسرة.
          </p>
          <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-muted-foreground">
            لا يشترط إكمال النشاط كله. يمكن أن تبدأ المشاركة بخطوة واحدة أو جزء صغير
            له معنى حقيقي، ثم تتكرر الفرصة كلما عاد هذا الحدث طبيعيًا في يومكم.
          </p>
        </section>

        {/* سياق الحياة */}
        <section className="mt-6">
          <h2 className="px-1 text-lg font-bold text-foreground">أين تحدث المشاركة؟</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ContextCard
              to="/activities/$category"
              params={{ category: "home" }}
              icon={Home}
              title="داخل المنزل"
              description="محطات وأحداث منزلية معتادة في يومكم."
            />
            <ContextCard
              to="/activities/$category"
              params={{ category: "community" }}
              icon={Trees}
              title="خارج المنزل"
              description="أحداث الحياة التي تحدث خارج المنزل."
            />
          </div>
        </section>

        {/* مشاركاتنا */}
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="text-lg font-bold text-foreground">مشاركاتنا</h2>
            <Link
              to="/lab/slice"
              className="inline-flex min-h-11 items-center rounded-xl bg-gradient-gold px-4 text-sm font-bold text-primary shadow-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              مساحة الأسرة
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <PlainLink
              to="/active-participations"
              title="المشاركات الفعالة"
              description="البطاقات المفتوحة والقابلة للمتابعة."
            />
            <PlainLink
              to="/activities/browse"
              title="مكتبة الحياة"
              description="لم تجدوا الحدث؟ استكشفوا الأحداث والمشاركات المتاحة."
            />
          </div>
        </section>

        {/* أدوات دليلي */}
        <section className="mt-6">
          <h2 className="px-1 text-lg font-bold text-foreground">أدوات دليلي</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            <ToolLink to="/tools" icon={Images} label="المعينات البصرية" />
            <ToolLink to="/tools" icon={CalendarRange} label="الجداول البصرية" />
            <ToolLink to="/tools" icon={MessageSquare} label="وسيلة التواصل" />
          </ul>
        </section>

        {/* اكتشاف من الاهتمام */}
        <section className="mt-8 border-t border-border pt-6">
          <h2 className="text-base font-bold text-foreground">
            لم تجدوا ما يشبه حياتكم؟
          </h2>
          <p className="mt-1 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
            ابدأوا من نشاط يحبه، شيء يفعله، أو اهتمام يعود إليه.
          </p>
          <Link
            to="/help-me-choose"
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            استكشفوا من اهتمام
          </Link>
        </section>
      </div>

      {infoOpen && <AboutPanel onClose={() => setInfoOpen(false)} />}
    </PageShell>
  );
}

function ContextCard({
  to,
  params,
  icon: Icon,
  title,
  description,
}: {
  to: "/activities/$category";
  params: { category: "home" | "community" };
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="group flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
    </Link>
  );
}

function PlainLink({
  to,
  title,
  description,
}: {
  to: "/active-participations" | "/activities/browse";
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-[64px] items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="min-w-0">
        <span className="block text-base font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}

function ToolLink({
  to,
  icon: Icon,
  label,
}: {
  to: "/tools";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-bold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Icon className="h-4 w-4 text-gold" />
        {label}
      </Link>
    </li>
  );
}

function AboutPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="عن دليلي"
        dir="rtl"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-5 text-start sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">عن دليلي</h2>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="إغلاق"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <section className="rounded-2xl border border-border/70 bg-card p-4">
          <h3 className="text-base font-bold text-foreground">ما هو دليلي؟</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            دليلي مساحة تساعد الأسرة على استثمار أحداث حياتها اليومية كما هي،
            وتحويل جزء منها إلى مشاركة حقيقية للشاب أو الشابة — دون إضافة مهام
            جديدة إلى اليوم ودون جلسات منفصلة.
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            لا نبحث عمّا يستطيع أن يتقنه لاحقًا، بل عمّا يستطيع أن يشارك فيه اليوم.
          </p>
        </section>

        <div className="mt-3 space-y-2">
          <AboutLink
            tab="guide"
            icon={BookOpen}
            title="دليل الاستخدام"
            description="من الحدث اليومي إلى بطاقة المشاركة."
          />
          <AboutLink
            tab="considerations"
            icon={ShieldCheck}
            title="اعتبارات الاستخدام"
            description="اعتبارات عملية أثناء إعداد المشاركة، ومتى نتوقف."
          />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          قراءة هذه المداخل اختيارية، ويمكنكم البدء مباشرة في أي وقت.
        </p>
      </div>
    </div>
  );
}

function AboutLink({
  tab,
  icon: Icon,
  title,
  description,
}: {
  tab: "guide" | "considerations";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      to="/participation-guide"
      search={{ tab }}
      className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-foreground">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronLeft className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}
