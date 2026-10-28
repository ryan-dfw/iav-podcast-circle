/**
 * Post-build step: static preview images and per-route HTML.
 *
 * The site is a single-page app, so every URL would otherwise serve the same
 * index.html — and link scrapers (LinkedIn, Slack, iMessage, Facebook, X)
 * don't run JavaScript, so the tags `usePageMeta` sets at runtime never reach
 * them. Here we write a real HTML file per shareable route with its tags baked
 * in; Netlify serves a static file in preference to the SPA catch-all, so those
 * win automatically and client-side navigation is untouched.
 *
 * Quote images are painted with the same code the share button uses
 * (src/lib/quoteImageCore.ts), running under @napi-rs/canvas.
 *
 * No server or serverless function involved: this is build output.
 */
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/* -- Content ---------------------------------------------------------- */

/** Bundles the TypeScript content layer to a temp module this script can import. */
async function loadContent() {
  const outfile = join(tmpdir(), `iav-content-${Date.now()}.mjs`);
  await build({
    stdin: {
      contents: `
        export { getQuotes, getArticles, getEpisodes, articlePath, episodePath } from './src/content/index.ts';
        export { site } from './src/config/site.ts';
        export { paintQuote, QUOTE_IMAGE_PRESETS, QUOTE_FONTS, withAlpha } from './src/lib/quoteImageCore.ts';
      `,
      resolveDir: root,
      sourcefile: 'prerender-entry.ts',
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    alias: { '@': join(root, 'src') },
    outfile,
    logLevel: 'warning',
  });
  const loaded = await import(pathToFileURL(outfile).href);
  await rm(outfile, { force: true });
  return loaded;
}

/** Reads the brand palette straight from the design tokens — one source of truth. */
async function loadPalette() {
  const css = await readFile(join(root, 'src/styles/tokens.css'), 'utf8');
  const read = (name, fallback) => new RegExp(`--${name}:\\s*([^;]+);`).exec(css)?.[1].trim() ?? fallback;
  return {
    navy: read('navy', '#0a1a2f'),
    cream: read('cream', '#f7f4ef'),
    blush: read('blush', '#f4c9d8'),
    lavender: read('lavender', '#c7b7d9'),
    mauve: read('rose-mauve', '#d9a6b8'),
    grayBlue: read('gray-blue', '#8fa6c9'),
  };
}

/** Canvas has no document to pull webfonts from, so register them by file. */
function registerFonts() {
  const faces = [
    ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', 'Cormorant Garamond'],
    ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2', 'Cormorant Garamond'],
    ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2', 'Cormorant Garamond'],
    ['@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', 'Cormorant Garamond'],
    ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'Inter Variable'],
    ['@fontsource/caveat/files/caveat-latin-600-normal.woff2', 'Caveat'],
  ];
  for (const [file, family] of faces) {
    const path = join(root, 'node_modules', file);
    if (!GlobalFonts.registerFromPath(path, family)) {
      throw new Error(`Could not register font: ${file}`);
    }
  }
}

/* -- Meta tags -------------------------------------------------------- */

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Replaces the shell's generic tags with this route's. Mirrors what
 * `usePageMeta` does at runtime, so a crawler and a browser agree.
 */
function withMeta(shell, { title, description, url, image, type = 'article' }) {
  const stripped = shell
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace(/\s*<meta\s+property="og:title"[^>]*\/>/, '')
    .replace(/\s*<meta\s+property="og:description"[^>]*\/>/, '')
    .replace(/\s*<meta\s+property="og:type"[^>]*\/>/, '');

  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    ...(image
      ? [
          `<meta property="og:image" content="${escapeAttr(image.url)}" />`,
          ...(image.width ? [`<meta property="og:image:width" content="${image.width}" />`] : []),
          ...(image.height ? [`<meta property="og:image:height" content="${image.height}" />`] : []),
          `<meta name="twitter:card" content="summary_large_image" />`,
          `<meta name="twitter:image" content="${escapeAttr(image.url)}" />`,
        ]
      : [`<meta name="twitter:card" content="summary" />`]),
  ]
    .map((tag) => `    ${tag}`)
    .join('\n');

  return stripped.replace(/\s*<\/head>/, `\n${tags}\n  </head>`);
}

