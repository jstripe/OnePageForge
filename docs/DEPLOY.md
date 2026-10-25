# OnePageForge deploy guide

## Local development

```bash
npm install
npm run dev            # Next.js on :3000 (front end only)
npm run build          # static export to out/
npx wrangler dev --local --port 8791   # worker + static site + local D1 (uses .dev.vars, MOCK_AI=1)
```

Create `.dev.vars` from `.dev.vars.example`. Use `--local` so the AI binding is not proxied to your Cloudflare account.

## Tests (worker must be running)

```bash
API_BASE=http://localhost:8791 npm run test:api     # 51 checks incl. the generator
API_BASE=http://localhost:8791 npm run test:claim   # 12 checks, needs STRIPE_API_BASE=http://localhost:8799 in .dev.vars
```

## Deploy (Cloudflare Workers Builds)

Workers & Pages > Create > Import a repository > pick the repo.
Build command `npm run build`, deploy command `npx wrangler deploy`, Node 22.

`wrangler.jsonc` has no `database_id` on purpose: Wrangler 4 creates the D1 database on the first deploy and finds it by name afterwards.
The schema is created lazily on the first request. Do not create the database by hand.

Settings > Domains & Routes: add the domain and www.domain (the worker redirects http and www to https on the apex).

## Stripe Payment Links

One per plan: one-time price in USD, product named exactly like the plan, correctly spelled description (for example "One-time payment, 3 months of access").
After payment, redirect to `https://onepageforge.com/success/?session_id={CHECKOUT_SESSION_ID}`.
Put each URL in `stripeLinks` in `lib/site-config.ts`. The amount must equal `PLAN_CATALOG` in `lib/api-types.ts`.

## Cleanup without cron

There is no cron trigger (Workers Free allows 5 per account). Expired sessions, rate-limit rows, old contact messages and generated sites of plans that ended more than 30 days ago are purged in the background on about 1 in 200 API requests (`worker/lib/purge.ts`).

## Secrets and variables

| Name | Where | Purpose |
|---|---|---|
| `ADMIN_EMAILS` | wrangler.jsonc vars | comma separated emails allowed into /admin |
| `STRIPE_SECRET_KEY` | Worker secret (restricted, read-only) | optional, activates plans automatically after checkout |
| `STRIPE_WEBHOOK_SECRET` | Worker secret | optional, for `checkout.session.completed` and refund events |
| `MOCK_AI` | never set in production | returns a canned page instead of calling Workers AI |

Plans are recognised by the amount paid (`PLAN_CATALOG` in `lib/api-types.ts`). Keep each Stripe price equal to `amountCents`.

## Brand and domain migration

```bash
node scripts/migrate.mjs --name "NewName" --domain newdomain.com
python3 scripts/brand-assets.py "NewName"
npm run build
```
