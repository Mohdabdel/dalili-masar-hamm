import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { COMMUNITY_PILOT_EVENTS } from "../community-pilot-corpus";
import { CURATED_EXPLORE } from "../curated-explore";
import { getSpaceSpec } from "@/lab/data/space/catalog";

vi.mock("@/features/space/store", () => ({ useSpaceBase: () => "/space" }));
vi.mock("@/lab/components/lab-ui", () => {
  const Container = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  const Link = ({ to, params, children, title }: { to: string; params?: Record<string, string>; children?: ReactNode; title?: string }) => (
    <a href={Object.entries(params ?? {}).reduce((url, [key, value]) => url.replace(`$${key}`, value), to)}>{title ?? children}</a>
  );
  return { LabPage: Container, LabSection: Container, LabGrid: Container, LabNote: Container, LabChoiceCard: Link, LabLinkButton: Link, LabBackLink: Link };
});

import { ExplorePage } from "../pages/ExplorePage";
import { EventParticipationsPage } from "../pages/EventParticipationsPage";

describe("hidden community pilot", () => {
  it.each(["event", "station"] as const)("keeps only the four approved choices in the %s lens", (lens) => {
    const html = renderToStaticMarkup(<ExplorePage initialLens={lens} />);
    expect((html.match(/href="\/space\/workspace\//g) ?? []).length).toBe(4);
    for (const item of CURATED_EXPLORE[lens]) expect(html).toContain(`/space/workspace/${item.specId}`);
    for (const event of COMMUNITY_PILOT_EVENTS) expect(html).not.toContain(event.id);
  });

  it("does not offer pilot participation selection through old event links", () => {
    for (const event of COMMUNITY_PILOT_EVENTS) {
      const html = renderToStaticMarkup(<EventParticipationsPage eventId={event.id} />);
      expect(html).toContain('href="/space/explore"');
      for (const participation of event.participations) expect(html).not.toContain(participation.id);
    }
  });

  it("still resolves all 16 existing pilot spec references without modifying them", () => {
    const participations = COMMUNITY_PILOT_EVENTS.flatMap((event) => event.participations);
    expect(participations).toHaveLength(16);
    for (const participation of participations) expect(getSpaceSpec(participation.id)?.id).toBe(participation.id);
  });
});