// Lazy-initialize Stripe inside handlers — never at module scope
export function getStripeInstance() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  const Stripe = require("stripe");
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
  });
}

export const STRIPE_PLANS = {
  solo_monthly: {
    priceId: process.env.STRIPE_SOLO_MONTHLY_PRICE_ID || "",
    name: "Solo Monthly",
    amount: 2900,
    interval: "month" as const,
  },
  solo_yearly: {
    priceId: process.env.STRIPE_SOLO_YEARLY_PRICE_ID || "",
    name: "Solo Yearly",
    amount: 29000,
    interval: "year" as const,
  },
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
    name: "Pro Monthly",
    amount: 4900,
    interval: "month" as const,
  },
  pro_yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    name: "Pro Yearly",
    amount: 49000,
    interval: "year" as const,
  },
};
