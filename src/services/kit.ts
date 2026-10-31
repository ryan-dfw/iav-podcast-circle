/**
 * Circle Starter access — the client side of the gated kit.
 *
 * The token is the whole mechanism: it arrives in the emailed link, gets kept
 * in this browser so returning on Day 4 doesn't mean digging up the email,
 * and is handed to the functions on each request. There is no account and no
 * session; a valid signature is the only thing that opens anything.
 */
import type { CircleStarterContent, KitIntent } from '@/content';

const TOKEN_KEY = 'circle-starter:token';
const SEEN_KEY = 'circle-starter:verified';

/* Token storage ------------------------------------------------------- */

export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* private browsing — the link in their email still works */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SEEN_KEY);
  } catch {
    /* nothing to clean up */
  }
}

/**
 * True the first time a given token is seen in this browser. Keeps a short
 * list rather than one value, so confirming a book signup doesn't make an
 * earlier kit token look new again (and re-notify Isha for it).
 */
function markVerified(token: string): boolean {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const seen: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (seen.includes(token)) return false;
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, token].slice(-10)));
    return true;
  } catch {
    return true;
  }
}

/* API ----------------------------------------------------------------- */

export type RequestResult = { status: 'sent' } | { status: 'invalid-email' } | { status: 'error' };

/** Asks for a link to be emailed. Says nothing about whether it arrived. */
export async function requestKitLink(email: string, intent: KitIntent = 'kit'): Promise<RequestResult> {
  try {
    const res = await fetch('/api/kit-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, intent, website: '' }),
    });
    if (res.ok) return { status: 'sent' };
    if (res.status === 400) return { status: 'invalid-email' };
    return { status: 'error' };
  } catch {
    return { status: 'error' };
  }
}

export type ContentResult =
  | { status: 'ok'; content: CircleStarterContent }
  | { status: 'unauthorized' }
  | { status: 'error' };

/** Fetched once per token and kept for the session, so page flips are instant. */
const cache = new Map<string, CircleStarterContent>();

export async function fetchKitContent(token: string): Promise<ContentResult> {
  const cached = cache.get(token);
  if (cached) return { status: 'ok', content: cached };

  try {
    const res = await fetch('/api/kit-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (res.status === 401) return { status: 'unauthorized' };
    if (!res.ok) return { status: 'error' };

    const { content } = (await res.json()) as { content: CircleStarterContent };
    cache.set(token, content);
    return { status: 'ok', content };
  } catch {
    return { status: 'error' };
  }
}

/**
 * Tells the server an address has proven itself, so Isha hears about it —
 * once per browser, and never blocking the reader if it fails.
 */
export function verifyOnce(token: string): void {
  if (!markVerified(token)) return;
  void fetch('/api/kit-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  }).catch(() => {
    /* she'll miss one notification; the reader shouldn't care */
  });
}
