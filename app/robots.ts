import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/app/", "/admin/", "/success/", "/cancel/", "/account/", "/login/", "/signup/", "/s/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
