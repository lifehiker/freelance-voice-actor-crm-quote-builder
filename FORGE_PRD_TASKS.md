# FORGE PRD Tasks

Implementation order: foundation -> data/auth -> core workflows -> secondary workflows -> marketing/pages -> deployment -> QA.

## Foundation
- [x] Read `PRD.md` end-to-end.
- [x] Read `BUILD_INSTRUCTIONS.md` end-to-end.
- [x] Read relevant local Next.js 16 docs in `node_modules/next/dist/docs/` for App Router pages, route handlers, Server Actions/forms, proxy, and self-hosting.
- [x] Confirm `next.config.ts` uses `output: "standalone"`.
- [x] Verify no `next/font/google` or remote font dependency is used.
- [x] App shell, navigation, responsive layout, empty states, and UI components are implemented.
- [x] Metadata and SEO-safe route structure are implemented for public pages.

## Data Model
- [x] User model with profile/account fields and password fallback.
- [x] Subscription model for free/solo/pro state.
- [x] Client model with name, company, email, phone, website, notes, source.
- [x] Project model linked to clients with status, due date, notes, follow-up.
- [x] Audition model linked to client/project with casting source, role, submitted/callback dates, status, notes, follow-up.
- [x] Quote model with VO usage fields, fees, policies, totals, expiration, follow-up.
- [x] QuoteLineItem model for editable quote lines.
- [x] UsageTemplate model for reusable usage/revision/buyout wording.
- [x] Invoice model from quote/client with status, issue/due dates, amount, follow-up.
- [x] Reminder model for daily digest.
- [x] BusinessSettings model for branding, numbering, defaults.
- [x] AnalyticsEvent model for simple event logging fallback.
- [x] Prisma client generation verified with `npx prisma generate` after dependency install.

## Auth
- [x] Credential registration/login fallback for local operation.
- [x] Google OAuth provider is guarded by env vars and maps OAuth users into the local database.
- [x] Protected authenticated app routes redirect unauthenticated users to `/login`.
- [x] Current-user helpers and unauthorized guards are implemented.
- [x] Basic account/profile/business settings UI is implemented.

## Core App Pages
- [x] `/dashboard`: metrics, upcoming follow-ups, recent quotes, open auditions, unpaid invoices.
- [x] `/clients`: list, create, edit, delete clients.
- [x] `/clients/new`: client creation.
- [x] `/clients/[id]`: detail/edit/delete and related records.
- [x] `/projects`: list and status overview.
- [x] `/projects/new`: project creation.
- [x] `/projects/[id]`: project detail/edit/delete.
- [x] `/auditions`: tracker list with statuses.
- [x] `/auditions/new`: audition creation and edit via query parameter.
- [x] `/quotes`: quote list and status workflow.
- [x] `/quotes/new`: guided VO quote builder.
- [x] `/quotes/[id]`: quote detail, edit, status changes, invoice creation, PDF export link.
- [x] `/invoices`: invoice tracking list.
- [x] `/invoices/[id]`: invoice detail/status/follow-up management.
- [x] `/settings`: account branding and numbering fields.
- [x] `/settings/templates`: reusable usage-rights templates.

## API Routes / Server Actions
- [x] Auth route handler.
- [x] Registration route handler.
- [x] Client CRUD server actions.
- [x] Project CRUD server actions.
- [x] Audition CRUD server actions.
- [x] Quote create/update/delete/status/invoice server actions.
- [x] Invoice update/delete/follow-up server actions.
- [x] Template create/delete server actions.
- [x] PDF quote export route.
- [x] Daily reminders cron route with Resend fallback.
- [x] Stripe checkout route with missing-env fallback.
- [x] Stripe webhook route with missing-env fallback.
- [x] Analytics/event model is present for safe local logging.

## Core Workflows
- [x] Register/login, then reach dashboard.
- [x] Add business info and quote branding.
- [x] Create/edit/delete client.
- [x] Create/edit/delete project linked to client.
- [x] Create/edit/delete audition and track callback/status.
- [x] Build quote with session fee, media type, region, term, buyout, policies, rush fee, line items, discount, tax.
- [x] Insert reusable usage-rights template into a quote.
- [x] Calculate quote subtotal/total.
- [x] Export quote as client-facing printable HTML/PDF route with required fields and free-plan watermark.
- [x] Mark quote accepted and create invoice.
- [x] Track invoice statuses draft/sent/paid/overdue.
- [x] Add follow-up dates to quote/project/audition/invoice and surface due reminders.
- [x] Enforce free-tier limits: 3 clients, 3 quotes, 10 auditions, watermarked PDF, no reminder emails.
- [x] Solo/Pro subscription state is supported and Stripe falls back gracefully without credentials.

## Billing, Email, Storage, Integrations
- [x] Stripe subscription checkout for Solo/Pro monthly/yearly, guarded without credentials.
- [x] Stripe webhook updates subscription state, guarded without credentials.
- [x] Resend daily reminder email, skipped safely without credentials.
- [x] Local SQLite persistence fallback for development/build via Prisma 7 `@prisma/adapter-better-sqlite3`.
- [x] Required external credentials documented in `HUMAN_INPUT_NEEDED.md`.

## Marketing / SEO Pages
- [x] `/`: landing page with VO-specific value proposition.
- [x] `/pricing`: Free/Solo/Pro pricing.
- [x] `/login` and `/signup`.
- [x] `/voice-actor-crm`.
- [x] `/tools/voice-over-usage-rate-calculator` with disclaimer and CTA.
- [x] `/tools/commercial-voice-over-pricing-calculator` with disclaimer and CTA.
- [x] `/tools/voice-over-audition-tracker` with CTA.
- [x] `/templates/freelance-voice-actor-quote-template` copyable template.
- [x] `/templates/voice-actor-proposal-template`.
- [x] `/templates/voice-over-invoice-template`.
- [x] `/templates/voice-over-revision-policy-template`.
- [x] `/guides/voice-over-usage-rights-explained`.
- [x] `/guides/voice-over-buyout-pricing-explained`.
- [x] Schema-friendly metadata and calculator/template disclaimers.

## Docker / Deploy
- [x] Production-ready `Dockerfile` using standalone output.
- [x] Dockerfile uses Node 20 slim, safe `npm ci --ignore-scripts`, Prisma generation after source copy, and runtime `prisma db push`.
- [x] Dockerfile copies only existing directories/files required for runtime (`public`, `prisma`, `.next/standalone`, `.next/static`, `node_modules`).
- [x] `.dockerignore` excludes env files and build artifacts.
- [x] `docker build .` attempted; blocked by local Docker socket permission.

## Verification
- [x] `npm run build` passes after `npx prisma generate`.
- [x] Dev server starts at `http://localhost:3001`.
- [x] Public routes smoke-tested with HTTP 200.
- [x] Protected app routes redirect to login when unauthenticated.
- [x] Registration fallback tested successfully via `POST /api/auth/register`.
- [x] Stripe missing-env fallback tested successfully via `POST /api/stripe/checkout`.
- [x] `npm run lint` exits successfully with zero warnings.
- [x] Visual/UI review performed with Playwright CLI screenshots for landing, pricing, mobile calculator, and mobile signup pages.
- [x] Interactive checks performed for public navigation targets, protected redirects, registration fallback, calculator implementation, and Stripe fallback.
- [x] `FORGE_COMPLETION_AUDIT.md` created.
