const DEFAULT_AUTH_RETURN = "/";

/**
 * يقبل وجهة داخلية فقط حتى لا يتحول رابط الدخول إلى إعادة توجيه خارجية.
 */
export function safeAuthReturnPath(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_AUTH_RETURN;
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_AUTH_RETURN;

  try {
    const url = new URL(value, "https://dalili.local");
    if (url.origin !== "https://dalili.local") return DEFAULT_AUTH_RETURN;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_AUTH_RETURN;
  }
}
