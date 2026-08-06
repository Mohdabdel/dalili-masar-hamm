import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getRecipeByExecutionUnit,
  getRecipeFrames,
  isFrameOptional,
  type VisualFrame,
} from "@/lib/execution-frames";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Eye,
  EyeOff,
  MoreVertical,
  RotateCcw,
  Play,
  Check,
} from "lucide-react";

interface Props {
  executionUnitId: string;
  /** يُخطر البطاقة الأم ببدء/إنهاء وضع التنفيذ لطيّ الأقسام. */
  onRunModeChange?: (running: boolean) => void;
}

type Mode = "idle" | "run" | "edit";

interface SessionItem {
  key: string;
  frame: VisualFrame;
}

/** طبقة تركيز بصري فوق الصورة بإحداثيات نسبية (0–1) دون تعديل الصورة. */
function FocusOverlay({ frame }: { frame: VisualFrame }) {
  const f = frame.focus;
  if (!f) return null;
  const pct = (n: number) => `${n * 100}%`;

  if (f.shape === "spotlight") {
    const id = `spot-${frame.frameId}`;
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id={id}>
            <rect width="100" height="100" fill="white" />
            <ellipse
              cx={f.x * 100}
              cy={f.y * 100}
              rx={(f.width * 100) / 2}
              ry={(f.height * 100) / 2}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100"
          height="100"
          fill="currentColor"
          className="text-foreground"
          opacity={f.opacity}
          mask={`url(#${id})`}
        />
      </svg>
    );
  }

  if (f.shape === "circle") {
    return (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full border-2 border-primary/60"
        style={{
          left: pct(f.x - f.width / 2),
          top: pct(f.y - f.height / 2),
          width: pct(f.width),
          height: pct(f.height),
          backgroundColor: `hsl(var(--primary) / ${f.opacity})`,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-xl border-2 border-primary/60"
      style={{
        left: pct(f.x),
        top: pct(f.y),
        width: pct(f.width),
        height: pct(f.height),
        backgroundColor: `hsl(var(--primary) / ${f.opacity})`,
      }}
    />
  );
}

/**
 * Pilot: التوضيح البصري لوحدة التنفيذ EXU-HOME-052-OP001-001.
 * تخصيص الجلسة في الذاكرة فقط — لا يُكتب أي شيء في ملفات المستودع.
 */
export function VisualFramePilot({ executionUnitId, onRunModeChange }: Props) {
  const recipe = useMemo(
    () => getRecipeByExecutionUnit(executionUnitId),
    [executionUnitId],
  );
  const defaultFrames = useMemo(
    () => (recipe ? getRecipeFrames(recipe) : []),
    [recipe],
  );

  const [mode, setModeState] = useState<Mode>("idle");
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [session, setSession] = useState<SessionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);
  const [showFocus, setShowFocus] = useState(true);

  const setMode = (m: Mode) => {
    setModeState(m);
    onRunModeChange?.(m === "run");
  };

  if (!recipe || defaultFrames.length === 0) return null;

  const currentOrder = order.length ? order : defaultFrames.map((f) => f.frameId);
  const orderedFrames = currentOrder
    .map((id) => defaultFrames.find((f) => f.frameId === id))
    .filter((f): f is VisualFrame => !!f);
  const activeFrames = orderedFrames.filter((f) => !hidden.includes(f.frameId));
  const orderChanged =
    order.length > 0 &&
    currentOrder.join("|") !== defaultFrames.map((f) => f.frameId).join("|");

  const startSession = (startFrameId?: string) => {
    if (activeFrames.length === 0) return;
    const items = activeFrames.map((f) => ({ key: `${f.frameId}-0`, frame: f }));
    const start = startFrameId
      ? Math.max(0, items.findIndex((i) => i.frame.frameId === startFrameId))
      : 0;
    setSession(items);
    setIndex(start);
    setMode("run");
  };

  const finish = () => {
    setSession([]);
    setIndex(0);
    setMode("idle");
  };

  const repeatCurrent = () => {
    const cur = session[index];
    if (!cur || !cur.frame.repeatable) return;
    const copy = [...session];
    copy.splice(index + 1, 0, {
      key: `${cur.frame.frameId}-${Date.now()}`,
      frame: cur.frame,
    });
    setSession(copy);
  };

  const move = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const next = [...currentOrder];
    const from = next.indexOf(fromId);
    const to = next.indexOf(toId);
    if (from < 0 || to < 0) return;
    next.splice(to, 0, next.splice(from, 1)[0]!);
    setOrder(next);
  };

  const restore = () => {
    setOrder([]);
    setHidden([]);
  };

  const current = session[index];
  const optionalNow = current ? isFrameOptional(recipe, current.frame.frameId) : false;
  const canSkip = !!current && (optionalNow || current.frame.skippable);
  const isLast = index >= session.length - 1;

  const skipCurrent = () => {
    const rest = session.filter((_, i) => i !== index);
    setSession(rest);
    setIndex((i) => Math.min(i, Math.max(0, rest.length - 1)));
    if (rest.length === 0) finish();
  };

  const numAr = ["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة", "السادسة"];
  const countAr = ["خطوة", "خطوتين", "ثلاث خطوات", "أربع خطوات", "خمس خطوات", "ست خطوات"];

  return (
    <Accordion
      type="single"
      collapsible
      className="space-y-2"
      value={mode === "run" ? "visual-frames" : undefined}
      defaultValue={undefined}
    >
      <AccordionItem
        value="visual-frames"
        className="overflow-hidden rounded-2xl border border-border/60 bg-card"
      >
        <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
          التوضيح البصري
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4" dir="rtl">
          {mode === "idle" && (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                تسلسل مصوّر قصير يعرض خطوة واحدة في كل مرة، ويمكن تعديله قبل البدء.
              </p>
              <Button className="w-full gap-2" onClick={() => startSession()}>
                <Play className="h-4 w-4" />
                ابدأ بالتسلسل المقترح
              </Button>
              <button
                type="button"
                onClick={() => setMode("edit")}
                className="w-full text-center text-sm font-semibold text-primary underline underline-offset-4"
              >
                تعديل الخطوات
              </button>
            </div>
          )}

          {mode === "run" && current && (
            <div className="space-y-3">
              {/* عنوان الخطوة فوق الصورة */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    الخطوة الحالية
                  </p>
                  <p className="truncate text-lg font-bold text-foreground">
                    {current.frame.titleAr}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="إجراءات إضافية">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" dir="rtl">
                    {current.frame.repeatable && (
                      <DropdownMenuItem onSelect={repeatCurrent}>
                        تكرار هذه الخطوة
                      </DropdownMenuItem>
                    )}
                    {index > 0 && (
                      <DropdownMenuItem onSelect={() => setIndex(0)}>
                        البدء من هذه الخطوة
                      </DropdownMenuItem>
                    )}
                    {current.frame.focus && (
                      <DropdownMenuItem onSelect={() => setShowFocus((v) => !v)}>
                        {showFocus ? "إخفاء طبقة التركيز" : "إظهار طبقة التركيز"}
                      </DropdownMenuItem>
                    )}
                    {orderChanged && (
                      <DropdownMenuItem
                        onSelect={() => {
                          restore();
                          finish();
                        }}
                      >
                        استعادة الترتيب المقترح
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* مؤشر النقاط */}
              <div
                role="img"
                aria-label={`الخطوة ${numAr[index] ?? index + 1} من ${
                  countAr[session.length - 1] ?? `${session.length} خطوات`
                }`}
                className="flex items-center justify-center gap-1.5"
              >
                {session.map((s, i) => (
                  <span
                    key={s.key}
                    className={`h-2 rounded-full transition-all ${
                      i === index ? "w-5 bg-primary" : "w-2 bg-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="mr-2 text-[11px] font-semibold text-muted-foreground">
                  {index + 1} من {session.length}
                </span>
              </div>

              <div className="relative mx-auto w-full overflow-hidden rounded-xl bg-muted/30">
                <img
                  src={current.frame.assetPath}
                  alt={current.frame.altTextAr}
                  loading="lazy"
                  className="mx-auto max-h-[42vh] w-full object-contain"
                />
                {showFocus && <FocusOverlay frame={current.frame} />}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {index > 0 ? (
                  <Button
                    variant="outline"
                    className="gap-1"
                    aria-label="الخطوة السابقة"
                    onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </Button>
                ) : (
                  <span />
                )}
                {isLast ? (
                  <Button className="gap-1" aria-label="إنهاء التسلسل" onClick={finish}>
                    <Check className="h-4 w-4" />
                    إنهاء
                  </Button>
                ) : (
                  <Button
                    className="gap-1"
                    aria-label="الخطوة التالية"
                    onClick={() => setIndex((i) => Math.min(session.length - 1, i + 1))}
                  >
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {canSkip && !isLast && (
                <button
                  type="button"
                  onClick={skipCurrent}
                  className="w-full text-center text-sm font-semibold text-primary underline underline-offset-4"
                >
                  تخطي هذه الخطوة
                </button>
              )}
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                اسحب البطاقة لتغيير ترتيبها، أو أخفِ الخطوة الاختيارية قبل البدء.
              </p>
              {orderChanged && (
                <p className="rounded-lg bg-gold/15 px-3 py-2 text-xs font-semibold text-primary">
                  تم تغيير الترتيب المقترح
                </p>
              )}
              <ul className="space-y-2">
                {orderedFrames.map((f) => {
                  const isHidden = hidden.includes(f.frameId);
                  const canHide = isFrameOptional(recipe, f.frameId);
                  return (
                    <li
                      key={f.frameId}
                      draggable={recipe.reorderAllowed}
                      onDragStart={() => setDragId(f.frameId)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragId) move(dragId, f.frameId);
                        setDragId(null);
                      }}
                      className={`flex items-center gap-3 rounded-xl border border-border/60 bg-background p-2 ${
                        isHidden ? "opacity-50" : ""
                      }`}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <img
                        src={f.assetPath}
                        alt={f.altTextAr}
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                      <span className="flex-1 text-sm font-semibold text-foreground">
                        {f.titleAr}
                        {canHide && (
                          <span className="mr-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            اختيارية
                          </span>
                        )}
                      </span>
                      {canHide && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          aria-label={isHidden ? "إظهار الخطوة" : "إخفاء الخطوة"}
                          onClick={() =>
                            setHidden((h) =>
                              h.includes(f.frameId)
                                ? h.filter((x) => x !== f.frameId)
                                : [...h, f.frameId],
                            )
                          }
                        >
                          {isHidden ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="gap-1" onClick={restore}>
                  <RotateCcw className="h-4 w-4" />
                  استعادة الترتيب المقترح
                </Button>
                <Button
                  className="gap-1"
                  disabled={activeFrames.length === 0}
                  onClick={() => startSession()}
                >
                  <Play className="h-4 w-4" />
                  ابدأ بهذا الترتيب
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setMode("idle")}
                className="w-full text-center text-sm font-semibold text-muted-foreground underline underline-offset-4"
              >
                رجوع
              </button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
