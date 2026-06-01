# DermaLab Dropshipping MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clinical-premium dermocosmetics dropshipping MVP with a replaceable supplier import layer, catalog, cart, and demo checkout.

**Architecture:** The app is a React + Vite + TypeScript storefront backed by local normalized product data. Supplier-specific fields are isolated in an importer module that converts a CSV-like demo feed into `StoreProduct`; UI components only read normalized products and cart state.

**Tech Stack:** React, Vite, TypeScript, Vitest, Testing Library, CSS modules or plain scoped CSS in `src/styles.css`.

---

## File Structure

- Create `package.json`: scripts and dependencies for Vite, React, TypeScript, Vitest.
- Create `index.html`: Vite mount point.
- Create `vite.config.ts`: React plugin and Vitest jsdom config.
- Create `tsconfig.json` and `tsconfig.node.json`: TypeScript config.
- Create `src/main.tsx`: React app bootstrap.
- Create `src/App.tsx`: page composition and shared state wiring.
- Create `src/styles.css`: clinical premium layout and responsive styling.
- Create `src/domain/product.ts`: supplier row, store product, import report, filter, and checkout types.
- Create `src/domain/importer.ts`: normalize supplier rows into store products.
- Create `src/domain/catalog.ts`: product filtering and recommendations.
- Create `src/domain/cart.ts`: cart state, totals, and checkout validation.
- Create `src/data/demoSupplierFeed.ts`: realistic CSV-like dermocosmetic demo records.
- Create `src/components/Header.tsx`: brand navigation and cart count.
- Create `src/components/HomePage.tsx`: problem-led hero, skin concern entry points, routine bundles.
- Create `src/components/Catalog.tsx`: filters and product grid.
- Create `src/components/ProductDetail.tsx`: selected product detail and cross-sell.
- Create `src/components/CartDrawer.tsx`: cart, totals, and demo checkout form.
- Create `src/components/ImportReportPanel.tsx`: internal MVP view of importer summary.
- Create `src/domain/importer.test.ts`: importer tests.
- Create `src/domain/catalog.test.ts`: filter/recommendation tests.
- Create `src/domain/cart.test.ts`: cart and checkout validation tests.

This file split keeps supplier logic, domain logic, and UI separate. Product data flows one way: demo feed -> importer -> normalized products -> catalog/cart UI.

---

### Task 1: Scaffold The Vite React TypeScript App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "dermalab-dropshipping-mvp",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.8.0",
    "vite": "^7.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create Vite config files**

`vite.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "types": ["vitest/globals"],
    "jsx": "react-jsx"
  },
  "include": ["src", "vite.config.ts"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 3: Create the HTML entrypoint**

`index.html`:

```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DermaLab | Dermokosmetyki kliniczne</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create the minimal app shell**

`src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">DermaLab</p>
        <h1>Kliniczna pielęgnacja skóry wrażliwej</h1>
        <p>
          MVP sklepu dropshippingowego z dermokosmetykami, katalogiem i
          adapterem hurtowni.
        </p>
      </section>
    </main>
  );
}
```

`src/styles.css`:

```css
:root {
  color: #17231f;
  background: #f7faf9;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
}

.hero {
  min-height: 90vh;
  display: grid;
  align-content: center;
  padding: 48px clamp(20px, 5vw, 72px);
  background:
    linear-gradient(90deg, rgba(247, 250, 249, 0.96), rgba(247, 250, 249, 0.78)),
    url("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80");
  background-size: cover;
  background-position: center;
}

.hero h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 5.8rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.hero p {
  max-width: 620px;
  font-size: 1.08rem;
  line-height: 1.7;
  color: #4d625b;
}

.eyebrow {
  margin: 0 0 16px;
  color: #1f6b55;
  font-weight: 800;
  text-transform: uppercase;
}
```

- [ ] **Step 5: Install dependencies**

Run:

```powershell
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 6: Verify scaffold builds**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite complete successfully and create `dist/`.

- [ ] **Step 7: Checkpoint**

If this workspace is later initialized as a Git repo, commit:

```powershell
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.node.json src
git commit -m "chore: scaffold dermalab storefront"
```

Expected in the current projectless workspace: `git` may report that this is not a repository; continue without committing.

---

### Task 2: Define Product Types And Importer With TDD

**Files:**
- Create: `src/domain/product.ts`
- Create: `src/domain/importer.ts`
- Create: `src/domain/importer.test.ts`

- [ ] **Step 1: Write importer tests first**

`src/domain/importer.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { importSupplierRows } from "./importer";
import type { SupplierProductRow } from "./product";

const validRow: SupplierProductRow = {
  supplierId: "ico-demo",
  sku: "DL-SER-001",
  ean: "5900000000011",
  name: "Serum barierowe z ceramidami",
  brand: "DermaLab",
  producer: "Demo Beauty Lab",
  supplierCategory: "Pielęgnacja twarzy / Serum",
  description: "Lekkie serum wspierające barierę hydrolipidową.",
  netWholesalePrice: 38,
  vatRate: 23,
  stock: 42,
  imageUrls: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be"],
  activeIngredients: "ceramidy, pantenol, skwalan",
  skinConcerns: "bariera, wrażliwość",
  skinTypes: "wrażliwa, sucha",
};