/** Writes `<route>/index.html`, which Netlify serves ahead of the SPA fallback. */
async function writeRoute(route, html) {
  const dir = join(dist, route.replace(/^\//, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'index.html'), html, 'utf8');
}

/* -- Social cards from existing artwork ------------------------------- */

/** Link previews are cropped to roughly 1.91:1, and WebP is unevenly supported. */
const SOCIAL_CARD = { width: 1200, height: 630 };

/**
 * Re-crops a portrait hero into a landscape JPEG card. Without this an article
 * unfurls as a sliver of a tall image, in a format some scrapers won't fetch.
 */
async function socialCardFrom(image, name, distDir, overlay) {
  try {
    const source = await loadImage(join(root, 'public', image.src.replace(/^\//, '')));
    const { width, height } = SOCIAL_CARD;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    // Cover-crop, anchored near the top so faces survive the crop.
    const scale = Math.max(width / source.width, height / source.height);
    const drawW = source.width * scale;
    const drawH = source.height * scale;
    ctx.drawImage(source, (width - drawW) / 2, Math.min(0, (height - drawH) * 0.08), drawW, drawH);
    if (overlay) overlay(ctx, width, height);
    const file = `og/${name}.jpg`;
    await writeFile(join(distDir, file), canvas.toBuffer('image/jpeg'));
    return { file, width, height };
  } catch (error) {
    console.warn(`prerender: could not build a social card for ${image.src} — ${error.message}`);
    return undefined;
  }
}

/** Wraps `text` to `maxWidth` at the context's current font. */
function wrap(ctx, text, maxWidth) {
  const lines = [];
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

/**
 * Episode banner art leaves a blank panel for the title, which lives in HTML on
 * the page and so is missing from the image. Draw it back in, over a soft cream
 * scrim so it stays legible whatever a future episode's artwork looks like.
 */
function episodeOverlay(episode, palette) {
  return (ctx, width, height) => {
    const panel = width * 0.62;
    const scrim = ctx.createLinearGradient(0, 0, panel, 0);
    scrim.addColorStop(0, withAlphaHex(palette.cream, 0.92));
    scrim.addColorStop(0.72, withAlphaHex(palette.cream, 0.8));
    scrim.addColorStop(1, withAlphaHex(palette.cream, 0));
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, panel, height);

    const x = width * 0.06;
    const maxW = panel - x - width * 0.06;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.font = `600 ${Math.round(height * 0.038)}px ${QUOTE_FONTS.sans}`;
    ctx.fillStyle = palette.grayBlue;
    ctx.fillText(`EPISODE ${String(episode.number).padStart(2, '0')}`, x, height * 0.2);

    ctx.font = `500 ${Math.round(height * 0.115)}px ${QUOTE_FONTS.serif}`;
    ctx.fillStyle = palette.navy;
    let y = height * 0.28;
    for (const line of wrap(ctx, episode.title, maxW).slice(0, 2)) {
      ctx.fillText(line, x, y);
      y += height * 0.12;
    }

    ctx.font = `italic 400 ${Math.round(height * 0.052)}px ${QUOTE_FONTS.serif}`;
    ctx.fillStyle = palette.mauve;
    ctx.fillText(episode.series, x, y + height * 0.02);
  };
}

/* -- Main ------------------------------------------------------------- */

const {
  getQuotes,
  getArticles,
  getEpisodes,
  articlePath,
  episodePath,
  site,
  paintQuote,
  QUOTE_IMAGE_PRESETS,
  QUOTE_FONTS,
  withAlpha: withAlphaHex,
} = await loadContent();

const palette = await loadPalette();
registerFonts();

const shell = await readFile(join(dist, 'index.html'), 'utf8');
const absolute = (path) => new URL(path, site.url).href;
const pageTitle = (title) => `${title} · ${site.name}`;

let images = 0;
let routes = 0;

// Quote images, painted by the same code as the share button.
const { width, height } = QUOTE_IMAGE_PRESETS.square;
await mkdir(join(dist, 'og'), { recursive: true });

// One image for the newest quote: quotes live on the articles page and the
// quotes index rather than at URLs of their own, so that is what unfurls.
// The quotes index borrows the newest quote's image.
const [newest] = getQuotes();
if (newest) {
  const canvas = createCanvas(width, height);
  paintQuote(canvas.getContext('2d'), newest, { palette, preset: 'square' });
  await writeFile(join(dist, `og/quote-${newest.number}.png`), canvas.toBuffer('image/png'));
  images += 1;

  await writeRoute(
    '/articles/quotes',
    withMeta(shell, {
      title: pageTitle('Quotes'),
      description: 'Short quotes from Isha Vazquez, published as a series.',
      url: absolute('/articles/quotes'),
      image: { url: absolute(`/og/quote-${newest.number}.png`), width, height },
      type: 'website',
    }),
  );
  routes += 1;
}

for (const article of getArticles()) {
  const card = article.heroImage ? await socialCardFrom(article.heroImage, `article-${article.slug}`, dist) : undefined;
  if (card) images += 1;
  await writeRoute(
    articlePath(article),
    withMeta(shell, {
      title: pageTitle(article.title),
      description: article.dek,
      url: absolute(articlePath(article)),
      image: card ? { url: absolute(`/${card.file}`), width: card.width, height: card.height } : undefined,
    }),
  );
  routes += 1;
}

for (const episode of getEpisodes()) {
  const card = episode.heroImage
    ? await socialCardFrom(episode.heroImage, `episode-${episode.slug}`, dist, episodeOverlay(episode, palette))
    : undefined;
  if (card) images += 1;
  await writeRoute(
    episodePath(episode),
    withMeta(shell, {
      title: pageTitle(`Episode ${episode.number}: ${episode.title}`),
      description: episode.summary,
      url: absolute(episodePath(episode)),
      image: card ? { url: absolute(`/${card.file}`), width: card.width, height: card.height } : undefined,
    }),
  );
  routes += 1;
}

console.log(`prerender: ${images} image(s), ${routes} route(s) with baked-in meta tags`);
