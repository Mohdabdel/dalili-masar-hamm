import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, TrendingUp, ShieldCheck, ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/how-to-use")({
  head: () => ({
    meta: [
      { title: "كيف تستخدم دليلي؟ | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "دليل استخدام دليلي: قاعدة 15 دقيقة، المشاركة قبل الإتقان، واعتبارات قبل البدء.",
      },
    ],
  }),
  component: HowToUsePage,
});

function HowToUsePage() {
  return (
    <PageShell
      title="كيف تستخدم دليلي؟"
      subtitle="مرافق للأسرة في الحياة اليومية"
      breadcrumbs={[{ label: "كيف تستخدم دليلي" }]}
    >

      {/* الهدف */}
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <h2 className="font-display text-lg font-bold text-foreground">
          دليلي ليس دليلاً للأنشطة، بل مرافق للأسرة في الحياة اليومية
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          الهدف من دليلي ليس إضافة أعباء جديدة على الأسرة، ولا تحويل الحياة
          اليومية إلى جلسات تدريب، بل مساعدة الأسرة على استثمار ما يحدث فعلاً
          داخل المنزل والمجتمع وتحويله إلى فرص مشاركة حقيقية للشاب أو البالغ
          من ذوي الهمم.
        </p>
      </section>

      {/* قاعدة 15 دقيقة */}
      <section className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-card-soft">
            <Clock className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            قاعدة 15 دقيقة
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          لا تحتاج المشاركة إلى وقت طويل. ابدأ بفرصة صغيرة داخل حدث يومي
          حقيقي، وكررها بهدوء حتى تصبح جزءاً من الروتين.
        </p>
      </section>

      {/* المشاركة قبل الإتقان */}
      <section className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-card-soft">
            <TrendingUp className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            المشاركة قبل الإتقان
          </h3>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          لا يشترط أن ينفذ الشاب المهمة كاملة من البداية. يكفي أن يكون له دور
          واضح، ثم يزداد هذا الدور تدريجياً مع انخفاض الدعم.
        </p>
      </section>

      {/* اعتبارات قبل البدء */}
      <section className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-card-soft">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <h3 className="font-display text-base font-bold text-foreground">
            اعتبارات قبل البدء
          </h3>
        </div>
        <ul className="mt-4 space-y-2.5">
          {[
            "اختر حدثاً يحدث فعلاً في يومكم.",
            "لا تحول المشاركة إلى اختبار.",
            "ابدأ بمستوى دعم مناسب.",
            "استخدم التلميحات البصرية أو اللفظية عند الحاجة.",
            "قلل المساعدة تدريجياً.",
            "راقب التقدم البسيط.",
            "احترم عمر الشاب ودوره كراشد.",
            "توقف إذا ظهر إجهاد واضح أو ازدحام حسي.",
            "عد للمشاركة لاحقاً دون ضغط.",
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* زر البدء */}
      <div className="mt-6">
        <Link
          to="/"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant transition-all hover:opacity-90"
        >
          <span>ابدأ من حدث اليوم</span>
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            strokeWidth={2.5}
          />
        </Link>
      </div>
    </PageShell>
  );
}
