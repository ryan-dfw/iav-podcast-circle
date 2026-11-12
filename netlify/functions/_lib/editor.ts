/**
 * Shared by the Studio functions: accept a request only when it carries a
 * Firebase ID token for one of the editors.
 *
 * Env: VITE_FIREBASE_PROJECT_ID (whose tokens to accept) and CMS_ADMIN_EMAILS
 * (comma-separated; keep in sync with firestore.rules).
 */
import { createRemoteJWKSet, jwtVerify } from 'jose';

export const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Google's signing keys for Firebase ID tokens; jose caches them between calls.
const keys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

/** The editor's email, or a ready-to-return error response. */
export async function requireEditor(req: Request, extraEnv: string[] = []): Promise<{ email: string } | Response> {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const admins = (process.env.CMS_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const missing = [
    !projectId && 'VITE_FIREBASE_PROJECT_ID',
    admins.length === 0 && 'CMS_ADMIN_EMAILS',
    ...extraEnv.filter((name) => !process.env[name]),
  ].filter(Boolean);
  if (missing.length) return json(503, { error: 'not_configured', missing });

  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return json(401, { error: 'unauthenticated' });

  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    const email = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    if (payload.email_verified !== true || !admins.includes(email)) return json(403, { error: 'forbidden' });
    return { email };
  } catch {
    return json(401, { error: 'unauthenticated' });
  }
}
