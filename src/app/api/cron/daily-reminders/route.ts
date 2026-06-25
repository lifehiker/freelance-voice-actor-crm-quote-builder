import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendDailyReminderEmail } from "@/lib/email";
import { canUseReminders } from "@/lib/permissions";
import { getPlan } from "@/lib/permissions";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Find overdue/today reminders grouped by user
  const reminders = await db.reminder.findMany({
    where: { sent: false, dueAt: { lte: todayEnd } },
    include: { user: { include: { subscription: true } } },
  });

  const byUser = new Map<string, typeof reminders>();
  for (const r of reminders) {
    const list = byUser.get(r.userId) || [];
    list.push(r);
    byUser.set(r.userId, list);
  }

  let sent = 0;
  let skipped = 0;

  for (const [userId, userReminders] of byUser) {
    const user = userReminders[0].user;
    const plan = getPlan(user.subscription);

    if (!canUseReminders(plan)) {
      skipped++;
      continue;
    }

    if (!user.email) continue;

    try {
      await sendDailyReminderEmail({
        to: user.email,
        userName: user.name || user.email,
        reminders: userReminders.map(r => ({
          type: r.entityType,
          title: r.message || `Follow-up due`,
          dueAt: r.dueAt,
          message: r.message || undefined,
        })),
      });

      await db.reminder.updateMany({
        where: { id: { in: userReminders.map(r => r.id) } },
        data: { sent: true },
      });

      sent++;
    } catch (err) {
      console.error("[reminders] Failed to send for user", userId, err);
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
