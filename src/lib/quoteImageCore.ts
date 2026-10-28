import type { Quote } from '@/content/types';

/**
 * Painting a quote onto a 2D canvas, with no reference to the DOM.
 *
 * The same code runs in two places: in the browser for the share/download
 * button, and in Node (via @napi-rs/canvas) during the build, to generate the
 * preview images link unfurls use. Anything environment-specific — reading the
 * palette from CSS custom properties, loading webfonts — is supplied by the
 * caller rather than reached for here.
 */

export const QUOTE_IMAGE_PRESETS = {
  square: { width: 1080, height: 1080 },
  story: { width: 1080, height: 1920 },
} as const;

export type QuoteImagePreset = keyof typeof QUOTE_IMAGE_PRESETS;

export const QUOTE_FONTS = {
  serif: '"Cormorant Garamond", Georgia, serif',
  sans: '"Inter Variable", Inter, system-ui, sans-serif',
  script: 'Caveat, cursive',
};

/** The faces the image needs, so each environment can make sure they're loaded. */
export const QUOTE_FONT_FACES = [
  `700 150px ${QUOTE_FONTS.serif}`,
  `italic 500 42px ${QUOTE_FONTS.serif}`,
  `600 22px ${QUOTE_FONTS.sans}`,
  `600 64px ${QUOTE_FONTS.script}`,
];

export interface QuotePalette {
  navy: string;
  cream: string;
  blush: string;
  lavender: string;
  mauve: string;
  grayBlue: string;
}

interface TextMetricsLike {
  width: number;
  actualBoundingBoxAscent: number;
  actualBoundingBoxDescent: number;
}

interface GradientLike {
  addColorStop(offset: number, color: string): void;
}

/**
 * The slice of the 2D context this module uses. Typed structurally so both the
 * browser's CanvasRenderingContext2D and @napi-rs/canvas's context satisfy it.
 */
export interface DrawingContext {
  font: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fillStyle: any;
  textAlign: any;
  textBaseline: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  measureText(text: string): TextMetricsLike;
  fillText(text: string, x: number, y: number): void;
  fillRect(x: number, y: number, width: number, height: number): void;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): GradientLike;
  save(): void;
  restore(): void;
  translate(x: number, y: number): void;
  scale(x: number, y: number): void;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
  arc(x: number, y: number, radius: number, start: number, end: number): void;
  fill(): void;
}

/* ------------------------------------------------------------------ */
/* Starfield                                                           */
/* ------------------------------------------------------------------ */

/** Deterministic PRNG, so a given quote always gets the same sky. */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface QuoteStar {
  /** Position as a percentage of the card, so any size renders the same sky. */
  x: number;
  y: number;
  /** Diameter in px at a 1080px-wide reference. */
  size: number;
  opacity: number;
  /** Larger four-point sparkles, as in the client's artwork. */
  sparkle: boolean;
  /** Seconds, for the web card's twinkle. */
  delay: number;
}

/**
 * The night sky behind a quote. Seeded by the quote's number, so each quote
 * gets its own arrangement and that arrangement never moves — which matters
 * once quotes are generated rather than hand-placed.
 */
export function quoteStars(seed: number, dots = 64, sparkles = 5): QuoteStar[] {
  const rand = mulberry32(seed * 2654435761);
  const stars: QuoteStar[] = [];

  for (let i = 0; i < dots; i += 1) {
    const roll = rand();
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: roll > 0.93 ? 3 : roll > 0.7 ? 2.2 : 1.4,
      opacity: 0.3 + rand() * 0.5,
      sparkle: false,
      delay: rand() * 6,
    });
  }

  // Sparkles keep clear of the middle, where the quote itself sits.
  for (let i = 0; i < sparkles; i += 1) {
    let x = 0;
    let y = 0;
    for (let attempt = 0; attempt < 12; attempt += 1) {
      x = rand() * 100;
      y = rand() * 100;
      if (x < 22 || x > 78 || y < 20 || y > 80) break;
    }
    stars.push({ x, y, size: 14 + rand() * 10, opacity: 0.55 + rand() * 0.3, sparkle: true, delay: rand() * 7 });
  }

  return stars;
}

