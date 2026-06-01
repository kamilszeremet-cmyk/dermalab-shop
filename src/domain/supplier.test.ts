import { describe, expect, it } from "vitest";
import { demoSupplierFeed } from "../data/demoSupplierFeed";
import { importSupplierRows } from "./importer";
import { getSupplierReadiness, icoSupplierProfile } from "./supplier";

describe("supplier profile", () => {
  it("describes ICO Cosmetics as the primary B2B supplier candidate", () => {
    const readiness = getSupplierReadiness(icoSupplierProfile);

    expect(icoSupplierProfile.name).toBe("ICO Cosmetics");
    expect(icoSupplierProfile.integrationMethods).toEqual(
      expect.arrayContaining(["XML", "API", "BaseLinker Connect"]),
    );
    expect(readiness.readyItems).toContain("Product feed contract");
    expect(readiness.missingItems).toContain("Live B2B credentials");
  });

  it("imports at least 10 pilot products for the first sales test", () => {
    const report = importSupplierRows(demoSupplierFeed);

    expect(report.products.length).toBeGreaterThanOrEqual(10);
    expect(report.products.every((product) => product.supplierId === "ico-cosmetics-pilot")).toBe(true);
    expect(report.products.every((product) => product.images[0].includes("-premium.png"))).toBe(true);
    expect(report.products.map((product) => product.skinConcerns)).toEqual(
      expect.arrayContaining([expect.arrayContaining(["bariera"]), expect.arrayContaining(["przebarwienia"])]),
    );
  });
});
