/**
 * DALILI-SUPPORT-DIRECTORIES-PRODUCTION-INJECTION-01
 * طبقة بيانات «مصادر الدعم المجتمعي» و«مصادر الدعم التعليمي».
 *
 * القاعدة الحاكمة: Structure Frozen — Content Mutable.
 * مصدر الحقيقة: src/data/support-directories/*.csv فقط.
 * لا بيانات ثابتة داخل المكوّنات، ولا حذف للسجلات (التعطيل عبر is_active=false).
 * مستقلة تمامًا عن ملفات المعرفة 01–04 وعن بطاقات المشاركة.
 */

import providersCsv from "@/data/support-directories/01_providers.csv?raw";
import servicesCsv from "@/data/support-directories/02_services.csv?raw";
import resourcesCsv from "@/data/support-directories/03_resources.csv?raw";
import collectionsCsv from "@/data/support-directories/04_collections.csv?raw";
import { parseCsv } from "@/lib/execution-frames";

// ---------------------------------------------------------------- types

export type Completeness = "COMPLETE" | "NEARLY_COMPLETE" | "PARTIAL" | string;
export type Priority = "HIGH" | "MEDIUM" | "LOW" | string;
export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | string;

interface OperationalFields {
  isActive: boolean;
  featured: boolean;
  displayOrder: number;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  updatedAt: string;
}

export interface Provider extends OperationalFields {
  id: string;
  nameAr: string;
  nameEn: string;
  providerType: string;
  emirate: string;
  website: string;
}

export interface Service extends OperationalFields {
  id: string;
  providerId: string;
  serviceDomain: string;
  nameAr: string;
  targetAge: string;
  serviceCompleteness: Completeness;
  userPriority: Priority;
  confidenceLevel: string;
  accessMethod: string;
  serviceScope: string;
}

export interface Resource extends OperationalFields {
  id: string;
  titleAr: string;
  resourceType: string;
  publisher: string;
  targetAudience: string;
  qualityNotes: string;
  confidenceLevel: string;
  serviceCompleteness: Completeness;
  officialUrl: string;
}

export interface Collection extends OperationalFields {
  id: string;
  titleAr: string;
  descriptionAr: string;
  memberType: string;
  memberIds: string[];
}

export interface ServiceWithProvider {
  service: Service;
  provider: Provider | undefined;
}

// ---------------------------------------------------------------- parsing

const bool = (v: string | undefined) => (v ?? "").trim().toLowerCase() === "true";
const num = (v: string | undefined) => {
  const n = Number.parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 9999;
};
const ops = (r: Record<string, string>): OperationalFields => ({
  isActive: bool(r["is_active"]),
  featured: bool(r["featured"]),
  displayOrder: num(r["display_order"]),
  lastVerified: (r["last_verified"] ?? "").trim(),
  verificationStatus: (r["verification_status"] ?? "").trim(),
  updatedAt: (r["updated_at"] ?? "").trim(),
});

export function parseProvidersCsv(text: string): Provider[] {
  return parseCsv(text).map((r) => ({
    id: r["provider_id"]!.trim(),
    nameAr: (r["name_ar"] ?? "").trim(),
    nameEn: (r["name_en"] ?? "").trim(),
    providerType: (r["provider_type"] ?? "").trim(),
    emirate: (r["emirate"] ?? "").trim(),
    website: (r["website"] ?? "").trim(),
    ...ops(r),
  }));
}

export function parseServicesCsv(text: string): Service[] {
  return parseCsv(text).map((r) => ({
    id: r["service_id"]!.trim(),
    providerId: (r["provider_id"] ?? "").trim(),
    serviceDomain: (r["service_domain"] ?? "").trim(),
    nameAr: (r["service_name_ar"] ?? "").trim(),
    targetAge: (r["target_age_if_stated"] ?? "").trim(),
    serviceCompleteness: (r["service_completeness"] ?? "").trim(),
    userPriority: (r["user_priority"] ?? "").trim(),
    confidenceLevel: (r["confidence_level"] ?? "").trim(),
    accessMethod: (r["access_method"] ?? "").trim(),
    serviceScope: (r["service_scope"] ?? "").trim(),
    ...ops(r),
  }));
}

export function parseResourcesCsv(text: string): Resource[] {
  return parseCsv(text).map((r) => ({
    id: r["resource_id"]!.trim(),
    titleAr: (r["title_ar"] ?? "").trim(),
    resourceType: (r["resource_type"] ?? "").trim(),
    publisher: (r["publisher"] ?? "").trim(),
    targetAudience: (r["target_audience"] ?? "").trim(),
    qualityNotes: (r["quality_notes"] ?? "").trim(),
    confidenceLevel: (r["confidence_level"] ?? "").trim(),
    serviceCompleteness: (r["service_completeness"] ?? "").trim(),
    officialUrl: (r["official_url"] ?? "").trim(),
    ...ops(r),
  }));
}

