import { describe, expect, it } from "vitest";
import {
  COMMUNITY_PILOT_CORPUS,
  COMMUNITY_PILOT_EVENTS,
  pilotEventById,
  pilotParticipationById,
  pilotSpecById,
  pilotSpecsForEvent,
} from "../community-pilot-corpus";
import { getSpaceSpec } from "@/lab/data/space/catalog";
import { getAllEvents } from "@/lib/knowledge-base";

const allPilotParticipations = COMMUNITY_PILOT_EVENTS.flatMap((e) => e.participations);

describe("community-pilot-corpus: عقد العينة", () => {
  it("8 أحداث مجتمعية، مشاركتان فقط لكل حدث (16 مشاركة)", () => {
    expect(COMMUNITY_PILOT_EVENTS).toHaveLength(8);
    for (const event of COMMUNITY_PILOT_EVENTS) {
      expect(event.participations).toHaveLength(2);
    }
    expect(allPilotParticipations).toHaveLength(16);
  });

  it("معرفات تجريبية غير متعارضة: بادئة PILOT وفريدة ولا تصادم مكتبة المعرفة", () => {
    const eventIds = COMMUNITY_PILOT_EVENTS.map((e) => e.id);
    expect(new Set(eventIds).size).toBe(eventIds.length);
    for (const id of eventIds) expect(id).toMatch(/^PILOT-EV-COMM-\d{3}$/);

    const partIds = allPilotParticipations.map((p) => p.id);
    expect(new Set(partIds).size).toBe(partIds.length);
    for (const id of partIds) expect(id).toMatch(/^PILOT-COMM-\d{3}-OP\d{3}$/);

    const libraryIds = new Set<string>();
    for (const ctx of getAllEvents()) {
      libraryIds.add(ctx.event.id);
      for (const opp of ctx.event.opportunities) libraryIds.add(opp.id);
    }
    for (const id of [...eventIds, ...partIds]) expect(libraryIds.has(id)).toBe(false);
  });

  it("المعرفات المصدرية محفوظة في provenance ومعلنة المصدر", () => {
    for (const event of COMMUNITY_PILOT_EVENTS) {
      for (const p of event.participations) {
        expect(p.provenance.corpus).toBe(COMMUNITY_PILOT_CORPUS);
        expect(p.provenance.corpus).toBe("community-pilot-corpus");
        expect(p.provenance.sourceEventId).toMatch(/^COMM-\d{3}$/);
        expect(p.provenance.sourceParticipationId).toMatch(/^COMM-\d{3}-OP\d{3}$/);
        expect(p.id).toBe(`PILOT-${p.provenance.sourceParticipationId}`);
        expect(p.eventId).toBe(event.id);
      }
    }
  });

  it("كل مشاركة تلتزم بعقد دليلي: دور ونتيجة ونهاية طبيعية وخطوتان فأكثر", () => {
    for (const p of allPilotParticipations) {
      expect(p.title.trim().length).toBeGreaterThan(0);
      expect(p.role.trim().length).toBeGreaterThan(0);
      expect(p.outcome.trim().length).toBeGreaterThan(0);
      expect(p.naturalEnding.trim().length).toBeGreaterThan(0);
      expect(p.steps.length).toBeGreaterThanOrEqual(2);
      for (const step of p.steps) expect(step.trim().length).toBeGreaterThan(0);
    }
  });

  it("لغة أسرية يومية: بلا مصطلحات تعليم/تدريب/علاج/تقييم/تدخل", () => {
    const banned = [/تعليم/, /تدريب/, /علاج/, /تقييم/, /تدخّ?ل/, /معالجة/];
    for (const p of allPilotParticipations) {
      const text = [p.title, p.role, p.outcome, p.naturalEnding, p.support, ...p.steps].join(" ");
      for (const word of banned) expect(text).not.toMatch(word);
    }
  });

  it("بلا حقول مستوى أو بيئة في مصدر العينة — المستوى قيمة داخلية فقط", () => {
    for (const p of allPilotParticipations) {
      expect(Object.keys(p)).not.toContain("level");
      expect(Object.keys(p)).not.toContain("environment");
    }
    for (const event of COMMUNITY_PILOT_EVENTS) {
      for (const spec of pilotSpecsForEvent(event.id)) {
        expect(spec.level).toBe("moderate");
        expect(spec.provenance).toBe("community_pilot");
        expect(spec.context).toBe("community");
      }
    }
  });
});

describe("community-pilot-corpus: سلامة الربط event → participation", () => {
  it("pilotSpecsForEvent تعيد مشاركتي الحدث بعنوانه ومعرّفه", () => {
    for (const event of COMMUNITY_PILOT_EVENTS) {
      const specs = pilotSpecsForEvent(event.id);
      expect(specs).toHaveLength(2);
      for (const spec of specs) {
        expect(spec.eventId).toBe(event.id);
        expect(spec.eventTitle_ar).toBe(event.title);
        expect(spec.majorSteps.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("pilotSpecById وpilotParticipationById يحلّان كل معرّف ويرفضان الغريب", () => {
    for (const p of allPilotParticipations) {
      expect(pilotParticipationById(p.id)?.id).toBe(p.id);
      const spec = pilotSpecById(p.id);
      expect(spec?.id).toBe(p.id);
      expect(spec?.eventId).toBe(p.eventId);
      expect(spec?.title_ar).toBe(p.title);
    }
    expect(pilotSpecById("PILOT-COMM-999-OP999")).toBeNull();
    expect(pilotParticipationById("KB-COMM-002-OP001")).toBeNull();
    expect(pilotEventById("COMM-002")).toBeNull();
  });

  it("الكتالوج يحلّ المعرّفات التجريبية عبر getSpaceSpec (مسار مساحة العمل)", () => {
    for (const p of allPilotParticipations) {
      const spec = getSpaceSpec(p.id);
      expect(spec).not.toBeNull();
      expect(spec?.id).toBe(p.id);
      expect(spec?.provenance).toBe("community_pilot");
      expect(spec?.majorSteps.map((s) => s.order)).toEqual(
        p.steps.map((_, i) => i + 1),
      );
    }
  });

  it("النصوص تُنقل كما هي: الخطوة الكاملة instruction_family_ar والمختصرة مشتقة منها", () => {
    for (const p of allPilotParticipations) {
      const spec = pilotSpecById(p.id)!;
      spec.majorSteps.forEach((step, i) => {
        expect(step.instruction_family_ar).toBe(p.steps[i]);
        expect(step.instruction_short_ar.length).toBeGreaterThan(0);
        expect(p.steps[i]).toContain(step.instruction_short_ar.split(" ")[0]);
      });
    }
  });
});
