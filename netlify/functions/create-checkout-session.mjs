import { createStripeCheckoutSession } from "../../server/stripeCheckoutSession.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
    };
  }

  const payload = JSON.parse(event.body || "{}");
  const result = await createStripeCheckoutSession(payload);

  return {
    statusCode: result.status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result.body),
  };
}
