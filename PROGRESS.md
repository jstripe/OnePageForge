# Progress

Brand: OnePageForge (onepageforge.com). Repo: jstripe/OnePageForge (origin). Test repo: mahdi055/siteforge (old-test).

- [x] Phase 0 Brief (PROJECT-BRIEF.md)
- [x] Phase 1 Build (worker, auth, billing claim, admin, contact, AI generator, all pages)
- [x] Phase 2 Copy, claims, design (marquee, illustrated heroes, depth, dark and light mode with toggle)
- [x] Phase 3 Footer and page list (validated footer, only footer pages plus functional pages)
- [x] Phase 4 Assets, sections, SEO, Google file, legal pages, logo (Pexels AVIF/WebP, JSON-LD, favicons, OG)
- [x] STOP 1 Test repo and deploy (mahdi055/siteforge, deployed on the test Cloudflare)
- [x] Phase 5 Mobile, speed, functional check (Lighthouse mobile 95-99, no layout shift, 44px targets)
- [x] Phase 6 Local pre-audit against the playbook (2026-10-25, see below)
- [x] STOP 2 Migration (renamed to OnePageForge, pushed to jstripe)
- [x] STOP 3 Final Cloudflare deploy (https://onepageforge.stripecloudflare.workers.dev)
- [ ] Phase 7 Live Stripe audit on the real domain (after domain is connected)
- [ ] STOP 4 Company details and Payment Links (04-final-launch-prompt.md)

## Deliberate deviations from the playbook
- No daily cron: the account is on Workers Free (5 cron limit). Cleanup runs in the background on about 1 in 200 API requests (worker/lib/purge.ts) and also deletes generated sites 30 days after a plan ends.
- Animations are CSS and IntersectionObserver based, not Framer Motion LazyMotion (smaller bundle, reduced motion respected). framer-motion is still listed in package.json but unused.
- Legal table of contents is built at build time from the page headings (components/LegalToc.tsx).

## Tests (2026-10-25)
- scripts/test-api.mjs 52 passed, scripts/test-claim.mjs 12 passed, worker typecheck clean
- Real Workers AI generation verified end to end (about 10 s, valid responsive HTML, no invented contact details)
- Banned-word scan on out/: only "no subscription" sentences remain

## Pending (STOP 4)
- Company details in lib/site-config.ts (all {{...}} placeholders)
- Stripe Payment Links in stripeLinks and PLAN_CATALOG amounts if they differ
- Social accounts (live flags), ADMIN_EMAILS, activation mode (automatic or by hand)
- Dashboard: Payment Link redirect, STRIPE_SECRET_KEY secret, Email Routing for support@onepageforge.com, domains
