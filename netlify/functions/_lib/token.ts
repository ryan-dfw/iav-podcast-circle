/**
 * Self-validating access tokens — HMAC-signed, so there's nothing to store.
 *
 * A token is `base64url(payload).base64url(signature)`. The payload carries
 * the verified email and when it was issued; the signature is HMAC-SHA256 of
 * the payload under CIRCLE_KIT_SECRET. Verifying is a pure function of the
 * token and the secret: no database, no session, nothing to back up or leak.
 *
 * Tokens do not expire, by design — the journal is a seven-day exercise people
 * come back to, and a window short enough to matter would mostly lock out
 * honest readers. Rotating CIRCLE_KIT_SECRET invalidates every token at once,
 * which is the intended "revoke everything" lever.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { KitIntent } from '../../../src/content/circleStarterTypes';

export interface TokenPayload {
  /** Verified email address, normalized. */
  e: string;
  /** Issued-at, epoch ms — recorded for diagnostics, not enforced. */
  i: number;
  /** What they asked for. Absent on tokens issued before intents existed. */
  k: KitIntent;
}

const b64url = (buf: Buffer) => buf.toString('base64url');

function secret(): string {
  const value = process.env.CIRCLE_KIT_SECRET;
  if (!value) throw new Error('CIRCLE_KIT_SECRET is not set');
  return value;
}

function sign(payload: string): string {
  return b64url(createHmac('sha256', secret()).update(payload).digest());
}

/** Lowercased and trimmed, so the same inbox always produces the same token. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Shape check only — proving an address receives mail is the link's job. */
export function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254;
}

export function issueToken(email: string, intent: KitIntent = 'kit'): string {
  const payload = b64url(Buffer.from(JSON.stringify({ e: normalizeEmail(email), i: Date.now(), k: intent })));
  return `${payload}.${sign(payload)}`;
}

/** Returns the payload for a valid token, or null for anything else. */
export function readToken(token: string | null | undefined): TokenPayload | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  let expected: Buffer;
  try {
    expected = Buffer.from(sign(payload), 'utf8');
  } catch {
    return null;
  }
  const given = Buffer.from(signature, 'utf8');
  // Equal lengths first: timingSafeEqual throws on a mismatch.
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload;
    if (typeof parsed?.e !== 'string' || !looksLikeEmail(parsed.e)) return null;
    // Links already in inboxes predate intents — they were all for the kit.
    return { ...parsed, k: parsed.k === 'book' ? 'book' : 'kit' };
  } catch {
    return null;
  }
}
