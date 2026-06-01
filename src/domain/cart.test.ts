import { describe, expect, it } from "vitest";
import { addToCart, calculateCartTotals, removeFromCart, updateQuantity, validateDemoCheckout } from "./cart";
import type { StoreProduct } from "./product";

const product = makeProduct("serum", 79.9, 10);
const unavailable = makeProduct("spf", 69.9, 0);

describe("cart domain", () => {
  it("adds products and increments quantity", () => {
    const cart = addToCart(addToCart([], product), product);

    expect(cart).toEqual([{ productId: "serum", quantity: 2 }]);
  });

  it("updates and removes cart lines", () => {
    const cart = addToCart([], product);

    expect(updateQuantity(cart, "serum", 3)).toEqual([{ productId: "serum", quantity: 3 }]);
    expect(removeFromCart(cart, "serum")).toEqual([]);
  });

  it("calculates totals from current product prices", () => {
    const cart = [{ productId: "serum", quantity: 2 }];

    expect(calculateCartTotals(cart, [product])).toEqual({ subtotal: 159.8, itemCount: 2 });
  });

  it("blocks demo checkout when product is unavailable", () => {
    const result = validateDemoCheckout([{ productId: "spf", quantity: 1 }], [unavailable]);

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toContain("niedostępny");
  });
});

function makeProduct(id: string, retailPrice: number, stock: number): StoreProduct {
  return {
    id,
    supplierId: "demo",
    sku: id,
    ean: id,
    slug: id,
    name: id,
    brand: "DermaLab",
    producer: "Demo",
    description: id,
    shortBenefit: id,
    category: "Serum",
    skinConcerns: ["bariera"],
    skinTypes: ["wrażliwa"],
    activeIngredients: ["ceramidy"],
    routineStep: "serum",
    images: ["image"],
    netWholesalePrice: 30,
    vatRate: 23,
    retailPrice,
    marginPercent: 55,
    stock,
    availabilityStatus: stock > 0 ? "in_stock" : "out_of_stock",
    tags: [],
    isPublished: true,
    validationIssues: [],
    seo: {
      title: `${id} | DermaLab`,
      metaDescription: id,
      canonicalPath: `/produkty/${id}`,
      faq: [],
    },
  };
}
