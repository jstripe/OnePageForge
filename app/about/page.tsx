import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name}: an AI website generator for local businesses and freelancers.`,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <div className="px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">About {siteConfig.name}</h1>
        <p className="mt-6 text-lg text-muted-foreground">We believe every business deserves a professional online presence, regardless of technical skill or budget.</p>

        <div className="mt-10 space-y-6 text-muted-foreground">
          <p>{siteConfig.name} is a new product that launched in {siteConfig.launchMonth}. We built it because too many small businesses, freelancers and local shops still do not have a website, not because they do not want one, but because existing tools are too complicated, too expensive or take too long to learn.</p>
          <p>Our approach is simple: describe your business in a few words, and AI generates a complete, mobile-ready one-page website that is hosted and ready to share. No builder to learn, no templates to customise, no code to write.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Launched", value: siteConfig.launchMonth },
            { label: "Support", value: siteConfig.supportHours },
            { label: "Formats", value: "HTML download" },
            { label: "Websites kept", value: "Access period + 30 days" },
          ].map((f) => (
            <div key={f.label} className="surface">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</p>
              <p className="mt-1 font-semibold">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{siteConfig.name} is a product of {siteConfig.legalEntity}.</p>

        <div className="mt-12">
          <h2 className="text-2xl font-bold">Our values</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              { title: "Honest claims", desc: "We only describe what the product does today. Features that are not ready are clearly marked as coming soon." },
              { title: "You stay in control", desc: "Your data belongs to you. Download your website as HTML and host it anywhere. Delete your account and we remove everything." },
              { title: "Privacy first", desc: "We do not use your content to train our own models. We collect only the data we need to run the service." },
              { title: "Fair pricing", desc: "One-time payments, no automatic renewal, no hidden fees. You know what you pay and what you get." },
            ].map((v) => (
              <div key={v.title} className="surface">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
