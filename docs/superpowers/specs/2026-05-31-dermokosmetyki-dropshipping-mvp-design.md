# Dermokosmetyki Dropshipping MVP - Design

## Summary

Build a dropshipping e-commerce MVP for the Polish market in the premium clinical dermocosmetics niche. The first version will be a custom storefront with demo product data and a supplier adapter layer that can later be connected to a Polish beauty wholesaler feed such as ICO Cosmetics or another CSV/XML/API supplier.

The business direction is clinical premium: clean, trustworthy, problem-solution oriented, and focused on skin concerns rather than broad beauty browsing. The MVP should support high average order value through skincare routines and cross-sell bundles while avoiding risky medical claims.

## Goals

- Create a polished clinical-premium dermocosmetics storefront.
- Provide product discovery by skin problem, skin type, active ingredient, category, price, and availability.
- Include a working cart and demo checkout flow without real payment processing.
- Include a supplier import layer that maps demo CSV/XML/API-like data into a stable store product model.
- Keep the supplier integration replaceable, so the UI and cart logic do not depend on one wholesaler's feed shape.
- Validate imported products so incomplete items do not appear in the public catalog.
- Verify the MVP on desktop and mobile.

## Non-Goals

- Real payment processing.
- Real order submission to a wholesaler.
- Customer accounts, order history, invoices, or returns automation.
- Live inventory synchronization.
- Medical advice, diagnosis, or promises to treat diseases.

## Market And Supplier Assumptions

The demo category is premium dermocosmetics because beauty and cosmetics have strong online demand in Poland, small parcel size, repeat-purchase potential, and fewer fit-related returns than apparel. The first supplier adapter will be designed around fields commonly found in Polish beauty wholesaler feeds: SKU/EAN, product name, brand, category, description, VAT, net price, stock, images, and producer.

Potential future supplier direction:

- ICO Cosmetics as a Polish beauty/dermocosmetics wholesaler candidate with XML/API-style integration assumptions.
- WellBeauty B2B as a secondary B2B research candidate.
- The MVP must not hard-code either supplier into storefront components.

## Architecture

The MVP has three clear layers:

1. Storefront frontend: homepage, catalog, product details, cart, and demo checkout.
2. E-commerce domain layer: product queries, filters, pricing, margin calculation, cart state, and checkout demo validation.
3. Supplier adapter layer: imports CSV/XML/API-like source data and normalizes it into the store product model.

The storefront reads only normalized products. Supplier-specific mapping stays in adapter code. This keeps future supplier replacement contained to importer configuration and mapping logic.

## Pages And User Flow

### Homepage

The homepage sells through skin problems and trust. It should present the shop as clinical, clear, and premium. Primary entry points:

- Acne-prone skin.
- Hyperpigmentation.
- Damaged skin barrier.
- Sensitive skin.
- SPF and daily protection.

The homepage also highlights routine bundles to increase average basket value.

### Catalog

The catalog supports clinical filtering:

- Skin concern.
- Skin type.
- Active ingredient.
- Product category.
- Brand.
- Price range.
- Availability.

Products should display price, short benefit, brand, key tags, availability, and quick add-to-cart.

### Product Page

The product page should explain why the item is worth buying:

- Main benefit.
- Skin concern fit.
- Active ingredients.
- Usage instructions.
- Routine placement.
- Cross-sell recommendations.

Copy must avoid medical cure claims and frame benefits as skincare support.

### Cart And Demo Checkout

The cart supports add, remove, quantity changes, totals, and visible savings or bundle value where appropriate. Before demo checkout, it recalculates product availability and price from current normalized data. Checkout collects demo customer details and shows a success state without sending real orders or taking real payment.

## Product Model

The normalized `StoreProduct` model should include:

- `id`
- `supplierId`
- `sku`
- `ean`
- `slug`
- `name`
- `brand`
- `producer`
- `description`
- `shortBenefit`
- `category`
- `skinConcerns`
- `skinTypes`
- `activeIngredients`
- `routineStep`
- `images`
- `netWholesalePrice`
- `vatRate`
- `retailPrice`
- `marginPercent`
- `stock`
- `availabilityStatus`
- `tags`
- `isPublished`
- `validationIssues`

The demo seed data should use realistic dermocosmetic products without copying protected brand assets or descriptions from real suppliers.

## Importer Design

The importer accepts supplier-like product rows and returns:

- normalized products ready for the store,
- skipped products with validation reasons,
- import summary counts: added, updated, skipped.

Importer responsibilities:

- Map supplier categories to store categories.
- Calculate retail price from wholesale price, VAT, and margin rules.
- Create slugs.
- Normalize image lists.
- Infer or map clinical tags where available.
- Mark incomplete products as unpublished.

Validation rules:

- Product must have SKU or EAN.
- Product must have a name.
- Product must have at least one usable image.
- Product must have a valid wholesale price and VAT rate.
- Product must have stock or a clear availability status.

Products that fail validation do not appear in the catalog.

## Pricing And ROI Features

The MVP should support configurable margin rules. Initial defaults:

- Higher margin for small accessories and routine add-ons.
- Moderate margin for core dermocosmetic products.
- Bundle recommendations to raise average order value.

Key ROI-oriented features:

- Routine bundles: cleanser + serum + cream + SPF.
- Cross-sell on product pages.
- Problem-based navigation to reduce browsing friction.
- Product tags that support paid-ad landing pages later.

## Error Handling

If supplier import fails, the store continues using the last valid demo/cache data and records the import error. If a product becomes incomplete or unavailable, it is hidden from the catalog or blocked at checkout validation. The checkout demo should show a clear message when an item is no longer available or its price changed.

User-facing errors should be calm, short, and actionable. Technical import details stay in import reports, not in customer UI.

## Testing And Verification

Implementation should include focused tests for:

- Product import with valid input.
- Product import with missing price, image, SKU/EAN, or availability.
- Retail price and margin calculation.
- Product filtering.
- Cart add, remove, quantity, total, and checkout demo validation.

Visual verification should include desktop and mobile browser checks for:

- Homepage layout.
- Catalog filtering.
- Product page readability.
- Cart and checkout states.
- No overlapping text or broken responsive layout.

## Implementation Decisions

- Stack: React + Vite + TypeScript for the storefront, with focused unit tests for importer and cart logic.
- Demo supplier source: CSV-like demo feed parsed by the supplier adapter into normalized `StoreProduct` records. The adapter interface should leave room for future XML/API implementations.
- Working brand name: DermaLab. The name is for the demo build and can be changed later without altering product, importer, or cart logic.

## Acceptance Criteria

- A user can browse a clinical-premium dermocosmetics shop.
- A user can filter products by concern, type, ingredient, price, and availability.
- A user can view product detail pages with routine and cross-sell recommendations.
- A user can add products to cart and complete a demo checkout.
- The importer can normalize demo supplier data into `StoreProduct`.
- Invalid imported products are reported and excluded from the public catalog.
- The storefront does not depend directly on supplier-specific field names.
- The UI is verified on desktop and mobile.
