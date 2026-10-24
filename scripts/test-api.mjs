// Run: wrangler dev (with .dev.vars: STRIPE_WEBHOOK_SECRET=whsec_test_local, MOCK_AI=1) then `node scripts/test-api.mjs`
import { createHmac, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { redirectTarget } from "../worker/lib/redirect.ts";
import { originAllowed } from "../worker/lib/origin.ts";

const BASE = process.env.API_BASE || "http://localhost:8787";
let SECRET = "whsec_test_local";
try { const m = readFileSync(new URL("../.dev.vars", import.meta.url), "utf8").match(/^STRIPE_WEBHOOK_SECRET=(.+)$/m); if (m) SECRET = m[1].trim(); } catch {}
let pass = 0, fail = 0;
const ok = (c, name, extra = "") => { if (c) { pass++; console.log("  ok  " + name); } else { fail++; console.log("  FAIL " + name + " " + extra); } };
const eq = (a, b, name) => ok(a === b, name, `(got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);

class Client {
  cookie = "";
  async req(method, path, body, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (this.cookie) headers.cookie = this.cookie;
    let payload = body;
    if (body !== undefined && !(body instanceof Uint8Array) && typeof body !== "string") { headers["content-type"] = "application/json"; payload = JSON.stringify(body); }
    const res = await fetch(BASE + path, { method, headers, body: payload, redirect: "manual" });
    const sc = res.headers.get("set-cookie");
    if (sc) { const v = sc.split(";")[0]; this.cookie = v.endsWith("=") ? "" : v; }
    const text = await res.text();
    let data = null; try { data = JSON.parse(text); } catch {}
    return { status: res.status, data, headers: res.headers };
  }
}

function sign(raw, secret = SECRET, t = Math.floor(Date.now() / 1000)) {
  return `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex")}`;
}
async function hook(event, secret, t) {
  const raw = JSON.stringify(event);
  const res = await fetch(BASE + "/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": sign(raw, secret, t), "content-type": "application/json" }, body: raw });
  return res.status;
}
const checkout = (id, userId, amount, pi, extra = {}) => ({ id: "evt_" + id, type: "checkout.session.completed", data: { object: { id, client_reference_id: userId, amount_total: amount, payment_status: "paid", payment_intent: pi, ...extra } } });

const email = () => `t${randomUUID().slice(0, 8)}@example.com`;
const PW = "correct horse battery";