/** The four-point sparkle, traced directly so no Path2D is needed. */
function traceSparkle(ctx: DrawingContext, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x - size / 2, y - size / 2);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.bezierCurveTo(10.9, 7, 13, 9.1, 20, 10);
  ctx.bezierCurveTo(13, 10.9, 10.9, 13, 10, 20);
  ctx.bezierCurveTo(9.1, 13, 7, 10.9, 0, 10);
  ctx.bezierCurveTo(7, 9.1, 9.1, 7, 10, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Paints the sky onto an already-filled background. */
function drawStars(ctx: DrawingContext, stars: QuoteStar[], W: number, H: number, s: number, color: string) {
  for (const star of stars) {
    const x = (star.x / 100) * W;
    const y = (star.y / 100) * H;
    ctx.fillStyle = withAlpha(color, Number(star.opacity.toFixed(3)));
    if (star.sparkle) {
      traceSparkle(ctx, x, y, star.size * s);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, (star.size * s) / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** `#rrggbb` → `rgb(r g b / a)`, for the gradients' transparent stop. */
export function withAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  if (hex.length !== 6) return color;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

/** Draws text with letter-spacing, centred on `centerX`. Canvas has no tracking. */
function drawTracked(ctx: DrawingContext, text: string, centerX: number, y: number, spacing: number) {
  const chars = [...text];
  const width = chars.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) + spacing * (chars.length - 1);
  let x = centerX - width / 2;
  ctx.textAlign = 'left';
  for (const ch of chars) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + spacing;
  }
}

function wrapWords(ctx: DrawingContext, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

interface Beat {
  word: string;
  punctuation: string;
}

function parseBeats(beats: string[]): Beat[] {
  return beats.map((beat) => {
    const match = beat.match(/[.!?…]+$/);
    return match ? { word: beat.slice(0, -match[0].length), punctuation: match[0] } : { word: beat, punctuation: '' };
  });
}

const beatWidth = (ctx: DrawingContext, beat: Beat) =>
  ctx.measureText(beat.word).width + ctx.measureText(beat.punctuation).width;

/** Splits each beat into word tokens, the closing punctuation riding the last word. */
function toWords(beats: Beat[]): Beat[] {
  return beats.flatMap((beat) => {
    const words = beat.word.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [beat];
    return words.map((word, i) => ({
      word,
      punctuation: i === words.length - 1 ? beat.punctuation : '',
    }));
  });
}

/**
 * Short staccato beats ("Wait." "Think." "Move.") read best stacked one per
 * line; anything longer is wrapped by word like ordinary prose.
 */
function layOutBeats(ctx: DrawingContext, beats: Beat[], maxWidth: number, gap: number): Beat[][] {
  const staccato = beats.length >= 2 && beats.length <= 4 && beats.every((b) => b.word.length <= 12);
  if (staccato) return beats.map((beat) => [beat]);

  const lines: Beat[][] = [];
  let line: Beat[] = [];
  let width = 0;
  for (const token of toWords(beats)) {
    const w = beatWidth(ctx, token);
    const candidate = line.length ? width + gap + w : w;
    if (line.length && candidate > maxWidth) {
      lines.push(line);
      line = [token];
      width = w;
    } else {
      line = [...line, token];
      width = candidate;
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

/** Largest size at which the beats fit the width and their share of the height. */
function fitBeats(ctx: DrawingContext, beats: Beat[], maxWidth: number, maxHeight: number, start: number) {
  for (let size = start; size >= 32; size -= 2) {
    ctx.font = `700 ${size}px ${QUOTE_FONTS.serif}`;
    const gap = ctx.measureText(' ').width;
    const lines = layOutBeats(ctx, beats, maxWidth, gap);
    const widest = Math.max(
      ...lines.map((line) => line.reduce((sum, b) => sum + beatWidth(ctx, b), 0) + gap * (line.length - 1)),
    );
    const height = lines.length * size * 1.05;
    if (widest <= maxWidth && height <= maxHeight) return { size, gap, lines, height };
  }
  ctx.font = `700 32px ${QUOTE_FONTS.serif}`;
  const gap = ctx.measureText(' ').width;
  const lines = layOutBeats(ctx, beats, maxWidth, gap);
  return { size: 32, gap, lines, height: lines.length * 34 };
}

export interface PaintOptions {
  palette: QuotePalette;
  preset?: QuoteImagePreset;
  /** Small wordmark along the bottom, so the image carries attribution when it travels. */
  wordmark?: string | false;
}

/** Paints `quote` onto an already-sized 2D context. */
export function paintQuote(ctx: DrawingContext, quote: Quote, options: PaintOptions): void {
  const { palette: colors, preset = 'square', wordmark = 'IAV Circle' } = options;
  const { width: W, height: H } = QUOTE_IMAGE_PRESETS[preset];
  const s = W / 1080;

  ctx.fillStyle = colors.navy;
  ctx.fillRect(0, 0, W, H);
  const glow = (x: number, y: number, radius: number, color: string, alpha: number) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, withAlpha(color, alpha));
    gradient.addColorStop(1, withAlpha(color, 0));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
  };
  glow(W - 96 * s, 48 * s, 374 * s, colors.lavender, 0.35);
  glow(84 * s, H - 12 * s, 300 * s, colors.blush, 0.28);
  drawStars(ctx, quoteStars(quote.number), W, H, s, colors.cream);

  const pad = 108 * s;
  const contentW = W - pad * 2;
  const centerX = W / 2;

  const labelSize = 22 * s;
  const numberSize = 29 * s;
  const markSize = 150 * s;
  const restSize = 42 * s;
  const signatureSize = 64 * s;

  ctx.font = `700 ${markSize}px ${QUOTE_FONTS.serif}`;
  const markMetrics = ctx.measureText('“');
  const markH = markMetrics.actualBoundingBoxAscent + markMetrics.actualBoundingBoxDescent;

  const beats = parseBeats(quote.beats);
  const fitted = fitBeats(ctx, beats, contentW, H * 0.44, Math.round(150 * s));

  ctx.font = `italic 500 ${restSize}px ${QUOTE_FONTS.serif}`;
  const restLines = quote.rest ? wrapWords(ctx, quote.rest, contentW * 0.88) : [];
  const restH = restLines.length * restSize * 1.3;

  const gaps = {
    labelToNumber: 10 * s,
    numberToMark: 44 * s,
    markToBeats: 24 * s,
    beatsToRest: 28 * s,
    restToSignature: restLines.length ? 42 * s : 30 * s,
  };

  const total =
    (quote.label ? labelSize + gaps.labelToNumber : 0) +
    numberSize +
    gaps.numberToMark +
    markH +
    gaps.markToBeats +
    fitted.height +
    (restLines.length ? gaps.beatsToRest + restH : 0) +
    gaps.restToSignature +
    signatureSize;

  let y = Math.max(pad, (H - total) / 2);

  ctx.textBaseline = 'top';

  if (quote.label) {
    ctx.font = `600 ${labelSize}px ${QUOTE_FONTS.sans}`;
    ctx.fillStyle = colors.blush;
    drawTracked(ctx, quote.label.toUpperCase(), centerX, y, labelSize * 0.2);
    y += labelSize + gaps.labelToNumber;
  }

  ctx.font = `italic 400 ${numberSize}px ${QUOTE_FONTS.serif}`;
  ctx.fillStyle = colors.grayBlue;
  ctx.textAlign = 'center';
  ctx.fillText(`No. ${quote.number}`, centerX, y);
  y += numberSize + gaps.numberToMark;

  ctx.font = `700 ${markSize}px ${QUOTE_FONTS.serif}`;
  ctx.fillStyle = colors.mauve;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('“', centerX, y + markMetrics.actualBoundingBoxAscent);
  ctx.textBaseline = 'top';
  y += markH + gaps.markToBeats;

  ctx.font = `700 ${fitted.size}px ${QUOTE_FONTS.serif}`;
  const lineHeight = fitted.size * 1.05;
  for (const line of fitted.lines) {
    const lineWidth = line.reduce((sum, beat) => sum + beatWidth(ctx, beat), 0) + fitted.gap * (line.length - 1);
    let x = centerX - lineWidth / 2;
    ctx.textAlign = 'left';
    for (const beat of line) {
      ctx.fillStyle = colors.cream;
      ctx.fillText(beat.word, x, y);
      x += ctx.measureText(beat.word).width;
      if (beat.punctuation) {
        ctx.fillStyle = colors.mauve;
        ctx.fillText(beat.punctuation, x, y);
        x += ctx.measureText(beat.punctuation).width;
      }
      x += fitted.gap;
    }
    y += lineHeight;
  }

  if (restLines.length) {
    y += gaps.beatsToRest - (lineHeight - fitted.size);
    ctx.font = `italic 500 ${restSize}px ${QUOTE_FONTS.serif}`;
    ctx.fillStyle = colors.lavender;
    ctx.textAlign = 'center';
    for (const line of restLines) {
      ctx.fillText(line, centerX, y);
      y += restSize * 1.3;
    }
    y += gaps.restToSignature - restSize * 0.3;
  } else {
    y += gaps.restToSignature;
  }

  ctx.font = `600 ${signatureSize}px ${QUOTE_FONTS.script}`;
  ctx.fillStyle = colors.blush;
  ctx.textAlign = 'center';
  ctx.fillText('— Isha', centerX, y);

  if (wordmark) {
    const markTextSize = 19 * s;
    ctx.font = `600 ${markTextSize}px ${QUOTE_FONTS.sans}`;
    ctx.fillStyle = withAlpha(colors.cream, 0.45);
    drawTracked(ctx, wordmark.toUpperCase(), centerX, H - pad * 0.72, markTextSize * 0.22);
  }
}
