import { describe, expect, it } from "vitest";
import { createCheckoutRequest, getCheckoutReadiness, getShippingOptions } from "./checkout";
import type { CartLine, StoreProduct } from "./product";

const products = [makeProduct("serum", "Serum barierowe", 89.9, 5), makeProduct("spf", "SPF 50", 74.9, 2)];

describe("checkout handoff", () => {
  it("blocks checkout when no backend endpoint is configured", () => {
    const readiness = getCheckoutReadiness("");

    expect(readiness.status).toBe("missing_endpoint");
    expect(readiness.message).toContain("endpoint");
  });

  it("creates a Stripe/P24 checkout request from valid cart lines", () => {
    const cart: CartLine[] = [
      { productId: "serum", quantity: 2 },
      { productId: "spf", quantity: 1 },
    ];

    const request = createCheckoutRequest(cart, products, {
      endpoint: "https://example.test/api/checkout/session",
      successUrl: "https://shop.test/sukces",
      cancelUrl: "https://shop.test/koszyk",
      shippingOption: getShippingOptions(254.7)[0],
    });

    expect(request.ok).toBe(true);
    expect(request.payload).toMatchObject({
      provider: "stripe_checkout",
      currency: "pln",
      successUrl: "https://shop.test/sukces",
      cancelUrl: "https://shop.test/koszyk",
    });
    expect(request.payload?.lineItems).toHaveLength(2);
    expect(request.payload?.lineItems[0]).toMatchObject({
      sku: "serum",
      name: "Serum barierowe",
      quantity: 2,
      unitAmount: 8990,
    });
    expect(request.payload?.shippingOption).toMatchObject({
      id: "free_delivery",
      price: 0,
    });
    expect(request.payload?.totalAmount).toBe(25470);
  });

  it("offers paid delivery below the free shipping threshold", () => {
    const options = getShippingOptions(74.9);

    expect(options.map((option) => option.id)).toEqual(["inpost_locker", "courier"]);
    expect(options[0]).toMatchObject({ label: "InPost Paczkomat", price: 12.99 });
  });
});

function makeProduct(id: string, name: string, retailPrice: number, stock: number): StoreProduct {
  return {
    id,
    supplierId: "ico-cosmetics-pilot",
    sku: id,
    ean: id,
    slug: id,
    name,
    brand: "DermaLab",
    producer: "ICO pilot",
    description: name,
    shortBenefit: name,
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
      title: name,
      metaDescription: name,
      canonicalPath: `/produkty/${id}`,
      faq: [],
    },
  };
}
