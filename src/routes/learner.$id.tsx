import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { getLearnerCard } from "@/lib/learner-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";

export const Route = createFileRoute("/learner/$id")({
  parseParams: (p) => {
    if (!p.id) throw notFound();
    return { id: p.id };
  },
  head: () => ({
    meta: [
      { title: "نسخة المتعلم | دليلي" },
      {
        name: "description",
        content: "عرض مبسّط بخطوة واحدة في كل شاشة، بخط كبير وصورة داعمة عند توفرها.",
      },
      { property: "og:title", content: "نسخة المتعلم | دليلي" },
      {
        property: "og:description",
        content: "خطوة واحدة في كل شاشة لمرافقة المشاركة لحظة بلحظة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LearnerPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">الفرصة غير موجودة</p>
    </div>
  ),
});

function LearnerPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const card = getLearnerCard(id);

  const goBack = () => router.history.back();

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background" dir="rtl">
        <p className="text-muted-foreground">الفرصة غير متاحة</p>
      </div>
    );
  }

  const steps = card.steps;
  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep = steps[safeIndex];
  const isFirst = safeIndex === 0;
  const isLast = safeIndex === steps.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-primary text-primary-foreground" dir="rtl">
      <header className="px-5 pb-3 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-primary-foreground/10 px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
            إغلاق
          </button>
          <span className="text-sm font-semibold text-primary-foreground/80">
            {finished ? "انتهينا" : `${safeIndex + 1} من ${steps.length}`}
          </span>
        </div>
        <h1 className="text-center text-2xl font-bold leading-snug">{card.title}</h1>

        {/* مؤشر النقاط */}
        <div className="mt-3 flex justify-center gap-1.5">
          {steps.map((s, i) => (
            <span
              key={`${s.text}-${i}`}
              className={`h-2 rounded-full transition-all ${
                finished || i < safeIndex
                  ? "w-2 bg-primary-foreground/70"
                  : i === safeIndex
                    ? "w-6 bg-primary-foreground"
                    : "w-2 bg-primary-foreground/30"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        {finished ? (
          <div className="w-full max-w-lg rounded-3xl bg-card p-10 text-center shadow-elegant">
            <span className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-primary">
              <Check className="h-10 w-10" />
            </span>
            <p className="text-3xl font-bold text-card-foreground">أنهينا الخطوات</p>
            <p className="mt-3 text-base text-muted-foreground">
              يمكنك إعادة العرض من البداية أو الإغلاق.
            </p>
            <div className="mt-6 grid gap-3">
              <Button
                size="lg"
                className="h-14 bg-gradient-gold text-lg font-bold text-primary"
                onClick={() => {
                  setFinished(false);
                  setStepIndex(0);
                }}
              >
                من البداية
              </Button>
              <Button size="lg" variant="outline" className="h-14 text-lg font-bold" onClick={goBack}>
                إغلاق
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-card text-center shadow-elegant">
            {currentStep.image && (
              <img
                src={currentStep.image}
                alt={currentStep.imageAlt || currentStep.text}
                loading="lazy"
                className="max-h-[42vh] w-full object-cover"
              />
            )}
            <div className="p-8">
              <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-2xl font-black text-primary">
                {safeIndex + 1}
              </span>
              <p className="text-3xl font-bold leading-relaxed text-card-foreground">
                {currentStep.text}
              </p>
            </div>
          </div>
        )}
      </main>

      {!finished && (
        <footer className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-primary-foreground/10 bg-primary/95 px-5 py-4 backdrop-blur">
          <Button
            size="lg"
            variant="outline"
            className="h-16 border-primary-foreground/20 bg-primary-foreground/10 text-lg font-bold text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            disabled={isFirst}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronRight className="ml-1 h-5 w-5" />
            السابق
          </Button>
          <Button
            size="lg"
            className="h-16 bg-gradient-gold text-lg font-bold text-primary shadow-elegant hover:opacity-90"
            onClick={() => {
              if (isLast) setFinished(true);
              else setStepIndex((i) => i + 1);
            }}
          >
            {isLast ? "أنهينا" : "التالي"}
            <ChevronLeft className="mr-1 h-5 w-5" />
          </Button>
        </footer>
      )}
    </div>
  );
}
