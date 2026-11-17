import type { Plugin } from "vite";

declare const process: { env: Record<string, string | undefined> };



const MOCK_PATHS = ["/api/create-checkout-session", "/.netlify/functions/create-checkout-session"];

type Next = () => void;

function handler(req: any, res: any, next: Next) {
  const pathname = (req.url ?? "").split("?")[0];
  if (!MOCK_PATHS.includes(pathname)) return next();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const send = (status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(body));
  };

  if (req.method !== "POST") return send(405, { error: "Method not allowed" });

  // drain the body so the client request completes cleanly
  req.on("data", () => undefined);
  req.on("end", () => {
    const failHeader = req.headers["x-mock-fail"] === "1";
    if (failHeader || process.env.MOCK_CHECKOUT_FAIL === "1") {
      return send(500, { error: "Mock checkout failure" });
    }
    send(200, { url: "/checkout/sukces?session_id=mock" });
  });
}

/** Local-only mock of the Stripe checkout-session endpoint (dev server and `vite preview`). */
export function mockCheckoutPlugin(): Plugin {
  return {
    name: "dermalab-mock-checkout",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
