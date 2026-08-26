// غلاف النموذج التجريبي: تنقل Lab + Scenario Switcher.

import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { FlaskConical, ChevronDown, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLab } from "@/lab/state/lab-state";
import { SCENARIOS, UI_STATES } from "@/lab/state/scenarios";
import type { LabTimeOfDay } from "@/lab/state/types";

const NAV = [
  { to: "/lab", label: "المختبر" },
  { to: "/lab/start", label: "ابدأ من روتينكم" },
  { to: "/lab/stations", label: "محطات اليوم" },
  { to: "/lab/routine", label: "روتيننا" },
  { to: "/lab/participations", label: "مشاركاتنا" },
  { to: "/lab/visual", label: "الوسائل البصرية" },
  { to: "/lab/community", label: "خارج البيت" },
  { to: "/lab/weaving", label: "شيء يحبه" },
  { to: "/lab/ai", label: "اقتراحات" },
  { to: "/lab/states", label: "حالات الواجهة" },
] as const;

const TIMES: { id: LabTimeOfDay; label: string }[] = [
  { id: "morning", label: "الصباح" },
  { id: "afternoon", label: "بعد الظهر" },
  { id: "evening", label: "المساء" },
];

export function LabShell({ children }: { children: ReactNode }) {
  const { state, dispatch } = useLab();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // شاشة دليلي المبسّطة: بلا شريط أدوات المختبر.
  if (pathname.startsWith("/lab/slice")) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#lab-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        تخطي إلى المحتوى
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
          <Link to="/lab" className="flex items-center gap-2 text-sm font-bold text-foreground">
            <FlaskConical className="h-5 w-5 text-primary" aria-hidden />
            دليلي Lab
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
              بيئة تجربة
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="lab-switcher"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SCENARIOS.find((s) => s.id === state.scenario)?.label ?? "السيناريو"}
            <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
          </button>
        </div>

        {open && (
          <div id="lab-switcher" className="border-t border-border bg-muted/40">
            <div className="mx-auto max-w-3xl space-y-3 px-4 py-3">
              <Fieldset legend="السيناريو">
                {SCENARIOS.map((s) => (
                  <Chip
                    key={s.id}
                    active={state.scenario === s.id}
                    label={s.label}
                    title={s.hint}
                    onClick={() => dispatch({ type: "scenario", id: s.id })}
                  />
                ))}
              </Fieldset>
              <Fieldset legend="حالة الواجهة">
                {UI_STATES.map((u) => (
                  <Chip
                    key={u.id}
                    active={state.uiState === u.id}
                    label={u.label}
                    onClick={() => dispatch({ type: "uiState", value: u.id })}
                  />
                ))}
              </Fieldset>
              <Fieldset legend="وقت اليوم">
                {TIMES.map((t) => (
                  <Chip
                    key={t.id}
                    active={state.timeOfDay === t.id}
                    label={t.label}
                    onClick={() => dispatch({ type: "timeOfDay", value: t.id })}
                  />
                ))}
              </Fieldset>
              <button
                type="button"
                onClick={() => dispatch({ type: "reset" })}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                إعادة ضبط النموذج
              </button>
            </div>
          </div>
        )}

        <nav aria-label="تنقل المختبر" className="border-t border-border">
          <ul className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-3 py-1.5">
            {NAV.map((n) => {
              const active = n.to === "/lab" ? pathname === "/lab" : pathname.startsWith(n.to);
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className={cn(
                      "inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main id="lab-main" className="pb-16">
        {children}
      </main>
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[11px] font-bold text-muted-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

function Chip({
  label,
  active,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "min-h-[36px] rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}
