"use client";
import * as React from "react";
import { Mail, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/lib/site-config";
import { api, ApiException } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState<"success" | "error" | null>(null);
  const [error, setError] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setResult(null); setError("");
    try {
      await api.contact({ name, email, subject, message, website });
      setResult("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setResult("error");
      setError(err instanceof ApiException ? err.message : "Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">Have a question, need a custom plan, or want to report an issue? We are here to help.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-5">
          <form onSubmit={onSubmit} className="space-y-4 lg:col-span-3">
            <label className="grid gap-1 text-sm font-medium">Name<Input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></label>
            <label className="grid gap-1 text-sm font-medium">Email<Input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label className="grid gap-1 text-sm font-medium">Subject
              <select required className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-base sm:text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option value="">Choose a subject</option>
                <option value="General">General question</option>
                <option value="Billing">Billing</option>
                <option value="Custom plan">Custom plan</option>
                <option value="Bug report">Bug report</option>
                <option value="Refund">Refund request</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">Message<textarea required maxLength={5000} rows={5} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base sm:text-sm" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" /></label>
            <div className="hidden" aria-hidden="true"><Input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
            {result === "success" && <p className="text-sm text-primary">Message sent. We will get back to you within one business day.</p>}
            {result === "error" && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" size="lg" disabled={busy}>{busy ? "Sending..." : "Send message"}</Button>
          </form>

          <div className="space-y-6 lg:col-span-2">
            <div className="surface">
              <Mail className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-medium">Email</p>
              <a href={`mailto:${siteConfig.supportEmail}`} className="text-sm text-primary underline underline-offset-4">{siteConfig.supportEmail}</a>
            </div>
            <div className="surface">
              <Clock className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-medium">Support hours</p>
              <p className="text-sm text-muted-foreground">{siteConfig.supportHours}</p>
            </div>
            <div className="surface">
              <Building2 className="h-5 w-5 text-primary" />
              <p className="mt-2 text-sm font-medium">Company</p>
              <p className="text-sm text-muted-foreground">{siteConfig.legalEntity}</p>
              <p className="text-sm text-muted-foreground">{siteConfig.registeredOffice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
