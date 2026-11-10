/**
 * Image upload: the browser resizes to a full rendition (≤1600px wide) and a
 * thumbnail (640px), encodes WebP where it can (JPEG otherwise), and sends
 * both to netlify/functions/cms-media.ts. The result matches `ImageAsset`,
 * so it renders with the site's existing srcset handling.
 */
import type { User } from 'firebase/auth';
import type { ImageAsset } from '@/content/types';

const FULL = 1600;
const THUMB = 640;

async function encode(bitmap: ImageBitmap, maxWidth: number): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser can’t process images.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);

  const as = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  let blob = await as('image/webp');
  // Browsers that can't encode WebP hand back a PNG instead; JPEG is much smaller.
  if (!blob || blob.type !== 'image/webp') blob = await as('image/jpeg');
  if (!blob) throw new Error('Couldn’t process that image.');
  return { blob, width, height };
}

async function upload(user: User, blob: Blob): Promise<string> {
  const res = await fetch('/api/cms-media', {
    method: 'POST',
    headers: { Authorization: `Bearer ${await user.getIdToken()}`, 'Content-Type': blob.type },
    body: blob,
  });
  const body = (await res.json().catch(() => ({}))) as { src?: string; error?: string; missing?: string[] };
  if (res.ok && body.src) return body.src;
  if (body.error === 'not_configured') throw new Error(`Image uploads aren’t configured here (missing ${body.missing?.join(', ')}).`);
  if (body.error === 'too_large') throw new Error('That image is too large, even after resizing.');
  if (res.status === 404) throw new Error('The upload service isn’t running here. Use `netlify dev` locally.');
  throw new Error(`Upload failed (${res.status}).`);
}

export async function uploadImage(user: User, file: File, alt: string): Promise<ImageAsset> {
  if (!file.type.startsWith('image/')) throw new Error('That file isn’t an image.');
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const full = await encode(bitmap, FULL);
    const src = await upload(user, full.blob);
    const asset: ImageAsset = { src, alt, width: full.width, height: full.height };
    if (full.width > THUMB) {
      const thumb = await encode(bitmap, THUMB);
      asset.thumb = { src: await upload(user, thumb.blob), width: thumb.width };
    }
    return asset;
  } finally {
    bitmap.close();
  }
}
