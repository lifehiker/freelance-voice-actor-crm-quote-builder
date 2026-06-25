import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Receipt, Trash2 } from "lucide-react";
import { QUOTE_STATUSES, MEDIA_TYPES, USAGE_REGIONS, USAGE_TERMS } from "@/lib/constants";
import { updateQuote, updateQuoteStatus, deleteQuote } from "../actions";
import { QuoteBuilderForm } from "@/components/quotes/QuoteBuilderForm";
import { getPlan, pdfHasWatermark } from "@/lib/permissions";
import { format } from "date-fns";
import { createInvoiceFromQuote } from "../../invoices/actions";

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  draft: "secondary", sent: "default", accepted: "default", rejected: "destructive", expired: "secondary",
};

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [user, quote, clients, projects, templates] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, include: { subscription: true } }),
    db.quote.findUnique({
      where: { id, userId },
      include: { client: true, project: true, lineItems: { orderBy: { sortOrder: "asc" } }, invoices: true },
    }),
    db.client.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    db.project.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    db.usageTemplate.findMany({ where: { userId }, orderBy: { name: "asc" } }),
  ]);

  if (!quote) notFound();

  const plan = getPlan(user?.subscription);
  const hasWatermark = pdfHasWatermark(plan);
  const updateWithId = updateQuote.bind(null, id);

  const lookup = (arr: any[], val: string | null | undefined) => arr.find(i => i.value === val)?.label || val || "—";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/quotes"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Quotes</Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant={statusVariants[quote.status] || "secondary"} className="capitalize">
            {QUOTE_STATUSES.find(s => s.value === quote.status)?.label || quote.status}
          </Badge>
          <a href={`/api/quotes/${id}/pdf`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {hasWatermark ? "Download PDF (watermarked)" : "Download PDF"}
            </Button>
          </a>
          {quote.status === "accepted" && quote.invoices.length === 0 && (
            <form action={createInvoiceFromQuote.bind(null, id)}>
              <Button type="submit" size="sm">
                <Receipt className="mr-2 h-4 w-4" /> Create Invoice
              </Button>
            </form>
          )}
          <form action={deleteQuote.bind(null, id)}>
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </form>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{quote.quoteNumber}</h1>
        <p className="text-muted-foreground">
          {quote.client?.name || "No client"} {quote.project ? `— ${quote.project.name}` : ""}
          {" · "}Total: <strong>${quote.total.toFixed(2)}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 text-sm">
        <Card>
          <CardContent className="pt-4 space-y-2">
            <div><span className="text-muted-foreground">Media Type: </span>{lookup(MEDIA_TYPES, quote.mediaType)}</div>
            <div><span className="text-muted-foreground">Region: </span>{lookup(USAGE_REGIONS, quote.usageRegion)}</div>
            <div><span className="text-muted-foreground">Term: </span>{lookup(USAGE_TERMS, quote.usageTerm)}</div>
            <div><span className="text-muted-foreground">Buyout: </span>{quote.isBuyout ? "Yes" : "No"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <div><span className="text-muted-foreground">Session Fee: </span>${quote.sessionFee.toFixed(2)}</div>
            <div><span className="text-muted-foreground">Rush Fee: </span>${quote.rushFee.toFixed(2)}</div>
            <div><span className="text-muted-foreground">Discount: </span>-${quote.discount.toFixed(2)}</div>
            <div className="font-bold"><span className="text-muted-foreground font-normal">Total: </span>${quote.total.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 space-y-2">
            {quote.expiresAt && <div><span className="text-muted-foreground">Expires: </span>{format(new Date(quote.expiresAt), "MMM d, yyyy")}</div>}
            <div><span className="text-muted-foreground">Created: </span>{format(new Date(quote.createdAt), "MMM d, yyyy")}</div>
            <div className="flex gap-2 pt-2">
              {(["sent", "accepted", "rejected"] as const).map(s => (
                <form key={s} action={updateQuoteStatus.bind(null, id, s)}>
                  <Button type="submit" size="sm" variant={quote.status === s ? "default" : "outline"} className="capitalize text-xs h-7">
                    {s}
                  </Button>
                </form>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <QuoteBuilderForm
        onSubmit={updateWithId}
        clients={clients}
        projects={projects}
        templates={templates}
        defaultValues={{
          clientId: quote.clientId || "",
          projectId: quote.projectId || "",
          quoteNumber: quote.quoteNumber,
          status: quote.status,
          sessionFee: quote.sessionFee,
          mediaType: quote.mediaType || "",
          usageRegion: quote.usageRegion || "",
          usageTerm: quote.usageTerm || "",
          isBuyout: quote.isBuyout,
          revisionPolicy: quote.revisionPolicy || "",
          pickupPolicy: quote.pickupPolicy || "",
          usageTerms: quote.usageTerms || "",
          rushFee: quote.rushFee,
          discount: quote.discount,
          tax: quote.tax,
          expiresAt: quote.expiresAt,
          followUpAt: quote.followUpAt,
          notes: quote.notes || "",
          lineItems: quote.lineItems,
        }}
        isNew={false}
      />
    </div>
  );
}
