# Forge Completion Audit

## Foundation
- Next.js 16 App Router, TypeScript, Tailwind, shadcn-style UI: `package.json`, `src/app`, `src/components/ui`.
- Standalone output: `next.config.ts`.
- No Google font build dependency: verified by source search.
- Next 16 docs reviewed: App pages/layouts, route handlers, Server Actions/forms, proxy, self-hosting.

## Data/Auth
- Prisma schema covers users, subscriptions, clients, projects, auditions, quotes, line items, templates, invoices, reminders, business settings, analytics: `prisma/schema.prisma`.
- Prisma client setup uses Prisma 7 SQLite with `@prisma/adapter-better-sqlite3`: `src/lib/db.ts`, `prisma.config.ts`.
- Credential registration: `src/app/api/auth/register/route.ts`, `src/app/signup/page.tsx`.
- Credentials and guarded Google OAuth: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`.
- Route protection: `src/proxy.ts`, `src/app/(app)/layout.tsx`.

## Core App
- Dashboard metrics, recent quotes, unpaid invoices, follow-ups: `src/app/(app)/dashboard/page.tsx`.
- Client CRM: `src/app/(app)/clients/*`, `src/components/clients/ClientForm.tsx`.
- Project tracking: `src/app/(app)/projects/*`, `src/components/projects/ProjectForm.tsx`.
- Audition/submission tracker: `src/app/(app)/auditions/*`, `src/components/auditions/*`.
- Quote builder and calculations: `src/app/(app)/quotes/*`, `src/components/quotes/QuoteBuilderForm.tsx`, `src/lib/quote-calculations.ts`.
- Usage-rights templates: `src/app/(app)/settings/templates/*`, `src/lib/default-templates.ts`.
- Invoice tracking and invoice creation from accepted quotes: `src/app/(app)/invoices/*`, `src/app/(app)/invoices/actions.ts`.
- Reminder synchronization for follow-up dates: `src/lib/reminders.ts`, project/audition/quote/invoice actions.
- Free-tier limits and plan gates: `src/lib/permissions.ts`, CRUD actions, PDF watermark logic.

## APIs and Integrations
- Auth: `src/app/api/auth/[...nextauth]/route.ts`.
- Registration: `src/app/api/auth/register/route.ts`.
- Printable PDF/HTML quote export: `src/app/api/quotes/[id]/pdf/route.ts`.
- Quote export escapes user-controlled content before rendering printable HTML: `src/app/api/quotes/[id]/pdf/route.ts`.
- Stripe checkout fallback and webhook handling: `src/app/api/stripe/checkout/route.ts`, `src/app/api/webhooks/stripe/route.ts`, `src/lib/stripe.ts`.
- Reminder email fallback: `src/app/api/cron/daily-reminders/route.ts`, `src/lib/email.ts`.

## Public/SEO Pages
- Main landing: `src/app/page.tsx`.
- Pricing: `src/app/pricing/page.tsx`.
- Product landing: `src/app/voice-actor-crm/page.tsx`.
- Free tools: `src/app/tools/voice-over-usage-rate-calculator/page.tsx`, `src/app/tools/commercial-voice-over-pricing-calculator/page.tsx`, `src/app/tools/voice-over-audition-tracker/page.tsx`.
- Templates: `src/app/templates/freelance-voice-actor-quote-template/page.tsx`, `src/app/templates/voice-actor-proposal-template/page.tsx`, `src/app/templates/voice-over-invoice-template/page.tsx`, `src/app/templates/voice-over-revision-policy-template/page.tsx`.
- Guides: `src/app/guides/voice-over-usage-rights-explained/page.tsx`, `src/app/guides/voice-over-buyout-pricing-explained/page.tsx`.

## Deployment
- Docker standalone image definition with Node 20 slim, safe install, Prisma generation, runtime SQLite schema sync, and `/data/app.db` default: `Dockerfile`.
- Docker context hygiene: `.dockerignore`.
- `public/` exists and is copied by Dockerfile.
- Environment template: `.env.example`.

## Deferred External-Credential Items
- Google OAuth requires Google client credentials, but local credentials auth works without them.
- Stripe checkout/webhooks require Stripe keys and price IDs, but checkout fails gracefully without them.
- Resend reminder emails require a Resend API key and verified sender, but the cron endpoint skips email safely without them.
- Production can run on the Docker default SQLite path `file:/data/app.db`; provide `DATABASE_URL` only when using a different persistent database location.

## Verification Results
- `npm install`: passed.
- `npx prisma generate`: passed.
- `npx prisma db push`: passed; local SQLite schema already in sync.
- `npm run build`: passed.
- `npm run dev -- --hostname 0.0.0.0 --port 3001`: started successfully at `http://localhost:3001`.
- Public route smoke tests: all required public/SEO pages returned HTTP 200.
- Protected route smoke tests: app routes redirect to login when unauthenticated.
- Registration fallback: POST `/api/auth/register` returned success.
- Stripe fallback: POST `/api/stripe/checkout` returned `503` with `Stripe not configured`.
- `npm run lint`: exits 0 with zero warnings.
- Visual review: Playwright CLI screenshots captured for `/`, `/pricing`, mobile `/tools/voice-over-usage-rate-calculator`, and mobile `/signup`; reviewed for layout/overflow issues.
- Calculator implementation reviewed for client-side estimate calculation and result rendering after the Calculate action.
- `docker version`: Docker client is installed, but verification is blocked by Docker socket permission for the current user.
