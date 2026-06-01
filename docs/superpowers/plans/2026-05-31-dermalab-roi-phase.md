# DermaLab ROI Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first ROI layer: supplier readiness, checkout handoff, product curation, and SEO/ad landing sections.

**Architecture:** Keep the existing React/Vite storefront. Add focused domain modules for supplier readiness, checkout handoff, and landing content, then wire them into the existing components.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library.

---

### Task 1: Supplier And Catalog

**Files:**
- Create: `src/domain/supplier.ts`
- Test: `src/domain/supplier.test.ts`
- Modify: `src/data/demoSupplierFeed.ts`
- Modify: `src/components/ImportReportPanel.tsx`

- [ ] Write failing tests that verify ICO supplier profile readiness and a pilot feed of at least 10 published products.
- [ ] Run `npm run test -- src/domain/supplier.test.ts` and confirm it fails because the module does not exist.
- [ ] Implement `supplier.ts`, expand the feed, and update import copy.
- [ ] Run all tests.

### Task 2: Checkout Handoff

**Files:**
- Create: `src/domain/checkout.ts`
- Test: `src/domain/checkout.test.ts`
- Modify: `src/components/CartDrawer.tsx`

- [ ] Write failing tests for empty cart validation, valid cart payloads, and missing payment endpoint status.
- [ ] Run the checkout test and confirm it fails because the module does not exist.
- [ ] Implement checkout request creation and UI states for Stripe/P24 handoff.
- [ ] Run all tests.

### Task 3: Landing Pages

**Files:**
- Create: `src/domain/landing.ts`
- Test: `src/domain/landing.test.ts`
- Create: `src/components/LandingPages.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/styles.css`

- [ ] Write failing tests that require four landing pages and catalog filtering from CTA clicks.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement landing data, section UI, navigation, and CTA wiring.
- [ ] Run all tests.

### Task 4: Verification

**Files:**
- Modify only if tests expose issues.

- [ ] Run `npm run test`.
- [ ] Run `npm run build`.
- [ ] Verify the local browser at `http://127.0.0.1:5173/` renders supplier, checkout, catalog, and landing content.

