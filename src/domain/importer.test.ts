import { describe, expect, it } from "vitest";
import { importSupplierRows, parseSupplierCsv } from "./importer";
import type { SupplierProductRow } from "./product";

const validRow: SupplierProductRow = {
  supplierId: "ico-demo",
  sku: "DL-SER-001",
  ean: "5900000000011",
  name: "Serum barierowe z ceramidami",
  brand: "DermaLab",
  producer: "Demo Beauty Lab",
  supplierCategory: "Pielęgnacja twarzy / Serum",
  description: "Lekkie serum wspierające barierę hydrolipidową.",
  netWholesalePrice: 38,
  vatRate: 23,
  stock: 42,
  imageUrls: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be"],
  activeIngredients: "ceramidy, pantenol, skwalan",
  skinConcerns: "bariera, wrażliwość",
  skinTypes: "wrażliwa, sucha",
};

describe("importSupplierRows", () => {
  it("normalizes a valid supplier row into a published store product", () => {
    const report = importSupplierRows([validRow]);

    expect(report.summary).toEqual({ added: 1, updated: 0, skipped: 0 });
    expect(report.products).toHaveLength(1);
    expect(report.products[0]).toMatchObject({
      sku: "DL-SER-001",
      slug: "serum-barierowe-z-ceramidami",
      category: "Serum",
      routineStep: "serum",
      isPublished: true,
      availabilityStatus: "in_stock",
    });
    expect(report.products[0].retailPrice).toBeGreaterThan(60);
    expect(report.products[0].activeIngredients).toContain("ceramidy");
    expect(report.products[0].seo).toMatchObject({
      canonicalPath: "/produkty/serum-barierowe-z-ceramidami",
    });
    expect(report.products[0].seo.faq.length).toBeGreaterThanOrEqual(3);
  });

  it("parses CSV feed rows and applies ROI pricing rules", () => {
    const csv = [
      "sku;ean;name;brand;producer;category;description;net_price;vat;stock;images;ingredients;concerns;skin_types",
      "LIVE-SER-1;5901;Serum live z ceramidami;DermaLab Select;ICO;PielÄ™gnacja / Serum;Feed live;42;23;15;/assets/product-serum-premium.png|/assets/product-cream-premium.png;ceramidy, pantenol;bariera, wraĹĽliwoĹ›Ä‡;wraĹĽliwa",
    ].join("\n");

    const report = importSupplierRows(parseSupplierCsv(csv, "ico-live"));
    const product = report.products[0];

    expect(product.supplierId).toBe("ico-live");
    expect(product.images).toHaveLength(2);
    expect(product.marginPercent).toBeGreaterThanOrEqual(55);
    expect(product.retailPrice.toString()).toMatch(/\.99$/);
    expect(product.seo.metaDescription).toContain("ceramidy");
  });

  it("skips products without SKU and EAN", () => {
    const report = importSupplierRows([{ ...validRow, sku: "", ean: "" }]);

    expect(report.summary).toEqual({ added: 0, updated: 0, skipped: 1 });
    expect(report.products).toHaveLength(0);
    expect(report.skipped[0].issues).toContain("SKU or EAN is required");
  });

  it("skips products without price or image", () => {
    const report = importSupplierRows([
      { ...validRow, sku: "NO-PRICE", netWholesalePrice: 0 },
      { ...validRow, sku: "NO-IMAGE", imageUrls: [] },
    ]);

    expect(report.summary).toEqual({ added: 0, updated: 0, skipped: 2 });
    expect(report.skipped.map((item) => item.sku)).toEqual(["NO-PRICE", "NO-IMAGE"]);
  });
});
