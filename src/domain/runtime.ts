export type ClientEnv = Record<string, string | undefined>;

export function readClientEnv(): ClientEnv {
  return {
    VITE_CHECKOUT_ENDPOINT: import.meta.env.VITE_CHECKOUT_ENDPOINT,
    VITE_GA4_ID: import.meta.env.VITE_GA4_ID,
    VITE_LEGAL_REVIEWED: import.meta.env.VITE_LEGAL_REVIEWED,
    VITE_META_PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID,
    VITE_PRIVACY_URL: import.meta.env.VITE_PRIVACY_URL,
    VITE_STORE_ADDRESS: import.meta.env.VITE_STORE_ADDRESS,
    VITE_STORE_EMAIL: import.meta.env.VITE_STORE_EMAIL,
    VITE_STORE_LEGAL_NAME: import.meta.env.VITE_STORE_LEGAL_NAME,
    VITE_STORE_NAME: import.meta.env.VITE_STORE_NAME,
    VITE_STORE_TAX_ID: import.meta.env.VITE_STORE_TAX_ID,
    VITE_SUPPLIER_API_KEY: import.meta.env.VITE_SUPPLIER_API_KEY,
    VITE_SUPPLIER_FEED_MODE: import.meta.env.VITE_SUPPLIER_FEED_MODE,
    VITE_SUPPLIER_FEED_REFRESH_MINUTES: import.meta.env.VITE_SUPPLIER_FEED_REFRESH_MINUTES,
    VITE_SUPPLIER_FEED_URL: import.meta.env.VITE_SUPPLIER_FEED_URL,
    VITE_SUPPLIER_NAME: import.meta.env.VITE_SUPPLIER_NAME,
    VITE_TERMS_URL: import.meta.env.VITE_TERMS_URL,
  };
}

export function readCheckoutEndpoint(env: ClientEnv = readClientEnv()) {
  return env.VITE_CHECKOUT_ENDPOINT?.trim() ?? "";
}
