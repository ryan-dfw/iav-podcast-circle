import type { User } from 'firebase/auth';

export type RebuildResult =
  | { ok: true }
  | { ok: false; message: string };

/** Asks Netlify (via netlify/functions/cms-rebuild.ts) to rebuild this deploy's branch. */
export async function requestRebuild(user: User): Promise<RebuildResult> {
  let res: Response;
  try {
    res = await fetch('/api/cms-rebuild', {
      method: 'POST',
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
  } catch {
    return { ok: false, message: 'Couldn’t reach the rebuild service. Check the connection and try again.' };
  }

  let body: { error?: string; missing?: string[] } = {};
  try {
    body = await res.json();
  } catch {
    // Plain `npm run dev` has no functions; the SPA fallback answers instead.
    return { ok: false, message: 'The rebuild endpoint isn’t running here. Use `netlify dev` to run functions locally.' };
  }

  if (res.ok) return { ok: true };
  switch (body.error) {
    case 'not_configured':
      return { ok: false, message: `Rebuilds aren’t configured for this deploy (missing ${body.missing?.join(', ')}).` };
    case 'forbidden':
    case 'unauthenticated':
      return { ok: false, message: 'This account isn’t allowed to rebuild the site.' };
    default:
      return { ok: false, message: `Rebuild failed (${res.status}). Try again in a minute.` };
  }
}
