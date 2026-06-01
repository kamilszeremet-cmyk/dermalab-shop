import type { ProductFilters } from "./product";

export interface LandingPage {
  id: string;
  concern: string;
  title: string;
  subtitle: string;
  marginSignal: string;
  bundleSkus: string[];
  proofPoints: string[];
}

export const landingPages: LandingPage[] = [
  {
    id: "bariera",
    concern: "bariera",
    title: "Bariera hydrolipidowa bez ciężkiej rutyny",
    subtitle: "Zestaw cleanser + serum + krem dla klientów szukających komfortu skóry i prostego wyboru.",
    marginSignal: "wysoki koszyk: 3 produkty w rutynie",
    bundleSkus: ["ICO-CLE-001", "ICO-SER-002", "ICO-CRM-004"],
    proofPoints: ["ceramidy", "pantenol", "skwalan"],
  },
  {
    id: "sensitive",
    concern: "wrażliwość",
    title: "Skóra wrażliwa i reaktywna",
    subtitle: "Oferta dla osób, które kupują ostrożnie i potrzebują jasnego, klinicznego języka.",
    marginSignal: "niski próg wejścia: cleanser + SPF",
    bundleSkus: ["ICO-CLE-001", "ICO-SPF-003", "ICO-MSK-014"],
    proofPoints: ["alantoina", "filtry UV", "formuły kojące"],
  },
  {
    id: "pigmentation",
    concern: "przebarwienia",
    title: "Przebarwienia: serum i codzienny SPF",
    subtitle: "Najprostszy przekaz reklamowy: aktywne serum wieczorem, ochrona UV rano.",
    marginSignal: "dobry ROAS: problem widoczny i sezonowy",
    bundleSkus: ["ICO-SER-006", "ICO-SPF-003", "ICO-SPF-010"],
    proofPoints: ["niacynamid", "kwas traneksamowy", "SPF 50"],
  },
  {
    id: "spf",
    concern: "spf",
    title: "SPF do codziennej pielęgnacji",
    subtitle: "Landing sezonowy pod kampanie kwiecień-wrzesień i stałą edukację przeciw przebarwieniom.",
    marginSignal: "powtarzalny zakup: zużycie co 4-6 tygodni",
    bundleSkus: ["ICO-SPF-003", "ICO-SPF-010", "ICO-ACC-005"],
    proofPoints: ["SPF 50", "lekka konsystencja", "ochrona przed UVA/UVB"],
  },
];

export function findLandingPageByConcern(concern: string) {
  return landingPages.find((page) => page.concern === concern);
}

export function landingFilterForPage(page: LandingPage): ProductFilters {
  return {
    concern: page.concern,
    skinType: "all",
    ingredient: "all",
    category: "all",
    maxPrice: null,
    onlyAvailable: true,
  };
}

