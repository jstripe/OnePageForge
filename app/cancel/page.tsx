import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment cancelled", description: "Your checkout was cancelled and no payment was taken.", alternates: { canonical: "/cancel/" }, robots: { index: false } };

export default function CancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-20">
      <h1 className="font-heading text-3xl font-bold sm:text-4xl">No payment was taken</h1>
      <p className="mt-4 text-lg text-muted-foreground">You cancelled the checkout. No charge was made to your card.</p>
      <Button asChild size="lg" className="mt-8"><Link href="/pricing/">Back to pricing</Link></Button>
    </div>
  );
}
