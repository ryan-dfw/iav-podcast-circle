/**
 * Studio's Firestore layout.
 *
 *   articles/{slug}                    ArticleRecord — working draft + live version
 *   articles/{slug}/revisions/{auto}   every version that was published, newest last
 *   quotes/{number}                    QuoteRecord, same idea
 *   quotes/{number}/revisions/{auto}
 *   published/site                     { managed, updatedAt, updatedBy }
 *   published/site/articles/{slug}     { json } — exactly what the build reads
 *   published/site/quotes/{number}     { json }
 *
 * `published/**` is public (see firestore.rules) and only ever written in the
 * same batch as the record it mirrors, so the two can't drift apart. Published
 * copies are JSON strings so they reach the build byte-for-byte.
 */
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import type { Article, Quote } from '@/content/types';
import type { ManagedCollection } from '@/content/cms/snapshot';
import { articles as bundledArticles } from '@/content/articles';
import { quotes as bundledQuotes } from '@/content/quotes';
import { firebase } from './firebase';

export type Status = 'draft' | 'published';

interface RecordBase<T> {
  status: Status;
  draft: T;
  published: T | null;
  updatedAt?: Timestamp;
  updatedBy?: string;
  publishedAt?: Timestamp | null;
}

export interface ArticleRecord extends RecordBase<Article> {
  slug: string;
}

export interface QuoteRecord extends RecordBase<Quote> {
  number: number;
}

export interface PublishedMeta {
  managed: ManagedCollection[];
  updatedAt?: Timestamp;
  updatedBy?: string;
}

export { bundledArticles, bundledQuotes };

export const hasUnpublishedEdits = (r: { status: Status; draft: unknown; published: unknown }) =>
  r.status === 'published' && JSON.stringify(r.draft) !== JSON.stringify(r.published);

const db = () => firebase().db;

/* Reading ------------------------------------------------------------ */

export async function loadArticles(): Promise<ArticleRecord[]> {
  const snap = await getDocs(collection(db(), 'articles'));
  return snap.docs
    .map((d) => d.data() as ArticleRecord)
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0));
}

export async function loadArticle(slug: string): Promise<ArticleRecord | null> {
  const snap = await getDoc(doc(db(), 'articles', slug));
  return snap.exists() ? (snap.data() as ArticleRecord) : null;
}

export async function loadQuotes(): Promise<QuoteRecord[]> {
  const snap = await getDocs(collection(db(), 'quotes'));
  return snap.docs.map((d) => d.data() as QuoteRecord).sort((a, b) => b.number - a.number);
}

export async function loadQuote(number: number): Promise<QuoteRecord | null> {
  const snap = await getDoc(doc(db(), 'quotes', String(number)));
  return snap.exists() ? (snap.data() as QuoteRecord) : null;
}

export async function loadPublishedMeta(): Promise<PublishedMeta | null> {
  const snap = await getDoc(doc(db(), 'published', 'site'));
  return snap.exists() ? (snap.data() as PublishedMeta) : null;
}

/* Articles ----------------------------------------------------------- */

/**
 * Saves the working draft. `previousSlug` is the slug the record is stored
 * under now (undefined for a new article); an unpublished article may change
 * its web address, which moves the record. A published one may not — its URL
 * is already out in the world.
 */
export async function saveArticleDraft(draft: Article, email: string, previousSlug?: string): Promise<void> {
  const ref = doc(db(), 'articles', draft.slug);
  const stamp = { updatedAt: serverTimestamp(), updatedBy: email };

  await runTransaction(db(), async (tx) => {
    if (previousSlug === draft.slug) {
      const current = await tx.get(ref);
      if (!current.exists()) throw new Error('This article no longer exists. It may have been deleted in another window.');
      tx.update(ref, { draft, ...stamp });
      return;
    }

    const taken = await tx.get(ref);
    if (taken.exists()) throw new Error(`Another article already uses the web address /articles/${draft.slug}.`);

    if (previousSlug) {
      const oldRef = doc(db(), 'articles', previousSlug);
      const old = await tx.get(oldRef);
      if (old.exists() && (old.data() as ArticleRecord).published) {
        throw new Error('A published article’s web address can’t change.');
      }
      tx.delete(oldRef);
    }
    tx.set(ref, { slug: draft.slug, status: 'draft', draft, published: null, publishedAt: null, ...stamp });
  });
}

