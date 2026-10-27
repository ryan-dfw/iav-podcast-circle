import type { Quote } from '@/content/types';
import {
  paintQuote,
  QUOTE_FONT_FACES,
  QUOTE_IMAGE_PRESETS,
  type QuoteImagePreset,
  type QuotePalette,
} from './quoteImageCore';

/**
 * Browser side of the quote image: supplies the palette and fonts the shared
 * painter needs, then hands back a PNG ready for the share sheet.
 */

export { QUOTE_IMAGE_PRESETS };
export type { QuoteImagePreset };

/** Palette comes from the design tokens so the image can't drift from the site. */
function palette(): QuotePalette {
  const computed = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => computed.getPropertyValue(name).trim() || fallback;
  return {
    navy: read('--navy', '#0a1a2f'),
    cream: read('--cream', '#f7f4ef'),
    blush: read('--blush', '#f4c9d8'),
    lavender: read('--lavender', '#c7b7d9'),
    mauve: read('--rose-mauve', '#d9a6b8'),
    grayBlue: read('--gray-blue', '#8fa6c9'),
  };
}

/**
 * The webfonts must be loaded before anything is painted — canvas silently
 * substitutes a system font for a face the document hasn't used yet.
 */
export async function loadQuoteImageFonts(): Promise<void> {
  await Promise.all(QUOTE_FONT_FACES.map((face) => document.fonts.load(face).catch(() => undefined)));
  await document.fonts.ready;
}

export interface DrawOptions {
  preset?: QuoteImagePreset;
  wordmark?: string | false;
}

/** Paints `quote` onto `canvas`, sizing the canvas to the chosen preset. */
export function drawQuoteImage(canvas: HTMLCanvasElement, quote: Quote, options: DrawOptions = {}): void {
  const preset = options.preset ?? 'square';
  const { width, height } = QUOTE_IMAGE_PRESETS[preset];
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  paintQuote(ctx, quote, { ...options, preset, palette: palette() });
}

/** Renders the quote and resolves to a PNG file ready for sharing or download. */
export async function quoteImageFile(quote: Quote, options: DrawOptions = {}): Promise<File> {
  await loadQuoteImageFonts();
  const canvas = document.createElement('canvas');
  drawQuoteImage(canvas, quote, options);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not render the quote image.');
  const name = `iav-quote-${String(quote.number).padStart(2, '0')}.png`;
  return new File([blob], name, { type: 'image/png' });
}
