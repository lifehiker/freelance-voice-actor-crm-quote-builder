import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Mic2 } from "lucide-react";
import { AuditionStatusBadge } from "@/components/auditions/AuditionStatusBadge";
import { getPlan } from "@/lib/permissions";
import { PLAN_LIMITS } from "@/lib/constants";
import { format } from "date-fns";

export const metadata = { title: "Auditions" };

export default async function AuditionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, auditions] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, include: { subscription: true } }),
    db.audition.findMany({
      where: { userId },
      include: { client: true, project: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const plan = getPlan(user?.subscription);
  const limit = PLAN_LIMITS[plan].auditions;
  const atLimit = auditions.length >= limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Auditions & Submissions</h1>
          <p className="text-muted-foreground">
            {auditions.length} record{auditions.length !== 1 ? "s" : ""}
            {plan === "free" && ` (${auditions.length}/${limit} on free plan)`}
          </p>
        </div>
        {atLimit && plan === "free" ? (
          <Button asChild variant="outline"><Link href="/pricing">Upgrade to Add More</Link></Button>
        ) : (
          <Button asChild>
            <Link href="/auditions/new"><Plus className="mr-2 h-4 w-4" /> Log Audition</Link>
          </Button>
        )}
      </div>

      {auditions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mic2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold">No auditions tracked yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Start logging your auditions and submissions.</p>
            <Button asChild className="mt-4">
              <Link href="/auditions/new"><Plus className="mr-2 h-4 w-4" /> Log Audition</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Role / Project</th>
                <th className="text-left px-4 py-3 font-medium">Source</th>
                <th className="text-left px-4 py-3 font-medium">Client</th>
                <th className="text-left px-4 py-3 font-medium">Submitted</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Follow-up</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {auditions.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{a.role || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.castingSource || "—"}</td>
                  <td className="px-4 py-3">
                    {a.client ? (
                      <Link href={`/clients/${a.client.id}`} className="hover:underline">{a.client.name}</Link>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.submittedAt ? format(new Date(a.submittedAt), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AuditionStatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.followUpAt ? format(new Date(a.followUpAt), "MMM d") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/auditions/new?edit=${a.id}`} className="text-primary hover:underline text-xs">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
