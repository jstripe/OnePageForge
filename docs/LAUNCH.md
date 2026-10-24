# Launch checklist

## Fill in before the final push (all in lib/site-config.ts)
- [ ] legalEntity, legalForm, registrationNumber, registeredOffice, governingLaw (replace every `{{...}}`)
- [ ] supportEmail, supportHours, optional phone
- [ ] stripeLinks.starter, .pro, .studio (Payment Link URLs)
- [ ] social.<network>.live = true only for accounts that exist
- [ ] ADMIN_EMAILS in wrangler.jsonc
- [ ] If Stripe prices differ from $14 / $39 / $99: PLAN_CATALOG in lib/api-types.ts, plans in lib/data.ts, tests

## Stripe dashboard (per Payment Link)
- [ ] One-time price, USD, product named exactly like the plan
- [ ] After payment: redirect to https://DOMAIN/success/?session_id={CHECKOUT_SESSION_ID}
- [ ] Public business name and statement descriptor match the brand or company
- [ ] Optional webhook to https://DOMAIN/api/stripe/webhook and the STRIPE_WEBHOOK_SECRET / STRIPE_SECRET_KEY secrets

## Cloudflare (final account)
- [ ] Import the repo, build `npm run build`, deploy `npx wrangler deploy`
- [ ] Domains: DOMAIN and www.DOMAIN
- [ ] Email Routing: support@DOMAIN
- [ ] Workers AI available on the account

## Verify live
- [ ] Every page 200, http and www redirect to https://DOMAIN, /api/health, Google file 200
- [ ] Sign up, sign in, delete account
- [ ] Each buy button opens the right checkout
