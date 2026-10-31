/**
 * POST /api/kit-verify  { token }
 *
 * Called once per browser, the first time someone arrives with a token in the
 * URL. A valid signature here means the address received the mail and someone
 * opened it, so this is the moment Isha hears about it.
 *
 * Without storage there's no way to know an address is genuinely new, so the
 * client only calls this when it hasn't already stored the token locally.
 * Opening the same link on a second device notifies twice — acceptable noise
 * for a free kit, and the alternative is a database she didn't want.
 */
import { readToken } from './_lib/token';
import { notifyOwner } from './_lib/mail';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let token: unknown;
  try {
    token = ((await req.json()) as { token?: unknown }).token;
  } catch {
    return json(400, { error: 'bad_request' });
  }

  const payload = readToken(typeof token === 'string' ? token : null);
  if (!payload) return json(401, { error: 'invalid_token' });

  const notified = await notifyOwner(payload.e, payload.k);
  if (!notified.ok) {
    // The reader shouldn't be blocked because our notification failed.
    console.error('kit-verify: notify failed', notified.error);
  }

  return json(200, { ok: true, intent: payload.k });
};

export const config = { path: '/api/kit-verify' };
