/**
 * GET /media/<key> — images uploaded through Studio (see cms-media.ts).
 *
 * Keys are content hashes, so a response never changes: browsers and
 * Netlify's CDN may keep it for a year, and the function itself runs only
 * the first time each image is requested at each CDN node.
 */
import { getStore } from '@netlify/blobs';

const IMMUTABLE = 'public, max-age=31536000, immutable';

export default async (_req: Request, context: { params: Record<string, string | undefined> }): Promise<Response> => {
  const key = context.params.key ?? '';
  if (!/^[a-f0-9]{32}\.(webp|jpg|png)$/.test(key)) return new Response('Not found', { status: 404 });

  const found = await getStore('media').getWithMetadata(key, { type: 'arrayBuffer' });
  if (!found) return new Response('Not found', { status: 404 });

  return new Response(found.data, {
    headers: {
      'Content-Type': String(found.metadata.contentType ?? 'application/octet-stream'),
      'Cache-Control': IMMUTABLE,
      'Netlify-CDN-Cache-Control': `${IMMUTABLE}, durable`,
    },
  });
};

export const config = { path: '/media/:key' };
