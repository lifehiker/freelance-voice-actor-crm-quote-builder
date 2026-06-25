import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Mic } from "lucide-react";
import { SignupCTA } from "@/components/public/SignupCTA";

export const metadata: Metadata = {
  title: "Voice Actor CRM — Client Management Software for Voice Actors",
  description: "VoiceQuote CRM is the voice-actor-specific CRM for managing clients, tracking auditions, building quotes with usage rights, and sending follow-up reminders.",
};

export default function VoiceActorCrmPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mic className="h-5 w-5 text-primary" /> VoiceQuote CRM
          </Link>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" asChild><Link href="/login">Sign in</Link></Button>
            <Button size="sm" asChild><Link href="/signup">Start free</Link></Button>
          </div>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">The CRM built for voice actors</h1>
          <p className="text-xl text-muted-foreground mb-6">
            VoiceQuote CRM is purpose-built for freelance voice actors who handle direct client work. It combines client management, audition tracking, quote building, and invoice records in one workflow — with the voice-over-specific fields that generic tools don&apos;t have.
          </p>
          <Button size="lg" asChild><Link href="/signup">Start free — no credit card</Link></Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Why generic tools fall short</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>Tools like HoneyBook, Bonsai, or a spreadsheet can create invoices and track clients — but they don&apos;t know what a usage fee is, can&apos;t calculate a regional broadcast license, and have no concept of a buyout or pickup session.</p>
            <p>VoiceQuote CRM is built around the fields and workflows voice actors actually use:</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Session fee + usage fee quote structure",
              "Media type selection (broadcast, web, corporate, etc.)",
              "Usage region (local, national, worldwide)",
              "Usage term (1 year, 2 years, buyout)",
              "Buyout toggle with perpetual license language",
              "Revision & pickup policy templates",
              "Audition and callback tracking",
              "Follow-up reminders via email",
              "PDF quotes with business branding",
              "Invoice tracking from accepted quotes",
            ].map(feature => (
              <div key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <SignupCTA
          headline="Start for free — no credit card required"
          subtext="Free plan includes 3 clients, 3 quotes, and 10 auditions. Upgrade when you need more."
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">FAQ</h2>
          {[
            { q: "Is this a rate guide?", a: "No. VoiceQuote CRM is a business management tool. You enter your own rates. We don't set or recommend prices — use industry references like the GVAA Rate Guide for that." },
            { q: "Can I track auditions from casting platforms?", a: "Yes. Log auditions from any source — Voice123, Backstage, Casting Call Club, direct email, or your agent — and track status through callback, booked, rejected, or no response." },
            { q: "What's the difference between Solo and Pro?", a: "Solo ($29/mo) is unlimited for all core features. Pro ($49/mo) adds CSV export, client-facing quote acceptance links, and advanced template management." },
          ].map(faq => (
            <div key={faq.q}>
              <h3 className="font-semibold mb-1">{faq.q}</h3>
              <p className="text-muted-foreground text-sm">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Free Usage Calculator →</Link>
          <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Free Quote Template →</Link>
          <Link href="/pricing" className="text-primary hover:underline">View Pricing →</Link>
        </div>
      </div>
    </div>
  );
}
