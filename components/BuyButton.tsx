"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkoutUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { PlanId } from "@/lib/api-types";

function BuyButtonInner({ plan, link, primary, label = "Get started" }: { plan: PlanId; link: string; primary?: boolean; label?: string }) {
  const { status, user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const [going, setGoing] = React.useState(false);
  const fired = React.useRef(false);
  const variant = primary ? "default" : "accent";

  const go = React.useCallback(() => {
    if (!user || !link) return;
    setGoing(true);
    window.location.href = checkoutUrl(link, user);
  }, [user, link]);

  React.useEffect(() => {
    if (fired.current || !link || status !== "in" || params.get("buy") !== plan) return;
    fired.current = true;
    router.replace(window.location.pathname, { scroll: false });
    go();
  }, [status, params, plan, link, go, router]);

  if (!link) {
    return <Button size="lg" variant="outline" className="w-full" disabled title="Checkout opens soon. Contact us to buy now.">Checkout opens soon</Button>;
  }
  if (status === "in") {
    return (
      <Button size="lg" className="w-full" variant={variant} onClick={go} disabled={going} aria-busy={going}>
        {going && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{going ? "Opening checkout..." : label}
      </Button>
    );
  }
  return <Button asChild size="lg" className="w-full" variant={variant}><a href={link}>{label}</a></Button>;
}

type Props = React.ComponentProps<typeof BuyButtonInner>;
export function BuyButton(props: Props) {
  return (
    <React.Suspense fallback={<Button size="lg" variant="outline" className="w-full" disabled aria-hidden>{props.label ?? "Get started"}</Button>}>
      <BuyButtonInner {...props} />
    </React.Suspense>
  );
}
