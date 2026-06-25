import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Receipt, Mic2, FolderOpen, Bell } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [
    quotesCount,
    sentQuotes,
    unpaidInvoices,
    openAuditions,
    openProjects,
    recentQuotes,
    upcomingFollowUps,
  ] = await Promise.all([
    db.quote.count({ where: { userId } }),
    db.quote.findMany({ where: { userId, status: "sent" } }),
    db.invoice.findMany({
      where: { userId, status: { in: ["sent", "overdue"] } },
      include: { client: true },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    db.audition.count({ where: { userId, status: { in: ["planned", "submitted", "callback"] } } }),
    db.project.count({ where: { userId, status: { notIn: ["paid", "lost"] } } }),
    db.quote.findMany({
      where: { userId },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.reminder.findMany({
      where: { userId, sent: false, dueAt: { lte: weekFromNow } },
      orderBy: { dueAt: "asc" },
      take: 5,
    }),
  ]);

  const unpaidTotal = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const statusColors: Record<string, string> = {
    draft: "secondary",
    sent: "default",
    accepted: "default",
    rejected: "destructive",
    expired: "secondary",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s your business at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Quotes"
          value={quotesCount}
          description={`${sentQuotes.length} awaiting response`}
          icon={FileText}
        />
        <MetricCard
          title="Unpaid Invoices"
          value={`$${unpaidTotal.toFixed(2)}`}
          description={`${unpaidInvoices.length} invoice${unpaidInvoices.length !== 1 ? "s" : ""}`}
          icon={Receipt}
          iconColor="text-amber-500"
        />
        <MetricCard
          title="Open Auditions"
          value={openAuditions}
          description="Planned, submitted, or callback"
          icon={Mic2}
          iconColor="text-blue-500"
        />
        <MetricCard
          title="Active Projects"
          value={openProjects}
          description="Not yet paid or lost"
          icon={FolderOpen}
          iconColor="text-green-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Quotes</CardTitle>
            <Link href="/quotes" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {recentQuotes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No quotes yet. <Link href="/quotes/new" className="text-primary hover:underline">Create your first quote</Link></p>
            ) : (
              <ul className="space-y-3">
                {recentQuotes.map((quote) => (
                  <li key={quote.id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/quotes/${quote.id}`} className="text-sm font-medium hover:underline">
                        {quote.quoteNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">{quote.client?.name || "No client"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">${quote.total.toFixed(2)}</span>
                      <Badge variant={statusColors[quote.status] as any || "secondary"} className="capitalize text-xs">
                        {quote.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Follow-ups</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingFollowUps.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming follow-ups this week.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingFollowUps.map((reminder) => (
                  <li key={reminder.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium capitalize">{reminder.entityType} follow-up</p>
                      {reminder.message && (
                        <p className="text-xs text-muted-foreground">{reminder.message}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(reminder.dueAt), "MMM d")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Unpaid Invoices</CardTitle>
            <Link href="/invoices" className="text-sm text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {unpaidInvoices.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No unpaid invoices.</p>
            ) : (
              <ul className="space-y-3">
                {unpaidInvoices.map((invoice) => (
                  <li key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <Link href={`/invoices/${invoice.id}`} className="text-sm font-medium hover:underline">
                        {invoice.invoiceNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">{invoice.client?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${invoice.amount.toFixed(2)}</p>
                      <Badge variant={invoice.status === "overdue" ? "destructive" : "default"} className="text-xs">
                        {invoice.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
