import type { CartLine, CartTotals, CheckoutResult, StoreProduct } from "./product";

export function addToCart(cart: CartLine[], product: StoreProduct): CartLine[] {
  const existing = cart.find((line) => line.productId === product.id);
  if (existing) {
    return cart.map((line) =>
      line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
    );
  }
  return [...cart, { productId: product.id, quantity: 1 }];
}

export function updateQuantity(cart: CartLine[], productId: string, quantity: number): CartLine[] {
  if (quantity <= 0) return removeFromCart(cart, productId);
  return cart.map((line) => (line.productId === productId ? { ...line, quantity } : line));
}

export function removeFromCart(cart: CartLine[], productId: string): CartLine[] {
  return cart.filter((line) => line.productId !== productId);
}

export function calculateCartTotals(cart: CartLine[], products: StoreProduct[]): CartTotals {
  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId);
    return sum + (product?.retailPrice ?? 0) * line.quantity;
  }, 0);

  return {
    subtotal: roundMoney(subtotal),
    itemCount: cart.reduce((sum, line) => sum + line.quantity, 0),
  };
}

export function validateDemoCheckout(cart: CartLine[], products: StoreProduct[]): CheckoutResult {
  const issues: string[] = [];

  if (cart.length === 0) issues.push("Koszyk jest pusty.");

  for (const line of cart) {
    const product = products.find((item) => item.id === line.productId);
    if (!product) {
      issues.push("Produkt nie istnieje w aktualnym katalogu.");
      continue;
    }
    if (product.availabilityStatus === "out_of_stock" || product.stock < line.quantity) {
      issues.push(`${product.name} jest niedostępny w wybranej ilości.`);
    }
  }

  return {
    ok: issues.length === 0,
    message: issues.length === 0 ? "Zamówienie demo zostało przyjęte." : "Sprawdź koszyk przed finalizacją.",
    issues,
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
