import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = { title: "Contact", description: "Contact the OnePageForge team for support, billing questions or custom plans.", alternates: { canonical: "/contact/" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumb("Contact", "/contact/")} />{children}</>;
}
