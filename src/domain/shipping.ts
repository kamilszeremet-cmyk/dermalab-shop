import type { ShippingOption } from "./checkout";

/**
 * Resolves the selected shipping option. `preferredId` is the customer's explicit choice (or null for "auto").
 * An explicit choice is kept whenever it is still offered; otherwise the first (cheapest/free) option is used.
 */
export function resolveShippingOption(options: ShippingOption[], preferredId: string | null): ShippingOption {
  return options.find((option) => option.id === preferredId) ?? options[0];
}
