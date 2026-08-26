import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, Home, Trees, X, Menu, Info } from "lucide-react";
import { labHead } from "@/lab/components/lab-ui";
import { defaultStations, getSpaceEvent, getSpaceSpec, type SpaceContext } from "@/lab/data/space/catalog";
import { useSlice } from "@/lab/slice/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/")({
  component: SliceHome,
  head: labHead("دليلي", "المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها."),
});

function SliceHome() {
  const { state, dispatch } = useSlice();
  const [context, setContext] = useState<SpaceContext | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({});

  const blocks = useMemo(() => {
    const ids = [...new Set(state.snapshots.map((s) => s.participationSpecId))];
    return ids.map((specId) => {
      const spec = getSpaceSpec(specId);
      const cards = state.snapshots.filter((s) => s.participationSpecId === specId);
      const open = cards.filter((c) => !state.closedCards.includes(c.id));
      const closed = cards.filter((c) => state.closedCards.includes(c.id));
      return {
        specId,
        title: spec?.title_ar ?? cards[0]?.participationTitle_ar ?? "مشاركة",
        eventTitle: spec?.eventTitle_ar ?? cards[0]?.eventTitle_ar ?? "",
        open,
        closed,
      };
    });
  }, [state.snapshots, state.closedCards]);

  const activeBlocks = blocks.filter((b) => b.open.length > 0);
  const pastBlocks = blocks.filter((b) => b.open.length === 0);
  const started = state.snapshots.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-5">
      {/* هيدر خفيف */}
      <header className="flex items-center justify-between gap-3">
        <span className="text-lg font-bold text-foreground">دليلي</span>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="h-4 w-4" aria-hidden />
          الأسرة
        </button>
      </header>

      {/* العبارة المركزية */}
      <p
        className={cn(
          "mt-6 max-w-[46ch] font-bold leading-relaxed text-foreground",
          started ? "text-base text-muted-foreground" : "text-xl sm:text-2xl",
        )}
      >
        المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها.
      </p>

      {/* داخل / خارج المنزل */}
      <div role="group" aria-label="مكان المشاركة" className="mt-6 flex flex-wrap gap-2">
        <ContextButton
          on={context === "home"}
          onClick={() => setContext(context === "home" ? null : "home")}
          icon={<Home className="h-4 w-4" aria-hidden />}
          label="داخل المنزل"
        />
        <ContextButton
          on={context === "community"}
          onClick={() => setContext(context === "community" ? null : "community")}
          icon={<Trees className="h-4 w-4" aria-hidden />}
          label="خارج المنزل"
        />
      </div>

      {context && <Stations context={context} state={state} dispatch={dispatch} />}

      {/* مشاركاتنا */}
      <section className="mt-9">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="truncate text-lg font-bold text-foreground">مشاركاتنا</h2>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setSummaryOpen(true)}
              className="min-h-[40px] rounded-xl border border-border px-3 text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              الملخص
            </button>
            <Link
              to="/lab/slice/library"
              className="inline-flex min-h-[40px] items-center rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              استكشف مشاركة
            </Link>
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-6">
            <p className="max-w-[42ch] text-base leading-relaxed text-muted-foreground">
              لا نبحث عمّا يستطيع أن يتقنه لاحقًا، بل عمّا يستطيع أن يشارك فيه اليوم.
            </p>
            <Link
              to="/lab/slice/library"
              className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-primary px-5 text-base font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ابدأوا بمشاركة
            </Link>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {activeBlocks.map((b) => (
              <TaskBlock
                key={b.specId}
                block={b}
                expanded={openBlocks[b.specId] ?? true}
                onToggle={() =>
                  setOpenBlocks((p) => ({ ...p, [b.specId]: !(p[b.specId] ?? true) }))
                }
                closedIds={state.closedCards}
              />
            ))}
            {showClosed &&
              pastBlocks.map((b) => (
                <TaskBlock
                  key={b.specId}
                  block={b}
                  expanded={openBlocks[b.specId] ?? false}
                  onToggle={() =>
                    setOpenBlocks((p) => ({ ...p, [b.specId]: !(p[b.specId] ?? false) }))
                  }
                  closedIds={state.closedCards}
                />
              ))}
          </ul>
        )}

        {pastBlocks.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClosed((v) => !v)}
            className="mt-3 min-h-[40px] text-sm font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {showClosed ? "إخفاء السابق" : `عرض السابق (${pastBlocks.length})`}
          </button>
        )}
      </section>

      {/* مدخل الاهتمام */}
      <section className="mt-10 border-t border-border pt-6">
        <h2 className="text-base font-bold text-foreground">لم تجدوا ما يشبه حياتكم؟</h2>
        <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          ابدأوا من نشاط يحبه، شيء يفعله، أو اهتمام يعود إليه.
        </p>
        <Link
          to="/lab/slice/library"
          className="mt-3 inline-flex min-h-[44px] items-center rounded-xl border border-border px-4 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          استكشفوا من اهتمام
        </Link>
      </section>

      {summaryOpen && (
        <Panel title="الملخص" onClose={() => setSummaryOpen(false)}>
          <dl className="space-y-2 text-base">
            <SummaryRow label="مهام مفتوحة" value={activeBlocks.length} />
            <SummaryRow label="بطاقات مشاركة" value={state.snapshots.length} />
            <SummaryRow
              label="بطاقات مفتوحة"
              value={state.snapshots.filter((s) => !state.closedCards.includes(s.id)).length}
            />
            <SummaryRow label="مشاركات نُفّذت" value={state.runs.length} />
            <SummaryRow label="محطاتنا المضافة" value={state.stations.length} />
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            هذه أرقام وصفية عن مشاركات الأسرة فقط، ولا تُستخدم للحكم على أي شخص.
          </p>
        </Panel>
      )}

      {infoOpen && (
        <Panel title="عن دليلي" onClose={() => setInfoOpen(false)}>
          <InfoAccordion />
        </Panel>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-bold text-foreground">{value}</dd>
    </div>
  );
}

