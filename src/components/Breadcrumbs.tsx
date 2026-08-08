import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Home } from "lucide-react";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="مسار التنقل"
      className="flex flex-wrap items-center gap-1 text-[11px] text-primary-foreground/80"
    >
      <Link to="/" className="inline-flex items-center gap-1 hover:text-gold">
        <Home className="h-3 w-3" />
        الرئيسية
      </Link>
      {items.map((c, i) => (
        <Fragment key={`${c.label}-${i}`}>
          <ChevronLeft className="h-3 w-3 shrink-0 text-primary-foreground/50" />
          {c.to && i < items.length - 1 ? (
            <Link to={c.to} params={c.params as never} className="hover:text-gold">
              {c.label}
            </Link>
          ) : (
            <span className="font-semibold text-gold">{c.label}</span>
          )}


        </Fragment>
      ))}
    </nav>
  );
}

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.history.back()}
      className="inline-flex items-center gap-1 rounded-lg bg-primary-foreground/10 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
      aria-label="رجوع"
    >
      <ChevronLeft className="h-3.5 w-3.5" />
      رجوع
    </button>
  );
}
