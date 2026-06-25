"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function createTemplate(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.usageTemplate.create({
    data: {
      userId: session.user.id,
      name: formData.get("name") as string,
      category: formData.get("category") as string || null,
      content: formData.get("content") as string,
    },
  });

  revalidatePath("/settings/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.usageTemplate.update({
    where: { id, userId: session.user.id },
    data: {
      name: formData.get("name") as string,
      category: formData.get("category") as string || null,
      content: formData.get("content") as string,
    },
  });

  revalidatePath("/settings/templates");
}

export async function deleteTemplate(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.usageTemplate.delete({ where: { id, userId: session.user.id } });
  revalidatePath("/settings/templates");
}
