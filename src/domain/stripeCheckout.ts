import type { CheckoutPayload } from "./checkout";

export function buildStripeCheckoutForm(payload: CheckoutPayload) {
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
