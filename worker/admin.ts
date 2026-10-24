import { PLAN_CATALOG, type PlanId } from "../lib/api-types";
import { requireUser } from "./auth";
import { Ctx, Env, HttpError, json, readJson } from "./lib/util";
import { grantStatement } from "./lib/db";

/** Admins are normal accounts whose email is listed in the ADMIN_EMAILS var (comma separated). Everyone else gets a 404. */
async function requireAdmin(c: Ctx) {
  const u = await requireUser(c);
  const admins = String(c.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (!admins.includes(u.email.toLowerCase())) throw new HttpError(404, "not_found", "Unknown API route.");
  return u;
}

export async function overview(c: Ctx): Promise<Response> {
  await requireAdmin(c);
  const q = (c.url.searchParams.get("q") || "").trim().toLowerCase().slice(0, 80).replace(/[%_]/g, "");
  const users = await c.env.DB.prepare(
    `SELECT u.id, u.email, u.name, u.created_at AS createdAt, e.plan, e.credits_total AS creditsTotal, e.credits_used AS creditsUsed, e.expires_at AS expiresAt
     FROM users u LEFT JOIN entitlements e ON e.user_id = u.id
     WHERE (?1 = '' OR u.email LIKE '%' || ?1 || '%' OR lower(u.name) LIKE '%' || ?1 || '%')
     ORDER BY u.created_at DESC LIMIT 100`,
  ).bind(q).all();
  const purchases = await c.env.DB.prepare(
    `SELECT p.stripe_session_id AS ref, p.plan, p.amount_cents AS amountCents, p.created_at AS createdAt, u.email
     FROM purchases p LEFT JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 30`,
  ).all();
  const messages = await c.env.DB.prepare(
    `SELECT id, name, email, subject, message, created_at AS createdAt, handled_at AS handledAt
     FROM contact_messages ORDER BY handled_at IS NOT NULL, created_at DESC LIMIT 50`,
  ).all();
  return json({ users: users.results, purchases: purchases.results, messages: messages.results });
}

async function userByEmail(env: Env, email: string) {
  return env.DB.prepare(`SELECT id, email FROM users WHERE email = ?`).bind(email.trim().toLowerCase()).first<{ id: string; email: string }>();
}

export async function grant(c: Ctx): Promise<Response> {
  await requireAdmin(c);
  const body = await readJson<{ email?: string; plan?: string }>(c.request, 2048);
  const plan = String(body.plan || "") as PlanId;
  if (!(plan in PLAN_CATALOG)) throw new HttpError(400, "bad_plan", "Unknown plan.");
  const target = await userByEmail(c.env, String(body.email || ""));
  if (!target) throw new HttpError(404, "no_such_user", "No account with that email. The customer must sign up first.");
  const p = PLAN_CATALOG[plan];
  const now = Date.now();
  await c.env.DB.batch([
    c.env.DB.prepare(`INSERT INTO purchases (stripe_session_id, user_id, plan, amount_cents, payment_intent, created_at) VALUES (?,?,?,?,NULL,?)`)
      .bind(`manual_${now}_${crypto.randomUUID().slice(0, 6)}`, target.id, plan, p.amountCents, now),
    grantStatement(c.env, target.id, plan, now, false),
  ]);
  return json({ ok: true, email: target.email, plan });
}

export async function revoke(c: Ctx): Promise<Response> {
  await requireAdmin(c);
  const body = await readJson<{ email?: string }>(c.request, 2048);
  const target = await userByEmail(c.env, String(body.email || ""));
  if (!target) throw new HttpError(404, "no_such_user", "No account with that email.");
  const now = Date.now();
  await c.env.DB.prepare(`UPDATE entitlements SET expires_at = ?2, credits_total = credits_used, updated_at = ?2 WHERE user_id = ?1`).bind(target.id, now).run();
  return json({ ok: true, email: target.email });
}

export async function messageDone(c: Ctx): Promise<Response> {
  await requireAdmin(c);
  const body = await readJson<{ id?: string }>(c.request, 1024);
  await c.env.DB.prepare(`UPDATE contact_messages SET handled_at = ?2 WHERE id = ?1 AND handled_at IS NULL`).bind(String(body.id || ""), Date.now()).run();
  return json({ ok: true });
}
