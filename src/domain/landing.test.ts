import { describe, expect, it } from "vitest";
import { findLandingPageByConcern, landingFilterForPage, landingPages } from "./landing";

describe("landing pages", () => {
  it("defines four ROI landing pages for paid and organic acquisition", () => {
    expect(landingPages.map((page) => page.concern)).toEqual([
      "bariera",
      "wrażliwość",
      "przebarwienia",
      "spf",
    ]);
  });

  it("converts a landing page into catalog filters", () => {
    const page = findLandingPageByConcern("bariera");

    expect(page?.title.toLowerCase()).toContain("barier");
    expect(page ? landingFilterForPage(page) : null).toMatchObject({
      concern: "bariera",
      onlyAvailable: true,
    });
  });

  it("keeps internal notes out of customer-facing subtitles", () => {
    for (const page of landingPages) {
      expect(page.subtitle).not.toMatch(/reklam|kampani|landing|klientów|ROAS/i);
      expect(page.internalNote.length).toBeGreaterThan(0);
    }
  });
});
