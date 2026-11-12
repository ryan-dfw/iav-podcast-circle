/**
 * POST /api/cms-media   Authorization: Bearer <Firebase ID token>
 * Body: the image bytes; Content-Type: image/webp | image/jpeg | image/png
 *
 * Stores an image Studio has already resized in the browser, in the site's
 * Netlify Blobs store, under a key derived from its content — so the same
 * file uploaded twice is stored once, and a URL never changes meaning, which
 * is what lets /media/* be cached forever. Returns { src: "/media/<key>" }.
 */
import { createHash } from 'node:crypto';
import { getStore } from '@netlify/blobs';
import { json, requireEditor } from './_lib/editor';

const TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX_BYTES = 6 * 1024 * 1024;

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });

  const editor = await requireEditor(req);
  if (editor instanceof Response) return editor;

  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim();
  const ext = TYPES[type];
  if (!ext) return json(415, { error: 'unsupported_type' });

  const bytes = new Uint8Array(await req.arrayBuffer());
  if (bytes.byteLength === 0) return json(400, { error: 'empty' });
  if (bytes.byteLength > MAX_BYTES) return json(413, { error: 'too_large' });

  const key = `${createHash('sha256').update(bytes).digest('hex').slice(0, 32)}.${ext}`;
  await getStore('media').set(key, bytes.buffer as ArrayBuffer, {
    metadata: { contentType: type, uploadedBy: editor.email, uploadedAt: new Date().toISOString() },
  });

  return json(201, { src: `/media/${key}` });
};

export const config = { path: '/api/cms-media' };
