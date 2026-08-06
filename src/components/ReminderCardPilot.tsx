import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getReminderAssetByExecutionUnit,
  createSharingInstance,
  resolveMessage,
  validatePlace,
  validateTime,
  encodePayload,
  toPayload,
  type PlaceError,
} from "@/lib/reminder-assets";
import { Clock, MapPin, Bell, Copy, Share2, Pencil, Check, X } from "lucide-react";

interface Props {
  executionUnitId: string;
  /** يُخطر البطاقة الأم ببدء/إنهاء وضع الاستخدام لطيّ بقية الأقسام. */
  onUseModeChange?: (using: boolean) => void;
}

type Mode = "idle" | "form" | "preview" | "use" | "share";

const PLACE_ERRORS: Record<PlaceError, string> = {
  empty: "أدخل اسم المكان.",
  too_long: "اسم المكان طويل، الحد 60 حرفًا.",
  multiline: "اكتب اسم المكان في سطر واحد.",
  link: "لا تستخدم روابط هنا، اكتب اسم المكان العام فقط.",
};

/** بطاقة التذكير القابلة للإرسال — نموذج أولي داخل الجلسة فقط. */
export function ReminderCardPilot({ executionUnitId, onUseModeChange }: Props) {
  const asset = useMemo(
    () => getReminderAssetByExecutionUnit(executionUnitId),
    [executionUnitId],
  );

  const [mode, setMode] = useState<Mode>("idle");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [touched, setTouched] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [status, setStatus] = useState("");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  useEffect(() => {
    onUseModeChange?.(mode === "use");
  }, [mode, onUseModeChange]);

  if (!asset || asset.status !== "Ready") return null;

  const placeError = validatePlace(place);
  const timeOk = validateTime(time);
  const canPreview = timeOk && placeError === null;
  const message = canPreview ? resolveMessage(asset, time, place) : "";

  const copy = async (text: string, okMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(okMsg);
    } catch {
      setStatus("تعذّر النسخ، انسخ النص يدويًا.");
    }
  };

  const buildLink = () => {
    const instance = createSharingInstance(asset, time, place);
    if (!instance) {
      setStatus("أكمل الوقت والمكان أولًا.");
      return;
    }
    const url = `${window.location.origin}/reminder?c=${encodePayload(toPayload(instance))}`;
    setShareUrl(url);
    setStatus("");
    setMode("share");
  };

  const webShare = async () => {
    try {
      await navigator.share({ title: asset.titleAr, text: message, url: shareUrl });
      setStatus("تمت المشاركة.");
    } catch {
      /* ألغى المستخدم */
    }
  };

  return (
    <section
      dir="rtl"
      aria-labelledby="reminder-pilot-title"
      className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft"
    >
      <div className="mb-3 flex items-center gap-2">
        <Bell className="h-4 w-4 text-primary" aria-hidden="true" />
        <h4 id="reminder-pilot-title" className="text-sm font-bold text-foreground">
          بطاقة تذكير
        </h4>
      </div>

      {mode === "idle" && (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            أضف وقت الموعد ومكانه لإنشاء بطاقة واضحة يمكن استخدامها أو إرسالها.
          </p>
          <Button size="sm" className="min-h-11" onClick={() => setMode("form")}>
            إعداد التذكير
          </Button>
        </div>
      )}

      {mode === "form" && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (canPreview) {
              setStatus("");
              setMode("preview");
            }
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="reminder-time">وقت الموعد</Label>
            <Input
              id="reminder-time"
              type="time"
              value={time}
              required
              onChange={(e) => setTime(e.target.value)}
              onBlur={() => setTouched(true)}
              className="min-h-11 text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reminder-place">مكان الموعد</Label>
            <Input
              id="reminder-place"
              type="text"
              inputMode="text"
              maxLength={60}
              value={place}
              autoComplete="off"
              aria-describedby="reminder-place-hint"
              aria-invalid={touched && placeError !== null}
              onChange={(e) => setPlace(e.target.value.replace(/[\r\n]/g, ""))}
              onBlur={() => setTouched(true)}
              className="min-h-11 text-base"
            />
            <p id="reminder-place-hint" className="text-xs leading-relaxed text-muted-foreground">
              استخدم اسم المكان العام فقط، مثل: المركز أو المكتبة.
            </p>
            <p aria-live="polite" className="min-h-4 text-xs font-semibold text-destructive">
              {touched && placeError ? PLACE_ERRORS[placeError] : ""}
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" size="sm" className="min-h-11" disabled={!canPreview}>
              معاينة البطاقة
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="min-h-11"
              onClick={() => setMode("idle")}
            >
              إلغاء
            </Button>
          </div>
        </form>
      )}

      {(mode === "preview" || mode === "use" || mode === "share") && (
        <div className="space-y-4">
          <ReminderVisual title={asset.titleAr} message={message} />

          {mode === "preview" && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 gap-1.5"
                  onClick={() => setMode("form")}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  تعديل
                </Button>
                <Button size="sm" className="min-h-11" onClick={() => setMode("use")}>
                  استخدام البطاقة
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-11 w-full gap-1.5"
                onClick={buildLink}
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                إرسال إلى جهاز آخر
              </Button>
            </div>
          )}

          {mode === "use" && (
            <Button
              size="sm"
              variant="outline"
              className="min-h-11 w-full gap-1.5"
              onClick={() => setMode("preview")}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              إنهاء
            </Button>
          )}

          {mode === "share" && (
            <div className="space-y-3 rounded-xl border border-border/60 bg-background p-3">
              {!online && (
                <p className="text-xs font-semibold leading-relaxed text-foreground">
                  يمكن نسخ نص التذكير الآن وإرسال الرابط عند توفر الاتصال.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11 gap-1.5"
                  onClick={() => copy(shareUrl, "نُسخ الرابط.")}
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  نسخ الرابط
                </Button>
                {typeof navigator !== "undefined" && "share" in navigator && (
                  <Button size="sm" variant="outline" className="min-h-11 gap-1.5" onClick={webShare}>
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    مشاركة
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="min-h-11 gap-1.5"
                  onClick={() => copy(message, "نُسخ نص التذكير.")}
                >
                  نسخ النص
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="min-h-11 w-full"
                onClick={() => setMode("preview")}
              >
                رجوع
              </Button>
            </div>
          )}

          <p
            aria-live="polite"
            className="min-h-5 text-xs font-semibold text-primary"
          >
            {status && (
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                {status}
              </span>
            )}
          </p>
        </div>
      )}
    </section>
  );
}

/** العرض البصري لبطاقة التذكير — يُستخدم داخل البطاقة وفي شاشة الاستلام. */
export function ReminderVisual({ title, message }: { title: string; message: string }) {
  return (
    <div
      dir="rtl"
      className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center shadow-card-soft"
    >
      <p className="text-xs font-semibold text-primary">{title}</p>
      <div className="my-3 flex items-center justify-center gap-4 text-primary" aria-hidden="true">
        <Clock className="h-7 w-7" />
        <MapPin className="h-7 w-7" />
      </div>
      <p className="select-text text-lg font-bold leading-relaxed text-foreground">{message}</p>
    </div>
  );
}
