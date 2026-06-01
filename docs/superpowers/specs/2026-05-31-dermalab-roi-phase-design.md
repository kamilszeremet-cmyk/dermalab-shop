# DermaLab ROI Phase Design

## Goal

Move the MVP from a demo storefront toward a sales-ready pilot by adding supplier readiness, checkout handoff, a focused product set, and SEO/ad landing content.

## Decisions

- Primary supplier profile: ICO Cosmetics, because its public B2B materials describe dermocosmetics, B2B customers, XML/API integrations, stock/price/order/image data, and ecommerce integrations.
- Payment direction: Stripe Checkout with card and Przelewy24-ready handoff. Secrets must stay outside the frontend, so the app posts cart data to a configurable backend endpoint instead of storing payment keys in browser code.
- Product strategy: 16 pilot SKUs grouped by high-intent skin problems: barrier repair, sensitivity, pigmentation, SPF, dryness, acne-support, eye care, and routine accessories.
- SEO/ad strategy: four problem-led landing sections for barrier repair, sensitive skin, pigmentation, and SPF. Each section has a clear promise, product bundle, margin signal, and CTA that filters the catalog.

## Architecture

- Keep the Vite/React app as the storefront.
- Add small domain modules for supplier profiles, checkout request validation, and landing page definitions.
- Keep supplier and checkout logic data-driven so real credentials/feed URLs can be connected later without rewriting UI.
- Replace the 5-item demo feed with an ICO pilot feed while preserving the importer contract.

## Limits

- Live supplier import cannot be completed without B2B account/API credentials.
- Live payment capture cannot be completed without Stripe account configuration and a server endpoint.
- This phase implements the production-facing handoff and clear readiness states, not secret-bearing backend deployment.

