import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Voice Over Buyout Pricing Explained for Freelance Voice Actors",
  description: "Understand voice over buyout pricing, when to use it, risks of under-pricing perpetual licenses, and how to structure buyout quotes.",
};

export default function BuyoutPricingGuidePage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Buyout Pricing Explained</h1>
          <p className="text-muted-foreground">What a buyout means, how to price it, and how to avoid leaving money on the table for high-reach commercial work.</p>
          <p className="text-xs text-muted-foreground mt-2 italic">Note: This is educational content. It is not legal or financial advice.</p>
        </div>

        <div className="space-y-6 text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">What is a voice over buyout?</h2>
            <p>A buyout means the client pays a one-time fee for unlimited use of the recording in the agreed media and region, indefinitely. There are no renewal fees, no annual licensing costs, and no further usage tracking required.</p>
            <p>A buyout does <strong>not</strong> transfer copyright ownership unless explicitly agreed in writing. It transfers unlimited usage rights — not the underlying intellectual property.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">When do clients ask for buyouts?</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Corporate clients who don&apos;t want to track usage term renewals.</li>
              <li>Campaigns expected to run for many years (e.g., explainer videos, onboarding, phone systems).</li>
              <li>Clients who plan to redistribute or re-use the recording in multiple formats or markets.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">How to price a buyout</h2>
            <p>A buyout should reflect the total expected commercial value of the recording over its likely lifetime. A common approach:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Estimate what the client would pay for a 2-3 year license.</li>
              <li>Add a buyout premium of 25-100% above that estimate.</li>
              <li>Consider the media type, region, and commercial reach.</li>
            </ul>
            <p>A rough heuristic: a buyout for national broadcast often ranges from 2x-4x the session fee, while a buyout for corporate internal or web use may be closer to 1.5x-2x. Always apply your own judgment.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Buyout risks to watch for</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Scope creep</strong> — Define exactly what the buyout covers: which media, which territory, which specific recordings. A buyout for &quot;web use&quot; does not include broadcast.</li>
              <li><strong>Under-pricing</strong> — A low buyout for a high-reach campaign can be a significant loss. Treat it like pricing 5+ years of usage in advance.</li>
              <li><strong>Ambiguous territory</strong> — Be specific. &quot;Worldwide&quot; is clear. &quot;All markets&quot; is not.</li>
            </ul>
          </section>

          <SignupCTA
            headline="Build buyout quotes with clear usage terms"
            subtext="VoiceQuote CRM includes a buyout toggle, usage terms field, and reusable templates for buyout language."
          />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">FAQ</h2>
            {[
              { q: "Does a buyout mean the client owns the copyright?", a: "Not unless you explicitly transfer copyright in writing. A buyout licenses usage rights indefinitely — it doesn't transfer the underlying intellectual property unless you sign a copyright assignment agreement." },
              { q: "Can I negotiate the definition of a buyout?", a: "Yes. You can limit a buyout to specific media, territory, or purpose. For example, a 'web and social media buyout' doesn't include broadcast rights. Be specific in writing." },
              { q: "Should I charge more for a buyout than a 3-year license?", a: "Generally, yes. A buyout covers unlimited future use, so it should cost more than any time-limited license. How much more depends on the reach and commercial value of the campaign." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1 text-foreground">{faq.q}</h3>
                <p className="text-sm">{faq.a}</p>
              </div>
            ))}
          </section>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/guides/voice-over-usage-rights-explained" className="text-primary hover:underline">Usage Rights Guide →</Link>
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Usage Rate Calculator →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
