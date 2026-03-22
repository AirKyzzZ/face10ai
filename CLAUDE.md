# face10ai - Project Context

## What This Is

A SaaS web app that rates facial attractiveness using AI. Users upload a photo, the app detects the face client-side using TensorFlow.js, and returns a score out of 10. Built for deployment on Vercel.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + Framer Motion animations
- **UI**: Custom components + magic-ui effects (border-beam, marquee)
- **Auth**: NextAuth.js (credentials + Google OAuth)
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe (subscriptions: PRO/PREMIUM tiers, monthly/annual)
- **AI/ML**: TensorFlow.js + face-api.js (runs entirely in browser)
- **i18n**: next-intl (English + French)
- **Deployment**: Vercel

## Architecture

### Key Directories

```
app/[locale]/          # All pages are locale-wrapped (en/fr)
app/api/               # API routes (auth, upload, analyze, stripe webhooks, etc.)
components/            # React components
  ├── ui/              # Base UI (button, card, navigation-menu)
  ├── template/        # Landing page sections (bento-grid, marquee, Social, etc.)
  ├── pricing/         # PricingCard, PricingSection, CountdownTimer
  └── magicui/         # Visual effects (border-beam)
lib/                   # Server utilities (auth, credits, stripe, prisma, rate-limit)
messages/              # i18n translation files (en.json, fr.json)
training/              # Python scripts for model training (not part of web app)
public/models/         # TensorFlow.js model weights (beauty scoring)
```

### Data Flow

1. User uploads photo via `ImageUploader` component
2. `/api/upload` validates file, checks credits/auth, returns image data + hash
3. Client-side: face-api.js detects face, TensorFlow.js model scores attractiveness
4. `/api/analyze` saves the score to database, deducts credits
5. Result page shows score with sharing options

### Auth Model

- **Anonymous**: 1 free rating (tracked via cookie + AnonymousSession table)
- **Registered (FREE)**: 5 credits on signup
- **PRO/PREMIUM**: Subscription-based credits, reset monthly/annually
- Referral system: 10 credits per referral

### Stripe Integration

- Checkout sessions created via `/api/stripe/checkout`
- Webhook at `/api/stripe/webhook` handles: checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated, customer.subscription.deleted
- Customer portal via `/api/stripe/portal`
- Subscription sync via `/api/stripe/sync-subscription`

## Conventions

- **API errors**: Always English, JSON format `{ error: "message" }` with appropriate HTTP status
- **User-facing text**: Always use i18n keys from `messages/{locale}.json`, never hardcode strings in components
- **Database descriptions**: English (credit transaction descriptions, etc.)
- **Server Components by default**: Only use `'use client'` when interactivity is needed
- **Named exports**: Prefer named exports over default (except page components)
- **Error handling**: Fail fast with clear errors. Never swallow errors silently.

## Important Notes

- The AI scoring runs **entirely in the browser** — no server-side ML inference
- Photos are **never stored** on the server — only the hash and score are saved
- The `training/` directory contains Python scripts for model training; it's not part of the web app runtime
- Stripe webhook returns 200 even on handler errors to prevent retry storms
- Credits reset dates use UTC timestamps (not locale-dependent)

## Environment Variables

See `.env.example` for the full list. Key ones:
- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — Auth config
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` — Payments
- `STRIPE_PRO_PRICE_ID` / `STRIPE_PREMIUM_PRICE_ID` (+ annual variants) — Subscription tiers
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Optional Google OAuth

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client
npm run setup        # Download models + Prisma setup
```
