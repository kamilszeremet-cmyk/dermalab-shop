import { describe, expect, it } from "vitest";
import type { CheckoutPayload } from "./checkout";
import { buildStripeCheckoutForm } from "./stripeCheckout";

describe("stripe checkout session payload", () => {
  it("builds a Stripe form payload with card, P24, products and shipping", () => {
    const payload: CheckoutPayload = {
      provider: "stripe_checkout",
      paymentMethods: ["card", "p24"],
      currency: "pln",
      endpoint: "/api/create-checkout-session",
      successUrl: "https://shop.example.com/checkout/sukces",
      cancelUrl: "https://shop.example.com/checkout/anulowane",
      lineItems: [
        {
          sku: "ICO-SER-002",
          name: "Serum barierowe",
          quantity: 2,
          unitAmount: 8099,
        },
      ],
      shippingOption: {
        id: "inpost_locker",
        label: "InPost Paczkomat",
        price: 12.99,
        eta: "1-2 dni robocze",
      },
      totalAmount: 17497,
    };

    const form = buildStripeCheckoutForm(payload);

    expect(form.get("mode")).toBe("payment");
    expect(form.get("payment_method_types[0]")).toBe("card");
    expect(form.get("payment_method_types[1]")).toBe("p24");
    expect(form.get("billing_address_collection")).toBe("auto");
    expect(form.get("phone_number_collection[enabled]")).toBe("true");
    expect(form.get("shipping_address_collection[allowed_countries][0]")).toBe("PL");
    expect(form.get("line_items[0][price_data][product_data][name]")).toBe("Serum barierowe");
    expect(form.get("line_items[0][quantity]")).toBe("2");
    expect(form.get("line_items[1][price_data][product_data][name]")).toBe("Dostawa: InPost Paczkomat");
    expect(form.get("line_items[1][price_data][unit_amount]")).toBe("1299");
    expect(form.get("metadata[shipping_option]")).toBe("inpost_locker");
    expect(form.toString()).toContain("success_url=");
  });
});
