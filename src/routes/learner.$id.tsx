import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { findOpportunityById } from "@/lib/home-hierarchy";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/learner/$id")({
  parseParams: (p) => {
    if (!p.id) throw notFound();
    return { id: p.id };
  },
  head: () => ({
    meta: [{ title: "نسخة المتعلم | دليلي" }],
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
  const opp = findOpportunityById(id);

  if (!opp || !opp.card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">الفرصة غير موجودة</p>
      </div>
    );
  }

  const [stepIndex, setStepIndex] = useState(0);
  const steps = opp.card.steps ?? [];
  const title = opp.card.title;

  if (steps.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">لا توجد خطوات متاحة</p>
      </div>
    );
  }

  const currentStep = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-primary text-primary-foreground">
      {/* Header */}
      <header className="px-5 pb-4 pt-6">
        <div className="mb-4">
          <Link
            to="/activities/home"
            search={{ view: "today" }}
            className="inline-flex items-center gap-1 rounded-lg bg-primary-foreground/10 px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <ChevronLeft className="h-4 w-4" />
            رجوع
          </Link>
        </div>
        <h1 className="text-center text-2xl font-bold leading-snug">{title}</h1>
      </header>

      {/* Step Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-8">
        <div className="w-full max-w-lg rounded-3xl bg-card p-8 text-center shadow-elegant">
          <div className="mb-6">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-2xl font-black text-primary">
              {stepIndex + 1}
            </span>
          </div>
          <p className="text-3xl font-bold leading-relaxed text-card-foreground">
            {currentStep}
          </p>
          <p className="mt-6 text-sm font-semibold text-muted-foreground">
            الخطوة {stepIndex + 1} من {steps.length}
          </p>
        </div>
      </main>

      {/* Navigation */}
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
          disabled={isLast}
          onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
        >
          التالي
          <ChevronLeft className="mr-1 h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
