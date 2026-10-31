/**
 * POST /api/kit-request  { email }
 *
 * Issues a token and mails the link. Deliberately says nothing about whether
 * the send succeeded for a given address, and never notifies Isha here — an
 * address only reaches her once it has proven it receives mail by following
 * the link (see kit-verify). That's the whole point of the round trip: she
 * asked for verified emails, not for whatever someone typed in a box.
 */
import { issueToken, looksLikeEmail, normalizeEmail } from './_lib/token';
import type { KitIntent } from '../../src/content/circleStarterTypes';
import { notifyOwner, sendKitLink } from './_lib/mail';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/**
 * Which host to put in the emailed link.
 *
 * At function runtime Netlify only guarantees URL, SITE_NAME and SITE_ID — and
 * URL is always the production address, so on a Deploy Preview it would email
 * links pointing at the live site instead of the preview being tested.
 * DEPLOY_PRIME_URL and CONTEXT aren't dependable here, so the request's own
 * origin is the honest answer. It's only trusted for hosts that could actually
 * be us, so a spoofed Host header can't redirect the link somewhere else.
 */
function siteUrl(req: Request): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const canonical = (process.env.URL || '').replace(/\/$/, '');
  const origin = new URL(req.url).origin;
  const host = new URL(origin).hostname;
  const canonicalHost = canonical ? new URL(canonical).hostname : '';

  const isOurs =
    host === canonicalHost ||
    host.endsWith('.netlify.app') ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]';

  return isOurs ? origin : canonical || origin;
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let email: unknown;
  let trap: unknown;
  let intent: KitIntent = 'kit';
  try {
    const body = (await req.json()) as { email?: unknown; website?: unknown; intent?: unknown };
    email = body.email;
    trap = body.website;
    if (body.intent === 'book') intent = 'book';
  } catch {
    return json(400, { error: 'bad_request' });
  }

  // Honeypot: a real person never fills a field they can't see.
  if (typeof trap === 'string' && trap.trim() !== '') return json(200, { ok: true });

  if (typeof email !== 'string' || !looksLikeEmail(email.trim())) {
    return json(400, { error: 'invalid_email' });
  }

  const address = normalizeEmail(email);

  // The book list has nothing to deliver yet, so there's no link to click and
  // nothing for a round trip to prove — Isha just hears about it now. Only the
  // kit, which hands over real content, is worth making someone verify.
  if (intent === 'book') {
    const told = await notifyOwner(address, 'book');
    if (!told.ok) {
      console.error('kit-request: notify failed', told.error);
      return json(502, { error: 'send_failed' });
    }
    return json(200, { ok: true });
  }

  const token = encodeURIComponent(issueToken(address, intent));
  const sent = await sendKitLink(address, `${siteUrl(req)}/circle-starter/1?t=${token}`);
  if (!sent.ok) {
    // Logged for us, generic for them — the visitor can't fix our mail config.
    console.error('kit-request: send failed', sent.error);
    return json(502, { error: 'send_failed' });
  }

  return json(200, { ok: true });
};

export const config = { path: '/api/kit-request' };
