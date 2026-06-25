import type { Metadata } from "next";
import Link from "next/link";
import { UsageRateCalculator } from "@/components/public/UsageRateCalculator";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Voice Over Usage Rate Calculator | Free Quote Builder for Voice Actors",
  description: "Use this free voice over usage rate calculator to structure quote inputs with session fees, media type, region, term, and buyouts. Not an official rate guide.",
};

export default function UsageRateCalculatorPage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Usage Rate Calculator</h1>
          <p className="text-muted-foreground">
            Structure your voice-over quote inputs based on session fee, media type, region, term length, and buyout. Estimated totals are for structuring purposes only — always apply your own rates and current industry references.
          </p>
          <div className="mt-3 rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            <strong>Disclaimer:</strong> This calculator helps structure quote inputs. It is not an official rate guide or pricing authority. Always apply your own business judgment and references like the GVAA Rate Guide.
          </div>
        </div>

        <UsageRateCalculator />

        <SignupCTA
          headline="Save this quote and track your auditions"
          subtext="Create a free account to save clients, build quotes, and export PDFs."
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">About Voice Over Usage Rates</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Voice over usage rates refer to the additional fees charged beyond the base session fee when a client uses the recording for commercial purposes. The usage fee compensates the voice actor for the commercial value and reach of the recording.</p>
            <p>Key factors that affect usage rates include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Media type</strong> — broadcast (TV/radio) commands higher fees than web or corporate internal use.</li>
              <li><strong>Usage region</strong> — national usage is more valuable than regional or local usage.</li>
              <li><strong>Usage term</strong> — longer usage terms (2+ years) or perpetual buyouts command higher fees.</li>
              <li><strong>Buyout vs. licensed</strong> — a full buyout allows unlimited use of the recording permanently, while a time-limited license grants use for a defined period.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "What is a voice over usage fee?", a: "A usage fee is additional compensation paid to a voice actor when their recording is used commercially. It is separate from the session fee and accounts for the commercial value and reach of the recording." },
              { q: "What is a buyout in voice over work?", a: "A buyout (also called a perpetual license) allows the client to use the recording indefinitely in the specified media and region without paying additional renewal or usage fees. Buyouts typically command a higher one-time fee." },
              { q: "Is this an official rate guide?", a: "No. This calculator is a structuring tool only. For industry rate references, see the GVAA Rate Guide or Gravy for the Brain rate guides. Always apply your own business judgment." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/tools/commercial-voice-over-pricing-calculator" className="text-primary hover:underline">Commercial Pricing Calculator →</Link>
            <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
            <Link href="/guides/voice-over-usage-rights-explained" className="text-primary hover:underline">Usage Rights Guide →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
