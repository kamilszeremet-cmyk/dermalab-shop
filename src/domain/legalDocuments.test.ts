import { describe, expect, it } from "vitest";
import { buildLegalDocuments } from "./legalDocuments";
import type { StoreLegalConfig } from "./storeConfig";

const config: StoreLegalConfig = {
  storeName: "DermaLab",
  legalName: "DermaLab sp. z o.o.",
  taxId: "1234567890",
  address: "ul. Testowa 1, 00-001 Warszawa",
  email: "kontakt@dermalab.test",
  termsUrl: "/regulamin",
  privacyUrl: "/polityka-prywatnosci",
  returnsDays: 14,
  legalReviewRequired: true,
};

describe("legal documents", () => {
  it("builds the standard legal document set for an online store", () => {
    const documents = buildLegalDocuments(config);

    expect(documents.map((document) => document.id)).toEqual([
      "regulamin",
      "polityka-prywatnosci",
      "zwroty-i-reklamacje",
      "dostawa-i-platnosci",
    ]);
  });

  it("uses configured company data and consumer return terms", () => {
    const documents = buildLegalDocuments(config);
    const terms = documents.find((document) => document.id === "regulamin")!;
    const returns = documents.find((document) => document.id === "zwroty-i-reklamacje")!;
    const privacy = documents.find((document) => document.id === "polityka-prywatnosci")!;

    expect(terms.sections[0].body).toContain("DermaLab sp. z o.o.");
    expect(terms.sections[0].body).toContain("1234567890");
    expect(returns.sections[0].body).toContain("14 dni");
    expect(privacy.sections[0].body).toContain("DermaLab sp. z o.o.");
  });
});