export function parseCollectionsCsv(text: string): Collection[] {
  return parseCsv(text).map((r) => ({
    id: r["collection_id"]!.trim(),
    titleAr: (r["title_ar"] ?? "").trim(),
    descriptionAr: (r["description_ar"] ?? "").trim(),
    memberType: (r["member_type"] ?? "").trim(),
    memberIds: (r["member_ids"] ?? "")
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean),
    ...ops(r),
  }));
}

// ---------------------------------------------------------------- store

interface DirectoryStore {
  providers: Provider[];
  services: Service[];
  resources: Resource[];
  collections: Collection[];
}

const store: DirectoryStore = {
  providers: parseProvidersCsv(providersCsv),
  services: parseServicesCsv(servicesCsv),
  resources: parseResourcesCsv(resourcesCsv),
  collections: parseCollectionsCsv(collectionsCsv),
};

/** استيراد دفعة CSV جديدة دون تعديل المكوّنات (Content Mutable). */
export function importDirectoryCsv(input: {
  providers?: string;
  services?: string;
  resources?: string;
  collections?: string;
}): void {
  if (input.providers) store.providers = parseProvidersCsv(input.providers);
  if (input.services) store.services = parseServicesCsv(input.services);
  if (input.resources) store.resources = parseResourcesCsv(input.resources);
  if (input.collections) store.collections = parseCollectionsCsv(input.collections);
}

type Entity = "providers" | "services" | "resources" | "collections";

/** إضافة أو تحديث سجل (Upsert) بالمعرّف. */
export function upsertRecord<T extends { id: string }>(entity: Entity, record: T): void {
  const list = store[entity] as unknown as T[];
  const i = list.findIndex((r) => r.id === record.id);
  if (i === -1) list.push(record);
  else list[i] = { ...list[i]!, ...record };
}

/** التعطيل بدل الحذف — لا يُحذف أي سجل نهائيًا. */
export function deactivateRecord(entity: Entity, id: string): boolean {
  const list = store[entity] as unknown as { id: string; isActive: boolean }[];
  const rec = list.find((r) => r.id === id);
  if (!rec) return false;
  rec.isActive = false;
  return true;
}

export function activateRecord(entity: Entity, id: string): boolean {
  const list = store[entity] as unknown as { id: string; isActive: boolean }[];
  const rec = list.find((r) => r.id === id);
  if (!rec) return false;
  rec.isActive = true;
  return true;
}

// ---------------------------------------------------------------- labels

export const EMIRATE_LABELS: Record<string, string> = {
  "Abu Dhabi": "أبوظبي",
  Dubai: "دبي",
  Sharjah: "الشارقة",
  Ajman: "عجمان",
  "Umm Al Quwain": "أم القيوين",
  "Ras Al Khaimah": "رأس الخيمة",
  Fujairah: "الفجيرة",
  Federal: "على مستوى الدولة",
};

export const DOMAIN_LABELS: Record<string, string> = {
  "Vocational Education": "التدريب والتأهيل المهني",
  "Special Education": "التربية الخاصة والتأهيل",
  "Higher Education": "التعليم العالي وتسهيلات الطلبة",
  "Transition Services": "خدمات الانتقال",
  Transportation: "النقل والتنقل",
  Sports: "الرياضة",
  Culture: "الثقافة والفعاليات",
  "Accessibility & Facilitation": "التسهيلات وإمكانية الوصول",
  "Financial Support": "الدعم المالي",
  "Family / Peer Support": "دعم الأسرة والأقران",
};

export const ACCESS_LABELS: Record<string, string> = {
  Online: "عن بُعد",
  Visit: "حضوري",
  Mixed: "حضوري وعن بُعد",
};

export const SCOPE_LABELS: Record<string, string> = {
  City: "على مستوى المدينة",
  Emirate: "على مستوى الإمارة",
  Federal: "على مستوى الدولة",
};

export const PROVIDER_TYPE_LABELS: Record<string, string> = {
  Government: "جهة حكومية",
  Nonprofit: "جهة غير ربحية",
  Private: "جهة خاصة",
  University: "جامعة",
};

export const COMPLETENESS_LABELS: Record<string, string> = {
  COMPLETE: "بيانات مكتملة",
  NEARLY_COMPLETE: "قيد استكمال التحقق",
  PARTIAL: "قيد استكمال التحقق",
};

export const AGE_LABELS: Record<string, string> = {
  "All Ages": "كل الأعمار",
  Adults: "البالغون",
  "Adults/Youth": "البالغون والشباب",
  "Youth/Adults": "الشباب والبالغون",
  "Teens/Adults": "المراهقون والبالغون",
  "Under 60": "أقل من 60 سنة",
  "16+": "16 سنة فأكثر",
  "15-25": "15 – 25 سنة",
};

export const label = (map: Record<string, string>, key: string) => map[key] ?? key;


// ---------------------------------------------------------------- selectors

