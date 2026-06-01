import { useState } from "react";
import { calculateCartTotals } from "../domain/cart";
import { createCheckoutRequest, getCheckoutReadiness, getShippingOptions, type CheckoutPayload } from "../domain/checkout";
import type { CartLine, StoreProduct } from "../domain/product";

interface CartDrawerProps {
  open: boolean;
  cart: CartLine[];
  products: StoreProduct[];
  checkoutEndpoint: string;
  onClose: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
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
  onBeginCheckout,
  onPurchaseHandoff,
}: CartDrawerProps) {
  const [statusMessage, setStatusMessage] = useState("");
  const [shippingId, setShippingId] = useState("inpost_locker");
  const totals = calculateCartTotals(cart, products);
  const shippingOptions = getShippingOptions(totals.subtotal);
  const shippingOption = shippingOptions.find((option) => option.id === shippingId) ?? shippingOptions[0];
  const orderTotal = totals.subtotal + shippingOption.price;
  const checkout = createCheckoutRequest(cart, products, {
    endpoint: checkoutEndpoint,
    successUrl: `${window.location.origin}/checkout/sukces`,
    cancelUrl: `${window.location.origin}/checkout/anulowane`,
    shippingOption,
  });
  const readiness = getCheckoutReadiness(checkoutEndpoint);

  async function handleCheckout() {
    if (!checkout.ok || !checkout.payload) {
      setStatusMessage(checkout.message);
      return;
    }

    if (readiness.status !== "ready") {
      setStatusMessage(readiness.message);
      return;
    }

    onBeginCheckout?.(checkout.payload);

    try {
      const response = await fetch(checkout.payload.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkout.payload),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setStatusMessage(data.error ?? "Nie udało się utworzyć sesji płatności.");
        return;
      }
      onPurchaseHandoff?.(checkout.payload);
      window.location.assign(data.url);
    } catch {
      setStatusMessage("Endpoint checkoutu nie odpowiedział. Sprawdź backend płatności.");
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
                <input
                  aria-label={`Ilość: ${product.name}`}
                  min={0}
                  type="number"
                  value={line.quantity}
                  onChange={(event) => onQuantityChange(product.id, Number(event.currentTarget.value))}
                />
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
          <p>Endpoint checkoutu: {checkoutEndpoint ? "skonfigurowany" : "brak"}</p>
          <p>{readiness.message}</p>
          {checkout.issues.map((issue) => (
            <p className="error" key={issue}>
              {issue}
            </p>
          ))}
          {statusMessage && <p className="error">{statusMessage}</p>}
          <button type="button" disabled={!checkout.ok} onClick={handleCheckout}>
            Przejdź do Stripe Checkout + P24
          </button>
        </div>
      </aside>
    </div>
  );
}
