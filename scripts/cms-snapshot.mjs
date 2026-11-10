/**
 * Pre-build step: pull published Studio content from Firestore into
 * src/content/cms/snapshot.generated.json (see src/content/cms/snapshot.ts).
 *
 * Reads only the public `published/*` documents over Firestore's REST API —
 * no credentials, no SDK. Outcomes:
 *
 *   - VITE_FIREBASE_PROJECT_ID unset    → no snapshot; bundled content ships.
 *   - nothing published yet (404)       → no snapshot; bundled content ships.
 *   - any other failure or bad data     → exit 1. On Netlify a failed build
 *                                         leaves the previous deploy live,
 *                                         which beats shipping a site with
 *                                         its articles missing.
 *
 * `--soft` (used by `npm run dev`) downgrades failures to a warning and keeps
 * whatever snapshot is already on disk, so working offline still works.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { generatedSnapshot } from './cms-paths.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = generatedSnapshot(root);
const soft = process.argv.includes('--soft');
const mode = soft ? 'development' : 'production';
const env = { ...loadEnv(mode, root, ''), ...process.env };
const projectId = env.VITE_FIREBASE_PROJECT_ID;

const log = (msg) => console.log(`cms-snapshot: ${msg}`);

class NotPublished extends Error {}

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (res.status === 404) throw new NotPublished();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}\n${await res.text()}`);
  return res.json();
}

async function listJson(base, path) {
  const items = [];
  let pageToken = '';
  do {
    const page = await get(`${base}/${path}?pageSize=300${pageToken ? `&pageToken=${pageToken}` : ''}`);
    for (const d of page.documents ?? []) {
      const json = d.fields?.json?.stringValue;
      if (typeof json !== 'string') throw new Error(`${d.name} has no "json" string field`);
      items.push(JSON.parse(json));
    }
    pageToken = page.nextPageToken ?? '';
  } while (pageToken);
  return items;
}

function check(articles, quotes) {
  const problems = [];
  for (const a of articles) {
    for (const key of ['slug', 'title', 'dek', 'author', 'publishedOn', 'category']) {
      if (typeof a?.[key] !== 'string' || a[key] === '') problems.push(`article ${a?.slug ?? '?'}: missing ${key}`);
    }
    if (!Array.isArray(a?.sections)) problems.push(`article ${a?.slug ?? '?'}: sections is not a list`);
    if (a?.slug === 'quotes') problems.push('article slug "quotes" is reserved');
  }
  for (const q of quotes) {
    if (typeof q?.number !== 'number') problems.push(`quote: missing number`);
    if (!Array.isArray(q?.beats) || q.beats.length === 0) problems.push(`quote ${q?.number ?? '?'}: no beats`);
  }
  const slugs = articles.map((a) => a.slug);
  for (const s of new Set(slugs)) if (slugs.filter((x) => x === s).length > 1) problems.push(`duplicate slug ${s}`);
  if (problems.length) throw new Error(`published content failed checks:\n  ${problems.join('\n  ')}`);
}

async function main() {
  if (!projectId) {
    await rm(out, { force: true });
    log('VITE_FIREBASE_PROJECT_ID not set — using bundled content');
    return;
  }

  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  try {
    const meta = await get(`${base}/published/site`);
    const managed = (meta.fields?.managed?.arrayValue?.values ?? []).map((v) => v.stringValue).filter(Boolean);
    const articles = managed.includes('articles') ? await listJson(base, 'published/site/articles') : [];
    const quotes = managed.includes('quotes') ? await listJson(base, 'published/site/quotes') : [];
    check(articles, quotes);

    await mkdir(dirname(out), { recursive: true });
    await writeFile(
      out,
      JSON.stringify({ managed, articles, quotes, projectId, fetchedAt: new Date().toISOString() }, null, 2),
    );
    log(`${projectId}: ${articles.length} article(s), ${quotes.length} quote(s); managing [${managed.join(', ')}]`);
  } catch (err) {
    if (err instanceof NotPublished) {
      await rm(out, { force: true });
      log(`${projectId}: nothing published yet — using bundled content`);
      return;
    }
    if (soft) {
      console.warn(`cms-snapshot: WARNING — could not refresh (${err.message}); keeping the snapshot on disk, if any`);
      return;
    }
    console.error(`cms-snapshot: FAILED — ${err.message}`);
    process.exit(1);
  }
}

await main();
