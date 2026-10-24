import { ensureSchema } from "./lib/db";
import { devCorsOrigin, originAllowed } from "./lib/origin";
import { redirectTarget } from "./lib/redirect";
import { Ctx, Env, HttpError, json } from "./lib/util";
import * as auth from "./auth";
import { claim, webhook } from "./stripe";
import * as admin from "./admin";
import { contact } from "./contact";
import * as gen from "./generate";

export { redirectTarget };

type Handler = (c: Ctx) => Promise<Response>;
const routes: [string, RegExp, Handler][] = [];
const add = (m: string, p: string, h: Handler) => routes.push([m, new RegExp("^" + p.replace(/:(\w+)/g, "(?<$1>[A-Za-z0-9_-]{1,64})") + "/?$"), h]);

add("GET", "/api/health", async (c) => json({ ok: true, ai: !!c.env.AI, billing: !!c.env.STRIPE_SECRET_KEY }));
add("GET", "/api/admin/overview", admin.overview);
add("POST", "/api/admin/grant", admin.grant);
add("POST", "/api/admin/revoke", admin.revoke);
add("POST", "/api/auth/signup", auth.signup);
add("POST", "/api/auth/login", auth.login);
add("POST", "/api/auth/logout", auth.logout);
add("GET", "/api/me", auth.getMe);
add("DELETE", "/api/account", auth.deleteAccount);
add("POST", "/api/stripe/webhook", webhook);
add("POST", "/api/billing/claim", claim);
add("POST", "/api/contact", contact);
add("POST", "/api/admin/message-done", admin.messageDone);
add("POST", "/api/generate", gen.generate);
add("GET", "/api/sites", gen.listSites);
add("GET", "/api/sites/:id", gen.getSite);
add("DELETE", "/api/sites/:id", gen.deleteSite);
add("GET", "/s/:slug", gen.serveSite);

const SECURITY: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function finish(res: Response, extra: Record<string, string> = {}): Response {
  const r = new Response(res.body, res);
  for (const [k, v] of Object.entries({ ...SECURITY, ...extra })) r.headers.set(k, v);
  return r;
}

async function handleApi(request: Request, env: Env, url: URL, ctx: ExecutionContext): Promise<Response> {
  const origin = request.headers.get("origin");
  const cors: Record<string, string> = {};
  const dev = devCorsOrigin(url, origin);
  if (dev) Object.assign(cors, { "Access-Control-Allow-Origin": dev, "Access-Control-Allow-Credentials": "true", Vary: "Origin" });
  if (request.method === "OPTIONS") {
    if (!dev) return finish(new Response(null, { status: 204 }));
    return finish(new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" } }));
  }
  try {
    const isWebhook = url.pathname.replace(/\/$/, "") === "/api/stripe/webhook";
    if (request.method !== "GET" && request.method !== "HEAD" && !isWebhook && !originAllowed(url, origin, request.headers.get("sec-fetch-site"))) {
      throw new HttpError(403, "forbidden_origin", "Cross-origin request blocked.");
    }
    let match: [Handler, Record<string, string>] | null = null; let pathKnown = false;
    for (const [m, re, h] of routes) {
      const r = re.exec(url.pathname);
      if (!r) continue;
      pathKnown = true;
      if (m === request.method) { match = [h, r.groups ?? {}]; break; }
    }
    if (!match) throw pathKnown ? new HttpError(405, "method_not_allowed", "Method not allowed.") : new HttpError(404, "not_found", "Unknown API route.");
    if (!url.pathname.startsWith("/api/health")) await ensureSchema(env);
    const ip = request.headers.get("cf-connecting-ip") || "local";
    const res = await match[0]({ env, request, url, params: match[1], ip, waitUntil: (p) => ctx.waitUntil(p) });
    return finish(res, cors);
  } catch (e) {
    if (e instanceof HttpError) return finish(json({ error: e.code, message: e.message }, e.status, e.headers), cors);
    console.log("api_error", e instanceof Error ? e.name : "unknown");
    return finish(json({ error: "server_error", message: "Something went wrong." }, 500), cors);
  }
}

async function handleAsset(request: Request, env: Env, url: URL): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return finish(new Response("Method not allowed", { status: 405 }));
  let res = await env.ASSETS.fetch(request);
  if (res.status >= 300 && res.status < 400 && url.pathname.endsWith(".html")) {
    const loc = res.headers.get("location");
    if (loc) res = await env.ASSETS.fetch(new Request(new URL(loc, url), request));
  }
  const extra: Record<string, string> = {};
  const ct = res.headers.get("content-type") || "";
  if (url.pathname.startsWith("/_next/static/")) extra["Cache-Control"] = "public, max-age=31536000, immutable";
  else if (url.pathname.startsWith("/media/") || url.pathname.startsWith("/images/") || url.pathname.startsWith("/icons/")) extra["Cache-Control"] = "public, max-age=2592000, stale-while-revalidate=86400";
  else if (ct.includes("text/html")) extra["Cache-Control"] = "public, max-age=0, must-revalidate";
  return finish(res, extra);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const target = redirectTarget(url, env.SITE_URL);
    if (target) return Response.redirect(target, 301);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/s/")) return handleApi(request, env, url, ctx);
    return handleAsset(request, env, url);
  },

  async scheduled(_ev: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      await ensureSchema(env);
      const now = Date.now();
      await env.DB.batch([
        env.DB.prepare(`DELETE FROM contact_messages WHERE created_at < ?`).bind(now - 365 * 86_400_000),
        env.DB.prepare(`DELETE FROM sessions WHERE expires_at < ?`).bind(now),
        env.DB.prepare(`DELETE FROM login_attempts WHERE window_start < ?`).bind(now - 86_400_000),
      ]);
    })());
  },
};
