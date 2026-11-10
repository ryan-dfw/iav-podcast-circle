/**
 * Studio's Firestore layout.
 *
 *   articles/{slug}                  ArticleRecord — draft + last published version
 *   quotes/{number}                  QuoteRecord   — same idea for quotes
 *   published/site                   { managed, updatedAt, updatedBy }
 *   published/site/articles/{slug}   { json }      — exactly what the build reads
 *   published/site/quotes/{number}   { json }
 *
 * `published/**` is public (see firestore.rules) and is only ever written in
 * the same batch as the record it mirrors, so the two can't drift apart.
 * Published copies are stored as JSON strings so they round-trip through
 * Firestore's REST API into the build byte-for-byte.
 */
import { collection, doc, getDoc, getDocs, serverTimestamp, writeBatch, type Timestamp } from 'firebase/firestore';
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

export async function loadArticles(): Promise<ArticleRecord[]> {
  const snap = await getDocs(collection(firebase().db, 'articles'));
  return snap.docs
    .map((d) => d.data() as ArticleRecord)
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0));
}

export async function loadQuotes(): Promise<QuoteRecord[]> {
  const snap = await getDocs(collection(firebase().db, 'quotes'));
  return snap.docs.map((d) => d.data() as QuoteRecord).sort((a, b) => b.number - a.number);
}

export async function loadPublishedMeta(): Promise<PublishedMeta | null> {
  const snap = await getDoc(doc(firebase().db, 'published', 'site'));
  return snap.exists() ? (snap.data() as PublishedMeta) : null;
}

/**
 * One-time move from the bundled TypeScript files into Firestore: every
 * bundled article and quote becomes a published record, unchanged, and the
 * site starts building from Firestore on its next build. Refuses to run once
 * `published/site` exists, so it can't overwrite edits made since.
 */
export async function importBundled(email: string): Promise<{ articles: number; quotes: number }> {
  if (await loadPublishedMeta()) throw new Error('Content has already been imported for this project.');

  const { db } = firebase();
  const batch = writeBatch(db);
  const stamp = { updatedAt: serverTimestamp(), updatedBy: email, publishedAt: serverTimestamp() };

  for (const article of bundledArticles) {
    batch.set(doc(db, 'articles', article.slug), {
      slug: article.slug,
      status: 'published',
      draft: article,
      published: article,
      ...stamp,
    });
    batch.set(doc(db, 'published', 'site', 'articles', article.slug), { json: JSON.stringify(article) });
  }

  for (const quote of bundledQuotes) {
    const id = String(quote.number);
    batch.set(doc(db, 'quotes', id), { number: quote.number, status: 'published', draft: quote, published: quote, ...stamp });
    batch.set(doc(db, 'published', 'site', 'quotes', id), { json: JSON.stringify(quote) });
  }

  const managed: ManagedCollection[] = ['articles', 'quotes'];
  batch.set(doc(db, 'published', 'site'), { managed, updatedAt: serverTimestamp(), updatedBy: email });

  await batch.commit();
  return { articles: bundledArticles.length, quotes: bundledQuotes.length };
}
