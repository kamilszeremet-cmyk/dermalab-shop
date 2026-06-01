# Production Foundations Design

**Goal:** Turn the storefront MVP into a production-ready skeleton for supplier import, Stripe/P24 checkout, legal store data, deployment, and conversion tracking.

**Scope:** Build configurable foundations without storing real secrets in the repository. The app remains usable with demo data when production credentials are missing.

## Architecture

The storefront keeps Vite/React for the client. Production configuration is read from `import.meta.env` through small domain modules so UI code stays simple and tests can pass explicit env maps. Checkout uses a serverless endpoint that calls Stripe's REST API directly, avoiding a new SDK dependency.

## Features

- Supplier feed config reads CSV/XML/API settings from environment variables and reports whether the live feed is ready.
- Stripe Checkout config supports `card` and `p24`; the client posts the existing checkout payload to a serverless endpoint.
- Store/legal config centralizes company data, returns policy and legal document links.
- Deployment files document the required environment variables for Vercel/Netlify.
- Tracking config enables GA4 and Meta Pixel only when IDs are configured, with typed conversion events.

## Safety

No secret keys are exposed to the browser. Legal text is starter copy and must be reviewed before real sales. If a feed URL or checkout endpoint is missing, the UI displays a clear setup state and keeps the demo flow available.
