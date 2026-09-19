// أمثلة الاستكشاف المعتمدة لهذه التجربة؛ لا يغيّر هذا سجل المعرفة أو بطاقات الأسرة المحفوظة.
export const CURATED_EXPLORE = {
  event: [
    { eventId: "EV-HOSTING", specId: "GJ-MODERATE-001", title: "ضيافة الأسرة" },
    { eventId: "COMM-002", specId: "FR-B02-COMM-002-OP001", title: "نزهة عائلية" },
    { eventId: "SHOP-005", specId: "FR-EXP12-02-SHOP005-OP003", title: "شراء الخضار والفواكه" },
    { eventId: "HEALTH-007", specId: "FR-EXP12-02-HEALTH007-OP010", title: "زيارة جهة صحية" },
  ],
  station: [
    { eventId: "FOOD-002", specId: "FR-EXP12-FOOD-002-OP002", title: "إعداد الغداء" },
    { eventId: "HOME-002", specId: "FR-EXP12-02-HOME002-OP005", title: "ترتيب غرفة المعيشة" },
    { eventId: "CLO-011", specId: "FR-B03-CLO-011-OP001", title: "قبل غسل الملابس" },
    { eventId: "CLO-016", specId: "FR-EXP12-CLO-016-OP001", title: "ترتيب الملابس النظيفة" },
  ],
} as const;

export function curatedBySpec(specId: string) {
  if (CURATED_EXPLORE.event.some((item) => item.specId === specId)) return "event";
  if (CURATED_EXPLORE.station.some((item) => item.specId === specId)) return "station";
  return null;
}

export function curatedByEvent(eventId: string) {
  return [...CURATED_EXPLORE.event, ...CURATED_EXPLORE.station].find((item) => item.eventId === eventId);
}
