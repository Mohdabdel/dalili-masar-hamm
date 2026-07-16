import type { HomeDomain } from "./home-hierarchy";
import { knowledgeDomains } from "./knowledge-base";
import { getCommunityDomains } from "./knowledge-base";
import { supportPortal } from "./support-portal";

export type SearchKind = "home" | "community" | "services";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  domain: string;
  activityOrService: string;
  event?: string;
  opportunity: string;
  route: string; // /activities/home | /activities/community | /resources
  hasCard: boolean;
  needsOutside?: boolean;
  needsTools?: boolean;
  expectedMinutes?: number;
  keywords: string[];
}

function collectParticipation(
  kind: "home" | "community",
  domains: HomeDomain[],
): SearchItem[] {

  const items: SearchItem[] = [];
  const route = kind === "home" ? "/activities/home" : "/activities/community";
  for (const d of domains) {
    for (const a of d.activities) {
      for (const e of a.events) {
        for (const o of e.opportunities) {
          const c = o.card;
          items.push({
            id: o.id,
            kind,
            title: c?.title ?? o.name,
            domain: d.name,
            activityOrService: a.name,
            event: e.name,
            opportunity: o.name,
            route,
            hasCard: !!c,
            needsOutside: c?.needsOutside ?? (kind === "community"),
            needsTools: c?.needsTools,
            expectedMinutes: c?.expectedMinutes,
            keywords: c?.keywords ?? [],
          });
        }
      }
    }
  }
  return items;
}

function collectServices(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const d of supportPortal) {
    for (const s of d.services) {
      for (const o of s.opportunities) {
        const c = o.card;
        items.push({
          id: o.id,
          kind: "services",
          title: c?.title ?? o.name,
          domain: d.name,
          activityOrService: s.name,
          opportunity: o.name,
          route: "/resources",
          hasCard: !!c,
          needsOutside: c?.needsOutside,
          needsTools: c?.needsTools,
          keywords: c?.keywords ?? [],
        });
      }
    }
  }
  return items;
}

export const searchIndex: SearchItem[] = [
  ...collectParticipation("home", knowledgeDomains),
  ...collectParticipation("community", getCommunityDomains()),
  ...collectServices(),
];

export const kindLabel: Record<SearchKind, string> = {
  home: "منزلي",
  community: "مجتمعي",
  services: "دعم وخدمات",
};
