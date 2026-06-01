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
  const preferredOrder: StoreProduct["routineStep"][] = ["cleanser", "serum", "spf", "cream", "accessory"];

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

export function uniqueTags(
  products: StoreProduct[],
  field: keyof Pick<StoreProduct, "skinConcerns" | "skinTypes" | "activeIngredients">,
) {
  return Array.from(new Set(products.flatMap((product) => product[field]))).sort();
}
