import type { Env } from "./util";
import { ensureSchema } from "./db";

const DAY = 86_400_000;

export async function purgeExpired(env: Env): Promise<void> {
  await ensureSchema(env);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare(`DELETE FROM contact_messages WHERE created_at < ?`).bind(now - 365 * DAY),
    env.DB.prepare(`DELETE FROM sessions WHERE expires_at < ?`).bind(now),
    env.DB.prepare(`DELETE FROM login_attempts WHERE window_start < ?`).bind(now - DAY),
    env.DB.prepare(`DELETE FROM generated_sites WHERE user_id IN (SELECT user_id FROM entitlements WHERE expires_at < ?)`).bind(now - 30 * DAY),
  ]);
}
