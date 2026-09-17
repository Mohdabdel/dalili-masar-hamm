import { useState } from "react";
import { Lock, Unlock, History, Printer, ChevronDown } from "lucide-react";
import { LabPage, LabSection, LabNote, LabButton, LabLinkButton } from "@/lab/components/lab-ui";
import { StepFrame } from "@/lab/components/StepFrame";
import { SPACE_SUPPORT_TOOLS } from "@/lab/data/space/catalog";
import { resolveSpaceSpec } from "@/features/space/spec-resolution";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";
import { considerationById } from "@/features/space/considerations-context";

export function CardsPage({ specId }: { specId: string }) {
  const base = useSpaceBase();
  const { state, dispatch } = useSlice();
  const spec = resolveSpaceSpec(specId, state.selections);
  const { snapshotsFor, supportAssetsFor } = useSliceHelpers();
  const assets = supportAssetsFor(specId);
  const snapshots = [...snapshotsFor(specId)].sort((a, b) => b.version - a.version);
  const participationClosed = state.closedSpecs.includes(specId);
  const specRuns = state.runs.filter((r) => snapshots.some((s) => s.id === r.snapshotId));
  // مشاركة مكتملة = مرّة انتهت فعلاً (endedAt). المرات المفتوحة/الموروثة تبقى
  // محفوظة في السجل ولا تُحتسب مشاركة مكتملة بلا دليل.
  const completedSpecRuns = specRuns.filter((r) => r.endedAt);
  const openSpecRuns = specRuns.length - completedSpecRuns.length;

  if (!spec) {
    return (
      <LabPage title="هذه المشاركة غير متاحة">
        <LabLinkButton to={`${base}`}>رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  return (
    <LabPage
      title={spec.title_ar}
      intro={`${spec.eventTitle_ar} — كل البطاقات هنا تنتمي إلى هذه المشاركة، حتى لو غطّت أجزاء مختلفة منها.`}
    >
      {snapshots.length === 0 ? (
        <LabNote>لا توجد بطاقة معتمدة بعد لهذه المشاركة.</LabNote>
      ) : (
        <LabSection title={`بطاقات معتمدة (${snapshots.length})`}>
          <ul className="space-y-4">
            {snapshots.map((snap) => {
              const closed = state.closedCards.includes(snap.id);
              const participationFrames = snap.frames.filter((f) => f.sourceStepId !== "__done__");
              const tools = snap.supportTools
                .map((id) => SPACE_SUPPORT_TOOLS.find((t) => t.id === id)?.label)
                .filter(Boolean);
              return (
                <li
                  key={snap.id}
                  className="rounded-2xl border border-border bg-card p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold">{snap.title_ar}</h3>
                      <p className="text-sm text-muted-foreground">
                        {snap.version === snapshots[0]?.version
                          ? "البطاقة المعتمدة الحالية"
                          : "بطاقة سابقة"}{" "}
                        — نسخة {snap.version} — {snap.date ?? snap.createdAt} —{" "}
                        {participationFrames.length} خطوة
                      </p>
                    </div>

                    {closed && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        بطاقة مغلقة
                      </span>
                    )}
                  </div>

                  <ol className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {participationFrames.map((f) => (
                      <li key={`${snap.id}-${f.order}`}>
                        <StepFrame asset={f.assetRef} label={f.text_short_ar} size="md" />
                        <p className="mt-1 text-center text-sm font-semibold leading-snug">
                          {f.text_short_ar}
                        </p>
                      </li>
                    ))}
                    <li
                      key={`${snap.id}-done`}
                      className="grid min-h-24 place-items-center rounded-2xl border border-dashed border-border p-3 text-center text-sm font-bold text-muted-foreground"
                    >
                      انتهينا
                    </li>
                  </ol>

                  {(snap.supportAssetIds ?? []).length > 0 && (
                    <div className="mb-3 rounded-xl border border-border bg-muted/40 p-3">
                      <p className="text-sm font-bold">مخرجات دعم مستقلة</p>
                      <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                        {(snap.supportAssetIds ?? []).map((id) => (
                          <li key={id}>
                            {assets.find((a) => a.id === id)?.label_ar ?? "مخرج دعم"} — خارج بطاقة
                            المشارك
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <SnapshotHistory runs={state.runs.filter((r) => r.snapshotId === snap.id)} />

                  {tools.length > 0 && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      ما قد يساعد: {tools.join("، ")} — خارج بطاقة المشارك.
                    </p>
                  )}

                  <SnapshotConsiderations ids={snap.considerationIds ?? []} />

                  <div className="flex flex-wrap gap-2">
                    <LabLinkButton
                      to={`${base}/learner/$snapshotId`}
                      params={{ snapshotId: snap.id }}
                    >
                      بطاقة المشارك
                    </LabLinkButton>
                    <LabButton
                      variant="ghost"
                      onClick={() =>
                        dispatch(
                          closed
                            ? { type: "card.reopen", snapshotId: snap.id }
                            : { type: "card.close", snapshotId: snap.id },
                        )
                      }
                    >
                      {closed ? (
                        <>
                          <Unlock className="h-4 w-4" aria-hidden />
                          إعادة فتح البطاقة
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" aria-hidden />
                          إغلاق البطاقة
                        </>
                      )}
                    </LabButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </LabSection>
      )}

      <LabSection
        title="سجل مرّات المشاركة"
        description="تكرار وسجل فقط — بلا إتقان ولا نسب ولا تقدّم."
      >
        {specRuns.length === 0 ? (
          <LabNote>لم تُفتح بطاقة هذه المشاركة للتنفيذ بعد.</LabNote>
        ) : completedSpecRuns.length === 0 ? (
          <LabNote>
            لا توجد مرة مكتملة بعد. هناك {openSpecRuns} مرة فُتحت ولم تُختم بـ«انتهينا».
          </LabNote>
        ) : (
          <>
            <p className="text-base font-semibold">
              شاركنا {completedSpecRuns.length} مرة — آخر مرة: {completedSpecRuns[0]?.date}
            </p>
            {openSpecRuns > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                وهناك {openSpecRuns} مرة فُتحت ولم تُختم بـ«انتهينا» — محفوظة في السجل دون احتسابها.
              </p>
            )}
          </>
        )}
      </LabSection>

      <LabSection title="حالة هذه المشاركة">
        <p className="mb-3 text-sm text-muted-foreground">
          {participationClosed
            ? "هذه المشاركة مغلقة الآن. كل البطاقات والمرات السابقة محفوظة كما هي."
            : "المشاركة مفتوحة. يمكنكم إغلاقها في أي وقت دون فقدان أي سجل."}
        </p>
        <LabButton
          variant="ghost"
          onClick={() =>
            dispatch(
              participationClosed
                ? { type: "participation.reopen", specId }
                : { type: "participation.close", specId },
            )
          }
        >
          {participationClosed ? "إعادة فتح المشاركة" : "إغلاق هذه المشاركة"}
        </LabButton>
      </LabSection>

      <div className="flex flex-wrap gap-3">
        <LabLinkButton to={`${base}/workspace/$specId`} params={{ specId }} variant="ghost">
          بطاقة جديدة لجزء آخر من نفس المشاركة
        </LabLinkButton>
        <LabLinkButton to={`${base}/participations`} variant="ghost">
          كل بطاقاتنا
        </LabLinkButton>
      </div>

      <div className="mt-6">
        <LabNote>إغلاق بطاقة يخصّ هذه البطاقة فقط، ولا يعني أن المشاركة كلها انتهت.</LabNote>
      </div>
    </LabPage>
  );
}

function SnapshotConsiderations({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  const [includeInExport, setIncludeInExport] = useState(false);
  const items = ids.map(considerationById).filter((item) => item !== null);
  const contentClass = includeInExport
    ? open
      ? "block print:block"
      : "hidden print:block"
    : open
      ? "block print:hidden"
      : "hidden";

  return (
    <section className="mb-3 rounded-xl border border-border bg-muted/20 p-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-center justify-between gap-3 text-start text-sm font-bold"
      >
        <span>
          اعتبارات قد تساعد
          <span className="ms-2 font-normal text-muted-foreground">
            ({items.length > 0 ? `${items.length} محفوظة` : "اختيارية"})
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      <div className={contentClass}>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            لم تحفظ الأسرة اعتبارات مع هذه النسخة. يمكن إضافتها من مساحة عمل الأسرة عند إعداد نسخة
            جديدة.
          </p>
        ) : (
          <div className="mt-2 border-t border-border pt-3">
            <h4 className="text-sm font-bold">اعتبارات للأسرة والداعم</h4>
            <ul className="mt-2 space-y-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.considerations}
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pe-5 text-sm">
                    {item.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-border pt-3 print:hidden">
          <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={includeInExport}
              onChange={(event) => setIncludeInExport(event.target.checked)}
              className="h-4 w-4"
            />
            إرفاق اعتبارات الأسرة عند الطباعة أو الحفظ كملف
          </label>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold hover:bg-accent"
          >
            <Printer className="h-4 w-4" aria-hidden />
            طباعة / حفظ
          </button>
        </div>
      )}
    </section>
  );
}

function SnapshotHistory({ runs }: { runs: { id: string; date: string; endedAt?: string }[] }) {
  if (runs.length === 0) return null;
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <History className="h-4 w-4" aria-hidden />
      <span>
        {runs.filter((r) => r.endedAt).length > 0
          ? `استُخدمت ${runs.filter((r) => r.endedAt).length} مرة — آخرها ${runs.filter((r) => r.endedAt)[0]?.date}`
          : `فُتحت ${runs.length} مرة دون ختام «انتهينا»`}
      </span>
    </div>
  );
}
