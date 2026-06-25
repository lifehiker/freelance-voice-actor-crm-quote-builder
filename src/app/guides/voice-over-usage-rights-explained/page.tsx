import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Voice Over Usage Rights Explained for Freelance Voice Actors",
  description: "A plain-language guide to voice over usage rights, licensing terms, media types, regions, buyouts, and how to explain them to direct clients.",
};

export default function UsageRightsGuidePage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Usage Rights Explained</h1>
          <p className="text-muted-foreground">
            A practical guide to understanding and communicating voice over usage rights, licensing terms, and how to structure your quotes for direct clients.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">Note: This guide explains usage rights concepts. It is not legal advice. Consult an attorney for specific legal guidance.</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-bold">What are voice over usage rights?</h2>
            <p className="text-muted-foreground">Usage rights (also called licensing rights) define how and where a client can use the voice recording you deliver. Unlike a product purchase, a voice over recording is intellectual property — and when you record for a client, you own the copyright unless you explicitly transfer or license it.</p>
            <p className="text-muted-foreground">Usage rights answer: Who can use the recording? In what media? In what geographic region? For how long?</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Session fee vs. usage fee</h2>
            <p className="text-muted-foreground">Most professional voice over quotes have two components:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Session fee</strong> — your time, equipment, and talent to record the script.</li>
              <li><strong>Usage fee</strong> — additional compensation for the commercial value of using the recording publicly, for commercial purposes, or over a wide area.</li>
            </ul>
            <p className="text-muted-foreground">Combining these into a single flat rate can leave money on the table for high-reach commercial work. Separating them makes the value transparent to the client.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">Key variables that affect usage pricing</h2>
            <div className="space-y-4">
              {[
                { title: "Media type", desc: "Broadcast (TV/radio) typically commands higher usage fees than digital/web or corporate internal use. The broader and more commercial the medium, the higher the usage value." },
                { title: "Geographic region", desc: "Local usage (one city or market) is less valuable than national or worldwide usage. A national TV spot reaches far more people than a local radio ad." },
                { title: "Usage term", desc: "Usage rights are typically licensed for a defined period: 1 year, 2 years, or perpetual (buyout). Longer terms command higher fees." },
                { title: "Exclusivity", desc: "If you agree not to record for competitors during the usage period, exclusivity adds value and should command additional compensation." },
              ].map(item => (
                <div key={item.title}>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold">How to explain usage rights to a client</h2>
            <p className="text-muted-foreground">Many direct clients are unfamiliar with voice over licensing. A simple analogy:</p>
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              &quot;Think of it like a stock photo license. You&apos;re not buying the photo outright — you&apos;re licensing the right to use it for a specific purpose, region, and time period. The same applies here. The session fee covers the recording. The usage fee covers the license to broadcast or publish it.&quot;
            </blockquote>
          </section>

          <SignupCTA
            headline="Build usage-rights-aware quotes for every job"
            subtext="VoiceQuote CRM includes media type, region, term, and buyout fields in every quote — plus reusable usage terms templates."
          />

          <section className="space-y-4">
            <h2 className="text-xl font-bold">FAQ</h2>
            {[
              { q: "Do I have to charge a usage fee?", a: "No, but most professional voice actors do for commercial work. A flat rate that combines session and usage is fine for low-stakes projects. For high-reach commercial work, separate line items protect your interests and educate the client." },
              { q: "What's the difference between a buyout and perpetual license?", a: "They often mean the same thing: the client can use the recording indefinitely in the agreed media and region without paying renewal fees. Be specific in writing about what territory and media types are included." },
              { q: "Should usage rights be in writing?", a: "Yes, always. A written quote or project agreement that specifies media type, region, and term protects both you and the client from future disputes." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </section>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Usage Rate Calculator →</Link>
            <Link href="/guides/voice-over-buyout-pricing-explained" className="text-primary hover:underline">Buyout Pricing Guide →</Link>
            <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
