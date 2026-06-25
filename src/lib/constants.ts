export const PROJECT_STATUSES = [
  { value: "lead", label: "Lead" },
  { value: "quoted", label: "Quoted" },
  { value: "booked", label: "Booked" },
  { value: "delivered", label: "Delivered" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid", label: "Paid" },
  { value: "lost", label: "Lost" },
];

export const AUDITION_STATUSES = [
  { value: "planned", label: "Planned" },
  { value: "submitted", label: "Submitted" },
  { value: "callback", label: "Callback" },
  { value: "booked", label: "Booked" },
  { value: "rejected", label: "Rejected" },
  { value: "no_response", label: "No Response" },
];

export const QUOTE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

export const MEDIA_TYPES = [
  { value: "web_social", label: "Web / Social Media" },
  { value: "corporate_internal", label: "Corporate / Internal" },
  { value: "elearning", label: "eLearning" },
  { value: "regional_broadcast", label: "Regional Broadcast" },
  { value: "national_broadcast", label: "National Broadcast" },
  { value: "international_broadcast", label: "International Broadcast" },
  { value: "podcast", label: "Podcast" },
  { value: "audiobook", label: "Audiobook" },
  { value: "video_game", label: "Video Game" },
  { value: "animation", label: "Animation" },
  { value: "explainer_video", label: "Explainer Video" },
  { value: "other", label: "Other" },
];

export const USAGE_REGIONS = [
  { value: "local", label: "Local" },
  { value: "regional", label: "Regional" },
  { value: "national", label: "National (US)" },
  { value: "north_america", label: "North America" },
  { value: "english_speaking_world", label: "English-Speaking World" },
  { value: "worldwide", label: "Worldwide" },
  { value: "internet_worldwide", label: "Internet / Worldwide Digital" },
];

export const USAGE_TERMS = [
  { value: "one_time", label: "One-Time Use" },
  { value: "3_months", label: "3 Months" },
  { value: "6_months", label: "6 Months" },
  { value: "1_year", label: "1 Year" },
  { value: "2_years", label: "2 Years" },
  { value: "3_years", label: "3 Years" },
  { value: "buyout_perpetual", label: "Buyout / Perpetual" },
];

export const CLIENT_SOURCES = [
  { value: "direct_email", label: "Direct Email" },
  { value: "referral", label: "Referral" },
  { value: "casting_platform", label: "Casting Platform" },
  { value: "social_media", label: "Social Media" },
  { value: "website", label: "Website" },
  { value: "community", label: "Community / Forum" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other" },
];

export const PROJECT_TYPES = [
  { value: "commercial", label: "Commercial" },
  { value: "corporate_narration", label: "Corporate Narration" },
  { value: "elearning", label: "eLearning" },
  { value: "explainer_video", label: "Explainer Video" },
  { value: "audiobook", label: "Audiobook" },
  { value: "podcast", label: "Podcast" },
  { value: "social_media", label: "Social Media" },
  { value: "video_game", label: "Video Game" },
  { value: "animation", label: "Animation / Film" },
  { value: "telephony_ivr", label: "Telephony / IVR" },
  { value: "other", label: "Other" },
];

export const PLAN_LIMITS = {
  free: {
    clients: 3,
    quotes: 3,
    auditions: 10,
    watermarkedPdf: true,
    reminders: false,
    csvExport: false,
    advancedTemplates: false,
  },
  solo: {
    clients: Infinity,
    quotes: Infinity,
    auditions: Infinity,
    watermarkedPdf: false,
    reminders: true,
    csvExport: false,
    advancedTemplates: false,
  },
  pro: {
    clients: Infinity,
    quotes: Infinity,
    auditions: Infinity,
    watermarkedPdf: false,
    reminders: true,
    csvExport: true,
    advancedTemplates: true,
  },
};

export const STRIPE_PRICES = {
  solo_monthly: process.env.STRIPE_SOLO_MONTHLY_PRICE_ID || "",
  solo_yearly: process.env.STRIPE_SOLO_YEARLY_PRICE_ID || "",
  pro_monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  pro_yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
};
