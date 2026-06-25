# VoiceQuote CRM

VoiceQuote CRM is a Next.js SaaS app for freelance voice actors. It combines client CRM, project tracking, audition tracking, voice-over quote building, usage-rights templates, printable quote export, invoice records, and follow-up reminders.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn-style UI components
- Prisma 7 with SQLite via `@prisma/adapter-better-sqlite3`
- Auth.js/NextAuth v5 credentials auth with guarded Google OAuth support
- Stripe and Resend integrations with missing-credential fallbacks

## Local Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The app defaults to `DATABASE_URL=file:./dev.db` when no database URL is provided.

## Verification

```bash
npm run lint
npm run build
```

For Docker deployment, the app uses standalone Next.js output and initializes the SQLite schema at container startup.

```bash
docker build .
```

## Environment

Copy `.env.example` for local or production configuration. The app runs without third-party credentials; Stripe checkout and Resend reminder emails return safe fallback behavior until credentials are configured.
