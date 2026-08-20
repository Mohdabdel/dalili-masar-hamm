import { useMemo, useRef, useState } from "react";
import { ImagePlus, Link2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRenderableVisualAssets } from "@/lib/visual-asset-catalog";
import type { ImageSource } from "@/lib/visual-tools/types";

interface Props {
  current: { imageSource: ImageSource; imageAssetId: string | null; imageUrl: string | null };
  onSelect: (
    value: Pick<
      { imageSource: ImageSource; imageAssetId: string | null; imageUrl: string | null },
      "imageSource" | "imageAssetId" | "imageUrl"
    >,
  ) => void;
}

/**
 * منتقي صورة واحد لكل الأدوات:
 * مكتبة الأصول Canonical الحالية (لا مكتبة صور جديدة) + صورة خاصة بالأسرة (رفع أو رابط).
 */
export function VisualToolImagePicker({ current, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [url, setUrl] = useState(current.imageSource === "url" ? (current.imageUrl ?? "") : "");
  const fileRef = useRef<HTMLInputElement>(null);

  const assets = useMemo(() => {
    const all = getRenderableVisualAssets();
    const q = query.trim();
    return q ? all.filter((a) => a.titleAr.includes(q) || a.assetCode.includes(q)) : all;
  }, [query]);

  function pickAsset(code: string) {
    onSelect({ imageSource: "asset", imageAssetId: code, imageUrl: null });
    setOpen(false);
  }

  function pickUrl(value: string) {
    if (!value.trim()) return;
    onSelect({ imageSource: "url", imageAssetId: null, imageUrl: value.trim() });
    setOpen(false);
  }

  function onFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSelect({ imageSource: "url", imageAssetId: null, imageUrl: String(reader.result) });
      setOpen(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-1.5">
          <ImagePlus className="h-4 w-4" />
          {current.imageSource === "none" ? "إضافة صورة" : "تغيير الصورة"}
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-lg text-right">
        <DialogHeader>
          <DialogTitle className="text-right">اختيار صورة</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" dir="rtl" className="space-y-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library" className="text-xs font-semibold">
              مكتبة دليلي
            </TabsTrigger>
            <TabsTrigger value="private" className="text-xs font-semibold">
              صورة خاصة بالأسرة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الصور المتاحة"
              className="text-right"
            />
            <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
              {assets.map((a) => (
                <button
                  key={a.assetCode}
                  type="button"
                  onClick={() => pickAsset(a.assetCode)}
                  className="overflow-hidden rounded-xl border border-border bg-card text-right transition hover:border-primary"
                >
                  <img
                    src={a.assetPath as string}
                    alt={a.titleAr}
                    loading="lazy"
                    className="h-20 w-full object-cover"
                  />
                  <span className="block px-1.5 py-1 text-[11px] leading-tight">{a.titleAr}</span>
                </button>
              ))}
              {assets.length === 0 && (
                <p className="col-span-3 py-6 text-center text-sm text-muted-foreground">
                  لا توجد صور مطابقة.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-3">
            <p className="text-xs text-muted-foreground">
              الصور الخاصة تُحفظ على جهازك فقط ولا تُشارك مع أحد.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="secondary"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              رفع صورة من الجهاز
            </Button>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="أو الصق رابط صورة"
                className="text-right"
              />
              <Button type="button" onClick={() => pickUrl(url)} className="gap-1.5">
                <Link2 className="h-4 w-4" />
                استخدام
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {current.imageSource !== "none" && (
          <Button
            type="button"
            variant="ghost"
            className="w-full gap-2 text-destructive"
            onClick={() => {
              onSelect({ imageSource: "none", imageAssetId: null, imageUrl: null });
              setOpen(false);
            }}
          >
            <X className="h-4 w-4" />
            إزالة الصورة
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
