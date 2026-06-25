import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Voice Actor Proposal Template | Copy, Customize, and Export",
  description: "Free voice actor proposal template for direct client pitches. Includes project scope, usage rights, fees, and professional language.",
};

const template = `VOICE OVER PROPOSAL

From: [Your Name / Business Name]
Date: [Date]
Prepared for: [Client Name / Company]

---

INTRODUCTION

Thank you for the opportunity to quote on [project name / campaign]. I specialize in [your niche — e.g., commercial, corporate narration, e-learning, character work] and I'm confident I can deliver the sound you're looking for.

---

PROJECT UNDERSTANDING

Based on our conversation / your brief, I understand you need:

• Voice over for: [Project type — e.g., a 30-second national TV commercial / a series of e-learning modules / corporate narration]
• Script length: [Word count or approximate duration]
• Tone / Style: [Warm and conversational / authoritative / energetic / etc.]
• Deliverables: [File formats, number of final files, revisions included]
• Timeline: [Client's deadline / expected delivery date]

---

APPROACH

I propose recording in my [professional home studio / broadcast-quality studio] to produce [clean/broadcast-ready files]. The final deliverables will be [WAV/MP3, sample rate, bit depth] unless otherwise specified.

---

INVESTMENT

Session Fee (recording, direction, light editing):   $[Amount]
Usage / Licensing Fee:                               $[Amount]
Rush Fee (if applicable):                            $[Amount]

TOTAL:                                               $[Amount]

---

USAGE RIGHTS

Media Type: [Web / Broadcast / Corporate / etc.]
Region: [Local / National / Worldwide]
Term: [1 Year / Buyout / etc.]

[Describe the specific rights granted in plain language.]

---

REVISION POLICY

[X] rounds of minor revisions are included at no additional charge. Script changes or significant re-direction will be quoted separately.

---

PROCESS

1. Agreement confirmed in writing.
2. Invoice sent for 50% deposit (optional — adjust to your terms).
3. Recording session completed within [X] business days.
4. Files delivered via [Dropbox / WeTransfer / etc.].
5. Balance invoice sent on delivery.

---

NEXT STEPS

If this proposal works for you, reply with your confirmation and I'll send over the project agreement. I look forward to working with you.

---

[Your Name]
[Business Name]
[Email] | [Website] | [Phone]`;

export default function ProposalTemplatePage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Actor Proposal Template</h1>
          <p className="text-muted-foreground">A complete proposal template for voice actors pitching direct clients. Includes project understanding, approach, pricing, usage rights, and next steps.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{template}</pre>
          </CardContent>
        </Card>
        <SignupCTA
          headline="Build proposals with your real clients and rates"
          subtext="Create a free account to use the interactive quote builder with PDF export and client management."
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
          <Link href="/templates/voice-over-revision-policy-template" className="text-primary hover:underline">Revision Policy Template →</Link>
        </div>
      </div>
    </div>
  );
}
