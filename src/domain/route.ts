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
