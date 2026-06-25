"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPlan, canCreateAudition } from "@/lib/permissions";
import { syncReminder } from "@/lib/reminders";

export async function createAudition(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const user = await db.user.findUnique({ where: { id: userId }, include: { subscription: true } });
  const plan = getPlan(user?.subscription);
  const count = await db.audition.count({ where: { userId } });

  if (!canCreateAudition(plan, count)) {
    throw new Error("Free plan limit reached (10 auditions). Upgrade to add more.");
  }

  const submittedAt = formData.get("submittedAt") as string;
  const callbackAt = formData.get("callbackAt") as string;
  const followUpAt = formData.get("followUpAt") as string;

  const audition = await db.audition.create({
    data: {
      userId,
      clientId: formData.get("clientId") as string || null,
      projectId: formData.get("projectId") as string || null,
      castingSource: formData.get("castingSource") as string || null,
      role: formData.get("role") as string || null,
      submittedAt: submittedAt ? new Date(submittedAt) : null,
      callbackAt: callbackAt ? new Date(callbackAt) : null,
      status: formData.get("status") as string || "planned",
      notes: formData.get("notes") as string || null,
      followUpAt: followUpAt ? new Date(followUpAt) : null,
    },
  });

  await syncReminder({
    userId,
    entityType: "audition",
    entityId: audition.id,
    dueAt: followUpAt ? new Date(followUpAt) : null,
    message: `Follow up on audition: ${audition.role || audition.castingSource || "Untitled audition"}`,
  });

  revalidatePath("/auditions");
  revalidatePath("/dashboard");
  redirect("/auditions");
}

export async function updateAudition(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const submittedAt = formData.get("submittedAt") as string;
  const callbackAt = formData.get("callbackAt") as string;
  const followUpAt = formData.get("followUpAt") as string;

  const audition = await db.audition.update({
    where: { id, userId: session.user.id },
    data: {
      clientId: formData.get("clientId") as string || null,
      projectId: formData.get("projectId") as string || null,
      castingSource: formData.get("castingSource") as string || null,
      role: formData.get("role") as string || null,
      submittedAt: submittedAt ? new Date(submittedAt) : null,
      callbackAt: callbackAt ? new Date(callbackAt) : null,
      status: formData.get("status") as string || "planned",
      notes: formData.get("notes") as string || null,
      followUpAt: followUpAt ? new Date(followUpAt) : null,
    },
  });

  await syncReminder({
    userId: session.user.id,
    entityType: "audition",
    entityId: id,
    dueAt: followUpAt ? new Date(followUpAt) : null,
    message: `Follow up on audition: ${audition.role || audition.castingSource || "Untitled audition"}`,
  });

  revalidatePath("/auditions");
  revalidatePath("/dashboard");
  redirect("/auditions");
}

export async function deleteAudition(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.audition.delete({ where: { id, userId: session.user.id } });
  await db.reminder.deleteMany({ where: { userId: session.user.id, entityType: "audition", entityId: id } });
  revalidatePath("/auditions");
  revalidatePath("/dashboard");
  redirect("/auditions");
}
