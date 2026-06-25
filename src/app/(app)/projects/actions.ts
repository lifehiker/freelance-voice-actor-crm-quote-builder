"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { syncReminder } from "@/lib/reminders";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const dueDateStr = formData.get("dueDate") as string;
  const followUpStr = formData.get("followUpAt") as string;

  const project = await db.project.create({
    data: {
      userId,
      name: formData.get("name") as string,
      clientId: formData.get("clientId") as string || null,
      type: formData.get("type") as string || null,
      status: formData.get("status") as string || "lead",
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      followUpAt: followUpStr ? new Date(followUpStr) : null,
      notes: formData.get("notes") as string || null,
    },
  });

  await syncReminder({
    userId,
    entityType: "project",
    entityId: project.id,
    dueAt: followUpStr ? new Date(followUpStr) : null,
    message: `Follow up on project: ${project.name}`,
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const dueDateStr = formData.get("dueDate") as string;
  const followUpStr = formData.get("followUpAt") as string;

  const project = await db.project.update({
    where: { id, userId: session.user.id },
    data: {
      name: formData.get("name") as string,
      clientId: formData.get("clientId") as string || null,
      type: formData.get("type") as string || null,
      status: formData.get("status") as string || "lead",
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      followUpAt: followUpStr ? new Date(followUpStr) : null,
      notes: formData.get("notes") as string || null,
    },
  });

  await syncReminder({
    userId: session.user.id,
    entityType: "project",
    entityId: id,
    dueAt: followUpStr ? new Date(followUpStr) : null,
    message: `Follow up on project: ${project.name}`,
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  revalidatePath("/dashboard");
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await db.project.delete({ where: { id, userId: session.user.id } });
  await db.reminder.deleteMany({ where: { userId: session.user.id, entityType: "project", entityId: id } });
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}
