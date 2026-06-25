"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlan, canCreateQuote } from "@/lib/permissions";
import { calculateQuoteTotals } from "@/lib/quote-calculations";
import { syncReminder } from "@/lib/reminders";

interface LineItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export async function createQuote(data: {
  clientId: string;
  projectId: string;
  quoteNumber: string;
  sessionFee: number;
  mediaType: string;
  usageRegion: string;
  usageTerm: string;
  isBuyout: boolean;
  revisionPolicy: string;
  pickupPolicy: string;
  usageTerms: string;
  rushFee: number;
  discount: number;
  tax: number;
  expiresAt: string;
  followUpAt: string;
  notes: string;
  lineItems: LineItemInput[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const user = await db.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  const plan = getPlan(user?.subscription);
  const count = await db.quote.count({ where: { userId } });

  if (!canCreateQuote(plan, count)) {
    throw new Error("Free plan limit reached (3 quotes). Upgrade to create more.");
  }

  const { subtotal, total } = calculateQuoteTotals({
    sessionFee: data.sessionFee,
    rushFee: data.rushFee,
    lineItems: data.lineItems,
    discount: data.discount,
    tax: data.tax,
  });

  // Auto-generate quote number if not provided
  let quoteNumber = data.quoteNumber;
  if (!quoteNumber) {
    const settings = await db.businessSettings.findUnique({ where: { userId } });
    const prefix = settings?.quotePrefix || "Q";
    const num = settings?.nextQuoteNumber || 1;
    quoteNumber = `${prefix}-${String(num).padStart(4, "0")}`;
    await db.businessSettings.upsert({
      where: { userId },
      create: { userId, nextQuoteNumber: num + 1 },
      update: { nextQuoteNumber: num + 1 },
    });
  }

  const quote = await db.quote.create({
    data: {
      userId,
      clientId: data.clientId || null,
      projectId: data.projectId || null,
      quoteNumber,
      sessionFee: data.sessionFee,
      mediaType: data.mediaType || null,
      usageRegion: data.usageRegion || null,
      usageTerm: data.usageTerm || null,
      isBuyout: data.isBuyout,
      revisionPolicy: data.revisionPolicy || null,
      pickupPolicy: data.pickupPolicy || null,
      usageTerms: data.usageTerms || null,
      rushFee: data.rushFee,
      discount: data.discount,
      tax: data.tax,
      subtotal,
      total,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      notes: data.notes || null,
      lineItems: {
        createMany: {
          data: data.lineItems.map((item, i) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            sortOrder: i,
          })),
        },
      },
    },
  });

  await syncReminder({
    userId,
    entityType: "quote",
    entityId: quote.id,
    dueAt: data.followUpAt ? new Date(data.followUpAt) : null,
    message: `Follow up on quote ${quote.quoteNumber}`,
  });

  revalidatePath("/quotes");
  revalidatePath("/dashboard");
  redirect(`/quotes/${quote.id}`);
}

export async function updateQuote(id: string, data: {
  clientId: string;
  projectId: string;
  status: string;
  sessionFee: number;
  mediaType: string;
  usageRegion: string;
  usageTerm: string;
  isBuyout: boolean;
  revisionPolicy: string;
  pickupPolicy: string;
  usageTerms: string;
  rushFee: number;
  discount: number;
  tax: number;
  expiresAt: string;
  followUpAt: string;
  notes: string;
  lineItems: LineItemInput[];
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { subtotal, total } = calculateQuoteTotals({
    sessionFee: data.sessionFee,
    rushFee: data.rushFee,
    lineItems: data.lineItems,
    discount: data.discount,
    tax: data.tax,
  });

  // Delete existing line items and recreate
  await db.quoteLineItem.deleteMany({ where: { quoteId: id } });

  const quote = await db.quote.update({
    where: { id, userId: session.user.id },
    data: {
      clientId: data.clientId || null,
      projectId: data.projectId || null,
      status: data.status,
      sessionFee: data.sessionFee,
      mediaType: data.mediaType || null,
      usageRegion: data.usageRegion || null,
      usageTerm: data.usageTerm || null,
      isBuyout: data.isBuyout,
      revisionPolicy: data.revisionPolicy || null,
      pickupPolicy: data.pickupPolicy || null,
      usageTerms: data.usageTerms || null,
      rushFee: data.rushFee,
      discount: data.discount,
      tax: data.tax,
      subtotal,
      total,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      followUpAt: data.followUpAt ? new Date(data.followUpAt) : null,
      notes: data.notes || null,
      lineItems: {
        createMany: {
          data: data.lineItems.map((item, i) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            sortOrder: i,
          })),
        },
      },
    },
  });

  await syncReminder({
    userId: session.user.id,
    entityType: "quote",
    entityId: id,
    dueAt: data.followUpAt ? new Date(data.followUpAt) : null,
    message: `Follow up on quote ${quote.quoteNumber}`,
  });

  revalidatePath("/quotes");
  revalidatePath(`/quotes/${id}`);
  revalidatePath("/dashboard");
  redirect(`/quotes/${id}`);
}

export async function updateQuoteStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.quote.update({
    where: { id, userId: session.user.id },
    data: { status },
  });

  revalidatePath(`/quotes/${id}`);
  revalidatePath("/quotes");
}

export async function deleteQuote(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.quote.delete({ where: { id, userId: session.user.id } });
  await db.reminder.deleteMany({ where: { userId: session.user.id, entityType: "quote", entityId: id } });
  revalidatePath("/quotes");
  revalidatePath("/dashboard");
  redirect("/quotes");
}
