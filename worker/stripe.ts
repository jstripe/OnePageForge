import { CURRENCY, PLAN_CATALOG, type PlanId } from "../lib/api-types";
import { Ctx, DAY_MS, Env, HttpError, fromHex, json, readJson, utf8 } from "./lib/util";
import { grantStatement } from "./lib/db";
import { getMe, requireUser } from "./auth";

const TOLERANCE_S = 300;

export async function verifyStripeSignature(raw: string, header: string | null, secret: string, nowMs = Date.now()): Promise<boolean> {
  if (!header) return false;
  let t = ""; const sigs: string[] = [];
  for (const part of header.split(",")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim(), v = part.slice(i + 1).trim();
    if (k === "t") t = v; else if (k === "v1") sigs.push(v);
  }
  const ts = Number(t);
  if (!t || !Number.isFinite(ts) || !sigs.length) return false;
  if (Math.abs(nowMs / 1000 - ts) > TOLERANCE_S) return false;
  const key = await crypto.subtle.importKey("raw", utf8(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  for (const s of sigs) {
    const bytes = fromHex(s);
    if (bytes && (await crypto.subtle.verify("HMAC", key, bytes, utf8(`${t}.${raw}`)))) return true;
  }
  return false;
}

function planFromAmount(cents: number): PlanId | null {
  for (const [id, p] of Object.entries(PLAN_CATALOG)) if (p.amountCents === cents) return id as PlanId;
  return null;
}

async function grant(env: Env, s: any, forceUserId?: string): Promise<void> {
  const sessionId = String(s.id || "");
  if (!sessionId) return;
  const plan = planFromAmount(Number(s.amount_total));
  if (!plan) { console.log("unknown_amount", s.amount_total, s.currency); return; }
  let userId: string | null = forceUserId ?? null;
  if (!userId && typeof s.client_reference_id === "string" && s.client_reference_id) {
    const r = await env.DB.prepare(`SELECT id FROM users WHERE id = ?`).bind(s.client_reference_id).first<{ id: string }>();
    userId = r?.id ?? null;
  }
  if (!userId) {
    const email = String(s.customer_details?.email || s.customer_email || "").trim().toLowerCase();
    if (email) userId = (await env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(email).first<{ id: string }>())?.id ?? null;
  }
  if (!userId) { console.log("user_not_found", sessionId); return; }
  const p = PLAN_CATALOG[plan];
  const now = Date.now();
  const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null;
  // One transaction: the grant only runs if the purchase row was newly inserted (idempotent).
  await env.DB.batch([
    env.DB.prepare(`INSERT OR IGNORE INTO purchases (stripe_session_id, user_id, plan, amount_cents, payment_intent, created_at) VALUES (?,?,?,?,?,?)`)
      .bind(sessionId, userId, plan, p.amountCents, pi, now),
    grantStatement(env, userId, plan, now, true),
  ]);
}

async function refund(env: Env, charge: any): Promise<void> {
  if (charge.refunded !== true) { console.log("partial_refund_ignored"); return; }
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!pi) return;
  const now = Date.now();
  const rows = await env.DB.prepare(`SELECT stripe_session_id, user_id, plan FROM purchases WHERE payment_intent = ? AND refunded_at IS NULL`).bind(pi).all<{ stripe_session_id: string; user_id: string | null; plan: PlanId }>();
  for (const r of rows.results) {
    const upd = await env.DB.prepare(`UPDATE purchases SET refunded_at = ? WHERE stripe_session_id = ? AND refunded_at IS NULL`).bind(now, r.stripe_session_id).run();
    if (!upd.meta.changes || !r.user_id) continue;
    const p = PLAN_CATALOG[r.plan];
    if (!p) continue;
    await env.DB.prepare(
      `UPDATE entitlements SET credits_total = max(credits_used, credits_total - ?2),
         expires_at = CASE WHEN EXISTS (SELECT 1 FROM purchases WHERE user_id = ?1 AND refunded_at IS NULL) THEN max(?3, expires_at - ?4) ELSE ?3 END,
         updated_at = ?3 WHERE user_id = ?1`,
    ).bind(r.user_id, p.credits, now, p.accessDays * DAY_MS).run();
  }
}

export async function webhook(c: Ctx): Promise<Response> {
  const secret = c.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return json({ error: "webhook_unconfigured", message: "Webhook secret not set." }, 503);
  const raw = await c.request.text();
  if (!(await verifyStripeSignature(raw, c.request.headers.get("stripe-signature"), secret))) {
    return json({ error: "bad_signature", message: "Invalid signature." }, 400);
  }
  let ev: any;
  try { ev = JSON.parse(raw); } catch { return json({ error: "invalid_json", message: "Bad payload." }, 400); }
  const obj = ev?.data?.object;
  if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
    if (obj?.payment_status === "paid") await grant(c.env, obj);
  } else if (ev.type === "charge.refunded") {
    await refund(c.env, obj || {});
  }
  return json({ received: true });
}