describe("importSupplierRows", () => {
  it("normalizes a valid supplier row into a published store product", () => {
    const report = importSupplierRows([validRow]);

    expect(report.summary).toEqual({ added: 1, updated: 0, skipped: 0 });
    expect(report.products).toHaveLength(1);
    expect(report.products[0]).toMatchObject({
      sku: "DL-SER-001",
      slug: "serum-barierowe-z-ceramidami",
      category: "Serum",
      routineStep: "serum",
      isPublished: true,
      availabilityStatus: "in_stock",
    });
    expect(report.products[0].retailPrice).toBeGreaterThan(60);
    expect(report.products[0].activeIngredients).toContain("ceramidy");
  });

  it("skips products without SKU and EAN", () => {
    const report = importSupplierRows([{ ...validRow, sku: "", ean: "" }]);

    expect(report.summary).toEqual({ added: 0, updated: 0, skipped: 1 });
    expect(report.products).toHaveLength(0);
    expect(report.skipped[0].issues).toContain("SKU or EAN is required");
  });

  it("skips products without price or image", () => {
    const report = importSupplierRows([
      { ...validRow, sku: "NO-PRICE", netWholesalePrice: 0 },
      { ...validRow, sku: "NO-IMAGE", imageUrls: [] },
    ]);

    expect(report.summary).toEqual({ added: 0, updated: 0, skipped: 2 });
    expect(report.skipped.map((item) => item.sku)).toEqual(["NO-PRICE", "NO-IMAGE"]);
  });
});
```

- [ ] **Step 2: Run importer test and confirm it fails**

Run:

```powershell
npm run test -- src/domain/importer.test.ts
```

Expected: FAIL because `src/domain/importer.ts` and `src/domain/product.ts` do not exist yet.

- [ ] **Step 3: Create product types**

`src/domain/product.ts`:

```ts
export type AvailabilityStatus = "in_stock" | "low_stock" | "out_of_stock";

export type RoutineStep = "cleanser" | "serum" | "cream" | "spf" | "accessory";

export interface SupplierProductRow {
  supplierId: string;
  sku: string;
  ean?: string;
  name: string;
  brand: string;
  producer: string;
  supplierCategory: string;
  description: string;
  netWholesalePrice: number;
  vatRate: number;
  stock: number;
  imageUrls: string[];
  activeIngredients: string;
  skinConcerns: string;
  skinTypes: string;
}

export interface StoreProduct {
  id: string;
  supplierId: string;
  sku: string;
  ean?: string;
  slug: string;
  name: string;
  brand: string;
  producer: string;
  description: string;
  shortBenefit: string;
  category: string;
  skinConcerns: string[];
  skinTypes: string[];
  activeIngredients: string[];
  routineStep: RoutineStep;
  images: string[];
  netWholesalePrice: number;
  vatRate: number;
  retailPrice: number;
  marginPercent: number;
  stock: number;
  availabilityStatus: AvailabilityStatus;
  tags: string[];
  isPublished: boolean;
  validationIssues: string[];
}

export interface SkippedProduct {
  sku: string;
  name: string;
  issues: string[];
}

export interface ImportReport {
  products: StoreProduct[];
  skipped: SkippedProduct[];
  summary: {
    added: number;
    updated: number;
    skipped: number;
  };
}

export interface ProductFilters {
  concern: string;
  skinType: string;
  ingredient: string;
  category: string;
  maxPrice: number | null;
  onlyAvailable: boolean;
}
```

- [ ] **Step 4: Implement importer**

`src/domain/importer.ts`:

```ts
import type {
  AvailabilityStatus,
  ImportReport,
  RoutineStep,
  StoreProduct,
  SupplierProductRow,
} from "./product";

const CATEGORY_MAP: Array<[string, string]> = [
  ["serum", "Serum"],
  ["krem", "Kremy"],
  ["spf", "SPF"],
  ["oczyszcz", "Oczyszczanie"],
  ["akces", "Akcesoria"],
];

const ROUTINE_MAP: Array<[string, RoutineStep]> = [
  ["serum", "serum"],
  ["spf", "spf"],
  ["krem", "cream"],
  ["oczyszcz", "cleanser"],
  ["akces", "accessory"],
];

export function importSupplierRows(rows: SupplierProductRow[]): ImportReport {
  const products: StoreProduct[] = [];
  const skipped: ImportReport["skipped"] = [];

  for (const row of rows) {
    const issues = validateRow(row);

    if (issues.length > 0) {
      skipped.push({
        sku: row.sku,
        name: row.name,
        issues,
      });
      continue;
    }

    products.push(normalizeRow(row));
  }

  return {
    products,
    skipped,
    summary: {
      added: products.length,
      updated: 0,
      skipped: skipped.length,
    },
  };
}

function validateRow(row: SupplierProductRow): string[] {
  const issues: string[] = [];

  if (!row.sku && !row.ean) issues.push("SKU or EAN is required");
  if (!row.name.trim()) issues.push("Product name is required");
  if (!row.imageUrls.length) issues.push("At least one image is required");
  if (row.netWholesalePrice <= 0) issues.push("Wholesale price must be positive");
  if (row.vatRate < 0) issues.push("VAT rate must be valid");
  if (row.stock < 0) issues.push("Stock cannot be negative");

  return issues;
}

