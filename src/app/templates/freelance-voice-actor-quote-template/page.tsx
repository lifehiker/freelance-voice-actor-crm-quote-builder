import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Freelance Voice Actor Quote Template | Copy, Customize, and Export",
  description: "Free voice actor quote template with session fees, usage rights, revision policy, and client-facing language. Copy, customize, and export as PDF.",
};

const template = `VOICE OVER QUOTE

From: [Your Name / Business Name]
Date: [Date]
Quote #: [Q-0001]
Valid Until: [Expiration Date]

TO:
[Client Name]
[Company]
[Email]

---

PROJECT: [Project Name]

DELIVERABLES:
[Description of the recording: script length, character/style, number of files, file format]

---

FEES:

Session Fee (recording, direction, basic edit):  $[Amount]
Usage / Licensing Fee:                           $[Amount]
Rush Fee (if applicable):                        $[Amount]
Additional Line Items:                           $[Amount]

SUBTOTAL:                                        $[Amount]
Discount:                                        -$[Amount]
Tax:                                             $[Amount]
TOTAL:                                           $[Amount]

---

USAGE RIGHTS:

Media Type: [Web / Social / Regional Broadcast / National Broadcast / Corporate Internal / etc.]
Region: [Local / Regional / National / Worldwide]
Term: [1 Year / 2 Years / Buyout / etc.]
Buyout: [Yes / No]

Usage Rights Granted:
[Describe the specific usage rights granted]

---

REVISION POLICY:

This quote includes [X] rounds of minor revisions at no additional charge. Script changes of more than 10% or significant re-direction will be quoted as a pickup session.

---

PICKUP POLICY:

Pickup sessions are typically billed at 50-75% of the original session fee.

---

PAYMENT TERMS:

Payment is due within [30] days of invoice date.

---

[Your Name]
[Business Name]
[Email] | [Website] | [Phone]`;

export default function QuoteTemplatePage() {
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
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-3">Freelance Voice Actor Quote Template</h1>
          <p className="text-muted-foreground">
            A complete, copyable voice actor quote template for direct client proposals. Includes session fee, usage rights, revision policy, pickup policy, and payment terms.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground">{template}</pre>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <CopyButton text={template} />
          <Button asChild>
            <Link href="/signup">Save &amp; Customize in VoiceQuote CRM</Link>
          </Button>
        </div>

        <SignupCTA
          headline="Build and export quotes in minutes"
          subtext="Create a free account to use the interactive quote builder with your own clients, fees, and usage terms."
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">How to use this template</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Key sections to customize:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Rights</strong> — Specify the exact media, region, and term.</li>
              <li><strong>Revision Policy</strong> — Set clear expectations upfront.</li>
              <li><strong>Payment Terms</strong> — Specify your preferred payment method and timeline.</li>
              <li><strong>Expiration Date</strong> — Quotes should have an expiration date (typically 30 days).</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "Should I always include usage fees in a quote?", a: "Yes for commercial work. Session fees cover your time and recording. Usage fees cover the commercial rights." },
              { q: "Can I use this template for free?", a: "Yes, this template is free to copy and use. For a guided quote builder with PDF export and client tracking, try VoiceQuote CRM." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/templates/voice-actor-proposal-template" className="text-primary hover:underline">Proposal Template →</Link>
            <Link href="/templates/voice-over-invoice-template" className="text-primary hover:underline">Invoice Template →</Link>
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Usage Rate Calculator →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