/** Makes the saved draft live: record, public copy and revision in one batch. */
export async function publishArticle(slug: string, email: string): Promise<void> {
  await requireSetUp();
  const record = await loadArticle(slug);
  if (!record) throw new Error('Save the article before publishing it.');

  const batch = writeBatch(db());
  batch.update(doc(db(), 'articles', slug), {
    status: 'published',
    published: record.draft,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  batch.set(doc(db(), 'published', 'site', 'articles', slug), { json: JSON.stringify(record.draft) });
  batch.set(doc(collection(db(), 'articles', slug, 'revisions')), {
    article: record.draft,
    publishedAt: serverTimestamp(),
    publishedBy: email,
  });
  touchSite(batch, email, 'articles');
  await batch.commit();
}

/** Takes an article off the site; the draft stays in Studio. */
export async function unpublishArticle(slug: string, email: string): Promise<void> {
  const batch = writeBatch(db());
  batch.update(doc(db(), 'articles', slug), {
    status: 'draft',
    published: null,
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  batch.delete(doc(db(), 'published', 'site', 'articles', slug));
  touchSite(batch, email, 'articles');
  await batch.commit();
}

/** Deletes an article that has never been live (published ones must be unpublished first). */
export async function deleteArticle(slug: string): Promise<void> {
  const record = await loadArticle(slug);
  if (record?.published) throw new Error('Unpublish the article before deleting it.');
  await deleteDoc(doc(db(), 'articles', slug));
}

/* Quotes ------------------------------------------------------------- */

export async function saveQuoteDraft(draft: Quote, email: string, isNew: boolean): Promise<void> {
  const ref = doc(db(), 'quotes', String(draft.number));
  const stamp = { updatedAt: serverTimestamp(), updatedBy: email };
  await runTransaction(db(), async (tx) => {
    const current = await tx.get(ref);
    if (isNew) {
      if (current.exists()) throw new Error(`Quote No. ${draft.number} already exists.`);
      tx.set(ref, { number: draft.number, status: 'draft', draft, published: null, publishedAt: null, ...stamp });
    } else {
      if (!current.exists()) throw new Error('This quote no longer exists. It may have been deleted in another window.');
      tx.update(ref, { draft, ...stamp });
    }
  });
}

export async function publishQuote(number: number, email: string): Promise<void> {
  await requireSetUp();
  const record = await loadQuote(number);
  if (!record) throw new Error('Save the quote before publishing it.');
  const id = String(number);

  const batch = writeBatch(db());
  batch.update(doc(db(), 'quotes', id), {
    status: 'published',
    published: record.draft,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: email,
  });
  batch.set(doc(db(), 'published', 'site', 'quotes', id), { json: JSON.stringify(record.draft) });
  batch.set(doc(collection(db(), 'quotes', id, 'revisions')), {
    quote: record.draft,
    publishedAt: serverTimestamp(),
    publishedBy: email,
  });
  touchSite(batch, email, 'quotes');
  await batch.commit();
}

export async function unpublishQuote(number: number, email: string): Promise<void> {
  const id = String(number);
  const batch = writeBatch(db());
  batch.update(doc(db(), 'quotes', id), { status: 'draft', published: null, updatedAt: serverTimestamp(), updatedBy: email });
  batch.delete(doc(db(), 'published', 'site', 'quotes', id));
  touchSite(batch, email, 'quotes');
  await batch.commit();
}

export async function deleteQuote(number: number): Promise<void> {
  const record = await loadQuote(number);
  if (record?.published) throw new Error('Unpublish the quote before deleting it.');
  await deleteDoc(doc(db(), 'quotes', String(number)));
}

/* Site --------------------------------------------------------------- */

function touchSite(batch: ReturnType<typeof writeBatch>, email: string, collectionName: ManagedCollection) {
  batch.set(
    doc(db(), 'published', 'site'),
    { managed: arrayUnion(collectionName), updatedAt: serverTimestamp(), updatedBy: email },
    { merge: true },
  );
}

/**
 * Publishing before the one-time import would mark a collection as managed
 * while the bundled pieces aren't in Firestore yet — and the next build would
 * drop them from the site.
 */
async function requireSetUp() {
  if (!(await loadPublishedMeta())) throw new Error('Studio hasn’t been set up on this site yet. Ask Ryan to run the import.');
}

/**
 * One-time move from the bundled TypeScript files into Firestore: every
 * bundled article and quote becomes a published record, unchanged. Refuses to
 * run once `published/site` exists, so it can't overwrite edits made since.
 */
export async function importBundled(email: string): Promise<{ articles: number; quotes: number }> {
  if (await loadPublishedMeta()) throw new Error('Content has already been imported for this project.');

  const batch = writeBatch(db());
  const stamp = { updatedAt: serverTimestamp(), updatedBy: email, publishedAt: serverTimestamp() };

  for (const article of bundledArticles) {
    batch.set(doc(db(), 'articles', article.slug), {
      slug: article.slug,
      status: 'published',
      draft: article,
      published: article,
      ...stamp,
    });
    batch.set(doc(db(), 'published', 'site', 'articles', article.slug), { json: JSON.stringify(article) });
  }
  for (const quote of bundledQuotes) {
    const id = String(quote.number);
    batch.set(doc(db(), 'quotes', id), { number: quote.number, status: 'published', draft: quote, published: quote, ...stamp });
    batch.set(doc(db(), 'published', 'site', 'quotes', id), { json: JSON.stringify(quote) });
  }
  const managed: ManagedCollection[] = ['articles', 'quotes'];
  batch.set(doc(db(), 'published', 'site'), { managed, updatedAt: serverTimestamp(), updatedBy: email });

  await batch.commit();
  return { articles: bundledArticles.length, quotes: bundledQuotes.length };
}
