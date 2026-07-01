import { Clock } from "lucide-react";

interface Props {
  title: string;
  meta?: string;
  image: string;
  onClick: () => void;
}

export function ImageTile({ title, meta, image, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card text-right shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        width={1024}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/95 via-[#1a365d]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">
          {title}
        </h3>
        {meta && (
          <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-white/85">
            <span>{meta}</span>
            <Clock className="h-3 w-3" />
          </div>
        )}
      </div>
    </button>
  );
}
