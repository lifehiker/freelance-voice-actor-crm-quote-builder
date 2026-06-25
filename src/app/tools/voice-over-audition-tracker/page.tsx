import type { Metadata } from "next";
import Link from "next/link";
import { SignupCTA } from "@/components/public/SignupCTA";
import { Mic } from "lucide-react";

export const metadata: Metadata = {
  title: "Voice Over Audition Tracker | Free Tool for Voice Actors",
  description: "Track voice over auditions, casting submissions, callbacks, and bookings. Free tool for freelance voice actors. Create an account to save your records.",
};

const sampleAuditions = [
  { role: "National Bank Commercial", source: "Agent referral", status: "callback", submitted: "Jun 1", callback: "Jun 5" },
  { role: "Corporate Narration — Tech Co", source: "Direct email", status: "submitted", submitted: "Jun 2", callback: null },
  { role: "E-learning Medical Series", source: "Voice123", status: "booked", submitted: "May 28", callback: "May 30" },
  { role: "Animated Web Series — Lead", source: "Casting Call Club", status: "rejected", submitted: "May 25", callback: null },
  { role: "Social Media Ad — Fitness Brand", source: "Direct referral", status: "no_response", submitted: "May 20", callback: null },
];

const statusColors: Record<string, string> = {
  planned: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  callback: "bg-yellow-100 text-yellow-700",
  booked: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  no_response: "bg-gray-100 text-gray-500",
};

export default function AuditionTrackerPage() {
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
          <h1 className="text-3xl font-bold mb-3">Voice Over Audition Tracker</h1>
          <p className="text-muted-foreground">
            Track every audition, casting submission, callback, and booking in one place. Know the status of every opportunity at a glance — no more searching through emails or spreadsheets.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Preview (sample data)</h2>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Role / Project</th>
                  <th className="text-left px-4 py-3 font-medium">Source</th>
                  <th className="text-left px-4 py-3 font-medium">Submitted</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sampleAuditions.map((a, i) => (
                  <tr key={i} className="hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{a.role}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.source}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.submitted}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[a.status] || ""}`}>
                        {a.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Sample data only. Create a free account to track your own auditions.</p>
        </div>

        <SignupCTA
          headline="Track your auditions — free"
          subtext="Create an account to log auditions, track callbacks, and follow up on opportunities."
        />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">What to track in a voice over audition log</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>Tracking auditions helps you:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Know which auditions are still outstanding and deserve a follow-up.</li>
              <li>Spot patterns in which casting sources lead to bookings.</li>
              <li>Avoid losing track of callbacks when you get busy.</li>
              <li>Build a history of your submission activity over time.</li>
            </ul>
            <p>Key fields to track: role/project name, casting source, submitted date, callback date, status, and notes.</p>
          </div>

          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="space-y-4">
            {[
              { q: "What statuses should I use?", a: "VoiceQuote CRM uses: Planned, Submitted, Callback, Booked, Rejected, and No Response. These cover the full lifecycle of a casting submission." },
              { q: "Can I link auditions to clients and projects?", a: "Yes. In VoiceQuote CRM, auditions can be linked to existing client and project records, so your business history stays connected." },
              { q: "Is there a free version?", a: "Yes. The free plan includes 10 audition records. Upgrade to Solo for unlimited tracking." },
            ].map(faq => (
              <div key={faq.q}>
                <h3 className="font-semibold mb-1">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/templates/freelance-voice-actor-quote-template" className="text-primary hover:underline">Quote Template →</Link>
            <Link href="/tools/voice-over-usage-rate-calculator" className="text-primary hover:underline">Usage Rate Calculator →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
