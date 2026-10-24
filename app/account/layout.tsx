import type { Metadata } from "next";

export const metadata: Metadata = { title: "Account", description: "Manage your SiteForge account and plan.", alternates: { canonical: "/account/" }, robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
