import { useEffect, useState } from "react";
import { calculateCartTotals } from "../domain/cart";
import { createCheckoutRequest, getCheckoutReadiness, getShippingOptions, type CheckoutPayload } from "../domain/checkout";
import { resolveShippingOption } from "../domain/shipping";
import type { CartLine, StoreProduct } from "../domain/product";

interface CartDrawerProps {
  open: boolean;
  cart: CartLine[];
  products: StoreProduct[];
  checkoutEndpoint: string;
  onClose: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  admin?: boolean;
  onBeginCheckout?: (payload: CheckoutPayload) => void;
  onPurchaseHandoff?: (payload: CheckoutPayload) => void;
}

export function CartDrawer({
  open,
  cart,
  products,
  checkoutEndpoint,
  onClose,
  onQuantityChange,
  onRemove,
  admin = false,
  onBeginCheckout,
  onPurchaseHandoff,
}: CartDrawerProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const [shippingId, setShippingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const totals = calculateCartTotals(cart, products);
  const shippingOptions = getShippingOptions(totals.subtotal);
  const shippingOption = resolveShippingOption(shippingOptions, shippingId);
  const orderTotal = totals.subtotal + shippingOption.price;
  const checkout = createCheckoutRequest(cart, products, {
    endpoint: checkoutEndpoint,
    successUrl: `${window.location.origin}/checkout/sukces`,
    cancelUrl: `${window.location.origin}/checkout/anulowane`,
    shippingOption,
  });
  const readiness = getCheckoutReadiness(checkoutEndpoint);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function handleCheckout() {
    if (pending) return;
    setStatusMessage("");
    if (!checkout.ok || !checkout.payload) {
      setStatusMessage(checkout.message);
      return;
    }

    if (readiness.status !== "ready") {
      setStatusMessage(
        admin ? readiness.message : "Płatności są chwilowo niedostępne. Spróbuj ponownie później.",
      );
      return;
    }

    onBeginCheckout?.(checkout.payload);
    setPending(true);

    try {
      const response = await fetch(checkout.payload.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkout.payload),
      });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setStatusMessage("Nie udało się rozpocząć płatności. Spróbuj ponownie za chwilę.");
        setPending(false);
        return;
      }
      onPurchaseHandoff?.(checkout.payload);
      window.location.assign(data.url);
    } catch {
      setStatusMessage("Nie udało się połączyć z płatnościami. Spróbuj ponownie za chwilę.");
      setPending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="cart-backdrop" role="presentation">
      <aside className="cart-drawer" aria-label="Koszyk">
        <div className="cart-header">
          <h2>Koszyk</h2>
          <button type="button" onClick={onClose} aria-label="Zamknij koszyk">
            Zamknij
          </button>
        </div>
        {cart.length === 0 ? (
          <p>Koszyk jest pusty.</p>
        ) : (
          cart.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <div className="cart-line" key={line.productId}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.retailPrice.toFixed(2)} zł</span>
                </div>
                <div className="cart-line-controls">
                <input
                  aria-label={`Ilość: ${product.name}`}
                  min={0}
                  type="number"
                  value={line.quantity}
                  onChange={(event) => onQuantityChange(product.id, Number(event.currentTarget.value))}
                />
                <button type="button" onClick={() => onRemove(product.id)} aria-label={`Usuń: ${product.name}`}>
                  Usuń
                </button>
                </div>
              </div>
            );
          })
        )}
        <div className="checkout-box">
          <strong>Produkty: {totals.subtotal.toFixed(2)} zł</strong>
          <label>
            Dostawa
            <select value={shippingOption.id} onChange={(event) => setShippingId(event.currentTarget.value)}>
              {shippingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} - {option.price.toFixed(2)} zł
                </option>
              ))}
            </select>
          </label>
          <p>
            {shippingOption.label}, {shippingOption.eta}
          </p>
          <strong>Suma: {orderTotal.toFixed(2)} zł</strong>
          <p>{checkout.message}</p>
          {admin && <p>Endpoint checkoutu: {checkoutEndpoint ? "skonfigurowany" : "brak"}</p>}
          {admin && <p>{readiness.message}</p>}
          {cart.length > 0 && checkout.issues.map((issue) => (
            <p className="error" key={issue} role="alert">
              {issue}
            </p>
          ))}
          {statusMessage && <p className="error" role="alert">{statusMessage}</p>}
          <button type="button" disabled={!checkout.ok || pending} aria-busy={pending} onClick={handleCheckout}>
            {pending ? "Przekierowuję do płatności…" : "Przejdź do płatności"}
          </button>
        </div>
      </aside>
    </div>
  );
}
