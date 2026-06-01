import { describe, expect, it } from "vitest";
import { getStoreLegalStatus, readStoreConfig } from "./storeConfig";

describe("store legal config", () => {
  it("reports missing legal fields before launch", () => {
    const config = readStoreConfig({});
    const status = getStoreLegalStatus(config);

    expect(config.returnsDays).toBe(14);
    expect(config.termsUrl).toBe("#regulamin");
    expect(config.privacyUrl).toBe("#polityka-prywatnosci");
    expect(status.ready).toBe(false);
    expect(status.missingItems).toContain("NIP");
    expect(status.missingItems).toContain("Weryfikacja prawna dokumentow");
    expect(status.missingItems).not.toContain("Regulamin URL");
  });

  it("accepts complete company and legal document settings", () => {
    const config = readStoreConfig({
      VITE_STORE_LEGAL_NAME: "DermaLab sp. z o.o.",
      VITE_STORE_TAX_ID: "1234567890",
      VITE_STORE_ADDRESS: "ul. Testowa 1, 00-001 Warszawa",
      VITE_STORE_EMAIL: "kontakt@example.com",
      VITE_TERMS_URL: "/regulamin",
      VITE_PRIVACY_URL: "/polityka-prywatnosci",
      VITE_LEGAL_REVIEWED: "true",
    });
    const status = getStoreLegalStatus(config);

    expect(status.ready).toBe(true);
    expect(status.missingItems).toEqual([]);
    expect(config.returnsDays).toBe(14);
  });
});
