import type { Metadata } from "next";

export const metadata: Metadata = { title: "Workspace", description: "Generate and manage your websites.", alternates: { canonical: "/app/" }, robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
