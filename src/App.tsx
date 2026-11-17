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
import { readAdminMode } from "./domain/adminMode";
import { addToCart, removeFromCart, updateQuantity } from "./domain/cart";
import { clearStoredCart, getBrowserCartStorage, loadCart, saveCart } from "./domain/cartStorage";
import { readHasCheckoutSessionId, readView } from "./domain/route";
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

export default function App({ admin: adminProp }: { admin?: boolean } = {}) {
  const admin = useMemo(() => adminProp ?? readAdminMode(), [adminProp]);
  const view = useMemo(() => readView(), []);
  const orderConfirmed = view === "checkout_success" && readHasCheckoutSessionId();
  const anchorPrefix = view === "store" ? "" : "/";
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
  const [cart, setCart] = useState<CartLine[]>(() => {
    if (readView() === "checkout_success" && readHasCheckoutSessionId()) return [];
    return loadCart(getBrowserCartStorage(), products.map((product) => product.id));
  });
  const [cartOpen, setCartOpen] = useState(false);

  const visibleProducts = useMemo(() => filterProducts(products, filters), [products, filters]);
  const recommendations = selectedProduct ? recommendRoutineProducts(selectedProduct, products) : [];

  useEffect(() => {
    if (orderConfirmed) clearStoredCart(getBrowserCartStorage());
  }, [orderConfirmed]);

  useEffect(() => {
    if (orderConfirmed) return;
    saveCart(getBrowserCartStorage(), cart);
  }, [cart, orderConfirmed]);

  function handleProductSelect(product: StoreProduct) {
    setSelectedProduct(product);
    setTimeout(() => {
      document.getElementById("product-detail")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 0);
  }

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
      <Header
        admin={admin}
        anchorPrefix={anchorPrefix}
        cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)}
        onCartOpen={() => setCartOpen(true)}
      />
      {view === "checkout_success" && !orderConfirmed && (
        <section className="checkout-return" aria-label="Zamówienie">
          <h1>Zamówienie</h1>
          <p>Nie znaleźliśmy potwierdzenia płatności dla tego adresu. Jeśli płatność została zakończona, potwierdzenie dotrze na Twój e-mail.</p>
          <a className="button-link" href="/">
            Wróć do sklepu
          </a>
        </section>
      )}
      {orderConfirmed && (
        <section className="checkout-return" aria-label="Potwierdzenie zamówienia">
          <h1>Dziękujemy za zamówienie!</h1>
          <p>Płatność została przyjęta. Potwierdzenie zamówienia wyślemy na adres e-mail podany w trakcie płatności.</p>
          <a className="button-link" href="/">
            Wróć do sklepu
          </a>
        </section>
      )}
      {view === "checkout_cancelled" && (
        <section className="checkout-return" aria-label="Płatność anulowana">
          <h1>Płatność anulowana</h1>
          <p>Nic nie zostało pobrane. Produkty nadal czekają w Twoim koszyku.</p>
          <button type="button" onClick={() => setCartOpen(true)}>
            Otwórz koszyk
          </button>
          <a className="button-link" href="/">
            Wróć do sklepu
          </a>
        </section>
      )}
      {view === "store" && (
        <>
      <HomePage
        onConcernSelect={(concern) => {
          setFilters({ ...defaultFilters, concern });
          setTimeout(() => document.getElementById("catalog")?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 0);
        }}
      />
      <LandingPages
        admin={admin}
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
        onProductSelect={handleProductSelect}
        onAddToCart={handleAddToCart}
        concerns={uniqueTags(products, "skinConcerns")}
        skinTypes={uniqueTags(products, "skinTypes")}
        ingredients={uniqueTags(products, "activeIngredients")}
        categories={uniqueValues(products, "category")}
      />
      <ProductDetail
        admin={admin}
        product={selectedProduct}
        recommendations={recommendations}
        onAddToCart={handleAddToCart}
      />
      {admin && (
      <ImportReportPanel
        report={importReport}
        supplier={icoSupplierProfile}
        readiness={supplierReadiness}
        feedConfig={feedConfig}
        feedStatus={feedStatus}
      />
      )}
      <TrustAndLegal admin={admin} config={storeConfig} status={storeLegalStatus} trackingConfig={trackingConfig} />
      <LegalDocuments admin={admin} documents={legalDocuments} />
        </>
      )}
      <Footer config={storeConfig} anchorPrefix={anchorPrefix} />
      <CookieConsentBanner consent={cookieConsent} onChoose={handleCookieChoice} hidden={cartOpen} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        products={products}
        checkoutEndpoint={checkoutEndpoint}
        admin={admin}
        onClose={() => setCartOpen(false)}
        onRemove={(productId) => setCart((current) => removeFromCart(current, productId))}
        onQuantityChange={(productId, quantity) =>
          setCart((current) =>
            updateQuantity(current, productId, quantity, products.find((item) => item.id === productId)?.stock),
          )
        }
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