function normalizeRow(row: SupplierProductRow): StoreProduct {
  const category = mapCategory(row.supplierCategory);
  const routineStep = mapRoutineStep(row.supplierCategory);
  const marginPercent = routineStep === "accessory" ? 65 : routineStep === "spf" ? 48 : 55;
  const retailPrice = calculateRetailPrice(row.netWholesalePrice, row.vatRate, marginPercent);

  return {
    id: row.sku || row.ean || slugify(row.name),
    supplierId: row.supplierId,
    sku: row.sku,
    ean: row.ean,
    slug: slugify(row.name),
    name: row.name,
    brand: row.brand,
    producer: row.producer,
    description: row.description,
    shortBenefit: buildShortBenefit(row),
    category,
    skinConcerns: splitTags(row.skinConcerns),
    skinTypes: splitTags(row.skinTypes),
    activeIngredients: splitTags(row.activeIngredients),
    routineStep,
    images: row.imageUrls,
    netWholesalePrice: row.netWholesalePrice,
    vatRate: row.vatRate,
    retailPrice,
    marginPercent,
    stock: row.stock,
    availabilityStatus: availabilityFromStock(row.stock),
    tags: [category, routineStep, ...splitTags(row.skinConcerns)],
    isPublished: true,
    validationIssues: [],
  };
}

function calculateRetailPrice(netWholesalePrice: number, vatRate: number, marginPercent: number) {
  const grossCost = netWholesalePrice * (1 + vatRate / 100);
  const price = grossCost * (1 + marginPercent / 100);
  return Math.ceil(price) - 0.1;
}

function availabilityFromStock(stock: number): AvailabilityStatus {
  if (stock === 0) return "out_of_stock";
  if (stock < 8) return "low_stock";
  return "in_stock";
}

function mapCategory(category: string) {
  const normalized = category.toLowerCase();
  return CATEGORY_MAP.find(([needle]) => normalized.includes(needle))?.[1] ?? "Pielęgnacja";
}

