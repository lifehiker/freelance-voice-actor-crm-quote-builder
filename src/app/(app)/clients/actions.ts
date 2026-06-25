"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlan, canCreateClient } from "@/lib/permissions";

export async function createClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  const plan = getPlan(user?.subscription);
  const clientCount = await db.client.count({ where: { userId } });

  if (!canCreateClient(plan, clientCount)) {
    throw new Error(`Free plan limit reached (3 clients). Upgrade to add more.`);
  }

  const client = await db.client.create({
    data: {
      userId,
      name: formData.get("name") as string,
      company: formData.get("company") as string || null,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      website: formData.get("website") as string || null,
      source: formData.get("source") as string || null,
      notes: formData.get("notes") as string || null,
    },
  });

  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClient(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.client.update({
    where: { id, userId: session.user.id },
    data: {
      name: formData.get("name") as string,
      company: formData.get("company") as string || null,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      website: formData.get("website") as string || null,
      source: formData.get("source") as string || null,
      notes: formData.get("notes") as string || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function deleteClient(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.client.delete({ where: { id, userId: session.user.id } });
  revalidatePath("/clients");
  redirect("/clients");
}
