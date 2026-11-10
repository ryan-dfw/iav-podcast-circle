/**
 * POST /api/cms-rebuild   Authorization: Bearer <Firebase ID token>
 *
 * Studio calls this after publishing so the site rebuilds from Firestore.
 * The build hook URL can start a deploy on its own, so it lives only here,
 * behind a check that the caller is signed in as one of the editors.
 *
 * Env (set per deploy context in Netlify, so a branch deploy rebuilds its own
 * branch against the dev Firebase project):
 *   VITE_FIREBASE_PROJECT_ID  — the project whose ID tokens are accepted
 *   CMS_BUILD_HOOK_URL        — build hook for this context's branch
 *   CMS_ADMIN_EMAILS          — comma-separated; keep in sync with firestore.rules
 */
import { createRemoteJWKSet, jwtVerify } from 'jose';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// Google's signing keys for Firebase ID tokens; jose caches them between calls.
const keys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const hook = process.env.CMS_BUILD_HOOK_URL;
  const admins = (process.env.CMS_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const missing = [
    !projectId && 'VITE_FIREBASE_PROJECT_ID',
    !hook && 'CMS_BUILD_HOOK_URL',
    admins.length === 0 && 'CMS_ADMIN_EMAILS',
  ].filter(Boolean);
  if (missing.length) return json(503, { error: 'not_configured', missing });

  const token = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!token) return json(401, { error: 'unauthenticated' });

  let email: string;
  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    });
    if (payload.email_verified !== true || typeof payload.email !== 'string') {
      return json(403, { error: 'forbidden' });
    }
    email = payload.email.toLowerCase();
  } catch {
    return json(401, { error: 'unauthenticated' });
  }
  if (!admins.includes(email)) return json(403, { error: 'forbidden' });

  const res = await fetch(`${hook}?trigger_title=${encodeURIComponent(`Studio publish (${email})`)}`, {
    method: 'POST',
  });
  if (!res.ok) {
    console.error('cms-rebuild: build hook failed', res.status, await res.text());
    return json(502, { error: 'hook_failed' });
  }
  return json(202, { ok: true });
};

export const config = { path: '/api/cms-rebuild' };
