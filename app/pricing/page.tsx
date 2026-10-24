import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BuyButton } from "@/components/BuyButton";
import { siteConfig } from "@/lib/site-config";
import { plans, faqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Pricing",
  description: `${siteConfig.name} pricing: one-time plans starting at $14. No subscription, no renewal.`,
  alternates: { canonical: "/pricing/" },
};

const liveFeatures = Object.values(siteConfig.features).filter((f) => f.live);
const comingSoon = Object.values(siteConfig.features).filter((f) => !f.live);
const billingFaqs = faqs.filter((f) => f.question.toLowerCase().includes("credit") || f.question.toLowerCase().includes("renew") || f.question.toLowerCase().includes("refund") || f.question.toLowerCase().includes("run out"));

export default function PricingPage() {
  return (
    <>
      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Simple, one-time pricing</h1>
            <p className="mt-4 text-lg text-muted-foreground">Pay once. No automatic renewal.</p>
            <p className="mt-2 text-sm text-muted-foreground">Prices in USD. Taxes may apply.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => (
              <div key={p.id} className={"surface relative flex flex-col " + (p.popular ? "ring-2 ring-primary" : "")}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most popular</span>}
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="mt-4 font-heading text-3xl font-bold">${p.price}<span className="text-base font-normal text-muted-foreground"> / {p.period}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">{p.credits} credits included</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{f}</span></li>
                  ))}
                </ul>
                <div className="mt-6">
                  <BuyButton plan={p.id} link={siteConfig.stripeLinks[p.id]} primary={p.popular} />
                </div>
              </div>
            ))}
            <div className="surface flex flex-col">
              <h2 className="text-lg font-semibold">Custom</h2>
              <p className="mt-1 text-sm text-muted-foreground">On request</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-muted-foreground"><li>More credits</li><li>An access period that fits you</li><li>Priority support</li></ul>
              <div className="mt-6"><Button asChild size="lg" variant="outline" className="w-full"><Link href="/contact/">Contact us</Link></Button></div>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            All plans, including custom plans, are one-time payments processed securely by Stripe, with no automatic renewal. See our{" "}
            <Link href="/terms/" className="underline underline-offset-4 hover:text-foreground">Terms</Link> and{" "}
            <Link href="/refund/" className="underline underline-offset-4 hover:text-foreground">Refund Policy</Link>.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-card/50 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-3xl font-bold">Compare plans</h2>
          <p className="mt-4 text-center text-xs text-muted-foreground sm:hidden">Swipe sideways to see every plan</p>
          <div className="mt-4 overflow-x-auto sm:mt-8">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="sticky left-0 bg-card/50 p-3 font-medium">&nbsp;</th>
                  {plans.map((p) => <th key={p.id} className="p-3 font-semibold">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><th scope="row" className="sticky left-0 bg-card/50 p-3 text-left font-medium">Price (one-time)</th>{plans.map((p) => <td key={p.id} className="p-3">${p.price}</td>)}</tr>
                <tr className="border-b"><th scope="row" className="sticky left-0 bg-card/50 p-3 text-left font-medium">Access period</th>{plans.map((p) => <td key={p.id} className="p-3">{p.period}</td>)}</tr>
                <tr className="border-b"><th scope="row" className="sticky left-0 bg-card/50 p-3 text-left font-medium">Credits included</th>{plans.map((p) => <td key={p.id} className="p-3">{p.credits}</td>)}</tr>
                {liveFeatures.map((f) => (
                  <tr key={f.name} className="border-b">
                    <th scope="row" className="sticky left-0 bg-card/50 p-3 text-left font-medium">{f.name}</th>
                    {plans.map((p) => <td key={p.id} className="p-3"><Check className="h-4 w-4 text-primary" /></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {comingSoon.length > 0 && (
        <section className="px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-2xl font-bold">Roadmap</h2>
            <p className="mt-3 text-muted-foreground">Not available yet and not part of any plan.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {comingSoon.map((f) => (
                <span key={f.name} className="rounded-full border border-border/60 px-4 py-2 text-sm text-muted-foreground">{f.name} <span className="text-xs">(coming soon)</span></span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Billing FAQ */}
      <section className="bg-card/50 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-heading text-2xl font-bold">Billing FAQ</h2>
          <div className="mt-8 space-y-4">
            {billingFaqs.map((f) => (
              <details key={f.question} className="surface group">
                <summary className="min-h-[44px] flex cursor-pointer items-center justify-between font-medium">{f.question}<span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
              </details>
            ))}
            <details className="surface group">
              <summary className="min-h-[44px] flex cursor-pointer items-center justify-between font-medium">What payment methods do you accept?<span className="ml-2 text-muted-foreground transition-transform group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm text-muted-foreground">Payments are processed by Stripe. Stripe shows the available payment methods at checkout, which typically include cards (Visa, Mastercard, American Express) and other methods depending on your location.</p>
            </details>
          </div>
          <div className="mt-10 text-center">
            <p className="text-muted-foreground">Need more?</p>
            <Button asChild variant="outline" size="lg" className="mt-3"><Link href="/contact/">Contact us for a custom plan</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
