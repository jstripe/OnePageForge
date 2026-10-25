import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Globe, Smartphone, Palette, RefreshCw, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { features } from "@/lib/data";
import { Photo } from "@/components/sections/Photo";
import { UseCases } from "@/components/sections/UseCases";
import { ProductIllustration } from "@/components/sections/ProductIllustration";

const iconMap = { Sparkles, Globe, Smartphone, Palette, RefreshCw, Download } as const;

export const metadata: Metadata = {
  title: "Features",
  description: `${siteConfig.name} features: AI website generation, hosting, multiple design styles and more.`,
  alternates: { canonical: "/features/" },
};

const comingSoon = Object.values(siteConfig.features).filter((f) => !f.live);

export default function FeaturesPage() {
  return (
    <>
      <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="grid-fade pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">Features</p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">From one sentence to a live page</h1>
            <p className="mt-6 text-lg text-muted-foreground">Describe your business, pick a style and get a complete one-page website with a hosted link. No technical knowledge needed.</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border/70 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.55)]">
              <Photo name="features-hero" alt="A woman working on a laptop in a bright room with boxes and flowers" priority sizes="(min-width: 1024px) 600px, 100vw" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-4 sm:px-6">
        <div className="mx-auto max-w-5xl"><ProductIllustration /></div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl space-y-16">
          {features.map((f, i) => {
            const Icon = iconMap[f.icon];
            const reversed = i % 2 === 1;
            return (
              <div key={f.title} className={"flex flex-col items-center gap-8 md:flex-row " + (reversed ? "md:flex-row-reverse" : "")}>
                <div className="surface flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-primary/10 p-0 shadow-[0_0_48px_-12px_hsl(var(--primary)/0.5)]">
                  <Icon className="h-16 w-16 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{f.title}</h2>
                  <p className="mt-3 text-muted-foreground">{f.description}</p>
                  <p className="mt-3 text-muted-foreground">{f.details}</p>
                  <p className="mt-3 text-sm text-muted-foreground"><span className="font-medium text-foreground">Good to know: </span>{f.limits}</p>
                  <Button asChild variant="link" className="mt-3 px-0">
                    <Link href="/app/">Try it now <ArrowRight className="ml-1 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-card/50 px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold">How a credit works</h2>
            <p className="mt-4 text-muted-foreground">{siteConfig.creditDefinition}. Plans are one-time payments with no renewal.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { t: "Buy a plan", d: "Each plan includes a set number of credits and a set number of days of access." },
              { t: "Spend one per website", d: "Every time you generate or regenerate a website, one credit is used. If a generation fails, the credit is returned." },
              { t: "Stack when you buy again", d: "Credits and access days from repeat purchases are added together." },
            ].map((x, i) => (
              <div key={x.t} className="surface surface-hover">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">{i + 1}</div>
                <h3 className="mt-4 font-semibold">{x.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold">Who it is for</h2>
            <p className="mt-4 text-muted-foreground">One-page websites for local businesses and independent professionals.</p>
          </div>
          <div className="mt-10"><UseCases /></div>
        </div>
      </section>

      {comingSoon.length > 0 && (
        <section className="bg-card/50 px-5 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold">Roadmap</h2>
            <p className="mt-4 text-muted-foreground">These features are not available yet and are not part of any plan.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {comingSoon.map((f) => (
                <div key={f.name} className="surface text-left">
                  <p className="font-medium">{f.name} <span className="text-xs text-muted-foreground">(coming soon)</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
