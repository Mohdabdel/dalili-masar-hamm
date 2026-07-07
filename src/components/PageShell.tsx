import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { Breadcrumbs, BackButton, type Crumb } from "./Breadcrumbs";

interface PageShellProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: Crumb[];
  children: ReactNode;
}

export function PageShell({ title, subtitle, description, breadcrumbs, children }: PageShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="mx-auto max-w-2xl px-5 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            {!isHome ? <BackButton /> : <span />}
            <Link
              to="/search"
              className="inline-flex items-center gap-1 rounded-lg bg-primary-foreground/10 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
            >
              <Search className="h-3.5 w-3.5" />
              بحث
            </Link>
          </div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-2">
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wider text-gold/90">
                دليلي · مسار همم
              </p>
              <h1 className="mt-1 truncate text-2xl font-bold">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-xs text-primary-foreground/70">{subtitle}</p>
              )}
            </div>
            <div className="ms-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
              <span className="text-lg font-bold">د</span>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pt-5">{children}</main>
      <BottomNav />
    </div>
  );
}

