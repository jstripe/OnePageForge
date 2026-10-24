import { cn } from "@/lib/utils";

function Row({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: string }) {
  return (
    <div className="marquee">
      <ul className={cn("marquee-track", reverse && "reverse")} style={{ animationDuration: duration }}>
        {[0, 1].map((copy) =>
          items.map((t) => (
            <li
              key={`${copy}-${t}`}
              aria-hidden={copy === 1 ? true : undefined}
              className="whitespace-nowrap rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm"
            >
              {t}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export function Marquee({ rowA, rowB }: { rowA: string[]; rowB: string[] }) {
  return (
    <div className="space-y-3" role="list" aria-label="Examples of what you can make">
      <Row items={rowA} duration="50s" />
      <Row items={rowB} reverse duration="60s" />
    </div>
  );
}
