// Tests POST /api/billing/claim against a fake Stripe API on :8799. Needs `npm run worker:dev` with
// STRIPE_SECRET_KEY=rk_test_local and STRIPE_API_BASE=http://localhost:8799 in .dev.vars.
import http from "node:http";
const BASE = process.env.API_BASE || "http://localhost:8787";
const sessions = {};
const stripe = http.createServer((req, res) => {
  const id = req.url.split("/v1/checkout/sessions/")[1]?.split("?")[0];
  if (req.headers.authorization !== "Bearer rk_test_local") { res.writeHead(401); return res.end("{}"); }
  const s = sessions[id];
  if (!s) { res.writeHead(404); return res.end("{}"); }
  res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(s));
}).listen(8799);

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log(`${c ? "  ok " : "FAIL "} ${m}`); };
async function user(tag) {
  const email = `claim-${tag}-${Date.now()}@example.org`;
  const r = await fetch(BASE + "/api/auth/signup", { method: "POST", headers: { "Content-Type": "application/json", Origin: BASE }, body: JSON.stringify({ name: "Claim " + tag, email, password: "passw0rd!x" }) });
  const cookie = r.headers.get("set-cookie").split(";")[0];
  const me = await r.json();
  return { email, cookie, id: me.user.id };
}
const claim = (u, sid) => fetch(BASE + "/api/billing/claim", { method: "POST", headers: { "Content-Type": "application/json", Origin: BASE, Cookie: u.cookie }, body: JSON.stringify({ sessionId: sid }) });
const base = (u, o = {}) => ({ id: "", mode: "payment", payment_status: "paid", currency: "usd", amount_total: 3900, client_reference_id: u.id, customer_details: { email: u.email }, payment_intent: { id: "pi_x", latest_charge: { refunded: false, disputed: false } }, ...o });
const rnd = () => Math.random().toString(36).slice(2, 14).padEnd(12, "a");

try {
  const a = await user("a"), b = await user("b");
  let sid = "cs_test_" + rnd(); sessions[sid] = { ...base(a), id: sid };
  let r = await claim(a, sid); let j = await r.json();
  ok(r.status === 200 && j.entitlement?.plan === "pro" && j.entitlement.creditsLeft === 20 && j.entitlement.active, "paid pro session unlocks 20 credits");
  r = await claim(a, sid); j = await r.json();
  ok(r.status === 200 && j.entitlement.creditsTotal === 20, "replay is idempotent (no double grant)");
  r = await claim(b, sid); ok(r.status === 409, "another account cannot claim the same session");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(a, { amount_total: 1400 }), id: sid };
  r = await claim(a, sid); j = await r.json();
  ok(r.status === 200 && j.entitlement.creditsTotal === 25 && j.entitlement.plan === "starter", "second purchase stacks credits");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(b, { payment_status: "unpaid" }), id: sid };
  r = await claim(b, sid); ok(r.status === 402, "unpaid session rejected");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(a), id: sid };
  r = await claim(b, sid); ok(r.status === 403, "session made for another user rejected");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(b, { amount_total: 777 }), id: sid };
  r = await claim(b, sid); ok(r.status === 400, "unknown amount rejected");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(b, { payment_intent: { id: "pi_r", latest_charge: { refunded: true } } }), id: sid };
  r = await claim(b, sid); ok(r.status === 402, "refunded payment rejected");
  sid = "cs_test_" + rnd(); sessions[sid] = { ...base(b, { client_reference_id: null, customer_details: { email: b.email } }), id: sid };
  r = await claim(b, sid); ok(r.status === 200, "link opened without our id still works when the checkout email matches the account");
  r = await claim(b, "cs_test_" + rnd()); ok(r.status === 404, "unknown session -> 404");
  r = await claim(b, "nope"); ok(r.status === 400, "malformed id -> 400");
  r = await fetch(BASE + "/api/billing/claim", { method: "POST", headers: { "Content-Type": "application/json", Origin: BASE }, body: JSON.stringify({ sessionId: "cs_test_" + rnd() }) }); ok(r.status === 401, "requires sign-in");
} finally { stripe.close(); }
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
