import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, FileText, Users, Mic2, Receipt, Bell, Download } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceQuote CRM — Quote Builder & CRM for Voice Actors",
  description: "The voice-over-specific CRM and quote builder. Track auditions, build quotes with usage rights, manage clients, and export professional PDFs.",
};

const features = [
  {
    icon: FileText,
    title: "Voice-Over Quote Builder",
    description: "Build detailed quotes with session fees, usage rights, media type, region, term, buyouts, pickups, and revision policies — fields generic invoice tools don't have.",
  },
  {
    icon: Mic2,
    title: "Audition & Submission Tracker",
    description: "Track every audition, casting submission, callback, and booking. Know where every opportunity stands at a glance.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description: "Manage your direct clients with contact details, notes, and a full history of quotes and projects.",
  },
  {
    icon: Download,
    title: "PDF Quote Export",
    description: "Generate professional, client-facing PDF quotes with your branding, line items, usage terms, and expiration dates.",
  },
  {
    icon: Receipt,
    title: "Invoice Tracking",
    description: "Create invoice records from accepted quotes. Track sent, paid, and overdue invoices without a payment processor.",
  },
  {
    icon: Bell,
    title: "Follow-up Reminders",
    description: "Never miss a follow-up. Set reminder dates on quotes, auditions, and invoices. Receive daily email digests.",
  },
];

const faqs = [
  {
    q: "Is VoiceQuote CRM a rate guide?",
    a: "No. VoiceQuote CRM is a quote builder and business management tool. It helps structure your quotes with voice-over-specific fields. You supply the rates based on your own judgment and industry references like GVAA Rate Guide or Gravy for the Brain.",
  },
  {
    q: "What's included in the free plan?",
    a: "The free plan includes 3 clients, 3 quotes, and 10 audition records. You can also use our public calculators and templates without creating an account.",
  },
  {
    q: "Do I need Stripe to use this?",
    a: "No. Stripe is only used for your VoiceQuote subscription. Invoice tracking in the app doesn't require clients to pay through VoiceQuote — it's just a record-keeping tool.",
  },
  {
    q: "Can I explain usage rights to clients using this tool?",
    a: "Yes. The quote builder includes usage terms fields and reusable templates for web/social usage, regional and national broadcast, corporate/internal use, buyouts, and revision/pickup policies.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Mic className="h-6 w-6 text-primary" />
            VoiceQuote CRM
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-sm text-muted-foreground hover:text-foreground hidden md:block">Free Tools</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground hidden md:block">Pricing</Link>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Mic className="h-4 w-4" /> Built for freelance voice actors
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Quote voice-over work the right way.
            <br />
            <span className="text-primary">Track every audition and client.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            VoiceQuote CRM is the only business tool built around voice-over-specific pricing: session fees, usage rights, media type, region, term length, buyouts, pickups, and revision policies.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Start free — no credit card</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/tools/voice-over-usage-rate-calculator">Try free calculator</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Free plan: 3 clients, 3 quotes, 10 auditions.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Everything a working voice actor needs</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Generic freelancer tools don&apos;t understand voice-over licensing. VoiceQuote CRM is built around the fields you actually need to quote direct client work.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-none shadow-sm">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free tools */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Free tools — no account needed</h2>
          <p className="text-muted-foreground mb-8">Use our free calculators and templates to structure your next quote, then create an account to save it.</p>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              { href: "/tools/voice-over-usage-rate-calculator", title: "Voice Over Usage Rate Calculator", desc: "Structure your rate inputs by media, region, and term." },
              { href: "/tools/commercial-voice-over-pricing-calculator", title: "Commercial Pricing Calculator", desc: "Calculate commercial usage fees for broadcast and digital." },
              { href: "/templates/freelance-voice-actor-quote-template", title: "Voice Actor Quote Template", desc: "Copy-paste quote template for direct client proposals." },
              { href: "/tools/voice-over-audition-tracker", title: "Audition Tracker", desc: "Preview the audition tracker — create an account to save." },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href} className="block p-4 rounded-lg border bg-background hover:border-primary/50 transition-colors">
                <p className="font-medium">{tool.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Start quoting smarter today</h2>
          <p className="text-primary-foreground/80 mb-8">Free plan includes 3 clients, 3 quotes, and 10 auditions. No credit card required.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Create free account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span>VoiceQuote CRM</span>
          </div>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/voice-actor-crm" className="hover:text-foreground">Voice Actor CRM</Link>
            <Link href="/tools/voice-over-usage-rate-calculator" className="hover:text-foreground">Free Tools</Link>
            <Link href="/guides/voice-over-usage-rights-explained" className="hover:text-foreground">Guides</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
