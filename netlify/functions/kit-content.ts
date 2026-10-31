/**
 * POST /api/kit-content  { token }  ->  the journal
 *
 * POST rather than GET so the token stays out of access logs and referrer
 * headers. All ten pages come back in one response: the gate is the token,
 * not the page count, and shipping it whole means flipping pages afterwards
 * costs nothing.
 */
import { readToken } from './_lib/token';
import { circleStarterContent } from './_lib/content';

const json = (status: number, body: unknown, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  let token: unknown;
  try {
    token = ((await req.json()) as { token?: unknown }).token;
  } catch {
    return json(400, { error: 'bad_request' });
  }

  if (!readToken(typeof token === 'string' ? token : null)) {
    return json(401, { error: 'invalid_token' });
  }

  // Private: this response is specific to a token, so no shared cache should
  // ever hold it.
  return json(200, { content: circleStarterContent }, { 'Cache-Control': 'private, no-store' });
};

export const config = { path: '/api/kit-content' };