interface BlockView {
  specId: string;
  title: string;
  eventTitle: string;
  open: { id: string; title_ar: string }[];
  closed: { id: string; title_ar: string }[];
}

function TaskBlock({
  block,
  expanded,
  onToggle,
  closedIds,
}: {
  block: BlockView;
  expanded: boolean;
  onToggle: () => void;
  closedIds: string[];
}) {
  const cards = [...block.open, ...block.closed];
  return (
    <li className="py-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", !expanded && "rotate-90")}
          aria-hidden
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-base font-bold text-foreground">{block.title}</span>
          {block.eventTitle && (
            <span className="block truncate text-xs text-muted-foreground">{block.eventTitle}</span>
          )}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">{block.open.length} مفتوحة</span>
      </button>

      {expanded && (
        <ul className="mt-2 space-y-1 ps-6">
          {cards.map((c) => {
            const isClosed = closedIds.includes(c.id);
            return (
              <li key={c.id}>
                <Link
                  to="/lab/slice/learner/$snapshotId"
                  params={{ snapshotId: c.id }}
                  className={cn(
                    "flex min-h-[44px] items-center justify-between gap-2 rounded-xl px-3 text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isClosed ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  <span className="min-w-0 truncate">
                    {c.title_ar}
                    {isClosed && <span className="text-xs"> · مغلقة</span>}
                  </span>
                  <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to="/lab/slice/card/$specId"
              params={{ specId: block.specId }}
              className="inline-flex min-h-[40px] items-center px-3 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              إدارة بطاقات هذه المهمة
            </Link>
          </li>
        </ul>
      )}
    </li>
  );
}

function Stations({
  context,
  state,
  dispatch,
}: {
  context: SpaceContext;
  state: ReturnType<typeof useSlice>["state"];
  dispatch: ReturnType<typeof useSlice>["dispatch"];
}) {
  const defaults = defaultStations(context).filter((e) => !state.removedStations.includes(e.id));
  const added = state.stations
    .map(getSpaceEvent)
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .filter((e) => e.contexts.includes(context))
    .filter((e) => !defaults.some((d) => d.id === e.id));
  const stations = [...defaults, ...added];

  return (
    <section className="mt-4 rounded-2xl border border-border p-3">
      <h2 className="mb-2 px-1 text-sm font-bold text-muted-foreground">محطاتنا</h2>
      {stations.length === 0 ? (
        <p className="px-1 text-sm text-muted-foreground">
          لا توجد محطات هنا بعد. استكشفوا مكتبة الحياة وأضيفوا ما يناسبكم.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {stations.map((e) => (
            <li key={e.id} className="flex items-center gap-1">
              <Link
                to="/lab/slice/$eventId/level"
                params={{ eventId: e.id }}
                className="flex min-h-[48px] min-w-0 flex-1 items-center justify-between gap-2 rounded-xl px-2 text-start hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold text-foreground">{e.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{e.hint}</span>
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
              <button
                type="button"
                aria-label={`إزالة ${e.title} من محطاتنا`}
                onClick={() => dispatch({ type: "station.remove", eventId: e.id })}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/lab/slice/library"
        className="mt-2 inline-flex min-h-[40px] items-center px-2 text-sm font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        مكتبة الحياة
      </Link>
    </section>
  );
}

function ContextButton({
  on,
  onClick,
  icon,
  label,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        on ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:bg-accent",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Panel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-background p-5 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const INFO_SECTIONS = [
  {
    title: "عن دليلي",
    body: "دليلي مساحة لمشاركات الأسرة داخل الحياة اليومية. لا نبحث عمّا يستطيع أن يتقنه لاحقًا، بل عمّا يستطيع أن يشارك فيه اليوم.",
  },
  {
    title: "دليل الاستخدام",
    body: "ابدأوا من داخل المنزل أو خارجه، اختاروا محطة من يومكم، ثم مشاركة واحدة. تصنعون منها بطاقة، وتبقى البطاقة كما اعتمدتموها.",
  },
  {
    title: "اعتبارات",
    body: "ليست كل خطوة تقدّمًا، لكن كل مشاركة حقيقية يمكن أن تصبح مكانًا له في الحياة. لا نقيس قدرة أحد، ولا نحوّل المشاركة إلى اختبار.",
  },
  {
    title: "الإعدادات والمساعدة",
    body: "هذه نسخة تجريبية داخل المختبر، وبياناتها محفوظة في جلسة المتصفح فقط ولا تؤثر على النسخة الحالية من دليلي.",
  },
];

function InfoAccordion() {
  const [open, setOpen] = useState<string | null>(INFO_SECTIONS[0]!.title);
  return (
    <ul className="divide-y divide-border border-y border-border">
      {INFO_SECTIONS.map((s) => (
        <li key={s.title} className="py-2">
          <button
            type="button"
            onClick={() => setOpen(open === s.title ? null : s.title)}
            aria-expanded={open === s.title}
            className="flex w-full items-center gap-2 text-start text-base font-bold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            {s.title}
          </button>
          {open === s.title && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
