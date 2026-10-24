"use client";
import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
const refundWaiverText = siteConfig.refundWaiver;
import { PLAN_CATALOG } from "@/lib/api-types";
import { formatDate, refreshAuth, setSession, useAuth } from "@/lib/auth";
import { api, ApiException } from "@/lib/api";
import { Button } from "@/components/ui/button";

function sessionIdFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("session_id") || "";
}

export function SuccessView() {
  const { status, entitlement } = useAuth();
  const active = !!entitlement?.active;
  const [sessionId, setSessionId] = React.useState("");
  const [state, setState] = React.useState<"idle" | "claiming" | "error">("idle");
  const [error, setError] = React.useState("");
  const [manual, setManual] = React.useState(false);
  const claimed = React.useRef(false);

  React.useEffect(() => setSessionId(sessionIdFromUrl()), []);

  const claim = React.useCallback(async () => {
    if (!sessionId) return;
    setState("claiming"); setError("");
    try {
      setSession(await api.claimPayment(sessionId));
      setState("idle");
    } catch (e) {
      if (e instanceof ApiException && e.code === "billing_unconfigured") { setManual(true); setState("idle"); return; }
      setError(e instanceof ApiException ? e.message : "Could not confirm the payment. Please try again.");
      setState("error");
    }
  }, [sessionId]);

  React.useEffect(() => {
    if (status !== "in" || active || !sessionId || claimed.current) return;
    claimed.current = true;
    void claim();
  }, [status, active, sessionId, claim]);

  const next = sessionId ? `/success/?session_id=${encodeURIComponent(sessionId)}` : "/success/";

  return (
    <div className="mx-auto max-w-2xl text-center" aria-live="polite">
      {status === "loading" && <Pending title="Checking your payment..." body="One moment." />}
      {status === "out" && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h1 className="mt-6 text-4xl font-bold">Thank you!</h1>
          <p className="mt-3 text-lg text-muted-foreground">Your checkout is complete. Create your account, or sign in, with the same email you used at checkout and we will unlock your plan.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href={`/signup/?next=${encodeURIComponent(next)}`}>Create your account</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href={`/login/?next=${encodeURIComponent(next)}`}>Sign in</Link></Button>
          </div>
        </>
      )}
      {status === "in" && active && entitlement && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h1 className="mt-6 text-4xl font-bold">Your plan is active</h1>
          <p className="mt-3 text-lg text-muted-foreground">Thank you. You can start creating websites now.</p>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border bg-border text-left sm:grid-cols-3">
            <Stat label="Plan" value={PLAN_CATALOG[entitlement.plan].name} />
            <Stat label="Credits" value={String(entitlement.creditsLeft)} sub={`of ${entitlement.creditsTotal}`} />
            <Stat label="Access until" value={formatDate(entitlement.expiresAt)} />
          </dl>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link href="/app/">Start creating</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/account/">View account</Link></Button>
          </div>
          <div className="mt-10 surface p-6 text-left">
            <h2 className="text-lg font-semibold">Next steps</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground marker:text-primary">
              <li>Check your inbox for the receipt from Stripe.</li>
              <li>Go to the workspace and describe your business to generate your first website.</li>
              <li>Need help? Email {siteConfig.supportEmail}.</li>
            </ol>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{refundWaiverText}</p>
        </>
      )}
      {status === "in" && !active && manual && (
        <>
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">Payment received, thank you</h1>
          <p className="mt-3 text-lg text-muted-foreground">We activate each plan by hand on the account you signed up with, so it can take a little while. Your plan will appear on your account page as soon as it is active. If you paid with a different email than your account email, write to <a className="text-primary underline underline-offset-4" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> with your receipt.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => void refreshAuth()}>Check my plan</Button>
            <Button asChild size="lg" variant="outline"><Link href="/account/">View account</Link></Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{refundWaiverText}</p>
        </>
      )}
      {status === "in" && !active && !manual && sessionId && state !== "error" && <Pending title="Confirming your payment..." body="This takes a few seconds. You can keep this page open." />}
      {status === "in" && !active && !manual && (!sessionId || state === "error") && (
        <>
          <Clock className="mx-auto h-14 w-14 text-primary" aria-hidden />
          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{sessionId ? "We could not confirm the payment yet" : "No payment reference found"}</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {sessionId ? error : "Open this page from the link Stripe sends you after paying, or contact us with your receipt."}{" "}
            If you already paid, email <a className="text-primary underline underline-offset-4" href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a> with the email you used at checkout.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {sessionId && <Button size="lg" onClick={() => void claim()}>Try again</Button>}
            <Button asChild size="lg" variant="outline"><Link href="/contact/">Contact support</Link></Button>
          </div>
        </>
      )}
    </div>
  );
}

function Pending({ title, body }: { title: string; body: string }) {
  return (
    <>
      <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" aria-hidden />
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{body}</p>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-background p-5">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-heading text-xl font-bold">{value}{sub && <span className="ml-1.5 text-sm font-normal text-muted-foreground">{sub}</span>}</dd>
    </div>
  );
}
