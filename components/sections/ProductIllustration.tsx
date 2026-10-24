"use client";
import * as React from "react";
import { Sparkles } from "lucide-react";

export function ProductIllustration({ className = "" }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className={`${visible ? "" : "demo-paused"} ${className}`}>
      <div className="demo-float relative mx-auto max-w-3xl">
        <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.55),0_2px_0_0_hsl(0_0%_100%/0.05)_inset]">
          <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 truncate rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">siteforge.com/app</span>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-border/60 p-5 md:border-b-0 md:border-r">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Describe your business</p>
              <div className="mt-3 rounded-xl border border-border bg-background p-3 text-sm">
                <div className="flex">
                  <span className="demo-type block">Family bakery in Leeds, fresh bread daily</span>
                  <span className="demo-caret ml-0.5 inline-block w-px bg-primary" />
                </div>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">Modern</span>
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">Classic</span>
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">Bold</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Generate website (1 credit)
              </div>
            </div>
            <div className="bg-muted/40 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preview</p>
              <div className="mt-3 space-y-2.5 rounded-xl border border-border bg-background p-4">
                <div className="demo-build h-3 w-2/5 rounded bg-primary/70" />
                <div className="demo-build d2 h-2 w-full rounded bg-muted-foreground/30" />
                <div className="demo-build d2 h-2 w-4/5 rounded bg-muted-foreground/30" />
                <div className="demo-build d3 mt-3 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-md bg-primary/15" />
                  <div className="h-10 rounded-md bg-primary/15" />
                  <div className="h-10 rounded-md bg-primary/15" />
                </div>
                <div className="demo-build d3 h-6 w-1/3 rounded-md bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-xs text-muted-foreground">Illustrative example</figcaption>
    </figure>
  );
}
