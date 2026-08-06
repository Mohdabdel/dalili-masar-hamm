import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Repeat,
  RotateCcw,
  Play,
  X,
} from "lucide-react";

interface Props {
  executionUnitId: string;
}

type Mode = "idle" | "run" | "edit";

interface SessionItem {
  key: string;
  frame: VisualFrame;
}

/**
 * Pilot: التوضيح البصري لوحدة التنفيذ EXU-HOME-052-OP001-001.
 * تخصيص الجلسة في الذاكرة فقط — لا يُكتب أي شيء في ملفات المستودع.
 */
export function VisualFramePilot({ executionUnitId }: Props) {
  const recipe = useMemo(
    () => getRecipeByExecutionUnit(executionUnitId),
    [executionUnitId],
  );
  const defaultFrames = useMemo(
    () => (recipe ? getRecipeFrames(recipe) : []),
    [recipe],
  );

  const [mode, setMode] = useState<Mode>("idle");
  const [order, setOrder] = useState<string[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [session, setSession] = useState<SessionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);

  if (!recipe || defaultFrames.length === 0) return null;

  const currentOrder = order.length ? order : defaultFrames.map((f) => f.frameId);
  const orderedFrames = currentOrder
    .map((id) => defaultFrames.find((f) => f.frameId === id))
    .filter((f): f is VisualFrame => !!f);
  const activeFrames = orderedFrames.filter((f) => !hidden.includes(f.frameId));

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

  return (
    <Accordion type="single" collapsible className="space-y-2">
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
              <img
                src={current.frame.assetPath}
                alt={current.frame.altTextAr}
                loading="lazy"
                className="w-full rounded-xl object-cover"
              />
              <div className="text-center">
                <p className="text-base font-bold text-foreground">
                  {current.frame.titleAr}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {index + 1} من {session.length}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="gap-1"
                  disabled={index === 0}
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
                <Button
                  className="gap-1"
                  disabled={index >= session.length - 1}
                  onClick={() => setIndex((i) => Math.min(session.length - 1, i + 1))}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {optionalNow && current.frame.skippable && (
                  <Button
                    variant="ghost"
                    className="text-primary"
                    onClick={() => {
                      const rest = session.filter((_, i) => i !== index);
                      setSession(rest);
                      setIndex((i) => Math.min(i, Math.max(0, rest.length - 1)));
                      if (rest.length === 0) finish();
                    }}
                  >
                    تخطي
                  </Button>
                )}
                {current.frame.repeatable && (
                  <Button variant="ghost" className="gap-1 text-primary" onClick={repeatCurrent}>
                    <Repeat className="h-4 w-4" />
                    تكرار هذه الخطوة
                  </Button>
                )}
                <Button variant="ghost" className="col-span-2 gap-1" onClick={finish}>
                  <X className="h-4 w-4" />
                  إنهاء
                </Button>
              </div>
            </div>
          )}

          {mode === "edit" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                اسحب البطاقة لتغيير ترتيبها، أو اضغط «ابدأ من هنا» للبدء من خطوة معيّنة.
              </p>
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
                      <div className="flex shrink-0 items-center gap-1">
                        {canHide && (
                          <Button
                            variant="ghost"
                            size="icon"
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
                        {!isHidden && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={() => startSession(f.frameId)}
                          >
                            ابدأ من هنا
                          </Button>
                        )}
                      </div>
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
                  ابدأ بالتسلسل
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
