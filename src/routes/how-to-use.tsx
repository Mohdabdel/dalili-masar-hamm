import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/how-to-use")({
  head: () => ({
    meta: [
      { title: "كيف تستخدم دليلي؟ | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "ست خطوات لاستخدام دليلي، مع شرح مستويات المشاركة الثلاثة: موجهة، مشتركة، ومستقلة.",
      },
    ],
  }),
  component: HowToUsePage,
});

const STEPS: { title: string; body: string }[] = [
  {
    title: "١. اختر حدثاً حقيقياً من يومكم",
    body: "ابدأ من موقف يحدث فعلاً داخل البيت أو المجتمع، لا تصنع نشاطاً إضافياً.",
  },
  {
    title: "٢. ابدأ بفرصة مشاركة بسيطة",
    body: "اختر جزءاً صغيراً من المهمة يمكن تنفيذه في وقت قصير.",
  },
  {
    title: "٣. اختر مستوى المشاركة المناسب",
    body: "قدّر مستوى الدعم الذي يحتاجه الشاب اليوم، وابدأ منه دون مبالغة.",
  },
  {
    title: "٤. قدم الدعم دون أن تسيطر على المهمة",
    body: "اترك مساحة كافية للشاب لأداء دوره، وتدخّل فقط عند الحاجة.",
  },
  {
    title: "٥. كرر المشاركة حتى تصبح جزءاً من الروتين",
    body: "التكرار الهادئ هو ما يبني المهارة والثقة، وليس الجلسة المكثفة.",
  },
  {
    title: "٦. قلل المساعدة تدريجياً",
    body: "خفّف التلميحات مع الوقت حتى يزداد استقلال الشاب في المهمة.",
  },
];

const LEVELS: { label: string; body: string }[] = [
  {
    label: "مشاركة موجهة",
    body: "يشارك الشاب في جزء بسيط من المهمة مع دعم مباشر.",
  },
  {
    label: "مشاركة مشتركة",
    body: "ينفذ جزءاً أكبر من المهمة مع تلميحات أو متابعة قريبة.",
  },
  {
    label: "مشاركة مستقلة",
    body: "يؤدي المهمة بدرجة أعلى من الاستقلال مع مراجعة بسيطة عند الحاجة.",
  },
];

function HowToUsePage() {
  return (
    <PageShell
      title="كيف تستخدم دليلي؟"
      subtitle="ست خطوات عملية للأسرة"
      breadcrumbs={[{ label: "كيف تستخدم دليلي" }]}
    >
      <div className="space-y-3">
        {STEPS.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft"
          >
            <h3 className="font-display text-base font-bold text-foreground">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <h2 className="font-display text-lg font-bold text-foreground">
          مستويات المشاركة
        </h2>
        <ul className="mt-4 space-y-3">
          {LEVELS.map((l) => (
            <li
              key={l.label}
              className="rounded-xl border border-border/60 bg-background p-4"
            >
              <div className="text-sm font-bold text-primary">{l.label}</div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {l.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6">
        <Link
          to="/activities"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90"
        >
          <span>ابدأ استخدام دليلي</span>
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </PageShell>
  );
}
