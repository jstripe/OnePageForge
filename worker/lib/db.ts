import { PLAN_CATALOG, type Entitlement, type PlanId } from "../../lib/api-types";
import type { Env } from "./util";

let schemaPromise: Promise<unknown> | undefined;

export function ensureSchema(env: Env): Promise<unknown> {
  if (!schemaPromise) {
    const q = (s: string) => env.DB.prepare(s);
    schemaPromise = env.DB.batch([
      q(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, iterations INTEGER NOT NULL, created_at INTEGER NOT NULL)`),
      q(`CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)`),
      q(`CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`),
      q(`CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at)`),
      q(`CREATE TABLE IF NOT EXISTS entitlements (user_id TEXT PRIMARY KEY, plan TEXT NOT NULL, credits_total INTEGER NOT NULL, credits_used INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`),
      q(`CREATE TABLE IF NOT EXISTS purchases (stripe_session_id TEXT PRIMARY KEY, user_id TEXT, plan TEXT NOT NULL, amount_cents INTEGER NOT NULL, payment_intent TEXT, created_at INTEGER NOT NULL, refunded_at INTEGER)`),
      q(`CREATE INDEX IF NOT EXISTS idx_purchases_pi ON purchases(payment_intent)`),
      q(`CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id)`),
      q(`CREATE TABLE IF NOT EXISTS contact_messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, message TEXT NOT NULL, created_at INTEGER NOT NULL, handled_at INTEGER)`),
      q(`CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at)`),
      q(`CREATE TABLE IF NOT EXISTS generated_sites (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, description TEXT NOT NULL, style TEXT NOT NULL, html TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL)`),
      q(`CREATE INDEX IF NOT EXISTS idx_sites_user ON generated_sites(user_id)`),
      q(`CREATE INDEX IF NOT EXISTS idx_sites_slug ON generated_sites(slug)`),
      q(`CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, window_start INTEGER NOT NULL, count INTEGER NOT NULL)`),
    ]).catch((e) => { schemaPromise = undefined; throw e; });
  }
  return schemaPromise;
}

interface EntRow { plan: string; credits_total: number; credits_used: number; expires_at: number }

export function toEntitlement(r: EntRow | null, now = Date.now()): Entitlement | null {
  if (!r) return null;
  const creditsLeft = Math.max(0, r.credits_total - r.credits_used);
  const plan = (r.plan in PLAN_CATALOG ? r.plan : "starter") as PlanId;
  return { plan, creditsTotal: r.credits_total, creditsUsed: r.credits_used, creditsLeft, expiresAt: r.expires_at, active: r.expires_at > now && creditsLeft > 0 };
}

export async function getEntitlement(env: Env, userId: string): Promise<Entitlement | null> {
  const r = await env.DB.prepare(`SELECT plan, credits_total, credits_used, expires_at FROM entitlements WHERE user_id = ?`).bind(userId).first<EntRow>();
  return toEntitlement(r);
}

export function grantStatement(env: Env, userId: string, plan: PlanId, now: number, onlyIfInserted: boolean) {
  const p = PLAN_CATALOG[plan];
  return env.DB.prepare(
    `INSERT INTO entitlements (user_id, plan, credits_total, credits_used, expires_at, updated_at)
     SELECT ?1, ?2, ?3, 0, ?4 + ?5, ?4 ${onlyIfInserted ? "WHERE changes() > 0" : "WHERE 1"}
     ON CONFLICT(user_id) DO UPDATE SET plan = excluded.plan,
       credits_total = CASE WHEN expires_at < ?4 THEN credits_used + ?3 ELSE credits_total + ?3 END,
       expires_at = max(?4, expires_at) + ?5, updated_at = ?4`,
  ).bind(userId, plan, p.credits, now, p.accessDays * 86_400_000);
}
