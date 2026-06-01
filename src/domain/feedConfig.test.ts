import { describe, expect, it } from "vitest";
import { getSupplierFeedStatus, readSupplierFeedConfig } from "./feedConfig";

describe("supplier feed config", () => {
  it("keeps demo feed active when live supplier settings are missing", () => {
    const config = readSupplierFeedConfig({});
    const status = getSupplierFeedStatus(config);

    expect(config.mode).toBe("demo");
    expect(status.ready).toBe(false);
    expect(status.missingItems).toContain("Production feed URL");
  });

  it("marks a CSV feed as ready when a production URL is configured", () => {
    const config = readSupplierFeedConfig({
      VITE_SUPPLIER_FEED_MODE: "csv",
      VITE_SUPPLIER_FEED_URL: "https://b2b.example.com/feed.csv",
      VITE_SUPPLIER_FEED_REFRESH_MINUTES: "45",
    });
    const status = getSupplierFeedStatus(config);

    expect(config.mode).toBe("csv");
    expect(config.refreshMinutes).toBe(45);
    expect(status.ready).toBe(true);
    expect(status.missingItems).toEqual([]);
  });

  it("requires credentials for API supplier feeds", () => {
    const config = readSupplierFeedConfig({
      VITE_SUPPLIER_FEED_MODE: "api",
      VITE_SUPPLIER_FEED_URL: "https://b2b.example.com/api/products",
    });
    const status = getSupplierFeedStatus(config);

    expect(status.ready).toBe(false);
    expect(status.missingItems).toContain("Supplier API key");
  });
});
