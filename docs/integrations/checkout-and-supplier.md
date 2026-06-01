# Checkout And Supplier Integration

## Checkout

Frontend posts the cart payload to `VITE_CHECKOUT_ENDPOINT`.

Expected backend response:

```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

Backend responsibility:

- hold the Stripe secret key outside the browser,
- create a Stripe Checkout Session in `pln`,
- enable `card` and `p24`,
- return the hosted checkout URL.

## Supplier

Current storefront uses the `ico-cosmetics-pilot` feed as a sales-test catalog. To switch to live data, request from ICO Cosmetics:

- B2B account credentials,
- XML/API feed URL,
- stock and price fields,
- image URLs,
- order placement API or BaseLinker Connect access,
- dropshipping terms, shipping SLA, return process, and minimum order rules.