function mapRoutineStep(category: string): RoutineStep {
  const normalized = category.toLowerCase();
  return ROUTINE_MAP.find(([needle]) => normalized.includes(needle))?.[1] ?? "cream";
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildShortBenefit(row: SupplierProductRow) {
  const concern = splitTags(row.skinConcerns)[0] ?? "codzienną pielęgnację";
  return `Wsparcie dla skóry: ${concern}`;
}
```

- [ ] **Step 5: Run importer test and confirm it passes**

Run:

```powershell
npm run test -- src/domain/importer.test.ts
```

Expected: PASS.

- [ ] **Step 6: Checkpoint**

If Git is available:

```powershell
git add src/domain/product.ts src/domain/importer.ts src/domain/importer.test.ts
git commit -m "feat: add supplier product importer"
```

Expected in the current projectless workspace: skip if not a Git repo.

---

### Task 3: Add Demo Product Feed And Catalog Logic

**Files:**
- Create: `src/data/demoSupplierFeed.ts`
- Create: `src/domain/catalog.ts`
- Create: `src/domain/catalog.test.ts`

- [ ] **Step 1: Write catalog tests**

`src/domain/catalog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { filterProducts, recommendRoutineProducts } from "./catalog";
import type { StoreProduct } from "./product";

const products: StoreProduct[] = [
  product("serum", "Serum ceramidowe", ["bariera"], ["wrażliwa"], ["ceramidy"], 79.9, "serum"),
  product("spf", "Krem SPF 50", ["przebarwienia"], ["mieszana"], ["filtry"], 69.9, "spf"),
  product("cream", "Krem kojący", ["bariera"], ["sucha"], ["pantenol"], 59.9, "cream"),
];

describe("catalog domain", () => {
  it("filters by concern, skin type, ingredient, price, and availability", () => {
    const result = filterProducts(products, {
      concern: "bariera",
      skinType: "wrażliwa",
      ingredient: "ceramidy",
      category: "all",
      maxPrice: 100,
      onlyAvailable: true,
    });

    expect(result.map((item) => item.sku)).toEqual(["serum"]);
  });

  it("recommends products from different routine steps", () => {
    const result = recommendRoutineProducts(products[0], products);

    expect(result.map((item) => item.routineStep)).toEqual(["spf", "cream"]);
  });
});

function product(
  sku: string,
  name: string,
  skinConcerns: string[],
  skinTypes: string[],
  activeIngredients: string[],
  retailPrice: number,
  routineStep: StoreProduct["routineStep"],
): StoreProduct {
  return {
    id: sku,
    supplierId: "demo",
    sku,
    ean: sku,
    slug: sku,
    name,
    brand: "DermaLab",
    producer: "Demo Lab",
    description: name,
    shortBenefit: name,
    category: routineStep === "spf" ? "SPF" : "Serum",
    skinConcerns,
    skinTypes,
    activeIngredients,
    routineStep,
    images: ["image"],
    netWholesalePrice: 30,
    vatRate: 23,
    retailPrice,
    marginPercent: 55,
    stock: 12,
    availabilityStatus: "in_stock",
    tags: skinConcerns,
    isPublished: true,
    validationIssues: [],
  };
}
```

- [ ] **Step 2: Run catalog tests and confirm failure**

Run:

```powershell
npm run test -- src/domain/catalog.test.ts
```

Expected: FAIL because `src/domain/catalog.ts` does not exist.

- [ ] **Step 3: Implement catalog logic**

`src/domain/catalog.ts`:

```ts
import type { ProductFilters, StoreProduct } from "./product";

export function filterProducts(products: StoreProduct[], filters: ProductFilters) {
  return products.filter((product) => {
    if (!product.isPublished) return false;
    if (filters.onlyAvailable && product.availabilityStatus === "out_of_stock") return false;
    if (filters.concern !== "all" && !product.skinConcerns.includes(filters.concern)) return false;
    if (filters.skinType !== "all" && !product.skinTypes.includes(filters.skinType)) return false;
    if (filters.ingredient !== "all" && !product.activeIngredients.includes(filters.ingredient)) return false;
    if (filters.category !== "all" && product.category !== filters.category) return false;
    if (filters.maxPrice !== null && product.retailPrice > filters.maxPrice) return false;
    return true;
  });
}

export function recommendRoutineProducts(current: StoreProduct, products: StoreProduct[]) {
  const preferredOrder: StoreProduct["routineStep"][] = ["cleanser", "serum", "cream", "spf", "accessory"];

  return products
    .filter((product) => product.id !== current.id)
    .filter((product) => product.isPublished && product.availabilityStatus !== "out_of_stock")
    .filter((product) => product.routineStep !== current.routineStep)
    .sort((a, b) => preferredOrder.indexOf(a.routineStep) - preferredOrder.indexOf(b.routineStep))
    .slice(0, 3);
}

export function uniqueValues(products: StoreProduct[], field: keyof Pick<StoreProduct, "category">) {
  return Array.from(new Set(products.map((product) => String(product[field])))).sort();
}

export function uniqueTags(products: StoreProduct[], field: keyof Pick<StoreProduct, "skinConcerns" | "skinTypes" | "activeIngredients">) {
  return Array.from(new Set(products.flatMap((product) => product[field]))).sort();
}
```

- [ ] **Step 4: Create demo supplier feed**

`src/data/demoSupplierFeed.ts`:

```ts
import type { SupplierProductRow } from "../domain/product";

export const demoSupplierFeed: SupplierProductRow[] = [
  {
    supplierId: "ico-demo",
    sku: "DL-CLE-001",
    ean: "5900000000101",
    name: "Emulsja oczyszczająca dla skóry wrażliwej",
    brand: "DermaLab",
    producer: "Demo Beauty Lab",
    supplierCategory: "Pielęgnacja twarzy / Oczyszczanie",
    description: "Łagodna emulsja do porannego i wieczornego oczyszczania skóry wrażliwej.",
    netWholesalePrice: 24,
    vatRate: 23,
    stock: 60,
    imageUrls: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80"],
    activeIngredients: "pantenol, alantoina",
    skinConcerns: "wrażliwość, bariera",
    skinTypes: "wrażliwa, sucha",
  },
  {
    supplierId: "ico-demo",
    sku: "DL-SER-002",
    ean: "5900000000102",
    name: "Serum z niacynamidem na przebarwienia",
    brand: "DermaLab",
    producer: "Demo Beauty Lab",
    supplierCategory: "Pielęgnacja twarzy / Serum",
    description: "Serum wspierające równomierny koloryt i codzienną regenerację skóry.",
    netWholesalePrice: 42,
    vatRate: 23,
    stock: 34,
    imageUrls: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"],
    activeIngredients: "niacynamid, kwas traneksamowy",
    skinConcerns: "przebarwienia, bariera",
    skinTypes: "mieszana, wrażliwa",
  },
  {
    supplierId: "ico-demo",
    sku: "DL-SPF-003",
    ean: "5900000000103",
    name: "Lekki krem SPF 50 do skóry reaktywnej",
    brand: "DermaLab",
    producer: "Demo Beauty Lab",
    supplierCategory: "Pielęgnacja twarzy / SPF",
    description: "Codzienna ochrona przeciwsłoneczna dla skóry podatnej na zaczerwienienia.",
    netWholesalePrice: 36,
    vatRate: 23,
    stock: 20,
    imageUrls: ["https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=80"],
    activeIngredients: "filtry uv, witamina e",
    skinConcerns: "przebarwienia, wrażliwość",
    skinTypes: "wrażliwa, mieszana",
  },
  {
    supplierId: "ico-demo",
    sku: "DL-CRM-004",
    ean: "5900000000104",
    name: "Krem ceramidowy odbudowujący barierę",
    brand: "DermaLab",
    producer: "Demo Beauty Lab",
    supplierCategory: "Pielęgnacja twarzy / Krem",
    description: "Bogatszy krem na noc wspierający komfort skóry suchej i naruszonej.",
    netWholesalePrice: 31,
    vatRate: 23,
    stock: 14,
    imageUrls: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"],
    activeIngredients: "ceramidy, skwalan, cholesterol",
    skinConcerns: "bariera, przesuszenie",
    skinTypes: "sucha, wrażliwa",
  },
  {
    supplierId: "ico-demo",
    sku: "DL-ACC-005",
    ean: "5900000000105",
    name: "Opaska kosmetyczna do rutyny pielęgnacyjnej",
    brand: "DermaLab",
    producer: "Demo Beauty Lab",
    supplierCategory: "Akcesoria beauty",
    description: "Miękka opaska ułatwiająca oczyszczanie i aplikację kosmetyków.",
    netWholesalePrice: 9,
    vatRate: 23,
    stock: 85,
    imageUrls: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"],
    activeIngredients: "akcesorium",
    skinConcerns: "rutyna",
    skinTypes: "każda",
  },
];
```

- [ ] **Step 5: Run catalog tests**

Run:

```powershell
npm run test -- src/domain/catalog.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run all domain tests so far**

Run:

```powershell
npm run test -- src/domain/importer.test.ts src/domain/catalog.test.ts
```

Expected: PASS.

- [ ] **Step 7: Checkpoint**

If Git is available:

```powershell
git add src/data/demoSupplierFeed.ts src/domain/catalog.ts src/domain/catalog.test.ts
git commit -m "feat: add demo feed and catalog filtering"
```

Expected in the current projectless workspace: skip if not a Git repo.

---

### Task 4: Add Cart And Demo Checkout Domain Logic

**Files:**
- Create: `src/domain/cart.ts`
- Create: `src/domain/cart.test.ts`
- Modify: `src/domain/product.ts`

- [ ] **Step 1: Extend domain types**

Add to `src/domain/product.ts`:

```ts
export interface CartLine {
  productId: string;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  itemCount: number;
}

export interface CheckoutResult {
  ok: boolean;
  message: string;
  issues: string[];
}
```

- [ ] **Step 2: Write cart tests**

`src/domain/cart.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { addToCart, calculateCartTotals, removeFromCart, updateQuantity, validateDemoCheckout } from "./cart";
import type { StoreProduct } from "./product";

const product = makeProduct("serum", 79.9, 10);
const unavailable = makeProduct("spf", 69.9, 0);

describe("cart domain", () => {
  it("adds products and increments quantity", () => {
    const cart = addToCart(addToCart([], product), product);

    expect(cart).toEqual([{ productId: "serum", quantity: 2 }]);
  });

  it("updates and removes cart lines", () => {
    const cart = addToCart([], product);

    expect(updateQuantity(cart, "serum", 3)).toEqual([{ productId: "serum", quantity: 3 }]);
    expect(removeFromCart(cart, "serum")).toEqual([]);
  });

  it("calculates totals from current product prices", () => {
    const cart = [{ productId: "serum", quantity: 2 }];

    expect(calculateCartTotals(cart, [product])).toEqual({ subtotal: 159.8, itemCount: 2 });
  });

  it("blocks demo checkout when product is unavailable", () => {
    const result = validateDemoCheckout([{ productId: "spf", quantity: 1 }], [unavailable]);

    expect(result.ok).toBe(false);
    expect(result.issues[0]).toContain("niedostępny");
  });
});

function makeProduct(id: string, retailPrice: number, stock: number): StoreProduct {
  return {
    id,
    supplierId: "demo",
    sku: id,
    ean: id,
    slug: id,
    name: id,
    brand: "DermaLab",
    producer: "Demo",
    description: id,
    shortBenefit: id,
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
  };
}
```

- [ ] **Step 3: Run cart tests and confirm failure**

Run:

```powershell
npm run test -- src/domain/cart.test.ts
```

Expected: FAIL because `src/domain/cart.ts` does not exist.

- [ ] **Step 4: Implement cart domain**

`src/domain/cart.ts`:

```ts
import type { CartLine, CartTotals, CheckoutResult, StoreProduct } from "./product";

export function addToCart(cart: CartLine[], product: StoreProduct): CartLine[] {
  const existing = cart.find((line) => line.productId === product.id);
  if (existing) {
    return cart.map((line) =>
      line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
    );
  }
  return [...cart, { productId: product.id, quantity: 1 }];
}

export function updateQuantity(cart: CartLine[], productId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return removeFromCart(cart, productId);
  return cart.map((line) => (line.productId === productId ? { ...line, quantity } : line));
}

export function removeFromCart(cart: CartLine[], productId: string): CartLine[] {
  return cart.filter((line) => line.productId !== productId);
}

export function calculateCartTotals(cart: CartLine[], products: StoreProduct[]): CartTotals {
  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.retailPrice ?? 0) * line.quantity;
  }, 0);

  return {
    subtotal: roundMoney(subtotal),
    itemCount: cart.reduce((sum, line) => sum + line.quantity, 0),
  };
}

export function validateDemoCheckout(cart: CartLine[], products: StoreProduct[]): CheckoutResult {
  const issues: string[] = [];

  if (cart.length === 0) issues.push("Koszyk jest pusty.");

  for (const line of cart) {
    const product = products.find((item) => item.id === line.productId);
    if (!product) {
      issues.push("Produkt nie istnieje w aktualnym katalogu.");
      continue;
    }
    if (product.availabilityStatus === "out_of_stock" || product.stock < line.quantity) {
      issues.push(`${product.name} jest niedostępny w wybranej ilości.`);
    }
  }

  return {
    ok: issues.length === 0,
    message: issues.length === 0 ? "Zamówienie demo zostało przyjęte." : "Sprawdź koszyk przed finalizacją.",
    issues,
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
```

- [ ] **Step 5: Run cart tests**

Run:

```powershell
npm run test -- src/domain/cart.test.ts
```

Expected: PASS.

- [ ] **Step 6: Run all domain tests**

Run:

```powershell
npm run test -- src/domain/importer.test.ts src/domain/catalog.test.ts src/domain/cart.test.ts
```

Expected: PASS.

- [ ] **Step 7: Checkpoint**

If Git is available:

```powershell
git add src/domain/product.ts src/domain/cart.ts src/domain/cart.test.ts
git commit -m "feat: add cart and demo checkout domain"
```

Expected in the current projectless workspace: skip if not a Git repo.

---

### Task 5: Build Storefront UI Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/HomePage.tsx`
- Create: `src/components/Catalog.tsx`
- Create: `src/components/ProductDetail.tsx`
- Create: `src/components/CartDrawer.tsx`
- Create: `src/components/ImportReportPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create header**

`src/components/Header.tsx`:

```tsx
import { ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartOpen: () => void;
}

export function Header({ cartCount, onCartOpen }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="DermaLab home">
        DermaLab
      </a>
      <nav aria-label="Główna nawigacja">
        <a href="#catalog">Katalog</a>
        <a href="#routine">Rutyny</a>
        <a href="#import">Import</a>
      </nav>
      <button className="icon-button" type="button" onClick={onCartOpen} aria-label="Otwórz koszyk">
        <ShoppingBag size={20} />
        <span>{cartCount}</span>
      </button>
    </header>
  );
}
```

- [ ] **Step 2: Create homepage**

`src/components/HomePage.tsx`:

```tsx
const concerns = ["bariera", "wrażliwość", "przebarwienia", "przesuszenie"];

