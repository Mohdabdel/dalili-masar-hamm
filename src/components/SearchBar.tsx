import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "ابحث..." }: SearchBarProps) {
  return (
    <div className="relative mb-4">
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card py-3 pe-10 ps-4 text-sm text-foreground shadow-card-soft outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </div>
  );
}
