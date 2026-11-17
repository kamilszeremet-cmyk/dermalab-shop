import { useEffect, useRef, useState } from "react";
import { calculateCartTotals, parseQuantityDraft } from "../domain/cart";
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

function QuantityField({
  name,
  quantity,
  stock,
  onChange,
}: {
  name: string;
  quantity: number;
  stock: number;
  onChange: (quantity: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(quantity);

  function commit() {
    if (draft === null) return;
    const result = parseQuantityDraft(draft, stock);
    setDraft(null);
    if (result.kind === "remove") onChange(0);
    else if (result.kind === "set" && result.quantity !== quantity) onChange(result.quantity);
  }

  return (
    <input
      aria-label={`Ilość: ${name}`}
      type="number"
      inputMode="numeric"
      min={1}
      max={stock > 0 ? stock : undefined}
      step={1}
      value={shown}
      onChange={(event) => {
        const text = event.currentTarget.value;
        setDraft(text);
        if (/^[1-9]\d*$/.test(text)) {
          const parsed = parseQuantityDraft(text, stock);
          if (parsed.kind === "set" && parsed.quantity !== quantity) onChange(parsed.quantity);
        }
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
      }}
    />
  );
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
  const drawerRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    drawerRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      const target = returnFocusRef.current;
      if (target && document.contains(target)) target.focus();
    };
  }, [open]);

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
    <div
      className="cart-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside className="cart-drawer" aria-label="Koszyk" role="dialog" aria-modal="true" tabIndex={-1} ref={drawerRef}>
        <div className="cart-header">
          <h2>Koszyk</h2>
          <button type="button" onClick={onClose} aria-label="Zamknij koszyk">
            Zamknij
          </button>
        </div>
        <div className="cart-lines">
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
                <QuantityField
                  name={product.name}
                  quantity={line.quantity}
                  stock={product.stock}
                  onChange={(quantity) => onQuantityChange(product.id, quantity)}
                />
                <button type="button" onClick={() => onRemove(product.id)} aria-label={`Usuń: ${product.name}`}>
                  Usuń
                </button>
                </div>
              </div>
            );
          })
        )}
        </div>
        <div className="checkout-box">
          {cart.length > 0 && <strong>Produkty: {totals.subtotal.toFixed(2)} zł</strong>}
          {cart.length > 0 && <label>
            Dostawa
            <select value={shippingOption.id} onChange={(event) => setShippingId(event.currentTarget.value)}>
              {shippingOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label} - {option.price.toFixed(2)} zł
                </option>
              ))}
            </select>
          </label>}
          {cart.length > 0 && (
            <p>
              {shippingOption.label}, {shippingOption.eta}
            </p>
          )}
          {cart.length > 0 && <strong>Suma: {orderTotal.toFixed(2)} zł</strong>}
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
