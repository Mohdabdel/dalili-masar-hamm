import { useMemo, useRef, useState } from "react";
import { LabPage, LabSection, LabNote, LabLinkButton, LabBackLink } from "@/lab/components/lab-ui";
import { StepBlocks, type ComposerItem } from "@/lab/components/space/FamilyComposer";
import { StepComposer, type ComposerStepRow } from "@/features/space/components/StepComposer";
import { FamilyPhotoLibrary } from "@/features/space/components/FamilyPhotoLibrary";
import { ConsiderationsPanel } from "@/features/space/components/ConsiderationsPanel";
import { buildDraftSelection, flatSteps, sourceTextFor } from "@/lab/data/space/catalog";
import { hasReferenceWording, resolveSpaceSpec } from "@/features/space/spec-resolution";
import { createFamilyBlock, isFamilyBlockId } from "@/features/space/family-blocks";
import {
  participationImagePaths,
  participationImageSrc,
} from "@/features/space/participation-image";
import { stepImageOptions } from "@/features/space/step-image";
import { resolveStepImage, resolvedAssetCode } from "@/features/space/step-image";
import { uploadFamilyImage, useUploadedUrls } from "@/features/space/family-uploads";
import {
  composeDraft,
  imageRefFor as composeImageRefFor,
  imageVisibleFor as composeImageVisibleFor,
  textVisibleFor as composeTextVisibleFor,
} from "@/features/space/compose";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import { curatedBySpec } from "@/features/space/curated-explore";
import type {
  LabParticipationImage,
  LabStepImageRef,
  LabThisTimeSelection,
} from "@/lab/slice/types";

