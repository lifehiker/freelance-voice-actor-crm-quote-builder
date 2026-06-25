import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";
import { QUOTE_STATUSES } from "@/lib/constants";
import { getPlan } from "@/lib/permissions";
import { PLAN_LIMITS } from "@/lib/constants";
import { format } from "date-fns";

export const metadata = { title: "Quotes" };

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  draft: "secondary", sent: "default", accepted: "default", rejected: "destructive", expired: "secondary",
};

export default async function QuotesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, quotes] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, include: { subscription: true } }),
    db.quote.findMany({
      where: { userId },
      include: { client: true, project: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const plan = getPlan(user?.subscription);
  const limit = PLAN_LIMITS[plan].quotes;
  const atLimit = quotes.length >= limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Quotes</h1>
          <p className="text-muted-foreground">
            {quotes.length} quote{quotes.length !== 1 ? "s" : ""}
            {plan === "free" && ` (${quotes.length}/${limit} on free plan)`}
          </p>
        </div>
        {atLimit && plan === "free" ? (
          <Button asChild variant="outline"><Link href="/pricing">Upgrade to Create More</Link></Button>
        ) : (
          <Button asChild>
            <Link href="/quotes/new"><Plus className="mr-2 h-4 w-4" /> New Quote</Link>
          </Button>
        )}
      </div>

      {quotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold">No quotes yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Build your first voice-over quote with usage rights and line items.</p>
            <Button asChild className="mt-4">
              <Link href="/quotes/new"><Plus className="mr-2 h-4 w-4" /> New Quote</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Quote #</th>
                <th className="text-left px-4 py-3 font-medium">Client</th>
                <th className="text-left px-4 py-3 font-medium">Project</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/quotes/${q.id}`} className="font-medium hover:underline text-primary">{q.quoteNumber}</Link>
                  </td>
                  <td className="px-4 py-3">{q.client?.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.project?.name || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">${q.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[q.status] || "secondary"} className="capitalize text-xs">
                      {QUOTE_STATUSES.find(s => s.value === q.status)?.label || q.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(q.createdAt), "MMM d, yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
