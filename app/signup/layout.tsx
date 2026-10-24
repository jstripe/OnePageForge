import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = { title: "Create an account", description: "Create a SiteForge account to buy a plan and generate your website.", alternates: { canonical: "/signup/" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumb("Create an account", "/signup/")} />{children}</>;
}
