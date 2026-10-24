import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Careers",
  description: `Careers at ${siteConfig.name}. No open positions right now.`,
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <div className="px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Careers</h1>
        <p className="mt-6 text-lg text-muted-foreground">There are no open roles right now.</p>
        <p className="mt-4 text-muted-foreground">If you are interested in working with us in the future, send us a message at{" "}
          <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary underline underline-offset-4">{siteConfig.supportEmail}</a>{" "}
          or use our <Link href="/contact/" className="text-primary underline underline-offset-4">contact form</Link>.
        </p>
      </div>
    </div>
  );
}
