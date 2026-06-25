import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Voice Over Invoice Template | Copy, Customize, and Export",
  description: "Free voice over invoice template with session fee, usage, pickups, and revisions line items. For freelance voice actors.",
};

const template = `INVOICE

From: [Your Name / Business Name]
Invoice #: [INV-0001]
Invoice Date: [Date]
Due Date: [Date + 30 days]

BILL TO:
[Client Name]
[Company]
[Email / Address]

---

DESCRIPTION OF SERVICES

Project: [Project Name]

Line Items:

Session Fee (recording — [word count / duration])         $[Amount]
Usage / Licensing Fee ([media type, region, term])        $[Amount]
Rush Fee (if applicable)                                  $[Amount]
Pickup Session — [brief description]                      $[Amount]
Additional Revision — [brief description]                 $[Amount]
[Other line items as needed]                              $[Amount]

---

SUBTOTAL:                                                 $[Amount]
Discount:                                                -$[Amount]
Tax:                                                      $[Amount]
TOTAL DUE:                                                $[Amount]

---

PAYMENT TERMS

Payment is due within [30] days of invoice date.
Late payments may be subject to a [1.5%] monthly fee.

Payment methods accepted:
• Bank Transfer: [Account details]
• PayPal: [Email]
• Check payable to: [Name]

---

NOTES

[Any project-specific notes, file delivery details, or client instructions]

---

Thank you for your business.

[Your Name]
[Business Name]
[Email] | [Website]`;

export default function InvoiceTemplatePage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Invoice Template</h1>
          <p className="text-muted-foreground">A complete invoice template for freelance voice actors. Includes session fee, usage/licensing, pickup, revision, and other VO-specific line items.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{template}</pre>
          </CardContent>
        </Card>
        <SignupCTA
          headline="Generate invoices automatically from accepted quotes"
          subtext="Create an account to turn a quote into an invoice in one click, with all line items carried over."
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
          <Link href="/templates/voice-over-revision-policy-template" className="text-primary hover:underline">Revision Policy Template →</Link>
        </div>
      </div>
    </div>
  );
}
