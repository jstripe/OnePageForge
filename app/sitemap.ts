import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const base = siteConfig.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/features/", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/pricing/", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about/", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/careers/", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/contact/", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/login/", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/signup/", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms/", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy/", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/refund/", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/security/", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/cookies/", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  return pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
