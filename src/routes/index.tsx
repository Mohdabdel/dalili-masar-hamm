import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — مسار همم" },
      {
        name: "description",
        content:
          "دليلي: مرافق عملي يساعد الأسرة على تحويل أحداث الحياة اليومية إلى فرص مشاركة حقيقية للشاب أو البالغ من ذوي الهمم.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <PageShell title="دليلي" subtitle="خطوات بسيطة مستمرة تحقق مشاركة مستدامة">
      <section className="mt-1 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
        <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          خطوات بسيطة مستمرة تحقق مشاركة مستدامة
        </h2>
        <p className="mt-3 text-base leading-relaxed text-primary-foreground/90">
          دليلي ليس برنامجاً تدريبياً إضافياً، بل مرافق عملي يساعد الأسرة على
          تحويل أحداث الحياة اليومية إلى فرص مشاركة حقيقية للشاب أو البالغ من
          ذوي الهمم. الفكرة الأساسية أن المشاركة لا تحتاج وقتاً طويلاً أو أدوات
          متخصصة؛ بل تبدأ من موقف عادي يحدث داخل البيت أو المجتمع، مثل غسل
          الملابس، إعداد وجبة، التسوق، مراجعة موعد، أو استقبال ضيوف.
        </p>
      </section>

      <Article title="لماذا المشاركة مهمة؟">
        في هذه المرحلة العمرية، تصبح المشاركة اليومية مهمة لأنها تمنح الشاب
        دوراً واضحاً داخل الأسرة والمجتمع، وتدعم الاستقلالية والثقة وتنظيم
        الروتين. والهدف ليس أن يؤدي المهمة كاملة من البداية، بل أن يكون له دور
        مناسب يتدرج مع الوقت.
      </Article>

      <Article title="قاعدة 15 دقيقة">
        ابدأ بفرصة مشاركة قصيرة لا تتجاوز 15 دقيقة. المهم هو الاستمرار، لا
        الكمال. مشاركة صغيرة متكررة أفضل من نشاط طويل يحدث مرة واحدة.
      </Article>

      <Article title="لا تحتاج أن تكون مختصاً">
        دليلي صُمم للأم، الأب، الأخ، الأخت، أو أي فرد من الأسرة يريد إتاحة دور
        حقيقي للشاب في الحياة اليومية. لا تحتاج إلى أدوات متخصصة أو جلسات
        تدريبية؛ يكفي أن تبدأ بموقف بسيط، وتقدم الدعم المناسب، ثم تقلل المساعدة
        تدريجياً.
      </Article>

      <div className="mt-8">
        <Link
          to="/activities"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-base font-bold text-gold-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
        >
          ابدأ استخدام دليلي
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" strokeWidth={2.4} />
        </Link>
      </div>
    </PageShell>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
