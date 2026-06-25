import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Voice Over Revision Policy Template | Copy, Customize, and Export",
  description: "Free voice over revision and pickup policy template. Set clear expectations on revisions, script changes, and pickup session fees.",
};

const template = `REVISION & PICKUP POLICY

REVISIONS INCLUDED:
This quote includes [2] rounds of minor revisions at no additional charge.

DEFINITION OF REVISIONS:
A revision is defined as a minor adjustment to pacing, emphasis, or tone using the original approved script. Revisions do not include new takes with a different performance direction not specified in the original brief, nor changes to the script.

SCRIPT CHANGES:
Any change to the approved script (word changes, additions, or deletions exceeding 10% of the original word count) constitutes a new recording, not a revision.

SIGNIFICANT RE-DIRECTION:
If a client provides new performance direction that differs substantially from the original brief, the session may be re-classified as a pickup session and billed accordingly.

PICKUP SESSIONS:
Pickup sessions for script changes, re-direction, or additional takes are typically billed at [50-75%] of the original session fee, depending on scope. A pickup quote will be provided before any additional recording begins. Pickup sessions are subject to the same usage terms as the original recording unless otherwise agreed in writing.

DELIVERY OF REVISIONS:
Revisions will be delivered within [3-5] business days of written approval of the direction.

---
This policy forms part of the voice over quote / project agreement between [Your Name] and the client.`;

export default function RevisionPolicyTemplatePage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Revision Policy Template</h1>
          <p className="text-muted-foreground">Client-facing revision and pickup policy language for voice actors. Sets clear expectations on what counts as a revision vs. a pickup session.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{template}</pre>
          </CardContent>
        </Card>
        <SignupCTA
          headline="Save your revision policy in VoiceQuote CRM"
          subtext="Store reusable policy templates and insert them into quotes with one click."
        />
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
          <Link href="/guides/voice-over-usage-rights-explained" className="text-primary hover:underline">Usage Rights Guide →</Link>
        </div>
      </div>
    </div>
  );
}
