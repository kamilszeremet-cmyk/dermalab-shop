import { describe, expect, it } from "vitest";
import { getShippingOptions } from "./checkout";
import { resolveShippingOption } from "./shipping";

describe("resolveShippingOption", () => {
  it("defaults to free delivery when available", () => {
    expect(resolveShippingOption(getShippingOptions(200), null).id).toBe("free_delivery");
  });
  it("keeps an explicit choice when the cart total changes", () => {
    expect(resolveShippingOption(getShippingOptions(200), "courier").id).toBe("courier");
    expect(resolveShippingOption(getShippingOptions(50), "courier").id).toBe("courier");
  });
  it("falls back when the chosen option disappears", () => {
    expect(resolveShippingOption(getShippingOptions(50), "free_delivery").id).toBe("inpost_locker");
  });
});
