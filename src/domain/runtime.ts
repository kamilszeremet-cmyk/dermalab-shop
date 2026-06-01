export type ClientEnv = Record<string, string | undefined>;

export function readClientEnv(): ClientEnv {
  const meta = import.meta as unknown as { env?: ClientEnv };
  return meta.env ?? {};
}

export function readCheckoutEndpoint() {
  return readClientEnv().VITE_CHECKOUT_ENDPOINT ?? "";
}
