import { JsonLd, breadcrumb } from "@/components/JsonLd";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumb("Refund Policy", "/refund/")} />{children}</>;
}
