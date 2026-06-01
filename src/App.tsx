import { useEffect, useMemo, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { Catalog } from "./components/Catalog";
import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ImportReportPanel } from "./components/ImportReportPanel";
import { LandingPages } from "./components/LandingPages";
import { LegalDocuments } from "./components/LegalDocuments";
import { ProductDetail } from "./components/ProductDetail";
import { TrackingScripts } from "./components/TrackingScripts";
import { TrustAndLegal } from "./components/TrustAndLegal";
import { demoSupplierFeed } from "./data/demoSupplierFeed";
import { addToCart, updateQuantity } from "./domain/cart";
import { filterProducts, recommendRoutineProducts, uniqueTags, uniqueValues } from "./domain/catalog";
import { getSupplierFeedStatus, readSupplierFeedConfig } from "./domain/feedConfig";
import { importSupplierRows } from "./domain/importer";
import { landingFilterForPage, landingPages } from "./domain/landing";
import { buildLegalDocuments } from "./domain/legalDocuments";
import type { CartLine, ProductFilters, StoreProduct } from "./domain/product";
import { readCheckoutEndpoint } from "./domain/runtime";
import { getStoreLegalStatus, readStoreConfig } from "./domain/storeConfig";
import { getSupplierReadiness, icoSupplierProfile } from "./domain/supplier";
import {
  applyTrackingConsent,
  buildTrackingPayload,
  checkoutPayloadTrackingParams,
  productTrackingParams,
  readTrackingConfig,
  trackEvent,
} from "./domain/tracking";
import {
  applyConsentChoice,
  cookieConsentToTrackingConsent,
  getBrowserConsentStorage,
  readCookieConsent,
} from "./domain/cookieConsent";

const defaultFilters: ProductFilters = {
  concern: "all",
  skinType: "all",
  ingredient: "all",
  category: "all",
  maxPrice: null,
  onlyAvailable: true,
};

export default function App() {
  const importReport = useMemo(() => importSupplierRows(demoSupplierFeed), []);
  const supplierReadiness = useMemo(() => getSupplierReadiness(icoSupplierProfile), []);
  const feedConfig = useMemo(() => readSupplierFeedConfig(), []);
  const feedStatus = useMemo(() => getSupplierFeedStatus(feedConfig), [feedConfig]);
  const storeConfig = useMemo(() => readStoreConfig(), []);
  const storeLegalStatus = useMemo(() => getStoreLegalStatus(storeConfig), [storeConfig]);
  const legalDocuments = useMemo(() => buildLegalDocuments(storeConfig), [storeConfig]);
  const trackingConfig = useMemo(() => readTrackingConfig(), []);
  const [cookieConsent, setCookieConsent] = useState(() => readCookieConsent(getBrowserConsentStorage()));
  const consentedTrackingConfig = useMemo(
    () => applyTrackingConsent(trackingConfig, cookieConsentToTrackingConsent(cookieConsent)),
    [cookieConsent, trackingConfig],
  );
  const checkoutEndpoint = readCheckoutEndpoint();
  const products = importReport.products;
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(products[0] ?? null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const recommendations = selectedProduct ? recommendRoutineProducts(selectedProduct, products) : [];

  useEffect(() => {
    if (!selectedProduct) return;
    trackEvent(consentedTrackingConfig, buildTrackingPayload("view_item", productTrackingParams(selectedProduct)));
  }, [selectedProduct, consentedTrackingConfig]);

  function handleAddToCart(product: StoreProduct) {
    setCart((current) => addToCart(current, product));
    setCartOpen(true);
    trackEvent(consentedTrackingConfig, buildTrackingPayload("add_to_cart", productTrackingParams(product)));
  }

  function handleCookieChoice(choice: "all" | "essential") {
    setCookieConsent(applyConsentChoice(getBrowserConsentStorage(), choice));
  }

  return (
    <main className="app-shell">
      <TrackingScripts config={consentedTrackingConfig} />
      <Header cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} onCartOpen={() => setCartOpen(true)} />
      <HomePage onConcernSelect={(concern) => setFilters({ ...defaultFilters, concern })} />
      <LandingPages
        pages={landingPages}
        onSelect={(page) => {
          setFilters(landingFilterForPage(page));
          document.getElementById("catalog")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
        }}
      />
      <Catalog
        products={visibleProducts}
        filters={filters}
        onFiltersChange={setFilters}
        onProductSelect={setSelectedProduct}
        onAddToCart={handleAddToCart}
        concerns={uniqueTags(products, "skinConcerns")}
        skinTypes={uniqueTags(products, "skinTypes")}
        ingredients={uniqueTags(products, "activeIngredients")}
        categories={uniqueValues(products, "category")}
      />
      <ProductDetail product={selectedProduct} recommendations={recommendations} onAddToCart={handleAddToCart} />
      <ImportReportPanel
        report={importReport}
        supplier={icoSupplierProfile}
        readiness={supplierReadiness}
        feedConfig={feedConfig}
        feedStatus={feedStatus}
      />
      <TrustAndLegal config={storeConfig} status={storeLegalStatus} trackingConfig={trackingConfig} />
      <LegalDocuments documents={legalDocuments} />
      <Footer config={storeConfig} />
      <CookieConsentBanner consent={cookieConsent} onChoose={handleCookieChoice} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        products={products}
        checkoutEndpoint={checkoutEndpoint}
        onClose={() => setCartOpen(false)}
        onQuantityChange={(productId, quantity) => setCart((current) => updateQuantity(current, productId, quantity))}
        onBeginCheckout={(payload) =>
          trackEvent(
            consentedTrackingConfig,
            buildTrackingPayload("begin_checkout", checkoutPayloadTrackingParams(payload)),
          )
        }
        onPurchaseHandoff={(payload) =>
          trackEvent(
            consentedTrackingConfig,
            buildTrackingPayload("purchase_handoff", checkoutPayloadTrackingParams(payload)),
          )
        }
      />
    </main>
  );
}
