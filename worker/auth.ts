import type { MeResponse, User } from "../lib/api-types";
import { ensureSchema, getEntitlement } from "./lib/db";
import { b64url, Ctx, DAY_MS, Env, fromHex, HttpError, json, noContent, parseCookies, readJson, sha256Hex, timingSafeEqual, toHex, utf8 } from "./lib/util";

const COOKIE = "onepageforge_session";
const SESSION_DAYS = 30;
const PBKDF2_ITER = 100_000;
const RL_WINDOW_MS = 15 * 60_000;
const RL_MAX = 10;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", utf8(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

interface UserRow { id: string; email: string; name: string; password_hash: string; salt: string; iterations: number; created_at: number }
const toUser = (r: UserRow): User => ({ id: r.id, name: r.name, email: r.email, createdAt: r.created_at });

export function sessionCookie(token: string, secure: boolean, maxAge = SESSION_DAYS * 86400): string {
  return `${COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export async function currentUser(env: Env, request: Request): Promise<UserRow | null> {
  const token = parseCookies(request.headers.get("cookie"))[COOKIE];
  if (!token || token.length < 20 || token.length > 100) return null;
  const hash = await sha256Hex(token);
  return env.DB.prepare(
    `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?`,
  ).bind(hash, Date.now()).first<UserRow>();
}

export async function requireUser(c: Ctx): Promise<UserRow> {
  const u = await currentUser(c.env, c.request);
  if (!u) throw new HttpError(401, "unauthorized", "Please sign in.");
  return u;
}

async function createSession(env: Env, userId: string): Promise<string> {
  const tok = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const now = Date.now();
  await env.DB.prepare(`INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?,?,?,?)`)
    .bind(await sha256Hex(tok), userId, now + SESSION_DAYS * DAY_MS, now).run();
  return tok;
}

async function me(env: Env, u: UserRow): Promise<MeResponse> {
  return { user: toUser(u), entitlement: await getEntitlement(env, u.id) };
}

export async function rateLimit(c: Ctx, action: string, email: string, max = RL_MAX): Promise<string> {
  const key = `${action}:${await sha256Hex(`${c.ip}|${email}`)}`.slice(0, 80);
  const now = Date.now();
  const row = await c.env.DB.prepare(
    `INSERT INTO login_attempts (key, window_start, count) VALUES (?, ?, 1)
     ON CONFLICT(key) DO UPDATE SET
       count = CASE WHEN window_start < ?3 THEN 1 ELSE count + 1 END,
       window_start = CASE WHEN window_start < ?3 THEN ?2 ELSE window_start END
     RETURNING count, window_start`,
  ).bind(key, now, now - RL_WINDOW_MS).first<{ count: number; window_start: number }>();
  if (row && row.count > max) {
    const retry = Math.max(1, Math.ceil((row.window_start + RL_WINDOW_MS - now) / 1000));
    throw new HttpError(429, "rate_limited", "Too many attempts. Try again later.", { "Retry-After": String(retry) });
  }
  return key;
}

export async function signup(c: Ctx): Promise<Response> {
  const b = await readJson(c.request);
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const name = typeof b.name === "string" ? b.name.trim().replace(/\s+/g, " ") : "";
  const password = typeof b.password === "string" ? b.password : "";
  if (!name || name.length > 80) throw new HttpError(400, "invalid_name", "Enter your name (max 80 characters).");
  if (!EMAIL_RE.test(email) || email.length > 254) throw new HttpError(400, "invalid_email", "Enter a valid email address.");
  if (password.length < 8) throw new HttpError(400, "weak_password", "Password must be at least 8 characters.");
  if (password.length > 200) throw new HttpError(400, "invalid_password", "Password is too long.");
  await rateLimit(c, "signup", email);
  const exists = await c.env.DB.prepare(`SELECT 1 AS x FROM users WHERE email = ?`).bind(email).first();
  if (exists) throw new HttpError(409, "email_taken", "An account with this email already exists.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt, PBKDF2_ITER);
  const id = crypto.randomUUID();
  const now = Date.now();
  try {
    await c.env.DB.prepare(`INSERT INTO users (id, email, name, password_hash, salt, iterations, created_at) VALUES (?,?,?,?,?,?,?)`)
      .bind(id, email, name, toHex(hash), toHex(salt), PBKDF2_ITER, now).run();
  } catch {
    throw new HttpError(409, "email_taken", "An account with this email already exists.");
  }
  const tok = await createSession(c.env, id);
  const user = (await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first<UserRow>())!;
  return json(await me(c.env, user), 201, { "Set-Cookie": sessionCookie(tok, c.url.protocol === "https:") });
}

export async function login(c: Ctx): Promise<Response> {
  const b = await readJson(c.request);
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase().slice(0, 254) : "";
  const password = typeof b.password === "string" ? b.password.slice(0, 200) : "";
  const key = await rateLimit(c, "login", email);
  const row = email ? await c.env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first<UserRow>() : null;
  const salt = row ? fromHex(row.salt)! : new Uint8Array(16);
  const calc = await pbkdf2(password, salt, row ? row.iterations : PBKDF2_ITER);
  const ok = !!row && timingSafeEqual(calc, fromHex(row.password_hash) ?? new Uint8Array(0));
  if (!ok || !row) throw new HttpError(401, "invalid_credentials", "Incorrect email or password.");
  await c.env.DB.prepare(`DELETE FROM login_attempts WHERE key = ?`).bind(key).run();
  const tok = await createSession(c.env, row.id);
  return json(await me(c.env, row), 200, { "Set-Cookie": sessionCookie(tok, c.url.protocol === "https:") });
}

export async function logout(c: Ctx): Promise<Response> {
  const token = parseCookies(c.request.headers.get("cookie"))[COOKIE];
  if (token) await c.env.DB.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(await sha256Hex(token)).run();
  return noContent({ "Set-Cookie": sessionCookie("", c.url.protocol === "https:", 0) });
}

export async function getMe(c: Ctx): Promise<Response> {
  return json(await me(c.env, await requireUser(c)));
}

export async function deleteAccount(c: Ctx): Promise<Response> {
  const u = await requireUser(c);
  await c.env.DB.batch([
    c.env.DB.prepare(`UPDATE purchases SET user_id = NULL WHERE user_id = ?`).bind(u.id),
    c.env.DB.prepare(`DELETE FROM sessions WHERE user_id = ?`).bind(u.id),
    c.env.DB.prepare(`DELETE FROM generated_sites WHERE user_id = ?`).bind(u.id),
    c.env.DB.prepare(`DELETE FROM entitlements WHERE user_id = ?`).bind(u.id),
    c.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(u.id),
  ]);
  return noContent({ "Set-Cookie": sessionCookie("", c.url.protocol === "https:", 0) });
}

export { ensureSchema };
