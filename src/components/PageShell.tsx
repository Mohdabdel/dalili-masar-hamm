import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-30 bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="mx-auto max-w-2xl px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gold/90">
                دليلي · مسار همم
              </p>
              <h1 className="mt-1 text-2xl font-bold">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-xs text-primary-foreground/70">{subtitle}</p>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
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
