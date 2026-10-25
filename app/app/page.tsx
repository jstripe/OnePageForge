"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ExternalLink, Trash2, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ApiException, API_BASE } from "@/lib/api";
import { refreshAuth, useAuth } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";
import type { GeneratedSite, SiteListItem } from "@/lib/api-types";

const STYLES = [
  { id: "modern", name: "Modern", desc: "Clean, minimal, blue accents" },
  { id: "classic", name: "Classic", desc: "Warm, elegant, professional" },
  { id: "bold", name: "Bold", desc: "Dark, vibrant, high-contrast" },
];

export default function AppPage() {
  const { status, entitlement } = useAuth();
  const router = useRouter();
  const [description, setDescription] = React.useState("");
  const [style, setStyle] = React.useState("modern");
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState("");
  const [preview, setPreview] = React.useState<GeneratedSite | null>(null);
  const [sites, setSites] = React.useState<SiteListItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (status === "out") router.replace("/login/?next=/app/");
    if (status === "in") {
      api.listSites().then((r) => setSites(r.sites)).catch(() => {}).finally(() => setLoading(false));
    }
  }, [status, router]);

  const active = entitlement?.active;

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    setGenerating(true); setError(""); setPreview(null);
    try {
      const site = await api.generate(description, style);
      setPreview(site);
      setSites((prev) => [{ id: site.id, description: site.description, style: site.style, slug: site.slug, createdAt: site.createdAt }, ...prev]);
      void refreshAuth();
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Generation failed. Please try again.");
    }
    setGenerating(false);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this website? This cannot be undone.")) return;
    try {
      await api.deleteSite(id);
      setSites((prev) => prev.filter((s) => s.id !== id));
      if (preview?.id === id) setPreview(null);
    } catch { /* ignore */ }
  }

  async function onView(id: string) {
    try {
      const site = await api.getSite(id);
      setPreview(site);
    } catch { /* ignore */ }
  }

  if (status !== "in") {
    return <div className="grid min-h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!active) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:py-20">
        <h1 className="font-heading text-3xl font-bold">You need a plan to create websites</h1>
        <p className="mt-4 text-muted-foreground">Buy a plan to get credits and start generating websites.</p>
        <Button asChild size="lg" className="mt-8"><Link href="/pricing/">See plans</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Create a website</h1>
        <div className="text-sm text-muted-foreground">
          {entitlement.creditsLeft} credit{entitlement.creditsLeft !== 1 ? "s" : ""} left
        </div>
      </div>

      <form onSubmit={onGenerate} className="mt-8 surface space-y-4">
        <label className="grid gap-1 text-sm font-medium">
          Describe your business
          <textarea
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base sm:text-sm"
            placeholder="Example: A cozy Italian restaurant in Brooklyn called Bella Vita, specializing in handmade pasta and wood-fired pizza. Family-owned since 2024."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div>
          <p className="text-sm font-medium">Design style</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={"rounded-xl border px-4 py-2 text-sm transition-colors " + (style === s.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50")}
              >
                <span className="font-medium">{s.name}</span>
                <span className="ml-1 text-xs text-muted-foreground">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <Button type="submit" size="lg" disabled={generating || entitlement.creditsLeft === 0}>
          {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Plus className="h-4 w-4" /> Generate website (1 credit)</>}
        </Button>
      </form>

      {preview && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <a href={`${API_BASE || ""}/s/${preview.slug}`} target="_blank" rel="noopener"><ExternalLink className="mr-1 h-4 w-4" /> Open live link</a>
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                const blob = new Blob([preview.html], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${preview.slug}.html`; a.click();
                URL.revokeObjectURL(url);
              }}>
                <Download className="mr-1 h-4 w-4" /> Download HTML
              </Button>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border">
            <iframe srcDoc={preview.html} className="h-[600px] w-full" title="Website preview" sandbox="allow-scripts" />
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-xl font-semibold">Your websites</h2>
        {loading ? (
          <div className="mt-4 grid place-items-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : sites.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No websites generated yet. Describe your business above to create your first one.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {sites.map((s) => (
              <div key={s.id} className="surface flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{s.description.slice(0, 80)}</p>
                  <p className="text-xs text-muted-foreground">{s.style} · {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => onView(s.id)}>View</Button>
                  <Button size="sm" variant="outline" onClick={() => { setDescription(s.description); setStyle(s.style); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => onDelete(s.id)} className="text-red-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
