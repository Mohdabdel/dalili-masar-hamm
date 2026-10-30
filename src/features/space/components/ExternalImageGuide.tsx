import { useId, useState } from "react";
import { buildStepImagePrompt, EXTERNAL_IMAGE_TOOLS } from "../image-generation-guide";

/** إرشاد اختياري؛ نسخ ولصق خارجيان بلا اتصال آلي أو إرسال بيانات. */
export function ExternalImageGuide({ stepText }: { stepText: string }) {
  const id = useId();
  const [description, setDescription] = useState(stepText);
  const [message, setMessage] = useState("");
  const prompt = buildStepImagePrompt(description);
  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setMessage("نُسخت المواصفة. افتحوا أداة التوليد والصقوها هناك.");
    } catch {
      setMessage("تعذّر النسخ التلقائي. حدّدوا المواصفة في المربع أدناه وانسخوها يدويًا.");
    }
  }
  return (
    <details className="rounded-xl border border-border bg-muted/20 p-3">
      <summary className="min-h-11 cursor-pointer text-sm font-bold">توليد صورة خارج دليلي</summary>
      <div className="mt-3 space-y-3">
        <p className="text-sm">عدّلوا وصف الفعل، وانسخوا المواصفة إلى أداة تختارونها. راجعوا الصورة واحفظوها، ثم عودوا إلى «رفع صورة من الجهاز».</p>
        <label htmlFor={id} className="block text-sm font-bold">وصف الصورة المطلوبة</label>
        <textarea id={id} value={description} onChange={(event) => {
          setDescription(event.target.value); setMessage("");
        }} rows={2} className="w-full rounded-xl border border-border bg-background p-3 text-base" />
        <button type="button" onClick={copy} className="min-h-11 rounded-xl bg-primary px-4 font-bold text-primary-foreground">نسخ مواصفة التوليد</button>
        <p role="status" className="text-sm">{message}</p>
        <label htmlFor={id + "-prompt"} className="block text-sm font-bold">المواصفة الجاهزة للنسخ</label>
        <textarea id={id + "-prompt"} readOnly value={prompt} rows={8} className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
        <p className="text-xs text-muted-foreground">يفتح الرابط أداة خارجية؛ لا يُرسل دليلي وصف الخطوة إليها تلقائيًا. قد تتطلب حسابًا أو رصيدًا. استخدموا وصفًا عامًا دون أسماء أو تفاصيل خاصة.</p>
        <ul className="flex flex-wrap gap-3">
          {EXTERNAL_IMAGE_TOOLS.map((tool) => <li key={tool.href}>
            <a href={tool.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline">{tool.name} — يفتح خارج دليلي</a>
          </li>)}
        </ul>
      </div>
    </details>
  );
}
