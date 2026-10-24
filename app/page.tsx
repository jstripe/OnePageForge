import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, Globe, Smartphone, Palette, RefreshCw, Download, UtensilsCrossed, Briefcase, Scissors, Users, GraduationCap, Store, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { features, steps, faqs, audiences, plans, marqueeRowA, marqueeRowB } from "@/lib/data";
import { JsonLd, faqPage } from "@/components/JsonLd";
import { UseCases } from "@/components/sections/UseCases";
import { Photo } from "@/components/sections/Photo";
import { Marquee } from "@/components/sections/Marquee";
import { ProductIllustration } from "@/components/sections/ProductIllustration";
import { BuyButton } from "@/components/BuyButton";

const iconMap = { Sparkles, Globe, Smartphone, Palette, RefreshCw, Download, UtensilsCrossed, Briefcase, Scissors, Users, GraduationCap, Store } as const;

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPage(faqs)} />
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Describe your business.<br />
              <span className="text-primary">Get a website.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Enter a short description of what you do. SiteForge generates a complete, mobile-ready one-page website and hosts it for you. No builder to learn.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="text-base">
                <Link href="/app/">Create a website <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link href="/features/">Explore features</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/70 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.55)]">
              <Photo name="home-hero" alt="A small business owner working on a laptop behind a cafe counter" priority sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Built for strip */}
      <section className="border-y border-border/40 bg-card/50 px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          {audiences.map((a) => {
            const Icon = iconMap[a.icon];
            return (
              <div key={a.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-5 w-5 text-primary" />
                <span>{a.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* What you can make */}
      <section className="overflow-hidden px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">What you can make</h2>
          <p className="mt-4 text-muted-foreground">A few examples of pages and businesses the generator is built for.</p>
        </div>
        <div className="mt-10">
          <Marquee rowA={marqueeRowA} rowB={marqueeRowB} />
        </div>
      </section>

      {/* Who it is for */}
      <section className="px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Who it is for</h2>
            <p className="mt-4 text-muted-foreground">SiteForge is built for people who need a simple page online without learning a website builder.</p>
          </div>
          <div className="mt-12"><UseCases /></div>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Everything you need to go online</h2>
            <p className="mt-4 text-muted-foreground">From generation to hosting, SiteForge handles the full process so you can focus on your business.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              return (
                <div key={f.title} className="surface surface-hover group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card/50 px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Three steps to your website</h2>
            <p className="mt-4 text-muted-foreground">No design skills, no coding, no complicated builder.</p>
          </div>
          <ProductIllustration className="mt-12" />
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">{s.number}</div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">Simple, one-time pricing</h2>
            <p className="mt-4 text-muted-foreground">Pay once. No automatic renewal.</p>
            <p className="mt-2 text-sm text-muted-foreground">Prices in USD. Taxes may apply.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <div key={p.id} className={"surface relative flex flex-col " + (p.popular ? "ring-2 ring-primary" : "")}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most popular</span>}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="mt-4 font-heading text-3xl font-bold">${p.price}<span className="text-base font-normal text-muted-foreground"> / {p.period}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{p.credits} credits included</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <BuyButton plan={p.id} link={siteConfig.stripeLinks[p.id]} primary={p.popular} label="Get started" />
                </div>
              </div>
            ))}
            <div className="surface flex flex-col">
              <h3 className="text-lg font-semibold">Custom</h3>
              <p className="mt-1 text-sm text-muted-foreground">On request</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-muted-foreground">
                <li>More credits</li>
                <li>An access period that fits you</li>
                <li>Priority support</li>
              </ul>
              <div className="mt-6">
                <Button asChild size="lg" variant="outline" className="w-full"><Link href="/contact/">Contact us</Link></Button>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans, including custom plans, are one-time payments processed securely by Stripe, with no automatic renewal. See our{" "}
            <Link href="/terms/" className="underline underline-offset-4 hover:text-foreground">Terms</Link> and{" "}
            <Link href="/refund/" className="underline underline-offset-4 hover:text-foreground">Refund Policy</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-card/50 px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <details key={f.question} className="surface group">
                <summary className="flex min-h-[44px] cursor-pointer items-center justify-between text-base font-medium">
                  {f.question}
                  <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-5 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 text-center text-primary-foreground sm:p-16">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">Ready to create your website?</h2>
          <p className="mt-4 text-lg opacity-90">Starting at $14. One-time payment, no automatic renewal.</p>
          <Button asChild size="lg" className="mt-8 bg-white text-slate-900 hover:bg-white/90">
            <Link href="/app/">Create a website <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </>
  );
}
