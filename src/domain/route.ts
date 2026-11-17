export type AppView = "store" | "checkout_success" | "checkout_cancelled";

export function resolveView(pathname: string): AppView {
  const normalized = pathname.replace(/\/+$/, "").toLowerCase();
  if (normalized === "/checkout/sukces") return "checkout_success";
  if (normalized === "/checkout/anulowane") return "checkout_cancelled";
  return "store";
}

export function readView(): AppView {
  if (typeof window === "undefined") return "store";
  return resolveView(window.location.pathname);
}

export function hasCheckoutSessionId(search: string): boolean {
  return new URLSearchParams(search).get("session_id")?.trim() ? true : false;
}

export function readHasCheckoutSessionId(): boolean {
  if (typeof window === "undefined") return false;
  return hasCheckoutSessionId(window.location.search);
}

/** On non-store views in-page anchors must point back to the store page. */
export function anchorHref(href: string, prefix: string): string {
  return href.startsWith("#") ? `${prefix}${href}` : href;
}
