"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PLAN_CATALOG } from "@/lib/api-types";
import { clearSession, formatDate, logout, refreshAuth, useAuth } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountView() {
  const { status, user, entitlement } = useAuth();
  const router = useRouter();
  const [confirm, setConfirm] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loggingOut, setLoggingOut] = React.useState(false);
  const leaving = React.useRef(false);

  React.useEffect(() => { void refreshAuth(); }, []);
  React.useEffect(() => { if (status === "out" && !leaving.current) router.replace("/login/?next=/account/"); }, [status, router]);

  if (status !== "in" || !user) {
    return <div className="mx-auto max-w-2xl space-y-4" aria-busy="true"><Skeleton className="h-10 w-48" /><Skeleton className="h-40 w-full rounded-2xl" /><Skeleton className="h-56 w-full rounded-2xl" /></div>;
  }

  const e = entitlement;
  const expired = !!e && !e.active;
  const pct = e && e.creditsTotal > 0 ? Math.min(100, Math.round((e.creditsUsed / e.creditsTotal) * 100)) : 0;

  async function onDelete() {
    setBusy(true); setErr("");
    try { await api.deleteAccount(); leaving.current = true; clearSession(); router.replace("/"); }
    catch { setErr("We could not delete your account. Please try again or email " + siteConfig.supportEmail + "."); setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold sm:text-4xl">Account</h1>
      <section aria-labelledby="a-profile" className="mt-8 surface">
        <h2 id="a-profile" className="text-lg font-semibold">Profile</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Name</dt><dd className="mt-1 break-words">{user.name}</dd></div>
          <div><dt className="text-xs uppercase tracking-wider text-muted-foreground">Email</dt><dd className="mt-1 break-all">{user.email}</dd></div>
        </dl>
      </section>
      <section aria-labelledby="a-plan" className="mt-6 surface">
        <div className="flex items-start justify-between gap-3">
          <h2 id="a-plan" className="text-lg font-semibold">Plan</h2>
          {e && <span className={"rounded-full px-3 py-1 text-xs font-medium " + (expired ? "bg-red-500/15 text-red-500" : "bg-primary/15 text-primary")}>{expired ? "Expired" : "Active"}</span>}
        </div>
        {!e ? (
          <div className="mt-4">
            <p className="text-muted-foreground">You do not have an active plan yet. Plans are one-time payments with no automatic renewal.</p>
            <Button asChild size="lg" className="mt-5"><Link href="/pricing/">See plans</Link></Button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="font-heading text-2xl font-bold">{PLAN_CATALOG[e.plan].name}</p>
            <div className={"mt-4 rounded-xl border p-4 " + (expired ? "border-red-500/40" : "border-primary/40 bg-primary/5")}>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{expired ? "Access ended" : "Access until"}</p>
              <p className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{formatDate(e.expiresAt)}</p>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline justify-between text-sm"><span>{e.creditsUsed} of {e.creditsTotal} credits used</span><span className="font-medium">{e.creditsLeft} left</span></div>
              <div role="progressbar" aria-label="Credits used" aria-valuemin={0} aria-valuemax={e.creditsTotal} aria-valuenow={e.creditsUsed} className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            {expired ? (
              <div className="mt-5">
                <p className="text-sm text-muted-foreground">Your access period has ended. Buy a plan again to keep using the tool. Nothing renews automatically.</p>
                <Button asChild size="lg" className="mt-4"><Link href="/pricing/">Buy again</Link></Button>
              </div>
            ) : (
              <Button asChild size="lg" className="mt-5"><Link href="/app/">Open workspace</Link></Button>
            )}
          </div>
        )}
      </section>
      <section aria-labelledby="a-data" className="mt-6 surface">
        <h2 id="a-data" className="text-lg font-semibold">Your data</h2>
        <ul className="mt-4 space-y-3 text-sm">
          <li><span className="font-medium">Your websites:</span> <span className="text-muted-foreground">Generated HTML is stored on our servers. You can download it as a file at any time.</span></li>
          <li><span className="font-medium">What we store:</span> <span className="text-muted-foreground">Your name, email, plan and generated websites. Deleting your account removes all of it.</span></li>
        </ul>
      </section>
      <section aria-labelledby="a-actions" className="mt-6 surface">
        <h2 id="a-actions" className="text-lg font-semibold">Session and deletion</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" size="lg" disabled={loggingOut} onClick={async () => { setLoggingOut(true); leaving.current = true; await logout(); router.replace("/"); }}>{loggingOut && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}Log out</Button>
          <Button variant="outline" size="lg" className="border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => { setErr(""); setConfirm(true); }}>Delete my account and data</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Deleting removes your profile, generated websites and access. This cannot be undone. See our <Link href="/refund/" className="underline underline-offset-4">Refund Policy</Link> first if you want to request a refund.</p>
      </section>
      <Dialog.Root open={confirm} onOpenChange={(o) => { if (!busy) setConfirm(o); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-background p-6 shadow-xl focus:outline-none">
            <Dialog.Title className="text-xl font-semibold">Delete your account?</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">This permanently deletes your profile, generated websites and remaining credits{e && e.active ? ` (${e.creditsLeft} left)` : ""}. This cannot be undone.</Dialog.Description>
            {err && <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-red-500"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{err}</p>}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Dialog.Close asChild><Button variant="outline" size="lg" disabled={busy}>Keep my account</Button></Dialog.Close>
              <Button size="lg" className="bg-none bg-red-500 text-white shadow-none hover:bg-red-500/90" disabled={busy} onClick={onDelete}>{busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{busy ? "Deleting..." : "Delete everything"}</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
