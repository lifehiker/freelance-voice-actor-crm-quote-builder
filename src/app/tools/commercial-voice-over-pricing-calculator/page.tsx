import type { Metadata } from "next";
import Link from "next/link";
import { UsageRateCalculator } from "@/components/public/UsageRateCalculator";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Commercial Voice Over Pricing Calculator | Free Quote Builder for Voice Actors",
  description: "Calculate commercial voice over pricing by media type, region, term length, and broadcast rights. Free calculator for freelance voice actors.",
};

export default function CommercialPricingCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mic className="h-5 w-5 text-primary" /> VoiceQuote CRM
          </Link>
          <Link href="/signup" className="text-sm text-primary hover:underline font-medium">Create free account →</Link>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-3">Commercial Voice Over Pricing Calculator</h1>
          <p className="text-muted-foreground">
            Structure commercial voice over pricing by media type, region, term length, and broadcast rights. Use this to inform your quote before sending to a direct client.
          </p>
          <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <strong>Disclaimer:</strong> This calculator helps structure quote inputs. It is not an official rate guide or pricing authority. Always apply your own business judgment and references like the GVAA Rate Guide.
          </div>
        </div>

        <UsageRateCalculator />
        <SignupCTA />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Commercial Voice Over Pricing Explained</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Commercial voice over pricing typically has two components: a session fee and a usage fee.</p>
            <p><strong>Session fee</strong> covers the recording session itself — your time, equipment, booth, and talent.</p>
            <p><strong>Usage fee</strong> covers the commercial rights to use the recording for a defined period, territory, and media type. This is where most of the variance in commercial VO pricing occurs.</p>
          </div>

          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "How do I price a national TV commercial?", a: "National TV commercials typically include a session fee plus a national broadcast usage fee. The usage component can range from 50-300% of the session fee depending on term length and exclusivity. Always reference industry rate guides and your own experience." },
              { q: "What's the difference between broadcast and digital usage?", a: "Broadcast usage covers traditional TV and radio. Digital usage covers online video, social media, and streaming platforms. Both are commercial uses but are priced differently due to audience reach and exclusivity norms." },
              { q: "How long should a usage license be?", a: "Usage terms are negotiated based on the client's campaign needs. Common terms are 1 year, 2 years, or perpetual buyout. Longer terms or buyouts command higher fees." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Usage Rate Calculator →</Link>
            <Link href="/guides/voice-over-buyout-pricing-explained" className="text-primary hover:underline">Buyout Pricing Guide →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