/**
 * POST /api/billing/claim { sessionId }
 * No webhook needed: after paying on a Stripe Payment Link, Stripe redirects to /success?session_id=cs_...
 * The signed-in user claims that session here. We ask Stripe (read-only key) whether it is a paid,
 * unrefunded one-time payment for a known plan that belongs to this user, then grant the plan once.
 */
export async function claim(c: Ctx): Promise<Response> {
  const user = await requireUser(c);
  const key = c.env.STRIPE_SECRET_KEY;
  if (!key) throw new HttpError(503, "billing_unconfigured", "Payment verification is not set up yet. Please email support with your receipt.");
  const body = await readJson<{ sessionId?: string }>(c.request, 2048);
  const sessionId = String(body.sessionId || "");
  if (!/^cs_(test|live)_[A-Za-z0-9]{10,}$/.test(sessionId)) throw new HttpError(400, "bad_session", "That payment reference looks wrong.");

  const existing = await c.env.DB.prepare(`SELECT user_id, refunded_at FROM purchases WHERE stripe_session_id = ?`).bind(sessionId).first<{ user_id: string | null; refunded_at: number | null }>();
  if (existing) {
    if (existing.user_id !== user.id) throw new HttpError(409, "session_claimed", "This payment is already linked to another account.");
    return getMe(c);
  }

  const base = c.env.STRIPE_API_BASE || "https://api.stripe.com";
  const res = await fetch(`${base}/v1/checkout/sessions/${sessionId}?expand[]=payment_intent.latest_charge`, { headers: { Authorization: `Bearer ${key}` } });
  if (res.status === 404) throw new HttpError(404, "session_not_found", "We could not find that payment.");
  if (!res.ok) { console.log("stripe_lookup_failed", res.status); throw new HttpError(502, "stripe_unavailable", "Could not reach the payment provider. Try again in a minute."); }
  const s: any = await res.json();

  if (s.mode !== "payment" || s.payment_status !== "paid") throw new HttpError(402, "not_paid", "This payment is not completed yet.");
  if (String(s.currency || "").toLowerCase() !== CURRENCY) throw new HttpError(400, "bad_currency", "Unexpected currency.");
  if (!planFromAmount(Number(s.amount_total))) throw new HttpError(400, "unknown_amount", "This payment does not match a plan.");
  const charge = s.payment_intent && typeof s.payment_intent === "object" ? s.payment_intent.latest_charge : null;
  if (charge && typeof charge === "object" && (charge.refunded || charge.disputed)) throw new HttpError(402, "refunded", "This payment was refunded.");
  const emailOnSession = String(s.customer_details?.email || s.customer_email || "").trim().toLowerCase();
  const ownedById = typeof s.client_reference_id === "string" && s.client_reference_id === user.id;
  const ownedByEmail = !s.client_reference_id && !!emailOnSession && emailOnSession === user.email.toLowerCase();
  if (!ownedById && !ownedByEmail) throw new HttpError(403, "not_your_payment", "This payment was made for a different account. Sign in with the account you used at checkout, or contact support.");

  await grant(c.env, s, user.id);
  return getMe(c);
}
