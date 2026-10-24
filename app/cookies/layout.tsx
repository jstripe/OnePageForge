import { JsonLd, breadcrumb } from "@/components/JsonLd";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><JsonLd data={breadcrumb("Cookie Policy", "/cookies/")} />{children}</>;
}
