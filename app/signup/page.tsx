"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ApiException } from "@/lib/api";
import { safeNext, setSession, useAuth } from "@/lib/auth";

function SignupForm() {
  const { status } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (status === "in") router.replace(safeNext(params.get("next")));
  }, [status, router, params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) { setError("You must agree to the Terms and Privacy Policy."); return; }
    setBusy(true); setError("");
    try {
      setSession(await api.signup({ name, email, password }));
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16 sm:py-20">
      <h1 className="text-center font-heading text-3xl font-bold">Create your account</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="grid gap-1 text-sm font-medium">Full name<Input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <label className="grid gap-1 text-sm font-medium">Email<Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
        <label className="grid gap-1 text-sm font-medium">Password (min. 8 characters)<Input type="password" required minLength={8} maxLength={200} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I am 18 or older and agree to the <Link href="/terms/" className="text-primary underline underline-offset-4" target="_blank">Terms of Service</Link> and <Link href="/privacy/" className="text-primary underline underline-offset-4" target="_blank">Privacy Policy</Link>.</span>
        </label>
        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Creating account..." : "Create account"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link href={"/login/" + (params.get("next") ? `?next=${encodeURIComponent(params.get("next")!)}` : "")} className="text-primary underline underline-offset-4">Sign in</Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return <React.Suspense fallback={null}><SignupForm /></React.Suspense>;
}
