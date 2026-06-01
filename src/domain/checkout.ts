import type { CartLine, StoreProduct } from "./product";

export type CheckoutReadinessStatus = "ready" | "missing_endpoint";

export interface CheckoutReadiness {
  status: CheckoutReadinessStatus;
  message: string;
}

export interface ShippingOption {
  id: "free_delivery" | "inpost_locker" | "courier";
  label: string;
  price: number;
  eta: string;
}

export interface CheckoutConfig {
  endpoint?: string;
  successUrl: string;
  cancelUrl: string;
  shippingOption?: ShippingOption;
}

export interface CheckoutLineItem {
  sku: string;
  name: string;
  quantity: number;
  unitAmount: number;
}

export interface CheckoutPayload {
  provider: "stripe_checkout";
  paymentMethods: ["card", "p24"];
  currency: "pln";
  endpoint: string;
  successUrl: string;
  cancelUrl: string;
  lineItems: CheckoutLineItem[];
  shippingOption: ShippingOption;
  totalAmount: number;
}

export interface CheckoutRequestResult {
  ok: boolean;
  message: string;
  issues: string[];
  payload?: CheckoutPayload;
}

const FREE_SHIPPING_THRESHOLD = 179;

export function getCheckoutReadiness(endpoint?: string): CheckoutReadiness {
  if (!endpoint?.trim()) {
    return {
      status: "missing_endpoint",
      message: "Brakuje endpointu checkoutu. Dodaj backend, który utworzy sesję Stripe Checkout.",
    };
  }

  return {
    status: "ready",
    message: "Stripe Checkout + P24 gotowe do przekierowania przez backend.",
  };
}

export function getShippingOptions(subtotal: number): ShippingOption[] {
  const paidOptions: ShippingOption[] = [
    {
      id: "inpost_locker",
      label: "InPost Paczkomat",
      price: 12.99,
      eta: "1-2 dni robocze",
    },
    {
      id: "courier",
      label: "Kurier",
      price: 16.99,
      eta: "1-2 dni robocze",
    },
  ];

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return [
      {
        id: "free_delivery",
        label: "Darmowa dostawa od 179 zł",
        price: 0,
        eta: "1-2 dni robocze",
      },
      ...paidOptions,
    ];
  }

  return paidOptions;
}

export function createCheckoutRequest(
  cart: CartLine[],
  products: StoreProduct[],
  config: CheckoutConfig,
): CheckoutRequestResult {
  const issues = validateCart(cart, products);

  if (issues.length > 0) {
    return {
      ok: false,
      message: "Sprawdź koszyk przed płatnością.",
      issues,
    };
  }

  const subtotal = cart.reduce((sum, line) => {
    const product = products.find((item) => item.id === line.productId)!;
    return sum + product.retailPrice * line.quantity;
  }, 0);
  const shippingOption = config.shippingOption ?? getShippingOptions(subtotal)[0];
  const endpoint = config.endpoint?.trim() ?? "";
  const lineItems = cart.map((line) => {
    const product = products.find((item) => item.id === line.productId)!;
    return {
      sku: product.sku,
      name: product.name,
      quantity: line.quantity,
      unitAmount: Math.round(product.retailPrice * 100),
    };
  });

  return {
    ok: true,
    message: "Koszyk gotowy do płatności.",
    issues: [],
    payload: {
      provider: "stripe_checkout",
      paymentMethods: ["card", "p24"],
      currency: "pln",
      endpoint,
      successUrl: config.successUrl,
      cancelUrl: config.cancelUrl,
      lineItems,
      shippingOption,
      totalAmount: Math.round((subtotal + shippingOption.price) * 100),
    },
  };
}

function validateCart(cart: CartLine[], products: StoreProduct[]) {
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

  return issues;
}
