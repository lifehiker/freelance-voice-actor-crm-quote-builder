# Human Input Needed

The app runs locally and builds without these credentials. Provide them for production integrations.

## Authentication
- `AUTH_SECRET`: Generate a strong Auth.js secret for production.
- `NEXTAUTH_URL`: Set to the production app URL.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Required to enable Google OAuth login. Without these, email/password registration and login still work.

## Database
- `DATABASE_URL`: Optional. The Docker image defaults to `file:/data/app.db`, and local development falls back to `file:./dev.db`. Set this only if you want a different persistent SQLite file path.

## Stripe Subscriptions
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SOLO_MONTHLY_PRICE_ID`
- `STRIPE_SOLO_YEARLY_PRICE_ID`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`

Without these, checkout returns a graceful "Stripe not configured" response and the app remains usable on the free plan.

## Email Reminders
- `RESEND_API_KEY`
- `EMAIL_FROM`: A verified sender such as `VoiceQuote CRM <noreply@yourdomain.com>`.
- `NEXT_PUBLIC_APP_URL`: Used in reminder email links.

Without Resend credentials, the reminder cron skips email sending safely.

## Cron
- `CRON_SECRET`: Optional but recommended. If set, call `/api/cron/daily-reminders` with `Authorization: Bearer <CRON_SECRET>`.

## Deployment
- Docker build could not be verified in this environment because the current user cannot access `/var/run/docker.sock`. Run `docker build .` from a shell with Docker permissions before deploying.
