import type { CartLine } from "./product";

export const CART_STORAGE_KEY = "dermalab_cart";

export interface CartStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem?: (key: string) => void;
}

export function getBrowserCartStorage(): CartStorage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadCart(storage: CartStorage | null | undefined, knownProductIds?: string[]): CartLine[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const lines: CartLine[] = [];
    for (const item of parsed) {
      if (!item || typeof item !== "object") continue;
      const { productId, quantity } = item as Partial<CartLine>;
      if (typeof productId !== "string" || typeof quantity !== "number") continue;
      if (!Number.isInteger(quantity) || quantity <= 0) continue;
      if (knownProductIds && !knownProductIds.includes(productId)) continue;
      if (lines.some((line) => line.productId === productId)) continue;
      lines.push({ productId, quantity });
    }
    return lines;
  } catch {
    return [];
  }
}

export function saveCart(storage: CartStorage | null | undefined, cart: CartLine[]): void {
  if (!storage) return;
  try {
    storage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable or full - cart simply stays in memory
  }
}

export function clearStoredCart(storage: CartStorage | null | undefined): void {
  if (!storage) return;
  try {
    storage.removeItem ? storage.removeItem(CART_STORAGE_KEY) : storage.setItem(CART_STORAGE_KEY, "[]");
  } catch {
    // ignore
  }
}
