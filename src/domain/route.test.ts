import { describe, expect, it } from "vitest";
import { resolveView } from "./route";
import { isAdminMode } from "./adminMode";

describe("resolveView", () => {
  it("maps checkout return paths", () => {
    expect(resolveView("/checkout/sukces")).toBe("checkout_success");
    expect(resolveView("/checkout/sukces/")).toBe("checkout_success");
    expect(resolveView("/checkout/anulowane")).toBe("checkout_cancelled");
    expect(resolveView("/")).toBe("store");
    expect(resolveView("/cokolwiek")).toBe("store");
  });
});

describe("isAdminMode", () => {
  it("is enabled only by ?admin=1", () => {
    expect(isAdminMode("?admin=1")).toBe(true);
    expect(isAdminMode("?a=b&admin=1")).toBe(true);
    expect(isAdminMode("")).toBe(false);
    expect(isAdminMode("?admin=0")).toBe(false);
  });
});
