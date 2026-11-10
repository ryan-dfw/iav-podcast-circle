/**
 * POST /api/cms-rebuild   Authorization: Bearer <Firebase ID token>
 *
 * Studio calls this after publishing so the site rebuilds from Firestore.
 * The build hook URL can start a deploy on its own, so it lives only here,
 * behind the editor check.
 *
 * Env, set per deploy context so a branch deploy rebuilds its own branch
 * against the dev Firebase project: CMS_BUILD_HOOK_URL, plus what
 * _lib/editor.ts needs.
 */
import { json, requireEditor } from './_lib/editor';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const editor = await requireEditor(req, ['CMS_BUILD_HOOK_URL']);
  if (editor instanceof Response) return editor;

  const hook = process.env.CMS_BUILD_HOOK_URL!;
  const res = await fetch(`${hook}?trigger_title=${encodeURIComponent(`Studio publish (${editor.email})`)}`, {
    method: 'POST',
  });
  if (!res.ok) {
    console.error('cms-rebuild: build hook failed', res.status, await res.text());
    return json(502, { error: 'hook_failed' });
  }
  return json(202, { ok: true });
};

export const config = { path: '/api/cms-rebuild' };
