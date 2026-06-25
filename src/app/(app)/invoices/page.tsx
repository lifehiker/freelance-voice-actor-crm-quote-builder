import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { INVOICE_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

export const metadata = { title: "Invoices" };

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  draft: "secondary", sent: "default", paid: "default", overdue: "destructive",
};

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const invoices = await db.invoice.findMany({
    where: { userId: session.user.id },
    include: { client: true, quote: true },
    orderBy: { createdAt: "desc" },
  });

  const totalUnpaid = invoices
    .filter(i => i.status !== "paid")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} · ${totalUnpaid.toFixed(2)} unpaid
          </p>
        </div>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-semibold">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Accept a quote to automatically create an invoice.</p>
            <Button asChild className="mt-4">
              <Link href="/quotes"><Receipt className="mr-2 h-4 w-4" /> View Quotes</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Invoice #</th>
                <th className="text-left px-4 py-3 font-medium">Client</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Due Date</th>
                <th className="text-left px-4 py-3 font-medium">Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/invoices/${inv.id}`} className="font-medium hover:underline text-primary">{inv.invoiceNumber}</Link>
                  </td>
                  <td className="px-4 py-3">{inv.client?.name || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariants[inv.status] || "secondary"} className="capitalize text-xs">
                      {INVOICE_STATUSES.find(s => s.value === inv.status)?.label || inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inv.dueDate ? format(new Date(inv.dueDate), "MMM d, yyyy") : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(inv.issueDate), "MMM d, yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
