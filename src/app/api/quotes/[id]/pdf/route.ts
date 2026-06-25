import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlan, pdfHasWatermark } from "@/lib/permissions";
import { MEDIA_TYPES, USAGE_REGIONS, USAGE_TERMS } from "@/lib/constants";

function lookup(arr: Array<{value: string; label: string}>, val: string | null | undefined): string {
  return arr.find(i => i.value === val)?.label || val || "—";
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatMultiline(value: unknown): string {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function buildPdfHtml(quote: any, settings: any, hasWatermark: boolean): string {
  const lineItemsHtml = quote.lineItems.map((item: any) => `
    <tr>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">${escapeHtml(item.description)}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(item.unitPrice)}</td>
      <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(item.amount)}</td>
    </tr>
  `).join("");

  const watermarkStyle = hasWatermark ? `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 80px; font-weight: bold; color: rgba(0,0,0,0.08); pointer-events: none; z-index: 1000;
      white-space: nowrap;">FREE PLAN</div>
  ` : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote ${quote.quoteNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 40px; color: #1a1a1a; font-size: 13px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .business-name { font-size: 22px; font-weight: bold; color: #2563eb; }
    .quote-meta { text-align: right; }
    .quote-number { font-size: 18px; font-weight: bold; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead { background: #f8fafc; }
    th { padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
    th:last-child, td:last-child { text-align: right; }
    .totals { margin-left: auto; width: 280px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
    .total-row.grand-total { font-size: 16px; font-weight: bold; border-top: 2px solid #1a1a1a; padding-top: 8px; margin-top: 4px; }
    .terms-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
    .badge { display: inline-block; background: #eff6ff; color: #2563eb; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .disclaimer { margin-top: 32px; font-size: 11px; color: #9ca3af; }
  </style>
</head>
<body>
  ${watermarkStyle}
  <div class="header">
    <div>
      <div class="business-name">${escapeHtml(settings?.businessName || "Voice Talent")}</div>
      ${settings?.email ? `<div>${escapeHtml(settings.email)}</div>` : ""}
      ${settings?.website ? `<div>${escapeHtml(settings.website)}</div>` : ""}
      ${settings?.address ? `<div style="margin-top:4px;">${formatMultiline(settings.address)}</div>` : ""}
    </div>
    <div class="quote-meta">
      <div class="quote-number">Quote ${escapeHtml(quote.quoteNumber)}</div>
      <div style="margin-top:8px; color:#6b7280;">Date: ${new Date(quote.createdAt).toLocaleDateString()}</div>
      ${quote.expiresAt ? `<div style="color:#6b7280;">Expires: ${new Date(quote.expiresAt).toLocaleDateString()}</div>` : ""}
      <div style="margin-top:8px;"><span class="badge">${escapeHtml(quote.status.toUpperCase())}</span></div>
    </div>
  </div>

  <div class="info-grid">
    <div>
      <div class="section-title">Bill To</div>
      <div style="font-weight:600;">${escapeHtml(quote.client?.name || "—")}</div>
      ${quote.client?.company ? `<div>${escapeHtml(quote.client.company)}</div>` : ""}
      ${quote.client?.email ? `<div>${escapeHtml(quote.client.email)}</div>` : ""}
    </div>
    <div>
      <div class="section-title">Project Details</div>
      ${quote.project ? `<div><strong>Project:</strong> ${escapeHtml(quote.project.name)}</div>` : ""}
      <div><strong>Media:</strong> ${escapeHtml(lookup(MEDIA_TYPES, quote.mediaType))}</div>
      <div><strong>Region:</strong> ${escapeHtml(lookup(USAGE_REGIONS, quote.usageRegion))}</div>
      <div><strong>Term:</strong> ${escapeHtml(lookup(USAGE_TERMS, quote.usageTerm))}</div>
      ${quote.isBuyout ? `<div><strong>Buyout:</strong> Yes (Perpetual License)</div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Unit Price</th>
        <th style="text-align:right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">Session Fee</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">1</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(quote.sessionFee)}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(quote.sessionFee)}</td>
      </tr>
      ${quote.rushFee > 0 ? `
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0;">Rush Fee</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: center;">1</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(quote.rushFee)}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #f0f0f0; text-align: right;">${formatCurrency(quote.rushFee)}</td>
      </tr>` : ""}
      ${lineItemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>${formatCurrency(quote.subtotal)}</span></div>
    ${quote.discount > 0 ? `<div class="total-row" style="color:#16a34a;"><span>Discount</span><span>-${formatCurrency(quote.discount)}</span></div>` : ""}
    ${quote.tax > 0 ? `<div class="total-row"><span>Tax (${quote.tax}%)</span><span>${formatCurrency((quote.subtotal - quote.discount) * quote.tax / 100)}</span></div>` : ""}
    <div class="total-row grand-total"><span>Total</span><span>${formatCurrency(quote.total)}</span></div>
  </div>

  ${quote.usageTerms ? `
  <div class="terms-section">
    <div class="section-title">Usage Rights & Terms</div>
    <p style="line-height:1.6;">${formatMultiline(quote.usageTerms)}</p>
  </div>` : ""}

  ${quote.revisionPolicy ? `
  <div class="terms-section">
    <div class="section-title">Revision Policy</div>
    <p style="line-height:1.6;">${formatMultiline(quote.revisionPolicy)}</p>
  </div>` : ""}

  ${quote.pickupPolicy ? `
  <div class="terms-section">
    <div class="section-title">Pickup Policy</div>
    <p style="line-height:1.6;">${formatMultiline(quote.pickupPolicy)}</p>
  </div>` : ""}

  ${settings?.defaultPaymentTerms ? `
  <div class="terms-section">
    <div class="section-title">Payment Terms</div>
    <p style="line-height:1.6;">${formatMultiline(settings.defaultPaymentTerms)}</p>
  </div>` : ""}

  <div class="disclaimer">
    This quote was prepared using VoiceQuote CRM. Rates are determined by the voice talent based on their business
    judgment and current market references. This document is not an official rate-setting authority.
    ${hasWatermark ? " | Generated on Free Plan — Upgrade for watermark-free PDFs." : ""}
  </div>
</body>
</html>`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const [user, quote, settings] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, include: { subscription: true } }),
    db.quote.findUnique({
      where: { id, userId },
      include: {
        client: true,
        project: true,
        lineItems: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.businessSettings.findUnique({ where: { userId } }),
  ]);

  if (!quote) {
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  }

  const plan = getPlan(user?.subscription);
  const hasWatermark = pdfHasWatermark(plan);

  const html = buildPdfHtml(quote, settings, hasWatermark);
  const filename = quote.quoteNumber.replace(/[^a-z0-9._-]/gi, "_");

  // Return HTML that browser can print as PDF
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${filename}.html"`,
    },
  });
}
