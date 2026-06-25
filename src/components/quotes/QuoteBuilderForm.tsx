"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MEDIA_TYPES, USAGE_REGIONS, USAGE_TERMS, QUOTE_STATUSES } from "@/lib/constants";
import { calculateQuoteTotals, calculateLineItemAmount } from "@/lib/quote-calculations";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface QuoteBuilderFormProps {
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: any;
  clients: Array<{ id: string; name: string; company?: string | null }>;
  projects: Array<{ id: string; name: string }>;
  templates: Array<{ id: string; name: string; content: string }>;
  isNew?: boolean;
}

export function QuoteBuilderForm({ onSubmit, defaultValues, clients, projects, templates, isNew = true }: QuoteBuilderFormProps) {
  const [clientId, setClientId] = useState(defaultValues?.clientId || "");
  const [projectId, setProjectId] = useState(defaultValues?.projectId || "");
  const [status, setStatus] = useState(defaultValues?.status || "draft");
  const [mediaType, setMediaType] = useState(defaultValues?.mediaType || "");
  const [usageRegion, setUsageRegion] = useState(defaultValues?.usageRegion || "");
  const [usageTerm, setUsageTerm] = useState(defaultValues?.usageTerm || "");
  const [isBuyout, setIsBuyout] = useState(defaultValues?.isBuyout || false);
  const [sessionFee, setSessionFee] = useState(defaultValues?.sessionFee || 0);
  const [rushFee, setRushFee] = useState(defaultValues?.rushFee || 0);
  const [discount, setDiscount] = useState(defaultValues?.discount || 0);
  const [tax, setTax] = useState(defaultValues?.tax || 0);
  const [revisionPolicy, setRevisionPolicy] = useState(defaultValues?.revisionPolicy || "");
  const [pickupPolicy, setPickupPolicy] = useState(defaultValues?.pickupPolicy || "");
  const [usageTerms, setUsageTerms] = useState(defaultValues?.usageTerms || "");
  const [notes, setNotes] = useState(defaultValues?.notes || "");
  const [lineItems, setLineItems] = useState<LineItem[]>(
    defaultValues?.lineItems?.map((item: any) => ({ ...item, id: item.id || Math.random().toString() })) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addLineItem = () => {
    setLineItems(prev => [...prev, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "quantity" || field === "unitPrice") {
        updated.amount = calculateLineItemAmount(
          field === "quantity" ? value : item.quantity,
          field === "unitPrice" ? value : item.unitPrice
        );
      }
      return updated;
    }));
  };

  const totals = calculateQuoteTotals({ sessionFee, rushFee, lineItems, discount, tax });

  const insertTemplate = (content: string, field: "revisionPolicy" | "pickupPolicy" | "usageTerms") => {
    const setters = { revisionPolicy: setRevisionPolicy, pickupPolicy: setPickupPolicy, usageTerms: setUsageTerms };
    setters[field](content);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    try {
      await onSubmit({
        clientId,
        projectId,
        quoteNumber: isNew ? (form.querySelector("#quoteNumber") as HTMLInputElement)?.value || "" : defaultValues?.quoteNumber,
        status,
        sessionFee,
        mediaType,
        usageRegion,
        usageTerm,
        isBuyout,
        revisionPolicy,
        pickupPolicy,
        usageTerms,
        rushFee,
        discount,
        tax,
        expiresAt: (form.querySelector("#expiresAt") as HTMLInputElement)?.value || "",
        followUpAt: (form.querySelector("#followUpAt") as HTMLInputElement)?.value || "",
        notes,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          amount: item.amount,
        })),
      });
    } catch (e: any) {
      setError(e.message || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Card>
        <CardHeader><CardTitle className="text-base">Quote Details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isNew && (
            <div className="space-y-2">
              <Label htmlFor="quoteNumber">Quote Number</Label>
              <Input id="quoteNumber" placeholder="Auto-generated if left blank" defaultValue="" />
            </div>
          )}
          {!isNew && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {QUOTE_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue placeholder="Link to project" /></SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Quote Expiration</Label>
            <Input id="expiresAt" type="date"
              defaultValue={defaultValues?.expiresAt ? format(new Date(defaultValues.expiresAt), "yyyy-MM-dd") : ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="followUpAt">Follow-up Date</Label>
            <Input id="followUpAt" type="date"
              defaultValue={defaultValues?.followUpAt ? format(new Date(defaultValues.followUpAt), "yyyy-MM-dd") : ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Usage Rights & Licensing</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Media Type</Label>
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger><SelectValue placeholder="Select media type" /></SelectTrigger>
              <SelectContent>
                {MEDIA_TYPES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Usage Region</Label>
            <Select value={usageRegion} onValueChange={setUsageRegion}>
              <SelectTrigger><SelectValue placeholder="Select region" /></SelectTrigger>
              <SelectContent>
                {USAGE_REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Usage Term</Label>
            <Select value={usageTerm} onValueChange={setUsageTerm}>
              <SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger>
              <SelectContent>
                {USAGE_TERMS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch id="isBuyout" checked={isBuyout} onCheckedChange={setIsBuyout} />
            <Label htmlFor="isBuyout">Buyout / Perpetual License</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Fees & Line Items</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Line Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sessionFee">Session Fee ($)</Label>
              <Input id="sessionFee" type="number" min="0" step="0.01" value={sessionFee}
                onChange={(e) => setSessionFee(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rushFee">Rush Fee ($)</Label>
              <Input id="rushFee" type="number" min="0" step="0.01" value={rushFee}
                onChange={(e) => setRushFee(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          {lineItems.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                <span className="col-span-5">Description</span>
                <span className="col-span-2">Qty</span>
                <span className="col-span-2">Unit Price</span>
                <span className="col-span-2">Amount</span>
                <span className="col-span-1"></span>
              </div>
              {lineItems.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-5 text-sm" value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Description" />
                  <Input className="col-span-2 text-sm" type="number" min="0" step="0.01" value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)} />
                  <Input className="col-span-2 text-sm" type="number" min="0" step="0.01" value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} />
                  <span className="col-span-2 text-sm font-medium">${item.amount.toFixed(2)}</span>
                  <Button type="button" variant="ghost" size="sm" className="col-span-1 h-8 w-8 p-0"
                    onClick={() => removeLineItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Separator />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount ($)</Label>
              <Input id="discount" type="number" min="0" step="0.01" value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax (%)</Label>
              <Input id="tax" type="number" min="0" max="100" step="0.01" value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({tax}%)</span>
                <span>${totals.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Terms & Policies</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="usageTerms">Usage Terms</Label>
              {templates.length > 0 && (
                <Select onValueChange={(val) => {
                  const t = templates.find(t => t.id === val);
                  if (t) insertTemplate(t.content, "usageTerms");
                }}>
                  <SelectTrigger className="w-48 h-7 text-xs">
                    <SelectValue placeholder="Insert template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
            <Textarea id="usageTerms" rows={4} value={usageTerms} onChange={(e) => setUsageTerms(e.target.value)}
              placeholder="Describe usage rights granted..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="revisionPolicy">Revision Policy</Label>
            <Textarea id="revisionPolicy" rows={3} value={revisionPolicy} onChange={(e) => setRevisionPolicy(e.target.value)}
              placeholder="How many revisions are included..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupPolicy">Pickup Policy</Label>
            <Textarea id="pickupPolicy" rows={3} value={pickupPolicy} onChange={(e) => setPickupPolicy(e.target.value)}
              placeholder="Policy for pickup sessions..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes visible only to you..." />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Saving..." : isNew ? "Create Quote" : "Save Changes"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        This quote builder helps structure your proposal inputs. It is not an official rate guide or pricing authority.
        Always apply your own business judgment and current industry references.
      </p>
    </form>
  );
}
