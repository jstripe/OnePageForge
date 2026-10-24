"use client";
import * as React from "react";
import { api, ApiException } from "@/lib/api";
import type { Entitlement, MeResponse, User } from "@/lib/api-types";

export type AuthState = { status: "loading" | "in" | "out"; user: User | null; entitlement: Entitlement | null };

let state: AuthState = { status: "loading", user: null, entitlement: null };
let inflight: Promise<AuthState> | null = null;
const listeners = new Set<() => void>();

function set(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

export function setSession(me: MeResponse) {
  set({ status: "in", user: me.user, entitlement: me.entitlement });
}
export function clearSession() {
  set({ status: "out", user: null, entitlement: null });
}

export function refreshAuth(): Promise<AuthState> {
  if (inflight) return inflight;
  inflight = api.me()
    .then((me) => { setSession(me); return state; })
    .catch((e) => {
      if (e instanceof ApiException && e.status === 401) clearSession();
      else if (state.status === "loading") clearSession();
      return state;
    })
    .finally(() => { inflight = null; });
  return inflight;
}

let started = false;
export function useAuth() {
  const snap = React.useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; },
    () => state,
    () => state,
  );
  React.useEffect(() => {
    if (!started) { started = true; void refreshAuth(); }
  }, []);
  return { ...snap, refresh: refreshAuth };
}

export async function logout() {
  try { await api.logout(); } catch { /* cookie may already be gone */ }
  clearSession();
}

export function safeNext(next: string | null | undefined, fallback = "/app/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

export function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
