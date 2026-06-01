export function buildStripeCheckoutForm(payload) {
  const form = new URLSearchParams();

  form.set("mode", "payment");
  form.set("locale", "pl");
  form.set("success_url", payload.successUrl);
  form.set("cancel_url", payload.cancelUrl);
  form.set("billing_address_collection", "auto");
  form.set("phone_number_collection[enabled]", "true");
  form.set("shipping_address_collection[allowed_countries][0]", "PL");

  payload.paymentMethods.forEach((method, index) => {
    form.set(`payment_method_types[${index}]`, method);
  });

  payload.lineItems.forEach((item, index) => {
    form.set(`line_items[${index}][quantity]`, String(item.quantity));
    form.set(`line_items[${index}][price_data][currency]`, payload.currency);
    form.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
    form.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    form.set(`line_items[${index}][price_data][product_data][metadata][sku]`, item.sku);
  });

  const shippingIndex = payload.lineItems.length;
  form.set(`line_items[${shippingIndex}][quantity]`, "1");
  form.set(`line_items[${shippingIndex}][price_data][currency]`, payload.currency);
  form.set(
    `line_items[${shippingIndex}][price_data][unit_amount]`,
    String(Math.round(payload.shippingOption.price * 100)),
  );
  form.set(`line_items[${shippingIndex}][price_data][product_data][name]`, `Dostawa: ${payload.shippingOption.label}`);
  form.set("metadata[shipping_option]", payload.shippingOption.id);
  form.set("metadata[shipping_label]", payload.shippingOption.label);
  form.set("metadata[source]", "dermalab-storefront");

  return form;
}

export async function createStripeCheckoutSession(payload, env = process.env) {
  if (!env.STRIPE_SECRET_KEY) {
    return {
      status: 500,
      body: { error: "Missing STRIPE_SECRET_KEY." },
    };
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: buildStripeCheckoutForm(payload).toString(),
  });
  const data = await response.json();

  if (!response.ok || !data.url) {
    return {
      status: response.status,
      body: { error: data.error?.message ?? "Stripe Checkout session failed." },
    };
  }

  return {
    status: 200,
    body: { url: data.url, id: data.id },
  };
}
