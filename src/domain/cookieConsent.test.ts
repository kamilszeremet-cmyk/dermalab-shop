import { describe, expect, it } from "vitest";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  applyConsentChoice,
  cookieConsentToTrackingConsent,
  readCookieConsent,
} from "./cookieConsent";

describe("cookie consent", () => {
  it("starts pending when the visitor has not chosen yet", () => {
    const storage = new Map<string, string>();

    const consent = readCookieConsent({
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    });

    expect(consent.status).toBe("pending");
    expect(cookieConsentToTrackingConsent(consent)).toEqual({ analytics: false, marketing: false });
  });

  it("stores analytics and marketing consent when all cookies are accepted", () => {
    const storage = new Map<string, string>();
    const driver = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    const consent = applyConsentChoice(driver, "all");

    expect(consent).toEqual({ status: "accepted", analytics: true, marketing: true });
    expect(storage.get(COOKIE_CONSENT_STORAGE_KEY)).toContain("accepted");
    expect(cookieConsentToTrackingConsent(consent)).toEqual({ analytics: true, marketing: true });
  });

  it("stores essential-only consent without analytics or marketing", () => {
    const storage = new Map<string, string>();
    const driver = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    const consent = applyConsentChoice(driver, "essential");

    expect(consent).toEqual({ status: "essential", analytics: false, marketing: false });
    expect(cookieConsentToTrackingConsent(consent)).toEqual({ analytics: false, marketing: false });
  });
});
