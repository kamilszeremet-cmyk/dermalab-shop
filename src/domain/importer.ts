import type {
  AvailabilityStatus,
  ImportReport,
  ProductSeo,
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

export interface PricingRule {
  id: string;
  label: string;
  routineStep: RoutineStep | "default";
  marginPercent: number;
  minGrossMargin: number;
  roundEnding: number;
}

export const pricingRules: PricingRule[] = [
  {
    id: "serum-roi",
    label: "Serum i produkty problemowe",
    routineStep: "serum",
    marginPercent: 58,
    minGrossMargin: 28,
    roundEnding: 0.99,
  },
  {
    id: "spf-seasonal",
    label: "SPF i ochrona dzienna",
    routineStep: "spf",
    marginPercent: 50,
    minGrossMargin: 24,
    roundEnding: 0.99,
  },
  {
    id: "accessory-cross-sell",
    label: "Akcesoria do podbicia koszyka",
    routineStep: "accessory",
    marginPercent: 70,
    minGrossMargin: 12,
    roundEnding: 0.99,
  },
  {
    id: "default-dermo",
    label: "Domyślna dermokosmetyka",
    routineStep: "default",
    marginPercent: 55,
    minGrossMargin: 22,
    roundEnding: 0.99,
  },
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

export function parseSupplierCsv(csv: string, supplierId: string): SupplierProductRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = splitCsvLine(lines[0], delimiter).map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line, delimiter);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));

    return {
      supplierId,
      sku: record.sku ?? "",
      ean: record.ean || undefined,
      name: record.name ?? "",
      brand: record.brand ?? "",
      producer: record.producer ?? "",
      supplierCategory: record.category ?? record.supplierCategory ?? "",
      description: record.description ?? "",
      netWholesalePrice: Number(record.net_price ?? record.netWholesalePrice ?? 0),
      vatRate: Number(record.vat ?? record.vatRate ?? 23),
      stock: Number(record.stock ?? 0),
      imageUrls: splitImages(record.images ?? record.imageUrls ?? ""),
      activeIngredients: record.ingredients ?? record.activeIngredients ?? "",
      skinConcerns: record.concerns ?? record.skinConcerns ?? "",
      skinTypes: record.skin_types ?? record.skinTypes ?? "",
    };
  });
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
  const pricingRule = selectPricingRule(routineStep);
  const retailPrice = calculateRetailPrice(row.netWholesalePrice, row.vatRate, pricingRule);
  const slug = slugify(row.name);

  return {
    id: row.sku || row.ean || slug,
    supplierId: row.supplierId,
    sku: row.sku,
    ean: row.ean,
    slug,
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
    marginPercent: pricingRule.marginPercent,
    stock: row.stock,
    availabilityStatus: availabilityFromStock(row.stock),
    tags: [category, routineStep, ...splitTags(row.skinConcerns)],
    isPublished: true,
    validationIssues: [],
    seo: buildSeo(row, slug),
  };
}

function calculateRetailPrice(netWholesalePrice: number, vatRate: number, pricingRule: PricingRule) {
  const grossCost = netWholesalePrice * (1 + vatRate / 100);
  const targetPrice = grossCost * (1 + pricingRule.marginPercent / 100);
  const minimumPrice = grossCost + pricingRule.minGrossMargin;
  return roundToEnding(Math.max(targetPrice, minimumPrice), pricingRule.roundEnding);
}

function roundToEnding(value: number, ending: number) {
  const whole = Math.floor(value);
  const candidate = whole + ending;
  const price = candidate >= value ? candidate : whole + 1 + ending;

  return Number(price.toFixed(2));
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

function selectPricingRule(routineStep: RoutineStep) {
  return pricingRules.find((rule) => rule.routineStep === routineStep) ?? pricingRules[pricingRules.length - 1];
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitImages(value: string) {
  return value
    .split("|")
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

function buildSeo(row: SupplierProductRow, slug: string): ProductSeo {
  const ingredients = splitTags(row.activeIngredients);
  const concerns = splitTags(row.skinConcerns);
  const skinTypes = splitTags(row.skinTypes);
  const ingredientText = ingredients.slice(0, 2).join(", ") || "składniki aktywne";
  const concernText = concerns[0] ?? "codzienną pielęgnację";

  return {
    title: `${row.name} | ${row.brand} | DermaLab`,
    metaDescription: `${row.name}: ${ingredientText}. Dermokosmetyk dla potrzeb: ${concernText}. Sprawdź cenę, dostępność i rutynę pielęgnacji.`,
    canonicalPath: `/produkty/${slug}`,
    faq: [
      {
        question: `Dla jakiej skóry jest ${row.name}?`,
        answer: `Najlepiej pasuje do skóry: ${skinTypes.join(", ") || "wymagającej prostej rutyny"}.`,
      },
      {
        question: "Jakie składniki są najważniejsze?",
        answer: ingredientText,
      },
      {
        question: "Z czym połączyć ten produkt?",
        answer: "Najlepiej działa jako element rutyny: oczyszczanie, produkt aktywny, krem i SPF.",
      },
    ],
  };
}

function splitCsvLine(line: string, delimiter: string) {
  const values: string[] = [];
  let current = "";
  let quoted = false;

  for (const char of line) {
    if (char === "\"") {
      quoted = !quoted;
      continue;
    }

    if (char === delimiter && !quoted) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}
