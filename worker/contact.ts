import type { ContactRequest } from "../lib/api-types";
import { rateLimit } from "./auth";
import { Ctx, HttpError, json, readJson } from "./lib/util";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;
const MAX_PER_WINDOW = 5;

/** Contact form: stores the message for the admin back office (/admin). Messages are purged after 12 months by the cron. */
export async function contact(c: Ctx): Promise<Response> {
  const b = await readJson<Partial<ContactRequest>>(c.request, 16 * 1024);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  // Honeypot: real visitors never fill the hidden "website" field. Pretend success so bots move on.
  if (str(b.website)) return json({ ok: true });
  const name = str(b.name).replace(/\s+/g, " ");
  const email = str(b.email).toLowerCase();
  const subject = str(b.subject);
  const message = str(b.message);
  if (!name || name.length > 80) throw new HttpError(400, "invalid_name", "Enter your name (max 80 characters).");
  if (!EMAIL_RE.test(email) || email.length > 254) throw new HttpError(400, "invalid_email", "Enter a valid email address.");
  if (!subject || subject.length > 80) throw new HttpError(400, "invalid_subject", "Please choose a subject.");
  if (!message || message.length > 5000) throw new HttpError(400, "invalid_message", "Enter a message (max 5000 characters).");
  await rateLimit(c, "contact", "", MAX_PER_WINDOW);
  await c.env.DB.prepare(`INSERT INTO contact_messages (id, name, email, subject, message, created_at) VALUES (?,?,?,?,?,?)`)
    .bind(crypto.randomUUID(), name, email, subject, message, Date.now()).run();
  return json({ ok: true });
}