async function main() {
  console.log("redirect + origin");
  const r = (u) => redirectTarget(new URL(u), "https://example.com");
  eq(r("http://www.example.com/pricing/?x=1"), "https://example.com/pricing/?x=1", "http www -> https apex");
  eq(r("https://example.com/x"), null, "canonical untouched");
  eq(r("http://localhost:8787/x"), null, "localhost untouched");
  ok(!originAllowed(new URL("https://example.com/api/x"), "https://evil.example"), "cross-origin blocked");

  console.log("health + headers");
  let res = await fetch(BASE + "/api/health"); eq(res.status, 200, "health 200");
  eq(res.headers.get("x-content-type-options"), "nosniff", "security header");

  console.log("auth");
  const A = new Client(); const em = email();
  eq((await A.req("GET", "/api/me")).status, 401, "me requires login");
  eq((await A.req("POST", "/api/auth/signup", { name: "", email: em, password: PW })).status, 400, "name required");
  eq((await A.req("POST", "/api/auth/signup", { name: "Tess", email: em, password: "short" })).status, 400, "weak password");
  const s = await A.req("POST", "/api/auth/signup", { name: "Tess", email: em, password: PW });
  eq(s.status, 201, "signup 201"); eq(s.data?.entitlement, null, "no plan yet");
  ok((s.headers.get("set-cookie") || "").includes("HttpOnly"), "session cookie HttpOnly");
  eq((await A.req("POST", "/api/auth/signup", { name: "Tess", email: em, password: PW })).status, 409, "duplicate email 409");
  const B = new Client();
  eq((await B.req("POST", "/api/auth/login", { email: em, password: "wrong password" })).status, 401, "bad password 401");
  eq((await B.req("POST", "/api/auth/login", { email: em, password: PW })).status, 200, "login 200");
  const userId = s.data.user.id;

  console.log("plan unlock (signed webhook)");
  eq(await hook(checkout("cs_" + randomUUID(), userId, 1400, "pi_" + randomUUID()), "wrong"), 400, "bad signature 400");
  const pi1 = "pi_" + randomUUID();
  eq(await hook(checkout("cs_a" + randomUUID(), userId, 1400, pi1)), 200, "starter purchase");
  let e = (await A.req("GET", "/api/me")).data.entitlement;
  eq(e?.plan, "starter", "plan starter"); eq(e?.creditsTotal, 5, "5 credits"); eq(e?.active, true, "active");
  ok(Math.abs(e.expiresAt - (Date.now() + 30 * 86400000)) < 120000, "access ~30 days");
  const evR = checkout("cs_r" + randomUUID(), userId, 3900, "pi_" + randomUUID());
  await hook(evR); await hook(evR);
  e = (await A.req("GET", "/api/me")).data.entitlement;
  eq(e.creditsTotal, 25, "second plan stacks credits once (idempotent)"); eq(e.plan, "pro", "plan pro");
  eq(await hook(checkout("cs_u" + randomUUID(), userId, 777, "pi_x")), 200, "unknown amount 200");
  eq((await A.req("GET", "/api/me")).data.entitlement.creditsTotal, 25, "unknown amount grants nothing");

  console.log("refund");
  const refundEv = (pi) => ({ id: "evt_" + randomUUID(), type: "charge.refunded", data: { object: { id: "ch_1", payment_intent: pi, refunded: true } } });
  eq(await hook(refundEv(pi1)), 200, "refund 200");
  e = (await A.req("GET", "/api/me")).data.entitlement;
  eq(e.creditsTotal, 20, "refund removes 5 credits"); eq(e.active, true, "still active from other plan");

  console.log("contact");
  const V = new Client();
  eq((await V.req("POST", "/api/contact", { name: "Visitor", email: "bad", subject: "General", message: "Hi" })).status, 400, "invalid email 400");
  eq((await V.req("POST", "/api/contact", { name: "Visitor", email: "v@example.com", subject: "General", message: "Hello there" })).status, 200, "contact saved");
  eq((await V.req("POST", "/api/contact", { name: "Bot", email: "b@example.com", subject: "x", message: "spam", website: "http://spam" })).status, 200, "honeypot pretends success");
  eq((await A.req("GET", "/api/admin/overview")).status, 404, "admin hidden from non-admins");

  console.log("core tool: generate");
  const D = "Family bakery in Leeds selling fresh bread and cakes";
  eq((await A.req("POST", "/api/generate", { description: "short", style: "modern" })).status, 400, "short description 400");
  eq((await A.req("POST", "/api/generate", { description: D, style: "nope" })).status, 400, "invalid style 400");
  const noPlan = new Client(); await noPlan.req("POST", "/api/auth/signup", { name: "Nina", email: email(), password: PW });
  eq((await noPlan.req("POST", "/api/generate", { description: D, style: "modern" })).status, 403, "no plan 403");
  const left0 = (await A.req("GET", "/api/me")).data.entitlement.creditsLeft;
  const g = await A.req("POST", "/api/generate", { description: D, style: "modern" });
  eq(g.status, 201, "generate 201"); ok(g.data?.slug && g.data?.html?.includes("<html"), "returns slug and html");
  eq((await A.req("GET", "/api/me")).data.entitlement.creditsLeft, left0 - 1, "one credit spent");
  eq((await A.req("GET", "/api/sites")).data.sites.length, 1, "site listed");
  eq((await A.req("GET", "/api/sites/" + g.data.id)).status, 200, "owner can read site");
  const pub = await fetch(BASE + "/s/" + g.data.slug); eq(pub.status, 200, "hosted site served at /s/slug");
  eq((await noPlan.req("GET", "/api/sites/" + g.data.id)).status, 404, "other user cannot read site");
  eq((await noPlan.req("DELETE", "/api/sites/" + g.data.id)).status, 404, "other user cannot delete site");
  eq((await noPlan.req("GET", "/api/sites")).data.sites.length, 0, "other user sees no sites");
  let guard = 0, last = 201;
  while (last === 201 && guard++ < 60) last = (await A.req("POST", "/api/generate", { description: D, style: "bold" })).status;
  eq(last, 403, "running out of credits returns 403");
  eq((await A.req("GET", "/api/me")).data.entitlement.creditsLeft, 0, "credits left 0");
  eq((await A.req("DELETE", "/api/sites/" + g.data.id)).status, 200, "owner can delete site");
  eq((await fetch(BASE + "/s/" + g.data.slug)).status, 404, "deleted site gone");

  console.log("delete account");
  eq((await A.req("DELETE", "/api/account")).status, 204, "delete 204");
  eq((await A.req("GET", "/api/me")).status, 401, "session gone");
  eq((await B.req("POST", "/api/auth/login", { email: em, password: PW })).status, 401, "login gone");

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
