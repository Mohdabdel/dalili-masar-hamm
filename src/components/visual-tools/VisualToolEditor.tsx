import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisualToolImagePicker } from "./VisualToolImagePicker";
import { VisualToolPreview } from "./VisualToolPreview";
import { resolveItemImage } from "@/lib/visual-tools/resolve-image";
import {
  addItem,
  moveItem,
  removeItem,
  toggleItemHidden,
  updateItem,
  updateProject,
} from "@/lib/visual-tools/store";
import { getToolMeta, type VisualToolLayout, type VisualToolProject } from "@/lib/visual-tools/types";

const LAYOUTS: { value: VisualToolLayout; label: string }[] = [
  { value: "list", label: "قائمة رأسية" },
  { value: "grid2", label: "شبكة عمودين" },
  { value: "grid3", label: "شبكة ثلاثة أعمدة" },
];

/**
 * النواة الوحيدة لتحرير كل أدوات الوسائل الداعمة (الخمس).
 * الحفظ تلقائي في مخزن الأسرة المحلي عند كل تعديل.
 */
export function VisualToolEditor({ project }: { project: VisualToolProject }) {
  const meta = getToolMeta(project.type);
  const items = [...project.items].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="vt-title" className="text-sm font-semibold">
              اسم الأداة
            </Label>
            <Input
              id="vt-title"
              value={project.title}
              onChange={(e) => updateProject(project.id, { title: e.target.value })}
              className="min-h-11 text-right"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">طريقة العرض</Label>
            <Select
              value={project.layout}
              onValueChange={(v) => updateProject(project.id, { layout: v as VisualToolLayout })}
            >
              <SelectTrigger dir="rtl" className="min-h-11 text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {LAYOUTS.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          يُحفظ العمل تلقائيًا على جهازك. هذه أداة خاصة بأسرتك ولا تُضاف إلى محتوى دليلي العام.
        </p>
      </div>

      <Tabs defaultValue="edit" dir="rtl" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit" className="min-h-11 text-xs font-semibold">
            التحرير
          </TabsTrigger>
          <TabsTrigger value="preview" className="min-h-11 text-xs font-semibold">
            المعاينة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-3">
          {items.map((item, idx) => {
            const src = resolveItemImage(item);
            return (
              <div
                key={item.id}
                className={`rounded-2xl border border-border bg-card p-3 shadow-sm ${
                  item.hidden ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] text-muted-foreground">
                      بدون صورة
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    <Label htmlFor={`item-${item.id}`} className="text-xs text-muted-foreground">
                      {meta.itemLabelAr} {idx + 1}
                    </Label>
                    <Input
                      id={`item-${item.id}`}
                      value={item.text}
                      onChange={(e) => updateItem(project.id, item.id, { text: e.target.value })}
                      placeholder="اكتب نصًا قصيرًا وواضحًا"
                      className="min-h-11 text-right"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <VisualToolImagePicker
                        current={item}
                        onSelect={(v) => updateItem(project.id, item.id, v)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => toggleItemHidden(project.id, item.id)}
                      >
                        {item.hidden ? (
                          <>
                            <EyeOff className="h-4 w-4" /> مخفي
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" /> ظاهر
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="تحريك لأعلى"
                        onClick={() => moveItem(project.id, item.id, -1)}
                        disabled={idx === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="تحريك لأسفل"
                        onClick={() => moveItem(project.id, item.id, 1)}
                        disabled={idx === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="حذف العنصر"
                        className="text-destructive"
                        onClick={() => removeItem(project.id, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="secondary"
            className="min-h-12 w-full gap-2 text-sm font-semibold"
            onClick={() => addItem(project.id)}
          >
            <Plus className="h-4 w-4" />
            {meta.addLabelAr}
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="space-y-3">
          <VisualToolPreview project={project} />
          <Button
            type="button"
            variant="outline"
            className="min-h-12 w-full gap-2"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            طباعة أو حفظ PDF
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
