import type { LucideIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";

interface SmallCardProps {
  title: string;
  meta: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function SmallCard({ title, meta, icon: Icon, onClick }: SmallCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 text-right shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elegant active:scale-[0.99]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-card-soft">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs font-medium text-muted-foreground">{meta}</p>
      </div>
      <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
    </button>
  );
}
