"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Mic } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Try it out with no commitment.",
    features: [
      "3 saved clients",
      "3 saved quotes",
      "10 audition records",
      "Watermarked PDF export",
      "Free calculators & templates",
    ],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Solo",
    price: { monthly: 29, yearly: 290 },
    description: "For working voice actors quoting direct clients.",
    features: [
      "Unlimited clients",
      "Unlimited projects",
      "Unlimited auditions",
      "Unlimited quotes",
      "PDF export without watermark",
      "Invoice tracking",
      "Follow-up reminder emails",
      "Reusable usage-rights templates",
      "Business branding on PDFs",
    ],
    cta: "Start Solo",
    priceId: "solo",
    highlight: true,
  },
  {
    name: "Pro",
    price: { monthly: 49, yearly: 490 },
    description: "For higher-volume voice actors who want more polish.",
    features: [
      "Everything in Solo",
      "Custom quote/invoice numbering",
      "Export CSV of quotes & invoices",
      "Saved rate/line-item presets",
      "Client-facing quote acceptance link",
      "Priority support",
    ],
    cta: "Start Pro",
    priceId: "pro",
    highlight: false,
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  async function handleUpgrade(planName: string) {
    const priceKey = `${planName.toLowerCase()}_${billing}`;
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: priceKey, plan: planName.toLowerCase() }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data.error === "Stripe not configured") {
        alert("Payment processing is not yet configured. Please contact support.");
        return;
      }
      alert(data.error || "Something went wrong");
      return;
    }

    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Mic className="h-6 w-6 text-primary" />
            VoiceQuote CRM
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" asChild><Link href="/login">Sign in</Link></Button>
            <Button size="sm" asChild><Link href="/signup">Start free</Link></Button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-muted-foreground mb-8">Start free. Upgrade when you need more.</p>
          <div className="inline-flex items-center rounded-full border p-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >Monthly</button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${billing === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >Yearly <span className="text-xs opacity-75">(save ~16%)</span></button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`relative ${plan.highlight ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${plan.price[billing]}</span>
                  {plan.price[billing] > 0 && <span className="text-muted-foreground">/{billing === "yearly" ? "year" : "mo"}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {plan.price[billing] === 0 ? (
                  <Button asChild className="w-full" variant={plan.highlight ? "default" : "outline"}>
                    <Link href={plan.href || "/signup"}>{plan.cta}</Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.highlight ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include our free public calculators and templates.
          Payments processed securely by Stripe. Cancel anytime.
        </p>

        <div className="mt-16 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-center">FAQ</h2>
          {[
            { q: "Can I cancel anytime?", a: "Yes. Cancel anytime from your account settings. You'll keep access until the end of your billing period." },
            { q: "Is this an official rate guide?", a: "No. VoiceQuote CRM is a business management tool. You set your own rates based on your experience and references like the GVAA Rate Guide." },
            { q: "What if I need more than the free plan?", a: "Upgrade to Solo ($29/mo) for unlimited clients, quotes, auditions, and PDF exports without watermarks." },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold mb-1">{faq.q}</h3>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
