import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2 } from "lucide-react";
import { INVOICE_STATUSES } from "@/lib/constants";
import { updateInvoiceFollowUp, updateInvoiceStatus, deleteInvoice } from "../actions";
import { format } from "date-fns";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const invoice = await db.invoice.findUnique({
    where: { id, userId: session.user.id },
    include: {
      client: true,
      quote: { include: { lineItems: { orderBy: { sortOrder: "asc" } } } },
    },
  });

  if (!invoice) notFound();

  const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
    draft: "secondary", sent: "default", paid: "default", overdue: "destructive",
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/invoices"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices</Link>
        </Button>
        <form action={deleteInvoice.bind(null, id)}>
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">{invoice.client?.name || "No client"}</p>
        </div>
        <Badge variant={statusVariants[invoice.status] || "secondary"} className="capitalize text-base px-3 py-1">
          {INVOICE_STATUSES.find(s => s.value === invoice.status)?.label || invoice.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <Card><CardContent className="pt-4 space-y-2">
          <div><span className="text-muted-foreground">Amount: </span><strong>${invoice.amount.toFixed(2)}</strong></div>
          <div><span className="text-muted-foreground">Issued: </span>{format(new Date(invoice.issueDate), "MMM d, yyyy")}</div>
          {invoice.dueDate && <div><span className="text-muted-foreground">Due: </span>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</div>}
          {invoice.followUpAt && <div><span className="text-muted-foreground">Follow-up: </span>{format(new Date(invoice.followUpAt), "MMM d, yyyy")}</div>}
        </CardContent></Card>
        <Card className="md:col-span-2"><CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
          <CardContent className="flex gap-2">
            {INVOICE_STATUSES.map(s => (
              <form key={s.value} action={updateInvoiceStatus.bind(null, id, s.value)}>
                <Button type="submit" size="sm" variant={invoice.status === s.value ? "default" : "outline"} className="capitalize">
                  {s.label}
                </Button>
              </form>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Follow-up Reminder</CardTitle></CardHeader>
        <CardContent>
          <form action={updateInvoiceFollowUp.bind(null, id)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="followUpAt">Follow-up Date</Label>
              <Input
                id="followUpAt"
                name="followUpAt"
                type="date"
                defaultValue={invoice.followUpAt ? format(new Date(invoice.followUpAt), "yyyy-MM-dd") : ""}
              />
            </div>
            <Button type="submit" variant="outline">Save Reminder</Button>
          </form>
        </CardContent>
      </Card>

      {invoice.quote && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Quote Line Items</CardTitle>
            <Link href={`/quotes/${invoice.quoteId}`} className="text-sm text-primary hover:underline">View Quote</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoice.quote.lineItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.description} × {item.quantity}</span>
                  <span className="font-medium">${item.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between font-bold">
                <span>Total</span>
                <span>${invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
