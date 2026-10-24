import type { Metadata } from "next";

export const metadata: Metadata = { title: "Payment received", description: "Your SiteForge payment confirmation.", alternates: { canonical: "/success/" }, robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
