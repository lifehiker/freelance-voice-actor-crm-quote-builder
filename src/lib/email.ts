// Lazy-initialize Resend inside handlers — never at module scope

export interface ReminderEmailData {
  to: string;
  userName: string;
  reminders: Array<{
    type: string;
    title: string;
    dueAt: Date;
    message?: string;
  }>;
}

export async function sendDailyReminderEmail(data: ReminderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set, skipping reminder email");
    return { ok: true, skipped: true };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const from = process.env.EMAIL_FROM || "VoiceQuote CRM <noreply@voicequotecrm.com>";

  const reminderItems = data.reminders
    .map(
      (r) =>
        `<li><strong>${r.type.toUpperCase()}</strong>: ${r.title} — Due: ${r.dueAt.toLocaleDateString()}${r.message ? ` — ${r.message}` : ""}</li>`
    )
    .join("");

  const html = `
    <h1>Your Daily Follow-Up Reminders</h1>
    <p>Hi ${data.userName},</p>
    <p>Here are your follow-ups due today:</p>
    <ul>${reminderItems}</ul>
    <p>Log in to <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">VoiceQuote CRM</a> to take action.</p>
    <p>— VoiceQuote CRM</p>
  `;

  return resend.emails.send({
    from,
    to: data.to,
    subject: `VoiceQuote CRM: ${data.reminders.length} follow-up${data.reminders.length !== 1 ? "s" : ""} due today`,
    html,
  });
}
