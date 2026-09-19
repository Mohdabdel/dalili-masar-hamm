import { useEffect, useRef, useState } from "react";
import { listFamilyImages, uploadFamilyImage } from "@/features/space/family-uploads";

export function FamilyPhotoLibrary({ onSelect }: { onSelect: (path: string) => void }) {
  const [photos, setPhotos] = useState<{ path: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setError("");
    try { setPhotos(await listFamilyImages()); }
    catch { setError("تعذّر عرض صور الأسرة. أعيدوا المحاولة بعد التحقق من الاتصال وتسجيل الدخول."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    let failed = 0;
    for (const file of Array.from(files)) {
      try { await uploadFamilyImage(file); }
      catch { failed++; }
    }
    await refresh();
    if (failed) setError(`تعذّر رفع ${failed} من الصور. تحققوا من نوع الملف وحجمه ثم حاولوا مجددًا.`);
    setUploading(false);
  };

  return <div className="mt-3 rounded-xl border border-border p-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-bold">صور الأسرة المحفوظة</h3>
      <button type="button" disabled={uploading} onClick={() => input.current?.click()}
        className="min-h-11 rounded-xl border border-border px-3 text-sm font-bold disabled:opacity-50">
        {uploading ? "جارٍ رفع الصور…" : "أضيفوا صورًا من الجهاز"}
      </button>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" aria-label="إضافة عدة صور إلى صور الأسرة"
        onChange={(event) => { void upload(event.target.files); event.target.value = ""; }} />
    </div>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error} <button type="button" onClick={() => void refresh()} className="underline">إعادة المحاولة</button></p>}
    {loading ? <p role="status" className="mt-2 text-sm">جارٍ تحميل الصور…</p>
      : photos.length ? <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">{photos.map((photo, index) =>
        <li key={photo.path}><button type="button" onClick={() => onSelect(photo.path)}
          aria-label={`اختيار صورة الأسرة ${index + 1}`} className="h-20 w-full overflow-hidden rounded-xl border border-border focus-visible:ring-2 focus-visible:ring-ring">
          <img src={photo.url} alt="" loading="lazy" className="h-full w-full object-cover" />
        </button></li>)}</ul>
      : <p className="mt-2 text-sm text-muted-foreground">لا توجد صور محفوظة بعد. يمكنكم رفع عدة صور ثم اختيار ما يلائم كل خطوة.</p>}
  </div>;
}
