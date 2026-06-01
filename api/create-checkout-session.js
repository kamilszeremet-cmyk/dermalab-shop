import { createStripeCheckoutSession } from "../server/stripeCheckoutSession.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const result = await createStripeCheckoutSession(payload);

  res.status(result.status).json(result.body);
}
