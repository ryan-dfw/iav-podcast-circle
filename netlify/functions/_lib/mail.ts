/**
 * Outbound mail via Resend's REST API (no SDK — one less dependency).
 *
 * KIT_FROM_EMAIL decides the sending identity. Until a domain is verified in
 * Resend, the default `onboarding@resend.dev` ONLY delivers to the Resend
 * account owner's own address and 403s for everyone else — fine for local
 * testing, useless for real signups. Verifying iavcircle.com and
 * setting KIT_FROM_EMAIL to an address on it is the only change needed; no
 * code here cares which domain it is.
 */

import type { KitIntent } from '../../../src/content/circleStarterTypes';

const ENDPOINT = 'https://api.resend.com/emails';

export interface SendResult {
  ok: boolean;
  /** Present on failure — logged, never shown to the visitor. */
  error?: string;
}

async function send(message: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set' };

  const from = process.env.KIT_FROM_EMAIL || 'IAV Circle <onboarding@resend.dev>';

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 500)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const shell = (body: string) => `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f7f4ef;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#1a1a1a;line-height:1.5">
<div style="max-width:32rem;margin:0 auto">${body}
<p style="margin-top:32px;font-size:12px;color:#4a5568">IAV Podcast Circle · Let’s Talk for a Bit</p>
</div></body></html>`;

/** The link IS the verification: following it proves the inbox is real. */
export function sendKitLink(to: string, link: string): Promise<SendResult> {
  const subject = 'Your Circle Starter journal';
  const text = [
    'Here’s your copy of The Circle Starter — 7 Days to Find Your Gift and Your People.',
    '',
    `Open it here: ${link}`,
    '',
    'Keep this email — the same link brings you back to your journal any time, on any device.',
    '',
    '— Isha',
  ].join('\n');

  const html = shell(`
<h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0a1a2f">Your Circle Starter journal</h1>
<p style="margin:0 0 16px">Here’s your copy of <strong>The Circle Starter — 7 Days to Find Your Gift and Your People</strong>.</p>
<p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:6px;background:#0a1a2f;color:#f7f4ef;text-decoration:none;font-weight:500">Open the journal</a></p>
<p style="margin:0 0 8px;font-size:14px;color:#4a5568">Keep this email — the same link brings you back to your journal any time, on any device.</p>
<p style="margin:16px 0 0">— Isha</p>`);

  return send({ to, subject, text, html });
}

/** What Isha sees in her inbox — the subject line carries the whole story. */
const INTENT_PHRASE: Record<KitIntent, string> = {
  kit: 'got the free kit',
  book: 'wants the book',
};

/** Sent only once the address has proven itself, so this inbox stays clean. */
export function notifyOwner(subscriber: string, intent: KitIntent = 'kit'): Promise<SendResult> {
  const to = process.env.KIT_NOTIFY_EMAIL;
  if (!to) return Promise.resolve({ ok: false, error: 'KIT_NOTIFY_EMAIL is not set' });

  const line = `${subscriber} ${INTENT_PHRASE[intent]}`;
  const when = new Date().toISOString();
  const note =
    intent === 'kit'
      ? 'Verified — they clicked the link we emailed, so this address receives mail.'
      : 'Typed into the form on the book page. Not verified, so the address could contain a typo.';

  return send({
    to,
    subject: line,
    text: `${line}\n\n${note} ${when}`,
    html: shell(
      `<h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#0a1a2f">${line}</h1>
<p style="margin:0;font-size:14px;color:#4a5568">${note} ${when}</p>`,
    ),
  });
}
