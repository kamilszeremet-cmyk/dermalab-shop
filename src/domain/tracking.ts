import type { CheckoutPayload } from "./checkout";
import type { TrackingConsent } from "./cookieConsent";
import type { StoreProduct } from "./product";
import { readClientEnv, type ClientEnv } from "./runtime";

export type TrackingEventName = "view_item" | "add_to_cart" | "begin_checkout" | "purchase_handoff";

export interface TrackingConfig {
  enabled: boolean;
  ga4Id: string;
  metaPixelId: string;
}

export interface TrackingItem {
  item_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

export interface TrackingParams {
  value?: number;
  currency?: "PLN";
  items?: TrackingItem[];
  item_id?: string;
  item_name?: string;
}

export interface TrackingPayload {
  eventName: TrackingEventName;
  ga4Name: string;
  metaName: string;
  params: TrackingParams;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: string, eventName: string, params?: TrackingParams) => void;
    fbq?: (command: string, eventName: string, params?: TrackingParams) => void;
  }
}

const metaEventMap: Record<TrackingEventName, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase_handoff: "Purchase",
};

export function readTrackingConfig(env: ClientEnv = readClientEnv()): TrackingConfig {
  const ga4Id = env.VITE_GA4_ID?.trim() ?? "";
  const metaPixelId = env.VITE_META_PIXEL_ID?.trim() ?? "";

  return {
    enabled: Boolean(ga4Id || metaPixelId),
    ga4Id,
    metaPixelId,
  };
}

export function applyTrackingConsent(config: TrackingConfig, consent: TrackingConsent): TrackingConfig {
  const ga4Id = consent.analytics ? config.ga4Id : "";
  const metaPixelId = consent.marketing ? config.metaPixelId : "";

  return {
    enabled: Boolean(ga4Id || metaPixelId),
    ga4Id,
    metaPixelId,
  };
}

export function buildTrackingPayload(eventName: TrackingEventName, params: TrackingParams): TrackingPayload {
  return {
    eventName,
    ga4Name: eventName,
    metaName: metaEventMap[eventName],
    params,
  };
}

export function productTrackingParams(product: StoreProduct, quantity = 1): TrackingParams {
  return {
    value: Number((product.retailPrice * quantity).toFixed(2)),
    currency: "PLN",
    item_id: product.sku,
    item_name: product.name,
    items: [
      {
        item_id: product.sku,
        item_name: product.name,
        quantity,
        price: product.retailPrice,
      },
    ],
  };
}

export function checkoutPayloadTrackingParams(payload: CheckoutPayload): TrackingParams {
  return {
    value: Number((payload.totalAmount / 100).toFixed(2)),
    currency: "PLN",
    items: payload.lineItems.map((item) => ({
      item_id: item.sku,
      item_name: item.name,
      quantity: item.quantity,
      price: Number((item.unitAmount / 100).toFixed(2)),
    })),
  };
}

export function trackEvent(config: TrackingConfig, payload: TrackingPayload) {
  if (!config.enabled || typeof window === "undefined") return;

  if (config.ga4Id && window.gtag) {
    window.gtag("event", payload.ga4Name, payload.params);
  }

  if (config.metaPixelId && window.fbq) {
    window.fbq("track", payload.metaName, payload.params);
  }
}
