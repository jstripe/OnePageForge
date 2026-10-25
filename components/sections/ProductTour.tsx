"use client";
import * as React from "react";
import { Check, Link2, PencilLine, Sparkles } from "lucide-react";

const tabs = [
  { id: "describe", label: "1. Describe", icon: PencilLine, text: "Write a few sentences about your business and choose a style." },
  { id: "generate", label: "2. Generate", icon: Sparkles, text: "One credit is used and the AI writes your complete one-page website." },
  { id: "share", label: "3. Share", icon: Link2, text: "Open your live link, send it to anyone, or download the HTML file." },
] as const;

function Panel({ id }: { id: (typeof tabs)[number]["id"] }) {
  if (id === "describe")
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-background p-3 text-sm text-muted-foreground">Family bakery in Leeds, fresh bread and cakes baked every morning.</div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Modern</span>
          <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">Classic</span>
          <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">Bold</span>
        </div>
      </div>
    );
  if (id === "generate")
    return (
      <div className="space-y-2.5 rounded-xl border border-border bg-background p-4">
        <div className="h-3 w-2/5 rounded bg-primary/70" />
        <div className="h-2 w-full rounded bg-muted-foreground/30" />
        <div className="h-2 w-4/5 rounded bg-muted-foreground/30" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-md bg-primary/15" />)}
        </div>
        <div className="h-6 w-1/3 rounded-md bg-primary" />
      </div>
    );
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-sm">
        <Link2 className="h-4 w-4 text-primary" /> <span className="truncate text-muted-foreground">your-business-link</span>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {["Open it in any browser", "Send it in a message or add it to your bio", "Download the HTML to host it elsewhere"].map((t) => (
          <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProductTour() {
  const [active, setActive] = React.useState<(typeof tabs)[number]["id"]>("describe");
  const current = tabs.find((t) => t.id === active)!;
  return (
    <div className="mx-auto max-w-4xl">
      <div role="tablist" aria-label="Product tour" className="flex flex-col gap-2 sm:flex-row">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tour-${t.id}`}
            aria-selected={active === t.id}
            aria-controls="tour-panel"
            onClick={() => setActive(t.id)}
            className={"flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors " + (active === t.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground")}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>
      <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-${active}`} className="surface mt-4 grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="text-lg font-semibold">{current.label.slice(3)}</h3>
          <p className="mt-2 text-muted-foreground">{current.text}</p>
        </div>
        <div className="min-h-[170px]"><Panel id={active} /></div>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Illustrative example</p>
    </div>
  );
}
