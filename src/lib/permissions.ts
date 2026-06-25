import { PLAN_LIMITS } from "./constants";

type Plan = "free" | "solo" | "pro";

export function getPlan(subscription: { plan: string } | null | undefined): Plan {
  if (!subscription) return "free";
  if (subscription.plan === "solo") return "solo";
  if (subscription.plan === "pro") return "pro";
  return "free";
}

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan];
}

export function canCreateClient(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.clients;
}

export function canCreateQuote(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.quotes;
}

export function canCreateAudition(plan: Plan, currentCount: number): boolean {
  const limits = getPlanLimits(plan);
  return currentCount < limits.auditions;
}

export function canExportPdf(): boolean {
  return true; // All plans can export, free gets watermark
}

export function pdfHasWatermark(plan: Plan): boolean {
  return getPlanLimits(plan).watermarkedPdf;
}

export function canUseReminders(plan: Plan): boolean {
  return getPlanLimits(plan).reminders;
}

export function canExportCsv(plan: Plan): boolean {
  return getPlanLimits(plan).csvExport;
}
