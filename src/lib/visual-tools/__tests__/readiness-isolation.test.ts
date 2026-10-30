import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
const auth = vi.hoisted(() => ({
  callback: null as null | ((event: string, session: unknown) => void),
  getSession: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: {
  getSession: auth.getSession,
  onAuthStateChange: (callback: typeof auth.callback) => { auth.callback = callback; return { data: { subscription: { unsubscribe() {} } } }; },
} } }));
import * as store from "../store";

describe("account-scoped local visual tools", () => {
  let data: Map<string, string>;
  let failWrite: boolean;
  let storageEvent: ((event: { key: string | null }) => void) | undefined;
  beforeEach(() => {
    data = new Map();
    failWrite = false;
    auth.callback = null;
    auth.getSession.mockReset().mockReturnValue(new Promise(() => {}));
    store.__resetVisualToolsForTests();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => { if (failWrite) throw new Error("quota"); data.set(key, value); },
      },
      addEventListener: (_name: string, listener: typeof storageEvent) => { storageEvent = listener; },
    });
  });
  afterEach(() => vi.unstubAllGlobals());
  it("keeps pending snapshots stable and blocks writes until identity resolves", () => {
    expect(store.getProjectsSnapshot()).toBe(store.getProjectsSnapshot());
    expect(store.getServerScopeSnapshot()).toBe(store.getServerScopeSnapshot());
    expect(store.createProject("choice_board")).toBeNull();
    expect(data.size).toBe(0);
  });
  it("isolates A, B and guest, including direct IDs and mutations", () => {
    store.__setScopeForTests({ kind: "user", userId: "A" });
    const a = store.createProject("choice_board", "A private")!;
    store.__setScopeForTests({ kind: "user", userId: "B" });
    expect(store.getProject(a.id)).toBeNull();
    store.updateProject(a.id, { title: "B cannot alter A" });
    store.deleteProject(a.id);
    const b = store.createProject("choice_board", "B private")!;
    store.__setScopeForTests({ kind: "guest" });
    expect(store.listProjects()).toEqual([]);
    const guest = store.createProject("choice_board", "guest")!;
    store.__setScopeForTests({ kind: "user", userId: "A" });
    expect(store.getProject(a.id)?.title).toBe("A private");
    expect(store.getProject(b.id)).toBeNull();
    expect(store.getProject(guest.id)).toBeNull();
  });
  it("preserves ambiguous legacy data without reading or assigning it", () => {
    const legacy = '[{"id":"old-private","userId":"local-family","title":"private"}]';
    data.set(store.LEGACY_SHARED_STORAGE_KEY, legacy);
    for (const userId of ["A", "B"]) {
      store.__setScopeForTests({ kind: "user", userId });
      expect(store.getProject("old-private")).toBeNull();
      store.createProject("choice_board");
    }
    expect(data.get(store.LEGACY_SHARED_STORAGE_KEY)).toBe(legacy);
  });
  it("retains the persisted snapshot and reports quota failure", () => {
    store.__setScopeForTests({ kind: "user", userId: "A" });
    const a = store.createProject("choice_board", "saved")!;
    const previous = store.getProjectsSnapshot();
    failWrite = true;
    expect(store.updateProject(a.id, { title: "unsaved" })).toBe(false);
    expect(store.getProjectsSnapshot()).toBe(previous);
    expect(store.getProject(a.id)?.title).toBe("saved");
    expect(store.getStoreErrorSnapshot()).toContain("لم يُحفظ");
    expect(store.createProject("choice_board")).toBeNull();
    failWrite = false;
    expect(store.updateProject(a.id, { title: "retry saved" })).toBe(true);
    expect(store.getStoreErrorSnapshot()).toBeNull();
  });
  it("ignores an old async session response after a newer auth event", async () => {
    let resolveSession!: (value: unknown) => void;
    auth.getSession.mockReturnValue(new Promise((resolve) => { resolveSession = resolve; }));
    const unsub = store.subscribeProjects(() => {});
    auth.callback!("SIGNED_IN", { user: { id: "B" } });
    resolveSession({ data: { session: { user: { id: "A" } } }, error: null });
    await Promise.resolve();
    expect(store.getScopeSnapshot()).toEqual({ kind: "user", userId: "B" });
    unsub();
  });
  it("invalidates direct ID lookups on logout and another-tab account change", () => {
    const unsub = store.subscribeProjects(() => {});
    auth.callback!("INITIAL_SESSION", { user: { id: "A" } });
    const a = store.createProject("choice_board")!;
    auth.callback!("SIGNED_OUT", null);
    expect(store.getProject(a.id)).toBeNull();
    auth.callback!("SIGNED_IN", { user: { id: "B" } });
    expect(store.getProject(a.id)).toBeNull();
    auth.callback!("SIGNED_IN", { user: { id: "A" } });
    expect(store.getProject(a.id)).not.toBeNull();
    unsub();
  });
  it("fails closed on session resolution error", async () => {
    auth.getSession.mockRejectedValue(new Error("offline"));
    const unsub = store.subscribeProjects(() => {});
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
    expect(store.getScopeSnapshot().kind).toBe("pending");
    expect(store.getStoreErrorSnapshot()).toContain("تعذّر");
    expect(store.getProjectsSnapshot()).toEqual([]);
    unsub();
  });
  it("invalidates cached rows when storage is cleared in another tab", () => {
    const unsub = store.subscribeProjects(() => {});
    auth.callback!("INITIAL_SESSION", { user: { id: "A" } });
    store.createProject("choice_board");
    data.clear();
    storageEvent!({ key: null });
    expect(store.getProjectsSnapshot()).toEqual([]);
    unsub();
  });
});
