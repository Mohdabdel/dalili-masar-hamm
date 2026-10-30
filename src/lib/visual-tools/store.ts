/**
 * DALILI-VISUAL-TOOLS-BUILDER-01
 * مخزن محلي لأدوات الوسائل الداعمة، مفصول بحسب صاحب الحساب على هذا الجهاز.
 *
 * قواعد العزل:
 * - كل حساب مسجّل له مفتاح تخزين خاص: dalili.visual-tools.v2.user.<userId>
 * - الزائر (بدون دخول) له مفتاح مستقل: dalili.visual-tools.v2.guest
 * - المفتاح القديم المشترك dalili.visual-tools.v1 محجوز (Quarantine):
 *   لا يُقرأ ولا يُكتب ولا يُنسب لأي مستخدم، ويبقى على الجهاز كما هو.
 * - أي تبديل حساب (دخول/خروج/تغيير مستخدم، ولو من تبويب آخر) يفرّغ الذاكرة
 *   المؤقتة ويعيد القراءة من نطاق المالك الجديد فقط.
 * - فشل الكتابة (امتلاء التخزين مثلاً) لا يُبلع: تبقى آخر نسخة محفوظة فعلاً،
 *   ويُعرض خطأ عربي واضح، ولا يُبلَّغ عن نجاح لم يحدث.
 */

import { supabase } from "@/integrations/supabase/client";
import {
  getToolMeta,
  type VisualToolItem,
  type VisualToolLayout,
  type VisualToolProject,
  type VisualToolType,
} from "./types";

/** المفتاح القديم المشترك — محجوز ولا يُقرأ إطلاقاً بعد هذا الإصلاح. */
export const LEGACY_SHARED_STORAGE_KEY = "dalili.visual-tools.v1";

const GUEST_KEY = "dalili.visual-tools.v2.guest";
const USER_KEY_PREFIX = "dalili.visual-tools.v2.user.";

export type VisualToolsScope =
  | { kind: "pending" }
  | { kind: "guest" }
  | { kind: "user"; userId: string };

const PENDING_SCOPE: VisualToolsScope = { kind: "pending" };
const EMPTY: VisualToolProject[] = [];
let scope: VisualToolsScope = PENDING_SCOPE;
let cache: VisualToolProject[] | null = null;
let lastError: string | null = null;
let authWired = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

/** مفتاح التخزين للنطاق الحالي؛ null قبل حسم الجلسة. */
function storageKeyFor(s: VisualToolsScope): string | null {
  if (s.kind === "guest") return GUEST_KEY;
  if (s.kind === "user") return `${USER_KEY_PREFIX}${s.userId}`;
  return null;
}

function ownerLabel(s: VisualToolsScope): string {
  if (s.kind === "user") return `user:${s.userId}`;
  return "guest";
}

/** تبديل النطاق: يفرّغ الذاكرة المؤقتة ويعيد الإشعار — لا بيانات تنتقل بين النطاقات. */
function setScope(next: VisualToolsScope) {
  const changed =
    scope.kind !== next.kind ||
    (scope.kind === "user" && next.kind === "user" && scope.userId !== next.userId);
  if (!changed) return;
  scope = next;
  cache = null;
  lastError = null;
  notify();
}

/** ربط دورة حياة الدخول الموجودة — يعمل مرة واحدة، في المتصفح فقط. */
function ensureAuthWiring() {
  if (authWired || typeof window === "undefined") return;
  authWired = true;

  let authRevision = 0;
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
      authRevision += 1;
      const userId = session?.user?.id;
      setScope(userId ? { kind: "user", userId } : { kind: "guest" });
    }
  });
  const initialRevision = authRevision;
  void supabase.auth.getSession().then(({ data, error }) => {
    if (authRevision !== initialRevision) return;
    if (error) throw error;
    const userId = data.session?.user?.id;
    setScope(userId ? { kind: "user", userId } : { kind: "guest" });
  }).catch(() => {
    if (authRevision !== initialRevision) return;
    // Fail closed: do not expose guest or account data when identity is unknown.
    lastError = "تعذّر التحقق من الحساب. أعيدوا تحميل الصفحة قبل فتح الأدوات.";
    notify();
  });

  // تبويب آخر على نفس الحساب عدّل البيانات — نعيد القراءة من التخزين.
  window.addEventListener("storage", (event) => {
    const key = storageKeyFor(scope);
    if (key && (event.key === key || event.key === null)) {
      cache = null;
      notify();
    }
  });
}

function read(): VisualToolProject[] {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  const key = storageKeyFor(scope);
  if (!key) return EMPTY;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as VisualToolProject[]) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

/**
 * يكتب النسخة الجديدة. عند فشل الكتابة تبقى آخر نسخة محفوظة فعلاً
 * ويُسجَّل خطأ مرئي للأسرة — لا نجاح زائف.
 */
function write(next: VisualToolProject[]): boolean {
  if (typeof window === "undefined") return false;
  const key = storageKeyFor(scope);
  if (!key) {
    lastError = "جارٍ تحديد صاحب الحساب على هذا الجهاز — حاولوا بعد لحظة.";
    notify();
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // لا نلمس cache: تبقى آخر نسخة محفوظة فعلاً هي المعروضة.
    lastError =
      "لم يُحفظ التعديل — مساحة التخزين على هذا الجهاز ممتلئة أو غير متاحة. التعديل الأخير لم يُحفظ.";
    notify();
    return false;
  }
  cache = next;
  lastError = null;
  notify();
  return true;
}

