import { describe, expect, it } from "vitest";
import { anchorHref, hasCheckoutSessionId, resolveView } from "./route";
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

describe("checkout return helpers", () => {
  it("detects session_id and prefixes anchors", () => {
    expect(hasCheckoutSessionId("?session_id=cs_1")).toBe(true);
    expect(hasCheckoutSessionId("")).toBe(false);
    expect(hasCheckoutSessionId("?session_id=")).toBe(false);
    expect(anchorHref("#catalog", "/")).toBe("/#catalog");
    expect(anchorHref("https://x.pl/t", "/")).toBe("https://x.pl/t");
  });
});
