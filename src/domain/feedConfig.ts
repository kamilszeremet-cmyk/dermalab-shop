import { readClientEnv, type ClientEnv } from "./runtime";

export type SupplierFeedMode = "demo" | "csv" | "xml" | "api";

export interface SupplierFeedConfig {
  mode: SupplierFeedMode;
  sourceName: string;
  url: string;
  apiKey: string;
  refreshMinutes: number;
}

export interface SupplierFeedStatus {
  ready: boolean;
  label: string;
  missingItems: string[];
}

const modes: SupplierFeedMode[] = ["demo", "csv", "xml", "api"];

export function readSupplierFeedConfig(env: ClientEnv = readClientEnv()): SupplierFeedConfig {
  const requestedMode = env.VITE_SUPPLIER_FEED_MODE;
  const mode = modes.includes(requestedMode as SupplierFeedMode) ? (requestedMode as SupplierFeedMode) : "demo";
  const refreshMinutes = Number(env.VITE_SUPPLIER_FEED_REFRESH_MINUTES ?? 60);

  return {
    mode,
    sourceName: env.VITE_SUPPLIER_NAME?.trim() || "ICO Cosmetics",
    url: env.VITE_SUPPLIER_FEED_URL?.trim() ?? "",
    apiKey: env.VITE_SUPPLIER_API_KEY?.trim() ?? "",
    refreshMinutes: Number.isFinite(refreshMinutes) && refreshMinutes > 0 ? refreshMinutes : 60,
  };
}

export function getSupplierFeedStatus(config: SupplierFeedConfig): SupplierFeedStatus {
  const missingItems: string[] = [];

  if (config.mode === "demo") {
    missingItems.push("Production feed URL");
  }

  if (config.mode !== "demo" && !config.url) {
    missingItems.push("Production feed URL");
  }

  if (config.mode === "api" && !config.apiKey) {
    missingItems.push("Supplier API key");
  }

  return {
    ready: missingItems.length === 0,
    label: missingItems.length === 0 ? "Live supplier feed ready" : "Demo feed active",
    missingItems,
  };
}
