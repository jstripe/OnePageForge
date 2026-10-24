"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ApiException } from "@/lib/api";
import { safeNext, setSession, useAuth } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

function LoginForm() {
  const { status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (status === "in") router.replace(safeNext(params.get("next")));
  }, [status, router, params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      setSession(await api.login({ email, password }));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16 sm:py-20">
      <h1 className="text-center font-heading text-3xl font-bold">Log in</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="grid gap-1 text-sm font-medium">Email<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="grid gap-1 text-sm font-medium">Password<Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account yet? <Link href={"/signup/" + (params.get("next") ? `?next=${encodeURIComponent(params.get("next")!)}` : "")} className="text-primary underline underline-offset-4">Create one</Link>
      </p>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Forgot your password? Email <a href={`mailto:${siteConfig.supportEmail}`} className="text-primary underline underline-offset-4">{siteConfig.supportEmail}</a>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return <React.Suspense fallback={<div className="min-h-[560px]" />}><LoginForm /></React.Suspense>;
}
