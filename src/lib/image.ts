import type { ImageAsset } from '@/content/types';

/** `srcSet` for an image with a thumb rendition; undefined when there's only one file. */
export function srcSetFor(img: ImageAsset): string | undefined {
  if (!img.thumb || !img.width) return undefined;
  return `${img.thumb.src} ${img.thumb.width}w, ${img.src} ${img.width}w`;
}

/** Smallest file to use as the plain `src` fallback. */
export const defaultSrc = (img: ImageAsset) => img.thumb?.src ?? img.src;