export function WorkspacePage({ specId, initialTab }: { specId: string; initialTab?: "tools" }) {
  const base = useSpaceBase();
  const { state, dispatch } = useSlice();
  const spec = resolveSpaceSpec(specId, state.selections);
  const { snapshotsFor } = useSliceHelpers();
  const [newBlockText, setNewBlockText] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [activeTab, setActiveTab] = useState<"draft" | "considerations" | "tools">(initialTab ?? "draft");
  const participationFileRef = useRef<HTMLInputElement | null>(null);

  const versions = snapshotsFor(specId);

  // المسودة الفعلية تُحسب في نفس دورة العرض الأولى:
  // إمّا مسودة الأسرة المحفوظة، أو المسودة المرجعية الجاهزة — بلا استبدال بعد التركيب.
  const selection: LabThisTimeSelection = useMemo(() => {
    const saved = state.selections[specId];
    if (saved) return saved;
    if (spec) return buildDraftSelection(spec);
    return {
      specId,
      selected: [],
      chosenExecutionOptionByStepId: {},
      supportTools: [],
    };
  }, [state.selections, spec, specId]);

  const leaves = useMemo(() => {
    if (!spec) return [];
    return flatSteps(spec).filter(
      (e) => !e.isMajor || spec.majorSteps.find((m) => m.id === e.step.id)?.substeps.length === 0,
    );
  }, [spec]);

  // صور الأسرة المرفوعة محفوظة كمسارات تخزين — نشتق روابطها الموقّعة قبل العرض.
  const participationImage = state.participationImages[specId] ?? null;

  const uploadedPaths = useMemo(
    () => [
      ...Object.values(selection.imageRefByStepId ?? {})
        .map((ref) => ref?.uploadedPath ?? "")
        .filter((p): p is string => Boolean(p)),
      ...participationImagePaths(participationImage),
    ],
    [selection.imageRefByStepId, participationImage],
  );
  const uploadsTick = useUploadedUrls(uploadedPaths);

  if (!spec) {
    return (
      <LabPage
        title="هذه المشاركة غير متاحة"
        intro="لم نجد المشاركة المرجعية لهذا الرابط. اختاروا مشاركة من قوائم دليلي ثم افتحوا مساحة العمل."
      >
        <div className="flex flex-wrap gap-3">
          <LabLinkButton to={`${base}`}>رجوع إلى مساحة الأسرة</LabLinkButton>
          <LabLinkButton to="/activities/level" variant="ghost">
            اختيار مشاركة جديدة
          </LabLinkButton>
        </div>
      </LabPage>
    );
  }

  const setSelection = (next: Partial<LabThisTimeSelection>) =>
    dispatch({ type: "selection", value: { ...selection, ...next, specId } });

  const setFamilyTitle = (title: string) => {
    if (!selection.familySpec) return;
    setSelection({
      familySpec: {
        ...selection.familySpec,
        title_ar: title,
      },
    });
  };

  const renumber = (ids: string[]) => ids.map((stepId, i) => ({ stepId, order: i + 1 }));
  const orderedIds = [...selection.selected].sort((a, b) => a.order - b.order).map((s) => s.stepId);

  const startId = orderedIds[0] ?? "";
  const endId = orderedIds[orderedIds.length - 1] ?? "";

  const withRange = (ids: string[]) => ({
    selected: renumber(ids),
    startStepId: ids[0],
    endStepId: ids[ids.length - 1],
  });

  const addStep = (stepId: string) => {
    // الترتيب المرجعي يحدد موضع الخطوة المرجعية المُعادة، وكتل الأسرة تبقى في مواضعها.
    const reference = leaves.map((l) => l.step.id);
    const beforeIds = reference.slice(0, reference.indexOf(stepId));
    const insertAt = (() => {
      for (let i = orderedIds.length - 1; i >= 0; i -= 1) {
        if (beforeIds.includes(orderedIds[i])) return i + 1;
      }
      return 0;
    })();
    const next = [...orderedIds];
    next.splice(insertAt, 0, stepId);
    setSelection(withRange(next));
  };

  /** كتلة تنفيذ من كتابة الأسرة — هوية ثابتة خاصة بها، بلا نص مرجعي. */
  const addFamilyBlock = () => {
    const text = newBlockText.trim();
    if (!text) return;
    const block = createFamilyBlock(text);
    setSelection({
      familyBlocks: [...(selection.familyBlocks ?? []), block],
      ...withRange([...orderedIds, block.id]),
    });
    setNewBlockText("");
  };

  const removeStep = (stepId: string) => {
    if (orderedIds.length <= 1) return;
    setSelection(withRange(orderedIds.filter((id) => id !== stepId)));
  };

  const move = (stepId: string, direction: -1 | 1) => {
    const i = orderedIds.indexOf(stepId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= orderedIds.length) return;
    const next = [...orderedIds];
    [next[i], next[j]] = [next[j], next[i]];
    setSelection(withRange(next));
  };

  const applyRange = (nextStartId: string, nextEndId: string) => {
    const ids = orderedIds;
    const a = ids.indexOf(nextStartId);
    const b = ids.indexOf(nextEndId);
    if (a < 0 || b < 0) return;
    const [from, to] = a <= b ? [a, b] : [b, a];
    // كتل الأسرة ليست جزءاً من الترتيب المرجعي — تبقى بمواضعها النسبية.
    const next = ids.slice(from, to + 1);
    orderedIds.forEach((id, index) => {
      if (isFamilyBlockId(id)) next.splice(Math.min(index, next.length), 0, id);
    });
    setSelection(withRange(next));
  };

  // ---------- كتلة الصورة وكتلة العبارة: حالتان مستقلتان ----------

  const imageRefFor = (stepId: string): LabStepImageRef | null =>
    composeImageRefFor(spec, selection, stepId);

  const imageVisibleFor = (stepId: string) => composeImageVisibleFor(selection, stepId);

  const textVisibleFor = (stepId: string) => composeTextVisibleFor(selection, stepId);

  /** يحافظ على توافق الحقول القديمة (presentation/visual) دون ربط الحالتين ببعضهما. */
  const syncLegacy = (
    stepId: string,
    imageVisible: boolean,
    textVisible: boolean,
    src: string | null,
  ) => ({
    presentationByStepId: {
      ...(selection.presentationByStepId ?? {}),
      [stepId]:
        imageVisible && textVisible
          ? ("both" as const)
          : imageVisible
            ? ("visual" as const)
            : ("text" as const),
    },
    visualByStepId: { ...(selection.visualByStepId ?? {}), [stepId]: src ?? "" },
  });

  const toggleImage = (stepId: string, visible: boolean) => {
    const src = resolveStepImage(imageRefFor(stepId)).src;
    setSelection({
      imageVisibleByStepId: { ...(selection.imageVisibleByStepId ?? {}), [stepId]: visible },
      ...syncLegacy(stepId, visible, textVisibleFor(stepId), src),
    });
  };

  const toggleText = (stepId: string, visible: boolean) => {
    const src = resolveStepImage(imageRefFor(stepId)).src;
    setSelection({
      textVisibleByStepId: { ...(selection.textVisibleByStepId ?? {}), [stepId]: visible },
      ...syncLegacy(stepId, imageVisibleFor(stepId), visible, src),
    });
  };

  const pickImage = (stepId: string, assetCode: string | null) => {
    const ref: LabStepImageRef | null = assetCode ? { sourceAssetCode: assetCode } : null;
    const src = resolveStepImage(ref).src;
    setSelection({
      imageRefByStepId: { ...(selection.imageRefByStepId ?? {}), [stepId]: ref },
      ...syncLegacy(stepId, imageVisibleFor(stepId), textVisibleFor(stepId), src),
    });
  };

  /** رفع صورة من جهاز الأسرة إلى مخزنها الخاص واختيارها للخطوة. */
  const uploadImage = async (stepId: string, file: File) => {
    try {
      const path = await uploadFamilyImage(file);
      const ref: LabStepImageRef = { sourceAssetCode: "", uploadedPath: path };
      const src = resolveStepImage(ref).src;
      setSelection({
        imageRefByStepId: { ...(selection.imageRefByStepId ?? {}), [stepId]: ref },
        ...syncLegacy(stepId, imageVisibleFor(stepId), textVisibleFor(stepId), src),
      });
    } catch {
      window.alert("لم نستطع رفع الصورة. جرّبوا صورة أخرى أو أعيدوا المحاولة.");
    }
  };

  const pickFamilyImage = (stepId: string, path: string) => {
    const ref: LabStepImageRef = { sourceAssetCode: "", uploadedPath: path };
    setSelection({
      imageRefByStepId: { ...(selection.imageRefByStepId ?? {}), [stepId]: ref },
      ...syncLegacy(stepId, imageVisibleFor(stepId), textVisibleFor(stepId), ""),
    });
  };

  const setText = (stepId: string, text: string) =>
    setSelection({
      familyTextByStepId: { ...(selection.familyTextByStepId ?? {}), [stepId]: text },
    });

  const resetText = (stepId: string) => {
    if (isFamilyBlockId(stepId)) return; // لا مرجع لاسترجاعه
    setText(stepId, sourceTextFor(spec, stepId));
  };

  // ---------- صورة المشاركة ككل ----------

  const setParticipationImage = (value: LabParticipationImage | null) =>
    dispatch({ type: "participationImage.set", specId, value });

  const uploadParticipationImage = async (file: File) => {
    try {
      const path = await uploadFamilyImage(file);
      setParticipationImage({ source: "family_upload", uploadedPath: path });
    } catch {
      window.alert("لم نستطع رفع الصورة. جرّبوا صورة أخرى أو أعيدوا المحاولة.");
    }
  };

  const composed = composeDraft(spec, selection);
  const safeComposed = composed;
  void uploadsTick;
  const participationSrc = participationImageSrc(participationImage);

  const rows: ComposerStepRow[] = safeComposed.map((r) => ({
    stepId: r.stepId,
    sourceText: r.sourceText,
    familyText: r.familyText,
    image: r.image,
    imageVisible: r.imageVisible,
    textVisible: r.textVisible,
    familyAuthored: r.familyAuthored,
  }));

  const previewItems: ComposerItem[] = safeComposed.map((r) => ({
    stepId: r.stepId,
    familyText: r.textVisible ? r.familyText : "",
    visual: r.imageVisible ? r.image.src : null,
    presentation: r.imageVisible ? (r.textVisible ? "both" : "visual") : "text",
    blockOrder: r.blockOrder,
  }));

  const spares = leaves
    .filter((l) => !orderedIds.includes(l.step.id))
    .map((l) => ({ stepId: l.step.id, label: l.step.instruction_family_ar }));

  /** اعتبار تحتفظ به الأسرة مع هذه المشاركة — اختياري ولا يظهر للمشارك. */
  const toggleConsideration = (id: string, next: boolean) => {
    const current = selection.considerationIds ?? [];
    setSelection({
      considerationIds: next ? [...new Set([...current, id])] : current.filter((c) => c !== id),
    });
  };

  return (
    <LabPage
      title={spec.title_ar}
      intro={spec.eventTitle_ar}
      back={base === "/space" && curatedBySpec(specId)
        ? <LabBackLink to="/space/explore" search={{ lens: curatedBySpec(specId) }}>الاستكشاف</LabBackLink>
        : (!selection.origin || selection.origin === "reference") && spec.eventId
        ? <LabBackLink to={`${base}/$eventId/participations`} params={{ eventId: spec.eventId }}>اختيار المشاركة</LabBackLink>
        : selection.origin === "family_free" && base === "/space"
          ? <LabBackLink to="/">الصفحة الرئيسية</LabBackLink>
          : <LabBackLink to={`${base}`}>مساحة الأسرة</LabBackLink>}
    >
      <div role="tablist" aria-label="أقسام إعداد المشاركة" className="sticky top-0 z-20 -mx-4 mb-5 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
        <button type="button" role="tab" id="draft-tab" aria-controls="draft-panel" aria-selected={activeTab === "draft"}
          onClick={() => setActiveTab("draft")}
          className={`min-h-11 shrink-0 rounded-xl px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === "draft" ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
          إعداد المشاركة
        </button>
        <button type="button" role="tab" id="considerations-tab" aria-controls="considerations-panel" aria-selected={activeTab === "considerations"}
          onClick={() => setActiveTab("considerations")}
          className={`min-h-11 shrink-0 rounded-xl px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === "considerations" ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
          اعتبارات أثناء التطبيق
        </button>
        <button type="button" role="tab" id="tools-tab" aria-controls="tools-panel" aria-selected={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
          className={`min-h-11 shrink-0 rounded-xl px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeTab === "tools" ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
          أدوات ووسائل داعمة
        </button>
      </div>
      <div id="draft-panel" role="tabpanel" aria-labelledby="draft-tab" hidden={activeTab !== "draft"}>
      {selection.origin === "family_free" && selection.familySpec && (
        <LabSection
          title="اسم المشاركة"
          description="سمّوها كما تعرفها أسرتكم. يمكنكم تغييره أثناء البناء."
        >
          <input
            type="text"
            value={
              selection.familySpec.title_ar === "مشاركة جديدة" ? "" : selection.familySpec.title_ar
            }
            onChange={(event) => setFamilyTitle(event.target.value)}
            placeholder="مثال: غسيل السيارة"
            className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </LabSection>
      )}
      <LabSection
        title="مسودّتنا"
        description={selection.origin === "family_free"
          ? "اكتبوا خطوات مشاركتكم بالترتيب، ثم أضيفوا العبارة والصورة التي تناسب كل خطوة."
          : "هذه خطوات المشاركة كما اقترحتها دليلي. أبقوا ما يناسبكم، واحذفوا ما لا تحتاجونه."}
      >
        <StepComposer
          rows={rows}
          onText={setText}
          onResetText={resetText}
          onToggleImage={toggleImage}
          onToggleText={toggleText}
          onPickImage={pickImage}
          onUploadImage={uploadImage}
          onPickFamilyImage={pickFamilyImage}
          onMove={move}
          onRemove={removeStep}
          showSourceText={hasReferenceWording(spec)}
        />
        {rows.length <= 1 && <LabNote>تبقى خطوة واحدة على الأقل في مسودّتكم.</LabNote>}

        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card p-3">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">أضيفوا خطوة من كتابتكم</span>
            <input
              type="text"
              value={newBlockText}
              onChange={(e) => setNewBlockText(e.target.value)}
              placeholder="مثال: يمسك الوعاء بكلتا يديه"
              className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="button"
            onClick={addFamilyBlock}
            disabled={!newBlockText.trim()}
            className="mt-2 min-h-11 rounded-xl border border-border px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            أضيفوها إلى مسودّتنا
          </button>
          <p className="mt-1 text-xs text-muted-foreground">
            خطوة تصف كيف تنفّذون هذه المشاركة معاً. لا تغيّر معنى المشاركة نفسها.
          </p>
        </div>
      </LabSection>

      <LabSection
        title="صورة المشاركة كلها (اختيارية)"
        description="صورة واحدة تمثّل المشاركة بكاملها — غير صور الخطوات، وغير وسائل الدعم."
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-40">
            {participationSrc ? (
              <img
                src={participationSrc}
                alt="صورة المشاركة كلها"
                className="aspect-[4/3] w-full rounded-2xl border border-border object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] w-full place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-2 text-center text-xs font-bold text-muted-foreground">
                بلا صورة للمشاركة
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => participationFileRef.current?.click()}
              className="min-h-11 rounded-xl border border-border px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {participationSrc ? "استبدلوا الصورة (رفع)" : "ارفعوا صورة للمشاركة"}
            </button>
            <input
              ref={participationFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="رفع صورة المشاركة كلها"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadParticipationImage(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => setShowImagePicker((v) => !v)}
              aria-expanded={showImagePicker}
              className="min-h-11 rounded-xl border border-border px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              اختاروا من الصور الجاهزة
            </button>
            {participationImage && (
              <button
                type="button"
                onClick={() => setParticipationImage(null)}
                className="min-h-11 rounded-xl border border-border px-4 text-sm font-bold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                أزيلوا صورة المشاركة
              </button>
            )}
          </div>
        </div>
        <FamilyPhotoLibrary onSelect={(path) => setParticipationImage({ source: "family_upload", uploadedPath: path })} />
        {showImagePicker && (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {stepImageOptions().map((option) => (
              <li key={option.code}>
                <button
                  type="button"
                  title={option.title}
                  onClick={() => {
                    setParticipationImage({ source: "family_library", assetCode: option.code });
                    setShowImagePicker(false);
                  }}
                  className="block h-20 w-full overflow-hidden rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <img
                    src={option.src}
                    alt={option.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </LabSection>

      <LabSection title="نبدأ من… ونتوقف عند…">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-bold">نبدأ من</span>
            <select
              value={startId}
              onChange={(e) => applyRange(e.target.value, endId || e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {rows.map((row) => (
                <option key={row.stepId} value={row.stepId}>
                  {row.familyText}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold">نتوقف عند</span>
            <select
              value={endId}
              onChange={(e) => applyRange(startId || e.target.value, e.target.value)}
              className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {rows.map((row) => (
                <option key={row.stepId} value={row.stepId}>
                  {row.familyText}
                </option>
              ))}
            </select>
          </label>
        </div>
      </LabSection>

      {spares.length > 0 && (
        <details className="rounded-2xl border border-border bg-card p-3">
          <summary className="cursor-pointer text-sm font-bold">
            خطوات أخرى يمكن إضافتها ({spares.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {spares.map((s) => (
              <li key={s.stepId} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-semibold">{s.label}</span>
                <button
                  type="button"
                  onClick={() => addStep(s.stepId)}
                  className="min-h-11 shrink-0 rounded-xl border border-border px-3 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  أضيفوها
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <LabSection
        title="كيف ستظهر البطاقة"
        description="لمحة سريعة. المعاينة الكاملة والاعتماد في الخطوة التالية."
      >
        {rows.length === 0 ? (
          <LabNote>أضيفوا خطوة واحدة على الأقل.</LabNote>
        ) : (
          <div className="mx-auto max-w-sm">
            <p className="mb-2 text-center text-sm font-bold text-muted-foreground">
              أول خطوة من {previewItems.length}
            </p>
            <div className="rounded-2xl border border-border bg-card p-2">
              <StepBlocks item={previewItems[0]} index={1} />
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <LabLinkButton to={`${base}/preview/$specId`} params={{ specId }}>
            صمّم بطاقة المشاركة
          </LabLinkButton>
          {versions.length > 0 && (
            <LabLinkButton to={`${base}/card/$specId`} params={{ specId }} variant="ghost">
              بطاقات هذه المشاركة ({versions.length})
            </LabLinkButton>
          )}
        </div>
        {versions.length > 0 && (
          <LabNote>
            بطاقتكم المعتمدة الحالية تبقى كما هي. أي تعديل هنا لا يغيّرها، وعند الاعتماد تُضاف بطاقة
            جديدة.
          </LabNote>
        )}
      </LabSection>

      </div>
      <div id="considerations-panel" role="tabpanel" aria-labelledby="considerations-tab" hidden={activeTab !== "considerations"}>
      <ConsiderationsPanel
        spec={spec}
        texts={rows.map((r) => r.familyText)}
        stepCount={rows.length}
        selectedIds={selection.considerationIds ?? []}
        onToggle={toggleConsideration}
      />
      </div>

      <div id="tools-panel" role="tabpanel" aria-labelledby="tools-tab" hidden={activeTab !== "tools"}>
      <div className="mt-2">
        <LabLinkButton to="/tools" search={base === "/space" ? { source: "workspace", specId } : undefined} variant="ghost">
          أدوات ووسائل داعمة
        </LabLinkButton>
      </div>
      </div>
    </LabPage>
  );
}
