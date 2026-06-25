import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId, plan } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "Price ID required" }, { status: 400 });
  }

  try {
    const { getStripeInstance } = await import("@/lib/stripe");
    const stripe = getStripeInstance();

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Get or create Stripe customer
    let customerId: string;
    const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });

    if (subscription?.stripeCustomerId) {
      customerId = subscription.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[stripe/checkout]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
