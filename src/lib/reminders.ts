import { db } from "@/lib/db";

type ReminderEntityType = "quote" | "project" | "audition" | "invoice";

export async function syncReminder(params: {
  userId: string;
  entityType: ReminderEntityType;
  entityId: string;
  dueAt: Date | null;
  message: string;
}) {
  await db.reminder.deleteMany({
    where: {
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
    },
  });

  if (!params.dueAt) return;

  await db.reminder.create({
    data: {
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
      dueAt: params.dueAt,
      message: params.message,
    },
  });
}
