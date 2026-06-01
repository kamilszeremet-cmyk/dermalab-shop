export const COOKIE_CONSENT_STORAGE_KEY = "dermalab_cookie_consent";

export type CookieConsentStatus = "pending" | "accepted" | "essential";
export type CookieConsentChoice = "all" | "essential";

export interface CookieConsent {
  status: CookieConsentStatus;
  analytics: boolean;
  marketing: boolean;
}

export interface TrackingConsent {
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const pendingConsent: CookieConsent = {
  status: "pending",
  analytics: false,
  marketing: false,
};

export function readCookieConsent(storage: ConsentStorage | null | undefined): CookieConsent {
  if (!storage) return pendingConsent;

  try {
    const value = storage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!value) return pendingConsent;

    const parsed = JSON.parse(value) as Partial<CookieConsent>;
    if (parsed.status === "accepted") {
      return {
        status: "accepted",
        analytics: parsed.analytics === true,
        marketing: parsed.marketing === true,
      };
    }
    if (parsed.status === "essential") {
      return {
        status: "essential",
        analytics: false,
        marketing: false,
      };
    }
  } catch {
    return pendingConsent;
  }

  return pendingConsent;
}

export function applyConsentChoice(storage: ConsentStorage | null | undefined, choice: CookieConsentChoice) {
  const consent: CookieConsent =
    choice === "all"
      ? { status: "accepted", analytics: true, marketing: true }
      : { status: "essential", analytics: false, marketing: false };

  try {
    storage?.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    return consent;
  }

  return consent;
}

export function cookieConsentToTrackingConsent(consent: CookieConsent): TrackingConsent {
  return {
    analytics: consent.analytics,
    marketing: consent.marketing,
  };
}

export function getBrowserConsentStorage(): ConsentStorage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}
