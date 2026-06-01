import { readClientEnv, type ClientEnv } from "./runtime";

export interface StoreLegalConfig {
  storeName: string;
  legalName: string;
  taxId: string;
  address: string;
  email: string;
  termsUrl: string;
  privacyUrl: string;
  returnsDays: number;
  legalReviewRequired: boolean;
}

export interface StoreLegalStatus {
  ready: boolean;
  missingItems: string[];
}

export function readStoreConfig(env: ClientEnv = readClientEnv()): StoreLegalConfig {
  return {
    storeName: env.VITE_STORE_NAME?.trim() || "DermaLab",
    legalName: env.VITE_STORE_LEGAL_NAME?.trim() ?? "",
    taxId: env.VITE_STORE_TAX_ID?.trim() ?? "",
    address: env.VITE_STORE_ADDRESS?.trim() ?? "",
    email: env.VITE_STORE_EMAIL?.trim() ?? "",
    termsUrl: env.VITE_TERMS_URL?.trim() || "#regulamin",
    privacyUrl: env.VITE_PRIVACY_URL?.trim() || "#polityka-prywatnosci",
    returnsDays: 14,
    legalReviewRequired: env.VITE_LEGAL_REVIEWED !== "true",
  };
}

export function getStoreLegalStatus(config: StoreLegalConfig): StoreLegalStatus {
  const missingItems: string[] = [];

  if (!config.legalName) missingItems.push("Nazwa prawna firmy");
  if (!config.taxId) missingItems.push("NIP");
  if (!config.address) missingItems.push("Adres firmy");
  if (!config.email) missingItems.push("E-mail kontaktowy");
  if (!config.termsUrl) missingItems.push("Regulamin URL");
  if (!config.privacyUrl) missingItems.push("Polityka prywatnosci URL");
  if (config.legalReviewRequired) missingItems.push("Weryfikacja prawna dokumentow");

  return {
    ready: missingItems.length === 0,
    missingItems,
  };
}
