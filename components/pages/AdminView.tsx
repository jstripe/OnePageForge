"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api, ApiException } from "@/lib/api";
import { formatDate, useAuth } from "@/lib/auth";
import { PLAN_CATALOG, type AdminOverview, type PlanId } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/Logo";

const plans = Object.keys(PLAN_CATALOG) as PlanId[];

export function AdminView() {
  const { status } = useAuth();
  const router = useRouter();
  const [data, setData] = React.useState<AdminOverview | null>(null);
  const [q, setQ] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [plan, setPlan] = React.useState<PlanId>("starter");

  const load = React.useCallback(async (query = "") => {
    try { setData(await api.adminOverview(query)); }
    catch (e) { if (e instanceof ApiException && (e.status === 404 || e.status === 401)) router.replace("/app/"); else setMsg("Could not load."); }
  }, [router]);

  React.useEffect(() => {
    if (status === "out") router.replace("/login/?next=/admin/");
    if (status === "in") void load();
  }, [status, load, router]);

  const act = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true); setMsg("");
    try { await fn(); setMsg(ok); await load(q); } catch (e) { setMsg(e instanceof ApiException ? e.message : "Failed."); }
    setBusy(false);
  };

  if (!data) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" /></div>;
  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6">
      <div className="flex items-center justify-between"><Logo /><Link href="/app/" className="text-sm text-muted-foreground hover:text-foreground">Back to app</Link></div>
      <h1 className="mt-8 text-3xl font-bold">Customers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Activate a plan by hand after a payment, or revoke one.</p>
      <form className="surface mt-6 flex flex-wrap items-end gap-3 p-4" onSubmit={(e) => { e.preventDefault(); void act(() => api.adminGrant(email, plan), `Granted ${plan} to ${email}.`); }}>
        <label className="grid flex-1 gap-1 text-sm">Customer email<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@email.com" /></label>
        <label className="grid gap-1 text-sm">Plan
          <select className="h-11 rounded-xl border border-input bg-background px-3 text-base sm:text-sm" value={plan} onChange={(e) => setPlan(e.target.value as PlanId)}>
            {plans.map((p) => <option key={p} value={p}>{PLAN_CATALOG[p].name} ({PLAN_CATALOG[p].credits} credits, ${PLAN_CATALOG[p].amountCents / 100})</option>)}
          </select>
        </label>
        <Button type="submit" disabled={busy}>Activate plan</Button>
      </form>
      {msg && <p role="status" className="mt-3 text-sm text-primary">{msg}</p>}
      <div className="mt-8 flex items-center gap-3">
        <h2 className="text-xl font-semibold">Accounts</h2>
        <Input className="max-w-xs" placeholder="Search email or name" value={q} onChange={(e) => { setQ(e.target.value); void load(e.target.value); }} />
      </div>
      <div className="surface mt-3 overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="p-3">Email</th><th className="p-3">Signed up</th><th className="p-3">Plan</th><th className="p-3">Credits left</th><th className="p-3">Access until</th><th className="p-3" /></tr></thead>
          <tbody>
            {data.users.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="p-3">{u.email}<span className="block text-xs text-muted-foreground">{u.name}</span></td>
                <td className="p-3 whitespace-nowrap">{formatDate(u.createdAt)}</td>
                <td className="p-3">{u.plan ? PLAN_CATALOG[u.plan].name : "None"}</td>
                <td className="p-3">{u.creditsTotal != null ? `${Math.max(0, (u.creditsTotal ?? 0) - (u.creditsUsed ?? 0))} of ${u.creditsTotal}` : "-"}</td>
                <td className="p-3 whitespace-nowrap">{u.expiresAt ? formatDate(u.expiresAt) : "-"}</td>
                <td className="p-3 text-right"><Button size="sm" variant="outline" disabled={busy || !u.plan} onClick={() => confirm(`Revoke access for ${u.email}?`) && void act(() => api.adminRevoke(u.email), `Revoked ${u.email}.`)}>Revoke</Button></td>
              </tr>
            ))}
            {!data.users.length && <tr><td className="p-4 text-muted-foreground" colSpan={6}>No accounts found.</td></tr>}
          </tbody>
        </table>
      </div>
      <h2 className="mt-10 text-xl font-semibold">Recent purchases and grants</h2>
      <ul className="surface mt-3 divide-y p-0 text-sm">
        {data.purchases.map((p) => <li key={p.ref} className="flex flex-wrap justify-between gap-2 p-3"><span>{p.email ?? "(deleted account)"} · {PLAN_CATALOG[p.plan]?.name ?? p.plan} · ${p.amountCents / 100}</span><span className="text-muted-foreground">{formatDate(p.createdAt)} · {p.ref.startsWith("manual_") ? "manual" : "Stripe"}</span></li>)}
        {!data.purchases.length && <li className="p-4 text-muted-foreground">Nothing yet.</li>}
      </ul>
      <h2 className="mt-10 text-xl font-semibold">Contact messages</h2>
      <ul className="surface mt-3 divide-y p-0 text-sm">
        {data.messages.map((m) => (
          <li key={m.id} className={"space-y-1 p-3" + (m.handledAt ? " opacity-60" : "")}>
            <div className="flex flex-wrap justify-between gap-2"><strong>{m.subject} · {m.name} &lt;{m.email}&gt;</strong><span className="text-muted-foreground">{formatDate(m.createdAt)}</span></div>
            <p className="whitespace-pre-wrap">{m.message}</p>
            <div className="flex gap-3">
              <a className="text-primary underline" href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}>Reply by email</a>
              {!m.handledAt && <button className="underline" onClick={async () => { await api.adminMessageDone(m.id); void load(q); }}>Mark as handled</button>}
            </div>
          </li>
        ))}
        {!data.messages.length && <li className="p-4 text-muted-foreground">No messages.</li>}
      </ul>
    </div>
  );
}
