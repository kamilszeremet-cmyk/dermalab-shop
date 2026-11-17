import { describe, expect, it } from "vitest";
import { CART_STORAGE_KEY, clearStoredCart, loadCart, saveCart, type CartStorage } from "./cartStorage";

function memoryStorage(initial: Record<string, string> = {}): CartStorage {
  const data = { ...initial };
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
    removeItem: (k) => {
      delete data[k];
    },
  };
}

describe("cartStorage", () => {
  it("round-trips a cart", () => {
    const s = memoryStorage();
    saveCart(s, [{ productId: "a", quantity: 2 }]);
    expect(loadCart(s)).toEqual([{ productId: "a", quantity: 2 }]);
  });
  it("ignores corrupt data, invalid lines and unknown products", () => {
    expect(loadCart(memoryStorage({ [CART_STORAGE_KEY]: "{oops" }))).toEqual([]);
    const s = memoryStorage({
      [CART_STORAGE_KEY]: JSON.stringify([
        { productId: "a", quantity: 1 },
        { productId: "a", quantity: 3 },
        { productId: "b", quantity: -1 },
        { productId: "gone", quantity: 1 },
        null,
      ]),
    });
    expect(loadCart(s, ["a", "b"])).toEqual([{ productId: "a", quantity: 1 }]);
  });
  it("never throws when storage fails", () => {
    const broken: CartStorage = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(loadCart(broken)).toEqual([]);
    expect(() => saveCart(broken, [])).not.toThrow();
    expect(() => clearStoredCart(broken)).not.toThrow();
    expect(loadCart(null)).toEqual([]);
  });
  it("clears the stored cart", () => {
    const s = memoryStorage();
    saveCart(s, [{ productId: "a", quantity: 1 }]);
    clearStoredCart(s);
    expect(loadCart(s)).toEqual([]);
  });
});
