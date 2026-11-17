export function isAdminMode(search: string): boolean {
  try {
    return new URLSearchParams(search).get("admin") === "1";
  } catch {
    return false;
  }
}

export function readAdminMode(): boolean {
  if (typeof window === "undefined") return false;
  return isAdminMode(window.location.search);
}
