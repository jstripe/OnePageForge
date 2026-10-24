export type PlanId = "starter" | "pro" | "studio";

export const PLAN_CATALOG: Record<PlanId, { name: string; amountCents: number; credits: number; accessDays: number }> = {
  starter: { name: "Starter", amountCents: 1400, credits: 5, accessDays: 30 },
  pro: { name: "Pro", amountCents: 3900, credits: 20, accessDays: 90 },
  studio: { name: "Studio", amountCents: 9900, credits: 60, accessDays: 365 },
};

export const CURRENCY = "usd";

export interface ApiError { error: string; message: string }

export interface User { id: string; name: string; email: string; createdAt: number }

export interface Entitlement {
  plan: PlanId;
  creditsTotal: number;
  creditsUsed: number;
  creditsLeft: number;
  expiresAt: number;
  active: boolean;
}

export interface MeResponse { user: User; entitlement: Entitlement | null }

export interface SignupRequest { name: string; email: string; password: string }
export interface LoginRequest { email: string; password: string }

export interface ContactRequest { name: string; email: string; subject: string; message: string; website?: string }

export interface Capabilities { ok: boolean; ai: boolean; billing: boolean }
export interface AdminUser { id: string; email: string; name: string; createdAt: number; plan: PlanId | null; creditsTotal: number | null; creditsUsed: number | null; expiresAt: number | null }
export interface AdminPurchase { ref: string; plan: PlanId; amountCents: number; createdAt: number; email: string | null }
export interface AdminMessage { id: string; name: string; email: string; subject: string; message: string; createdAt: number; handledAt: number | null }
export interface AdminOverview { users: AdminUser[]; purchases: AdminPurchase[]; messages: AdminMessage[] }

export interface GenerateRequest { description: string; style: string }
export interface GeneratedSite { id: string; userId: string; description: string; style: string; html: string; slug: string; createdAt: number }
export interface SiteListItem { id: string; description: string; style: string; slug: string; createdAt: number }