/* ---------- اشتراك React ---------- */

export function subscribeProjects(listener: () => void) {
  ensureAuthWiring();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProjectsSnapshot(): VisualToolProject[] {
  return read();
}

export function getServerSnapshot(): VisualToolProject[] {
  return EMPTY;
}

/** آخر خطأ حفظ — null عندما تكون آخر كتابة ناجحة. */
export function getStoreErrorSnapshot(): string | null {
  return lastError;
}

export function getServerStoreErrorSnapshot(): string | null {
  return null;
}

/** النطاق الحالي — لتسمية «على هذا الجهاز» مقابل «حسابك» في الواجهة. */
export function getScopeSnapshot(): VisualToolsScope {
  return scope;
}

export function getServerScopeSnapshot(): VisualToolsScope {
  return PENDING_SCOPE;
}

/* ---------- عمليات المشاريع ---------- */

export function getProject(id: string): VisualToolProject | null {
  return read().find((p) => p.id === id) ?? null;
}

export function listProjects(type?: VisualToolType): VisualToolProject[] {
  const all = [...read()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return type ? all.filter((p) => p.type === type) : all;
}

/** ينشئ مشروعاً في نطاق المالك الحالي فقط؛ null عند فشل الحفظ. */
export function createProject(
  type: VisualToolType,
  title?: string,
): VisualToolProject | null {
  const meta = getToolMeta(type);
  const ts = now();
  const project: VisualToolProject = {
    id: uid("vtp"),
    userId: ownerLabel(scope),
    type,
    title: title?.trim() || meta.titleAr,
    layout: meta.defaultLayout,
    linkedRoutineId: null,
    items: [],
    createdAt: ts,
    updatedAt: ts,
  };
  return write([project, ...read()]) ? project : null;
}

export function updateProject(
  id: string,
  patch: Partial<Pick<VisualToolProject, "title" | "layout" | "linkedRoutineId">>,
): boolean {
  return write(
    read().map((p) => (p.id === id ? { ...p, ...patch, updatedAt: now() } : p)),
  );
}

export function duplicateProject(id: string): VisualToolProject | null {
  const src = getProject(id);
  if (!src) return null;
  const ts = now();
  const newId = uid("vtp");
  const copy: VisualToolProject = {
    ...src,
    id: newId,
    title: `${src.title} (نسخة)`,
    createdAt: ts,
    updatedAt: ts,
    items: src.items.map((it) => ({ ...it, id: uid("vti"), projectId: newId })),
  };
  return write([copy, ...read()]) ? copy : null;
}

export function deleteProject(id: string): boolean {
  return write(read().filter((p) => p.id !== id));
}

/* ---------- عمليات العناصر ---------- */

function withItems(
  id: string,
  fn: (items: VisualToolItem[]) => VisualToolItem[],
): boolean {
  return write(
    read().map((p) =>
      p.id === id
        ? {
            ...p,
            items: fn(p.items).map((it, i) => ({ ...it, sortOrder: i })),
            updatedAt: now(),
          }
        : p,
    ),
  );
}

export function addItem(
  projectId: string,
  partial?: Partial<VisualToolItem>,
): VisualToolItem | null {
  const ts = now();
  const item: VisualToolItem = {
    id: uid("vti"),
    projectId,
    sortOrder: 0,
    hidden: false,
    text: "",
    imageSource: "none",
    imageAssetId: null,
    imageUrl: null,
    createdAt: ts,
    updatedAt: ts,
    ...partial,
  };
  return withItems(projectId, (items) => [...items, item]) ? item : null;
}

export function updateItem(
  projectId: string,
  itemId: string,
  patch: Partial<Omit<VisualToolItem, "id" | "projectId">>,
): boolean {
  return withItems(projectId, (items) =>
    items.map((it) =>
      it.id === itemId ? { ...it, ...patch, updatedAt: now() } : it,
    ),
  );
}

export function removeItem(projectId: string, itemId: string): boolean {
  return withItems(projectId, (items) => items.filter((it) => it.id !== itemId));
}

export function toggleItemHidden(projectId: string, itemId: string): boolean {
  return withItems(projectId, (items) =>
    items.map((it) =>
      it.id === itemId ? { ...it, hidden: !it.hidden, updatedAt: now() } : it,
    ),
  );
}

export function moveItem(
  projectId: string,
  itemId: string,
  dir: -1 | 1,
): boolean {
  return withItems(projectId, (items) => {
    const i = items.findIndex((it) => it.id === itemId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return items;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
}

/* ---------- خطافات اختبار فقط — لا تُستخدم في واجهة التطبيق ---------- */

export function __setScopeForTests(next: VisualToolsScope) {
  authWired = true; // يمنع الربط التلقائي بالجلسة أثناء الاختبار
  setScope(next);
}

export function __resetVisualToolsForTests() {
  scope = { kind: "pending" };
  cache = null;
  lastError = null;
  authWired = false;
}

