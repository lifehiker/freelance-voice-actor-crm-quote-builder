"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncReminder } from "@/lib/reminders";

export async function createInvoiceFromQuote(quoteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const quote = await db.quote.findUnique({
    where: { id: quoteId, userId },
    include: { client: true },
  });

  if (!quote) throw new Error("Quote not found");

  const settings = await db.businessSettings.findUnique({ where: { userId } });
  const prefix = settings?.invoicePrefix || "INV";
  const num = settings?.nextInvoiceNumber || 1;
  const invoiceNumber = `${prefix}-${String(num).padStart(4, "0")}`;

  await db.businessSettings.upsert({
    where: { userId },
    create: { userId, nextInvoiceNumber: num + 1 },
    update: { nextInvoiceNumber: num + 1 },
  });

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // 30 days default

  const invoice = await db.invoice.create({
    data: {
      userId,
      quoteId,
      clientId: quote.clientId,
      invoiceNumber,
      amount: quote.total,
      status: "draft",
      dueDate,
    },
  });

  await syncReminder({
    userId,
    entityType: "invoice",
    entityId: invoice.id,
    dueAt: invoice.followUpAt,
    message: `Follow up on invoice ${invoice.invoiceNumber}`,
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${invoice.id}`);
}

export async function createInvoice(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const settings = await db.businessSettings.findUnique({ where: { userId } });
  const prefix = settings?.invoicePrefix || "INV";
  const num = settings?.nextInvoiceNumber || 1;
  const invoiceNumber = formData.get("invoiceNumber") as string || `${prefix}-${String(num).padStart(4, "0")}`;

  if (!formData.get("invoiceNumber")) {
    await db.businessSettings.upsert({
      where: { userId },
      create: { userId, nextInvoiceNumber: num + 1 },
      update: { nextInvoiceNumber: num + 1 },
    });
  }

  const dueDateStr = formData.get("dueDate") as string;
  const followUpStr = formData.get("followUpAt") as string;

  const invoice = await db.invoice.create({
    data: {
      userId,
      clientId: formData.get("clientId") as string || null,
      invoiceNumber,
      amount: parseFloat(formData.get("amount") as string) || 0,
      status: formData.get("status") as string || "draft",
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      followUpAt: followUpStr ? new Date(followUpStr) : null,
      notes: formData.get("notes") as string || null,
    },
  });

  await syncReminder({
    userId,
    entityType: "invoice",
    entityId: invoice.id,
    dueAt: invoice.followUpAt,
    message: `Follow up on invoice ${invoice.invoiceNumber}`,
  });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.invoice.update({
    where: { id, userId: session.user.id },
    data: { status },
  });

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
}

export async function updateInvoiceFollowUp(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const followUpStr = formData.get("followUpAt") as string;
  const invoice = await db.invoice.update({
    where: { id, userId: session.user.id },
    data: { followUpAt: followUpStr ? new Date(followUpStr) : null },
  });

  await syncReminder({
    userId: session.user.id,
    entityType: "invoice",
    entityId: id,
    dueAt: invoice.followUpAt,
    message: `Follow up on invoice ${invoice.invoiceNumber}`,
  });

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}

export async function deleteInvoice(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.invoice.delete({ where: { id, userId: session.user.id } });
  await db.reminder.deleteMany({ where: { userId: session.user.id, entityType: "invoice", entityId: id } });
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  redirect("/invoices");
}
