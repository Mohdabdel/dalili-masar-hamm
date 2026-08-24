// عناصر واجهة مشتركة داخل Lab فقط (لا تعديل على أي مكوّن إنتاجي).

import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLab } from "@/lab/state/lab-state";

export function LabPage({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">{title}</h1>
        {intro && <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{intro}</p>}
      </header>
      {children}
      {footer && <div className="mt-8">{footer}</div>}
    </section>
  );
}

export function LabChoiceCard({
  title,
  hint,
  meta,
  to,
  params,
  search,
  onClick,
  selected,
}: {
  title: string;
  hint?: string;
  meta?: string;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  onClick?: () => void;
  selected?: boolean;
}) {
  const inner = (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="min-w-0 text-start">
        <span className="block text-lg font-bold leading-snug text-foreground">{title}</span>
        {hint && <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{hint}</span>}
        {meta && <span className="mt-1.5 block text-xs font-semibold text-primary">{meta}</span>}
      </span>
      <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
    </span>
  );

  const className = cn(
    "flex min-h-[64px] w-full items-center rounded-2xl border bg-card p-4 text-start transition-colors",
    "hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    selected ? "border-primary ring-2 ring-primary/30" : "border-border",
  );

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} search={search as any} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-pressed={selected}>
      {inner}
    </button>
  );
}

export function LabGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function LabSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-7">
      <h2 className="mb-1 text-lg font-bold text-foreground">{title}</h2>
      {description && <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{description}</p>}
      <div className={description ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

export function LabNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function LabButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-base font-bold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

export function LabLinkButton({
  children,
  to,
  params,
  search,
  variant = "primary",
}: {
  children: ReactNode;
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  variant?: "primary" | "ghost";
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search={search as any}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 text-base font-bold transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}

/** حدود الحالة: يعرض Empty/Loading/Error حسب Scenario Switcher. */
export function LabStateBoundary({
  children,
  emptyTitle = "لا يوجد شيء هنا بعد",
  emptyHint = "ابدأوا بخطوة واحدة صغيرة، ويمكن العودة في أي وقت.",
}: {
  children: ReactNode;
  emptyTitle?: string;
  emptyHint?: string;
}) {
  const { state } = useLab();

  if (state.uiState === "loading") {
    return (
      <div className="space-y-3" role="status" aria-live="polite">
        <span className="sr-only">جارٍ التحميل</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (state.uiState === "error") {
    return (
      <div role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
        <AlertCircle className="mb-2 h-6 w-6 text-destructive" aria-hidden />
        <h2 className="text-lg font-bold text-foreground">تعذّر عرض هذا الجزء الآن</h2>
        <p className="mt-1 text-sm text-muted-foreground">جرّبوا مرة أخرى، أو عودوا لاحقاً.</p>
      </div>
    );
  }

  if (state.uiState === "empty") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <Inbox className="mx-auto mb-2 h-7 w-7 text-muted-foreground" aria-hidden />
        <h2 className="text-lg font-bold text-foreground">{emptyTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  return <>{children}</>;
}

export const labHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} — دليلي Lab` },
    { name: "description", content: description },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: `${title} — دليلي Lab` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
