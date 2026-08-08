import { Link, useRouterState } from "@tanstack/react-router";
import { Home, HeartHandshake, MapPinned, GraduationCap } from "lucide-react";

const tabs = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/activities", label: "المشاركة", icon: HeartHandshake },
  { to: "/community-support", label: "مجتمعي", icon: MapPinned },
  { to: "/education-support", label: "تعليمي", icon: GraduationCap },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-lg shadow-elegant">
      <ul className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom)+0.375rem)]">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 rounded-xl py-2 transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                    active ? "bg-gradient-gold shadow-card-soft" : ""
                  }`}
                >
                  <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={`text-[10.5px] font-semibold ${active ? "text-primary" : ""}`}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
