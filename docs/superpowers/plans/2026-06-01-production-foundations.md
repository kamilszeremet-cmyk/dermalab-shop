# Production Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add configurable supplier feed, checkout backend, legal data, deployment config, and tracking events.

**Architecture:** Add small domain modules for config and payload building, a serverless Stripe endpoint, and lightweight UI status panels. Keep demo data as fallback until real credentials are supplied.

**Tech Stack:** React 19, Vite, TypeScript, Vitest, serverless JavaScript endpoint, Stripe REST API.

---

### Task 1: Supplier Feed Config

**Files:**
- Create: `src/domain/feedConfig.ts`
- Test: `src/domain/feedConfig.test.ts`
- Modify: `src/components/ImportReportPanel.tsx`

- [ ] Write failing tests for missing/live feed config.
- [ ] Implement `readSupplierFeedConfig` and `getSupplierFeedStatus`.
- [ ] Show source type and setup status in the import panel.

### Task 2: Stripe Checkout Backend

**Files:**
- Create: `src/domain/stripeCheckout.ts`
- Test: `src/domain/stripeCheckout.test.ts`
- Create: `api/create-checkout-session.js`

- [ ] Write failing tests for Stripe form payload conversion.
- [ ] Implement request-to-form conversion with `card`, `p24`, products, shipping, success and cancel URLs.
- [ ] Add serverless endpoint using `STRIPE_SECRET_KEY` and Stripe Checkout Sessions API.

### Task 3: Store Legal Config

**Files:**
- Create: `src/domain/storeConfig.ts`
- Test: `src/domain/storeConfig.test.ts`
- Modify: `src/components/TrustAndLegal.tsx`

- [ ] Write failing tests for missing company data and 14-day return policy display data.
- [ ] Implement env-backed shop legal config.
- [ ] Render configured company and legal document status.

### Task 4: Deployment Files

**Files:**
- Create: `.env.example`
- Create: `vercel.json`
- Create: `netlify.toml`
- Create: `docs/go-live-checklist.md`

- [ ] Add required environment variable list.
- [ ] Add SPA routing/build settings.
- [ ] Document production launch checklist.

### Task 5: Tracking Events

**Files:**
- Create: `src/domain/tracking.ts`
- Test: `src/domain/tracking.test.ts`
- Create: `src/components/TrackingScripts.tsx`
- Modify: `src/App.tsx`, `src/components/ProductDetail.tsx`, `src/components/CartDrawer.tsx`

- [ ] Write failing tests for disabled/enabled analytics config and checkout event payloads.
- [ ] Implement GA4/Meta config and event helpers.
- [ ] Emit product view, add-to-cart, begin-checkout and purchase-handoff events when configured.