interface HomePageProps {
  onConcernSelect: (concern: string) => void;
}

export function HomePage({ onConcernSelect }: HomePageProps) {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow">Dermokosmetyki kliniczne</p>
        <h1>Pielęgnacja skóry wrażliwej dobrana do problemu.</h1>
        <p>
          Zbuduj prostą rutynę: oczyszczanie, serum, krem i SPF. Demo sklepu
          działa na danych z adaptera hurtowni.
        </p>
        <div className="concern-row" aria-label="Szybki wybór problemu skóry">
          {concerns.map((concern) => (
            <button key={concern} type="button" onClick={() => onConcernSelect(concern)}>
              {concern}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create catalog**

`src/components/Catalog.tsx`:

```tsx
import type { ProductFilters, StoreProduct } from "../domain/product";

interface CatalogProps {
  products: StoreProduct[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onProductSelect: (product: StoreProduct) => void;
  onAddToCart: (product: StoreProduct) => void;
  concerns: string[];
  skinTypes: string[];
  ingredients: string[];
  categories: string[];
}

export function Catalog({
  products,
  filters,
  onFiltersChange,
  onProductSelect,
  onAddToCart,
  concerns,
  skinTypes,
  ingredients,
  categories,
}: CatalogProps) {
  return (
    <section className="section" id="catalog">
      <div className="section-heading">
        <p className="eyebrow">Katalog</p>
        <h2>Filtry kliniczne</h2>
      </div>
      <div className="catalog-layout">
        <aside className="filters" aria-label="Filtry produktów">
          <Select label="Problem" value={filters.concern} values={concerns} onChange={(concern) => onFiltersChange({ ...filters, concern })} />
          <Select label="Typ skóry" value={filters.skinType} values={skinTypes} onChange={(skinType) => onFiltersChange({ ...filters, skinType })} />
          <Select label="Składnik" value={filters.ingredient} values={ingredients} onChange={(ingredient) => onFiltersChange({ ...filters, ingredient })} />
          <Select label="Kategoria" value={filters.category} values={categories} onChange={(category) => onFiltersChange({ ...filters, category })} />
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={(event) => onFiltersChange({ ...filters, onlyAvailable: event.currentTarget.checked })}
            />
            Tylko dostępne
          </label>
        </aside>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <button type="button" className="image-button" onClick={() => onProductSelect(product)}>
                <img src={product.images[0]} alt="" />
              </button>
              <div>
                <p className="product-brand">{product.brand}</p>
                <h3>{product.name}</h3>
                <p>{product.shortBenefit}</p>
              </div>
              <div className="product-actions">
                <strong>{product.retailPrice.toFixed(2)} zł</strong>
                <button type="button" onClick={() => onAddToCart(product)}>
                  Dodaj
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface SelectProps {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}

function Select({ label, value, values, onChange }: SelectProps) {
  return (
    <label>
      {label}
      <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        <option value="all">Wszystkie</option>
        {values.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 4: Create product detail**

`src/components/ProductDetail.tsx`:

```tsx
import type { StoreProduct } from "../domain/product";

interface ProductDetailProps {
  product: StoreProduct | null;
  recommendations: StoreProduct[];
  onAddToCart: (product: StoreProduct) => void;
}

export function ProductDetail({ product, recommendations, onAddToCart }: ProductDetailProps) {
  if (!product) return null;

  return (
    <section className="section product-detail">
      <img src={product.images[0]} alt="" />
      <div>
        <p className="eyebrow">{product.category}</p>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <ul className="tag-list">
          {product.activeIngredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
        <p>
          Krok rutyny: <strong>{product.routineStep}</strong>
        </p>
        <button type="button" onClick={() => onAddToCart(product)}>
          Dodaj do koszyka - {product.retailPrice.toFixed(2)} zł
        </button>
      </div>
      <aside className="recommendations" id="routine">
        <h3>Uzupełnij rutynę</h3>
        {recommendations.map((item) => (
          <button key={item.id} type="button" onClick={() => onAddToCart(item)}>
            {item.name}
            <span>{item.retailPrice.toFixed(2)} zł</span>
          </button>
        ))}
      </aside>
    </section>
  );
}
```

- [ ] **Step 5: Create cart drawer**

`src/components/CartDrawer.tsx`:

```tsx
import type { CartLine, StoreProduct } from "../domain/product";
import { calculateCartTotals, validateDemoCheckout } from "../domain/cart";

interface CartDrawerProps {
  open: boolean;
  cart: CartLine[];
  products: StoreProduct[];
  onClose: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function CartDrawer({ open, cart, products, onClose, onQuantityChange }: CartDrawerProps) {
  const totals = calculateCartTotals(cart, products);
  const checkout = validateDemoCheckout(cart, products);

  if (!open) return null;

  return (
    <div className="cart-backdrop" role="presentation">
      <aside className="cart-drawer" aria-label="Koszyk">
        <div className="cart-header">
          <h2>Koszyk</h2>
          <button type="button" onClick={onClose} aria-label="Zamknij koszyk">
            Zamknij
          </button>
        </div>
        {cart.length === 0 ? (
          <p>Koszyk jest pusty.</p>
        ) : (
          cart.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <div className="cart-line" key={line.productId}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.retailPrice.toFixed(2)} zł</span>
                </div>
                <input
                  aria-label={`Ilość: ${product.name}`}
                  min={0}
                  type="number"
                  value={line.quantity}
                  onChange={(event) => onQuantityChange(product.id, Number(event.currentTarget.value))}
                />
              </div>
            );
          })
        )}
        <div className="checkout-box">
          <strong>Suma: {totals.subtotal.toFixed(2)} zł</strong>
          <p>{checkout.message}</p>
          {checkout.issues.map((issue) => (
            <p className="error" key={issue}>
              {issue}
            </p>
          ))}
          <button type="button" disabled={!checkout.ok}>
            Finalizuj demo
          </button>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 6: Create import report panel**

`src/components/ImportReportPanel.tsx`:

```tsx
import type { ImportReport } from "../domain/product";

export function ImportReportPanel({ report }: { report: ImportReport }) {
  return (
    <section className="section import-panel" id="import">
      <div>
        <p className="eyebrow">Adapter hurtowni</p>
        <h2>Raport importu demo</h2>
        <p>
          Dodane: {report.summary.added}, zaktualizowane: {report.summary.updated}, pominięte: {report.summary.skipped}
        </p>
      </div>
      {report.skipped.length > 0 && (
        <ul>
          {report.skipped.map((item) => (
            <li key={`${item.sku}-${item.name}`}>
              {item.name}: {item.issues.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 7: Wire components in `App.tsx`**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Catalog } from "./components/Catalog";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ImportReportPanel } from "./components/ImportReportPanel";
import { ProductDetail } from "./components/ProductDetail";
import { demoSupplierFeed } from "./data/demoSupplierFeed";
import { addToCart, updateQuantity } from "./domain/cart";
import { filterProducts, recommendRoutineProducts, uniqueTags, uniqueValues } from "./domain/catalog";
import { importSupplierRows } from "./domain/importer";
import type { CartLine, ProductFilters, StoreProduct } from "./domain/product";

const defaultFilters: ProductFilters = {
  concern: "all",
  skinType: "all",
  ingredient: "all",
  category: "all",
  maxPrice: null,
  onlyAvailable: true,
};

export default function App() {
  const importReport = useMemo(() => importSupplierRows(demoSupplierFeed), []);
  const products = importReport.products;
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(products[0] ?? null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const recommendations = selectedProduct ? recommendRoutineProducts(selectedProduct, products) : [];

  return (
    <main className="app-shell">
      <Header cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} onCartOpen={() => setCartOpen(true)} />
      <HomePage onConcernSelect={(concern) => setFilters({ ...defaultFilters, concern })} />
      <Catalog
        products={visibleProducts}
        filters={filters}
        onFiltersChange={setFilters}
        onProductSelect={setSelectedProduct}
        onAddToCart={(product) => {
          setCart((current) => addToCart(current, product));
          setCartOpen(true);
        }}
        concerns={uniqueTags(products, "skinConcerns")}
        skinTypes={uniqueTags(products, "skinTypes")}
        ingredients={uniqueTags(products, "activeIngredients")}
        categories={uniqueValues(products, "category")}
      />
      <ProductDetail
        product={selectedProduct}
        recommendations={recommendations}
        onAddToCart={(product) => {
          setCart((current) => addToCart(current, product));
          setCartOpen(true);
        }}
      />
      <ImportReportPanel report={importReport} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        products={products}
        onClose={() => setCartOpen(false)}
        onQuantityChange={(productId, quantity) => setCart((current) => updateQuantity(current, productId, quantity))}
      />
    </main>
  );
}
```

- [ ] **Step 8: Replace CSS with responsive clinical-premium styling**

Replace `src/styles.css` with:

```css
:root {
  color: #17231f;
  background: #f7faf9;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 16px clamp(20px, 5vw, 72px);
  background: rgba(247, 250, 249, 0.92);
  border-bottom: 1px solid #dce8e3;
  backdrop-filter: blur(16px);
}

.brand {
  color: #15372e;
  font-weight: 900;
  text-decoration: none;
}

.site-header nav {
  display: flex;
  gap: 18px;
}

.site-header a {
  color: #344d45;
  text-decoration: none;
}

.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #b9d0c7;
  border-radius: 8px;
  padding: 9px 12px;
  background: #ffffff;
  color: #173c32;
}

.hero {
  min-height: 88vh;
  display: grid;
  align-content: center;
  padding: 48px clamp(20px, 5vw, 72px);
  background:
    linear-gradient(90deg, rgba(247, 250, 249, 0.96), rgba(247, 250, 249, 0.76)),
    url("https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80");
  background-size: cover;
  background-position: center;
}

.hero-copy {
  max-width: 780px;
}

.hero h1,
.section-heading h2,
.product-detail h2,
.import-panel h2 {
  margin: 0;
  letter-spacing: 0;
}

.hero h1 {
  font-size: clamp(2.5rem, 7vw, 5.8rem);
  line-height: 0.98;
}

.hero p,
.section p,
.product-card p {
  line-height: 1.65;
  color: #506960;
}

.eyebrow {
  margin: 0 0 14px;
  color: #1f6b55;
  font-weight: 800;
  text-transform: uppercase;
}

.concern-row,
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  list-style: none;
}

.concern-row button,
.product-actions button,
.product-detail button,
.recommendations button,
.checkout-box button {
  border: 0;
  border-radius: 8px;
  padding: 11px 14px;
  background: #175a47;
  color: #ffffff;
  font-weight: 800;
}

.section {
  padding: 64px clamp(20px, 5vw, 72px);
}

.section-heading {
  margin-bottom: 24px;
}

.catalog-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) 1fr;
  gap: 24px;
  align-items: start;
}

.filters {
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid #dce8e3;
  background: #ffffff;
  border-radius: 8px;
}

.filters label {
  display: grid;
  gap: 6px;
  color: #344d45;
  font-weight: 700;
}

.filters select,
.cart-line input {
  width: 100%;
  border: 1px solid #b9d0c7;
  border-radius: 8px;
  padding: 10px;
  background: #ffffff;
  color: #17231f;
}

.checkbox-row {
  display: flex !important;
  grid-template-columns: auto 1fr;
  align-items: center;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 18px;
}

.product-card {
  display: grid;
  gap: 14px;
  padding: 14px;
  border: 1px solid #dce8e3;
  border-radius: 8px;
  background: #ffffff;
}

.image-button {
  padding: 0;
  border: 0;
  background: transparent;
}

.product-card img,
.product-detail img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
}

.product-card h3 {
  min-height: 3.1em;
  margin: 0;
}

.product-brand {
  margin: 0 0 4px;
  color: #1f6b55 !important;
  font-weight: 800;
}

.product-actions,
.cart-header,
.cart-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.product-detail {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(280px, 1fr) minmax(220px, 0.7fr);
  gap: 28px;
  align-items: start;
  background: #eef6f3;
}

.tag-list li {
  padding: 8px 10px;
  border-radius: 8px;
  background: #ffffff;
  color: #315147;
  font-weight: 700;
}

.recommendations {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
}

.recommendations button {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  text-align: left;
}

.import-panel {
  background: #ffffff;
}

.cart-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  justify-content: flex-end;
  background: rgba(12, 24, 20, 0.36);
}

.cart-drawer {
  width: min(430px, 100%);
  min-height: 100%;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 22px;
  background: #ffffff;
  box-shadow: -20px 0 60px rgba(22, 42, 36, 0.18);
}

.cart-line {
  padding: 12px 0;
  border-bottom: 1px solid #dce8e3;
}

.cart-line div {
  display: grid;
  gap: 4px;
}

.cart-line input {
  max-width: 84px;
}

.checkout-box {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 8px;
  background: #f3f8f6;
}

.checkout-box button:disabled {
  background: #9badab;
  cursor: not-allowed;
}

.error {
  margin: 0;
  color: #8c2d2d !important;
  font-weight: 700;
}

@media (max-width: 820px) {
  .site-header nav {
    display: none;
  }

  .catalog-layout,
  .product-detail {
    grid-template-columns: 1fr;
  }

  .hero {
    min-height: 78vh;
  }
}
```

- [ ] **Step 9: Build after UI wiring**

Run:

```powershell
npm run build
```

Expected: PASS.

- [ ] **Step 10: Checkpoint**

If Git is available:

```powershell
git add src/App.tsx src/components src/styles.css
git commit -m "feat: build clinical storefront UI"
```

Expected in the current projectless workspace: skip if not a Git repo.

---

### Task 6: Add Interaction Tests For Storefront Workflows

**Files:**
- Create: `src/App.test.tsx`

- [ ] **Step 1: Write app workflow tests**

`src/App.test.tsx`:

```tsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("DermaLab storefront", () => {
  it("renders the clinical homepage and catalog", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /pielęgnacja skóry wrażliwej/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /filtry kliniczne/i })).toBeInTheDocument();
    expect(screen.getByText(/raport importu demo/i)).toBeInTheDocument();
  });

  it("adds a product to cart and shows demo checkout state", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButtons = screen.getAllByRole("button", { name: /dodaj/i });
    await user.click(addButtons[0]);

    expect(screen.getByRole("complementary", { name: /koszyk/i })).toBeInTheDocument();
    expect(screen.getByText(/zamówienie demo zostało przyjęte/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run app tests and confirm behavior**

Run:

```powershell
npm run test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Run the full test suite**

Run:

```powershell
npm run test
```

Expected: PASS for importer, catalog, cart, and app workflow tests.

- [ ] **Step 4: Checkpoint**

If Git is available:

```powershell
git add src/App.test.tsx
git commit -m "test: cover storefront workflow"
```

Expected in the current projectless workspace: skip if not a Git repo.

---

### Task 7: Final Build And Browser Verification

**Files:**
- No code files required unless verification finds a bug.

- [ ] **Step 1: Run production build**

Run:

```powershell
npm run build
```

Expected: PASS and `dist/` is created.

- [ ] **Step 2: Start a local preview server**

Run:

```powershell
npm run dev
```

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 3: Verify desktop in the browser**

Open the Vite URL in the in-app browser. Verify:

- Hero image loads and the first viewport clearly signals DermaLab dermocosmetics.
- Catalog cards do not overlap.
- Filters update product results.
- Product detail section is readable.
- Cart drawer opens after adding a product.
- Demo checkout message appears.

- [ ] **Step 4: Verify mobile viewport**

Use the browser or Playwright screenshot at mobile width around 390px. Verify:

- Header does not overflow.
- Hero text fits.
- Catalog filters stack above product cards.
- Product detail stacks vertically.
- Cart drawer fits within the viewport.

- [ ] **Step 5: Fix any verification bugs using TDD when domain-related**

If a domain bug appears, add or update a failing test before changing logic. For visual-only CSS issues, make the smallest CSS change and re-run browser verification.

- [ ] **Step 6: Final test command**

Run:

```powershell
npm run test
npm run build
```

Expected: both commands PASS.

- [ ] **Step 7: Final checkpoint**

If Git is available:

```powershell
git add .
git commit -m "feat: complete dermalab dropshipping MVP"
```

Expected in the current projectless workspace: skip if not a Git repo.
