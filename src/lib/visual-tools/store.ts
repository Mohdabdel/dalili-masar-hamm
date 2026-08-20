/**
 * DALILI-VISUAL-TOOLS-BUILDER-01
 * مخزن محلي واحد لكل أدوات الوسائل الداعمة (نواة مشتركة، لا محرر منفصل لكل أداة).
 * التخزين على جهاز الأسرة فقط (localStorage) — بيانات خاصة لا تُنشر ولا تدخل مستودع دليلي.
 */

import {
  getToolMeta,
  type VisualToolItem,
  type VisualToolLayout,
  type VisualToolProject,
  type VisualToolType,
} from "./types";

const STORAGE_KEY = "dalili.visual-tools.v1";
const LOCAL_OWNER = "local-family";

let cache: VisualToolProject[] | null = null;
const listeners = new Set<() => void>();

function now() {
  return new Date().toISOString();
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function read(): VisualToolProject[] {
  if (cache) return cache;
  if (typeof window === "undefined") return (cache = []);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as VisualToolProject[]) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: VisualToolProject[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* تجاهل امتلاء التخزين */
    }
  }
  listeners.forEach((l) => l());
}

/* ---------- اشتراك React ---------- */

export function subscribeProjects(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProjectsSnapshot(): VisualToolProject[] {
  return read();
}

export function getServerSnapshot(): VisualToolProject[] {
  return EMPTY;
}

const EMPTY: VisualToolProject[] = [];

/* ---------- عمليات المشاريع ---------- */

export function getProject(id: string): VisualToolProject | null {
  return read().find((p) => p.id === id) ?? null;
}

export function listProjects(type?: VisualToolType): VisualToolProject[] {
  const all = [...read()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return type ? all.filter((p) => p.type === type) : all;
}

export function createProject(type: VisualToolType, title?: string): VisualToolProject {
  const meta = getToolMeta(type);
  const ts = now();
  const project: VisualToolProject = {
    id: uid("vtp"),
    userId: LOCAL_OWNER,
    type,
    title: title?.trim() || meta.titleAr,
    layout: meta.defaultLayout,
    linkedRoutineId: null,
    items: [],
    createdAt: ts,
    updatedAt: ts,
  };
  write([project, ...read()]);
  return project;
}

export function updateProject(
  id: string,
  patch: Partial<Pick<VisualToolProject, "title" | "layout" | "linkedRoutineId">>,
) {
  write(
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
  write([copy, ...read()]);
  return copy;
}

export function deleteProject(id: string) {
  write(read().filter((p) => p.id !== id));
}

/* ---------- عمليات العناصر ---------- */

function withItems(
  id: string,
  fn: (items: VisualToolItem[]) => VisualToolItem[],
) {
  write(
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

export function addItem(projectId: string, partial?: Partial<VisualToolItem>) {
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
  withItems(projectId, (items) => [...items, item]);
  return item;
}

export function updateItem(
  projectId: string,
  itemId: string,
  patch: Partial<Omit<VisualToolItem, "id" | "projectId">>,
) {
  withItems(projectId, (items) =>
    items.map((it) =>
      it.id === itemId ? { ...it, ...patch, updatedAt: now() } : it,
    ),
  );
}

export function removeItem(projectId: string, itemId: string) {
  withItems(projectId, (items) => items.filter((it) => it.id !== itemId));
}

export function toggleItemHidden(projectId: string, itemId: string) {
  withItems(projectId, (items) =>
    items.map((it) =>
      it.id === itemId ? { ...it, hidden: !it.hidden, updatedAt: now() } : it,
    ),
  );
}

export function moveItem(projectId: string, itemId: string, dir: -1 | 1) {
  withItems(projectId, (items) => {
    const i = items.findIndex((it) => it.id === itemId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= items.length) return items;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
}
