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
    <PageShell
      title="دليلي"
      description="مرافق الأسرة لإتاحة المشاركة اليومية للشباب والبالغين من ذوي الهمم"
      subtitle="خطوات بسيطة مستمرة تحقق مشاركة مستدامة"
    >
      <section className="mt-1 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
        <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          ابدأ من الحياة اليومية... لا من الجلسة التدريبية
        </h2>
        <p className="mt-3 text-base leading-relaxed text-primary-foreground/90 max-w-[90%]">
          دليلي ليس برنامجاً تدريبياً إضافياً، بل مرافق عملي يساعد الأسرة على
          تحويل أحداث الحياة اليومية إلى فرص مشاركة حقيقية للشاب أو البالغ من
          ذوي الهمم.
        </p>
        <p className="mt-3 text-base leading-relaxed text-primary-foreground/90 max-w-[90%]">
          <strong className="text-gold">الفكرة الأساسية بسيطة:</strong>{" "}
          لا نضيف أنشطة جديدة إلى يوم الأسرة، بل نستثمر ما يحدث بالفعل داخل
          المنزل أو المجتمع، مثل غسل الملابس، إعداد وجبة، التسوق، مراجعة موعد،
          أو استقبال ضيوف، ونحول هذه الأحداث إلى فرص مشاركة متدرجة وهادفة.
        </p>
      </section>

      <Article title="لماذا المشاركة مهمة؟">
        في هذه المرحلة العمرية، تمنح المشاركة الشاب أو البالغ دوراً حقيقياً
        داخل أسرته ومجتمعه، وتدعم الاستقلالية، والثقة بالنفس، وتنظيم الروتين
        اليومي. المشاركة ليست وسيلة للتدريب فقط، بل هي وسيلة لبناء
        الاستقلالية، والانتماء، وتحسين جودة الحياة. والهدف ليس أن يؤدي
        المهمة كاملة منذ البداية، بل أن يبدأ بدور مناسب يتوسع تدريجياً مع
        الوقت.
      </Article>

      <Article title="قاعدة 15 دقيقة">
        لا تحتاج المشاركة إلى ساعات طويلة. ابدأ بخمسة عشر دقيقة داخل حدث
        يومي حقيقي، وكررها باستمرار. الاستمرار أهم من الكمال، والمشاركة
        الصغيرة المتكررة أكثر أثراً من نشاط طويل يحدث مرة واحدة.
      </Article>

      <Article title="لا تحتاج أن تكون مختصاً">
        صُمم دليلي للأب، والأم، والأخ، والأخت، أو أي فرد من الأسرة يريد
        إتاحة دور حقيقي للشاب في الحياة اليومية. لا تحتاج إلى أدوات متخصصة أو
        جلسات تدريبية. يكفي أن تبدأ بموقف بسيط، وتقدم الدعم المناسب، ثم
        تقلل المساعدة تدريجياً. ابدأ بما تعرفه... ودع دليلي يساعدك فيما لا
        تعرفه.
      </Article>

      <div className="mt-8">
        <Link
          to="/activities"
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gold px-6 py-4 text-base font-bold text-gold-foreground shadow-elegant transition-transform hover:-translate-y-0.5"
        >
          ابدأ أول فرصة مشاركة
          <ChevronLeft
            className="h-5 w-5 transition-transform group-hover:-translate-x-1"
            strokeWidth={2.4}
          />
        </Link>
      </div>
    </PageShell>
  );
}

function Article({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-[75%]">
        {children}
      </p>
    </section>
  );
}
