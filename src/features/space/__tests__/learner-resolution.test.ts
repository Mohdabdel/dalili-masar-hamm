import { describe, expect, it } from "vitest";
import { resolveLearnerLaunch } from "@/features/space/learner-resolution";
import type { LabCardSnapshot } from "@/lab/slice/types";

const frame = (id: string) =>
  ({ id: `f-${id}`, order: 1, sourceStepId: id, text_short_ar: "خطوة" }) as unknown as LabCardSnapshot["frames"][number];

const snap = (id: string, spec: string, version: number, frames = [frame("s1")]) =>
  ({
    id,
    version,
    participationSpecId: spec,
    frames,
    supportTools: [],
    createdAt: "2026-01-01",
    title_ar: "بطاقة",
  }) as unknown as LabCardSnapshot;

const v1 = snap("snap-1", "SPEC-A", 1);
const v2 = snap("snap-2", "SPEC-A", 2);
const other = snap("snap-x", "SPEC-B", 1);
const all = [v1, v2, other];

describe("resolveLearnerLaunch", () => {
  it("يفتح النسخة المُختارة صراحةً فقط", () => {
    const r = resolveLearnerLaunch({ snapshotId: "snap-1", approvedSnapshots: all });
    expect(r.ok).toBe(true);
    expect(r.snapshot?.id).toBe("snap-1");
    expect(r.snapshot?.version).toBe(1);
  });

  it("وجود نسخة أحدث لا يغيّر الاختيار", () => {
    expect(resolveLearnerLaunch({ snapshotId: "snap-1", approvedSnapshots: all }).snapshot?.id).toBe("snap-1");
  });

  it("بلا اختيار = منع بلا رجوع للأحدث", () => {
    const r = resolveLearnerLaunch({ snapshotId: null, approvedSnapshots: all });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("missing-selection");
    expect(r.snapshot).toBeNull();
  });

  it("معرّف غير موجود/غير مملوك = منع بلا بديل", () => {
    const r = resolveLearnerLaunch({ snapshotId: "ghost", approvedSnapshots: all });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("not-found");
  });

  it("نسخة تخص مشاركة أسرية أخرى = منع", () => {
    const r = resolveLearnerLaunch({ snapshotId: "snap-x", approvedSnapshots: all, expectedSpecId: "SPEC-A" });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("wrong-participation");
  });

  it("نسخة بلا خطوات = منع", () => {
    const empty = snap("snap-e", "SPEC-A", 3, [frame("__done__")]);
    const r = resolveLearnerLaunch({ snapshotId: "snap-e", approvedSnapshots: [empty] });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("empty");
  });
});
