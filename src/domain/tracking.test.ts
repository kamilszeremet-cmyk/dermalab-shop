import { describe, expect, it } from "vitest";
import { applyTrackingConsent, buildTrackingPayload, readTrackingConfig } from "./tracking";

describe("tracking config and events", () => {
  it("stays disabled when GA4 and Meta IDs are missing", () => {
    const config = readTrackingConfig({});

    expect(config.enabled).toBe(false);
  });

  it("enables configured GA4 and Meta tracking", () => {
    const config = readTrackingConfig({
      VITE_GA4_ID: "G-TEST123",
      VITE_META_PIXEL_ID: "123456789",
    });

    expect(config.enabled).toBe(true);
    expect(config.ga4Id).toBe("G-TEST123");
    expect(config.metaPixelId).toBe("123456789");
  });

  it("keeps GA4 and Meta disabled until cookie consent allows them", () => {
    const config = readTrackingConfig({
      VITE_GA4_ID: "G-TEST123",
      VITE_META_PIXEL_ID: "123456789",
    });

    expect(applyTrackingConsent(config, { analytics: false, marketing: false })).toEqual({
      enabled: false,
      ga4Id: "",
      metaPixelId: "",
    });
    expect(applyTrackingConsent(config, { analytics: true, marketing: false })).toEqual({
      enabled: true,
      ga4Id: "G-TEST123",
      metaPixelId: "",
    });
    expect(applyTrackingConsent(config, { analytics: false, marketing: true })).toEqual({
      enabled: true,
      ga4Id: "",
      metaPixelId: "123456789",
    });
  });

  it("maps checkout handoff to GA4 and Meta conversion names", () => {
    const event = buildTrackingPayload("begin_checkout", {
      value: 174.97,
      currency: "PLN",
      items: [{ item_id: "ICO-SER-002", item_name: "Serum barierowe", quantity: 2, price: 80.99 }],
    });

    expect(event.ga4Name).toBe("begin_checkout");
    expect(event.metaName).toBe("InitiateCheckout");
    expect(event.params.value).toBe(174.97);
  });
});