/** المجالات التي تُعرض ضمن «مصادر الدعم التعليمي». */
export const EDUCATION_DOMAINS = [
  "Special Education",
  "Higher Education",
  "Vocational Education",
  "Transition Services",
] as const;

const byOrder = (a: Service, b: Service) =>
  a.displayOrder - b.displayOrder || a.id.localeCompare(b.id);

export const getProviders = (): Provider[] => store.providers.filter((p) => p.isActive);
export const getAllProviders = (): Provider[] => [...store.providers];
export const getProviderById = (id: string): Provider | undefined =>
  store.providers.find((p) => p.id === id);

export const getActiveServices = (): Service[] =>
  store.services.filter((s) => s.isActive).sort(byOrder);

export const getAllServices = (): Service[] => [...store.services];

export const getEducationServices = (): Service[] =>
  getActiveServices().filter((s) =>
    (EDUCATION_DOMAINS as readonly string[]).includes(s.serviceDomain),
  );

export const getCommunityServices = (): Service[] =>
  getActiveServices().filter(
    (s) => !(EDUCATION_DOMAINS as readonly string[]).includes(s.serviceDomain),
  );

export const getServicesByProvider = (providerId: string): Service[] =>
  getActiveServices().filter((s) => s.providerId === providerId);

export const getResources = (): Resource[] =>
  store.resources
    .filter((r) => r.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id.localeCompare(b.id));

export const getAllResources = (): Resource[] => [...store.resources];

export const getCollections = (): Collection[] => store.collections.filter((c) => c.isActive);

/** ربط الخدمة بمزوّدها للعرض. */
export function withProviders(services: Service[]): ServiceWithProvider[] {
  return services.map((service) => ({ service, provider: getProviderById(service.providerId) }));
}

export function listEmirates(services: Service[]): string[] {
  const set = new Set<string>();
  for (const s of services) {
    const p = getProviderById(s.providerId);
    if (p?.emirate) set.add(p.emirate);
  }
  return [...set];
}

export function listDomains(services: Service[]): string[] {
  return [...new Set(services.map((s) => s.serviceDomain))];
}

export function listAccessMethods(services: Service[]): string[] {
  return [...new Set(services.map((s) => s.accessMethod).filter(Boolean))];
}

export function listResourceTypes(resources: Resource[]): string[] {
  return [...new Set(resources.map((r) => r.resourceType).filter(Boolean))];
}

export function listAudiences(resources: Resource[]): string[] {
  return [...new Set(resources.map((r) => r.targetAudience).filter(Boolean))];
}

// ---------------------------------------------------------------- filtering

export interface ServiceFilters {
  query?: string;
  emirate?: string;
  domain?: string;
  accessMethod?: string;
}

export function filterServices(
  items: ServiceWithProvider[],
  { query = "", emirate = "all", domain = "all", accessMethod = "all" }: ServiceFilters,
): ServiceWithProvider[] {
  const q = query.trim().toLowerCase();
  return items.filter(({ service, provider }) => {
    if (emirate !== "all" && provider?.emirate !== emirate) return false;
    if (domain !== "all" && service.serviceDomain !== domain) return false;
    if (accessMethod !== "all" && service.accessMethod !== accessMethod) return false;
    if (!q) return true;
    const hay = [
      service.nameAr,
      label(DOMAIN_LABELS, service.serviceDomain),
      provider?.nameAr,
      provider?.nameEn,
      provider ? label(EMIRATE_LABELS, provider.emirate) : "",
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export interface ResourceFilters {
  query?: string;
  resourceType?: string;
  audience?: string;
}

export function filterResources(
  items: Resource[],
  { query = "", resourceType = "all", audience = "all" }: ResourceFilters,
): Resource[] {
  const q = query.trim().toLowerCase();
  return items.filter((r) => {
    if (resourceType !== "all" && r.resourceType !== resourceType) return false;
    if (audience !== "all" && r.targetAudience !== audience) return false;
    if (!q) return true;
    return [r.titleAr, r.publisher, r.resourceType, r.targetAudience, r.qualityNotes]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
}

// ---------------------------------------------------------------- integrity

export interface DirectoryIntegrity {
  providerCount: number;
  serviceCount: number;
  resourceCount: number;
  collectionCount: number;
  orphanServiceIds: string[];
  duplicateIds: string[];
}

export function checkDirectoryIntegrity(): DirectoryIntegrity {
  const dup = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  const providerIds = new Set(store.providers.map((p) => p.id));
  return {
    providerCount: store.providers.length,
    serviceCount: store.services.length,
    resourceCount: store.resources.length,
    collectionCount: store.collections.length,
    orphanServiceIds: store.services.filter((s) => !providerIds.has(s.providerId)).map((s) => s.id),
    duplicateIds: [
      ...dup(store.providers.map((p) => p.id)),
      ...dup(store.services.map((s) => s.id)),
      ...dup(store.resources.map((r) => r.id)),
      ...dup(store.collections.map((c) => c.id)),
    ],
  };
}
