/**
 * Content published from /studio, as baked into this build.
 *
 * `scripts/cms-snapshot.mjs` runs before every dev server and build, reads the
 * public `published/*` documents from Firestore and writes
 * `snapshot.generated.json` (gitignored). The `@cms/snapshot` alias resolves to
 * that file when it exists and to `snapshot.empty.json` otherwise, so a fresh
 * clone, an unconfigured deploy, or a project nothing has been published from
 * yet all render the bundled content under `src/content/` exactly as before.
 *
 * A collection listed in `managed` replaces its bundled counterpart outright —
 * even when empty — so unpublishing an article that was imported from the
 * bundled files really removes it instead of falling back to the old copy.
 */
import raw from '@cms/snapshot';
import type { Article, Quote } from '../types';

export type ManagedCollection = 'articles' | 'quotes';

export interface CmsSnapshot {
  managed: ManagedCollection[];
  articles: Article[];
  quotes: Quote[];
  projectId?: string;
  fetchedAt?: string;
}

const data = raw as Partial<CmsSnapshot>;

export const cms: CmsSnapshot = {
  managed: Array.isArray(data.managed) ? data.managed : [],
  articles: Array.isArray(data.articles) ? data.articles : [],
  quotes: Array.isArray(data.quotes) ? data.quotes : [],
  projectId: data.projectId,
  fetchedAt: data.fetchedAt,
};

export const isManaged = (collection: ManagedCollection) => cms.managed.includes(collection);
