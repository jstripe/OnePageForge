import type { AdminOverview, ApiError, Capabilities, ContactRequest, GeneratedSite, LoginRequest, MeResponse, SignupRequest, SiteListItem } from "./api-types";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export class ApiException extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(API_BASE + path, { credentials: "include", ...init });
  if (!res.ok) {
    let body: Partial<ApiError> = {};
    try { body = await res.json(); } catch { /* not JSON */ }
    throw new ApiException(res.status, body.error || "error", body.message || `Request failed (${res.status})`);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
  method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body),
});

export const api = {
  capabilities: () => call<Capabilities>("/api/health"),
  me: () => call<MeResponse>("/api/me"),
  signup: (b: SignupRequest) => call<MeResponse>("/api/auth/signup", json("POST", b)),
  login: (b: LoginRequest) => call<MeResponse>("/api/auth/login", json("POST", b)),
  logout: () => call<void>("/api/auth/logout", json("POST")),
  claimPayment: (sessionId: string) => call<MeResponse>("/api/billing/claim", json("POST", { sessionId })),
  deleteAccount: () => call<void>("/api/account", json("DELETE")),
  contact: (b: ContactRequest) => call<{ ok: true }>("/api/contact", json("POST", b)),
  generate: (description: string, style: string) => call<GeneratedSite>("/api/generate", json("POST", { description, style })),
  listSites: () => call<{ sites: SiteListItem[] }>("/api/sites"),
  getSite: (id: string) => call<GeneratedSite>(`/api/sites/${id}`),
  deleteSite: (id: string) => call<{ ok: true }>(`/api/sites/${id}`, json("DELETE")),
  adminOverview: (q = "") => call<AdminOverview>(`/api/admin/overview?q=${encodeURIComponent(q)}`),
  adminGrant: (email: string, plan: string) => call<{ ok: true }>("/api/admin/grant", json("POST", { email, plan })),
  adminRevoke: (email: string) => call<{ ok: true }>("/api/admin/revoke", json("POST", { email })),
  adminMessageDone: (id: string) => call<{ ok: true }>("/api/admin/message-done", json("POST", { id })),
};

export function checkoutUrl(link: string, user: { id: string; email: string }): string {
  const u = new URL(link);
  u.searchParams.set("client_reference_id", user.id);
  u.searchParams.set("prefilled_email", user.email);
  return u.toString();
}
