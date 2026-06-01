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
  seo: ProductSeo;
}

export interface ProductSeo {
  title: string;
  metaDescription: string;
  canonicalPath: string;
  faq: ProductFaq[];
}

export interface ProductFaq {
  question: string;
  answer: string;
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
