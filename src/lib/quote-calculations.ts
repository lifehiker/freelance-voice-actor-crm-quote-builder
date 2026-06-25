export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface QuoteData {
  sessionFee: number;
  rushFee: number;
  lineItems: LineItem[];
  discount: number;
  tax: number;
}

export function calculateQuoteTotals(data: QuoteData) {
  const lineItemsTotal = data.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const subtotal = data.sessionFee + data.rushFee + lineItemsTotal;
  const discountAmount = data.discount;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * data.tax) / 100;
  const total = afterDiscount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
}

export function calculateLineItemAmount(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice * 100) / 100;
}
