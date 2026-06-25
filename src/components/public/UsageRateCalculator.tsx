"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MEDIA_TYPES, USAGE_REGIONS, USAGE_TERMS } from "@/lib/constants";

export function UsageRateCalculator() {
  const [sessionFee, setSessionFee] = useState(400);
  const [mediaType, setMediaType] = useState("");
  const [region, setRegion] = useState("");
  const [term, setTerm] = useState("");
  const [isBuyout, setIsBuyout] = useState(false);
  const [rushFee, setRushFee] = useState(0);
  const [result, setResult] = useState<null | { subtotal: number; usageFee: number; total: number; notes: string[] }>(null);

  function calculate() {
    const notes: string[] = [];
    let usageMultiplier = 1;

    if (isBuyout) {
      usageMultiplier = 2.5;
      notes.push("Buyout adds a perpetual usage premium (estimated).");
    } else {
      // Region multiplier
      if (region === "local") usageMultiplier *= 1.0;
      else if (region === "regional") usageMultiplier *= 1.3;
      else if (region === "national") usageMultiplier *= 1.75;
      else if (region === "north_america") usageMultiplier *= 2.0;
      else if (region === "worldwide" || region === "english_speaking_world") usageMultiplier *= 2.5;
      else if (region === "internet_worldwide") usageMultiplier *= 1.5;

      // Term multiplier
      if (term === "3_months") usageMultiplier *= 0.8;
      else if (term === "6_months") usageMultiplier *= 0.9;
      else if (term === "1_year") usageMultiplier *= 1.0;
      else if (term === "2_years") usageMultiplier *= 1.3;
      else if (term === "3_years") usageMultiplier *= 1.6;
      else if (term === "buyout_perpetual") usageMultiplier *= 2.5;

      // Media type multiplier
      if (mediaType === "corporate_internal") usageMultiplier *= 0.75;
      else if (mediaType === "web_social") usageMultiplier *= 0.85;
      else if (mediaType === "elearning") usageMultiplier *= 0.9;
      else if (mediaType === "regional_broadcast") usageMultiplier *= 1.25;
      else if (mediaType === "national_broadcast") usageMultiplier *= 1.75;
      else if (mediaType === "international_broadcast") usageMultiplier *= 2.25;
      else usageMultiplier *= 1.0;

      notes.push("Usage fee is estimated. Apply your own rates and judgment.");
    }

    const usageFee = Math.round(sessionFee * (usageMultiplier - 1) * 100) / 100;
    const subtotal = sessionFee + rushFee + usageFee;

    setResult({ subtotal, usageFee, total: subtotal, notes });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Session Fee ($)</Label>
          <Input type="number" min="0" value={sessionFee} onChange={e => setSessionFee(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Rush Fee ($)</Label>
          <Input type="number" min="0" value={rushFee} onChange={e => setRushFee(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Media Type</Label>
          <Select value={mediaType} onValueChange={setMediaType}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>{MEDIA_TYPES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Usage Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>{USAGE_REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Usage Term</Label>
          <Select value={term} onValueChange={setTerm}>
            <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>{USAGE_TERMS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch id="buyout" checked={isBuyout} onCheckedChange={setIsBuyout} />
          <Label htmlFor="buyout">Buyout / Perpetual</Label>
        </div>
      </div>
      <Button onClick={calculate} className="w-full">Calculate Estimate</Button>

      {result && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Session Fee</span><span>${sessionFee.toFixed(2)}</span>
            </div>
            {rushFee > 0 && <div className="flex justify-between text-sm"><span>Rush Fee</span><span>${rushFee.toFixed(2)}</span></div>}
            {result.usageFee > 0 && <div className="flex justify-between text-sm"><span>Usage Fee (estimated)</span><span>${result.usageFee.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Estimated Total</span><span>${result.total.toFixed(2)}</span>
            </div>
            {result.notes.map((n, i) => <p key={i} className="text-xs text-muted-foreground">{n}</p>)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
