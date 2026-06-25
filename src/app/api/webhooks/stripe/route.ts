import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function determinePlan(priceId: string): string {
  const soloMonthly = process.env.STRIPE_SOLO_MONTHLY_PRICE_ID;
  const soloYearly = process.env.STRIPE_SOLO_YEARLY_PRICE_ID;
  const proMonthly = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
  const proYearly = process.env.STRIPE_PRO_YEARLY_PRICE_ID;

  if (priceId === soloMonthly || priceId === soloYearly) return "solo";
  if (priceId === proMonthly || priceId === proYearly) return "pro";
  return "solo"; // default for unknown
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: any;
  try {
    const { getStripeInstance } = await import("@/lib/stripe");
    const stripe = getStripeInstance();
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("[stripe/webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId && customerId && subscriptionId) {
          const { getStripeInstance } = await import("@/lib/stripe");
          const stripe = getStripeInstance();
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = sub.items.data[0]?.price?.id;
          const plan = priceId ? determinePlan(priceId) : "solo";

          await db.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              plan,
              status: "active",
            },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              plan,
              status: "active",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const customerId = sub.customer;
        const existing = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (existing) {
          const priceId = sub.items.data[0]?.price?.id;
          const plan = priceId ? determinePlan(priceId) : existing.plan;
          await db.subscription.update({
            where: { id: existing.id },
            data: {
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
              plan,
              status: sub.status === "active" ? "active" : "past_due",
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const customerId = sub.customer;
        const existing = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (existing) {
          await db.subscription.update({
            where: { id: existing.id },
            data: { plan: "free", status: "canceled" },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const existing = await db.subscription.findFirst({ where: { stripeCustomerId: customerId } });
        if (existing) {
          await db.subscription.update({
            where: { id: existing.id },
            data: { status: "past_due" },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error("[stripe/webhook] Error handling event:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
