import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = { title: "Log in", description: "Log in to your SiteForge account.", alternates: { canonical: "/login/" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumb("Log in", "/login/")} />{children}</>;
}
