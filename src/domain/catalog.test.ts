import { describe, expect, it } from "vitest";
import { filterProducts, recommendRoutineProducts } from "./catalog";
import type { StoreProduct } from "./product";

const products: StoreProduct[] = [
  product("serum", "Serum ceramidowe", ["bariera"], ["wrażliwa"], ["ceramidy"], 79.9, "serum"),
  product("spf", "Krem SPF 50", ["przebarwienia"], ["mieszana"], ["filtry"], 69.9, "spf"),
  product("cream", "Krem kojący", ["bariera"], ["sucha"], ["pantenol"], 59.9, "cream"),
];

describe("catalog domain", () => {
  it("filters by concern, skin type, ingredient, price, and availability", () => {
    const result = filterProducts(products, {
      concern: "bariera",
      skinType: "wrażliwa",
      ingredient: "ceramidy",
      category: "all",
      maxPrice: 100,
      onlyAvailable: true,
    });

    expect(result.map((item) => item.sku)).toEqual(["serum"]);
  });

  it("recommends products from different routine steps", () => {
    const result = recommendRoutineProducts(products[0], products);

    expect(result.map((item) => item.routineStep)).toEqual(["spf", "cream"]);
  });
});

function product(
  sku: string,
  name: string,
  skinConcerns: string[],
  skinTypes: string[],
  activeIngredients: string[],
  retailPrice: number,
  routineStep: StoreProduct["routineStep"],
): StoreProduct {
  return {
    id: sku,
    supplierId: "demo",
    sku,
    ean: sku,
    slug: sku,
    name,
    brand: "DermaLab",
    producer: "Demo Lab",
    description: name,
    shortBenefit: name,
    category: routineStep === "spf" ? "SPF" : "Serum",
    skinConcerns,
    skinTypes,
    activeIngredients,
    routineStep,
    images: ["image"],
    netWholesalePrice: 30,
    vatRate: 23,
    retailPrice,
    marginPercent: 55,
    stock: 12,
    availabilityStatus: "in_stock",
    tags: skinConcerns,
    isPublished: true,
    validationIssues: [],
    seo: {
      title: `${name} | DermaLab`,
      metaDescription: name,
      canonicalPath: `/produkty/${sku}`,
      faq: [],
    },
  };
}
