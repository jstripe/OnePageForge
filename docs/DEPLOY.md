# SiteForge Deploy Guide

## Prerequisites

- Node.js 18+
- Wrangler CLI (`npm i -g wrangler`)
- Cloudflare account with Workers paid plan
- Stripe account

## Local Development

```bash
npm install
npm run dev          # Next.js on :3000
npm run worker:dev   # Worker on :8787 (needs .dev.vars)
```

Create `.dev.vars` from `.dev.vars.example`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_API_BASE=https://api.stripe.com
MOCK_AI=1
```

## Build

```bash
npm run build        # Static export to out/
```

## Deploy to Cloudflare

1. Create a D1 database:
   ```bash
   wrangler d1 create siteforge-db
   ```
2. Update `wrangler.jsonc` with the database_id.
3. Set secrets:
   ```bash
   wrangler secret put STRIPE_WEBHOOK_SECRET
   wrangler secret put STRIPE_SECRET_KEY
   ```
4. Deploy:
   ```bash
   wrangler deploy
   ```

## Test

```bash
npm run test:api     # 35 API tests
npm run test:claim   # 12 claim tests
```
