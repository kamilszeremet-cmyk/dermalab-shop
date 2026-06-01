export interface SupplierProfile {
  id: string;
  name: string;
  legalName: string;
  country: string;
  b2bUrl: string;
  categories: string[];
  integrationMethods: string[];
  publicTerms: string[];
  requiredNextSteps: string[];
}

export interface SupplierReadiness {
  score: number;
  readyItems: string[];
  missingItems: string[];
}

export const icoSupplierProfile: SupplierProfile = {
  id: "ico-cosmetics",
  name: "ICO Cosmetics",
  legalName: "ICO Cosmetics Sp. z o.o. Sp. k.",
  country: "Polska",
  b2bUrl: "https://b2b.icocosmetics.pl/",
  categories: ["dermokosmetyki", "pielęgnacja", "perfumy", "akcesoria"],
  integrationMethods: ["XML", "API", "BaseLinker Connect"],
  publicTerms: [
    "B2B dla firm",
    "Integracje cen, stanów, zamówień, zdjęć i faktur",
    "Asortyment dermokosmetyczny i kosmetyczny",
  ],
  requiredNextSteps: [
    "Live B2B credentials",
    "Supplier dropshipping agreement",
    "Production feed URL",
    "Order fulfillment SLA",
  ],
};

export function getSupplierReadiness(profile: SupplierProfile): SupplierReadiness {
  const readyItems = [
    "Product feed contract",
    `${profile.integrationMethods.join(" / ")} integration path`,
    "Pilot merchandising model",
  ];

  return {
    score: Math.round((readyItems.length / (readyItems.length + profile.requiredNextSteps.length)) * 100),
    readyItems,
    missingItems: profile.requiredNextSteps,
  };
}

