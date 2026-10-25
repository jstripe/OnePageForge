import fs from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

export function headingSlug(text: string): string {
  return text.replace(/\{[^}]*\}/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function LegalToc({ page }: { page: string }) {
  const src = fs.readFileSync(path.join(process.cwd(), "app", page, "page.tsx"), "utf8");
  const heads = Array.from(src.matchAll(/<h2(?: id="[^"]*")?>([^<]+)<\/h2>/g)).map((m) => m[1]);
  return (
    <nav aria-label="Table of contents" className="mt-6 rounded-2xl border border-border/60 bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On this page</p>
      <ol className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2" style={{ listStyle: "none", paddingLeft: 0 }}>
        {heads.map((h) => (
          <li key={h} className="m-0">
            <a href={`#${headingSlug(h)}`} className="inline-flex min-h-[32px] items-center text-sm">
              {h.replace(/\{s\.name\}/g, siteConfig.name)}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
